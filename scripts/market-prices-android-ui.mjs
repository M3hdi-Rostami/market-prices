export const androidPageBody = `<div class="app market-root">
    <header class="header market-header-compact">
      <div class="market-header-bar">
        <p id="currentDateTime" class="header-clock">—</p>
        <button type="button" id="sharePricesBtn" class="market-share-btn" aria-label="اشتراک کارت قیمت" title="اشتراک کارت قیمت">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 8l-4-4-4 4M12 4v12"/>
          </svg>
          <span>اشتراک</span>
        </button>
      </div>
    </header>

    <div id="prices-panel" class="market-prices-panel">
      <div id="loading" class="state state-loading hidden">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"/>
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75"/>
        </svg>
        <span>در حال دریافت قیمت‌ها...</span>
      </div>

      <div id="error" class="state state-error hidden">
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <p id="errorMsg">خطا در دریافت اطلاعات</p>
        <button id="retryBtn" type="button" class="btn-retry">تلاش مجدد</button>
      </div>

      <div id="view-currency" class="market-view">
        <div id="currencyList" class="grid hidden"></div>
      </div>

      <div id="view-gold" class="market-view hidden">
        <div id="goldList" class="grid hidden"></div>
      </div>
    </div>

    <div id="view-cars" class="market-view hidden">
      <div class="cars-search-wrap">
        <input id="carsSearch" type="search" inputmode="search" autocomplete="off" placeholder="جستجو برند یا مدل..." class="cars-search-input" />
      </div>

      <div id="carsLoading" class="state state-loading hidden">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"/>
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75"/>
        </svg>
        <span>در حال دریافت قیمت خودرو...</span>
      </div>

      <div id="carsError" class="state state-error hidden">
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <p id="carsErrorMsg">خطا در دریافت اطلاعات</p>
        <button id="carsRetryBtn" type="button" class="btn-retry">تلاش مجدد</button>
      </div>

      <div id="carsListWrap" class="cars-list-wrap hidden">
        <div id="carsList" class="cars-list"></div>
      </div>
    </div>

    <div id="view-more" class="market-view hidden">
      <div class="market-more-scroll">
        <section class="market-more-section">
          <h3 class="market-more-section-title">ظاهر</h3>
          <button type="button" id="themeToggleBtn" class="market-more-row">
            <span class="market-more-row-label">تم اپلیکیشن</span>
            <span id="themeToggleValue" class="market-more-row-value">تم تاریک</span>
          </button>
        </section>

        <section class="market-more-section">
          <h3 class="market-more-section-title">اعلان قیمت</h3>
          <label class="market-more-row market-more-toggle-row">
            <span class="market-more-row-label">هشدار تغییر قیمت</span>
            <input type="checkbox" id="alertsEnabled" class="market-more-switch" />
          </label>
          <div class="market-more-field">
            <label for="alertsThreshold" class="market-more-field-label">آستانه تغییر (٪)</label>
            <input id="alertsThreshold" type="number" min="0.1" max="50" step="0.1" inputmode="decimal" class="market-more-input" />
          </div>
          <p class="market-more-hint">وقتی دلار یا طلای ۱۸ عیار بیش از این درصد تغییر کند، اعلان نمایش داده می‌شود.</p>
        </section>

        <section class="market-more-section" id="appUpdateSection">
          <h3 class="market-more-section-title">درباره</h3>
          <div class="market-more-row market-more-row-static">
            <span class="market-more-row-label">نسخه اپلیکیشن</span>
            <span id="appContentVersion" class="market-more-row-value">—</span>
          </div>
        </section>

        <p class="market-more-copyright">
          طراحی و توسعه توسط
          <a href="https://t.me/m3hdi_v1" target="_blank" rel="noopener noreferrer" dir="ltr" class="accent">m3hdi_v1</a>
          |
          <span id="currentYear"></span> &copy;
        </p>
      </div>
    </div>

    <div id="priceToast" class="market-price-toast hidden" role="status" aria-live="polite"></div>

    <nav class="market-bottom-nav market-bottom-nav-quad" aria-label="منوی قیمت‌ها">
      <button type="button" class="market-nav-btn is-active" data-market-tab="currency">
        <svg class="market-nav-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span class="market-nav-label">ارز</span>
      </button>
      <button type="button" class="market-nav-btn" data-market-tab="gold">
        <svg class="market-nav-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
        </svg>
        <span class="market-nav-label">طلا</span>
      </button>
      <div class="market-nav-fab-wrap">
        <button type="button" id="marketNavRefresh" class="market-nav-fab" aria-label="بروزرسانی قیمت‌ها" title="بروزرسانی">
          <svg id="marketNavRefreshIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </button>
      </div>
      <button type="button" class="market-nav-btn" data-market-tab="cars">
        <svg class="market-nav-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M8 17h.01M16 17h.01M3 13l1.5-4.5A2 2 0 016.4 7h11.2a2 2 0 011.9 1.5L21 13m-18 0h18m-18 0v4a1 1 0 001 1h1a1 1 0 001-1v-1h12v1a1 1 0 001 1h1a1 1 0 001-1v-4"/>
        </svg>
        <span class="market-nav-label">خودرو</span>
      </button>
      <button type="button" class="market-nav-btn" data-market-tab="more">
        <svg class="market-nav-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"/>
        </svg>
        <span class="market-nav-label">بیشتر</span>
      </button>
    </nav>
  </div>

  <div id="updateSheetOverlay" class="update-sheet-overlay mandatory hidden" aria-hidden="true">
    <div id="updateSheetBackdrop" class="update-sheet-backdrop" aria-hidden="true"></div>
    <div id="updateSheet" class="update-sheet" role="dialog" aria-modal="true" aria-labelledby="updateSheetTitle">
      <div class="update-sheet-handle" aria-hidden="true"></div>
      <div class="update-sheet-content">
        <div class="update-sheet-icon-wrap" aria-hidden="true"><div class="update-sheet-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg></div></div>
        <h2 id="updateSheetTitle" class="update-sheet-title">نسخه جدید اپلیکیشن موجود است</h2>
        <p id="updateSheetMessage" class="update-sheet-message"></p>
        <div id="updateSheetProgress" class="update-sheet-progress hidden" aria-live="polite">
          <div class="update-sheet-progress-track">
            <span id="updateSheetProgressFill" class="update-sheet-progress-fill"></span>
          </div>
          <div class="update-sheet-progress-meta">
            <span id="updateSheetProgressLabel">در حال دریافت بروزرسانی...</span>
            <span id="updateSheetProgressPercent">۰٪</span>
          </div>
        </div>
        <div class="update-sheet-actions" id="updateSheetActions">
          <button type="button" id="updateSheetConfirmBtn" class="update-sheet-btn update-sheet-btn-primary">دریافت نسخه جدید</button>
        </div>
      </div>
    </div>
  </div>`;

export const androidExtraStyles = `
    .market-root {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
      height: 100%;
      padding-bottom: calc(88px + env(safe-area-inset-bottom, 0px));
    }

    .market-root > .header {
      flex-shrink: 0;
    }

    .market-header-compact {
      padding: 4px 0 8px;
    }

    .market-header-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
    }

    .market-header-compact .header-clock {
      flex: 1;
      width: auto;
      text-align: center;
      margin: 0;
    }

    .market-share-btn {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 7px 12px;
      border: 1px solid color-mix(in srgb, var(--accent) 35%, var(--border));
      border-radius: 999px;
      background: color-mix(in srgb, var(--accent) 12%, transparent);
      color: var(--accent);
      font-family: inherit;
      font-size: 12px;
      font-weight: 700;
      line-height: 1;
      cursor: pointer;
      transition: opacity 0.15s, transform 0.15s, background-color 0.15s;
    }

    .market-share-btn svg {
      width: 15px;
      height: 15px;
    }

    .market-share-btn:hover {
      background: color-mix(in srgb, var(--accent) 20%, transparent);
    }

    .market-share-btn:active {
      transform: scale(0.96);
    }

    .market-share-btn:disabled {
      opacity: 0.55;
      cursor: wait;
    }

    .market-root > .market-prices-panel,
    .market-root > .market-view {
      flex: 1;
      min-height: 0;
    }

    .market-root .grid {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      align-content: start;
      -webkit-overflow-scrolling: touch;
    }

    #view-more {
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .btn-refresh-icon {
      width: 36px;
      height: 36px;
      padding: 0;
      border-radius: 999px;
      justify-content: center;
    }

    .btn-refresh-icon svg {
      width: 16px;
      height: 16px;
    }

    .market-prices-panel {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .market-prices-panel.hidden {
      display: none !important;
    }

    .market-view {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .market-view.hidden {
      display: none !important;
    }

    .market-bottom-nav {
      position: fixed;
      left: 50%;
      bottom: calc(10px + env(safe-area-inset-bottom, 0px));
      transform: translateX(-50%);
      width: min(480px, calc(100% - 16px));
      z-index: 4000;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 0;
      padding: 10px 6px 8px;
      background: color-mix(in srgb, var(--surface) 94%, transparent);
      border: 1px solid var(--border-strong, var(--border));
      border-radius: 22px;
      box-shadow: 0 10px 36px rgba(0, 0, 0, .45);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    }

    .market-nav-btn {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      min-height: 44px;
      padding: 6px 2px 4px;
      border: none;
      border-radius: 14px;
      background: transparent;
      color: var(--muted);
      font-family: inherit;
      font-size: 10px;
      font-weight: 600;
      line-height: 1;
      cursor: pointer;
      transition: color 0.15s, transform 0.15s, background-color 0.15s;
    }

    .market-nav-btn:hover {
      color: var(--text);
      background: color-mix(in srgb, var(--surface-2) 70%, transparent);
    }

    .market-nav-btn.is-active {
      color: var(--accent);
      background: transparent;
    }

    .market-nav-btn:active {
      transform: scale(0.96);
    }

    .market-nav-svg {
      width: 22px;
      height: 22px;
      stroke: currentColor;
      fill: none;
    }

    .market-nav-label {
      font-size: 10px;
      font-weight: 600;
      line-height: 1;
      white-space: nowrap;
    }

    .market-nav-fab-wrap {
      flex: 0 0 auto;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      padding: 0 4px 2px;
    }

    .market-nav-fab {
      width: 56px;
      height: 56px;
      margin-top: -28px;
      border: none;
      border-radius: 50%;
      background: linear-gradient(145deg, var(--accent), color-mix(in srgb, var(--accent) 55%, #06b6d4));
      color: var(--accent-fg, #111621);
      box-shadow:
        0 8px 24px color-mix(in srgb, var(--accent) 42%, transparent),
        0 0 0 5px color-mix(in srgb, var(--bg) 70%, transparent);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    }

    .market-nav-fab:hover {
      transform: translateY(-2px) scale(1.03);
    }

    .market-nav-fab:active {
      transform: scale(0.96);
    }

    .market-nav-fab:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .market-nav-fab svg {
      width: 22px;
      height: 22px;
    }

    .market-nav-fab svg.spin {
      animation: spin 0.8s linear infinite;
    }

    .market-more-scroll {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-bottom: 8px;
      -webkit-overflow-scrolling: touch;
    }

    .market-more-copyright {
      margin: 4px 0 0;
      padding: 12px 4px 4px;
      text-align: center;
      font-size: 10px;
      color: var(--muted);
      font-weight: 500;
      line-height: 1.6;
    }

    .market-more-copyright .accent {
      color: var(--accent);
      font-weight: 700;
      margin: 0 4px;
      text-decoration: underline;
      text-underline-offset: 2px;
      text-decoration-thickness: 1px;
    }

    .price-hero-card {
      grid-column: 1 / -1;
      border-radius: 16px;
      border: 1px solid color-mix(in srgb, var(--accent) 35%, var(--border));
      background: linear-gradient(
        135deg,
        color-mix(in srgb, var(--accent) 14%, var(--surface)) 0%,
        var(--surface) 55%,
        color-mix(in srgb, var(--surface-2) 80%, var(--surface)) 100%
      );
      box-shadow: 0 8px 24px color-mix(in srgb, var(--accent) 12%, transparent);
      padding: 14px 16px;
    }

    .price-hero-card-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 10px;
    }

    .price-hero-card-title-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .price-hero-card-icon {
      font-size: 28px;
      line-height: 1;
    }

    .price-hero-card-title {
      margin: 0;
      font-size: 15px;
      font-weight: 700;
      color: var(--text);
    }

    .price-hero-card-subtitle {
      margin: 2px 0 0;
      font-size: 11px;
      color: var(--muted);
    }

    .price-hero-card-time {
      font-size: 10px;
      color: var(--muted-2);
      flex-shrink: 0;
    }

    .price-hero-card-value-row {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
    }

    .price-hero-card-value {
      font-size: 28px;
      font-weight: 800;
      line-height: 1.1;
      font-variant-numeric: tabular-nums;
      color: var(--text);
      letter-spacing: -0.02em;
    }

    .price-hero-card-change {
      font-size: 13px;
      font-weight: 700;
      padding: 6px 10px;
      border-radius: 999px;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    .price-hero-card-change.is-up {
      color: var(--accent);
      background: color-mix(in srgb, var(--accent) 16%, transparent);
    }

    .price-hero-card-change.is-down {
      color: var(--danger);
      background: color-mix(in srgb, var(--danger) 16%, transparent);
    }

    .price-hero-card-change.is-flat {
      color: var(--muted);
      background: var(--surface-2);
    }

    .market-more-section {
      border: 1px solid var(--border);
      border-radius: 14px;
      background: var(--surface);
      padding: 12px;
    }

    .market-more-section-title {
      margin: 0 0 10px;
      font-size: 12px;
      font-weight: 700;
      color: var(--muted);
    }

    .market-more-row {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 0;
      border: none;
      border-top: 1px solid var(--border);
      background: transparent;
      color: inherit;
      font-family: inherit;
      font-size: 13px;
      text-align: right;
      cursor: pointer;
    }

    .market-more-section > .market-more-row:first-of-type,
    .market-more-section > .market-more-toggle-row:first-of-type {
      border-top: none;
      padding-top: 0;
    }

    .market-more-row-static {
      cursor: default;
      padding-bottom: 0;
    }

    .market-more-row-label {
      color: var(--text);
      font-weight: 600;
    }

    .market-more-row-value {
      color: var(--muted);
      font-size: 12px;
      font-weight: 500;
    }

    .market-more-toggle-row {
      cursor: default;
    }

    .market-more-switch {
      width: 44px;
      height: 24px;
      accent-color: var(--accent);
      cursor: pointer;
    }

    .market-more-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding-top: 10px;
      border-top: 1px solid var(--border);
    }

    .market-more-field-label {
      font-size: 12px;
      color: var(--muted);
    }

    .market-more-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--border-strong);
      border-radius: 10px;
      background: var(--input-bg);
      color: var(--text);
      font-family: inherit;
      font-size: 14px;
      outline: none;
    }

    .market-more-input:focus {
      border-color: var(--accent);
    }

    .market-more-hint {
      margin: 8px 0 0;
      font-size: 11px;
      line-height: 1.5;
      color: var(--muted-2);
    }

    .market-price-toast {
      position: fixed;
      left: 50%;
      bottom: calc(96px + env(safe-area-inset-bottom, 0px));
      transform: translateX(-50%) translateY(12px);
      z-index: 5000;
      width: min(360px, calc(100% - 24px));
      padding: 12px 14px;
      border-radius: 12px;
      border: 1px solid var(--border-strong);
      background: color-mix(in srgb, var(--surface) 96%, transparent);
      color: var(--text);
      font-size: 12px;
      font-weight: 600;
      line-height: 1.5;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease, transform 0.25s ease;
    }

    .market-price-toast.is-visible {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    .cars-search-wrap {
      flex-shrink: 0;
    }

    .cars-search-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--border);
      border-radius: 10px;
      background: var(--surface);
      color: var(--text);
      font-family: inherit;
      font-size: 13px;
      outline: none;
    }

    .cars-search-input::placeholder {
      color: var(--muted-2);
    }

    .cars-search-input:focus {
      border-color: var(--accent);
    }

    .cars-list-wrap {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      padding-bottom: 4px;
    }

    .cars-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    @media (min-width: 580px) {
      .cars-list {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
      }
    }

    .car-price-card {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 12px;
      border: 1px solid var(--border);
      border-radius: 14px;
      background: linear-gradient(
        135deg,
        var(--surface) 0%,
        color-mix(in srgb, var(--surface-2) 55%, var(--surface)) 100%
      );
    }

    .car-price-card-header {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }

    .car-price-card-title {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      line-height: 1.35;
      color: var(--text);
    }

    .car-price-card-subtitle {
      margin: 0;
      font-size: 11px;
      line-height: 1.4;
      color: var(--muted);
    }

    .car-price-card-prices {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 6px;
    }

    .car-price-chip {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 2px;
      min-width: 0;
      padding: 8px;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: var(--bg);
    }

    .car-price-chip-market {
      border-color: color-mix(in srgb, var(--accent) 35%, var(--border));
      background: color-mix(in srgb, var(--accent) 8%, var(--bg));
    }

    .car-price-chip-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px;
      min-width: 0;
    }

    .car-price-chip-label {
      font-size: 10px;
      font-weight: 700;
      color: var(--muted);
    }

    .car-price-chip-market .car-price-chip-label {
      color: var(--accent);
    }

    .car-price-chip-change {
      flex-shrink: 0;
      font-size: 9px;
      font-weight: 700;
      line-height: 1.2;
      padding: 2px 5px;
      border-radius: 999px;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }

    .car-price-chip-change.is-up {
      color: var(--accent);
      background: color-mix(in srgb, var(--accent) 14%, transparent);
    }

    .car-price-chip-change.is-down {
      color: var(--danger);
      background: color-mix(in srgb, var(--danger) 14%, transparent);
    }

    .car-price-chip-change.is-flat {
      color: var(--muted-2);
      background: var(--surface-2);
    }

    .car-price-chip-value {
      font-size: 13px;
      font-weight: 700;
      line-height: 1.35;
      font-variant-numeric: tabular-nums;
      color: var(--text);
      word-break: break-word;
    }

    .car-price-chip-market .car-price-chip-value:not(.is-empty) {
      color: var(--accent);
    }

    .car-price-chip-value.is-empty {
      color: var(--muted-2);
      font-weight: 500;
    }

    .car-price-chip-unit {
      font-size: 9px;
      color: var(--muted-2);
    }

    .cars-empty-state {
      margin: 0;
      padding: 32px 16px;
      text-align: center;
      font-size: 13px;
      color: var(--muted);
    }`;

export const androidStandaloneUiPatch = `
    const pricesPanelEl = document.getElementById("prices-panel");
    const currencyViewEl = document.getElementById("view-currency");
    const goldViewEl = document.getElementById("view-gold");
    const carsViewEl = document.getElementById("view-cars");
    const moreViewEl = document.getElementById("view-more");
    const currencyListEl = document.getElementById("currencyList");
    const goldListEl = document.getElementById("goldList");
    const navButtons = document.querySelectorAll("[data-market-tab]");
    const navRefreshBtn = document.getElementById("marketNavRefresh");
    const navRefreshIcon = document.getElementById("marketNavRefreshIcon");
    const carsLoadingEl = document.getElementById("carsLoading");
    const carsErrorEl = document.getElementById("carsError");
    const carsListWrapEl = document.getElementById("carsListWrap");
    const carsListEl = document.getElementById("carsList");
    const carsErrorMsgEl = document.getElementById("carsErrorMsg");
    const carsRetryBtn = document.getElementById("carsRetryBtn");
    const carsSearchEl = document.getElementById("carsSearch");
    const themeToggleValueEl = document.getElementById("themeToggleValue");
    const alertsEnabledEl = document.getElementById("alertsEnabled");
    const alertsThresholdEl = document.getElementById("alertsThreshold");
    const priceToastEl = document.getElementById("priceToast");
    const sharePricesBtn = document.getElementById("sharePricesBtn");

    let activeMarketTab = "currency";
    let carRows = [];
    let carsLoaded = false;
    let pricesLoaded = false;
    let latestMarketPrices = null;
    let previousPricesSnapshot = null;
    let toastHideTimer = null;
    let shareCardBusy = false;

    function handleSharePricesClick() {
      if (shareCardBusy) return;
      if (!latestMarketPrices) {
        showPriceToast("ابتدا قیمت‌ها را دریافت کنید");
        return;
      }
      shareCardBusy = true;
      if (sharePricesBtn) sharePricesBtn.disabled = true;
      Promise.resolve(shareMarketPricesCard(latestMarketPrices))
        .then(function () {
          showPriceToast("کارت قیمت آماده اشتراک شد");
        })
        .catch(function (error) {
          console.error("Share card error:", error);
          showPriceToast((error && error.message) || "اشتراک کارت قیمت ممکن نشد");
        })
        .finally(function () {
          shareCardBusy = false;
          if (sharePricesBtn) sharePricesBtn.disabled = false;
        });
    }

    function isPriceTab(tab) {
      return tab === "currency" || tab === "gold";
    }

    function getDefaultAlertSettings() {
      return { enabled: false, threshold: DEFAULT_ALERT_THRESHOLD };
    }

    function getAlertSettings() {
      try {
        const raw = localStorage.getItem(PRICE_ALERTS_STORAGE_KEY);
        if (!raw) return getDefaultAlertSettings();
        const parsed = JSON.parse(raw);
        const threshold = Number(parsed.threshold);
        return {
          enabled: parsed.enabled === true,
          threshold: Number.isFinite(threshold) && threshold > 0 ? threshold : DEFAULT_ALERT_THRESHOLD,
        };
      } catch {
        return getDefaultAlertSettings();
      }
    }

    function saveAlertSettings(settings) {
      localStorage.setItem(PRICE_ALERTS_STORAGE_KEY, JSON.stringify(settings));
    }

    function loadPreviousPricesSnapshot() {
      try {
        const raw = localStorage.getItem(PREVIOUS_PRICES_STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }

    function savePreviousPricesSnapshot(current) {
      const snapshot = {};
      ALERT_WATCH_ITEMS.forEach(function (item) {
        const data = current[item.key];
        if (data && data.p != null) snapshot[item.key] = data.p;
      });
      try {
        localStorage.setItem(PREVIOUS_PRICES_STORAGE_KEY, JSON.stringify(snapshot));
      } catch {}
      previousPricesSnapshot = snapshot;
    }

    function showPriceToast(message) {
      if (!priceToastEl) return;
      priceToastEl.textContent = message;
      priceToastEl.classList.remove("hidden");
      priceToastEl.classList.add("is-visible");
      if (toastHideTimer) clearTimeout(toastHideTimer);
      toastHideTimer = setTimeout(function () {
        priceToastEl.classList.remove("is-visible");
        priceToastEl.classList.add("hidden");
      }, 5000);
    }

    function tryShowBrowserNotification(title, body) {
      if (typeof Notification === "undefined") return;
      if (Notification.permission === "granted") {
        new Notification(title, { body: body });
        return;
      }
      if (Notification.permission === "default") {
        Notification.requestPermission().then(function (perm) {
          if (perm === "granted") new Notification(title, { body: body });
        });
      }
    }

    function checkPriceAlerts(current, options) {
      const silent = options && options.silent === true;
      const settings = getAlertSettings();
      if (!settings.enabled) {
        savePreviousPricesSnapshot(current);
        return;
      }
      const prev = previousPricesSnapshot || loadPreviousPricesSnapshot();
      if (!prev) {
        savePreviousPricesSnapshot(current);
        return;
      }
      const alerts = [];
      ALERT_WATCH_ITEMS.forEach(function (item) {
        const prevRaw = prev[item.key];
        const nextRaw = current[item.key] && current[item.key].p;
        if (prevRaw == null || nextRaw == null) return;
        const prevVal = toDisplayValue(prevRaw, false);
        const nextVal = toDisplayValue(nextRaw, false);
        if (Number.isNaN(prevVal) || Number.isNaN(nextVal) || prevVal === 0) return;
        const changePercent = ((nextVal - prevVal) / prevVal) * 100;
        if (Math.abs(changePercent) < settings.threshold) return;
        const direction = changePercent > 0 ? "افزایش" : "کاهش";
        alerts.push(
          item.title +
            ": " +
            direction +
            " " +
            Math.abs(changePercent).toLocaleString("fa-IR", { maximumFractionDigits: 2 }) +
            "٪",
        );
      });
      savePreviousPricesSnapshot(current);
      if (!alerts.length) return;
      const message = alerts.join(" · ");
      showPriceToast(message);
      tryShowBrowserNotification("تغییر قیمت", message);
    }

    function syncThemeToggleDisplay() {
      const theme = getMarketTheme();
      if (themeToggleValueEl) {
        themeToggleValueEl.textContent = theme === "light" ? "تم روشن" : "تم تاریک";
      }
    }

    function initMoreTab() {
      const alertSettings = getAlertSettings();
      previousPricesSnapshot = loadPreviousPricesSnapshot();
      if (alertsEnabledEl) alertsEnabledEl.checked = alertSettings.enabled;
      if (alertsThresholdEl) alertsThresholdEl.value = String(alertSettings.threshold);
      syncThemeToggleDisplay();
      if (alertsEnabledEl) {
        alertsEnabledEl.addEventListener("change", function () {
          saveAlertSettings({
            enabled: alertsEnabledEl.checked,
            threshold: getAlertSettings().threshold,
          });
        });
      }
      if (alertsThresholdEl) {
        alertsThresholdEl.addEventListener("change", function () {
          const threshold = Number(alertsThresholdEl.value);
          saveAlertSettings({
            enabled: getAlertSettings().enabled,
            threshold: Number.isFinite(threshold) && threshold > 0 ? threshold : DEFAULT_ALERT_THRESHOLD,
          });
        });
      }
    }

    function setRefreshBusy(busy) {
      if (navRefreshIcon) navRefreshIcon.classList.toggle("spin", busy);
      if (navRefreshBtn) navRefreshBtn.disabled = busy;
    }

    function showPriceLists() {
      loadingEl.classList.add("hidden");
      errorEl.classList.add("hidden");
      if (activeMarketTab === "gold") {
        currencyListEl.classList.add("hidden");
        goldListEl.classList.remove("hidden");
      } else if (activeMarketTab === "currency") {
        goldListEl.classList.add("hidden");
        currencyListEl.classList.remove("hidden");
      } else {
        currencyListEl.classList.remove("hidden");
        goldListEl.classList.remove("hidden");
      }
      setRefreshBusy(false);
    }

    function createHeroCard(item, data) {
      const isGlobal = item.key === "ons";
      const change = toDisplayValue(data.d, isGlobal);
      const changePercent = parseNumber(data.dp);
      const hasChange = !Number.isNaN(change) && change !== 0;
      const directionClass =
        data.dt === "high" ? "is-up" : data.dt === "low" ? "is-down" : "is-flat";
      const el = document.createElement("div");
      el.className = "price-hero-card";
      el.innerHTML =
        '<div class="price-hero-card-top"><div class="price-hero-card-title-wrap"><span class="price-hero-card-icon">' +
        item.icon +
        '</span><div><h3 class="price-hero-card-title">' +
        item.title +
        '</h3><p class="price-hero-card-subtitle">' +
        item.unit +
        '</p></div></div><span class="price-hero-card-time">' +
        (data.t || "") +
        '</span></div><div class="price-hero-card-value-row"><span class="price-hero-card-value">' +
        formatPrice(data.p, isGlobal) +
        '</span><span class="price-hero-card-change ' +
        directionClass +
        '">' +
        getChangeArrow(data.dt) +
        " " +
        (!Number.isNaN(changePercent) && changePercent !== 0
          ? Math.abs(changePercent).toLocaleString("fa-IR") + "٪"
          : hasChange
            ? formatPrice(Math.abs(change), isGlobal)
            : "۰") +
        "</span></div>";
      return el;
    }

    function renderItemGroup(items, listEl, current) {
      items.forEach(function (item) {
        const data = current[item.key];
        if (!data) return;
        if (item.hero) listEl.appendChild(createHeroCard(item, data));
        else listEl.appendChild(createPriceCard(item, data));
      });
    }

    function renderCurrency(current) {
      currencyListEl.innerHTML = "";
      renderItemGroup(CURRENCY_ITEMS, currencyListEl, current);
    }

    function renderGold(current) {
      goldListEl.innerHTML = "";
      renderItemGroup(GOLD_ITEMS, goldListEl, current);
      goldListEl.appendChild(createRealGoldCard(current));
      goldListEl.appendChild(createCoinGoldCard(current));
      goldListEl.appendChild(createGoldWageCard(current));
    }

    function showCarsLoading() {
      carsLoadingEl.classList.remove("hidden");
      carsErrorEl.classList.add("hidden");
      carsListWrapEl.classList.add("hidden");
      setRefreshBusy(true);
    }

    function showCarsError(message) {
      carsLoadingEl.classList.add("hidden");
      carsErrorEl.classList.remove("hidden");
      carsListWrapEl.classList.add("hidden");
      carsErrorMsgEl.textContent = message;
      setRefreshBusy(false);
    }

    function showCarsList() {
      carsLoadingEl.classList.add("hidden");
      carsErrorEl.classList.add("hidden");
      carsListWrapEl.classList.remove("hidden");
      setRefreshBusy(false);
    }

    function renderCarRows(rows) {
      carRows = rows;
      const query = (carsSearchEl && carsSearchEl.value ? carsSearchEl.value : "").trim().toLowerCase();
      const filtered = query
        ? rows.filter(function (row) {
            const haystack = [
              row.brandFa,
              row.modelFa,
              row.trimFa,
              row.className,
              String(row.modelYear),
              buildCarTitle(row),
              buildCarSubtitle(row),
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();
            return haystack.includes(query);
          })
        : rows;

      carsListEl.innerHTML = "";

      if (!filtered.length) {
        carsListEl.innerHTML = '<p class="cars-empty-state">خودرویی با این مشخصات یافت نشد.</p>';
        showCarsList();
        return;
      }

      filtered.forEach(function (row) {
        carsListEl.appendChild(createCarPriceCard(row));
      });

      showCarsList();
    }

    async function fetchCarPrices(options) {
      const silent = options && options.silent === true;
      if (!silent) {
        const hasVisibleList = !carsListWrapEl.classList.contains("hidden");
        if (hasVisibleList) {
          setRefreshBusy(true);
        } else {
          showCarsLoading();
        }
      }

      try {
        const result = await fetchBamaCarPrices();
        const rows = result.rows;
        if (!rows.length) throw new Error("قیمتی برای خودروهای داخلی یافت نشد");

        renderCarRows(rows);
        carsLoaded = true;
      } catch (error) {
        console.error("Bama car prices fetch error:", error);
        if (silent) return;
        showCarsError("خطا در دریافت قیمت خودرو. اتصال اینترنت را بررسی کنید.");
      }
    }

    function switchMarketTab(tab) {
      if (["currency", "gold", "cars", "more"].indexOf(tab) === -1) return;

      activeMarketTab = tab;
      pricesPanelEl.classList.toggle("hidden", !isPriceTab(tab));
      currencyViewEl.classList.toggle("hidden", tab !== "currency");
      goldViewEl.classList.toggle("hidden", tab !== "gold");
      carsViewEl.classList.toggle("hidden", tab !== "cars");
      moreViewEl.classList.toggle("hidden", tab !== "more");

      navButtons.forEach(function (button) {
        button.classList.toggle("is-active", button.dataset.marketTab === tab);
      });

      if (isPriceTab(tab)) {
        if (pricesLoaded) showPriceLists();
        else fetchPrices();
      }

      if (tab === "cars" && !carsLoaded) {
        fetchCarPrices();
      }
    }

    function handleMarketRefresh() {
      if (activeMarketTab === "cars") fetchCarPrices();
      else if (isPriceTab(activeMarketTab)) fetchPrices();
    }

    initMoreTab();

    if (sharePricesBtn) {
      sharePricesBtn.addEventListener("click", handleSharePricesClick);
    }

    navButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        switchMarketTab(button.dataset.marketTab);
      });
    });

    if (navRefreshBtn) {
      navRefreshBtn.addEventListener("click", handleMarketRefresh);
    }

    if (carsSearchEl) {
      carsSearchEl.addEventListener("input", function () {
        if (carRows.length) renderCarRows(carRows);
      });
    }
`;

export function patchStandaloneUiScript(baseScript) {
  let script = baseScript;

  // Theme toggle now lives in More tab — update sync to use value label
  script = script.replace(
    "function syncMarketThemeBtn() {\n      const btn = document.getElementById(\"themeToggleBtn\");\n      if (!btn) return;\n      const theme = getMarketTheme();\n      btn.title = theme === \"dark\" ? \"تم روشن\" : \"تم تاریک\";\n      btn.setAttribute(\"aria-label\", btn.title);\n      btn.textContent = theme === \"dark\" ? \"☀️\" : \"🌙\";\n    }",
    `function syncMarketThemeBtn() {
      const btn = document.getElementById("themeToggleBtn");
      if (!btn) return;
      const theme = getMarketTheme();
      btn.title = theme === "dark" ? "تم روشن" : "تم تاریک";
      btn.setAttribute("aria-label", btn.title);
      const valueEl = document.getElementById("themeToggleValue");
      if (valueEl) valueEl.textContent = theme === "light" ? "تم روشن" : "تم تاریک";
    }`,
  );

  // Replace renderPrices with split currency/gold + alerts (before lastUpdate line rewrite)
  script = script.replace(
    `function renderPrices(current) {
      listEl.innerHTML = "";
      renderItemGroup(FEATURED_ITEMS, current);
      listEl.appendChild(createRealGoldCard(current));
      listEl.appendChild(createCoinGoldCard(current));
      listEl.appendChild(createGoldWageCard(current));
      listEl.appendChild(createOtherCurrenciesSection(current));
      lastUpdateEl.textContent = new Date().toLocaleTimeString("fa-IR");
      showList();
    }`,
    `function renderPrices(current, options) {
      const silent = options && options.silent === true;
      latestMarketPrices = current;
      renderCurrency(current);
      renderGold(current);
      checkPriceAlerts(current, { silent: silent });
      pricesLoaded = true;
      showPriceLists();
    }`,
  );

  // Keep showLoading/showError/showList in sync with FAB and dual lists
  script = script.replace(
    "function showLoading() {\n      loadingEl.classList.remove(\"hidden\");\n      errorEl.classList.add(\"hidden\");\n      listEl.classList.add(\"hidden\");\n      refreshIcon.classList.add(\"spin\");\n      refreshBtn.disabled = true;\n    }",
    `function showLoading() {
      loadingEl.classList.remove("hidden");
      errorEl.classList.add("hidden");
      if (currencyListEl) currencyListEl.classList.add("hidden");
      if (goldListEl) goldListEl.classList.add("hidden");
      setRefreshBusy(true);
    }`,
  );

  script = script.replace(
    "function showError(message) {\n      loadingEl.classList.add(\"hidden\");\n      errorEl.classList.remove(\"hidden\");\n      listEl.classList.add(\"hidden\");\n      errorMsgEl.textContent = message;\n      refreshIcon.classList.remove(\"spin\");\n      refreshBtn.disabled = false;\n    }",
    `function showError(message) {
      loadingEl.classList.add("hidden");
      errorEl.classList.remove("hidden");
      if (currencyListEl) currencyListEl.classList.add("hidden");
      if (goldListEl) goldListEl.classList.add("hidden");
      errorMsgEl.textContent = message;
      setRefreshBusy(false);
    }`,
  );

  script = script.replace(
    "function showList() {\n      loadingEl.classList.add(\"hidden\");\n      errorEl.classList.add(\"hidden\");\n      listEl.classList.remove(\"hidden\");\n      refreshIcon.classList.remove(\"spin\");\n      refreshBtn.disabled = false;\n    }",
    `function showList() {
      showPriceLists();
    }`,
  );

  // silent refresh busy state
  script = script.replace(
    "if (hasVisibleList) {\n          refreshIcon.classList.add(\"spin\");\n          refreshBtn.disabled = true;\n        } else {\n          showLoading();\n        }",
    `if (hasVisibleList) {
          setRefreshBusy(true);
        } else {
          showLoading();
        }`,
  );

  // Update fetchPrices hasVisibleList check for dual lists
  script = script.replace(
    'const hasVisibleList = !listEl.classList.contains("hidden") && listEl.childElementCount > 0;',
    `const hasVisibleList =
          pricesLoaded &&
          ((activeMarketTab === "currency" && currencyListEl && !currencyListEl.classList.contains("hidden")) ||
            (activeMarketTab === "gold" && goldListEl && !goldListEl.classList.contains("hidden")));`,
  );

  script = script.replace(
    "renderPrices(data.current);",
    "renderPrices(data.current, { silent: silent });",
  );

  script = script.replace(
    "    refreshBtn.onclick = () => fetchPrices();\n    retryBtn.onclick = () => fetchPrices();\n    if (refreshTimer) clearInterval(refreshTimer);\n    refreshTimer = setInterval(() => fetchPrices({ silent: true }), 60000);\n    fetchPrices();",
    `${androidStandaloneUiPatch}
    retryBtn.onclick = function () { fetchPrices(); };
    if (carsRetryBtn) carsRetryBtn.onclick = function () { fetchCarPrices(); };
    if (refreshTimer) clearInterval(refreshTimer);
    refreshTimer = setInterval(function () {
      if (isPriceTab(activeMarketTab)) fetchPrices({ silent: true });
    }, 60000);
    fetchPrices();`,
  );

  return script;
}
