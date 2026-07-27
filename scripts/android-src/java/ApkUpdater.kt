package ir.superextension.marketprices

import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageInstaller
import android.os.Build
import java.io.File
import java.net.HttpURLConnection
import java.net.URL
import java.security.MessageDigest

object ApkUpdater {
    private const val APK_FILE_NAME = "market-prices-update.apk"
    private const val MAX_REDIRECTS = 8
    const val ACTION_INSTALL_STATUS = "ir.superextension.marketprices.APK_INSTALL_STATUS"

    fun localVersionCode(context: Context): Int {
        val info = context.packageManager.getPackageInfo(context.packageName, 0)
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            info.longVersionCode.toInt()
        } else {
            @Suppress("DEPRECATION")
            info.versionCode
        }
    }

    fun localVersionName(context: Context): String {
        return try {
            context.packageManager.getPackageInfo(context.packageName, 0).versionName ?: "—"
        } catch (_: Exception) {
            "—"
        }
    }

    fun apkCacheFile(context: Context): File = File(context.cacheDir, APK_FILE_NAME)

    fun download(
        context: Context,
        url: String,
        expectedSha256: String? = null,
        expectedSize: Long? = null,
        onProgress: (percent: Int, downloaded: Long, total: Long) -> Unit,
    ): File {
        val target = apkCacheFile(context)
        if (target.exists()) {
            target.delete()
        }

        val connection = openFollowingRedirects(url)
        try {
            val totalHeader = connection.contentLengthLong.coerceAtLeast(0L)
            val total = when {
                expectedSize != null && expectedSize > 0L -> expectedSize
                totalHeader > 0L -> totalHeader
                else -> 0L
            }
            var downloaded = 0L
            var lastReported = -1

            connection.inputStream.use { input ->
                target.outputStream().use { output ->
                    val buffer = ByteArray(64 * 1024)
                    while (true) {
                        val read = input.read(buffer)
                        if (read <= 0) break
                        output.write(buffer, 0, read)
                        downloaded += read
                        val percent = if (total > 0) {
                            ((downloaded * 100L) / total).toInt().coerceIn(0, 100)
                        } else {
                            0
                        }
                        if (percent != lastReported) {
                            lastReported = percent
                            onProgress(percent, downloaded, total)
                        }
                    }
                    output.flush()
                }
            }

            if (downloaded <= 0L) {
                target.delete()
                throw IllegalStateException("فایل APK خالی دریافت شد")
            }

            if (expectedSize != null && expectedSize > 0L && downloaded != expectedSize) {
                target.delete()
                throw IllegalStateException("حجم فایل APK ناقص دریافت شد")
            }

            if (!looksLikeApk(target)) {
                target.delete()
                throw IllegalStateException("فایل دریافتی APK معتبر نیست")
            }

            if (!expectedSha256.isNullOrBlank()) {
                val actual = sha256Hex(target)
                if (!actual.equals(expectedSha256, ignoreCase = true)) {
                    target.delete()
                    throw IllegalStateException("اعتبارسنجی فایل APK ناموفق بود")
                }
            }

            onProgress(100, downloaded, if (total > 0) total else downloaded)
            return target
        } catch (error: Exception) {
            if (target.exists()) {
                target.delete()
            }
            throw error
        } finally {
            connection.disconnect()
        }
    }

    fun startInstall(context: Context, apkFile: File) {
        if (!apkFile.exists() || apkFile.length() <= 0L) {
            throw IllegalStateException("فایل APK برای نصب پیدا نشد")
        }

        val installer = context.packageManager.packageInstaller
        val params = PackageInstaller.SessionParams(PackageInstaller.SessionParams.MODE_FULL_INSTALL)
        // Prefer silent self-update confirmation when Android allows it (API 31+).
        // The system still falls back to STATUS_PENDING_USER_ACTION when required.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            params.setRequireUserAction(PackageInstaller.SessionParams.USER_ACTION_NOT_REQUIRED)
        }
        params.setAppPackageName(context.packageName)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            params.setInstallerPackageName(context.packageName)
        }

        val sessionId = installer.createSession(params)
        val session = installer.openSession(sessionId)
        try {
            session.openWrite("package", 0, apkFile.length()).use { out ->
                apkFile.inputStream().use { input ->
                    input.copyTo(out, 64 * 1024)
                }
                session.fsync(out)
            }

            val callbackIntent = Intent(context, ApkInstallReceiver::class.java).apply {
                action = ACTION_INSTALL_STATUS
            }
            val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_MUTABLE
            } else {
                PendingIntent.FLAG_UPDATE_CURRENT
            }
            val pendingIntent = PendingIntent.getBroadcast(context, sessionId, callbackIntent, flags)
            session.commit(pendingIntent.intentSender)
        } catch (error: Exception) {
            try {
                session.abandon()
            } catch (_: Exception) {
            }
            throw error
        } finally {
            try {
                session.close()
            } catch (_: Exception) {
            }
        }
    }

    private fun looksLikeApk(file: File): Boolean {
        return try {
            file.inputStream().use { input ->
                val magic = ByteArray(2)
                val read = input.read(magic)
                read == 2 && magic[0] == 'P'.code.toByte() && magic[1] == 'K'.code.toByte()
            }
        } catch (_: Exception) {
            false
        }
    }

    private fun sha256Hex(file: File): String {
        val digest = MessageDigest.getInstance("SHA-256")
        file.inputStream().use { input ->
            val buffer = ByteArray(64 * 1024)
            while (true) {
                val read = input.read(buffer)
                if (read <= 0) break
                digest.update(buffer, 0, read)
            }
        }
        return digest.digest().joinToString("") { byte -> "%02x".format(byte) }
    }

    /**
     * Follow redirects manually and force Connection: close.
     * Android HttpURLConnection can truncate bodies when a keep-alive socket
     * is reused across the github.com → release-assets CDN hop.
     */
    private fun openFollowingRedirects(startUrl: String): HttpURLConnection {
        var currentUrl = cacheBustUrl(startUrl)
        var redirects = 0

        while (true) {
            val connection = URL(currentUrl).openConnection() as HttpURLConnection
            connection.instanceFollowRedirects = false
            connection.useCaches = false
            connection.defaultUseCaches = false
            connection.connectTimeout = 20_000
            connection.readTimeout = 120_000
            connection.requestMethod = "GET"
            connection.setRequestProperty("Accept", "*/*")
            connection.setRequestProperty("Connection", "close")
            connection.setRequestProperty("Cache-Control", "no-cache, no-store, must-revalidate")
            connection.setRequestProperty("Pragma", "no-cache")
            connection.setRequestProperty("User-Agent", "MarketPricesUpdater/1.0 (Android)")

            val code = connection.responseCode
            if (code in 300..399) {
                val location = connection.getHeaderField("Location")
                connection.disconnect()
                if (location.isNullOrBlank()) {
                    throw IllegalStateException("خطا در دریافت APK ($code)")
                }
                // Resolve relative Location against the current URL. Do not cache-bust
                // signed CDN URLs — extra query params can invalidate them.
                currentUrl = URL(URL(currentUrl), location).toExternalForm()
                redirects += 1
                if (redirects > MAX_REDIRECTS) {
                    throw IllegalStateException("خطا در دریافت APK (redirect)")
                }
                continue
            }

            if (code !in 200..299) {
                connection.disconnect()
                throw IllegalStateException("خطا در دریافت APK ($code)")
            }

            return connection
        }
    }

    private fun cacheBustUrl(url: String): String {
        val separator = if (url.contains("?")) "&" else "?"
        return "$url${separator}_=${System.currentTimeMillis()}"
    }
}
