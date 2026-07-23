package ir.superextension.marketprices

import android.annotation.SuppressLint
import android.app.Activity
import android.content.ContentValues
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.MediaStore
import android.provider.Settings
import android.util.Base64
import android.view.View
import android.view.WindowManager
import android.webkit.JavascriptInterface
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import org.json.JSONObject
import java.io.ByteArrayInputStream
import java.io.File
import java.io.IOException
import java.lang.ref.WeakReference
import java.net.HttpURLConnection
import java.net.URL

class MainActivity : Activity() {
    private lateinit var webView: WebView
    @Volatile
    private var updateSheetOpen = false
    private var pendingInstallPermission = false

    companion object {
        private var activityRef: WeakReference<MainActivity>? = null

        fun onApkInstallPendingUserAction() {
            activityRef?.get()?.notifyApkInstallProgress(
                JSONObject().apply {
                    put("percent", 100)
                    put("done", 1)
                    put("total", 1)
                    put("label", "در انتظار تأیید نصب...")
                },
            )
        }

        fun onApkInstallFinished(success: Boolean, message: String) {
            activityRef?.get()?.notifyApkInstallComplete(success, message)
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        activityRef = WeakReference(this)

        applySystemBars("dark")

        webView = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.allowFileAccess = true
            settings.allowFileAccessFromFileURLs = true
            settings.mediaPlaybackRequiresUserGesture = false
            settings.mixedContentMode = android.webkit.WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
            setBackgroundColor(Color.parseColor("#111621"))
            addJavascriptInterface(ThemeBridge(), "AndroidTheme")
            addJavascriptInterface(AppBridge(), "AndroidApp")
        }

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: return false
                if (url.startsWith("https://t.me/") || url.startsWith("http://t.me/")) {
                    startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                    return true
                }
                return false
            }

            override fun shouldInterceptRequest(
                view: WebView?,
                request: WebResourceRequest?,
            ): WebResourceResponse? {
                val url = request?.url?.toString() ?: return null
                if (!BamaNetwork.isAllowedUrl(url)) {
                    return null
                }

                if (request.method == "OPTIONS") {
                    return BamaNetwork.createPreflightResponse()
                }

                if (request.method != "GET") {
                    return null
                }

                return BamaNetwork.createWebResourceResponse(url)
            }
        }

        loadMarketPrices()
        setContentView(webView)
    }

    private fun loadMarketPrices() {
        MarketPricesUpdater.clearUpdatedContentIfApkUpgraded(this)
        val updatedHtml = File(MarketPricesUpdater.updateDir(this), "market-prices.html")

        if (updatedHtml.exists()) {
            webView.loadUrl("file://${updatedHtml.absolutePath}")
            return
        }

        val html = assets.open("market-prices.html").bufferedReader().use { it.readText() }
        webView.loadDataWithBaseURL("file:///android_asset/", html, "text/html", "UTF-8", null)
    }

    override fun onResume() {
        super.onResume()
        activityRef = WeakReference(this)
        if (pendingInstallPermission && canInstallPackages()) {
            pendingInstallPermission = false
            notifyApkInstallComplete(
                success = false,
                message = "مجوز نصب فعال شد. دوباره «دریافت نسخه جدید» را بزنید.",
                retryable = true,
            )
        }
    }

    override fun onDestroy() {
        if (activityRef?.get() === this) {
            activityRef = null
        }
        super.onDestroy()
    }

    private fun applySystemBars(theme: String) {
        val isLight = theme == "light"
        val bg = if (isLight) "#f1f5f9" else "#111621"
        val color = Color.parseColor(bg)

        window.apply {
            clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS)
            addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS)
            statusBarColor = color
            navigationBarColor = color
        }

        var flags = window.decorView.systemUiVisibility
        flags = if (isLight) {
            flags or View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
        } else {
            flags and View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR.inv()
        }
        window.decorView.systemUiVisibility = flags

        if (::webView.isInitialized) {
            webView.setBackgroundColor(color)
        }
    }

    private fun canInstallPackages(): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            packageManager.canRequestPackageInstalls()
        } else {
            true
        }
    }

    private fun requestInstallPermission() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
        pendingInstallPermission = true
        val intent = Intent(
            Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
            Uri.parse("package:$packageName"),
        )
        startActivity(intent)
    }

    private fun notifyApkInstallProgress(payload: JSONObject) {
        if (!::webView.isInitialized) return
        runOnUiThread {
            webView.evaluateJavascript(
                "window.__onAppUpdateProgress && window.__onAppUpdateProgress(${payload});",
                null,
            )
        }
    }

    private fun notifyApkInstallComplete(
        success: Boolean,
        message: String,
        retryable: Boolean = !success,
    ) {
        if (!::webView.isInitialized) return
        val payload = JSONObject().apply {
            put("success", success)
            put("message", message)
            put("updateKind", "apk")
            put("reloaded", false)
            put("awaitingInstall", false)
            put("currentVersion", ApkUpdater.localVersionName(this@MainActivity))
            put("latestVersion", ApkUpdater.localVersionName(this@MainActivity))
            put("retryable", retryable)
        }
        runOnUiThread {
            webView.evaluateJavascript(
                "window.__onAppUpdateComplete && window.__onAppUpdateComplete($payload);",
                null,
            )
        }
    }

    private inner class ThemeBridge {
        @JavascriptInterface
        fun onThemeChanged(theme: String) {
            runOnUiThread { applySystemBars(theme) }
        }
    }

    private inner class AppBridge {
        @JavascriptInterface
        fun getContentVersion(): String {
            return ApkUpdater.localVersionName(this@MainActivity)
        }

        @JavascriptInterface
        fun getAppVersionCode(): Int {
            return ApkUpdater.localVersionCode(this@MainActivity)
        }

        @JavascriptInterface
        fun hasUpdatedContent(): Boolean {
            return MarketPricesUpdater.hasUpdatedContent(this@MainActivity)
        }

        @JavascriptInterface
        fun setUpdateSheetOpen(open: Boolean) {
            updateSheetOpen = open
        }

        @JavascriptInterface
        fun checkForAppUpdate(repoOwner: String, repoName: String, branch: String) {
            Thread {
                val payload = try {
                    val result = MarketPricesUpdater.checkForUpdate(
                        this@MainActivity,
                        repoOwner,
                        repoName,
                        branch,
                    )
                    JSONObject().apply {
                        put("success", true)
                        put("hasUpdate", result.hasUpdate)
                        put("updateKind", result.updateKind)
                        put("currentVersion", result.currentVersion)
                        put("latestVersion", result.latestVersion)
                    }
                } catch (error: Exception) {
                    JSONObject().apply {
                        put("success", false)
                        put("hasUpdate", false)
                        put("updateKind", "none")
                        put("message", error.message ?: "خطا در بررسی بروزرسانی")
                    }
                }

                runOnUiThread {
                    val jsPayload = payload.toString()
                    webView.evaluateJavascript(
                        "window.__onAppUpdateCheckComplete && window.__onAppUpdateCheckComplete($jsPayload);",
                        null,
                    )
                }
            }.start()
        }

        @JavascriptInterface
        fun startAppUpdate(repoOwner: String, repoName: String, branch: String) {
            Thread {
                try {
                    val check = MarketPricesUpdater.checkForUpdate(
                        this@MainActivity,
                        repoOwner,
                        repoName,
                        branch,
                    )

                    if (check.updateKind == "apk" && !canInstallPackages()) {
                        runOnUiThread { requestInstallPermission() }
                        val payload = JSONObject().apply {
                            put("success", false)
                            put("message", "لطفاً اجازه نصب از این منبع را فعال کنید و دوباره تلاش کنید.")
                            put("updateKind", "apk")
                            put("currentVersion", check.currentVersion)
                            put("latestVersion", check.latestVersion)
                            put("reloaded", false)
                            put("awaitingInstall", false)
                            put("needsInstallPermission", true)
                        }
                        runOnUiThread {
                            webView.evaluateJavascript(
                                "window.__onAppUpdateComplete && window.__onAppUpdateComplete($payload);",
                                null,
                            )
                        }
                        return@Thread
                    }

                    val result = MarketPricesUpdater.fetchAndApply(
                        this@MainActivity,
                        repoOwner,
                        repoName,
                        branch,
                    ) { percent, done, total, label ->
                        notifyApkInstallProgress(
                            JSONObject().apply {
                                put("percent", percent)
                                put("done", done)
                                put("total", total)
                                put("label", label)
                            },
                        )
                    }

                    val payload = JSONObject().apply {
                        put("success", result.success)
                        put("message", result.message)
                        put("currentVersion", result.currentVersion)
                        put("latestVersion", result.latestVersion)
                        put("updateKind", result.updateKind)
                        put("reloaded", result.reloaded)
                        put("awaitingInstall", result.awaitingInstall)
                    }

                    runOnUiThread {
                        val jsPayload = payload.toString()
                        webView.evaluateJavascript(
                            "window.__onAppUpdateComplete && window.__onAppUpdateComplete($jsPayload);",
                            null,
                        )
                        if (result.reloaded) {
                            webView.postDelayed({ loadMarketPrices() }, 650L)
                        }
                    }
                } catch (error: Exception) {
                    val payload = JSONObject().apply {
                        put("success", false)
                        put("message", error.message ?: "خطا در بروزرسانی")
                        put("currentVersion", ApkUpdater.localVersionName(this@MainActivity))
                        put("latestVersion", ApkUpdater.localVersionName(this@MainActivity))
                        put("updateKind", "apk")
                        put("reloaded", false)
                        put("awaitingInstall", false)
                    }
                    runOnUiThread {
                        webView.evaluateJavascript(
                            "window.__onAppUpdateComplete && window.__onAppUpdateComplete($payload);",
                            null,
                        )
                    }
                }
            }.start()
        }

        @JavascriptInterface
        fun httpGet(url: String): String {
            return try {
                BamaNetwork.fetchText(url)
            } catch (error: Exception) {
                JSONObject().apply {
                    put("__error", true)
                    put("message", error.message ?: "خطا در دریافت")
                }.toString()
            }
        }

        @JavascriptInterface
        fun reloadApp() {
            runOnUiThread { loadMarketPrices() }
        }

        @JavascriptInterface
        fun shareImage(base64Png: String, fileName: String) {
            runOnUiThread {
                try {
                    sharePngImage(base64Png, fileName.ifBlank { "market-prices.png" })
                } catch (error: Exception) {
                    webView.evaluateJavascript(
                        "window.__onShareCardError && window.__onShareCardError(${JSONObject.quote(error.message ?: "اشتراک ممکن نشد")});",
                        null,
                    )
                }
            }
        }
    }

    private fun sharePngImage(base64Png: String, fileName: String) {
        val clean = base64Png.substringAfter("base64,", base64Png)
        val bytes = Base64.decode(clean, Base64.DEFAULT)
        if (bytes.isEmpty()) {
            throw IllegalStateException("تصویر خالی است")
        }

        val resolver = contentResolver
        val values = ContentValues().apply {
            put(MediaStore.Images.Media.DISPLAY_NAME, fileName)
            put(MediaStore.Images.Media.MIME_TYPE, "image/png")
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                put(MediaStore.Images.Media.IS_PENDING, 1)
            }
        }

        val collection = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            MediaStore.Images.Media.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY)
        } else {
            MediaStore.Images.Media.EXTERNAL_CONTENT_URI
        }

        val uri = resolver.insert(collection, values)
            ?: throw IllegalStateException("ذخیره تصویر برای اشتراک ممکن نشد")

        resolver.openOutputStream(uri)?.use { output ->
            output.write(bytes)
            output.flush()
        } ?: throw IllegalStateException("نوشتن تصویر ممکن نشد")

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            values.clear()
            values.put(MediaStore.Images.Media.IS_PENDING, 0)
            resolver.update(uri, values, null, null)
        }

        val shareIntent = Intent(Intent.ACTION_SEND).apply {
            type = "image/png"
            putExtra(Intent.EXTRA_STREAM, uri)
            putExtra(Intent.EXTRA_SUBJECT, "قیمت طلا و دلار")
            putExtra(Intent.EXTRA_TEXT, "قیمت لحظه‌ای دلار و طلا")
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }
        startActivity(Intent.createChooser(shareIntent, "اشتراک کارت قیمت"))
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (updateSheetOpen) {
            return
        }
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            @Suppress("DEPRECATION")
            super.onBackPressed()
        }
    }

    private object BamaNetwork {
        private const val USER_AGENT =
            "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36"

        fun isAllowedUrl(url: String): Boolean {
            val parsed = Uri.parse(url)
            val host = parsed.host.orEmpty()
            return parsed.scheme == "https" &&
                (host == "bama.ir" || host.endsWith(".bama.ir")) &&
                parsed.path?.startsWith("/cad/api/") == true
        }

        fun fetchText(url: String): String {
            if (!isAllowedUrl(url)) {
                throw IllegalArgumentException("آدرس مجاز نیست")
            }

            val connection = openConnection(url)
            try {
                val code = connection.responseCode
                val body = readBody(connection, code)
                if (code !in 200..299) {
                    throw IOException("HTTP $code")
                }
                return body
            } finally {
                connection.disconnect()
            }
        }

        fun createPreflightResponse(): WebResourceResponse {
            val headers = corsHeaders()
            return WebResourceResponse(
                null,
                null,
                204,
                "No Content",
                headers,
                ByteArrayInputStream(ByteArray(0)),
            )
        }

        fun createWebResourceResponse(url: String): WebResourceResponse? {
            return try {
                val connection = openConnection(url)
                try {
                    val code = connection.responseCode
                    val body = readBody(connection, code).toByteArray(Charsets.UTF_8)
                    val headers = corsHeaders()
                    WebResourceResponse(
                        "application/json",
                        "UTF-8",
                        if (code in 200..299) 200 else code,
                        if (code in 200..299) "OK" else "Error",
                        headers,
                        ByteArrayInputStream(body),
                    )
                } finally {
                    connection.disconnect()
                }
            } catch (_: Exception) {
                null
            }
        }

        private fun corsHeaders(): HashMap<String, String> {
            return HashMap<String, String>().apply {
                put("Access-Control-Allow-Origin", "*")
                put("Access-Control-Allow-Methods", "GET, OPTIONS")
                put("Access-Control-Allow-Headers", "Accept, Content-Type")
            }
        }

        private fun openConnection(url: String): HttpURLConnection {
            return (URL(url).openConnection() as HttpURLConnection).apply {
                requestMethod = "GET"
                connectTimeout = 15_000
                readTimeout = 30_000
                instanceFollowRedirects = true
                setRequestProperty("Accept", "application/json")
                setRequestProperty("User-Agent", USER_AGENT)
                setRequestProperty("Referer", "https://bama.ir/price")
            }
        }

        private fun readBody(connection: HttpURLConnection, code: Int): String {
            val stream = if (code in 200..299) {
                connection.inputStream
            } else {
                connection.errorStream ?: connection.inputStream
            }
            return stream?.bufferedReader()?.use { it.readText() }.orEmpty()
        }
    }
}
