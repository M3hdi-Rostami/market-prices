import {
  DONATE_CARD_HOLDER,
  DONATE_CARD_NUMBER,
  DONATE_CARD_QR_SVG,
} from "./donate-support-data.mjs";

const DONATE_CARD_DISPLAY = DONATE_CARD_NUMBER.replace(/(\d{4})(?=\d)/g, "$1-");

export const androidPageBody = `<div class="app market-root">
    <header class="header market-header-compact">
      <div class="market-header-bar">
        <button type="button" id="marketSettingsBtn" class="market-settings-btn" data-market-tab="more" aria-label="تنظیمات" title="تنظیمات">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </button>
        <div class="market-header-center">
          <p class="market-brand" aria-label="تصمیم">تصمیم</p>
          <p id="currentDateTime" class="header-clock" aria-live="polite">
            <span id="headerDatePart" class="header-date-part">—</span>
            <span class="header-clock-sep" aria-hidden="true">-</span>
            <span id="headerTimePart" class="header-time-part">00:00:00</span>
          </p>
        </div>
        <span class="market-header-spacer" aria-hidden="true"></span>
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
        <div id="currencyList" class="grid price-stack hidden"></div>
      </div>

      <div id="view-gold" class="market-view hidden">
        <div class="gold-subtabs" role="tablist" aria-label="بخش طلا">
          <button type="button" class="gold-subtab-btn is-active" data-gold-subtab="prices" role="tab" aria-selected="true">قیمت‌ها</button>
          <button type="button" class="gold-subtab-btn" data-gold-subtab="calc" role="tab" aria-selected="false">ماشین حساب</button>
        </div>
        <div id="goldPricesPanel" class="gold-subpanel">
          <div id="goldList" class="grid price-stack hidden"></div>
        </div>
        <div id="goldCalcPanel" class="gold-subpanel hidden">
          <div id="goldCalcList" class="grid price-stack"></div>
        </div>
      </div>
    </div>

    <div id="view-cars" class="market-view hidden">
      <div class="cars-subtabs" role="tablist" aria-label="بخش خودرو">
        <button type="button" class="cars-subtab-btn is-active" data-cars-subtab="prices" role="tab" aria-selected="true">قیمت صفر</button>
        <button type="button" class="cars-subtab-btn" data-cars-subtab="estimate" role="tab" aria-selected="false">تخمین قیمت</button>
      </div>

      <div id="carsPricesPanel" class="cars-subpanel">
        <div class="cars-panel-intro">
          <div class="cars-panel-intro-icon" aria-hidden="true">🚗</div>
          <div class="cars-panel-intro-text">
            <h2 class="cars-panel-intro-title">قیمت خودرو صفر</h2>
            <p class="cars-panel-intro-hint">آخرین نرخ کارخانه و بازار خودروهای صفر کیلومتر</p>
          </div>
        </div>

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

      <div id="carsEstimatePanel" class="cars-subpanel hidden">
        <div class="cars-panel-intro">
          <div class="cars-panel-intro-icon" aria-hidden="true">🔎</div>
          <div class="cars-panel-intro-text">
            <h2 class="cars-panel-intro-title">تخمین قیمت خودرو</h2>
            <p class="cars-panel-intro-hint">از لینک دیوار، خودروهای ذخیره‌شده یا مشخصات دستی استفاده کنید</p>
          </div>
        </div>

        <section class="cars-estimate-section">
          <div class="cars-estimate-section-head">
            <span class="cars-estimate-step">۱</span>
            <div>
              <h3 class="cars-estimate-section-title">تخمین از آگهی دیوار</h3>
              <p class="cars-estimate-section-hint">لینک آگهی خودرو را بچسبانید تا قیمت حدودی محاسبه شود</p>
            </div>
          </div>
          <div class="divar-estimate-wrap">
            <div class="divar-estimate-row">
              <input id="divarUrlInput" type="url" inputmode="url" autocomplete="off" placeholder="https://divar.ir/v/..." class="divar-estimate-input" />
              <button id="divarEstimateBtn" type="button" class="divar-estimate-btn"><span class="divar-estimate-btn-spinner" aria-hidden="true"></span><span class="divar-estimate-btn-label">تخمین</span></button>
            </div>
            <p id="divarEstimateStatus" class="divar-estimate-status hidden"></p>
            <div id="divarEstimateResult" class="divar-estimate-result hidden"></div>
          </div>
        </section>

        <section class="cars-estimate-section">
          <div class="cars-estimate-section-head">
            <span class="cars-estimate-step">۲</span>
            <div>
              <h3 class="cars-estimate-section-title">خودروهای من</h3>
              <p class="cars-estimate-section-hint">ذخیره کنید تا بعداً سریع دوباره تخمین بزنید</p>
            </div>
          </div>
          <div class="my-cars-wrap">
            <div id="myCarsList" class="my-cars-list"></div>
            <p id="myCarsEmpty" class="my-cars-empty">هنوز خودرویی ذخیره نشده است.</p>
          </div>
        </section>

        <section class="cars-estimate-section">
          <div class="cars-estimate-section-head">
            <span class="cars-estimate-step">۳</span>
            <div>
              <h3 class="cars-estimate-section-title">تخمین با مشخصات</h3>
              <p id="myCarFormModeHint" class="cars-estimate-section-hint">برند، مدل، سال و کارکرد را وارد کنید</p>
            </div>
          </div>
          <form id="myCarEstimateForm" class="my-car-form" autocomplete="off">
            <label class="my-car-field">
              <span class="my-car-field-label">نام دلخواه (اختیاری)</span>
              <input id="myCarNickname" class="my-car-input" type="text" maxlength="40" placeholder="مثلاً پژو ۲۰۶ خودم" />
            </label>

            <label class="my-car-field">
              <span class="my-car-field-label">برند</span>
              <select id="myCarBrand" class="my-car-input" required>
                <option value="">انتخاب برند</option>
              </select>
            </label>

            <label class="my-car-field">
              <span class="my-car-field-label">مدل</span>
              <select id="myCarModel" class="my-car-input" required disabled>
                <option value="">ابتدا برند را انتخاب کنید</option>
              </select>
            </label>

            <label class="my-car-field">
              <span class="my-car-field-label">تیپ</span>
              <select id="myCarTrim" class="my-car-input" disabled>
                <option value="">در صورت نیاز</option>
              </select>
            </label>

            <div class="my-car-field-row">
              <label class="my-car-field">
                <span class="my-car-field-label">سال ساخت</span>
                <select id="myCarYear" class="my-car-input" required></select>
              </label>
              <label class="my-car-field">
                <span class="my-car-field-label">کارکرد (کیلومتر)</span>
                <input id="myCarMileage" class="my-car-input" type="text" inputmode="numeric" placeholder="مثلاً 120,000" required />
              </label>
            </div>

            <label class="my-car-field">
              <span class="my-car-field-label">وضعیت بدنه</span>
              <select id="myCarBodyStatus" class="my-car-input"></select>
            </label>

            <div class="my-car-actions">
              <button id="myCarEstimateBtn" type="submit" class="my-car-btn my-car-btn-primary">
                <span class="my-car-btn-spinner" aria-hidden="true"></span>
                <span class="my-car-btn-label">تخمین قیمت</span>
              </button>
              <button id="myCarSaveBtn" type="button" class="my-car-btn my-car-btn-secondary">ذخیره</button>
              <button id="myCarCancelEditBtn" type="button" class="my-car-btn my-car-btn-ghost hidden">انصراف ویرایش</button>
            </div>

            <p id="myCarEstimateStatus" class="my-car-status hidden"></p>
            <div id="myCarEstimateResult" class="divar-estimate-result hidden"></div>
          </form>
        </section>
      </div>
    </div>

    <div id="view-housing" class="market-view hidden">
      <form id="housingSearchForm" class="housing-search-form" autocomplete="off">
        <div class="housing-form-head">
          <h2 class="housing-form-title">جستجوی ملک با بودجه</h2>
          <p class="housing-form-hint">فعلاً فقط تهران · منبع: دیوار</p>
        </div>

        <label class="housing-field">
          <span class="housing-field-label">شهر</span>
          <select id="housingCity" class="housing-input"></select>
        </label>

        <div class="housing-deal-toggle" role="group" aria-label="نوع معامله">
          <button type="button" class="housing-deal-btn is-active" data-housing-deal="buy">خرید</button>
          <button type="button" class="housing-deal-btn" data-housing-deal="rent">رهن و اجاره</button>
        </div>

        <div id="housingBuyFields" class="housing-budget-fields">
          <label class="housing-field">
            <span class="housing-field-label">سقف بودجه خرید (تومان)</span>
            <input id="housingBudgetMax" class="housing-input" type="text" inputmode="numeric" placeholder="مثلاً 10,000,000,000" />
          </label>
        </div>

        <div id="housingRentFields" class="housing-budget-fields hidden">
          <label class="housing-field">
            <span class="housing-field-label">سقف ودیعه / رهن (تومان)</span>
            <input id="housingCreditMax" class="housing-input" type="text" inputmode="numeric" placeholder="مثلاً 500,000,000" />
          </label>
          <label class="housing-field">
            <span class="housing-field-label">سقف اجاره ماهانه (تومان)</span>
            <input id="housingRentMax" class="housing-input" type="text" inputmode="numeric" placeholder="۰ برای رهن کامل" />
          </label>
        </div>

        <div class="housing-field-row">
          <label class="housing-field">
            <span class="housing-field-label">متراژ از</span>
            <input id="housingSizeMin" class="housing-input" type="text" inputmode="numeric" placeholder="مثلاً ۶۰" />
          </label>
          <label class="housing-field">
            <span class="housing-field-label">متراژ تا</span>
            <input id="housingSizeMax" class="housing-input" type="text" inputmode="numeric" placeholder="مثلاً ۱۲۰" />
          </label>
        </div>

        <label class="housing-field">
          <span class="housing-field-label">تعداد خواب</span>
          <select id="housingRooms" class="housing-input"></select>
        </label>

        <button id="housingSearchBtn" type="submit" class="housing-search-btn">
          <span class="housing-search-btn-spinner" aria-hidden="true"></span>
          <span class="housing-search-btn-label">پیدا کردن آگهی‌ها</span>
        </button>
      </form>

      <p id="housingStatus" class="housing-status hidden"></p>

      <div id="housingLoading" class="state state-loading hidden">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"/>
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75"/>
        </svg>
        <span>در حال جستجو در دیوار...</span>
      </div>

      <div id="housingResultsWrap" class="housing-results-wrap hidden">
        <div id="housingList" class="housing-list"></div>
        <button id="housingLoadMoreBtn" type="button" class="housing-load-more hidden">آگهی‌های بیشتر</button>
      </div>
    </div>

    <div id="view-more" class="market-view hidden">
      <div class="more-subtabs" role="tablist" aria-label="بخش تنظیمات">
        <button type="button" class="more-subtab-btn is-active" data-more-subtab="settings" role="tab" aria-selected="true">تنظیمات</button>
        <button type="button" class="more-subtab-btn" data-more-subtab="donate" role="tab" aria-selected="false">حمایت</button>
        <button type="button" class="more-subtab-btn" data-more-subtab="about" role="tab" aria-selected="false">درباره</button>
      </div>

      <div id="moreSettingsPanel" class="more-subpanel">
        <div class="market-more-scroll">
          <section class="market-more-section">
            <h3 class="market-more-section-title">ظاهر</h3>
            <button type="button" id="themeToggleBtn" class="market-more-row">
              <span class="market-more-row-label">تم اپلیکیشن</span>
              <span id="themeToggleValue" class="market-more-row-value">تم تاریک</span>
            </button>
            <div class="market-accent-field">
              <p class="market-more-field-label">رنگ قالب</p>
              <div id="accentColorPicker" class="market-accent-picker" role="group" aria-label="انتخاب رنگ قالب"></div>
              <p class="market-more-hint">رنگ دکمه‌ها، نشانگر فعال و جزئیات برجسته اپ را عوض می‌کند.</p>
            </div>
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
        </div>
      </div>

      <div id="moreDonatePanel" class="more-subpanel hidden">
        <div class="market-more-scroll">
          <section class="donate-card" aria-label="حمایت از توسعه">
            <div class="donate-badge">حمایت از توسعه</div>
            <h2 class="donate-title">اگر «تصمیم» برات مفیده، با هم رشدش بدیم</h2>
            <p class="donate-lead">
              هر حمایت کوچک، یعنی امکانات تازه، سرعت بیشتر و ادامه ساختن بدون تبلیغات مزاحم.
              اگر از قیمت‌ها، تخمین خودرو یا جستجوی ملک استفاده می‌کنی، یک کمک کوچک مسیر بعدی را روشن‌تر می‌کند.
            </p>

            <div class="donate-qr-wrap">
              <div class="donate-qr-frame">
                <span class="donate-qr-pay">PAY</span>
                <div class="donate-qr">${DONATE_CARD_QR_SVG}</div>
              </div>
              <p class="donate-qr-hint">با دوربین بانکی اسکن کن یا شماره کارت را کپی کن</p>
            </div>

            <div class="donate-owner">
              <span class="donate-owner-label">به نام</span>
              <strong class="donate-owner-name">${DONATE_CARD_HOLDER}</strong>
            </div>

            <button type="button" id="donateCardCopyBtn" class="donate-card-box" aria-label="کپی شماره کارت">
              <div class="donate-card-box-text">
                <span class="donate-card-box-label">شماره کارت</span>
                <span id="donateCardNumber" class="donate-card-box-value" dir="ltr">${DONATE_CARD_DISPLAY}</span>
              </div>
              <span class="donate-card-box-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                  <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" stroke-width="1.8"/>
                  <path stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M5 15V7a2 2 0 012-2h8"/>
                </svg>
              </span>
            </button>

            <div class="donate-amounts">
              <p class="donate-amounts-label">مبلغ پیشنهادی</p>
              <div class="donate-amount-grid" role="group" aria-label="مبالغ پیشنهادی">
                <button type="button" class="donate-amount-btn" data-donate-amount="50000">۵۰ هزار</button>
                <button type="button" class="donate-amount-btn" data-donate-amount="100000">۱۰۰ هزار</button>
                <button type="button" class="donate-amount-btn" data-donate-amount="200000">۲۰۰ هزار</button>
              </div>
              <label class="donate-custom-field">
                <span class="donate-custom-label">مبلغ دلخواه (تومان)</span>
                <input id="donateCustomAmount" class="donate-custom-input" type="text" inputmode="numeric" autocomplete="off" placeholder="مثلاً ۷۵,۰۰۰" />
              </label>
            </div>

            <button type="button" id="donatePrimaryCopyBtn" class="donate-primary-btn">کپی شماره کارت</button>
            <p class="donate-footnote">هیچ اجباری در کار نیست؛ همین که از اپ استفاده می‌کنی برای ادامه مسیر ارزشمند است.</p>
          </section>
        </div>
      </div>

      <div id="moreAboutPanel" class="more-subpanel hidden">
        <div class="market-more-scroll">
          <section class="market-more-section" id="appUpdateSection">
            <h3 class="market-more-section-title">درباره ما</h3>
            <p class="market-about-text">
              <strong>تصمیم</strong> اپلیکیشنی برای پیگیری قیمت‌های لحظه‌ای ارز و طلا، مشاهده قیمت خودرو،
              جستجوی ملک با بودجه در دیوار و تخمین قیمت خودرو از آگهی است؛ تا با اطلاعات به‌روز، راحت‌تر تصمیم بگیرید.
            </p>
            <div class="market-more-row market-more-row-static">
              <span class="market-more-row-label">نسخه اپلیکیشن</span>
              <span id="appContentVersion" class="market-more-row-value">—</span>
            </div>
          </section>

          <section class="market-more-section">
            <h3 class="market-more-section-title">اشتراک اپلیکیشن</h3>
            <button type="button" id="shareApkBtn" class="market-more-row market-share-apk-row">
              <span class="market-more-row-label">ارسال فایل نصب (APK)</span>
              <span class="market-more-row-value market-share-apk-action">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 8l-4-4-4 4M12 4v12"/>
                </svg>
              </span>
            </button>
            <p class="market-more-hint">فایل نصب همین نسخه را برای دوستانتان بفرستید تا اپ را نصب کنند و استفاده کنند.</p>
          </section>

          <p class="market-more-copyright">
            طراحی و توسعه توسط
            <a href="https://t.me/m3hdi_v1" target="_blank" rel="noopener noreferrer" dir="ltr" class="accent">m3hdi_v1</a>
            |
            <span id="currentYear"></span> &copy;
          </p>
        </div>
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
      <button type="button" class="market-nav-btn" data-market-tab="housing">
        <svg class="market-nav-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z"/>
        </svg>
        <span class="market-nav-label">مسکن</span>
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
      display: grid;
      grid-template-columns: 40px 1fr 40px;
      align-items: center;
      gap: 8px;
      width: 100%;
    }

    .market-header-spacer {
      width: 40px;
      height: 40px;
      justify-self: end;
    }

    .market-settings-btn {
      justify-self: start;
      width: 40px;
      height: 40px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: 1px solid var(--border);
      border-radius: 12px;
      background: color-mix(in srgb, var(--surface) 80%, transparent);
      color: var(--muted);
      cursor: pointer;
      transition: color 0.15s, background-color 0.15s, border-color 0.15s, transform 0.15s;
    }

    .market-settings-btn svg {
      width: 20px;
      height: 20px;
    }

    .market-settings-btn:hover {
      color: var(--text);
      background: var(--surface-2);
    }

    .market-settings-btn.is-active {
      color: var(--accent);
      border-color: color-mix(in srgb, var(--accent) 40%, var(--border));
      background: color-mix(in srgb, var(--accent) 12%, transparent);
    }

    .market-settings-btn:active {
      transform: scale(0.96);
    }

    .market-header-compact .header-clock {
      justify-self: center;
      display: inline-flex;
      align-items: baseline;
      justify-content: center;
      gap: 6px;
      margin: 0;
      width: auto;
      max-width: 100%;
      text-align: center;
      white-space: nowrap;
    }

    .market-header-center {
      justify-self: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      min-width: 0;
      max-width: 100%;
    }

    .market-brand {
      margin: 0;
      font-size: 15px;
      font-weight: 800;
      letter-spacing: 0.04em;
      color: var(--accent);
      line-height: 1.1;
    }

    .header-date-part {
      min-width: 0;
    }

    .header-clock-sep {
      color: var(--muted-2, var(--muted));
      flex-shrink: 0;
    }

    .header-time-part {
      display: inline-block;
      width: 8.2ch;
      flex-shrink: 0;
      font-variant-numeric: tabular-nums;
      font-feature-settings: "tnum" 1;
      letter-spacing: 0.02em;
      text-align: center;
      direction: ltr;
      unicode-bidi: isolate;
    }

    .price-hero-share-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid color-mix(in srgb, var(--accent) 18%, var(--border));
    }

    .price-hero-share-hint {
      margin: 0;
      flex: 1;
      min-width: 0;
      font-size: 11px;
      line-height: 1.55;
      color: var(--muted);
      font-weight: 500;
    }

    .market-share-icon-btn {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: 1px solid color-mix(in srgb, var(--accent) 35%, var(--border));
      border-radius: 12px;
      background: color-mix(in srgb, var(--accent) 12%, transparent);
      color: var(--accent);
      cursor: pointer;
      transition: opacity 0.15s, transform 0.15s, background-color 0.15s;
    }

    .market-share-icon-btn svg {
      width: 18px;
      height: 18px;
    }

    .market-share-icon-btn:hover {
      background: color-mix(in srgb, var(--accent) 20%, transparent);
    }

    .market-share-icon-btn:active {
      transform: scale(0.96);
    }

    .market-share-icon-btn:disabled {
      opacity: 0.55;
      cursor: wait;
    }

    @media (max-width: 390px) {
      .market-header-compact .header-clock {
        font-size: 11px;
        gap: 4px;
      }

      .header-time-part {
        width: 7.6ch;
      }

      .price-hero-share-hint {
        font-size: 10px;
      }
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

    .market-root .grid.price-stack {
      grid-template-columns: 1fr;
      gap: 10px;
      padding: 0 0 10px;
    }

    .gold-subtabs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      padding: 4px;
      margin-bottom: 12px;
      border-radius: 14px;
      background: var(--bg);
      border: 1px solid var(--border);
      flex-shrink: 0;
    }

    .gold-subtab-btn {
      border: none;
      border-radius: 11px;
      padding: 10px 8px;
      background: transparent;
      color: var(--muted);
      font-family: inherit;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }

    .gold-subtab-btn.is-active {
      background: color-mix(in srgb, var(--accent) 16%, var(--surface));
      color: var(--accent);
    }

    .gold-subpanel {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }

    .gold-subpanel.hidden {
      display: none;
    }

    #view-gold {
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .price-section-title {
      margin: 4px 2px 2px;
      font-size: 13px;
      font-weight: 700;
      color: var(--muted);
    }

    #view-more {
      display: flex;
      flex-direction: column;
      min-height: 0;
      gap: 10px;
      overflow: hidden;
    }

    .more-subtabs {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 6px;
      padding: 4px;
      border-radius: 14px;
      background: var(--bg);
      border: 1px solid var(--border);
      flex-shrink: 0;
    }

    .more-subtab-btn {
      border: none;
      border-radius: 11px;
      padding: 10px 6px;
      background: transparent;
      color: var(--muted);
      font-family: inherit;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }

    .more-subtab-btn.is-active {
      background: color-mix(in srgb, var(--accent) 16%, var(--surface));
      color: var(--accent);
    }

    .more-subpanel {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .more-subpanel.hidden {
      display: none;
    }

    .more-subpanel .market-more-scroll {
      flex: 1;
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

    #view-cars.market-view {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding-bottom: 0;
      gap: 10px;
    }

    .cars-subtabs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      padding: 4px;
      border-radius: 14px;
      background: var(--bg);
      border: 1px solid var(--border);
      flex-shrink: 0;
    }

    .cars-subtab-btn {
      border: none;
      border-radius: 11px;
      padding: 10px 8px;
      background: transparent;
      color: var(--muted);
      font-family: inherit;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }

    .cars-subtab-btn.is-active {
      background: color-mix(in srgb, var(--accent) 16%, var(--surface));
      color: var(--accent);
    }

    .cars-subpanel {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
      padding-bottom: 8px;
    }

    .cars-subpanel.hidden {
      display: none;
    }

    .cars-panel-intro {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border-radius: 16px;
      border: 1px solid color-mix(in srgb, var(--accent) 22%, var(--border));
      background: linear-gradient(
        135deg,
        color-mix(in srgb, var(--accent) 14%, var(--surface)) 0%,
        var(--surface) 100%
      );
      flex-shrink: 0;
    }

    .cars-panel-intro-icon {
      width: 42px;
      height: 42px;
      border-radius: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--accent) 16%, transparent);
      font-size: 22px;
      flex-shrink: 0;
    }

    .cars-panel-intro-title {
      margin: 0;
      font-size: 15px;
      font-weight: 800;
      color: var(--text);
    }

    .cars-panel-intro-hint {
      margin: 3px 0 0;
      font-size: 11px;
      line-height: 1.5;
      color: var(--muted);
    }

    .cars-estimate-section {
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex-shrink: 0;
    }

    .cars-estimate-section-head {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 0 2px;
    }

    .cars-estimate-step {
      width: 24px;
      height: 24px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 1px;
      background: color-mix(in srgb, var(--accent) 16%, transparent);
      color: var(--accent);
      font-size: 11px;
      font-weight: 800;
    }

    .cars-estimate-section-title {
      margin: 0;
      font-size: 13px;
      font-weight: 800;
      color: var(--text);
    }

    .cars-estimate-section-hint {
      margin: 2px 0 0;
      font-size: 11px;
      line-height: 1.5;
      color: var(--muted);
    }

    #view-housing.market-view {
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
      padding-bottom: 8px;
      gap: 10px;
    }

    .market-bottom-nav-quad .market-nav-label {
      font-size: 10px;
    }

    .market-bottom-nav-quad .market-nav-btn {
      padding: 6px 2px 4px;
    }

    .housing-search-form {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 12px;
      border: 1px solid var(--border);
      border-radius: 14px;
      background: var(--surface);
      box-shadow: var(--card-shadow, none);
    }

    .housing-form-title {
      margin: 0;
      font-size: 15px;
      font-weight: 800;
      color: var(--text);
    }

    .housing-form-hint {
      margin: 2px 0 0;
      font-size: 11px;
      color: var(--muted);
    }

    .housing-field {
      display: flex;
      flex-direction: column;
      gap: 5px;
      min-width: 0;
    }

    .housing-field-label {
      font-size: 11px;
      font-weight: 600;
      color: var(--muted);
    }

    .housing-input {
      width: 100%;
      min-width: 0;
      padding: 10px 12px;
      border: 1px solid var(--border-strong, var(--border));
      border-radius: 10px;
      background: var(--input-bg, var(--bg));
      color: var(--text);
      font-family: inherit;
      font-size: 13px;
      outline: none;
    }

    .housing-input:focus {
      border-color: var(--accent);
    }

    .housing-field-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .housing-deal-toggle {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      padding: 4px;
      border-radius: 12px;
      background: var(--bg);
      border: 1px solid var(--border);
    }

    .housing-deal-btn {
      border: none;
      border-radius: 10px;
      padding: 10px 8px;
      background: transparent;
      color: var(--muted);
      font-family: inherit;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }

    .housing-deal-btn.is-active {
      background: color-mix(in srgb, var(--accent) 16%, var(--surface));
      color: var(--accent);
    }

    .housing-search-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 12px 14px;
      border: none;
      border-radius: 12px;
      background: var(--accent);
      color: var(--accent-fg, #fff);
      font-family: inherit;
      font-size: 14px;
      font-weight: 800;
      cursor: pointer;
    }

    .housing-search-btn:disabled {
      opacity: 0.65;
      cursor: wait;
    }

    .housing-search-btn-spinner {
      display: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid color-mix(in srgb, var(--accent-fg, #fff) 35%, transparent);
      border-top-color: var(--accent-fg, #fff);
      animation: spin 0.8s linear infinite;
    }

    .housing-search-btn.is-loading .housing-search-btn-spinner {
      display: inline-block;
    }

    .housing-status {
      margin: 0;
      font-size: 12px;
      color: var(--muted);
      line-height: 1.6;
    }

    .housing-status.is-error {
      color: var(--danger);
    }

    .housing-results-wrap {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .housing-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .housing-card {
      border: 1px solid var(--border);
      border-radius: 16px;
      background: var(--surface);
      overflow: hidden;
      box-shadow: var(--card-shadow, none);
    }

    .housing-gallery {
      position: relative;
      background: var(--surface-2);
    }

    .housing-gallery-empty {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 180px;
      color: var(--muted);
      font-size: 12px;
    }

    .housing-gallery-track {
      display: flex;
      direction: ltr;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }

    .housing-gallery-track::-webkit-scrollbar {
      display: none;
    }

    .housing-gallery-image {
      flex: 0 0 100%;
      width: 100%;
      height: 210px;
      object-fit: cover;
      scroll-snap-align: start;
      background: var(--surface-2);
    }

    .housing-gallery-dots {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 10px;
      display: flex;
      justify-content: center;
      gap: 5px;
      pointer-events: none;
    }

    .housing-gallery-dot {
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.45);
    }

    .housing-gallery-dot.is-active {
      background: #fff;
      width: 14px;
    }

    .housing-gallery-count {
      position: absolute;
      top: 10px;
      left: 10px;
      padding: 4px 8px;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.62);
      color: #fff;
      font-size: 11px;
      font-weight: 700;
    }

    .housing-card-body {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
    }

    .housing-price-primary {
      margin: 0;
      font-size: 16px;
      font-weight: 800;
      color: var(--text);
      font-variant-numeric: tabular-nums;
      line-height: 1.35;
    }

    .housing-price-secondary {
      margin: 2px 0 0;
      font-size: 12px;
      font-weight: 600;
      color: var(--accent);
      font-variant-numeric: tabular-nums;
    }

    .housing-card-title {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      color: var(--text);
      line-height: 1.55;
    }

    .housing-card-location {
      margin: 0;
      font-size: 12px;
      color: var(--muted);
    }

    .housing-chip-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .housing-chip {
      display: inline-flex;
      align-items: center;
      padding: 5px 8px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--surface-2) 70%, var(--border));
      color: var(--text);
      font-size: 11px;
      font-weight: 700;
    }

    .housing-card-meta,
    .housing-card-desc {
      margin: 0;
      font-size: 11px;
      line-height: 1.65;
      color: var(--muted);
    }

    .housing-open-btn {
      margin-top: 4px;
      width: 100%;
      padding: 10px 12px;
      border: 1px solid color-mix(in srgb, var(--accent) 35%, var(--border));
      border-radius: 11px;
      background: color-mix(in srgb, var(--accent) 12%, transparent);
      color: var(--accent);
      font-family: inherit;
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
    }

    .housing-load-more {
      width: 100%;
      padding: 11px 12px;
      border: 1px solid var(--border-strong, var(--border));
      border-radius: 12px;
      background: var(--surface);
      color: var(--text);
      font-family: inherit;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }

    .housing-load-more:disabled {
      opacity: 0.6;
      cursor: wait;
    }

    [data-theme="light"] .housing-search-form,
    [data-theme="light"] .housing-card {
      box-shadow: var(--card-shadow, 0 1px 2px rgba(15, 23, 42, 0.05), 0 4px 14px rgba(15, 23, 42, 0.06));
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
      background: linear-gradient(145deg, var(--accent), color-mix(in srgb, var(--accent) 55%, var(--accent-glow, #06b6d4)));
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
      position: relative;
      overflow: hidden;
      border-radius: 22px;
      border: none;
      background: linear-gradient(
        135deg,
        color-mix(in srgb, var(--accent) 55%, #0f172a) 0%,
        color-mix(in srgb, var(--accent) 88%, #1e293b) 30%,
        color-mix(in srgb, var(--accent-glow, var(--accent)) 82%, var(--accent)) 64%,
        color-mix(in srgb, var(--accent-glow, var(--accent)) 45%, #fff7ed) 100%
      );
      box-shadow: 0 14px 32px color-mix(in srgb, var(--accent) 28%, transparent);
      padding: 18px 18px 16px;
      color: #fff;
    }

    .price-hero-card::after {
      content: "";
      position: absolute;
      inset: auto -20% -40% 40%;
      height: 140%;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.18) 0%, transparent 68%);
      pointer-events: none;
    }

    .price-hero-card-top {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 8px;
    }

    .price-hero-card-title-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .price-hero-card-icon {
      width: 42px;
      height: 42px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.16);
      font-size: 22px;
      line-height: 1;
      backdrop-filter: blur(6px);
    }

    .price-hero-card-kicker {
      margin: 0;
      font-size: 11px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.78);
    }

    .price-hero-card-title {
      margin: 2px 0 0;
      font-size: 15px;
      font-weight: 700;
      color: #fff;
    }

    .price-hero-card-subtitle {
      margin: 2px 0 0;
      font-size: 11px;
      color: rgba(255, 255, 255, 0.72);
    }

    .price-hero-card-time {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.7);
      flex-shrink: 0;
    }

    .price-hero-card-value-row {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 12px;
      margin-top: 4px;
    }

    .price-hero-card-value {
      font-size: 30px;
      font-weight: 800;
      line-height: 1.1;
      font-variant-numeric: tabular-nums;
      color: #fff;
      letter-spacing: -0.02em;
    }

    .price-hero-card-change {
      font-size: 12px;
      font-weight: 700;
      padding: 6px 10px;
      border-radius: 999px;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
      background: rgba(255, 255, 255, 0.16);
      color: #fff;
    }

    .price-hero-card-change.is-up,
    .price-hero-card-change.is-down,
    .price-hero-card-change.is-flat {
      color: #fff;
      background: rgba(255, 255, 255, 0.16);
    }

    .price-hero-share-row {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-top: 16px;
      padding-top: 0;
      border-top: none;
    }

    .price-hero-share-hint {
      margin: 0;
      font-size: 11px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.78);
    }

    .price-hero-share-row .market-share-icon-btn {
      width: auto;
      min-width: 108px;
      height: 40px;
      padding: 0 14px;
      border-radius: 12px;
      border: none;
      background: color-mix(in srgb, var(--accent) 72%, #0f172a);
      color: #fff;
      box-shadow: 0 8px 18px color-mix(in srgb, var(--accent) 35%, transparent);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .price-hero-share-row .market-share-icon-btn svg {
      width: 16px;
      height: 16px;
    }

    .price-hero-share-row .market-share-icon-btn::after {
      content: "اشتراک";
      font-size: 12px;
      font-weight: 700;
    }

    .rate-card {
      grid-column: 1 / -1;
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      min-width: 0;
      padding: 14px 14px;
      border-radius: 18px;
      border: 1px solid var(--border);
      background: var(--surface);
      box-shadow: 0 1px 0 rgba(255, 255, 255, 0.03);
    }

    .rate-card-icon {
      width: 44px;
      height: 44px;
      border-radius: 999px;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--accent) 12%, var(--surface-2));
      font-size: 20px;
      line-height: 1;
    }

    .rate-card-meta {
      flex: 1 1 auto;
      min-width: 0;
    }

    .rate-card-title {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .rate-card-subtitle {
      margin: 3px 0 0;
      font-size: 11px;
      color: var(--muted);
    }

    .rate-card-spark {
      flex: 0 0 68px;
      width: 68px;
      height: 28px;
      overflow: visible;
    }

    .rate-card-spark path {
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .rate-card-spark.is-up path {
      stroke: var(--accent);
    }

    .rate-card-spark.is-down path {
      stroke: var(--danger);
    }

    .rate-card-spark.is-flat path {
      stroke: var(--muted);
    }

    .rate-card-side {
      flex: 0 0 auto;
      text-align: left;
      min-width: 78px;
    }

    .rate-card-change {
      display: block;
      font-size: 12px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      margin-bottom: 4px;
    }

    .rate-card-change.is-up {
      color: var(--accent);
    }

    .rate-card-change.is-down {
      color: var(--danger);
    }

    .rate-card-change.is-flat {
      color: var(--muted);
    }

    .rate-card-price {
      display: block;
      font-size: 15px;
      font-weight: 800;
      color: var(--text);
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    [data-theme="light"] .rate-card {
      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
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

    .market-accent-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-top: 12px;
      border-top: 1px solid var(--border);
    }

    .market-accent-picker {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .market-accent-swatch {
      width: 36px;
      height: 36px;
      border-radius: 999px;
      border: 2px solid transparent;
      padding: 0;
      cursor: pointer;
      background: var(--swatch, var(--accent));
      box-shadow: inset 0 0 0 2px color-mix(in srgb, #fff 18%, transparent);
      transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
    }

    .market-accent-swatch:hover {
      transform: scale(1.06);
    }

    .market-accent-swatch.is-active {
      border-color: var(--text);
      box-shadow:
        0 0 0 3px color-mix(in srgb, var(--swatch, var(--accent)) 35%, transparent),
        inset 0 0 0 2px color-mix(in srgb, #fff 22%, transparent);
    }

    .market-accent-swatch:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }

    .market-about-text {
      margin: 0 0 12px;
      padding: 0;
      font-size: 12.5px;
      line-height: 1.85;
      color: var(--muted);
      font-weight: 500;
    }

    .market-about-text strong {
      color: var(--accent);
      font-weight: 800;
    }

    .market-share-apk-row .market-share-apk-action {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      border: 1px solid color-mix(in srgb, var(--accent) 35%, var(--border));
      background: color-mix(in srgb, var(--accent) 12%, transparent);
      color: var(--accent);
    }

    .market-share-apk-row .market-share-apk-action svg {
      width: 16px;
      height: 16px;
    }

    .market-share-apk-row:disabled {
      opacity: 0.6;
      cursor: wait;
    }

    .market-share-apk-row.is-loading .market-share-apk-action {
      opacity: 0.75;
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

    .donate-card {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 14px;
      padding: 18px 16px 16px;
      border-radius: 22px;
      border: 1px solid color-mix(in srgb, var(--accent) 22%, var(--border));
      background:
        radial-gradient(120% 80% at 100% 0%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 55%),
        var(--surface);
      box-shadow: var(--card-shadow, none);
    }

    .donate-badge {
      align-self: center;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 6px 12px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--accent) 14%, transparent);
      color: var(--accent);
      font-size: 11px;
      font-weight: 800;
    }

    .donate-title {
      margin: 0;
      text-align: center;
      font-size: 18px;
      font-weight: 800;
      line-height: 1.55;
      color: var(--text);
    }

    .donate-lead {
      margin: 0;
      text-align: center;
      font-size: 12px;
      line-height: 1.85;
      color: var(--muted);
    }

    .donate-qr-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .donate-qr-frame {
      width: min(100%, 220px);
      padding: 14px;
      border-radius: 18px;
      background: #ffffff;
      box-shadow: 0 10px 28px color-mix(in srgb, var(--accent) 16%, transparent);
    }

    .donate-qr-pay {
      display: block;
      text-align: center;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.18em;
      color: #0b1220;
      margin-bottom: 6px;
    }

    .donate-qr {
      width: 100%;
      aspect-ratio: 1;
      display: block;
    }

    .donate-qr svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    .donate-qr-hint {
      margin: 0;
      font-size: 11px;
      color: var(--muted);
      text-align: center;
    }

    .donate-owner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .donate-owner-label {
      font-size: 11px;
      color: var(--muted);
    }

    .donate-owner-name {
      font-size: 14px;
      font-weight: 800;
      color: var(--text);
    }

    .donate-card-box {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 14px;
      border-radius: 16px;
      border: 1px solid var(--border-strong, var(--border));
      background: color-mix(in srgb, var(--surface-2) 70%, var(--surface));
      color: inherit;
      font-family: inherit;
      text-align: right;
      cursor: pointer;
    }

    .donate-card-box:active {
      transform: scale(0.99);
    }

    .donate-card-box-text {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .donate-card-box-label {
      font-size: 11px;
      color: var(--muted);
      font-weight: 600;
    }

    .donate-card-box-value {
      font-size: 15px;
      font-weight: 800;
      color: var(--text);
      font-variant-numeric: tabular-nums;
      letter-spacing: 0.04em;
    }

    .donate-card-box-icon {
      width: 36px;
      height: 36px;
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: color-mix(in srgb, var(--accent) 14%, transparent);
      color: var(--accent);
    }

    .donate-card-box-icon svg {
      width: 18px;
      height: 18px;
    }

    .donate-amounts {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .donate-amounts-label,
    .donate-custom-label {
      margin: 0;
      font-size: 12px;
      font-weight: 700;
      color: var(--muted);
    }

    .donate-amount-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
    }

    .donate-amount-btn {
      min-height: 42px;
      border-radius: 12px;
      border: 1px solid var(--border-strong, var(--border));
      background: transparent;
      color: var(--text);
      font-family: inherit;
      font-size: 12px;
      font-weight: 800;
      cursor: pointer;
    }

    .donate-amount-btn.is-active {
      border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
      background: color-mix(in srgb, var(--accent) 14%, transparent);
      color: var(--accent);
    }

    .donate-custom-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .donate-custom-input {
      width: 100%;
      min-height: 44px;
      padding: 10px 12px;
      border-radius: 12px;
      border: 1px solid var(--border-strong, var(--border));
      background: var(--input-bg, var(--bg));
      color: var(--text);
      font-family: inherit;
      font-size: 14px;
      font-variant-numeric: tabular-nums;
      outline: none;
    }

    .donate-custom-input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 18%, transparent);
    }

    .donate-primary-btn {
      width: 100%;
      min-height: 48px;
      border-radius: 14px;
      border: none;
      background: var(--accent);
      color: var(--accent-fg);
      font-family: inherit;
      font-size: 14px;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 10px 22px color-mix(in srgb, var(--accent) 28%, transparent);
    }

    .donate-primary-btn:active {
      transform: scale(0.99);
    }

    .donate-footnote {
      margin: 0;
      text-align: center;
      font-size: 11px;
      line-height: 1.7;
      color: var(--muted);
    }

    [data-theme="light"] .donate-card {
      background:
        radial-gradient(120% 80% at 100% 0%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 55%),
        #ffffff;
      border-color: color-mix(in srgb, var(--accent) 18%, var(--border));
    }

    [data-theme="light"] .donate-card-box,
    [data-theme="light"] .donate-amount-btn,
    [data-theme="light"] .donate-custom-input {
      background: var(--input-bg, #f7f9fc);
      border-color: var(--border-strong);
    }

    [data-theme="light"] .donate-amount-btn.is-active {
      background: color-mix(in srgb, var(--accent) 12%, #ffffff);
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
      position: sticky;
      top: 0;
      z-index: 2;
      padding-bottom: 2px;
      background: linear-gradient(to bottom, var(--bg) 70%, transparent);
    }

    .cars-search-input {
      width: 100%;
      min-width: 0;
      padding: 12px 14px;
      border: 1px solid var(--border-strong, var(--border));
      border-radius: 14px;
      background: var(--surface);
      color: var(--text);
      font-family: inherit;
      font-size: 13px;
      outline: none;
      box-shadow: 0 1px 0 rgba(255, 255, 255, 0.03);
    }

    .cars-search-input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 18%, transparent);
    }

    .divar-estimate-wrap {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      border: 1px solid var(--border);
      border-radius: 16px;
      background: var(--surface);
    }

    .divar-estimate-label {
      font-size: 12px;
      font-weight: 700;
      color: var(--text);
    }

    .divar-estimate-row {
      display: flex;
      gap: 8px;
      align-items: stretch;
    }

    .divar-estimate-input {
      flex: 1;
      min-width: 0;
      padding: 10px 12px;
      border: 1px solid var(--border-strong);
      border-radius: 10px;
      background: var(--input-bg);
      color: var(--text);
      font-family: inherit;
      font-size: 12px;
      outline: none;
      direction: ltr;
      text-align: left;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.12);
    }

    .divar-estimate-input::placeholder {
      color: var(--muted);
      direction: rtl;
      text-align: right;
    }

    .divar-estimate-input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 22%, transparent);
    }

    .divar-estimate-input:disabled {
      opacity: 0.6;
    }

    .divar-estimate-btn {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 0 14px;
      border: none;
      border-radius: 10px;
      background: var(--accent);
      color: var(--accent-fg);
      font-family: inherit;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }

    .divar-estimate-btn:disabled {
      opacity: 0.6;
      cursor: default;
    }

    .divar-estimate-btn-spinner {
      display: none;
      width: 14px;
      height: 14px;
      border: 2px solid color-mix(in srgb, var(--accent-fg) 35%, transparent);
      border-top-color: var(--accent-fg);
      border-radius: 50%;
      animation: spin 0.75s linear infinite;
      flex-shrink: 0;
    }

    .divar-estimate-btn.is-loading .divar-estimate-btn-spinner {
      display: inline-block;
    }

    .divar-estimate-btn.is-loading {
      min-width: 7.5rem;
    }

    .divar-estimate-status {
      margin: 0;
      font-size: 11px;
      color: var(--muted);
    }

    .divar-estimate-status.is-loading {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--accent);
      font-weight: 600;
      padding: 8px 10px;
      border-radius: 10px;
      background: color-mix(in srgb, var(--accent) 12%, transparent);
      border: 1px solid color-mix(in srgb, var(--accent) 28%, transparent);
    }

    .divar-estimate-status.is-loading::before {
      content: "";
      width: 14px;
      height: 14px;
      border: 2px solid color-mix(in srgb, var(--accent) 30%, transparent);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 0.75s linear infinite;
      flex-shrink: 0;
    }

    .divar-estimate-status.is-error {
      color: #f87171;
    }

    .divar-estimate-result {
      min-width: 0;
    }

    .my-cars-wrap,
    .my-car-form {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 12px;
      border: 1px solid var(--border);
      border-radius: 16px;
      background: var(--surface);
      box-shadow: var(--card-shadow, none);
    }

    .my-cars-title,
    .my-car-form-title {
      margin: 0;
      font-size: 14px;
      font-weight: 800;
      color: var(--text);
    }

    .my-cars-hint,
    .my-car-form-hint {
      margin: 2px 0 0;
      font-size: 11px;
      color: var(--muted);
      line-height: 1.5;
    }

    .my-cars-empty {
      margin: 0;
      font-size: 12px;
      color: var(--muted);
      text-align: center;
      padding: 10px 6px;
    }

    .my-cars-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .my-car-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 10px;
      border: 1px solid var(--border);
      border-radius: 12px;
      background: color-mix(in srgb, var(--surface-2) 55%, var(--surface));
    }

    .my-car-item.is-active {
      border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
      box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent) 20%, transparent);
    }

    .my-car-item-title {
      margin: 0;
      font-size: 13px;
      font-weight: 800;
      color: var(--text);
    }

    .my-car-item-meta {
      margin: 0;
      font-size: 11px;
      color: var(--muted);
      line-height: 1.5;
    }

    .my-car-item-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .my-car-item-btn {
      flex: 1 1 auto;
      min-width: 72px;
      padding: 7px 10px;
      border-radius: 9px;
      border: 1px solid var(--border-strong, var(--border));
      background: var(--bg);
      color: var(--text);
      font-family: inherit;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
    }

    .my-car-item-btn.is-primary {
      background: color-mix(in srgb, var(--accent) 16%, transparent);
      border-color: color-mix(in srgb, var(--accent) 35%, var(--border));
      color: var(--accent);
    }

    .my-car-item-btn.is-danger {
      color: #f87171;
      border-color: color-mix(in srgb, #f87171 35%, var(--border));
    }

    .my-car-field {
      display: flex;
      flex-direction: column;
      gap: 5px;
      min-width: 0;
    }

    .my-car-field-label {
      font-size: 11px;
      font-weight: 600;
      color: var(--muted);
    }

    .my-car-input {
      width: 100%;
      min-width: 0;
      padding: 10px 12px;
      border: 1px solid var(--border-strong, var(--border));
      border-radius: 10px;
      background: var(--input-bg, var(--bg));
      color: var(--text);
      font-family: inherit;
      font-size: 13px;
      outline: none;
    }

    .my-car-input:focus {
      border-color: var(--accent);
    }

    .my-car-input:disabled {
      opacity: 0.65;
    }

    .my-car-field-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .my-car-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .my-car-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      min-height: 44px;
      padding: 0 14px;
      border-radius: 12px;
      border: none;
      font-family: inherit;
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
    }

    .my-car-btn-primary {
      grid-column: 1 / -1;
      background: var(--accent);
      color: var(--accent-fg);
    }

    .my-car-btn-secondary {
      background: color-mix(in srgb, var(--accent) 14%, transparent);
      color: var(--accent);
      border: 1px solid color-mix(in srgb, var(--accent) 30%, var(--border));
    }

    .my-car-btn-ghost {
      background: transparent;
      color: var(--muted);
      border: 1px solid var(--border);
    }

    .my-car-btn:disabled {
      opacity: 0.6;
      cursor: wait;
    }

    .my-car-btn-spinner {
      display: none;
      width: 14px;
      height: 14px;
      border: 2px solid color-mix(in srgb, var(--accent-fg, #fff) 35%, transparent);
      border-top-color: var(--accent-fg, #fff);
      border-radius: 50%;
      animation: spin 0.75s linear infinite;
    }

    .my-car-btn-primary.is-loading .my-car-btn-spinner {
      display: inline-block;
    }

    .my-car-status {
      margin: 0;
      font-size: 11px;
      color: var(--muted);
    }

    .my-car-status.is-error {
      color: #f87171;
    }

    .my-car-status.is-loading {
      color: var(--accent);
      font-weight: 600;
    }

    [data-theme="light"] .my-cars-wrap,
    [data-theme="light"] .my-car-form,
    [data-theme="light"] .my-car-item {
      box-shadow: var(--card-shadow, 0 1px 2px rgba(15, 23, 42, 0.05), 0 4px 14px rgba(15, 23, 42, 0.06));
    }

    .divar-estimate-card {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 14px 12px 12px;
      border: 1px solid var(--border);
      border-radius: 14px;
      background: var(--surface);
      position: relative;
    }

    .estimate-dismiss-btn {
      position: absolute;
      top: 8px;
      left: 8px;
      z-index: 2;
      width: 32px;
      height: 32px;
      border: 1px solid var(--border);
      border-radius: 999px;
      background: color-mix(in srgb, var(--surface-2) 80%, transparent);
      color: var(--muted);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      cursor: pointer;
    }

    .estimate-dismiss-btn svg {
      width: 16px;
      height: 16px;
    }

    .estimate-dismiss-btn:hover {
      color: var(--text);
      border-color: var(--border-strong);
    }

    .estimate-dismiss-btn:active {
      transform: scale(0.96);
    }

    .estimate-vehicle {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .estimate-car-image {
      width: min(72%, 220px);
      height: auto;
      max-height: 110px;
      object-fit: contain;
      display: block;
    }

    .estimate-car-image-fallback {
      width: 120px;
      height: 72px;
      border-radius: 10px;
      background:
        linear-gradient(135deg, color-mix(in srgb, var(--surface-2) 80%, transparent), var(--surface-2));
    }

    .estimate-specs {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr auto 1fr auto 1fr;
      align-items: center;
      gap: 0;
    }

    .estimate-spec-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      text-align: center;
      min-width: 0;
      padding: 0 4px;
    }

    .estimate-spec-primary {
      font-size: 13px;
      font-weight: 700;
      color: var(--text);
      line-height: 1.35;
    }

    .estimate-spec-secondary {
      font-size: 11px;
      color: var(--muted);
      line-height: 1.35;
    }

    .estimate-spec-divider {
      width: 1px;
      height: 28px;
      background: var(--border);
      opacity: 0.9;
    }

    .estimate-location {
      margin: 0;
      font-size: 11px;
      color: var(--muted-2);
      text-align: center;
    }

    .estimate-range {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-top: 4px;
    }

    .estimate-range-prices {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: end;
      gap: 6px;
      min-height: 44px;
    }

    .estimate-range-side {
      font-size: 11px;
      color: var(--muted);
      line-height: 1.35;
      white-space: nowrap;
    }

    .estimate-range-prices > .estimate-range-side:first-child {
      justify-self: start;
      text-align: left;
    }

    .estimate-range-prices > .estimate-range-side:last-child {
      justify-self: end;
      text-align: right;
    }

    .estimate-range-bubble {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 8px 12px;
      border-radius: 12px;
      background: color-mix(in srgb, var(--surface-2) 85%, #94a3b8 15%);
      color: var(--text);
      font-size: 12px;
      font-weight: 800;
      line-height: 1.3;
      white-space: nowrap;
      box-shadow: 0 1px 0 color-mix(in srgb, var(--border) 70%, transparent);
    }

    .estimate-range-bubble::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: -6px;
      width: 12px;
      height: 12px;
      transform: translateX(-50%) rotate(45deg);
      background: inherit;
      border-radius: 2px;
    }

    .estimate-range-bar {
      display: flex;
      width: 100%;
      height: 14px;
      border-radius: 999px;
      overflow: hidden;
      margin-top: 2px;
    }

    .estimate-range-seg {
      display: block;
      height: 100%;
    }

    .estimate-range-seg.is-min {
      flex: 0 0 18%;
      background: #b7e4c7;
    }

    .estimate-range-seg.is-mid {
      flex: 1 1 auto;
      background: #2f9e44;
    }

    .estimate-range-seg.is-max {
      flex: 0 0 22%;
      background: #74c69d;
    }

    .estimate-range-labels {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: #4c6ef5;
    }

    [data-theme="dark"] .estimate-range-labels {
      color: #91a7ff;
    }

    [data-theme="light"] .market-bottom-nav {
      background: rgba(255, 255, 255, 0.94);
      border: 1px solid var(--border);
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
    }

    [data-theme="light"] .market-nav-item {
      color: var(--muted);
    }

    [data-theme="light"] .market-nav-item.active {
      color: var(--accent);
    }

    [data-theme="light"] .price-hero-card,
    [data-theme="light"] .divar-estimate-card,
    [data-theme="light"] .car-price-card,
    [data-theme="light"] .market-more-section,
    [data-theme="light"] .divar-estimate-wrap,
    [data-theme="light"] .my-cars-wrap,
    [data-theme="light"] .my-car-form,
    [data-theme="light"] .rate-card,
    [data-theme="light"] .cars-panel-intro {
      box-shadow: var(--card-shadow, 0 1px 2px rgba(15, 23, 42, 0.05), 0 4px 14px rgba(15, 23, 42, 0.06));
      border-color: var(--border);
    }

    /* Keep hero vivid in light mode so white text stays readable */
    [data-theme="light"] .price-hero-card {
      background: linear-gradient(
        135deg,
        color-mix(in srgb, var(--accent) 62%, #0f172a) 0%,
        color-mix(in srgb, var(--accent) 86%, #1e293b) 30%,
        color-mix(in srgb, var(--accent-glow, var(--accent)) 78%, var(--accent)) 64%,
        color-mix(in srgb, var(--accent-glow, var(--accent)) 42%, #fff7ed) 100%
      );
      border: none;
      color: #fff;
      box-shadow: 0 14px 28px color-mix(in srgb, var(--accent) 24%, transparent);
    }

    [data-theme="light"] .price-hero-card-kicker,
    [data-theme="light"] .price-hero-card-subtitle,
    [data-theme="light"] .price-hero-card-time,
    [data-theme="light"] .price-hero-share-hint {
      color: rgba(255, 255, 255, 0.8);
    }

    [data-theme="light"] .price-hero-card-title,
    [data-theme="light"] .price-hero-card-value {
      color: #fff;
    }

    [data-theme="light"] .price-hero-card-icon {
      background: rgba(255, 255, 255, 0.18);
    }

    [data-theme="light"] .price-hero-card-change.is-up,
    [data-theme="light"] .price-hero-card-change.is-down,
    [data-theme="light"] .price-hero-card-change.is-flat {
      background: rgba(255, 255, 255, 0.18);
      color: #fff;
    }

    [data-theme="light"] .price-hero-share-row .market-share-icon-btn {
      background: color-mix(in srgb, var(--accent) 70%, #0f172a);
      color: #fff;
      border: none;
      box-shadow: 0 8px 18px color-mix(in srgb, var(--accent) 28%, transparent);
    }

    [data-theme="light"] .gold-subtabs,
    [data-theme="light"] .cars-subtabs,
    [data-theme="light"] .more-subtabs,
    [data-theme="light"] .housing-deal-toggle {
      background: #ffffff;
      border-color: var(--border-strong);
    }

    [data-theme="light"] .gold-subtab-btn.is-active,
    [data-theme="light"] .cars-subtab-btn.is-active,
    [data-theme="light"] .more-subtab-btn.is-active,
    [data-theme="light"] .housing-deal-btn.is-active {
      background: color-mix(in srgb, var(--accent) 14%, #ffffff);
      color: var(--accent);
    }

    [data-theme="light"] .rate-card {
      background: #ffffff;
      border-color: var(--border);
    }

    [data-theme="light"] .rate-card-title,
    [data-theme="light"] .rate-card-price {
      color: var(--text);
    }

    [data-theme="light"] .rate-card-subtitle {
      color: var(--muted);
    }

    [data-theme="light"] .rate-card-icon {
      background: color-mix(in srgb, var(--accent) 12%, var(--surface-2));
    }

    [data-theme="light"] .cars-panel-intro {
      background: linear-gradient(
        135deg,
        color-mix(in srgb, var(--accent) 10%, #ffffff) 0%,
        #ffffff 100%
      );
      border-color: color-mix(in srgb, var(--accent) 20%, var(--border));
    }

    [data-theme="light"] .cars-panel-intro-title,
    [data-theme="light"] .cars-estimate-section-title,
    [data-theme="light"] .price-section-title {
      color: var(--text);
    }

    [data-theme="light"] .cars-panel-intro-hint,
    [data-theme="light"] .cars-estimate-section-hint {
      color: var(--muted);
    }

    [data-theme="light"] .update-sheet {
      background: var(--surface);
      color: var(--text);
    }

    [data-theme="light"] .update-sheet-icon-wrap {
      background: var(--update-icon-ring);
    }

    [data-theme="light"] .update-sheet-icon {
      background: var(--update-icon-bg);
      color: var(--update-icon-fg);
    }

    [data-theme="light"] .wage-mode-btn.active,
    [data-theme="light"] .wage-weight-unit-btn.active {
      background: color-mix(in srgb, var(--accent) 14%, #ffffff);
      color: var(--accent);
    }

    [data-theme="light"] .card,
    [data-theme="light"] .card-dark {
      background: #ffffff;
      border-color: var(--border);
      color: var(--text);
    }

    [data-theme="light"] .card-title,
    [data-theme="light"] .card-price,
    [data-theme="light"] .total {
      color: var(--text);
    }

    [data-theme="light"] .card-time,
    [data-theme="light"] .muted,
    [data-theme="light"] .card-board-label {
      color: var(--muted);
    }

    [data-theme="light"] .cars-search-input,
    [data-theme="light"] .divar-estimate-input,
    [data-theme="light"] .market-more-input,
    [data-theme="light"] .my-car-input,
    [data-theme="light"] .housing-input,
    [data-theme="light"] .wage-input {
      background: var(--input-bg);
      border-color: var(--border-strong);
      color: var(--text);
    }

    [data-theme="light"] .cars-search-input::placeholder,
    [data-theme="light"] .divar-estimate-input::placeholder {
      color: var(--muted-2);
    }

    [data-theme="light"] .estimate-range-bubble {
      background: #e2e8f0;
      color: #0f172a;
      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
    }

    [data-theme="light"] .estimate-range-labels {
      color: #334155;
    }

    [data-theme="light"] .estimate-range-seg.is-min {
      background: #86efac;
    }

    [data-theme="light"] .estimate-range-seg.is-mid {
      background: #16a34a;
    }

    [data-theme="light"] .estimate-range-seg.is-max {
      background: #4ade80;
    }

    [data-theme="light"] .divar-estimate-verdict.is-cheap {
      background: #dcfce7;
      color: #166534;
    }

    [data-theme="light"] .divar-estimate-verdict.is-expensive {
      background: #fee2e2;
      color: #991b1b;
    }

    [data-theme="light"] .divar-estimate-verdict.is-fair {
      background: #fef3c7;
      color: #92400e;
    }

    [data-theme="light"] .estimate-dismiss-btn {
      background: #ffffff;
      border-color: var(--border-strong);
      color: var(--muted);
    }

    [data-theme="light"] .market-more-row {
      border-color: var(--border);
      background: var(--surface);
      color: var(--text);
    }

    [data-theme="light"] .market-header-compact,
    [data-theme="light"] .market-settings-btn {
      border-color: var(--border);
    }

    [data-theme="light"] .divar-estimate-btn {
      background: var(--accent);
      color: var(--accent-fg);
    }

    [data-theme="light"] .car-price-chip-change.is-up {
      background: #d1fae5;
      color: #047857;
    }

    [data-theme="light"] .car-price-chip-change.is-down {
      background: #fee2e2;
      color: #b91c1c;
    }

    [data-theme="light"] .car-price-chip-change.is-flat {
      background: #e2e8f0;
      color: #475569;
    }

    [data-theme="light"] .car-price-chip {
      background: var(--surface-2);
      border-color: var(--border);
    }

    [data-theme="light"] .estimate-ad-row {
      background: var(--surface-2);
      border: 1px solid var(--border);
    }

    [data-theme="light"] .market-price-toast {
      background: #0f172a;
      color: #ffffff;
    }

    [data-theme="light"] .market-nav-fab {
      box-shadow: 0 8px 20px color-mix(in srgb, var(--accent) 35%, transparent);
    }

    .estimate-range-labels > span:first-child {
      justify-self: start;
      text-align: left;
    }

    .estimate-range-labels > span:last-child {
      justify-self: end;
      text-align: right;
    }

    .estimate-range-center-label {
      justify-self: center;
      text-align: center;
      font-weight: 700;
      color: var(--text) !important;
      font-size: 12px;
    }

    .estimate-ad-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 10px;
      background: color-mix(in srgb, var(--surface-2) 75%, transparent);
    }

    .estimate-ad-label {
      font-size: 11px;
      color: var(--muted);
    }

    .estimate-ad-value {
      font-size: 12px;
      font-weight: 700;
      color: var(--text);
      font-variant-numeric: tabular-nums;
    }

    .divar-estimate-verdict {
      font-size: 12px;
      font-weight: 600;
      text-align: center;
      padding: 8px;
      border-radius: 10px;
    }

    .divar-estimate-verdict.is-cheap {
      background: color-mix(in srgb, #22c55e 18%, transparent);
      color: #4ade80;
    }

    .divar-estimate-verdict.is-expensive {
      background: color-mix(in srgb, #ef4444 18%, transparent);
      color: #f87171;
    }

    .divar-estimate-verdict.is-fair {
      background: color-mix(in srgb, #eab308 18%, transparent);
      color: #facc15;
    }

    .cars-search-input {
      width: 100%;
      min-width: 0;
      padding: 12px 14px;
      border: 1px solid var(--border-strong, var(--border));
      border-radius: 14px;
      background: var(--surface);
      color: var(--text);
      font-family: inherit;
      font-size: 13px;
      outline: none;
      box-shadow: 0 1px 0 rgba(255, 255, 255, 0.03);
    }

    .cars-search-input::placeholder {
      color: var(--muted-2);
    }

    .cars-search-input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 18%, transparent);
    }

    .cars-list-wrap {
      flex: 1 1 auto;
      min-height: 0;
      overflow: visible;
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
    const housingViewEl = document.getElementById("view-housing");
    const moreViewEl = document.getElementById("view-more");
    const moreSettingsPanelEl = document.getElementById("moreSettingsPanel");
    const moreDonatePanelEl = document.getElementById("moreDonatePanel");
    const moreAboutPanelEl = document.getElementById("moreAboutPanel");
    const moreSubtabButtons = document.querySelectorAll("[data-more-subtab]");
    const currencyListEl = document.getElementById("currencyList");
    const goldListEl = document.getElementById("goldList");
    const goldCalcListEl = document.getElementById("goldCalcList");
    const goldPricesPanelEl = document.getElementById("goldPricesPanel");
    const goldCalcPanelEl = document.getElementById("goldCalcPanel");
    const goldSubtabButtons = document.querySelectorAll("[data-gold-subtab]");
    const carsPricesPanelEl = document.getElementById("carsPricesPanel");
    const carsEstimatePanelEl = document.getElementById("carsEstimatePanel");
    const carsSubtabButtons = document.querySelectorAll("[data-cars-subtab]");
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
    const accentColorPickerEl = document.getElementById("accentColorPicker");
    const alertsEnabledEl = document.getElementById("alertsEnabled");
    const alertsThresholdEl = document.getElementById("alertsThreshold");
    const priceToastEl = document.getElementById("priceToast");
    const shareApkBtn = document.getElementById("shareApkBtn");
    const divarUrlInputEl = document.getElementById("divarUrlInput");
    const divarEstimateBtnEl = document.getElementById("divarEstimateBtn");
    const divarEstimateStatusEl = document.getElementById("divarEstimateStatus");
    const divarEstimateResultEl = document.getElementById("divarEstimateResult");
    const myCarsListEl = document.getElementById("myCarsList");
    const myCarsEmptyEl = document.getElementById("myCarsEmpty");
    const myCarEstimateFormEl = document.getElementById("myCarEstimateForm");
    const myCarNicknameEl = document.getElementById("myCarNickname");
    const myCarBrandEl = document.getElementById("myCarBrand");
    const myCarModelEl = document.getElementById("myCarModel");
    const myCarTrimEl = document.getElementById("myCarTrim");
    const myCarYearEl = document.getElementById("myCarYear");
    const myCarMileageEl = document.getElementById("myCarMileage");
    const myCarBodyStatusEl = document.getElementById("myCarBodyStatus");
    const myCarEstimateBtnEl = document.getElementById("myCarEstimateBtn");
    const myCarSaveBtnEl = document.getElementById("myCarSaveBtn");
    const myCarCancelEditBtnEl = document.getElementById("myCarCancelEditBtn");
    const myCarFormModeHintEl = document.getElementById("myCarFormModeHint");
    const myCarEstimateStatusEl = document.getElementById("myCarEstimateStatus");
    const myCarEstimateResultEl = document.getElementById("myCarEstimateResult");
    const housingSearchFormEl = document.getElementById("housingSearchForm");
    const housingCityEl = document.getElementById("housingCity");
    const housingBudgetMaxEl = document.getElementById("housingBudgetMax");
    const housingCreditMaxEl = document.getElementById("housingCreditMax");
    const housingRentMaxEl = document.getElementById("housingRentMax");
    const housingSizeMinEl = document.getElementById("housingSizeMin");
    const housingSizeMaxEl = document.getElementById("housingSizeMax");
    const housingRoomsEl = document.getElementById("housingRooms");
    const housingBuyFieldsEl = document.getElementById("housingBuyFields");
    const housingRentFieldsEl = document.getElementById("housingRentFields");
    const housingSearchBtnEl = document.getElementById("housingSearchBtn");
    const housingStatusEl = document.getElementById("housingStatus");
    const housingLoadingEl = document.getElementById("housingLoading");
    const housingResultsWrapEl = document.getElementById("housingResultsWrap");
    const housingListEl = document.getElementById("housingList");
    const housingLoadMoreBtnEl = document.getElementById("housingLoadMoreBtn");
    const housingDealButtons = document.querySelectorAll("[data-housing-deal]");

    let activeMarketTab = "currency";
    let activeGoldSubtab = "prices";
    try {
      const savedGoldSubtab = localStorage.getItem("market-prices-gold-subtab");
      if (savedGoldSubtab === "calc" || savedGoldSubtab === "prices") activeGoldSubtab = savedGoldSubtab;
    } catch (e) {}
    let activeCarsSubtab = "prices";
    try {
      const savedCarsSubtab = localStorage.getItem("market-prices-cars-subtab");
      if (savedCarsSubtab === "estimate" || savedCarsSubtab === "prices") activeCarsSubtab = savedCarsSubtab;
    } catch (e) {}
    let activeMoreSubtab = "settings";
    try {
      const savedMoreSubtab = localStorage.getItem("market-prices-more-subtab");
      if (savedMoreSubtab === "donate" || savedMoreSubtab === "about" || savedMoreSubtab === "settings") {
        activeMoreSubtab = savedMoreSubtab;
      }
    } catch (e) {}
    let carRows = [];
    let carsLoaded = false;
    let pricesLoaded = false;
    let latestMarketPrices = null;
    let previousPricesSnapshot = null;
    let toastHideTimer = null;
    let shareCardBusy = false;
    let divarEstimateBusy = false;
    let housingDealKey = "buy";
    let housingBusy = false;
    let housingPaginationData = null;
    let housingHasNextPage = false;
    let housingLastQuery = null;
    let myCarEstimateBusy = false;
    let bamaVehiclesTree = null;
    let savedCars = [];
    let editingCarId = null;
    let selectedCarId = null;
    const SAVED_CARS_STORAGE_KEY = "market-prices-saved-cars";
    const HOUSING_PREFS_KEY = "market-prices-housing-search";

    function setDivarEstimateStatus(message, isError, isLoading) {
      if (!divarEstimateStatusEl) return;
      if (!message) {
        divarEstimateStatusEl.classList.add("hidden");
        divarEstimateStatusEl.textContent = "";
        divarEstimateStatusEl.classList.remove("is-error");
        divarEstimateStatusEl.classList.remove("is-loading");
        return;
      }
      divarEstimateStatusEl.textContent = message;
      divarEstimateStatusEl.classList.toggle("is-error", !!isError);
      divarEstimateStatusEl.classList.toggle("is-loading", !!isLoading);
      divarEstimateStatusEl.classList.remove("hidden");
    }

    function setDivarEstimateLoading(loading) {
      divarEstimateBusy = loading;
      if (divarEstimateBtnEl) {
        divarEstimateBtnEl.disabled = loading;
        divarEstimateBtnEl.classList.toggle("is-loading", loading);
        const label = divarEstimateBtnEl.querySelector(".divar-estimate-btn-label");
        if (label) label.textContent = loading ? "صبر کنید..." : "تخمین";
      }
      if (divarUrlInputEl) divarUrlInputEl.disabled = loading;
    }

    function clearDivarEstimateResult() {
      if (divarEstimateResultEl) {
        divarEstimateResultEl.classList.add("hidden");
        divarEstimateResultEl.innerHTML = "";
      }
      setDivarEstimateStatus("", false);
    }

    function handleDivarEstimateClick() {
      if (divarEstimateBusy) return;
      const url = divarUrlInputEl ? divarUrlInputEl.value.trim() : "";
      if (!url) {
        setDivarEstimateStatus("لینک آگهی دیوار را وارد کنید", true);
        return;
      }

      setDivarEstimateLoading(true);
      clearDivarEstimateResult();
      setDivarEstimateStatus("در حال خواندن آگهی و تخمین قیمت...", false, true);

      // AndroidApp.httpGet is synchronous and blocks the JS thread.
      // Yield so the loading spinner can paint before the network call starts.
      setTimeout(function () {
        Promise.resolve(estimateFromDivarUrl(url))
          .then(function (result) {
            if (divarEstimateResultEl) {
              divarEstimateResultEl.innerHTML = renderDivarEstimateResult(result);
              divarEstimateResultEl.classList.remove("hidden");
            }
            setDivarEstimateStatus("", false);
            if (divarUrlInputEl) divarUrlInputEl.value = "";
          })
          .catch(function (error) {
            console.error("Divar estimate error:", error);
            setDivarEstimateStatus((error && error.message) || "تخمین قیمت ممکن نشد", true);
          })
          .finally(function () {
            setDivarEstimateLoading(false);
          });
      }, 80);
    }

    function loadSavedCars() {
      try {
        const raw = localStorage.getItem(SAVED_CARS_STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }

    function persistSavedCars() {
      try {
        localStorage.setItem(SAVED_CARS_STORAGE_KEY, JSON.stringify(savedCars));
      } catch (e) {}
    }

    function createSavedCarId() {
      return "car-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
    }

    function currentJalaliYear() {
      try {
        return Number(
          new Date().toLocaleDateString("fa-IR-u-nu-latn", { year: "numeric", calendar: "persian" }),
        );
      } catch (e) {
        return 1404;
      }
    }

    function fillMyCarYearOptions() {
      if (!myCarYearEl) return;
      const now = currentJalaliYear();
      const options = [];
      for (let year = now; year >= now - 45; year -= 1) {
        options.push('<option value="' + year + '">' + year + "</option>");
      }
      myCarYearEl.innerHTML = options.join("");
    }

    function fillMyCarBodyStatusOptions() {
      if (!myCarBodyStatusEl) return;
      const options =
        typeof BAMA_BODY_STATUS_OPTIONS !== "undefined" ? BAMA_BODY_STATUS_OPTIONS : [
          { value: "Healthy", labelFa: "سالم و بدون رنگ" },
          { value: "Painted", labelFa: "دوررنگ" },
          { value: "Repainted", labelFa: "تمام‌رنگ" },
          { value: "Damaged", labelFa: "آسیب‌دیده" },
        ];
      myCarBodyStatusEl.innerHTML = options
        .map(function (item) {
          return '<option value="' + item.value + '">' + item.labelFa + "</option>";
        })
        .join("");
    }

    function setMyCarStatus(message, isError, isLoading) {
      if (!myCarEstimateStatusEl) return;
      if (!message) {
        myCarEstimateStatusEl.classList.add("hidden");
        myCarEstimateStatusEl.textContent = "";
        myCarEstimateStatusEl.classList.remove("is-error", "is-loading");
        return;
      }
      myCarEstimateStatusEl.textContent = message;
      myCarEstimateStatusEl.classList.toggle("is-error", !!isError);
      myCarEstimateStatusEl.classList.toggle("is-loading", !!isLoading);
      myCarEstimateStatusEl.classList.remove("hidden");
    }

    function setMyCarEstimateLoading(loading) {
      myCarEstimateBusy = loading;
      if (myCarEstimateBtnEl) {
        myCarEstimateBtnEl.disabled = loading;
        myCarEstimateBtnEl.classList.toggle("is-loading", loading);
        const label = myCarEstimateBtnEl.querySelector(".my-car-btn-label");
        if (label) label.textContent = loading ? "در حال تخمین..." : "تخمین قیمت";
      }
      if (myCarSaveBtnEl) myCarSaveBtnEl.disabled = loading;
      if (myCarBrandEl) myCarBrandEl.disabled = loading;
      if (myCarModelEl) myCarModelEl.disabled = loading || !(myCarBrandEl && myCarBrandEl.value);
      if (myCarTrimEl) {
        const onlyPlaceholder =
          myCarTrimEl.options.length <= 1 ||
          (myCarTrimEl.options.length === 1 && !myCarTrimEl.options[0].value);
        myCarTrimEl.disabled = loading || onlyPlaceholder || !(myCarModelEl && myCarModelEl.value);
      }
    }

    function clearMyCarEstimateResult() {
      if (myCarEstimateResultEl) {
        myCarEstimateResultEl.classList.add("hidden");
        myCarEstimateResultEl.innerHTML = "";
      }
    }

    function buildCarDisplayTitle(car) {
      if (car.nickname) return car.nickname;
      return [car.brandFa, car.modelFa, car.trimFa].filter(Boolean).join(" ");
    }

    function renderSavedCarsList() {
      if (!myCarsListEl) return;
      if (!savedCars.length) {
        myCarsListEl.innerHTML = "";
        if (myCarsEmptyEl) myCarsEmptyEl.classList.remove("hidden");
        return;
      }
      if (myCarsEmptyEl) myCarsEmptyEl.classList.add("hidden");
      myCarsListEl.innerHTML = savedCars
        .map(function (car) {
          const title = escapeHtml(buildCarDisplayTitle(car));
          const meta = escapeHtml(
            [car.brandFa, car.modelFa, car.trimFa, car.modelYear ? "سال " + car.modelYear : "", car.mileage != null ? Number(car.mileage).toLocaleString("en-US") + " کیلومتر" : ""]
              .filter(Boolean)
              .join(" · "),
          );
          const activeClass = car.id === selectedCarId || car.id === editingCarId ? " is-active" : "";
          return (
            '<article class="my-car-item' +
            activeClass +
            '" data-saved-car-id="' +
            escapeHtml(car.id) +
            '">' +
            '<p class="my-car-item-title">' +
            title +
            "</p>" +
            '<p class="my-car-item-meta">' +
            meta +
            "</p>" +
            '<div class="my-car-item-actions">' +
            '<button type="button" class="my-car-item-btn is-primary" data-car-action="estimate">تخمین</button>' +
            '<button type="button" class="my-car-item-btn" data-car-action="edit">ویرایش</button>' +
            '<button type="button" class="my-car-item-btn" data-car-action="select">انتخاب</button>' +
            '<button type="button" class="my-car-item-btn is-danger" data-car-action="delete">حذف</button>' +
            "</div></article>"
          );
        })
        .join("");
    }

    function syncMyCarFormModeHint() {
      if (!myCarFormModeHintEl) return;
      if (editingCarId) {
        myCarFormModeHintEl.textContent = "در حال ویرایش خودرو ذخیره‌شده";
      } else {
        myCarFormModeHintEl.textContent = "برند، مدل، سال و کارکرد را وارد کنید";
      }
      if (myCarCancelEditBtnEl) myCarCancelEditBtnEl.classList.toggle("hidden", !editingCarId);
      if (myCarSaveBtnEl) myCarSaveBtnEl.textContent = editingCarId ? "بروزرسانی" : "ذخیره";
    }

    function resetMyCarForm() {
      editingCarId = null;
      if (myCarNicknameEl) myCarNicknameEl.value = "";
      if (myCarBrandEl) myCarBrandEl.value = "";
      populateMyCarModels();
      if (myCarYearEl) myCarYearEl.value = String(currentJalaliYear());
      if (myCarMileageEl) myCarMileageEl.value = "";
      if (myCarBodyStatusEl) myCarBodyStatusEl.value = "Healthy";
      syncMyCarFormModeHint();
      clearMyCarEstimateResult();
      setMyCarStatus("");
      renderSavedCarsList();
    }

    function populateMyCarBrands() {
      if (!myCarBrandEl || !bamaVehiclesTree) return;
      const brands = bamaVehiclesTree
        .slice()
        .sort(function (a, b) {
          return String(a.brand_name_fa || "").localeCompare(String(b.brand_name_fa || ""), "fa");
        });
      myCarBrandEl.innerHTML =
        '<option value="">انتخاب برند</option>' +
        brands
          .map(function (brand) {
            return (
              '<option value="' +
              brand.brand_id +
              '">' +
              escapeHtml(brand.brand_name_fa || brand.brand_name || "") +
              "</option>"
            );
          })
          .join("");
    }

    function populateMyCarModels(selectedModelId) {
      if (!myCarModelEl) return;
      const brandId = myCarBrandEl ? myCarBrandEl.value : "";
      if (!brandId || !bamaVehiclesTree) {
        myCarModelEl.innerHTML = '<option value="">ابتدا برند را انتخاب کنید</option>';
        myCarModelEl.disabled = true;
        populateMyCarTrims();
        return;
      }
      const brand = bamaVehiclesTree.find(function (item) {
        return String(item.brand_id) === String(brandId);
      });
      const models = ((brand && brand.models) || []).slice().sort(function (a, b) {
        return String(a.model_name_fa || "").localeCompare(String(b.model_name_fa || ""), "fa");
      });
      myCarModelEl.innerHTML =
        '<option value="">انتخاب مدل</option>' +
        models
          .map(function (model) {
            return (
              '<option value="' +
              model.model_id +
              '">' +
              escapeHtml(model.model_name_fa || model.model_name || "") +
              "</option>"
            );
          })
          .join("");
      myCarModelEl.disabled = false;
      if (selectedModelId) myCarModelEl.value = String(selectedModelId);
      populateMyCarTrims();
    }

    function populateMyCarTrims(selectedTrimId) {
      if (!myCarTrimEl) return;
      const brandId = myCarBrandEl ? myCarBrandEl.value : "";
      const modelId = myCarModelEl ? myCarModelEl.value : "";
      if (!brandId || !modelId || !bamaVehiclesTree) {
        myCarTrimEl.innerHTML = '<option value="">در صورت نیاز</option>';
        myCarTrimEl.disabled = true;
        return;
      }
      const matched =
        typeof findBamaBrandModelTrim === "function"
          ? findBamaBrandModelTrim(bamaVehiclesTree, brandId, modelId, null)
          : null;
      const trims = (matched && matched.trims) || [];
      if (!trims.length) {
        myCarTrimEl.innerHTML = '<option value="">بدون تیپ</option>';
        myCarTrimEl.disabled = true;
        return;
      }
      myCarTrimEl.innerHTML =
        '<option value="">انتخاب تیپ</option>' +
        trims
          .map(function (trim) {
            return (
              '<option value="' +
              trim.trim_id +
              '">' +
              escapeHtml(trim.trim_name_fa || trim.trim_name || "") +
              "</option>"
            );
          })
          .join("");
      myCarTrimEl.disabled = false;
      if (selectedTrimId != null && selectedTrimId !== "") myCarTrimEl.value = String(selectedTrimId);
    }

    function readMyCarFormSelection() {
      const brandId = myCarBrandEl ? myCarBrandEl.value : "";
      const modelId = myCarModelEl ? myCarModelEl.value : "";
      const trimId = myCarTrimEl && !myCarTrimEl.disabled ? myCarTrimEl.value : "";
      const modelYear = myCarYearEl ? Number(myCarYearEl.value) : NaN;
      const mileage = parseHousingMoneyInput(myCarMileageEl ? myCarMileageEl.value : "");
      const bodyStatus = myCarBodyStatusEl ? myCarBodyStatusEl.value : "Healthy";
      const nickname = myCarNicknameEl ? myCarNicknameEl.value.trim() : "";
      const matched =
        typeof findBamaBrandModelTrim === "function"
          ? findBamaBrandModelTrim(bamaVehiclesTree, brandId, modelId, trimId || null)
          : null;
      return {
        brandId: brandId ? Number(brandId) : null,
        modelId: modelId ? Number(modelId) : null,
        trimId: trimId ? Number(trimId) : null,
        modelYear: modelYear,
        mileage: mileage == null ? null : mileage,
        bodyStatus: bodyStatus || "Healthy",
        nickname: nickname,
        brandFa: matched ? matched.brand.brand_name_fa || "" : "",
        modelFa: matched ? matched.model.model_name_fa || "" : "",
        trimFa: matched && matched.trim ? matched.trim.trim_name_fa || "" : "",
      };
    }

    function validateMyCarSelection(selection, requireMileage) {
      if (!selection.brandId) return "برند خودرو را انتخاب کنید";
      if (!selection.modelId) return "مدل خودرو را انتخاب کنید";
      if (myCarTrimEl && !myCarTrimEl.disabled && !selection.trimId) return "تیپ خودرو را انتخاب کنید";
      if (!selection.modelYear || selection.modelYear < 1300) return "سال ساخت را انتخاب کنید";
      if (requireMileage && (selection.mileage == null || selection.mileage < 0)) {
        return "کارکرد خودرو را وارد کنید";
      }
      return "";
    }

    function fillMyCarFormFromSaved(car) {
      if (!car) return;
      editingCarId = car.id;
      selectedCarId = car.id;
      if (myCarNicknameEl) myCarNicknameEl.value = car.nickname || "";
      if (myCarBrandEl) myCarBrandEl.value = String(car.brandId || "");
      populateMyCarModels(car.modelId);
      populateMyCarTrims(car.trimId);
      if (myCarYearEl && car.modelYear) myCarYearEl.value = String(car.modelYear);
      if (myCarMileageEl) {
        myCarMileageEl.value =
          car.mileage != null ? formatHousingMoneyInput(Number(car.mileage)) : "";
      }
      if (myCarBodyStatusEl) myCarBodyStatusEl.value = car.bodyStatus || "Healthy";
      syncMyCarFormModeHint();
      renderSavedCarsList();
      setMyCarStatus("خودرو برای ویرایش/تخمین انتخاب شد", false);
    }

    function upsertSavedCarFromForm() {
      const selection = readMyCarFormSelection();
      const error = validateMyCarSelection(selection, true);
      if (error) {
        setMyCarStatus(error, true);
        return null;
      }
      const payload = {
        id: editingCarId || createSavedCarId(),
        nickname: selection.nickname,
        brandId: selection.brandId,
        modelId: selection.modelId,
        trimId: selection.trimId,
        brandFa: selection.brandFa,
        modelFa: selection.modelFa,
        trimFa: selection.trimFa,
        modelYear: selection.modelYear,
        mileage: selection.mileage,
        bodyStatus: selection.bodyStatus,
        updatedAt: Date.now(),
      };
      const index = savedCars.findIndex(function (item) {
        return item.id === payload.id;
      });
      if (index >= 0) savedCars[index] = payload;
      else savedCars.unshift(payload);
      editingCarId = payload.id;
      selectedCarId = payload.id;
      persistSavedCars();
      renderSavedCarsList();
      syncMyCarFormModeHint();
      return payload;
    }

    function runMyCarEstimate(selection) {
      if (myCarEstimateBusy) return;
      const error = validateMyCarSelection(selection, true);
      if (error) {
        setMyCarStatus(error, true);
        return;
      }
      setMyCarEstimateLoading(true);
      clearMyCarEstimateResult();
      setMyCarStatus("در حال تخمین قیمت...", false, true);
      setTimeout(function () {
        Promise.resolve(estimateBamaPriceFromSelection(selection))
          .then(function (estimate) {
            const result = {
              ad: {
                price: 0,
                color: "",
                city: "",
                neighborhood: "",
                brandModelFa: [selection.brandFa, selection.modelFa, selection.trimFa]
                  .filter(Boolean)
                  .join(" "),
              },
              estimate: estimate,
            };
            if (myCarEstimateResultEl) {
              myCarEstimateResultEl.innerHTML = renderDivarEstimateResult(result);
              myCarEstimateResultEl.classList.remove("hidden");
            }
            setMyCarStatus("", false);
          })
          .catch(function (err) {
            console.error("Manual car estimate error:", err);
            setMyCarStatus((err && err.message) || "تخمین قیمت ممکن نشد", true);
          })
          .finally(function () {
            setMyCarEstimateLoading(false);
          });
      }, 40);
    }

    function ensureMyCarCatalog() {
      if (bamaVehiclesTree) return Promise.resolve(bamaVehiclesTree);
      setMyCarStatus("در حال دریافت فهرست خودروها...", false, true);
      return Promise.resolve(getBamaCalculatorVehicles())
        .then(function (tree) {
          bamaVehiclesTree = tree;
          populateMyCarBrands();
          setMyCarStatus("");
          return tree;
        })
        .catch(function (err) {
          console.error("Bama vehicles load error:", err);
          setMyCarStatus((err && err.message) || "دریافت فهرست خودروها ممکن نشد", true);
          throw err;
        });
    }

    function initMyCarEstimateTab() {
      savedCars = loadSavedCars();
      fillMyCarYearOptions();
      fillMyCarBodyStatusOptions();
      syncMyCarFormModeHint();
      renderSavedCarsList();
      bindCommaSeparatedNumberInput(myCarMileageEl);
    }

    function setShareButtonsDisabled(disabled) {
      document.querySelectorAll(".market-share-icon-btn").forEach(function (btn) {
        btn.disabled = disabled;
      });
    }

    function handleSharePricesClick() {
      if (shareCardBusy) return;
      if (!latestMarketPrices) {
        showPriceToast("ابتدا قیمت‌ها را دریافت کنید");
        return;
      }
      shareCardBusy = true;
      setShareButtonsDisabled(true);
      Promise.resolve(shareMarketPricesCard(latestMarketPrices))
        .then(function () {
          showPriceToast("تصویر قیمت آماده اشتراک شد");
        })
        .catch(function (error) {
          console.error("Share card error:", error);
          showPriceToast((error && error.message) || "اشتراک‌گذاری تصویر قیمت ممکن نشد");
        })
        .finally(function () {
          shareCardBusy = false;
          setShareButtonsDisabled(false);
        });
    }

    function buildHeroShareActionHtml() {
      return (
        '<div class="price-hero-share-row">' +
        '<p class="price-hero-share-hint">آخرین قیمت بازار</p>' +
        '<button type="button" class="market-share-icon-btn" aria-label="اشتراک‌گذاری تصویر قیمت" title="اشتراک‌گذاری تصویر قیمت">' +
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
        '<path stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 8l-4-4-4 4M12 4v12"/>' +
        "</svg></button></div>"
      );
    }

    function buildRateSparkline(dt, seedKey) {
      const directionClass =
        dt === "high" ? "is-up" : dt === "low" ? "is-down" : "is-flat";
      let seed = 0;
      const key = String(seedKey || "x");
      for (let i = 0; i < key.length; i += 1) seed = (seed + key.charCodeAt(i) * (i + 3)) % 997;
      const points = [];
      let y = 14;
      for (let i = 0; i < 8; i += 1) {
        const wave = ((seed + i * 17) % 9) - 4;
        if (dt === "high") y = Math.max(4, Math.min(22, y - 1.4 + wave * 0.35));
        else if (dt === "low") y = Math.max(4, Math.min(22, y + 1.4 + wave * 0.35));
        else y = Math.max(6, Math.min(20, 12 + wave * 0.55));
        points.push((i * 9) + "," + y.toFixed(1));
      }
      return (
        '<svg class="rate-card-spark ' +
        directionClass +
        '" viewBox="0 0 64 28" aria-hidden="true"><path d="M' +
        points.join(" L") +
        '"/></svg>'
      );
    }

    function createRateCard(item, data) {
      const isGlobal = item.key === "ons";
      const change = toDisplayValue(data.d, isGlobal);
      const changePercent = parseNumber(data.dp);
      const hasChange = !Number.isNaN(change) && change !== 0;
      const directionClass =
        data.dt === "high" ? "is-up" : data.dt === "low" ? "is-down" : "is-flat";
      const changeLabel =
        !Number.isNaN(changePercent) && changePercent !== 0
          ? (changePercent > 0 ? "+" : changePercent < 0 ? "−" : "") +
            Math.abs(changePercent).toLocaleString("fa-IR") +
            "٪"
          : hasChange
            ? formatPrice(Math.abs(change), isGlobal)
            : "۰٪";
      const el = document.createElement("div");
      el.className = "rate-card";
      el.innerHTML =
        '<div class="rate-card-icon">' +
        item.icon +
        '</div><div class="rate-card-meta"><h3 class="rate-card-title">' +
        item.title +
        '</h3><p class="rate-card-subtitle">' +
        item.unit +
        "</p></div>" +
        buildRateSparkline(data.dt, item.key + String(data.p || "")) +
        '<div class="rate-card-side"><span class="rate-card-change ' +
        directionClass +
        '">' +
        changeLabel +
        '</span><span class="rate-card-price">' +
        formatPrice(data.p, isGlobal) +
        "</span></div>";
      return el;
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

    const MARKET_ACCENT_KEY = "market-prices-accent";
    const ACCENT_PRESETS = [
      { id: "emerald", label: "زمردی", dark: "#00e5a0", light: "#0f766e", fgDark: "#111621", fgLight: "#ffffff", glow: "#06b6d4" },
      { id: "violet", label: "بنفش", dark: "#a78bfa", light: "#6d28d9", fgDark: "#111621", fgLight: "#ffffff", glow: "#818cf8" },
      { id: "sky", label: "آبی", dark: "#38bdf8", light: "#0369a1", fgDark: "#111621", fgLight: "#ffffff", glow: "#22d3ee" },
      { id: "amber", label: "کهربایی", dark: "#fbbf24", light: "#b45309", fgDark: "#111621", fgLight: "#ffffff", glow: "#f59e0b" },
      { id: "rose", label: "صورتی", dark: "#fb7185", light: "#be123c", fgDark: "#111621", fgLight: "#ffffff", glow: "#f472b6" },
      { id: "cyan", label: "فیروزه‌ای", dark: "#2dd4bf", light: "#0f766e", fgDark: "#111621", fgLight: "#ffffff", glow: "#22d3ee" },
    ];

    function getAccentPreset(id) {
      return ACCENT_PRESETS.find(function (item) { return item.id === id; }) || ACCENT_PRESETS[0];
    }

    function getSavedAccentId() {
      try {
        const raw = localStorage.getItem(MARKET_ACCENT_KEY);
        if (raw && ACCENT_PRESETS.some(function (item) { return item.id === raw; })) return raw;
      } catch (e) {}
      return "emerald";
    }

    function applyAccentTheme(accentId) {
      const preset = getAccentPreset(accentId || getSavedAccentId());
      const theme = getMarketTheme();
      const isLight = theme === "light";
      const root = document.documentElement;
      root.style.setProperty("--accent", isLight ? preset.light : preset.dark);
      root.style.setProperty("--accent-fg", isLight ? preset.fgLight : preset.fgDark);
      root.style.setProperty("--accent-glow", preset.glow);
      root.setAttribute("data-accent", preset.id);
      try {
        localStorage.setItem(MARKET_ACCENT_KEY, preset.id);
      } catch (e) {}
      if (accentColorPickerEl) {
        accentColorPickerEl.querySelectorAll(".market-accent-swatch").forEach(function (btn) {
          btn.classList.toggle("is-active", btn.getAttribute("data-accent") === preset.id);
        });
      }
    }

    function renderAccentPicker() {
      if (!accentColorPickerEl) return;
      const activeId = getSavedAccentId();
      accentColorPickerEl.innerHTML = ACCENT_PRESETS.map(function (preset) {
        return (
          '<button type="button" class="market-accent-swatch' +
          (preset.id === activeId ? " is-active" : "") +
          '" data-accent="' +
          preset.id +
          '" title="' +
          preset.label +
          '" aria-label="' +
          preset.label +
          '" style="--swatch:' +
          preset.dark +
          '"></button>'
        );
      }).join("");
      accentColorPickerEl.querySelectorAll(".market-accent-swatch").forEach(function (btn) {
        btn.addEventListener("click", function () {
          applyAccentTheme(btn.getAttribute("data-accent"));
        });
      });
    }

    function handleShareApkClick() {
      if (!shareApkBtn || shareApkBtn.disabled) return;
      if (typeof AndroidApp === "undefined" || typeof AndroidApp["shareApk"] !== "function") {
        showPriceToast("اشتراک فایل نصب فقط در اپ اندروید در دسترس است");
        return;
      }
      shareApkBtn.disabled = true;
      shareApkBtn.classList.add("is-loading");
      showPriceToast("در حال آماده‌سازی فایل نصب...");
      try {
        AndroidApp["shareApk"]();
      } catch (error) {
        shareApkBtn.disabled = false;
        shareApkBtn.classList.remove("is-loading");
        showPriceToast((error && error.message) || "اشتراک فایل نصب ممکن نشد");
      }
    }

    function initDonateSupport() {
      const DONATE_CARD_NUMBER = "${DONATE_CARD_NUMBER}";
      const donateCardCopyBtn = document.getElementById("donateCardCopyBtn");
      const donatePrimaryCopyBtn = document.getElementById("donatePrimaryCopyBtn");
      const donateCustomAmountEl = document.getElementById("donateCustomAmount");
      const donateAmountButtons = document.querySelectorAll("[data-donate-amount]");
      let selectedDonateAmount = null;

      function formatDonateToman(value) {
        const num = Number(value);
        if (!Number.isFinite(num) || num <= 0) return "";
        return Math.round(num).toLocaleString("fa-IR") + " تومان";
      }

      function getSelectedDonateAmount() {
        if (donateCustomAmountEl && donateCustomAmountEl.value.trim()) {
          const parsed =
            typeof parseHousingMoneyInput === "function"
              ? parseHousingMoneyInput(donateCustomAmountEl.value)
              : Number(String(donateCustomAmountEl.value).replace(/[^\d]/g, ""));
          if (parsed != null && Number.isFinite(parsed) && parsed > 0) return parsed;
        }
        return selectedDonateAmount;
      }

      function syncDonateAmountButtons() {
        donateAmountButtons.forEach(function (btn) {
          const amount = Number(btn.getAttribute("data-donate-amount"));
          const customActive =
            donateCustomAmountEl &&
            donateCustomAmountEl.value.trim() !== "" &&
            Number(
              typeof parseHousingMoneyInput === "function"
                ? parseHousingMoneyInput(donateCustomAmountEl.value)
                : String(donateCustomAmountEl.value).replace(/[^\d]/g, ""),
            ) > 0;
          btn.classList.toggle("is-active", !customActive && amount === selectedDonateAmount);
        });
      }

      function copyDonateCardNumber() {
        const text = DONATE_CARD_NUMBER;
        const amount = getSelectedDonateAmount();
        const amountText = formatDonateToman(amount);
        const done = function () {
          showPriceToast(
            amountText
              ? "شماره کارت کپی شد · مبلغ انتخابی: " + amountText
              : "شماره کارت کپی شد",
          );
        };
        const fail = function () {
          showPriceToast("کپی شماره کارت ممکن نشد");
        };
        if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
          navigator.clipboard.writeText(text).then(done).catch(function () {
            try {
              const input = document.createElement("textarea");
              input.value = text;
              input.setAttribute("readonly", "");
              input.style.position = "fixed";
              input.style.opacity = "0";
              document.body.appendChild(input);
              input.select();
              const ok = document.execCommand("copy");
              document.body.removeChild(input);
              if (ok) done();
              else fail();
            } catch (e) {
              fail();
            }
          });
          return;
        }
        try {
          const input = document.createElement("textarea");
          input.value = text;
          input.setAttribute("readonly", "");
          input.style.position = "fixed";
          input.style.opacity = "0";
          document.body.appendChild(input);
          input.select();
          const ok = document.execCommand("copy");
          document.body.removeChild(input);
          if (ok) done();
          else fail();
        } catch (e) {
          fail();
        }
      }

      donateAmountButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          selectedDonateAmount = Number(btn.getAttribute("data-donate-amount"));
          if (donateCustomAmountEl) donateCustomAmountEl.value = "";
          syncDonateAmountButtons();
        });
      });

      if (donateCustomAmountEl) {
        bindCommaSeparatedNumberInput(donateCustomAmountEl);
        donateCustomAmountEl.addEventListener("input", function () {
          if (donateCustomAmountEl.value.trim()) selectedDonateAmount = null;
          syncDonateAmountButtons();
        });
      }

      if (donateCardCopyBtn) donateCardCopyBtn.addEventListener("click", copyDonateCardNumber);
      if (donatePrimaryCopyBtn) donatePrimaryCopyBtn.addEventListener("click", copyDonateCardNumber);
      syncDonateAmountButtons();
    }

    function initMoreTab() {
      const alertSettings = getAlertSettings();
      previousPricesSnapshot = loadPreviousPricesSnapshot();
      if (alertsEnabledEl) alertsEnabledEl.checked = alertSettings.enabled;
      if (alertsThresholdEl) alertsThresholdEl.value = String(alertSettings.threshold);
      syncThemeToggleDisplay();
      renderAccentPicker();
      applyAccentTheme(getSavedAccentId());
      initDonateSupport();
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
      if (shareApkBtn) {
        shareApkBtn.addEventListener("click", handleShareApkClick);
      }
      window["__onShareApkComplete"] = function (result) {
        if (shareApkBtn) {
          shareApkBtn.disabled = false;
          shareApkBtn.classList.remove("is-loading");
        }
        const payload = result && typeof result === "object" ? result : {};
        showPriceToast(payload.message || (payload.success ? "فایل نصب آماده ارسال شد" : "اشتراک فایل نصب ممکن نشد"));
      };
    }

    function setRefreshBusy(busy) {
      if (navRefreshIcon) navRefreshIcon.classList.toggle("spin", busy);
      if (navRefreshBtn) navRefreshBtn.disabled = busy;
    }

    function syncGoldSubtabUi() {
      goldSubtabButtons.forEach(function (button) {
        const active = button.dataset.goldSubtab === activeGoldSubtab;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-selected", active ? "true" : "false");
      });
      if (goldPricesPanelEl) goldPricesPanelEl.classList.toggle("hidden", activeGoldSubtab !== "prices");
      if (goldCalcPanelEl) goldCalcPanelEl.classList.toggle("hidden", activeGoldSubtab !== "calc");
      if (goldListEl) {
        goldListEl.classList.toggle("hidden", activeGoldSubtab !== "prices" || activeMarketTab !== "gold");
      }
    }

    function setGoldSubtab(subtab) {
      const next = subtab === "calc" ? "calc" : "prices";
      if (next === activeGoldSubtab) {
        syncGoldSubtabUi();
        return;
      }
      activeGoldSubtab = next;
      try {
        localStorage.setItem("market-prices-gold-subtab", activeGoldSubtab);
      } catch (e) {}
      syncGoldSubtabUi();
    }

    function syncCarsSubtabUi() {
      carsSubtabButtons.forEach(function (button) {
        const active = button.dataset.carsSubtab === activeCarsSubtab;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-selected", active ? "true" : "false");
      });
      if (carsPricesPanelEl) carsPricesPanelEl.classList.toggle("hidden", activeCarsSubtab !== "prices");
      if (carsEstimatePanelEl) carsEstimatePanelEl.classList.toggle("hidden", activeCarsSubtab !== "estimate");
    }

    function setCarsSubtab(subtab) {
      const next = subtab === "estimate" ? "estimate" : "prices";
      if (next === activeCarsSubtab) {
        syncCarsSubtabUi();
        return;
      }
      activeCarsSubtab = next;
      try {
        localStorage.setItem("market-prices-cars-subtab", activeCarsSubtab);
      } catch (e) {}
      syncCarsSubtabUi();
      if (activeMarketTab === "cars" && activeCarsSubtab === "prices" && !carsLoaded) {
        fetchCarPrices();
      }
      if (activeMarketTab === "cars" && activeCarsSubtab === "estimate") {
        ensureMyCarCatalog().catch(function () {});
      }
    }

    function syncMoreSubtabUi() {
      moreSubtabButtons.forEach(function (button) {
        const active = button.dataset.moreSubtab === activeMoreSubtab;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-selected", active ? "true" : "false");
      });
      if (moreSettingsPanelEl) moreSettingsPanelEl.classList.toggle("hidden", activeMoreSubtab !== "settings");
      if (moreDonatePanelEl) moreDonatePanelEl.classList.toggle("hidden", activeMoreSubtab !== "donate");
      if (moreAboutPanelEl) moreAboutPanelEl.classList.toggle("hidden", activeMoreSubtab !== "about");
    }

    function setMoreSubtab(subtab) {
      const next =
        subtab === "donate" ? "donate" : subtab === "about" ? "about" : "settings";
      if (next === activeMoreSubtab) {
        syncMoreSubtabUi();
        return;
      }
      activeMoreSubtab = next;
      try {
        localStorage.setItem("market-prices-more-subtab", activeMoreSubtab);
      } catch (e) {}
      syncMoreSubtabUi();
    }

    function showPriceLists() {
      loadingEl.classList.add("hidden");
      errorEl.classList.add("hidden");
      if (activeMarketTab === "gold") {
        currencyListEl.classList.add("hidden");
        syncGoldSubtabUi();
      } else if (activeMarketTab === "currency") {
        if (goldListEl) goldListEl.classList.add("hidden");
        if (goldPricesPanelEl) goldPricesPanelEl.classList.add("hidden");
        if (goldCalcPanelEl) goldCalcPanelEl.classList.add("hidden");
        currencyListEl.classList.remove("hidden");
      } else {
        currencyListEl.classList.remove("hidden");
        syncGoldSubtabUi();
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
        '</span><div><p class="price-hero-card-kicker">قیمت لحظه‌ای</p><h3 class="price-hero-card-title">' +
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
        "</span></div>" +
        buildHeroShareActionHtml();
      return el;
    }

    function renderItemGroup(items, listEl, current) {
      let sectionAdded = false;
      items.forEach(function (item) {
        const data = current[item.key];
        if (!data) return;
        if (item.hero) {
          listEl.appendChild(createHeroCard(item, data));
          return;
        }
        if (!sectionAdded) {
          const heading = document.createElement("h2");
          heading.className = "price-section-title";
          heading.textContent = "نرخ‌های امروز";
          listEl.appendChild(heading);
          sectionAdded = true;
        }
        listEl.appendChild(createRateCard(item, data));
      });
    }

    function renderCurrency(current) {
      currencyListEl.innerHTML = "";
      renderItemGroup(CURRENCY_ITEMS, currencyListEl, current);
    }

    function renderGold(current) {
      goldListEl.innerHTML = "";
      if (goldCalcListEl) goldCalcListEl.innerHTML = "";
      renderItemGroup(GOLD_ITEMS, goldListEl, current);
      if (goldCalcListEl) {
        goldCalcListEl.appendChild(createRealGoldCard(current));
        goldCalcListEl.appendChild(createCoinGoldCard(current));
        goldCalcListEl.appendChild(createGoldWageCard(current));
      }
      syncGoldSubtabUi();
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

    function setHousingStatus(message, isError) {
      if (!housingStatusEl) return;
      if (!message) {
        housingStatusEl.classList.add("hidden");
        housingStatusEl.textContent = "";
        housingStatusEl.classList.remove("is-error");
        return;
      }
      housingStatusEl.textContent = message;
      housingStatusEl.classList.toggle("is-error", !!isError);
      housingStatusEl.classList.remove("hidden");
    }

    function setHousingBusy(busy) {
      housingBusy = busy;
      if (housingSearchBtnEl) {
        housingSearchBtnEl.disabled = busy;
        housingSearchBtnEl.classList.toggle("is-loading", busy);
        const label = housingSearchBtnEl.querySelector(".housing-search-btn-label");
        if (label) label.textContent = busy ? "در حال جستجو..." : "پیدا کردن آگهی‌ها";
      }
      if (housingLoadMoreBtnEl) housingLoadMoreBtnEl.disabled = busy;
    }

    function syncHousingDealFields() {
      const isRent = housingDealKey === "rent";
      if (housingBuyFieldsEl) housingBuyFieldsEl.classList.toggle("hidden", isRent);
      if (housingRentFieldsEl) housingRentFieldsEl.classList.toggle("hidden", !isRent);
      housingDealButtons.forEach(function (btn) {
        btn.classList.toggle("is-active", btn.getAttribute("data-housing-deal") === housingDealKey);
      });
    }

    function bindHousingGallery(root) {
      if (!root) return;
      root.querySelectorAll("[data-housing-gallery]").forEach(function (gallery) {
        const track = gallery.querySelector(".housing-gallery-track");
        const dots = gallery.querySelectorAll(".housing-gallery-dot");
        if (!track || !dots.length) return;
        track.addEventListener("scroll", function () {
          const width = track.clientWidth || 1;
          const index = Math.round(Math.abs(track.scrollLeft) / width);
          dots.forEach(function (dot, i) {
            dot.classList.toggle("is-active", i === index);
          });
        });
      });
    }

    function renderHousingListings(listings, append) {
      if (!housingListEl) return;
      const html = (listings || []).map(renderHousingListingCard).join("");
      if (append) housingListEl.insertAdjacentHTML("beforeend", html);
      else housingListEl.innerHTML = html;
      if (housingResultsWrapEl) housingResultsWrapEl.classList.toggle("hidden", !housingListEl.innerHTML);
      if (housingLoadMoreBtnEl) {
        housingLoadMoreBtnEl.classList.toggle("hidden", !housingHasNextPage);
      }
      bindHousingGallery(housingListEl);
    }

    function readHousingQueryFromForm() {
      return {
        cityId: housingCityEl ? housingCityEl.value : "1",
        dealKey: housingDealKey,
        budgetMax: housingBudgetMaxEl ? housingBudgetMaxEl.value : "",
        creditMax: housingCreditMaxEl ? housingCreditMaxEl.value : "",
        rentMax: housingRentMaxEl ? housingRentMaxEl.value : "",
        sizeMin: housingSizeMinEl ? housingSizeMinEl.value : "",
        sizeMax: housingSizeMaxEl ? housingSizeMaxEl.value : "",
        rooms: housingRoomsEl ? housingRoomsEl.value : "",
      };
    }

    function saveHousingPrefs(query) {
      try {
        localStorage.setItem(HOUSING_PREFS_KEY, JSON.stringify(query));
      } catch (e) {}
    }

    function loadHousingPrefs() {
      try {
        const raw = localStorage.getItem(HOUSING_PREFS_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    }

    function validateHousingQuery(query) {
      const city = getHousingCityById(query.cityId) || getEnabledHousingCities()[0];
      const deal = getHousingDeal(city, query.dealKey);
      if (!city || !deal) return "شهر یا نوع معامله نامعتبر است";
      if (deal.budgetMode === "price") {
        const budget = parseHousingMoneyInput(query.budgetMax);
        if (budget == null || budget <= 0) return "سقف بودجه خرید را وارد کنید";
      } else {
        const credit = parseHousingMoneyInput(query.creditMax);
        if (credit == null || credit <= 0) return "سقف ودیعه/رهن را وارد کنید";
      }
      return "";
    }

    function runHousingSearch(options) {
      const append = !!(options && options.append);
      if (housingBusy) return;
      const query = append && housingLastQuery ? housingLastQuery : readHousingQueryFromForm();
      const error = validateHousingQuery(query);
      if (error) {
        setHousingStatus(error, true);
        return;
      }

      setHousingBusy(true);
      if (!append) {
        housingPaginationData = null;
        housingHasNextPage = false;
        if (housingListEl) housingListEl.innerHTML = "";
        if (housingResultsWrapEl) housingResultsWrapEl.classList.add("hidden");
        if (housingLoadingEl) housingLoadingEl.classList.add("hidden");
        setHousingStatus("");
      } else {
        setHousingStatus("");
      }

      const pagination = append ? housingPaginationData : null;
      Promise.resolve(searchDivarHousingListings(query, pagination))
        .then(function (result) {
          housingLastQuery = query;
          housingPaginationData = result.paginationData;
          housingHasNextPage = !!result.hasNextPage;
          saveHousingPrefs(query);
          return enrichDivarHousingListings(result.rows, { limit: 10, concurrency: 3 }).then(function (rows) {
            return { rows: rows, empty: result.empty, city: result.city, deal: result.deal };
          });
        })
        .then(function (payload) {
          if (housingLoadingEl) housingLoadingEl.classList.add("hidden");
          if (payload.empty && !append) {
            setHousingStatus("آگهی‌ای با این فیلترها پیدا نشد. بودجه یا متراژ را تغییر دهید.", true);
            return;
          }
          renderHousingListings(payload.rows, append);
          const countText = (housingListEl ? housingListEl.querySelectorAll(".housing-card").length : 0).toLocaleString("fa-IR");
          setHousingStatus(
            "نتایج " + (payload.deal ? payload.deal.labelFa : "") + " در " + (payload.city ? payload.city.nameFa : "تهران") + " · " + countText + " آگهی",
            false,
          );
        })
        .catch(function (err) {
          console.error("Housing search error:", err);
          if (housingLoadingEl) housingLoadingEl.classList.add("hidden");
          setHousingStatus((err && err.message) || "جستجوی ملک ممکن نشد", true);
        })
        .finally(function () {
          setHousingBusy(false);
        });
    }

    function initHousingTab() {
      const cities = typeof getEnabledHousingCities === "function" ? getEnabledHousingCities() : [];
      if (housingCityEl) {
        housingCityEl.innerHTML = cities
          .map(function (city) {
            return '<option value="' + city.id + '">' + city.nameFa + "</option>";
          })
          .join("");
        if (!cities.length) {
          housingCityEl.innerHTML = '<option value="1">تهران</option>';
        }
      }
      if (housingRoomsEl && typeof HOUSING_ROOM_OPTIONS !== "undefined") {
        housingRoomsEl.innerHTML = HOUSING_ROOM_OPTIONS.map(function (opt) {
          return '<option value="' + opt.value + '">' + opt.label + "</option>";
        }).join("");
      }

      const prefs = loadHousingPrefs();
      if (prefs) {
        housingDealKey = prefs.dealKey === "rent" ? "rent" : "buy";
        if (housingCityEl && prefs.cityId) housingCityEl.value = prefs.cityId;
        if (housingBudgetMaxEl && prefs.budgetMax) {
          const parsed = parseHousingMoneyInput(prefs.budgetMax);
          housingBudgetMaxEl.value = parsed != null ? formatHousingMoneyInput(parsed) : prefs.budgetMax;
        }
        if (housingCreditMaxEl && prefs.creditMax) {
          const parsed = parseHousingMoneyInput(prefs.creditMax);
          housingCreditMaxEl.value = parsed != null ? formatHousingMoneyInput(parsed) : prefs.creditMax;
        }
        if (housingRentMaxEl && prefs.rentMax != null && prefs.rentMax !== "") {
          const parsed = parseHousingMoneyInput(prefs.rentMax);
          housingRentMaxEl.value = parsed != null ? formatHousingMoneyInput(parsed) : prefs.rentMax;
        }
        if (housingSizeMinEl && prefs.sizeMin) {
          const parsed = parseHousingMoneyInput(prefs.sizeMin);
          housingSizeMinEl.value = parsed != null ? formatHousingMoneyInput(parsed) : prefs.sizeMin;
        }
        if (housingSizeMaxEl && prefs.sizeMax) {
          const parsed = parseHousingMoneyInput(prefs.sizeMax);
          housingSizeMaxEl.value = parsed != null ? formatHousingMoneyInput(parsed) : prefs.sizeMax;
        }
        if (housingRoomsEl && prefs.rooms) housingRoomsEl.value = prefs.rooms;
      }
      syncHousingDealFields();
    }

    function switchMarketTab(tab) {
      if (["currency", "gold", "cars", "housing", "more"].indexOf(tab) === -1) return;

      activeMarketTab = tab;
      pricesPanelEl.classList.toggle("hidden", !isPriceTab(tab));
      currencyViewEl.classList.toggle("hidden", tab !== "currency");
      goldViewEl.classList.toggle("hidden", tab !== "gold");
      carsViewEl.classList.toggle("hidden", tab !== "cars");
      if (housingViewEl) housingViewEl.classList.toggle("hidden", tab !== "housing");
      moreViewEl.classList.toggle("hidden", tab !== "more");

      navButtons.forEach(function (button) {
        button.classList.toggle("is-active", button.dataset.marketTab === tab);
      });

      if (isPriceTab(tab)) {
        if (pricesLoaded) showPriceLists();
        else fetchPrices();
      }

      if (tab === "cars") {
        syncCarsSubtabUi();
        if (activeCarsSubtab === "estimate") {
          ensureMyCarCatalog().catch(function () {});
        }
        if (activeCarsSubtab === "prices" && !carsLoaded) {
          fetchCarPrices();
        }
      }

      if (tab === "more") {
        syncMoreSubtabUi();
      }
    }

    function handleMarketRefresh() {
      if (activeMarketTab === "cars") {
        if (activeCarsSubtab === "prices") fetchCarPrices();
        else ensureMyCarCatalog().catch(function () {});
      } else if (activeMarketTab === "housing") runHousingSearch({ append: false });
      else if (isPriceTab(activeMarketTab)) fetchPrices();
    }

    initMoreTab();
    initHousingTab();
    initMyCarEstimateTab();

    if (pricesPanelEl) {
      pricesPanelEl.addEventListener("click", function (event) {
        const target = event.target;
        if (!target || typeof target.closest !== "function") return;
        if (target.closest(".market-share-icon-btn")) {
          event.preventDefault();
          handleSharePricesClick();
        }
      });
    }

    if (divarEstimateBtnEl) {
      divarEstimateBtnEl.addEventListener("click", handleDivarEstimateClick);
    }
    if (divarEstimateResultEl) {
      divarEstimateResultEl.addEventListener("click", function (event) {
        const target = event.target;
        if (!target) return;
        const dismissBtn =
          typeof target.closest === "function"
            ? target.closest("#divarEstimateDismissBtn, .estimate-dismiss-btn")
            : null;
        if (dismissBtn) {
          event.preventDefault();
          clearDivarEstimateResult();
        }
      });
    }
    if (myCarEstimateResultEl) {
      myCarEstimateResultEl.addEventListener("click", function (event) {
        const target = event.target;
        if (!target || typeof target.closest !== "function") return;
        if (target.closest("#divarEstimateDismissBtn, .estimate-dismiss-btn")) {
          event.preventDefault();
          clearMyCarEstimateResult();
        }
      });
    }
    if (myCarBrandEl) {
      myCarBrandEl.addEventListener("change", function () {
        populateMyCarModels();
      });
    }
    if (myCarModelEl) {
      myCarModelEl.addEventListener("change", function () {
        populateMyCarTrims();
      });
    }
    if (myCarEstimateFormEl) {
      myCarEstimateFormEl.addEventListener("submit", function (event) {
        event.preventDefault();
        const selection = readMyCarFormSelection();
        runMyCarEstimate(selection);
      });
    }
    if (myCarSaveBtnEl) {
      myCarSaveBtnEl.addEventListener("click", function () {
        const saved = upsertSavedCarFromForm();
        if (saved) setMyCarStatus("خودرو ذخیره شد", false);
      });
    }
    if (myCarCancelEditBtnEl) {
      myCarCancelEditBtnEl.addEventListener("click", function () {
        resetMyCarForm();
      });
    }
    if (myCarsListEl) {
      myCarsListEl.addEventListener("click", function (event) {
        const target = event.target;
        if (!target || typeof target.closest !== "function") return;
        const actionBtn = target.closest("[data-car-action]");
        const item = target.closest("[data-saved-car-id]");
        if (!actionBtn || !item) return;
        const carId = item.getAttribute("data-saved-car-id");
        const car = savedCars.find(function (entry) {
          return entry.id === carId;
        });
        if (!car) return;
        const action = actionBtn.getAttribute("data-car-action");
        if (action === "delete") {
          savedCars = savedCars.filter(function (entry) {
            return entry.id !== carId;
          });
          if (editingCarId === carId) resetMyCarForm();
          if (selectedCarId === carId) selectedCarId = null;
          persistSavedCars();
          renderSavedCarsList();
          setMyCarStatus("خودرو حذف شد", false);
          return;
        }
        if (action === "edit" || action === "select") {
          ensureMyCarCatalog()
            .then(function () {
              fillMyCarFormFromSaved(car);
              if (action === "select") {
                selectedCarId = car.id;
                renderSavedCarsList();
              }
            })
            .catch(function () {});
          return;
        }
        if (action === "estimate") {
          selectedCarId = car.id;
          ensureMyCarCatalog()
            .then(function () {
              fillMyCarFormFromSaved(car);
              runMyCarEstimate({
                brandId: car.brandId,
                modelId: car.modelId,
                trimId: car.trimId,
                modelYear: car.modelYear,
                mileage: car.mileage,
                bodyStatus: car.bodyStatus || "Healthy",
                brandFa: car.brandFa,
                modelFa: car.modelFa,
                trimFa: car.trimFa,
              });
            })
            .catch(function () {});
        }
      });
    }
    if (divarUrlInputEl) {
      divarUrlInputEl.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          handleDivarEstimateClick();
        }
      });
    }

    housingDealButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        housingDealKey = btn.getAttribute("data-housing-deal") === "rent" ? "rent" : "buy";
        syncHousingDealFields();
      });
    });

    if (housingSearchFormEl) {
      housingSearchFormEl.addEventListener("submit", function (event) {
        event.preventDefault();
        runHousingSearch({ append: false });
      });
    }

    if (housingLoadMoreBtnEl) {
      housingLoadMoreBtnEl.addEventListener("click", function () {
        runHousingSearch({ append: true });
      });
    }

    if (housingListEl) {
      housingListEl.addEventListener("click", function (event) {
        const target = event.target;
        if (!target || typeof target.closest !== "function") return;
        const openBtn = target.closest("[data-housing-open]");
        if (openBtn) {
          event.preventDefault();
          openExternalUrl(openBtn.getAttribute("data-housing-open"));
        }
      });
    }

    [
      "housingBudgetMax",
      "housingCreditMax",
      "housingRentMax",
      "housingSizeMin",
      "housingSizeMax",
    ].forEach(function (id) {
      bindCommaSeparatedNumberInput(document.getElementById(id));
    });

    navButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        switchMarketTab(button.dataset.marketTab);
      });
    });

    goldSubtabButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        setGoldSubtab(button.dataset.goldSubtab);
      });
    });
    syncGoldSubtabUi();

    carsSubtabButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        setCarsSubtab(button.dataset.carsSubtab);
      });
    });
    syncCarsSubtabUi();

    moreSubtabButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        setMoreSubtab(button.dataset.moreSubtab);
      });
    });
    syncMoreSubtabUi();

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

  // Re-apply accent when light/dark theme flips
  script = script.replace(
    `function applyMarketTheme(theme) {
      const next = theme === "light" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      document.documentElement.style.colorScheme = next;
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.content = next === "light" ? "#e8edf5" : "#111621";
      try { if (window.AndroidTheme) AndroidTheme.onThemeChanged(next); } catch {}
      return next;
    }`,
    `function applyMarketTheme(theme) {
      const next = theme === "light" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      document.documentElement.style.colorScheme = next;
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.content = next === "light" ? "#e8edf5" : "#111621";
      try { if (window.AndroidTheme) AndroidTheme.onThemeChanged(next); } catch {}
      try {
        if (typeof applyAccentTheme === "function") applyAccentTheme();
      } catch {}
      return next;
    }`,
  );

  // Stable clock layout: date + fixed-width time so seconds don't shift the row
  script = script.replace(
    `function tickCurrentDateTime() {
      if (!currentDateTimeEl) return;
      currentDateTimeEl.textContent = formatPersianDateTime(new Date());
    }`,
    `function tickCurrentDateTime() {
      if (!currentDateTimeEl) return;
      const now = new Date();
      const dateEl = document.getElementById("headerDatePart");
      const timeEl = document.getElementById("headerTimePart");
      if (dateEl && timeEl) {
        const weekday = now.toLocaleDateString("fa-IR-u-nu-latn", { weekday: "long", calendar: "persian" });
        const day = now.toLocaleDateString("fa-IR-u-nu-latn", { day: "numeric", calendar: "persian" });
        const month = now.toLocaleDateString("fa-IR-u-nu-latn", { month: "long", calendar: "persian" });
        const year = now.toLocaleDateString("fa-IR-u-nu-latn", { year: "numeric", calendar: "persian" });
        dateEl.textContent = weekday + " " + day + " " + month + " " + year;
        timeEl.textContent = now.toLocaleTimeString("fa-IR-u-nu-latn", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
        return;
      }
      currentDateTimeEl.textContent = formatPersianDateTime(now);
    }`,
  );

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
      if (goldPricesPanelEl) goldPricesPanelEl.classList.add("hidden");
      if (goldCalcPanelEl) goldCalcPanelEl.classList.add("hidden");
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
      if (goldPricesPanelEl) goldPricesPanelEl.classList.add("hidden");
      if (goldCalcPanelEl) goldCalcPanelEl.classList.add("hidden");
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
            (activeMarketTab === "gold" &&
              ((activeGoldSubtab === "prices" && goldListEl && !goldListEl.classList.contains("hidden")) ||
                (activeGoldSubtab === "calc" && goldCalcListEl && goldCalcListEl.childElementCount > 0))));`,
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
