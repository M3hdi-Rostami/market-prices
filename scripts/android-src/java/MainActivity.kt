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
import androidx.core.content.FileProvider
import org.json.JSONObject
import java.io.ByteArrayInputStream
import java.io.File
import java.io.IOException
import java.lang.ref.WeakReference
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.atomic.AtomicBoolean
class MainActivity : Activity() {
    private lateinit var webView: WebView
    @Volatile
    private var updateSheetOpen = false
    private var pendingInstallPermission = false
    private var pendingUpdateRepoOwner: String? = null
    private var pendingUpdateRepoName: String? = null
    private var pendingUpdateBranch: String? = null
    private val shareApkBusy = AtomicBoolean(false)
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
                if (shouldOpenExternally(url)) {
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

    private fun shouldOpenExternally(url: String): Boolean {
        val uri = Uri.parse(url)
        val scheme = uri.scheme?.lowercase().orEmpty()
        if (scheme != "https" && scheme != "http") return false
        val host = uri.host?.lowercase().orEmpty()
        return host == "t.me" ||
            host.endsWith(".t.me") ||
            host == "divar.ir" ||
            host.endsWith(".divar.ir")
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
            val owner = pendingUpdateRepoOwner
            val name = pendingUpdateRepoName
            val branch = pendingUpdateBranch
            pendingUpdateRepoOwner = null
            pendingUpdateRepoName = null
            pendingUpdateBranch = null

            if (!owner.isNullOrBlank() && !name.isNullOrBlank() && !branch.isNullOrBlank()) {
                notifyApkInstallProgress(
                    JSONObject().apply {
                        put("percent", 0)
                        put("done", 0)
                        put("total", 1)
                        put("label", "مجوز نصب فعال شد. ادامه بروزرسانی...")
                    },
                )
                // Continue the APK update automatically — user should not tap twice.
                beginAppUpdate(owner, name, branch)
            } else {
                notifyApkInstallComplete(
                    success = false,
                    message = "مجوز نصب فعال شد. دوباره «دریافت نسخه جدید» را بزنید.",
                    retryable = true,
                )
            }
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
        val bg = if (isLight) "#e8edf5" else "#111621"
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

    private fun beginAppUpdate(repoOwner: String, repoName: String, branch: String) {
        Thread {
            try {
                val check = MarketPricesUpdater.checkForUpdate(
                    this,
                    repoOwner,
                    repoName,
                    branch,
                )

                if (check.updateKind == "apk" && !canInstallPackages()) {
                    pendingUpdateRepoOwner = repoOwner
                    pendingUpdateRepoName = repoName
                    pendingUpdateBranch = branch
                    runOnUiThread { requestInstallPermission() }
                    val payload = JSONObject().apply {
                        put("success", false)
                        put("message", "برای بروزرسانی، یک‌بار اجازه نصب از این اپ را در تنظیمات اندروید فعال کنید. پس از بازگشت، نصب به‌صورت خودکار ادامه می‌یابد.")
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
                    this,
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
            beginAppUpdate(repoOwner, repoName, branch)
        }

        @JavascriptInterface
        fun httpGet(url: String): String {
            return try {
                BamaNetwork.fetchText(url)
            } catch (error: Exception) {
                httpErrorJson(error)
            }
        }

        /**
         * Non-blocking HTTP GET for WebView: runs on a background thread and
         * delivers the result via window.__onAndroidHttpGet(requestId, body).
         * Keeps the JS thread free so loading spinners can animate.
         */
        @JavascriptInterface
        fun httpGetAsync(url: String, requestId: String) {
            deliverHttpAsync(requestId) {
                BamaNetwork.fetchText(url)
            }
        }

        /**
         * Flexible HTTP for Karnameh auth/estimate: method + headers + optional body.
         * specJson: {"method":"GET|POST","url":"...","headers":{...},"body":"..."}
         */
        @JavascriptInterface
        fun httpRequestAsync(requestId: String, specJson: String) {
            deliverHttpAsync(requestId) {
                BamaNetwork.fetchRequest(specJson)
            }
        }

        private fun deliverHttpAsync(requestId: String, loader: () -> String) {
            Thread {
                val body = try {
                    loader()
                } catch (error: Exception) {
                    httpErrorJson(error)
                }
                // Base64 avoids evaluateJavascript breakage on large/Unicode JSON.
                val encoded = "b64:" + Base64.encodeToString(
                    body.toByteArray(Charsets.UTF_8),
                    Base64.NO_WRAP,
                )
                runOnUiThread {
                    val payload = JSONObject.quote(encoded)
                    val id = JSONObject.quote(requestId)
                    webView.evaluateJavascript(
                        "window.__onAndroidHttpGet && window.__onAndroidHttpGet($id, $payload);",
                        null,
                    )
                }
            }.start()
        }

        private fun httpErrorJson(error: Exception): String {
            val raw = error.message ?: "خطا در دریافت"
            val message = when {
                raw.contains("timeout", ignoreCase = true) ||
                    raw.contains("timed out", ignoreCase = true) ||
                    error is java.net.SocketTimeoutException ->
                    "اتصال به سرور زمان‌بر شد. لطفاً دوباره تلاش کنید"
                else -> raw
            }
            return JSONObject().apply {
                put("__error", true)
                put("message", message)
            }.toString()
        }

        @JavascriptInterface
        fun reloadApp() {
            runOnUiThread { loadMarketPrices() }
        }

        @JavascriptInterface
        fun openUrl(url: String) {
            runOnUiThread {
                try {
                    if (!shouldOpenExternally(url)) return@runOnUiThread
                    startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                } catch (_: Exception) {
                    // Ignore invalid / blocked URLs from the WebView bridge.
                }
            }
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

        @JavascriptInterface
        fun shareApk() {
            if (!shareApkBusy.compareAndSet(false, true)) {
                notifyShareApkResult(false, "در حال آماده‌سازی فایل نصب...")
                return
            }
            Thread {
                try {
                    val apkFile = prepareShareableApk()
                    runOnUiThread {
                        try {
                            shareApkFile(apkFile)
                            notifyShareApkResult(true, "فایل نصب آماده ارسال شد")
                        } catch (error: Exception) {
                            notifyShareApkResult(false, error.message ?: "اشتراک فایل نصب ممکن نشد")
                        } finally {
                            shareApkBusy.set(false)
                        }
                    }
                } catch (error: Exception) {
                    runOnUiThread {
                        notifyShareApkResult(false, error.message ?: "آماده‌سازی فایل نصب ممکن نشد")
                        shareApkBusy.set(false)
                    }
                }
            }.start()
        }
    }

    private fun notifyShareApkResult(success: Boolean, message: String) {
        val payload = JSONObject().apply {
            put("success", success)
            put("message", message)
        }.toString()
        webView.evaluateJavascript(
            "window.__onShareApkComplete && window.__onShareApkComplete($payload);",
            null,
        )
    }

    private fun prepareShareableApk(): File {
        val sourcePath = applicationInfo.sourceDir
            ?: throw IllegalStateException("مسیر فایل نصب پیدا نشد")
        val source = File(sourcePath)
        if (!source.exists() || source.length() <= 0L) {
            throw IllegalStateException("فایل نصب اپلیکیشن در دسترس نیست")
        }

        val shareDir = File(cacheDir, "share")
        if (!shareDir.exists() && !shareDir.mkdirs()) {
            throw IllegalStateException("ساخت پوشه موقت ممکن نشد")
        }

        val versionName = runCatching {
            packageManager.getPackageInfo(packageName, 0).versionName
        }.getOrNull().orEmpty().ifBlank { "app" }
        val safeVersion = versionName.replace(Regex("[^A-Za-z0-9._-]"), "_")
        val target = File(shareDir, "market-prices-$safeVersion.apk")

        source.inputStream().use { input ->
            target.outputStream().use { output ->
                input.copyTo(output)
                output.flush()
            }
        }

        if (!target.exists() || target.length() <= 0L) {
            throw IllegalStateException("کپی فایل نصب ناموفق بود")
        }
        return target
    }

    private fun shareApkFile(apkFile: File) {
        val uri = FileProvider.getUriForFile(
            this,
            "$packageName.fileprovider",
            apkFile,
        )
        val shareIntent = Intent(Intent.ACTION_SEND).apply {
            type = "application/vnd.android.package-archive"
            putExtra(Intent.EXTRA_STREAM, uri)
            putExtra(Intent.EXTRA_SUBJECT, "اپلیکیشن تصمیم")
            putExtra(
                Intent.EXTRA_TEXT,
                "فایل نصب اپلیکیشن تصمیم را دریافت کنید و نصب کنید.",
            )
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }
        startActivity(Intent.createChooser(shareIntent, "ارسال فایل نصب اپلیکیشن"))
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
            putExtra(Intent.EXTRA_SUBJECT, "تصمیم")
            putExtra(Intent.EXTRA_TEXT, "قیمت لحظه‌ای ارز، طلا، خودرو و مسکن")
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }
        startActivity(Intent.createChooser(shareIntent, "اشتراک‌گذاری تصویر قیمت"))
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
            val normalized = url.trim()
            val parsed = Uri.parse(normalized)
            if (parsed.scheme != "https") return false

            val host = parsed.host.orEmpty().lowercase()
            val path = parsed.path.orEmpty()

            if (host == "bama.ir" || host.endsWith(".bama.ir")) {
                return path.startsWith("/cad/api/")
            }

            // Divar listing API (+ any future divar CDN/API hosts used by the bridge)
            if (host == "divar.ir" || host == "api.divar.ir" || host.endsWith(".divar.ir")) {
                return true
            }

            return false
        }

        fun fetchText(url: String): String {
            return fetchRequest(
                JSONObject()
                    .put("method", "GET")
                    .put("url", url.trim())
                    .toString(),
            )
        }

        fun fetchRequest(specJson: String): String {
            val spec = JSONObject(specJson)
            val method = spec.optString("method", "GET").uppercase()
            val normalized = spec.optString("url", "").trim()
            if (!isAllowedUrl(normalized)) {
                val host = Uri.parse(normalized).host.orEmpty().ifBlank { "?" }
                val preview = if (normalized.length > 120) normalized.take(120) + "…" else normalized
                throw IllegalArgumentException("آدرس مجاز نیست [$host] $preview")
            }

            val extraHeaders = linkedMapOf<String, String>()
            val headersObj = spec.optJSONObject("headers")
            if (headersObj != null) {
                val keys = headersObj.keys()
                while (keys.hasNext()) {
                    val key = keys.next()
                    extraHeaders[key] = headersObj.optString(key, "")
                }
            }
            val requestBody = if (spec.isNull("body")) null else spec.optString("body", null)

            val connection = openConnection(normalized, method, extraHeaders, requestBody)
            try {
                val code = connection.responseCode
                val body = readBody(connection, code)
                if (code !in 200..299) {
                    // Return JSON body to JS (401/400 detail, is_paid, etc.) instead of throwing.
                    val trimmed = body.trimStart()
                    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
                        return try {
                            val parsed = JSONObject(body)
                            parsed.put("__error", true)
                            parsed.put("__httpStatus", code)
                            if (!parsed.has("message")) {
                                parsed.put(
                                    "message",
                                    parsed.optString("detail", parsed.optString("error", "HTTP $code")),
                                )
                            }
                            parsed.toString()
                        } catch (_: Exception) {
                            JSONObject().apply {
                                put("__error", true)
                                put("__httpStatus", code)
                                put("message", "HTTP $code")
                                put("raw", body)
                            }.toString()
                        }
                    }
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
                    val mime = if (
                        url.contains("api.divar.ir") ||
                        url.contains("/cad/api/")
                    ) {
                        "application/json"
                    } else {
                        "text/html"
                    }
                    WebResourceResponse(
                        mime,
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
                put("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
                put(
                    "Access-Control-Allow-Headers",
                    "Accept, Content-Type, Accept-Language, Authorization, Origin, Referer",
                )
            }
        }

        private fun openConnection(
            url: String,
            method: String = "GET",
            extraHeaders: Map<String, String> = emptyMap(),
            body: String? = null,
        ): HttpURLConnection {
            val host = Uri.parse(url).host.orEmpty().lowercase()
            val accept = "application/json"
            val referer = when {
                host == "divar.ir" || host == "api.divar.ir" || host.endsWith(".divar.ir") -> "https://divar.ir/"
                host == "bama.ir" || host.endsWith(".bama.ir") -> {
                    if (url.contains("/PriceCalculator/") || url.contains("/calculator")) {
                        "https://bama.ir/calculator"
                    } else {
                        "https://bama.ir/price"
                    }
                }
                else -> "https://bama.ir/price"
            }

            return (URL(url).openConnection() as HttpURLConnection).apply {
                requestMethod = method
                // Divar/Bama can be slow on mobile networks in Iran
                connectTimeout = 45_000
                readTimeout = 90_000
                instanceFollowRedirects = true
                doInput = true
                setRequestProperty("Accept", accept)
                setRequestProperty("User-Agent", USER_AGENT)
                setRequestProperty("Accept-Language", "fa-IR,fa;q=0.9,en-US;q=0.8,en;q=0.7")
                setRequestProperty("Referer", referer)
                if (host == "bama.ir" || host.endsWith(".bama.ir")) {
                    setRequestProperty("Origin", "https://bama.ir")
                }
                if (host == "divar.ir" || host == "api.divar.ir" || host.endsWith(".divar.ir")) {
                    setRequestProperty("Origin", "https://divar.ir")
                }
                for ((key, value) in extraHeaders) {
                    if (key.isNotBlank() && value.isNotBlank()) {
                        setRequestProperty(key, value)
                    }
                }
                if (body != null && method != "GET" && method != "HEAD") {
                    doOutput = true
                    if (extraHeaders.keys.none { it.equals("Content-Type", ignoreCase = true) }) {
                        setRequestProperty("Content-Type", "application/json; charset=utf-8")
                    }
                    outputStream.use { stream ->
                        stream.write(body.toByteArray(Charsets.UTF_8))
                        stream.flush()
                    }
                }
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
