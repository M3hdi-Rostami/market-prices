import {
  DONATE_CARD_HOLDER,
  DONATE_CARD_NUMBER,
  DONATE_CARD_QR_SVG,
} from "./donate-support-data.mjs";
import { DOLLAR_BILL_WATERMARK_URL } from "./dollar-watermark-data.mjs";
import { GOLD_MEDAL_WATERMARK_URL } from "./gold-watermark-data.mjs";
import { IRAN_BANK_BY_BIN, IRAN_BANK_UNKNOWN, loadIranBankLogoDataUris } from "./iran-banks-data.mjs";

const DONATE_CARD_DISPLAY = DONATE_CARD_NUMBER.replace(/(\d{4})(?=\d)/g, "$1-");
const IRAN_BANK_BY_BIN_JSON = JSON.stringify(IRAN_BANK_BY_BIN);
const IRAN_BANK_UNKNOWN_JSON = JSON.stringify(IRAN_BANK_UNKNOWN);
const IRAN_BANK_LOGO_DATA_URIS_JSON = JSON.stringify(loadIranBankLogoDataUris());

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
          <p id="currentDateTime" class="header-clock" aria-live="polite">
            <span id="headerDatePart" class="header-date-part">—</span>
            <span class="header-clock-sep" aria-hidden="true">-</span>
            <span id="headerTimePart" class="header-time-part">00:00:00</span>
          </p>
          <p id="headerTagline" class="header-tagline">قیمت لحظه‌ای برای تصمیم بهتر</p>
        </div>
        <button type="button" id="marketToolsBtn" class="market-tools-btn" data-market-tab="tools" aria-label="ابزارها" title="ابزارها">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
          </svg>
        </button>
      </div>
    </header>

    <div id="prices-panel" class="market-prices-panel">
      <div id="pricesOfflineBanner" class="market-offline-banner hidden" role="status" aria-live="polite"></div>
      <div id="marketTrendStrip" class="market-trend-strip hidden" aria-live="polite"></div>

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
        <div id="currencyPricesPanel" class="currency-prices-panel">
          <div id="currencyList" class="grid price-stack hidden"></div>
        </div>
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
        <button type="button" class="cars-subtab-btn is-active" data-cars-subtab="prices" role="tab" aria-selected="true">قیمت خودرو صفر</button>
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

        <div id="carsOfflineBanner" class="market-offline-banner hidden" role="status" aria-live="polite"></div>

        <div id="carsListWrap" class="cars-list-wrap hidden">
          <div id="carsList" class="cars-list"></div>
        </div>
      </div>

      <div id="carsEstimatePanel" class="cars-subpanel hidden">
        <div class="cars-panel-intro">
          <div class="cars-panel-intro-icon" aria-hidden="true">🔎</div>
          <div class="cars-panel-intro-text">
            <h2 class="cars-panel-intro-title">تخمین قیمت خودرو</h2>
            <p class="cars-panel-intro-hint">یکی از روش‌ها را انتخاب کنید: آگهی دیوار یا مشخصات خودرو</p>
          </div>
        </div>

        <div class="cars-estimate-mode-toggle" role="tablist" aria-label="روش تخمین">
          <button type="button" class="cars-estimate-mode-btn is-active" data-cars-estimate-mode="divar" role="tab" aria-selected="true">از آگهی دیوار</button>
          <button type="button" class="cars-estimate-mode-btn" data-cars-estimate-mode="specs" role="tab" aria-selected="false">با مشخصات من</button>
        </div>

        <div id="carsEstimateDivarPanel" class="cars-estimate-mode-panel">
          <section class="cars-estimate-section">
            <div class="cars-estimate-section-head">
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
        </div>

        <div id="carsEstimateSpecsPanel" class="cars-estimate-mode-panel hidden">
          <section class="cars-estimate-section">
            <div class="cars-estimate-section-head">
              <div>
                <h3 class="cars-estimate-section-title">خودروهای من</h3>
              </div>
            </div>
            <div class="my-cars-wrap">
              <div id="myCarsList" class="my-cars-list"></div>
              <p id="myCarsEmpty" class="my-cars-empty">هنوز خودرویی ذخیره نشده.</p>
            </div>
          </section>

          <section class="cars-estimate-section is-collapsible" id="myCarFormSection">
            <button type="button" class="collapse-panel-toggle" id="myCarFormCollapseBtn" aria-expanded="true" aria-controls="myCarFormCollapse">
              <span class="collapse-panel-main">
                <span class="collapse-panel-icon" aria-hidden="true">📝</span>
                <span class="collapse-panel-copy">
                  <strong class="collapse-panel-title">تخمین با مشخصات من</strong>
                  <small class="collapse-panel-desc">برند، مدل، سال و کارکرد را وارد کنید</small>
                </span>
              </span>
              <span class="collapse-panel-action">
                <span class="collapse-panel-action-label" data-collapse-label>بستن</span>
                <span class="collapse-panel-chevron" aria-hidden="true"></span>
              </span>
            </button>
            <div class="collapse-panel-preview" data-collapse-preview aria-hidden="true">
              <span>برند</span><span>مدل</span><span>سال</span><span>کارکرد</span><span>وضعیت بدنه</span>
            </div>
            <div id="myCarFormCollapse" class="collapse-section-body">
            <p id="myCarFormModeHint" class="cars-estimate-section-hint collapse-inline-hint hidden">برند، مدل، سال و کارکرد را وارد کنید</p>
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
            </form>
            </div>
          </section>

          <section id="myCarEstimateResultSection" class="cars-estimate-section estimate-result-box hidden" aria-live="polite">
            <div class="cars-estimate-section-head">
              <div>
                <h3 class="cars-estimate-section-title">نتیجه تخمین</h3>
              </div>
            </div>
            <div id="myCarEstimateResult" class="divar-estimate-result"></div>
          </section>
        </div>
      </div>
    </div>

    <div id="view-housing" class="market-view hidden">
      <div class="cars-panel-intro">
        <div class="cars-panel-intro-icon" aria-hidden="true">🏠</div>
        <div class="cars-panel-intro-text">
          <h2 class="cars-panel-intro-title">جستجوی ملک متناسب با بودجه من</h2>
          <p class="cars-panel-intro-hint">بودجه، متراژ و تعداد خواب را مشخص کنید تا آگهی‌های مناسب را پیدا کنید</p>
        </div>
      </div>

      <section class="cars-estimate-section">
        <div class="cars-estimate-section-head">
          <div>
            <h3 class="cars-estimate-section-title">جستجوهای من</h3>
          </div>
        </div>
        <div class="my-cars-wrap">
          <div id="myHousingSearchesList" class="my-cars-list"></div>
          <p id="myHousingSearchesEmpty" class="my-cars-empty">هنوز جستجویی ذخیره نشده.</p>
        </div>
      </section>

      <section class="cars-estimate-section is-collapsible" id="housingFormSection">
        <button type="button" class="collapse-panel-toggle" id="housingFormCollapseBtn" aria-expanded="true" aria-controls="housingFormCollapse">
          <span class="collapse-panel-main">
            <span class="collapse-panel-icon" aria-hidden="true">🔎</span>
            <span class="collapse-panel-copy">
              <strong class="collapse-panel-title">جستجوی ملک</strong>
              <small class="collapse-panel-desc">بودجه، متراژ و خواب را تنظیم کنید</small>
            </span>
          </span>
          <span class="collapse-panel-action">
            <span class="collapse-panel-action-label" data-collapse-label>بستن</span>
            <span class="collapse-panel-chevron" aria-hidden="true"></span>
          </span>
        </button>
        <div class="collapse-panel-preview" data-collapse-preview aria-hidden="true">
          <span>شهر</span><span>بودجه</span><span>متراژ</span><span>خواب</span>
        </div>
        <div id="housingFormCollapse" class="collapse-section-body">
      <form id="housingSearchForm" class="housing-search-form" autocomplete="off">
        <label class="housing-field">
          <span class="housing-field-label">نام دلخواه (اختیاری)</span>
          <input id="housingSearchNickname" class="housing-input" type="text" maxlength="40" placeholder="مثلاً خرید تا ۱۰ میلیارد" />
        </label>

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

        <div class="housing-form-actions">
          <button id="housingSearchBtn" type="submit" class="housing-search-btn">
            <span class="housing-search-btn-spinner" aria-hidden="true"></span>
            <span class="housing-search-btn-label">پیدا کردن آگهی‌ها</span>
          </button>
          <button id="housingSaveSearchBtn" type="button" class="housing-save-btn">ذخیره جستجو</button>
        </div>
      </form>
        </div>
      </section>

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

      <div id="housingDetailSheet" class="housing-detail-sheet hidden" aria-hidden="true">
        <div id="housingDetailBackdrop" class="housing-detail-backdrop"></div>
        <div class="housing-detail-panel" role="dialog" aria-modal="true" aria-labelledby="housingDetailTitle">
          <div class="housing-detail-handle" aria-hidden="true"></div>
          <div id="housingDetailContent" class="housing-detail-content" aria-live="polite"></div>
        </div>
      </div>
    </div>

    <div id="view-tools" class="market-view hidden">
      <div class="market-more-scroll bank-cards-page">
        <div class="cars-panel-intro">
          <div class="cars-panel-intro-icon" aria-hidden="true">💳</div>
          <div class="cars-panel-intro-text">
            <h2 class="cars-panel-intro-title">کارت‌های بانکی</h2>
            <p class="cars-panel-intro-hint">کارت‌هایت را ذخیره کن، ورق بزن و سریع اشتراک بگذار</p>
          </div>
        </div>

        <section class="bank-card-tool" aria-label="کارت‌های بانکی ذخیره‌شده">
          <div id="bankCardEmpty" class="bank-card-empty">
            <p class="bank-card-empty-title">هنوز کارتی نداری</p>
            <p class="bank-card-empty-hint">با دکمه + وسط نوار پایین، کارت بانکی جدید اضافه کن</p>
          </div>

          <div id="bankCardStackViewport" class="bank-card-stack-viewport hidden" aria-live="polite">
            <div id="bankCardStack" class="bank-card-stack"></div>
          </div>

          <div id="bankCardDots" class="bank-card-dots hidden" role="tablist" aria-label="کارت‌ها"></div>
        </section>
      </div>
    </div>

    <div id="bankCardModal" class="bank-card-modal hidden" aria-hidden="true">
      <div id="bankCardModalBackdrop" class="bank-card-modal-backdrop"></div>
      <div class="bank-card-modal-sheet" role="dialog" aria-modal="true" aria-labelledby="bankCardModalTitle">
        <div class="bank-card-modal-handle" aria-hidden="true"></div>
        <h3 id="bankCardModalTitle" class="bank-card-modal-title">کارت جدید</h3>
        <div class="bank-card-form">
          <label class="bank-card-field">
            <span class="bank-card-field-label">شماره کارت</span>
            <input
              id="bankCardNumberInput"
              class="bank-card-input"
              type="text"
              inputmode="numeric"
              autocomplete="cc-number"
              maxlength="19"
              placeholder="۶۲۱۹ ۸۶۱۸ ۸۷۷۲ ۳۱۸۶"
              dir="ltr"
            />
          </label>
          <label class="bank-card-field">
            <span class="bank-card-field-label">نام و نام خانوادگی</span>
            <input
              id="bankCardHolderInput"
              class="bank-card-input"
              type="text"
              autocomplete="cc-name"
              maxlength="64"
              placeholder="مثلاً مهدی رستمی‌زاد"
            />
          </label>
          <p id="bankCardHint" class="bank-card-hint">با وارد کردن شماره کارت، بانک به‌صورت خودکار تشخیص داده می‌شود.</p>
          <div class="bank-card-modal-actions">
            <button type="button" id="bankCardModalCancel" class="bank-card-modal-cancel">انصراف</button>
            <button type="button" id="bankCardModalSave" class="bank-card-share-btn">ذخیره کارت</button>
          </div>
        </div>
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
            <label class="market-more-row market-more-toggle-row">
              <span class="market-more-row-label">فقط ساعات بازار (۹–۱۷ تهران)</span>
              <input type="checkbox" id="alertsMarketHoursOnly" class="market-more-switch" />
            </label>
            <div class="market-alert-watch-group" role="group" aria-label="انتخاب نمادهای هشدار">
              <p class="market-more-field-label">نمادهای تحت نظر</p>
              <label class="market-alert-watch-row">
                <span>دلار</span>
                <input type="checkbox" id="alertWatchDollar" class="market-more-switch" />
              </label>
              <label class="market-alert-watch-row">
                <span>طلای ۱۸</span>
                <input type="checkbox" id="alertWatchGeram18" class="market-more-switch" />
              </label>
              <label class="market-alert-watch-row">
                <span>سکه</span>
                <input type="checkbox" id="alertWatchSekee" class="market-more-switch" />
              </label>
            </div>
            <p class="market-more-hint">وقتی نمادهای انتخاب‌شده بیش از آستانه تغییر کنند، اعلان نمایش داده می‌شود.</p>
          </section>

          <section class="market-more-section">
            <h3 class="market-more-section-title">میانبر</h3>
            <button type="button" id="settingsOpenToolsBtn" class="market-more-row" data-market-tab="tools">
              <span class="market-more-row-label">ابزارها · کارت‌های بانکی</span>
              <span class="market-more-row-value">باز کردن</span>
            </button>
          </section>
        </div>
      </div>

      <div id="moreDonatePanel" class="more-subpanel hidden">
        <div class="market-more-scroll">
          <section class="donate-card" aria-label="حمایت از توسعه‌دهنده">
            <div class="donate-badge">حمایت از توسعه‌دهنده</div>
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
            <p class="donate-footnote">هیچ پرداخت اجباری نیست؛ همین که از اپ استفاده می‌کنی ارزشمنده ❤️</p>
          </section>
        </div>
      </div>

      <div id="moreAboutPanel" class="more-subpanel hidden">
        <div class="market-more-scroll">
          <section class="market-more-section" id="appUpdateSection">
            <h3 class="market-more-section-title">درباره ما</h3>
            <p class="market-about-text">
              <strong>تصمیم</strong> کمک می‌کند قبل از خرید ارز، طلا، خودرو یا ملک، با اطلاعات لحظه‌ای مطمئن‌تر تصمیم بگیری.
            </p>
            <ul class="market-about-scenarios">
              <li>چک روزانه قیمت دلار و طلا</li>
              <li>تخمین قیمت خودرو قبل از خرید</li>
              <li>جستجوی ملک متناسب با بودجه</li>
            </ul>
            <button type="button" id="inviteFriendBtn" class="market-invite-btn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M16 8a6 6 0 01-12 0M12 16v5M8 21h8"/>
              </svg>
              دعوت دوست
            </button>
            <p class="market-more-hint">متن دعوت و لینک نصب را برای دوستانتان بفرستید.</p>
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

    <div id="softDonatePrompt" class="soft-donate-prompt hidden" role="dialog" aria-modal="true" aria-labelledby="softDonateTitle">
      <div class="soft-donate-card">
        <p id="softDonateTitle" class="soft-donate-title">از تصمیم راضی بودی؟</p>
        <p class="soft-donate-text">اگر تخمین خودرو یا جستجوی ملک برات مفید بود، یک حمایت کوچک مسیر ساخت امکانات بعدی را روشن‌تر می‌کند.</p>
        <div class="soft-donate-actions">
          <button type="button" id="softDonateLaterBtn" class="soft-donate-later">الان نه</button>
          <button type="button" id="softDonateGoBtn" class="soft-donate-go">حمایت می‌کنم</button>
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
      gap: 0;
      min-width: 0;
      max-width: 100%;
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

    .header-tagline {
      margin: 2px 0 0;
      font-size: 10px;
      font-weight: 600;
      color: var(--muted);
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: min(220px, 56vw);
    }

    .market-tools-btn {
      width: 40px;
      height: 40px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border-strong, var(--border));
      border-radius: 12px;
      background: var(--surface);
      color: var(--muted);
      cursor: pointer;
      justify-self: end;
    }

    .market-tools-btn.is-active,
    .market-tools-btn:active {
      color: var(--accent);
      border-color: color-mix(in srgb, var(--accent) 35%, var(--border));
      background: color-mix(in srgb, var(--accent) 12%, transparent);
    }

    .market-tools-btn svg {
      width: 18px;
      height: 18px;
    }

    .market-value-prop {
      flex-shrink: 0;
      padding: 8px 12px;
      border-radius: 12px;
      background: color-mix(in srgb, var(--accent) 10%, var(--surface));
      border: 1px solid color-mix(in srgb, var(--accent) 18%, var(--border));
    }

    .market-value-prop-text {
      margin: 0;
      font-size: 12px;
      line-height: 1.55;
      font-weight: 600;
      color: var(--text);
    }

    .market-about-scenarios {
      margin: 10px 0 0;
      padding: 0 16px 0 0;
      display: flex;
      flex-direction: column;
      gap: 6px;
      color: var(--text);
      font-size: 12px;
      line-height: 1.5;
      font-weight: 600;
    }

    .soft-donate-prompt {
      position: fixed;
      inset: 0;
      z-index: 5200;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding: 16px;
      padding-bottom: calc(96px + env(safe-area-inset-bottom, 0px));
      background: rgba(8, 12, 20, 0.45);
      backdrop-filter: blur(4px);
    }

    .soft-donate-prompt.hidden {
      display: none;
    }

    .soft-donate-card {
      width: min(420px, 100%);
      padding: 16px;
      border-radius: 18px;
      background: var(--surface);
      border: 1px solid var(--border-strong, var(--border));
      box-shadow: 0 18px 40px rgba(0, 0, 0, 0.28);
    }

    .soft-donate-title {
      margin: 0;
      font-size: 15px;
      font-weight: 800;
      color: var(--text);
    }

    .soft-donate-text {
      margin: 8px 0 0;
      font-size: 12px;
      line-height: 1.65;
      color: var(--muted);
    }

    .soft-donate-actions {
      margin-top: 14px;
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 8px;
    }

    .soft-donate-later,
    .soft-donate-go {
      min-height: 42px;
      border-radius: 12px;
      font-family: inherit;
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
    }

    .soft-donate-later {
      border: 1px solid var(--border-strong, var(--border));
      background: transparent;
      color: var(--muted);
    }

    .soft-donate-go {
      border: none;
      background: var(--accent);
      color: var(--accent-fg);
    }

    #view-tools.market-view {
      position: relative;
      overflow: hidden;
      gap: 0;
      padding-bottom: 0;
    }

    #view-tools .market-more-scroll {
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      flex: 1;
      min-height: 0;
      padding-bottom: 8px;
    }

    .market-bottom-nav-penta .market-nav-label {
      font-size: 9px;
    }

    .market-bottom-nav-penta .market-nav-btn {
      padding: 6px 1px 4px;
    }

    .market-bottom-nav-penta .market-nav-fab-wrap {
      width: 52px;
      flex: 0 0 52px;
    }

    .cars-empty-friendly,
    .housing-empty-friendly {
      margin: 0;
      padding: 14px;
      border-radius: 14px;
      border: 1px dashed color-mix(in srgb, var(--accent) 28%, var(--border));
      background: color-mix(in srgb, var(--accent) 8%, var(--surface));
      color: var(--text);
      font-size: 12px;
      line-height: 1.7;
      font-weight: 600;
    }

    .cars-empty-friendly span,
    .housing-empty-friendly span {
      display: block;
      margin-top: 4px;
      color: var(--muted);
      font-weight: 500;
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
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      grid-auto-rows: auto;
      align-items: stretch;
      gap: 10px;
      padding: 0 0 10px;
    }

    .market-root .grid.price-stack > .price-hero-card {
      width: 100%;
      min-width: 0;
    }

    #view-currency {
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .currency-prices-panel {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
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
      gap: 4px;
      padding: 4px;
      border-radius: 14px;
      background: var(--bg);
      border: 1px solid var(--border);
      flex-shrink: 0;
    }

    .more-subtab-btn {
      border: none;
      border-radius: 11px;
      padding: 10px 4px;
      background: transparent;
      color: var(--muted);
      font-family: inherit;
      font-size: 11px;
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

    .cars-estimate-mode-toggle {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      padding: 4px;
      border-radius: 14px;
      background: var(--bg);
      border: 1px solid var(--border);
      flex-shrink: 0;
    }

    .cars-estimate-mode-btn {
      border: none;
      border-radius: 11px;
      padding: 10px 8px;
      background: transparent;
      color: var(--muted);
      font-family: inherit;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }

    .cars-estimate-mode-btn.is-active {
      background: color-mix(in srgb, var(--accent) 16%, var(--surface));
      color: var(--accent);
    }

    .cars-estimate-mode-panel {
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex-shrink: 0;
    }

    .cars-estimate-mode-panel.hidden {
      display: none;
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

    [data-theme="light"] .cars-estimate-mode-toggle {
      background: #ffffff;
      border-color: var(--border-strong);
    }

    [data-theme="light"] .cars-estimate-mode-btn.is-active {
      background: color-mix(in srgb, var(--accent) 14%, #ffffff);
      color: var(--accent);
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

    .housing-form-actions {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 8px;
    }

    .housing-save-btn {
      min-height: 46px;
      border-radius: 12px;
      border: 1px solid color-mix(in srgb, var(--accent) 30%, var(--border));
      background: color-mix(in srgb, var(--accent) 12%, transparent);
      color: var(--accent);
      font-family: inherit;
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
    }

    .housing-save-btn:active {
      transform: scale(0.99);
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

    .housing-detail-sheet {
      position: fixed;
      inset: 0;
      z-index: 5200;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }

    .housing-detail-sheet.hidden {
      display: none;
    }

    .housing-detail-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(15, 23, 42, 0.45);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
    }

    .housing-detail-panel {
      position: relative;
      width: 100%;
      max-width: var(--max-w, 720px);
      margin: 0 auto;
      max-height: min(88dvh, 760px);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border-radius: 22px 22px 0 0;
      background: var(--surface);
      border: 1px solid var(--border-strong, var(--border));
      border-bottom: none;
      box-shadow: 0 -16px 40px rgba(15, 23, 42, 0.2);
      animation: housing-detail-up 0.28s ease;
    }

    @keyframes housing-detail-up {
      from { transform: translateY(24px); opacity: 0.6; }
      to { transform: translateY(0); opacity: 1; }
    }

    .housing-detail-handle {
      width: 40px;
      height: 4px;
      border-radius: 999px;
      background: var(--border-strong, var(--border));
      margin: 10px auto 6px;
      flex-shrink: 0;
    }

    .housing-detail-content {
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
    }

    .housing-detail-body {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .housing-detail-gallery .housing-gallery-image,
    .housing-detail-gallery-image {
      height: 240px;
    }

    .housing-detail-gallery-empty {
      min-height: 160px;
    }

    .housing-detail-main {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 14px 16px 18px;
    }

    .housing-detail-badge {
      align-self: flex-start;
      padding: 4px 10px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--danger, #ef4444) 14%, transparent);
      color: var(--danger, #ef4444);
      font-size: 11px;
      font-weight: 800;
    }

    .housing-detail-title {
      margin: 0;
      font-size: 16px;
      font-weight: 800;
      line-height: 1.55;
      color: var(--text);
    }

    .housing-detail-location {
      margin: 0;
      font-size: 12px;
      color: var(--muted);
    }

    .housing-detail-specs {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }

    .housing-detail-spec {
      padding: 10px 12px;
      border-radius: 12px;
      background: color-mix(in srgb, var(--surface-2) 70%, var(--border));
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }

    .housing-detail-spec-label {
      font-size: 11px;
      color: var(--muted);
    }

    .housing-detail-spec-value {
      font-size: 13px;
      font-weight: 800;
      color: var(--text);
      line-height: 1.4;
    }

    .housing-detail-meta {
      margin: 0;
      font-size: 12px;
      line-height: 1.65;
      color: var(--muted);
    }

    .housing-detail-desc-wrap {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .housing-detail-desc-title {
      margin: 0;
      font-size: 13px;
      font-weight: 800;
      color: var(--text);
    }

    .housing-detail-desc {
      margin: 0;
      font-size: 13px;
      line-height: 1.75;
      color: var(--text);
      white-space: pre-wrap;
    }

    .housing-detail-desc-empty {
      color: var(--muted);
      font-size: 12px;
    }

    .housing-detail-divar-btn {
      margin-top: 4px;
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

    .housing-detail-loading {
      padding: 28px 16px 40px;
      text-align: center;
      color: var(--muted);
      font-size: 13px;
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
      display: flex;
      flex-direction: column;
      overflow: visible;
      border-radius: 20px;
      border: 1px solid color-mix(in srgb, var(--accent) 20%, var(--border));
      min-width: 0;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      background: linear-gradient(
        155deg,
        color-mix(in srgb, var(--accent) 16%, var(--surface)) 0%,
        var(--surface) 46%,
        color-mix(in srgb, var(--accent) 8%, var(--surface-2)) 100%
      );
      box-shadow:
        var(--card-shadow, 0 4px 18px rgba(0, 0, 0, 0.12)),
        inset 0 1px 0 color-mix(in srgb, var(--accent) 10%, transparent);
      padding: 16px 14px 18px;
      color: var(--text);
    }

    .price-hero-card::before,
    .price-hero-card::after {
      content: "";
      position: absolute;
      pointer-events: none;
      border-radius: inherit;
      z-index: 0;
    }

    .price-hero-card::before {
      inset: 0;
    }

    .price-hero-card::after {
      top: -48px;
      right: -32px;
      width: 168px;
      height: 168px;
      border-radius: 50%;
      background: radial-gradient(
        circle,
        color-mix(in srgb, var(--accent) 24%, transparent) 0%,
        transparent 68%
      );
    }

    .price-hero-card-body {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
      min-width: 0;
      flex: 1 1 auto;
    }

    /* Dollar — fixed green banknote style (theme-independent) */
    .price-hero-card--dollar {
      --dollar-green-deep: #0a3d2c;
      --dollar-green-mid: #145c42;
      --dollar-green-light: #1a7a55;
      --dollar-green-edge: #0f523a;
      --dollar-ink: #ffffff;
      --dollar-ink-muted: rgba(255, 255, 255, 0.76);
      border-color: rgba(186, 230, 200, 0.34);
      background: linear-gradient(
        155deg,
        var(--dollar-green-deep) 0%,
        var(--dollar-green-mid) 36%,
        var(--dollar-green-light) 62%,
        var(--dollar-green-edge) 100%
      );
      color: var(--dollar-ink);
      box-shadow:
        0 10px 28px rgba(8, 60, 40, 0.38),
        inset 0 1px 0 rgba(255, 255, 255, 0.12),
        inset 0 0 0 1px rgba(186, 230, 200, 0.14);
    }

    .price-hero-card--dollar::before {
      background-image: url("${DOLLAR_BILL_WATERMARK_URL}");
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 155% auto;
    }

    .price-hero-card--dollar::after {
      inset: 0;
      width: auto;
      height: auto;
      border-radius: inherit;
      background: radial-gradient(
        ellipse 120% 90% at 50% 100%,
        rgba(210, 240, 220, 0.1) 0%,
        transparent 62%
      );
    }

    .price-hero-card--dollar .price-hero-card-kicker,
    .price-hero-card--dollar .price-hero-card-subtitle,
    .price-hero-card--dollar .price-hero-card-time,
    .price-hero-card--dollar .price-hero-share-hint {
      color: var(--dollar-ink-muted);
    }

    .price-hero-card--dollar .price-hero-card-title,
    .price-hero-card--dollar .price-hero-card-value {
      color: var(--dollar-ink);
    }

    .price-hero-card--dollar .price-hero-card-icon {
      background: rgba(255, 255, 255, 0.16);
      color: var(--dollar-ink);
      box-shadow: inset 0 0 0 1px rgba(210, 240, 220, 0.28);
    }

    .price-hero-card--dollar .price-hero-card-change.is-up,
    .price-hero-card--dollar .price-hero-card-change.is-down,
    .price-hero-card--dollar .price-hero-card-change.is-flat {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.18);
    }

    .price-hero-card--dollar .price-hero-chart-wrap {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(210, 240, 220, 0.22);
    }

    .price-hero-card--dollar .price-hero-spark {
      color: #ffffff;
    }

    .price-hero-card--dollar .price-hero-spark .rate-card-spark-dot {
      stroke: rgba(15, 52, 40, 0.35);
    }

    .price-hero-card--dollar .price-hero-share-row .market-share-icon-btn {
      background: rgba(255, 255, 255, 0.14);
      color: #ffffff;
      border-color: rgba(210, 240, 220, 0.32);
    }

    /* Gold — warm tint with trophy watermark */
    .price-hero-card--gold {
      border-color: color-mix(in srgb, #d4a017 40%, var(--border));
      background: linear-gradient(
        155deg,
        color-mix(in srgb, #f0c14b 22%, var(--surface)) 0%,
        var(--surface) 42%,
        color-mix(in srgb, #c9971a 10%, var(--surface-2)) 100%
      );
      box-shadow:
        var(--card-shadow, 0 4px 18px rgba(0, 0, 0, 0.12)),
        0 10px 28px color-mix(in srgb, #d4a017 12%, transparent),
        inset 0 1px 0 color-mix(in srgb, #ffe9a8 18%, transparent);
    }

    .price-hero-card--gold::before {
      background-image: url("${GOLD_MEDAL_WATERMARK_URL}");
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }

    .price-hero-card--gold::after {
      inset: 0;
      width: auto;
      height: auto;
      border-radius: inherit;
      background: radial-gradient(
        ellipse 120% 90% at 50% 100%,
        color-mix(in srgb, #f0c14b 14%, transparent) 0%,
        transparent 62%
      );
    }

    .price-hero-card--gold .price-hero-card-kicker,
    .price-hero-card--gold .price-hero-card-subtitle,
    .price-hero-card--gold .price-hero-card-time,
    .price-hero-card--gold .price-hero-share-hint {
      color: rgba(255, 255, 255, 0.76);
    }

    .price-hero-card--gold .price-hero-card-title {
      color: color-mix(in srgb, #f6e27a 35%, var(--text));
    }

    .price-hero-card--gold .price-hero-card-value {
      color: var(--text);
    }

    .price-hero-card--gold .price-hero-card-icon {
      background: color-mix(in srgb, #f0c14b 18%, var(--surface-2));
      color: color-mix(in srgb, #f6e27a 70%, var(--text));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, #d4a017 28%, var(--border));
    }

    .price-hero-card--gold .price-hero-card-change.is-up,
    .price-hero-card--gold .price-hero-card-change.is-down,
    .price-hero-card--gold .price-hero-card-change.is-flat {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.18);
    }

    .price-hero-card--gold .price-hero-chart-wrap {
      background: color-mix(in srgb, #d4a017 10%, var(--surface-2));
      border: 1px solid color-mix(in srgb, #d4a017 16%, var(--border));
    }

    .price-hero-card--gold .price-hero-spark {
      color: color-mix(in srgb, #f0c14b 75%, var(--text));
    }

    .price-hero-card--gold .price-hero-spark .rate-card-spark-dot {
      stroke: var(--surface);
    }

    .price-hero-card--gold .price-hero-share-row .market-share-icon-btn {
      background: rgba(255, 255, 255, 0.14);
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.28);
    }

    .price-hero-card-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
      min-width: 0;
      flex-shrink: 0;
    }

    .price-hero-card-title-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
      flex: 1 1 auto;
    }

    .price-hero-card-title-wrap > div {
      flex: 1 1 auto;
      min-width: 0;
    }

    .price-hero-card-icon {
      width: 42px;
      height: 42px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--accent) 14%, var(--surface-2));
      color: var(--accent);
      font-size: 22px;
      line-height: 1;
      flex-shrink: 0;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 22%, var(--border));
    }

    .price-hero-card-kicker {
      margin: 0;
      font-size: 11px;
      font-weight: 600;
      color: var(--muted);
    }

    .price-hero-card-title {
      margin: 2px 0 0;
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
      color: var(--muted);
      flex-shrink: 0;
    }

    .price-hero-card-value-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      min-width: 0;
      flex-wrap: wrap;
      flex-shrink: 0;
    }

    .price-hero-card-value {
      flex: 1 1 auto;
      min-width: 0;
      max-width: 100%;
      font-size: clamp(20px, 6.5vw, 28px);
      font-weight: 800;
      line-height: 1.5;
      font-variant-numeric: tabular-nums;
      color: var(--text);
      letter-spacing: -0.02em;
      overflow-wrap: anywhere;
      word-break: break-word;
      padding: 2px 0 4px;
      overflow: visible;
    }

    .price-hero-card-change {
      flex: 0 0 auto;
      align-self: center;
      font-size: 12px;
      font-weight: 700;
      padding: 6px 10px;
      border-radius: 999px;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    .price-hero-card-change.is-up {
      color: #00c853;
      background: color-mix(in srgb, #00c853 14%, transparent);
    }

    .price-hero-card-change.is-down {
      color: #ef4444;
      background: color-mix(in srgb, #ef4444 14%, transparent);
    }

    .price-hero-card-change.is-flat {
      color: var(--muted);
      background: color-mix(in srgb, var(--muted) 12%, transparent);
    }

    .price-hero-share-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding-top: 4px;
      min-width: 0;
      flex-wrap: wrap;
      flex-shrink: 0;
    }

    .price-hero-share-hint {
      margin: 0;
      flex: 1 1 120px;
      min-width: 0;
      font-size: 11px;
      font-weight: 600;
      color: var(--muted);
    }

    .price-hero-share-row .market-share-icon-btn {
      width: auto;
      min-width: 132px;
      height: 40px;
      padding: 0 14px;
      border-radius: 12px;
      border: 1px solid color-mix(in srgb, var(--accent) 28%, var(--border));
      background: color-mix(in srgb, var(--accent) 14%, var(--surface));
      color: var(--accent);
      box-shadow: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      flex-shrink: 0;
    }

    .price-hero-share-row .market-share-icon-btn svg {
      width: 16px;
      height: 16px;
    }

    .price-hero-share-row .market-share-icon-btn::after {
      content: "اشتراک‌گذاری";
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
      flex: 0 0 58px;
      width: 58px;
      height: 30px;
      overflow: visible;
      background: transparent;
    }

    .rate-card-spark-fill {
      opacity: 1;
    }

    .rate-card-spark-line {
      fill: none;
      stroke: currentColor;
      stroke-width: 1.7;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .rate-card-spark-dot {
      fill: currentColor;
      stroke: var(--surface);
      stroke-width: 1.5;
    }

    .rate-card-spark.is-up {
      color: #22c55e;
    }

    .rate-card-spark.is-down {
      color: #ef4444;
    }

    .rate-card-spark.is-flat {
      color: var(--muted);
    }

    .price-hero-chart-wrap {
      position: relative;
      height: 46px;
      min-height: 46px;
      border-radius: 12px;
      overflow: hidden;
      background: color-mix(in srgb, var(--accent) 8%, var(--surface-2));
      border: 1px solid color-mix(in srgb, var(--accent) 12%, var(--border));
      flex-shrink: 0;
    }

    .price-hero-spark {
      display: block;
      width: 100%;
      height: 46px;
      color: var(--accent);
    }

    .price-hero-spark .rate-card-spark-fill {
      opacity: 1;
    }

    .price-hero-spark .rate-card-spark-line {
      stroke-width: 2;
    }

    .price-hero-spark .rate-card-spark-dot {
      stroke: var(--surface);
      stroke-width: 1.6;
    }

    .is-collapsible.cars-estimate-section {
      padding: 10px;
      border-radius: 16px;
      border: 1px solid var(--border-strong, var(--border));
      background: color-mix(in srgb, var(--surface) 92%, var(--surface-2));
      gap: 0;
    }

    .collapse-panel-toggle {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 6px 4px;
      border: none;
      border-radius: 12px;
      background: transparent;
      color: inherit;
      font-family: inherit;
      text-align: right;
      cursor: pointer;
    }

    .collapse-panel-toggle:active {
      background: color-mix(in srgb, var(--accent) 8%, transparent);
    }

    .collapse-panel-main {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
      flex: 1;
    }

    .collapse-panel-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--accent) 14%, transparent);
      font-size: 18px;
    }

    .collapse-panel-copy {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
      text-align: right;
    }

    .collapse-panel-title {
      font-size: 14px;
      font-weight: 800;
      color: var(--text);
      line-height: 1.3;
    }

    .collapse-panel-desc {
      font-size: 11px;
      font-weight: 600;
      color: var(--muted);
      line-height: 1.4;
    }

    .collapse-panel-action {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-height: 34px;
      padding: 0 10px 0 8px;
      border-radius: 999px;
      border: 1px solid color-mix(in srgb, var(--accent) 28%, var(--border));
      background: color-mix(in srgb, var(--accent) 12%, transparent);
      color: var(--accent);
      font-size: 12px;
      font-weight: 800;
    }

    .collapse-panel-chevron {
      width: 8px;
      height: 8px;
      border-right: 2px solid currentColor;
      border-bottom: 2px solid currentColor;
      transform: rotate(45deg);
      margin-top: -3px;
      transition: transform 0.2s ease;
    }

    .is-collapsible.is-collapsed .collapse-panel-chevron {
      transform: rotate(-135deg);
      margin-top: 3px;
    }

    .collapse-panel-preview {
      display: none;
      flex-wrap: wrap;
      gap: 6px;
      margin: 8px 4px 2px;
    }

    .is-collapsible.is-collapsed .collapse-panel-preview {
      display: flex;
    }

    .collapse-panel-preview span {
      display: inline-flex;
      align-items: center;
      min-height: 26px;
      padding: 0 10px;
      border-radius: 999px;
      border: 1px dashed color-mix(in srgb, var(--accent) 30%, var(--border));
      background: color-mix(in srgb, var(--accent) 8%, transparent);
      color: var(--muted);
      font-size: 11px;
      font-weight: 700;
    }

    .collapse-section-body {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--border);
    }

    .collapse-section-body.is-collapsed {
      display: none;
    }

    .collapse-inline-hint {
      margin: 0 0 10px;
    }

    .is-collapsible.is-collapsed .collapse-panel-desc {
      color: var(--text);
      opacity: 0.75;
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
      color: #00c853;
    }

    .rate-card-change.is-down {
      color: #ff4d6d;
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

    .bank-card-tool {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 4px 2px 88px;
      min-height: 0;
    }

    .bank-cards-page {
      position: relative;
    }

    .bank-card-empty {
      margin: 28px 8px 0;
      padding: 28px 18px;
      border-radius: 18px;
      border: 1px dashed color-mix(in srgb, var(--accent) 30%, var(--border));
      background: color-mix(in srgb, var(--accent) 8%, var(--surface));
      text-align: center;
    }

    .bank-card-empty.hidden {
      display: none;
    }

    .bank-card-empty-title {
      margin: 0 0 6px;
      font-size: 15px;
      font-weight: 800;
      color: var(--text);
    }

    .bank-card-empty-hint {
      margin: 0;
      font-size: 12px;
      line-height: 1.6;
      color: var(--muted);
    }

    .bank-card-stack-viewport {
      position: relative;
      width: 100%;
      max-width: 420px;
      margin: 8px auto 0;
      padding: 12px 10px 28px;
      touch-action: pan-y;
      user-select: none;
      -webkit-user-select: none;
    }

    .bank-card-stack-viewport.hidden {
      display: none;
    }

    .bank-card-stack {
      position: relative;
      width: 100%;
      aspect-ratio: 1.586 / 1;
      perspective: 1400px;
      transform-style: preserve-3d;
    }

    .bank-card-slide {
      position: absolute;
      inset: 0;
      border: none;
      padding: 0;
      background: transparent;
      transform-origin: center center;
      transition:
        transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.35s ease,
        filter 0.35s ease;
      will-change: transform, opacity;
      cursor: grab;
      -webkit-tap-highlight-color: transparent;
    }

    .bank-card-slide.is-dragging {
      transition: none;
      cursor: grabbing;
    }

    .bank-card-slide.is-front {
      z-index: 5;
      pointer-events: auto;
    }

    .bank-card-slide:not(.is-front) {
      pointer-events: none;
    }

    .bank-card-preview {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 20px;
      padding: 20px 20px 18px;
      color: #fff;
      overflow: hidden;
      isolation: isolate;
      box-shadow:
        0 22px 48px color-mix(in srgb, var(--bank-c1, #0e4d5c) 40%, transparent),
        0 6px 16px rgba(15, 23, 42, 0.22),
        inset 0 1px 0 rgba(255, 255, 255, 0.22);
      background:
        linear-gradient(115deg, rgba(255, 255, 255, 0.18) 0%, transparent 28%, transparent 62%, rgba(255, 255, 255, 0.08) 100%),
        radial-gradient(120% 90% at 8% 8%, color-mix(in srgb, #ffffff 26%, transparent), transparent 46%),
        radial-gradient(90% 80% at 92% 12%, color-mix(in srgb, #ffffff 16%, transparent), transparent 40%),
        radial-gradient(70% 60% at 70% 88%, color-mix(in srgb, #000000 28%, transparent), transparent 55%),
        linear-gradient(145deg, var(--bank-c1, #0e4d5c), var(--bank-c2, #1a7a8c) 55%, color-mix(in srgb, var(--bank-c1, #0e4d5c) 70%, #000) 100%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .bank-card-preview::before {
      content: "";
      position: absolute;
      inset: -30% -20% auto auto;
      width: 80%;
      height: 80%;
      border-radius: 50%;
      background: radial-gradient(circle, color-mix(in srgb, #ffffff 18%, transparent), transparent 68%);
      pointer-events: none;
      z-index: 0;
    }

    .bank-card-preview::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        125deg,
        transparent 0%,
        transparent 42%,
        rgba(255, 255, 255, 0.14) 50%,
        transparent 58%,
        transparent 100%
      );
      mix-blend-mode: soft-light;
      pointer-events: none;
      z-index: 0;
      animation: bank-card-sheen 4.8s ease-in-out infinite;
    }

    @keyframes bank-card-sheen {
      0%, 100% { transform: translateX(-18%); opacity: 0.35; }
      50% { transform: translateX(18%); opacity: 0.7; }
    }

    @media (prefers-reduced-motion: reduce) {
      .bank-card-preview::after {
        animation: none;
      }
      .bank-card-slide {
        transition: none;
      }
    }

    .bank-card-preview > * {
      position: relative;
      z-index: 1;
    }

    .bank-card-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }

    .bank-card-chip-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .bank-card-chip {
      width: 46px;
      height: 34px;
      border-radius: 8px;
      background: linear-gradient(145deg, #f7e7b5, #c9a24d 42%, #f0d9a0 78%, #a9842f);
      box-shadow:
        inset 0 0 0 1px rgba(255, 255, 255, 0.4),
        0 2px 6px rgba(0, 0, 0, 0.22);
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 1px;
      padding: 5px;
      opacity: 0.98;
    }

    .bank-card-chip span {
      border-radius: 2px;
      background: color-mix(in srgb, #8a6a2a 40%, transparent);
    }

    .bank-card-contactless {
      width: 22px;
      height: 22px;
      opacity: 0.85;
      color: rgba(255, 255, 255, 0.92);
    }

    .bank-card-brand {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 6px;
      text-align: left;
      max-width: 58%;
    }

    .bank-card-logo-img {
      width: 52px;
      height: 52px;
      object-fit: contain;
      border-radius: 14px;
      background: #ffffff;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.28);
      padding: 5px;
    }

    .bank-card-logo-img.hidden {
      display: none;
    }

    .bank-card-logo-mark {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 44px;
      padding: 5px 10px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.16);
      border: 1px solid rgba(255, 255, 255, 0.28);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.02em;
      backdrop-filter: blur(6px);
    }

    .bank-card-logo-mark.hidden {
      display: none;
    }

    .bank-card-logo-name {
      font-size: 12px;
      font-weight: 700;
      opacity: 0.95;
      line-height: 1.3;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
    }

    .bank-card-number {
      margin: 4px 0 0;
      width: 100%;
      font-family: ui-monospace, "Cascadia Code", "SF Mono", Menlo, Consolas, monospace;
      font-size: clamp(14px, 4.2vw, 22px);
      font-weight: 700;
      letter-spacing: 0.08em;
      text-align: center;
      direction: ltr;
      unicode-bidi: isolate;
      white-space: nowrap;
      overflow: hidden;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.28);
    }

    .bank-card-bottom {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 12px;
      padding-top: 4px;
      border-top: 1px solid rgba(255, 255, 255, 0.14);
    }

    .bank-card-meta {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .bank-card-meta-end {
      text-align: left;
      align-items: flex-end;
    }

    .bank-card-meta-label {
      font-size: 10px;
      font-weight: 600;
      opacity: 0.72;
      letter-spacing: 0.06em;
    }

    .bank-card-meta-value {
      font-size: 13px;
      font-weight: 800;
      line-height: 1.35;
      word-break: break-word;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    .bank-card-slide-actions {
      position: absolute;
      top: 12px;
      left: 12px;
      z-index: 3;
      display: flex;
      gap: 8px;
    }

    .bank-card-icon-btn {
      width: 36px;
      height: 36px;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.28);
      background: rgba(15, 23, 42, 0.35);
      color: #fff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      box-shadow: 0 6px 14px rgba(0, 0, 0, 0.22);
    }

    .bank-card-icon-btn svg {
      width: 16px;
      height: 16px;
    }

    .bank-card-icon-btn:active {
      transform: scale(0.96);
    }

    .bank-card-icon-btn.is-danger {
      background: color-mix(in srgb, #ff4d6d 55%, rgba(15, 23, 42, 0.35));
    }

    .bank-card-dots {
      display: flex;
      justify-content: center;
      gap: 7px;
      padding: 2px 0 0;
    }

    .bank-card-dots.hidden {
      display: none;
    }

    .bank-card-dot {
      width: 7px;
      height: 7px;
      border-radius: 999px;
      border: none;
      padding: 0;
      background: color-mix(in srgb, var(--muted) 45%, transparent);
      cursor: pointer;
      transition: width 0.2s ease, background 0.2s ease;
    }

    .bank-card-dot.is-active {
      width: 18px;
      background: var(--accent);
    }

    .bank-card-modal {
      position: fixed;
      inset: 0;
      z-index: 5000;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }

    .bank-card-modal.hidden {
      display: none;
    }

    .bank-card-modal-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(15, 23, 42, 0.45);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
    }

    .bank-card-modal-sheet {
      position: relative;
      width: 100%;
      max-width: var(--max-w, 720px);
      margin: 0 auto;
      max-height: min(86dvh, 640px);
      overflow: auto;
      border-radius: 22px 22px 0 0;
      background: var(--surface);
      border: 1px solid var(--border-strong, var(--border));
      border-bottom: none;
      padding: 8px 16px calc(18px + env(safe-area-inset-bottom, 0px));
      box-shadow: 0 -16px 40px rgba(15, 23, 42, 0.2);
      animation: bank-card-modal-up 0.28s ease;
    }

    @keyframes bank-card-modal-up {
      from { transform: translateY(24px); opacity: 0.6; }
      to { transform: translateY(0); opacity: 1; }
    }

    .bank-card-modal-handle {
      width: 40px;
      height: 4px;
      border-radius: 999px;
      background: var(--border-strong, var(--border));
      margin: 6px auto 12px;
    }

    .bank-card-modal-title {
      margin: 0 0 12px;
      font-size: 16px;
      font-weight: 800;
      color: var(--text);
      text-align: center;
    }

    .bank-card-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 4px 0 0;
    }

    .bank-card-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .bank-card-field-label {
      font-size: 12px;
      font-weight: 700;
      color: var(--muted);
    }

    .bank-card-input {
      width: 100%;
      min-height: 46px;
      padding: 10px 12px;
      border-radius: 12px;
      border: 1px solid var(--border-strong, var(--border));
      background: var(--input-bg, var(--bg));
      color: var(--text);
      font-family: inherit;
      font-size: 15px;
      outline: none;
    }

    .bank-card-input[dir="ltr"] {
      font-family: ui-monospace, "Cascadia Code", "SF Mono", Menlo, Consolas, monospace;
      font-variant-numeric: tabular-nums;
      letter-spacing: 0.06em;
      text-align: left;
    }

    .bank-card-input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 18%, transparent);
    }

    .bank-card-hint {
      margin: 0;
      font-size: 11px;
      line-height: 1.6;
      color: var(--muted);
    }

    .bank-card-hint.is-error {
      color: #e11d48;
    }

    .bank-card-modal-actions {
      display: flex;
      gap: 10px;
      margin-top: 4px;
    }

    .bank-card-modal-cancel {
      flex: 0 0 auto;
      min-width: 96px;
      min-height: 48px;
      border-radius: 14px;
      border: 1px solid var(--border-strong, var(--border));
      background: var(--surface-2);
      color: var(--text);
      font-family: inherit;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
    }

    .bank-card-share-btn {
      flex: 1 1 auto;
      width: auto;
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

    .bank-card-share-btn:disabled {
      opacity: 0.55;
      cursor: not-allowed;
      box-shadow: none;
    }

    .bank-card-share-btn:not(:disabled):active {
      transform: scale(0.99);
    }

    [data-theme="light"] .bank-card-input {
      background: var(--input-bg, #f7f9fc);
      border-color: var(--border-strong);
    }

    [data-theme="light"] .bank-card-modal-sheet {
      background: #ffffff;
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

    .estimate-result-box {
      border: 1px solid color-mix(in srgb, var(--accent) 28%, var(--border));
      background: color-mix(in srgb, var(--accent) 8%, var(--surface));
      box-shadow: 0 8px 22px color-mix(in srgb, var(--accent) 12%, transparent);
    }

    .estimate-result-box .cars-estimate-section-head {
      margin-bottom: 10px;
    }

    .estimate-result-box .divar-estimate-result {
      margin: 0;
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

    [data-theme="light"] .price-hero-card--dollar {
      border-color: rgba(186, 230, 200, 0.34);
      background: linear-gradient(155deg, #0a3d2c 0%, #145c42 36%, #1a7a55 62%, #0f523a 100%);
      color: #ffffff;
      box-shadow:
        0 10px 28px rgba(8, 60, 40, 0.28),
        inset 0 1px 0 rgba(255, 255, 255, 0.12),
        inset 0 0 0 1px rgba(186, 230, 200, 0.14);
    }

    [data-theme="light"] .price-hero-card--dollar .price-hero-card-kicker,
    [data-theme="light"] .price-hero-card--dollar .price-hero-card-subtitle,
    [data-theme="light"] .price-hero-card--dollar .price-hero-card-time,
    [data-theme="light"] .price-hero-card--dollar .price-hero-share-hint {
      color: rgba(255, 255, 255, 0.76);
    }

    [data-theme="light"] .price-hero-card--dollar .price-hero-card-title,
    [data-theme="light"] .price-hero-card--dollar .price-hero-card-value {
      color: #ffffff;
    }

    [data-theme="light"] .price-hero-card--dollar .price-hero-card-icon {
      background: rgba(255, 255, 255, 0.16);
      color: #ffffff;
      box-shadow: inset 0 0 0 1px rgba(210, 240, 220, 0.28);
    }

    [data-theme="light"] .price-hero-card--dollar .price-hero-card-change.is-up,
    [data-theme="light"] .price-hero-card--dollar .price-hero-card-change.is-down,
    [data-theme="light"] .price-hero-card--dollar .price-hero-card-change.is-flat {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.18);
    }

    [data-theme="light"] .price-hero-card--dollar .price-hero-chart-wrap {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(210, 240, 220, 0.22);
    }

    [data-theme="light"] .price-hero-card--dollar .price-hero-spark {
      color: #ffffff;
    }

    [data-theme="light"] .price-hero-card--dollar .price-hero-spark .rate-card-spark-dot {
      stroke: rgba(15, 52, 40, 0.35);
    }

    [data-theme="light"] .price-hero-card--dollar .price-hero-share-row .market-share-icon-btn {
      background: rgba(255, 255, 255, 0.14);
      color: #ffffff;
      border-color: rgba(210, 240, 220, 0.32);
    }

    [data-theme="light"] .price-hero-card--gold {
      background: linear-gradient(
        155deg,
        #5c4200 0%,
        #8a6408 36%,
        #b8860b 62%,
        #6b4f0a 100%
      );
      border-color: color-mix(in srgb, #f5d76e 34%, var(--border));
      color: #ffffff;
      box-shadow:
        0 10px 28px rgba(92, 66, 0, 0.28),
        inset 0 1px 0 rgba(255, 255, 255, 0.12),
        inset 0 0 0 1px rgba(245, 215, 110, 0.14);
    }

    [data-theme="light"] .price-hero-card--gold .price-hero-card-kicker,
    [data-theme="light"] .price-hero-card--gold .price-hero-card-subtitle,
    [data-theme="light"] .price-hero-card--gold .price-hero-card-time,
    [data-theme="light"] .price-hero-card--gold .price-hero-share-hint {
      color: rgba(255, 255, 255, 0.76);
    }

    [data-theme="light"] .price-hero-card--gold .price-hero-card-title {
      color: #ffffff;
    }

    [data-theme="light"] .price-hero-card--gold .price-hero-card-value {
      color: #ffffff;
    }

    [data-theme="light"] .price-hero-card--gold .price-hero-card-icon {
      background: rgba(255, 255, 255, 0.16);
      color: #ffffff;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.28);
    }

    [data-theme="light"] .price-hero-card--gold .price-hero-card-change.is-up,
    [data-theme="light"] .price-hero-card--gold .price-hero-card-change.is-down,
    [data-theme="light"] .price-hero-card--gold .price-hero-card-change.is-flat {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.18);
    }

    [data-theme="light"] .price-hero-card--gold .price-hero-chart-wrap {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.22);
    }

    [data-theme="light"] .price-hero-card--gold .price-hero-spark {
      color: #ffffff;
    }

    [data-theme="light"] .price-hero-card--gold .price-hero-spark .rate-card-spark-dot {
      stroke: rgba(92, 66, 0, 0.35);
    }

    [data-theme="light"] .price-hero-card--gold .price-hero-share-row .market-share-icon-btn {
      background: rgba(255, 255, 255, 0.14);
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.28);
    }

    [data-theme="light"] .is-collapsible.cars-estimate-section {
      background: #ffffff;
      border-color: var(--border);
    }

    [data-theme="light"] .price-hero-share-row .market-share-icon-btn {
      background: color-mix(in srgb, var(--accent) 12%, #ffffff);
      color: var(--accent);
      border-color: color-mix(in srgb, var(--accent) 28%, var(--border));
      box-shadow: none;
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
    }

    .market-offline-banner {
      margin: 0 0 8px;
      padding: 8px 12px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 700;
      text-align: center;
      color: var(--accent-fg);
      background: color-mix(in srgb, var(--accent) 88%, #000);
      border: 1px solid color-mix(in srgb, var(--accent) 40%, transparent);
    }

    .market-offline-banner.hidden {
      display: none;
    }

    .market-trend-strip {
      display: flex;
      gap: 8px;
      margin: 0 0 10px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }

    .market-trend-strip.hidden {
      display: none;
    }

    .market-trend-strip::-webkit-scrollbar {
      display: none;
    }

    .market-trend-chip {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: var(--surface);
      font-size: 11px;
      font-weight: 700;
      white-space: nowrap;
    }

    .market-trend-chip.is-gold-target {
      border-color: color-mix(in srgb, #d4a017 55%, var(--border));
      background: linear-gradient(
        135deg,
        color-mix(in srgb, #f0c14b 28%, var(--surface)) 0%,
        color-mix(in srgb, #c9971a 22%, var(--surface)) 100%
      );
      box-shadow: inset 0 1px 0 color-mix(in srgb, #ffe9a8 35%, transparent);
    }

    .market-trend-chip.is-gold-target .market-trend-chip-label {
      color: color-mix(in srgb, #f6e27a 70%, var(--text));
    }

    .market-trend-chip.is-gold-target .market-trend-chip-value {
      color: #ffe9a8;
    }

    [data-theme="light"] .market-trend-chip.is-gold-target {
      border-color: color-mix(in srgb, #b8860b 40%, var(--border));
      background: linear-gradient(
        135deg,
        color-mix(in srgb, #f5d76e 55%, #fff) 0%,
        color-mix(in srgb, #e0b84a 45%, #fff8e7) 100%
      );
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65);
    }

    [data-theme="light"] .market-trend-chip.is-gold-target .market-trend-chip-label {
      color: #8a6408;
    }

    [data-theme="light"] .market-trend-chip.is-gold-target .market-trend-chip-value {
      color: #5c4200;
    }

    .market-trend-chip-label {
      color: var(--muted);
    }

    .market-trend-chip-value {
      color: var(--text);
      font-variant-numeric: tabular-nums;
    }

    .market-trend-chip-change {
      font-variant-numeric: tabular-nums;
      padding: 2px 6px;
      border-radius: 999px;
      font-size: 10px;
    }

    .market-trend-chip-change.is-up {
      color: #00c853;
      background: color-mix(in srgb, #00c853 14%, transparent);
    }

    .market-trend-chip-change.is-down {
      color: #ff4d6d;
      background: color-mix(in srgb, #ff4d6d 14%, transparent);
    }

    .market-trend-chip-change.is-flat {
      color: var(--muted-2);
      background: var(--surface-2);
    }

    /* Keep target % vivid on the gold chip background */
    .market-trend-chip.is-gold-target .market-trend-chip-change.is-up {
      color: #00e5a0;
      background: color-mix(in srgb, #00e5a0 22%, #1a1520);
    }

    .market-trend-chip.is-gold-target .market-trend-chip-change.is-down {
      color: #ff4d6d;
      background: color-mix(in srgb, #ff4d6d 22%, #1a1520);
    }

    .market-trend-chip.is-gold-target .market-trend-chip-change.is-flat {
      color: #c4b58a;
      background: color-mix(in srgb, #000 18%, transparent);
    }

    [data-theme="light"] .market-trend-chip.is-gold-target .market-trend-chip-change.is-up {
      color: #047857;
      background: color-mix(in srgb, #10b981 22%, #fff);
    }

    [data-theme="light"] .market-trend-chip.is-gold-target .market-trend-chip-change.is-down {
      color: #b91c1c;
      background: color-mix(in srgb, #ef4444 20%, #fff);
    }

    [data-theme="light"] .market-trend-chip.is-gold-target .market-trend-chip-change.is-flat {
      color: #78716c;
      background: color-mix(in srgb, #000 6%, #fff);
    }

    .market-alert-watch-group {
      display: grid;
      gap: 6px;
      margin-top: 8px;
    }

    .market-alert-watch-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 8px 10px;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: var(--surface-2);
      font-size: 13px;
      font-weight: 600;
      color: var(--text);
    }

    .market-invite-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      min-height: 46px;
      margin-top: 12px;
      border: none;
      border-radius: 12px;
      background: var(--accent);
      color: var(--accent-fg);
      font-family: inherit;
      font-size: 14px;
      font-weight: 800;
      cursor: pointer;
    }

    .market-invite-btn svg {
      width: 18px;
      height: 18px;
    }

    .market-invite-btn:active {
      transform: scale(0.98);
    }

    .estimate-share-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      width: 100%;
      margin-top: 10px;
      min-height: 40px;
      border: 1px solid var(--border);
      border-radius: 10px;
      background: var(--surface-2);
      color: var(--text);
      font-family: inherit;
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
    }

    .estimate-share-btn svg {
      width: 16px;
      height: 16px;
    }`;

export const androidStandaloneUiPatch = `
    const pricesPanelEl = document.getElementById("prices-panel");
    const currencyViewEl = document.getElementById("view-currency");
    const goldViewEl = document.getElementById("view-gold");
    const carsViewEl = document.getElementById("view-cars");
    const housingViewEl = document.getElementById("view-housing");
    const toolsViewEl = document.getElementById("view-tools");
    const moreViewEl = document.getElementById("view-more");
    const moreSettingsPanelEl = document.getElementById("moreSettingsPanel");
    const moreDonatePanelEl = document.getElementById("moreDonatePanel");
    const moreAboutPanelEl = document.getElementById("moreAboutPanel");
    const moreSubtabButtons = document.querySelectorAll("[data-more-subtab]");
    const softDonatePromptEl = document.getElementById("softDonatePrompt");
    const softDonateLaterBtnEl = document.getElementById("softDonateLaterBtn");
    const softDonateGoBtnEl = document.getElementById("softDonateGoBtn");
    const SOFT_DONATE_STORAGE_KEY = "market-prices-soft-donate";
    const currencyListEl = document.getElementById("currencyList");
    const goldListEl = document.getElementById("goldList");
    const goldCalcListEl = document.getElementById("goldCalcList");
    const goldPricesPanelEl = document.getElementById("goldPricesPanel");
    const goldCalcPanelEl = document.getElementById("goldCalcPanel");
    const goldSubtabButtons = document.querySelectorAll("[data-gold-subtab]");
    const carsPricesPanelEl = document.getElementById("carsPricesPanel");
    const carsEstimatePanelEl = document.getElementById("carsEstimatePanel");
    const carsEstimateDivarPanelEl = document.getElementById("carsEstimateDivarPanel");
    const carsEstimateSpecsPanelEl = document.getElementById("carsEstimateSpecsPanel");
    const carsEstimateModeButtons = document.querySelectorAll("[data-cars-estimate-mode]");
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
    const alertsMarketHoursOnlyEl = document.getElementById("alertsMarketHoursOnly");
    const alertWatchDollarEl = document.getElementById("alertWatchDollar");
    const alertWatchGeram18El = document.getElementById("alertWatchGeram18");
    const alertWatchSekeeEl = document.getElementById("alertWatchSekee");
    const inviteFriendBtnEl = document.getElementById("inviteFriendBtn");
    const pricesOfflineBannerEl = document.getElementById("pricesOfflineBanner");
    const carsOfflineBannerEl = document.getElementById("carsOfflineBanner");
    const marketTrendStripEl = document.getElementById("marketTrendStrip");
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
    const myCarEstimateResultSectionEl = document.getElementById("myCarEstimateResultSection");
    const housingSearchFormEl = document.getElementById("housingSearchForm");
    const housingSearchNicknameEl = document.getElementById("housingSearchNickname");
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
    const housingSaveSearchBtnEl = document.getElementById("housingSaveSearchBtn");
    const housingStatusEl = document.getElementById("housingStatus");
    const housingLoadingEl = document.getElementById("housingLoading");
    const housingResultsWrapEl = document.getElementById("housingResultsWrap");
    const housingListEl = document.getElementById("housingList");
    const housingLoadMoreBtnEl = document.getElementById("housingLoadMoreBtn");
    const housingDetailSheetEl = document.getElementById("housingDetailSheet");
    const housingDetailBackdropEl = document.getElementById("housingDetailBackdrop");
    const housingDetailContentEl = document.getElementById("housingDetailContent");
    const myHousingSearchesListEl = document.getElementById("myHousingSearchesList");
    const myHousingSearchesEmptyEl = document.getElementById("myHousingSearchesEmpty");
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
    let activeCarsEstimateMode = "divar";
    try {
      const savedCarsEstimateMode = localStorage.getItem("market-prices-cars-estimate-mode");
      if (savedCarsEstimateMode === "specs" || savedCarsEstimateMode === "divar") {
        activeCarsEstimateMode = savedCarsEstimateMode;
      }
    } catch (e) {}
    let activeMoreSubtab = "settings";
    try {
      const savedMoreSubtab = localStorage.getItem("market-prices-more-subtab");
      if (savedMoreSubtab === "donate" || savedMoreSubtab === "about" || savedMoreSubtab === "settings") {
        activeMoreSubtab = savedMoreSubtab;
      } else if (savedMoreSubtab === "tools") {
        activeMoreSubtab = "settings";
        try { localStorage.setItem("market-prices-more-subtab", "settings"); } catch (e2) {}
      }
    } catch (e) {}
    let carRows = [];
    let carsLoaded = false;
    let pricesLoaded = false;
    let latestMarketPrices = null;
    let previousPricesSnapshot = null;
    let toastHideTimer = null;
    let shareCardBusy = false;
    let estimateShareBusy = false;
    let lastDivarEstimateResult = null;
    let lastMyCarEstimateResult = null;
    let divarEstimateBusy = false;
    let housingDealKey = "buy";
    let housingBusy = false;
    let housingPaginationData = null;
    let housingHasNextPage = false;
    let housingListingsByToken = {};
    let housingDetailBusy = false;
    let housingLastQuery = null;
    let myCarEstimateBusy = false;
    let bamaVehiclesTree = null;
    let savedCars = [];
    let editingCarId = null;
    let selectedCarId = null;
    let savedHousingSearches = [];
    let selectedHousingSearchId = null;
    const SAVED_CARS_STORAGE_KEY = "market-prices-saved-cars";
    const HOUSING_PREFS_KEY = "market-prices-housing-search";
    const SAVED_HOUSING_SEARCHES_KEY = "market-prices-saved-housing-searches";

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
      lastDivarEstimateResult = null;
      if (divarEstimateResultEl) {
        divarEstimateResultEl.classList.add("hidden");
        divarEstimateResultEl.innerHTML = "";
      }
      setDivarEstimateStatus("", false);
    }

    function handleEstimateShareClick(result) {
      if (estimateShareBusy || !result) return;
      estimateShareBusy = true;
      Promise.resolve(shareEstimateResult(result))
        .then(function () {
          showPriceToast("تصویر تخمین آماده اشتراک شد");
        })
        .catch(function (error) {
          console.error("Estimate share error:", error);
          showPriceToast((error && error.message) || "اشتراک تخمین ممکن نشد");
        })
        .finally(function () {
          estimateShareBusy = false;
        });
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
            lastDivarEstimateResult = result;
            if (divarEstimateResultEl) {
              divarEstimateResultEl.innerHTML = renderDivarEstimateResult(result);
              divarEstimateResultEl.classList.remove("hidden");
            }
            setDivarEstimateStatus("", false);
            if (divarUrlInputEl) divarUrlInputEl.value = "";
            maybeShowSoftDonatePrompt("divar-estimate");
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
      lastMyCarEstimateResult = null;
      if (myCarEstimateResultEl) {
        myCarEstimateResultEl.innerHTML = "";
      }
      if (myCarEstimateResultSectionEl) {
        myCarEstimateResultSectionEl.classList.add("hidden");
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
      if (myCarFormModeHintEl) {
        if (editingCarId) {
          myCarFormModeHintEl.textContent = "در حال ویرایش خودرو ذخیره‌شده";
          myCarFormModeHintEl.classList.remove("hidden");
        } else {
          myCarFormModeHintEl.textContent = "";
          myCarFormModeHintEl.classList.add("hidden");
        }
      }
      if (myCarCancelEditBtnEl) myCarCancelEditBtnEl.classList.toggle("hidden", !editingCarId);
      if (myCarSaveBtnEl) myCarSaveBtnEl.textContent = editingCarId ? "بروزرسانی" : "ذخیره";
    }

    function bindCollapseToggle(buttonId, bodyId, storageKey, options) {
      const opts = options || {};
      const btn = document.getElementById(buttonId);
      const body = document.getElementById(bodyId);
      if (!btn || !body) return;
      const section = btn.closest(".is-collapsible");
      const labelEl = btn.querySelector("[data-collapse-label]");
      const openLabel = opts.openLabel || "باز کردن";
      const closeLabel = opts.closeLabel || "بستن";
      let expanded = true;
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved === "0") expanded = false;
        if (saved === "1") expanded = true;
      } catch (e) {}
      function apply() {
        btn.setAttribute("aria-expanded", expanded ? "true" : "false");
        body.classList.toggle("is-collapsed", !expanded);
        if (section) section.classList.toggle("is-collapsed", !expanded);
        if (labelEl) labelEl.textContent = expanded ? closeLabel : openLabel;
      }
      apply();
      btn.addEventListener("click", function () {
        expanded = !expanded;
        try {
          localStorage.setItem(storageKey, expanded ? "1" : "0");
        } catch (e) {}
        apply();
      });
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
            lastMyCarEstimateResult = result;
            if (myCarEstimateResultEl) {
              myCarEstimateResultEl.innerHTML = renderDivarEstimateResult(result);
            }
            if (myCarEstimateResultSectionEl) {
              myCarEstimateResultSectionEl.classList.remove("hidden");
            }
            setMyCarStatus("", false);
            maybeShowSoftDonatePrompt("my-car-estimate");
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
        '<p class="price-hero-share-hint">اشتراک تصویر قیمت‌ها با دوستان</p>' +
        '<button type="button" class="market-share-icon-btn" aria-label="اشتراک‌گذاری تصویر قیمت" title="اشتراک‌گذاری تصویر قیمت">' +
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
        '<path stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 8l-4-4-4 4M12 4v12"/>' +
        "</svg></button></div>"
      );
    }

    function buildRateSparkline(dt, seedKey, options) {
      const opts = options || {};
      const wide = opts.wide === true;
      const directionClass =
        dt === "high" ? "is-up" : dt === "low" ? "is-down" : "is-flat";
      const width = wide ? 300 : 58;
      const height = wide ? 46 : 30;
      const padX = wide ? 8 : 2;
      const padY = wide ? 8 : 5;
      let seed = 0;
      const key = String(seedKey || "x");
      for (let i = 0; i < key.length; i += 1) seed = (seed + key.charCodeAt(i) * (i + 3)) % 997;
      const count = wide ? 14 : 8;
      const mid = height * 0.58;
      const amp = wide ? 7 : 4.5;
      const ys = [];
      for (let i = 0; i < count; i += 1) {
        const t = i / (count - 1);
        const wave = Math.sin((seed % 7) + t * 3.4) * amp * 0.55;
        const wave2 = Math.cos((seed % 5) + t * 5.1) * amp * 0.25;
        let y = mid + wave + wave2;
        if (dt === "high") y -= (t - 0.15) * amp * 0.9;
        else if (dt === "low") y += (t - 0.15) * amp * 0.9;
        ys.push(Math.max(padY, Math.min(height - padY, y)));
      }

      const pts = ys.map(function (yy, i) {
        return {
          x: padX + (i * (width - padX * 2)) / (count - 1),
          y: yy,
        };
      });

      function smoothLine(points) {
        if (points.length < 2) return "";
        let d = "M" + points[0].x.toFixed(1) + " " + points[0].y.toFixed(1);
        for (let i = 0; i < points.length - 1; i += 1) {
          const p0 = points[Math.max(0, i - 1)];
          const p1 = points[i];
          const p2 = points[i + 1];
          const p3 = points[Math.min(points.length - 1, i + 2)];
          const cp1x = p1.x + (p2.x - p0.x) / 6;
          const cp1y = p1.y + (p2.y - p0.y) / 6;
          const cp2x = p2.x - (p3.x - p1.x) / 6;
          const cp2y = p2.y - (p3.y - p1.y) / 6;
          d +=
            " C" +
            cp1x.toFixed(1) +
            " " +
            cp1y.toFixed(1) +
            " " +
            cp2x.toFixed(1) +
            " " +
            cp2y.toFixed(1) +
            " " +
            p2.x.toFixed(1) +
            " " +
            p2.y.toFixed(1);
        }
        return d;
      }

      const linePath = smoothLine(pts);
      const last = pts[pts.length - 1];
      const gradId = "sparkFill_" + String(seedKey || "x").replace(/[^a-zA-Z0-9_-]/g, "") + (wide ? "_w" : "_s");
      const fillPath =
        linePath +
        " L" +
        last.x.toFixed(1) +
        " " +
        height +
        " L" +
        pts[0].x.toFixed(1) +
        " " +
        height +
        " Z";
      const cls = (wide ? "price-hero-spark " : "rate-card-spark ") + directionClass;
      const dotR = wide ? "3.2" : "2.2";
      return (
        '<svg class="' +
        cls +
        '" viewBox="0 0 ' +
        width +
        " " +
        height +
        '" preserveAspectRatio="none" aria-hidden="true">' +
        '<defs><linearGradient id="' +
        gradId +
        '" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="currentColor" stop-opacity="0.28"/>' +
        '<stop offset="100%" stop-color="currentColor" stop-opacity="0"/>' +
        "</linearGradient></defs>" +
        '<path class="rate-card-spark-fill" fill="url(#' +
        gradId +
        ')" d="' +
        fillPath +
        '"/>' +
        '<path class="rate-card-spark-line" d="' +
        linePath +
        '"/>' +
        '<circle class="rate-card-spark-dot" cx="' +
        last.x.toFixed(1) +
        '" cy="' +
        last.y.toFixed(1) +
        '" r="' +
        dotR +
        '"/>' +
        "</svg>"
      );
    }

    function createRateCard(item, data) {
      const isGlobal = item.global === true || item.key === "ons";
      const change = toDisplayValue(data.d, isGlobal);
      const changePercent = parseNumber(data.dp);
      const hasChange = !Number.isNaN(change) && change !== 0;
      let direction = "low";
      if (!Number.isNaN(changePercent) && changePercent !== 0) {
        direction = changePercent > 0 ? "high" : "low";
      } else if (data.dt === "high" || data.dt === "low") {
        direction = data.dt;
      } else if (hasChange) {
        direction = change > 0 ? "high" : "low";
      } else {
        direction = "flat";
      }
      const directionClass =
        direction === "high" ? "is-up" : direction === "low" ? "is-down" : "is-flat";
      const arrow = getChangeArrow(direction);
      const changeLabel =
        !Number.isNaN(changePercent) && changePercent !== 0
          ? arrow + " " + Math.abs(changePercent).toLocaleString("fa-IR") + "٪"
          : hasChange
            ? arrow + " " + formatPrice(Math.abs(change), isGlobal)
            : arrow + " ۰٪";
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
        buildRateSparkline(direction, item.key + String(data.p || "")) +
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
      return {
        enabled: false,
        threshold: DEFAULT_ALERT_THRESHOLD,
        marketHoursOnly: false,
        watch: {
          price_dollar_rl: true,
          geram18: true,
          sekee: false,
        },
      };
    }

    function getAlertSettings() {
      try {
        const raw = localStorage.getItem(PRICE_ALERTS_STORAGE_KEY);
        if (!raw) return getDefaultAlertSettings();
        const parsed = JSON.parse(raw);
        const threshold = Number(parsed.threshold);
        const defaults = getDefaultAlertSettings();
        const watch = Object.assign({}, defaults.watch, parsed.watch || {});
        return {
          enabled: parsed.enabled === true,
          threshold: Number.isFinite(threshold) && threshold > 0 ? threshold : DEFAULT_ALERT_THRESHOLD,
          marketHoursOnly: parsed.marketHoursOnly === true,
          watch: watch,
        };
      } catch {
        return getDefaultAlertSettings();
      }
    }

    function saveAlertSettings(settings) {
      localStorage.setItem(PRICE_ALERTS_STORAGE_KEY, JSON.stringify(settings));
    }

    function readAlertSettingsFromUi() {
      const current = getAlertSettings();
      const threshold = alertsThresholdEl ? Number(alertsThresholdEl.value) : current.threshold;
      return {
        enabled: alertsEnabledEl ? alertsEnabledEl.checked : current.enabled,
        threshold: Number.isFinite(threshold) && threshold > 0 ? threshold : DEFAULT_ALERT_THRESHOLD,
        marketHoursOnly: alertsMarketHoursOnlyEl ? alertsMarketHoursOnlyEl.checked : current.marketHoursOnly,
        watch: {
          price_dollar_rl: alertWatchDollarEl ? alertWatchDollarEl.checked : current.watch.price_dollar_rl,
          geram18: alertWatchGeram18El ? alertWatchGeram18El.checked : current.watch.geram18,
          sekee: alertWatchSekeeEl ? alertWatchSekeeEl.checked : current.watch.sekee,
        },
      };
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
      if (settings.marketHoursOnly && !isTehranMarketHours()) {
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
        const watchKey = item.settingsKey || item.key;
        if (settings.watch && settings.watch[watchKey] === false) return;
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

    function updateMarketTrendStrip(current) {
      if (!marketTrendStripEl || !current) return;

      function buildTrendChip(label, priceText, changePercent, direction, extraClass, changeTextOverride) {
        const directionClass =
          direction === "high" ? "is-up" : direction === "low" ? "is-down" : "is-flat";
        const arrow = getChangeArrow(direction);
        let changeText = changeTextOverride;
        if (changeText == null) {
          const pct = Number(changePercent);
          changeText =
            !Number.isNaN(pct) && pct !== 0
              ? arrow + " " + Math.abs(pct).toLocaleString("fa-IR", { maximumFractionDigits: 2 }) + "٪"
              : arrow + " ۰٪";
        }
        const chipClass =
          "market-trend-chip" + (extraClass ? " " + extraClass : "");
        return (
          '<span class="' +
          chipClass +
          '">' +
          '<span class="market-trend-chip-label">' +
          label +
          "</span>" +
          '<span class="market-trend-chip-value">' +
          priceText +
          "</span>" +
          '<span class="market-trend-chip-change ' +
          directionClass +
          '">' +
          changeText +
          "</span></span>"
        );
      }

      const chips = [];
      const dollarData = current.price_dollar_rl;
      if (dollarData) {
        const dollarDp = parseNumber(dollarData.dp);
        const dollarDir =
          !Number.isNaN(dollarDp) && dollarDp !== 0
            ? dollarDp > 0
              ? "high"
              : "low"
            : dollarData.dt === "high" || dollarData.dt === "low"
              ? dollarData.dt
              : "flat";
        chips.push(
          buildTrendChip(
            "دلار",
            formatPrice(dollarData.p, false),
            dollarDp,
            dollarDir,
          ),
        );
      }

      const goldData = current.geram18;
      if (goldData) {
        const goldDp = parseNumber(goldData.dp);
        const goldDir =
          !Number.isNaN(goldDp) && goldDp !== 0
            ? goldDp > 0
              ? "high"
              : "low"
            : goldData.dt === "high" || goldData.dt === "low"
              ? goldData.dt
              : "flat";
        chips.push(
          buildTrendChip(
            "طلا",
            formatPrice(goldData.p, false),
            goldDp,
            goldDir,
          ),
        );
      }

      const realGoldPrice =
        typeof calculateRealGoldPrice === "function" ? calculateRealGoldPrice(current) : NaN;
      if (!Number.isNaN(realGoldPrice)) {
        // Diff vs board gold in tomans: target − gold
        const marketGold = goldData ? toDisplayValue(goldData.p, false) : NaN;
        let targetDt = "flat";
        let diffText = getChangeArrow("flat") + " ۰";
        if (!Number.isNaN(marketGold)) {
          const diff = Math.round(realGoldPrice - marketGold);
          if (diff > 0) targetDt = "high";
          else if (diff < 0) targetDt = "low";
          const arrow = getChangeArrow(targetDt);
          diffText =
            diff === 0
              ? arrow + " ۰"
              : arrow + " " + Math.abs(diff).toLocaleString("fa-IR", { maximumFractionDigits: 0 });
        }
        chips.push(
          buildTrendChip(
            "ارزش ذاتی طلا",
            realGoldPrice.toLocaleString("fa-IR", { maximumFractionDigits: 0 }),
            0,
            targetDt,
            "is-gold-target",
            diffText,
          ),
        );
      }

      if (!chips.length) {
        marketTrendStripEl.classList.add("hidden");
        marketTrendStripEl.innerHTML = "";
        return;
      }
      marketTrendStripEl.innerHTML = chips.join("");
      marketTrendStripEl.classList.remove("hidden");
    }

    function copyInviteText(text, done, fail) {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        navigator.clipboard.writeText(text).then(done).catch(fail);
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

    function handleInviteFriendClick() {
      const inviteText =
        "سلام! اپ «تصمیم» رو نصب کن — قیمت لحظه‌ای دلار، طلا، خودرو و جستجوی ملک رو یک‌جا داری. برای تصمیم بهتر قبل از خرید عالیه.";
      copyInviteText(
        inviteText,
        function () {
          showPriceToast("متن دعوت کپی شد");
          if (typeof AndroidApp !== "undefined" && typeof AndroidApp["shareApk"] === "function") {
            AndroidApp["shareApk"]();
          }
        },
        function () {
          showPriceToast("کپی متن دعوت ممکن نشد");
        },
      );
    }

    function syncThemeToggleDisplay() {
      const theme = getMarketTheme();
      if (themeToggleValueEl) {
        themeToggleValueEl.textContent = theme === "light" ? "تم روشن" : "تم تاریک";
      }
    }

    const MARKET_ACCENT_KEY = "market-prices-accent";
    // Same accent color in light and dark themes (swatch == applied --accent).
    const ACCENT_PRESETS = [
      { id: "emerald", label: "زمردی", color: "#00e5a0", fg: "#111621", glow: "#06b6d4" },
      { id: "violet", label: "بنفش", color: "#a78bfa", fg: "#111621", glow: "#818cf8" },
      { id: "sky", label: "آبی", color: "#38bdf8", fg: "#111621", glow: "#22d3ee" },
      { id: "amber", label: "کهربایی", color: "#fbbf24", fg: "#111621", glow: "#f59e0b" },
      { id: "rose", label: "صورتی", color: "#fb7185", fg: "#111621", glow: "#f472b6" },
      { id: "cyan", label: "فیروزه‌ای", color: "#2dd4bf", fg: "#111621", glow: "#22d3ee" },
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
      const root = document.documentElement;
      root.style.setProperty("--accent", preset.color);
      root.style.setProperty("--accent-fg", preset.fg);
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
          preset.color +
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

    function initBankCardTool() {
      const IRAN_BANK_BY_BIN = ${IRAN_BANK_BY_BIN_JSON};
      const IRAN_BANK_UNKNOWN = ${IRAN_BANK_UNKNOWN_JSON};
      const IRAN_BANK_LOGO_DATA_URIS = ${IRAN_BANK_LOGO_DATA_URIS_JSON};
      const STORAGE_KEY = "market-prices-saved-bank-cards";

      const stackEl = document.getElementById("bankCardStack");
      const viewportEl = document.getElementById("bankCardStackViewport");
      const emptyEl = document.getElementById("bankCardEmpty");
      const dotsEl = document.getElementById("bankCardDots");
      const modalEl = document.getElementById("bankCardModal");
      const modalBackdropEl = document.getElementById("bankCardModalBackdrop");
      const modalCancelEl = document.getElementById("bankCardModalCancel");
      const modalSaveEl = document.getElementById("bankCardModalSave");
      const numberInputEl = document.getElementById("bankCardNumberInput");
      const holderInputEl = document.getElementById("bankCardHolderInput");
      const hintEl = document.getElementById("bankCardHint");
      if (!stackEl || !modalEl || !numberInputEl || !holderInputEl || !modalSaveEl) return;

      let cards = [];
      let activeIndex = 0;
      let bankCardShareBusy = false;
      let dragState = null;
      let bankCardAudioCtx = null;
      const logoImageCache = {};
      const defaultHint = "با وارد کردن شماره کارت، بانک به‌صورت خودکار تشخیص داده می‌شود.";

      function toLatinDigits(value) {
        return String(value || "")
          .replace(/[۰-۹]/g, function (ch) {
            return String("۰۱۲۳۴۵۶۷۸۹".indexOf(ch));
          })
          .replace(/[٠-٩]/g, function (ch) {
            return String("٠١٢٣٤٥٦٧٨٩".indexOf(ch));
          });
      }

      function digitsOnly(value) {
        return toLatinDigits(value).replace(/\\D/g, "");
      }

      function formatCardGroups(digits) {
        const clean = String(digits || "").slice(0, 16);
        return clean.replace(/(\\d{4})(?=\\d)/g, "$1 ").trim();
      }

      function formatCardPreview(digits) {
        const clean = String(digits || "").slice(0, 16);
        if (!clean) return "•••• •••• •••• ••••";
        let out = "";
        for (let i = 0; i < 16; i += 1) {
          out += i < clean.length ? clean.charAt(i) : "•";
          if (i % 4 === 3 && i < 15) out += " ";
        }
        return out;
      }

      function lookupBank(digits) {
        if (!digits || digits.length < 6) return null;
        return IRAN_BANK_BY_BIN[digits.slice(0, 6)] || null;
      }

      function getBankLogoDataUri(bank) {
        if (!bank || !bank.logo) return "";
        return IRAN_BANK_LOGO_DATA_URIS[bank.logo] || "";
      }

      function loadBankLogoImage(dataUri) {
        if (!dataUri) return Promise.resolve(null);
        if (logoImageCache[dataUri]) return Promise.resolve(logoImageCache[dataUri]);
        return new Promise(function (resolve) {
          const img = new Image();
          img.onload = function () {
            logoImageCache[dataUri] = img;
            resolve(img);
          };
          img.onerror = function () {
            resolve(null);
          };
          img.src = dataUri;
        });
      }

      function setHint(message, isError) {
        if (!hintEl) return;
        hintEl.textContent = message || defaultHint;
        hintEl.classList.toggle("is-error", !!isError);
      }

      function loadCards() {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (!raw) return [];
          const parsed = JSON.parse(raw);
          if (!Array.isArray(parsed)) return [];
          return parsed
            .map(function (item) {
              const number = digitsOnly(item && item.number);
              const holder = String((item && item.holder) || "").trim();
              if (number.length !== 16 || !holder) return null;
              return {
                id: String((item && item.id) || "card-" + Date.now() + "-" + Math.random().toString(16).slice(2)),
                number: number,
                holder: holder.slice(0, 64),
                createdAt: Number((item && item.createdAt) || Date.now()),
              };
            })
            .filter(Boolean);
        } catch (e) {
          return [];
        }
      }

      function saveCards() {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
        } catch (e) {}
      }

      function createCardId() {
        return "card-" + Date.now() + "-" + Math.random().toString(16).slice(2, 8);
      }

      function escapeHtml(value) {
        return String(value || "")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");
      }

      function buildCardFaceHtml(card) {
        const bank = lookupBank(card.number) || IRAN_BANK_UNKNOWN;
        const known = !!lookupBank(card.number);
        const logoUri = known ? getBankLogoDataUri(bank) : "";
        const logoHtml = logoUri
          ? '<img class="bank-card-logo-img" alt="' +
            escapeHtml(bank.name) +
            '" width="52" height="52" decoding="async" src="' +
            logoUri +
            '" />'
          : '<span class="bank-card-logo-mark">' + escapeHtml(bank.shortName) + "</span>";
        return (
          '<article class="bank-card-preview" style="--bank-c1:' +
          bank.c1 +
          ";--bank-c2:" +
          bank.c2 +
          '">' +
          '<div class="bank-card-slide-actions">' +
          '<button type="button" class="bank-card-icon-btn" data-bank-share="' +
          escapeHtml(card.id) +
          '" aria-label="اشتراک‌گذاری کارت" title="اشتراک‌گذاری">' +
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
          '<path stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7"/>' +
          '<path stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M12 3v12"/>' +
          '<path stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M8 7l4-4 4 4"/>' +
          "</svg></button>" +
          '<button type="button" class="bank-card-icon-btn is-danger" data-bank-delete="' +
          escapeHtml(card.id) +
          '" aria-label="حذف کارت" title="حذف">' +
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
          '<path stroke="currentColor" stroke-width="1.9" stroke-linecap="round" d="M5 7h14"/>' +
          '<path stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M10 11v6M14 11v6"/>' +
          '<path stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M9 7l1-2h4l1 2m-8 0v11a2 2 0 002 2h6a2 2 0 002-2V7"/>' +
          "</svg></button>" +
          "</div>" +
          '<div class="bank-card-top"><div class="bank-card-chip-wrap">' +
          '<div class="bank-card-chip" aria-hidden="true"><span></span><span></span><span></span><span></span></div>' +
          '<svg class="bank-card-contactless" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
          '<path d="M8.5 8.5c2.2 2.2 2.2 4.8 0 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
          '<path d="M11.5 6c3.5 3.5 3.5 8.5 0 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
          '<path d="M14.5 3.5c5 5 5 12 0 17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
          "</svg></div>" +
          '<div class="bank-card-brand">' +
          logoHtml +
          '<span class="bank-card-logo-name">' +
          escapeHtml(known ? bank.name : "بانک") +
          "</span></div></div>" +
          '<p class="bank-card-number" dir="ltr">' +
          formatCardPreview(card.number) +
          "</p>" +
          '<div class="bank-card-bottom"><div class="bank-card-meta">' +
          '<span class="bank-card-meta-label">دارنده کارت</span>' +
          '<strong class="bank-card-meta-value">' +
          escapeHtml(card.holder) +
          "</strong></div>" +
          '<div class="bank-card-meta bank-card-meta-end">' +
          '<span class="bank-card-meta-label">بانک</span>' +
          '<strong class="bank-card-meta-value">' +
          escapeHtml(known ? bank.name : "—") +
          "</strong></div></div></article>"
        );
      }

      function stackTransform(offset, dragX) {
        if (offset === 0) {
          const rot = (dragX || 0) / 22;
          const lift = Math.min(Math.abs(dragX || 0) / 18, 10);
          return (
            "translate3d(" +
            (dragX || 0) +
            "px, " +
            -lift +
            "px, 0) rotate(" +
            rot +
            "deg) scale(1)"
          );
        }
        const depth = Math.min(Math.abs(offset), 4);
        const dir = offset > 0 ? 1 : -1;
        const y = depth * 18;
        const x = dir * ((depth % 2 === 0 ? -1 : 1) * depth * 10);
        const scale = 1 - depth * 0.055;
        const rot = dir * ((depth % 2 === 0 ? -1 : 1) * (5 + depth * 1.8));
        return (
          "translate3d(" +
          x +
          "px, " +
          y +
          "px, " +
          -depth * 36 +
          "px) rotate(" +
          rot +
          "deg) scale(" +
          scale +
          ")"
        );
      }

      function circularOffset(index) {
        const n = cards.length;
        if (n <= 1) return 0;
        let diff = index - activeIndex;
        while (diff > Math.floor(n / 2)) diff -= n;
        while (diff < -Math.floor((n - 1) / 2)) diff += n;
        return diff;
      }

      function applyStackTransforms(dragX) {
        const slides = stackEl.querySelectorAll(".bank-card-slide");
        slides.forEach(function (slide) {
          const index = Number(slide.getAttribute("data-index") || 0);
          const offset = circularOffset(index);
          const isFront = offset === 0;
          slide.classList.toggle("is-front", isFront);
          slide.style.zIndex = String(40 - Math.abs(offset));
          slide.style.opacity =
            Math.abs(offset) > 3 ? "0" : String(1 - Math.min(Math.abs(offset), 3) * 0.08);
          slide.style.filter =
            offset === 0 ? "none" : "brightness(" + (1 - Math.min(Math.abs(offset), 3) * 0.06) + ")";
          slide.style.transform = stackTransform(offset, isFront ? dragX || 0 : 0);
          slide.style.pointerEvents = isFront ? "auto" : "none";
        });
      }

      function renderDots() {
        if (!dotsEl) return;
        if (cards.length <= 1) {
          dotsEl.classList.add("hidden");
          dotsEl.innerHTML = "";
          return;
        }
        dotsEl.classList.remove("hidden");
        dotsEl.innerHTML = cards
          .map(function (_card, index) {
            return (
              '<button type="button" class="bank-card-dot' +
              (index === activeIndex ? " is-active" : "") +
              '" data-bank-dot="' +
              index +
              '" aria-label="کارت ' +
              (index + 1) +
              '"></button>'
            );
          })
          .join("");
      }

      function renderStack() {
        if (activeIndex >= cards.length) activeIndex = Math.max(0, cards.length - 1);
        const hasCards = cards.length > 0;
        if (emptyEl) emptyEl.classList.toggle("hidden", hasCards);
        if (viewportEl) viewportEl.classList.toggle("hidden", !hasCards);

        if (!hasCards) {
          stackEl.innerHTML = "";
          renderDots();
          return;
        }

        stackEl.innerHTML = cards
          .map(function (card, index) {
            return (
              '<div class="bank-card-slide" data-index="' +
              index +
              '" data-card-id="' +
              escapeHtml(card.id) +
              '">' +
              buildCardFaceHtml(card) +
              "</div>"
            );
          })
          .join("");
        renderDots();
        applyStackTransforms(0);
      }

      function getBankCardAudioCtx() {
        try {
          if (!bankCardAudioCtx) {
            const Ctx = window.AudioContext || window.webkitAudioContext;
            if (!Ctx) return null;
            bankCardAudioCtx = new Ctx();
          }
          if (bankCardAudioCtx.state === "suspended") {
            bankCardAudioCtx.resume().catch(function () {});
          }
          return bankCardAudioCtx;
        } catch (e) {
          return null;
        }
      }

      function playCardFlipSound(direction) {
        const ctx = getBankCardAudioCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        const dur = 0.2;
        const sampleRate = ctx.sampleRate;
        const length = Math.max(1, Math.floor(sampleRate * dur));
        const buffer = ctx.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < length; i += 1) {
          const p = i / length;
          const env = Math.pow(1 - p, 1.55);
          const flutter = 0.55 + 0.45 * Math.sin(i * 0.07);
          data[i] = (Math.random() * 2 - 1) * env * flutter;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        const startFreq = direction >= 0 ? 1550 : 1150;
        const endFreq = direction >= 0 ? 520 : 780;
        filter.frequency.setValueAtTime(startFreq, now);
        filter.frequency.exponentialRampToValueAtTime(Math.max(120, endFreq), now + dur);
        filter.Q.value = 0.85;

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.0001, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.32, now + 0.01);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

        // soft edge tap — like a plastic card catching
        const tap = ctx.createOscillator();
        tap.type = "triangle";
        tap.frequency.setValueAtTime(direction >= 0 ? 210 : 170, now);
        tap.frequency.exponentialRampToValueAtTime(55, now + 0.045);
        const tapGain = ctx.createGain();
        tapGain.gain.setValueAtTime(0.0001, now);
        tapGain.gain.exponentialRampToValueAtTime(0.1, now + 0.004);
        tapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        tap.connect(tapGain);
        tapGain.connect(ctx.destination);

        noise.start(now);
        noise.stop(now + dur + 0.02);
        tap.start(now);
        tap.stop(now + 0.07);
      }

      function goToIndex(nextIndex, directionHint) {
        if (!cards.length) return;
        const n = cards.length;
        const prev = activeIndex;
        activeIndex = ((nextIndex % n) + n) % n;
        if (activeIndex !== prev) {
          const dir =
            typeof directionHint === "number"
              ? directionHint
              : activeIndex - prev;
          playCardFlipSound(dir);
        }
        applyStackTransforms(0);
        renderDots();
      }

      function openModal() {
        modalEl.classList.remove("hidden");
        modalEl.setAttribute("aria-hidden", "false");
        numberInputEl.value = "";
        holderInputEl.value = "";
        setHint(defaultHint);
        setTimeout(function () {
          numberInputEl.focus();
        }, 40);
      }

      window["__openBankCardModal"] = openModal;

      function closeModal() {
        modalEl.classList.add("hidden");
        modalEl.setAttribute("aria-hidden", "true");
      }

      function syncModalPreviewHint() {
        const digits = digitsOnly(numberInputEl.value);
        numberInputEl.value = formatCardGroups(digits);
        const bank = lookupBank(digits);
        if (digits.length >= 6 && !bank) {
          setHint("این پیش‌شماره در فهرست بانک‌ها نیست؛ کارت با ظاهر عمومی ذخیره می‌شود.", true);
        } else if (digits.length > 0 && digits.length < 6) {
          setHint("حداقل ۶ رقم اول شماره کارت را وارد کنید تا بانک تشخیص داده شود.");
        } else if (digits.length === 16 && bank) {
          setHint("بانک تشخیص داده شد: " + bank.name);
        } else {
          setHint(defaultHint);
        }
      }

      function saveNewCard() {
        const digits = digitsOnly(numberInputEl.value);
        const holder = holderInputEl.value.trim();
        if (digits.length !== 16) {
          setHint("شماره کارت باید ۱۶ رقم باشد.", true);
          numberInputEl.focus();
          return;
        }
        if (!holder) {
          setHint("نام و نام خانوادگی را وارد کنید.", true);
          holderInputEl.focus();
          return;
        }
        const duplicate = cards.some(function (item) {
          return item.number === digits;
        });
        if (duplicate) {
          setHint("این شماره کارت قبلاً ذخیره شده است.", true);
          return;
        }
        cards.unshift({
          id: createCardId(),
          number: digits,
          holder: holder,
          createdAt: Date.now(),
        });
        activeIndex = 0;
        saveCards();
        closeModal();
        renderStack();
        showPriceToast("کارت ذخیره شد");
      }

      function deleteCard(cardId) {
        const index = cards.findIndex(function (item) {
          return item.id === cardId;
        });
        if (index < 0) return;
        cards.splice(index, 1);
        if (activeIndex >= cards.length) activeIndex = Math.max(0, cards.length - 1);
        saveCards();
        renderStack();
        showPriceToast("کارت حذف شد");
      }

      function roundRect(ctx, x, y, w, h, r) {
        const radius = Math.min(r, w / 2, h / 2);
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + w, y, x + w, y + h, radius);
        ctx.arcTo(x + w, y + h, x, y + h, radius);
        ctx.arcTo(x, y + h, x, y, radius);
        ctx.arcTo(x, y, x + w, y, radius);
        ctx.closePath();
      }

      async function buildBankCardShareCanvas(digits, holder, bank) {
        try {
          await document.fonts.ready;
        } catch (e) {}

        const width = 1080;
        const height = 1480;
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("ساخت تصویر ممکن نشد");

        const isLight = document.documentElement.getAttribute("data-theme") === "light";
        const accent =
          getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() ||
          (isLight ? "#0f766e" : "#00e5a0");

        const frameGrad = ctx.createLinearGradient(0, 0, width, height);
        if (isLight) {
          frameGrad.addColorStop(0, "#eef3f9");
          frameGrad.addColorStop(0.5, "#f8fafc");
          frameGrad.addColorStop(1, "#e8eef7");
        } else {
          frameGrad.addColorStop(0, "#0b1018");
          frameGrad.addColorStop(0.55, "#151c2a");
          frameGrad.addColorStop(1, "#0d1420");
        }
        ctx.fillStyle = frameGrad;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = accent;
        ctx.globalAlpha = 0.12;
        ctx.beginPath();
        ctx.arc(160, 180, 240, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(920, 1280, 280, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        roundRect(ctx, width / 2 - 96, 56, 192, 52, 26);
        ctx.fillStyle = accent;
        ctx.globalAlpha = 0.16;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = accent;
        ctx.globalAlpha = 0.4;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.fillStyle = accent;
        ctx.textAlign = "center";
        ctx.direction = "rtl";
        ctx.font = '800 30px "Vazir-FD", Vazir, Tahoma, sans-serif';
        ctx.fillText("تصمیم", width / 2, 91);

        ctx.fillStyle = isLight ? "#0f172a" : "#ffffff";
        ctx.font = '800 44px "Vazir-FD", Vazir, Tahoma, sans-serif';
        ctx.fillText("کارت بانکی من", width / 2, 170);
        ctx.fillStyle = isLight ? "#64748b" : "#8b95a8";
        ctx.font = '600 24px "Vazir-FD", Vazir, Tahoma, sans-serif';
        ctx.fillText(bank.name, width / 2, 214);

        const cardW = 920;
        const cardH = Math.round(cardW / 1.586);
        const cardX = (width - cardW) / 2;
        const cardY = 270;

        ctx.fillStyle = "rgba(0,0,0,0.28)";
        roundRect(ctx, cardX + 10, cardY + 22, cardW, cardH, 42);
        ctx.fill();

        const cardGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
        cardGrad.addColorStop(0, bank.c1);
        cardGrad.addColorStop(0.55, bank.c2);
        cardGrad.addColorStop(1, bank.c1);
        roundRect(ctx, cardX, cardY, cardW, cardH, 42);
        ctx.fillStyle = cardGrad;
        ctx.fill();

        const gloss1 = ctx.createRadialGradient(cardX + 140, cardY + 90, 20, cardX + 140, cardY + 90, 320);
        gloss1.addColorStop(0, "rgba(255,255,255,0.28)");
        gloss1.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = gloss1;
        ctx.fillRect(cardX, cardY, cardW, cardH);

        const gloss2 = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
        gloss2.addColorStop(0, "rgba(255,255,255,0.14)");
        gloss2.addColorStop(0.35, "rgba(255,255,255,0)");
        gloss2.addColorStop(0.55, "rgba(255,255,255,0.08)");
        gloss2.addColorStop(1, "rgba(0,0,0,0.18)");
        ctx.fillStyle = gloss2;
        ctx.fillRect(cardX, cardY, cardW, cardH);

        const chipX = cardX + 72;
        const chipY = cardY + 72;
        const chipGrad = ctx.createLinearGradient(chipX, chipY, chipX + 100, chipY + 76);
        chipGrad.addColorStop(0, "#f7e7b5");
        chipGrad.addColorStop(0.45, "#c9a24d");
        chipGrad.addColorStop(1, "#f0d9a0");
        roundRect(ctx, chipX, chipY, 100, 76, 14);
        ctx.fillStyle = chipGrad;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.35)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.strokeStyle = "rgba(138,106,42,0.35)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(chipX + 50, chipY + 8);
        ctx.lineTo(chipX + 50, chipY + 68);
        ctx.moveTo(chipX + 10, chipY + 38);
        ctx.lineTo(chipX + 90, chipY + 38);
        ctx.stroke();

        ctx.strokeStyle = "rgba(255,255,255,0.85)";
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        [
          [28, 0.85],
          [44, 0.55],
          [60, 0.35],
        ].forEach(function (pair) {
          const r = pair[0];
          ctx.globalAlpha = pair[1];
          ctx.beginPath();
          ctx.arc(chipX + 148, chipY + 38, r, -Math.PI * 0.55, Math.PI * 0.55);
          ctx.stroke();
        });
        ctx.globalAlpha = 1;

        const logoImg = await loadBankLogoImage(getBankLogoDataUri(bank));
        if (logoImg) {
          const logoSize = 118;
          const logoX = cardX + cardW - 80 - logoSize;
          const logoY = cardY + 64;
          roundRect(ctx, logoX - 12, logoY - 12, logoSize + 24, logoSize + 24, 28);
          ctx.fillStyle = "#ffffff";
          ctx.fill();
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
        } else {
          roundRect(ctx, cardX + cardW - 250, cardY + 78, 170, 52, 26);
          ctx.fillStyle = "rgba(255,255,255,0.16)";
          ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.font = '800 26px "Vazir-FD", Vazir, Tahoma, sans-serif';
          ctx.textAlign = "center";
          ctx.fillText(bank.shortName, cardX + cardW - 165, cardY + 112);
        }

        ctx.font = "700 58px ui-monospace, Menlo, Consolas, monospace";
        ctx.textAlign = "center";
        ctx.direction = "ltr";
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "rgba(0,0,0,0.35)";
        ctx.shadowBlur = 10;
        ctx.fillText(formatCardPreview(digits), width / 2, cardY + cardH * 0.58);
        ctx.shadowBlur = 0;

        ctx.strokeStyle = "rgba(255,255,255,0.18)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cardX + 72, cardY + cardH - 150);
        ctx.lineTo(cardX + cardW - 72, cardY + cardH - 150);
        ctx.stroke();

        ctx.direction = "rtl";
        ctx.textAlign = "right";
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.font = '600 22px "Vazir-FD", Vazir, Tahoma, sans-serif';
        ctx.fillText("دارنده کارت", cardX + cardW - 72, cardY + cardH - 108);
        ctx.fillStyle = "#ffffff";
        ctx.font = '800 36px "Vazir-FD", Vazir, Tahoma, sans-serif';
        ctx.fillText(holder || "نام و نام خانوادگی", cardX + cardW - 72, cardY + cardH - 58);

        ctx.textAlign = "left";
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.font = '600 22px "Vazir-FD", Vazir, Tahoma, sans-serif';
        ctx.fillText("بانک", cardX + 72, cardY + cardH - 108);
        ctx.fillStyle = "#ffffff";
        ctx.font = '800 32px "Vazir-FD", Vazir, Tahoma, sans-serif';
        ctx.fillText(bank.name, cardX + 72, cardY + cardH - 58);

        ctx.fillStyle = isLight ? "#64748b" : "#8b95a8";
        ctx.textAlign = "center";
        ctx.direction = "rtl";
        ctx.font = '500 26px "Vazir-FD", Vazir, Tahoma, sans-serif';
        ctx.fillText("ساخته‌شده با تصمیم", width / 2, height - 90);
        ctx.fillStyle = accent;
        ctx.font = '800 30px "Vazir-FD", Vazir, Tahoma, sans-serif';
        ctx.fillText("تصمیم", width / 2, height - 48);

        return canvas;
      }

      async function shareBankCardImage(card) {
        if (bankCardShareBusy || !card) return;
        const digits = card.number;
        const holder = card.holder;
        const bank = lookupBank(digits) || IRAN_BANK_UNKNOWN;
        bankCardShareBusy = true;
        try {
          const canvas = await buildBankCardShareCanvas(digits, holder, bank);
          const dataUrl = canvas.toDataURL("image/png");
          const base64 = dataUrl.replace(/^data:image\\/png;base64,/, "");
          const fileName = "bank-card-" + Date.now() + ".png";
          const shareCaption = "اپلیکیشن تصمیم | " + formatCardGroups(digits);
          if (typeof AndroidApp !== "undefined" && typeof AndroidApp["shareImage"] === "function") {
            AndroidApp["shareImage"](base64, fileName, shareCaption);
            showPriceToast("تصویر کارت آماده اشتراک شد");
            return;
          }
          const blob = await new Promise(function (resolve, reject) {
            canvas.toBlob(function (result) {
              if (result) resolve(result);
              else reject(new Error("ساخت فایل تصویر ممکن نشد"));
            }, "image/png");
          });
          const file = new File([blob], fileName, { type: "image/png" });
          if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: shareCaption,
              text: shareCaption,
            });
            showPriceToast("تصویر کارت آماده اشتراک شد");
            return;
          }
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          link.remove();
          showPriceToast("تصویر کارت دانلود شد");
        } catch (error) {
          showPriceToast((error && error.message) || "اشتراک‌گذاری کارت ممکن نشد");
        } finally {
          bankCardShareBusy = false;
        }
      }

      function onPointerDown(event) {
        if (!cards.length) return;
        if (event.target.closest && event.target.closest(".bank-card-icon-btn")) return;
        getBankCardAudioCtx();
        const front = stackEl.querySelector(".bank-card-slide.is-front");
        if (!front) return;
        dragState = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          dx: 0,
          dragging: false,
          front: front,
        };
        try {
          front.setPointerCapture(event.pointerId);
        } catch (e) {}
      }

      function onPointerMove(event) {
        if (!dragState || event.pointerId !== dragState.pointerId) return;
        const dx = event.clientX - dragState.startX;
        const dy = event.clientY - dragState.startY;
        if (!dragState.dragging) {
          if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
          if (Math.abs(dy) > Math.abs(dx)) {
            dragState = null;
            return;
          }
          dragState.dragging = true;
          dragState.front.classList.add("is-dragging");
        }
        event.preventDefault();
        dragState.dx = dx;
        applyStackTransforms(dx);
      }

      function onPointerUp(event) {
        if (!dragState || event.pointerId !== dragState.pointerId) return;
        const dx = dragState.dx;
        const front = dragState.front;
        front.classList.remove("is-dragging");
        dragState = null;
        const threshold = Math.min(110, (viewportEl ? viewportEl.clientWidth : 280) * 0.22);
        if (cards.length > 1 && dx <= -threshold) {
          goToIndex(activeIndex + 1, 1);
        } else if (cards.length > 1 && dx >= threshold) {
          goToIndex(activeIndex - 1, -1);
        } else {
          applyStackTransforms(0);
        }
      }

      stackEl.addEventListener("pointerdown", onPointerDown);
      stackEl.addEventListener("pointermove", onPointerMove);
      stackEl.addEventListener("pointerup", onPointerUp);
      stackEl.addEventListener("pointercancel", onPointerUp);

      stackEl.addEventListener("click", function (event) {
        const shareBtn = event.target.closest && event.target.closest("[data-bank-share]");
        if (shareBtn) {
          const id = shareBtn.getAttribute("data-bank-share");
          const card = cards.find(function (item) {
            return item.id === id;
          });
          Promise.resolve(shareBankCardImage(card)).catch(function () {});
          return;
        }
        const deleteBtn = event.target.closest && event.target.closest("[data-bank-delete]");
        if (deleteBtn) {
          const id = deleteBtn.getAttribute("data-bank-delete");
          if (window.confirm("این کارت حذف شود؟")) deleteCard(id);
        }
      });

      if (dotsEl) {
        dotsEl.addEventListener("click", function (event) {
          const btn = event.target.closest && event.target.closest("[data-bank-dot]");
          if (!btn) return;
          goToIndex(Number(btn.getAttribute("data-bank-dot") || 0));
        });
      }

      if (modalBackdropEl) modalBackdropEl.addEventListener("click", closeModal);
      if (modalCancelEl) modalCancelEl.addEventListener("click", closeModal);
      modalSaveEl.addEventListener("click", saveNewCard);
      numberInputEl.addEventListener("input", syncModalPreviewHint);
      holderInputEl.addEventListener("input", syncModalPreviewHint);

      cards = loadCards();
      activeIndex = 0;
      renderStack();
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
      if (alertsMarketHoursOnlyEl) alertsMarketHoursOnlyEl.checked = alertSettings.marketHoursOnly;
      if (alertWatchDollarEl) alertWatchDollarEl.checked = alertSettings.watch.price_dollar_rl !== false;
      if (alertWatchGeram18El) alertWatchGeram18El.checked = alertSettings.watch.geram18 !== false;
      if (alertWatchSekeeEl) alertWatchSekeeEl.checked = alertSettings.watch.sekee === true;
      syncThemeToggleDisplay();
      renderAccentPicker();
      applyAccentTheme(getSavedAccentId());
      initDonateSupport();
      initBankCardTool();
      function persistAlertsFromUi() {
        saveAlertSettings(readAlertSettingsFromUi());
      }
      if (alertsEnabledEl) {
        alertsEnabledEl.addEventListener("change", persistAlertsFromUi);
      }
      if (alertsThresholdEl) {
        alertsThresholdEl.addEventListener("change", persistAlertsFromUi);
      }
      if (alertsMarketHoursOnlyEl) {
        alertsMarketHoursOnlyEl.addEventListener("change", persistAlertsFromUi);
      }
      if (alertWatchDollarEl) {
        alertWatchDollarEl.addEventListener("change", persistAlertsFromUi);
      }
      if (alertWatchGeram18El) {
        alertWatchGeram18El.addEventListener("change", persistAlertsFromUi);
      }
      if (alertWatchSekeeEl) {
        alertWatchSekeeEl.addEventListener("change", persistAlertsFromUi);
      }
      if (inviteFriendBtnEl) {
        inviteFriendBtnEl.addEventListener("click", handleInviteFriendClick);
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
      if (activeMarketTab === "tools") return;
      if (navRefreshIcon) navRefreshIcon.classList.toggle("spin", busy);
      if (navRefreshBtn) navRefreshBtn.disabled = busy;
    }

    const NAV_REFRESH_ICON_PATH =
      'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15';
    const NAV_ADD_CARD_ICON_PATH = "M12 5v14M5 12h14";

    function syncNavCenterFab(tab) {
      if (!navRefreshBtn || !navRefreshIcon) return;
      const isTools = tab === "tools";
      navRefreshIcon.classList.remove("spin");
      navRefreshBtn.disabled = false;
      if (isTools) {
        navRefreshBtn.setAttribute("aria-label", "افزودن کارت جدید");
        navRefreshBtn.title = "کارت جدید";
        navRefreshIcon.innerHTML =
          '<path stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="' +
          NAV_ADD_CARD_ICON_PATH +
          '"/>';
      } else {
        navRefreshBtn.setAttribute("aria-label", "بروزرسانی قیمت‌ها");
        navRefreshBtn.title = "بروزرسانی";
        navRefreshIcon.innerHTML =
          '<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="' +
          NAV_REFRESH_ICON_PATH +
          '"/>';
      }
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
      syncCarsEstimateModeUi();
    }

    function syncCarsEstimateModeUi() {
      carsEstimateModeButtons.forEach(function (button) {
        const active = button.dataset.carsEstimateMode === activeCarsEstimateMode;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-selected", active ? "true" : "false");
      });
      if (carsEstimateDivarPanelEl) {
        carsEstimateDivarPanelEl.classList.toggle("hidden", activeCarsEstimateMode !== "divar");
      }
      if (carsEstimateSpecsPanelEl) {
        carsEstimateSpecsPanelEl.classList.toggle("hidden", activeCarsEstimateMode !== "specs");
      }
    }

    function setCarsEstimateMode(mode) {
      const next = mode === "specs" ? "specs" : "divar";
      if (next === activeCarsEstimateMode) {
        syncCarsEstimateModeUi();
        return;
      }
      activeCarsEstimateMode = next;
      try {
        localStorage.setItem("market-prices-cars-estimate-mode", activeCarsEstimateMode);
      } catch (e) {}
      syncCarsEstimateModeUi();
      if (activeMarketTab === "cars" && activeCarsSubtab === "estimate" && activeCarsEstimateMode === "specs") {
        ensureMyCarCatalog().catch(function () {});
      }
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
      if (
        activeMarketTab === "cars" &&
        activeCarsSubtab === "estimate" &&
        activeCarsEstimateMode === "specs"
      ) {
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
        subtab === "donate"
          ? "donate"
          : subtab === "about"
            ? "about"
            : "settings";
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

    function loadSoftDonateState() {
      try {
        const raw = localStorage.getItem(SOFT_DONATE_STORAGE_KEY);
        if (!raw) return { lastShownAt: 0, dismissedAt: 0, successCount: 0 };
        const parsed = JSON.parse(raw);
        return {
          lastShownAt: Number(parsed.lastShownAt) || 0,
          dismissedAt: Number(parsed.dismissedAt) || 0,
          successCount: Number(parsed.successCount) || 0,
        };
      } catch (e) {
        return { lastShownAt: 0, dismissedAt: 0, successCount: 0 };
      }
    }

    function saveSoftDonateState(state) {
      try {
        localStorage.setItem(SOFT_DONATE_STORAGE_KEY, JSON.stringify(state));
      } catch (e) {}
    }

    function hideSoftDonatePrompt() {
      if (softDonatePromptEl) softDonatePromptEl.classList.add("hidden");
    }

    function maybeShowSoftDonatePrompt(reason) {
      const state = loadSoftDonateState();
      state.successCount = (state.successCount || 0) + 1;
      saveSoftDonateState(state);
      const now = Date.now();
      const weekMs = 7 * 24 * 60 * 60 * 1000;
      if (state.successCount < 2) return;
      if (state.lastShownAt && now - state.lastShownAt < weekMs) return;
      if (state.dismissedAt && now - state.dismissedAt < weekMs) return;
      if (!softDonatePromptEl) return;
      softDonatePromptEl.classList.remove("hidden");
      state.lastShownAt = now;
      saveSoftDonateState(state);
    }

    function openDonateFromSoftPrompt() {
      hideSoftDonatePrompt();
      switchMarketTab("more");
      setMoreSubtab("donate");
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
      const isGlobal = item.global === true || item.key === "ons";
      const change = toDisplayValue(data.d, isGlobal);
      const changePercent = parseNumber(data.dp);
      const hasChange = !Number.isNaN(change) && change !== 0;
      let direction = "flat";
      if (!Number.isNaN(changePercent) && changePercent !== 0) {
        direction = changePercent > 0 ? "high" : "low";
      } else if (data.dt === "high" || data.dt === "low") {
        direction = data.dt;
      } else if (hasChange) {
        direction = change > 0 ? "high" : "low";
      }
      const directionClass =
        direction === "high" ? "is-up" : direction === "low" ? "is-down" : "is-flat";
      const themeClass =
        item.key === "price_dollar_rl" || item.key === CURRENCY_HERO_KEY
          ? " price-hero-card--dollar"
          : item.key === "geram18" || item.key === GOLD_HERO_KEY
            ? " price-hero-card--gold"
            : "";
      const changeLabel =
        !Number.isNaN(changePercent) && changePercent !== 0
          ? Math.abs(changePercent).toLocaleString("fa-IR") + "٪"
          : hasChange
            ? formatPrice(Math.abs(change), isGlobal)
            : "۰";

      const el = document.createElement("div");
      el.className = "price-hero-card" + themeClass;

      const body = document.createElement("div");
      body.className = "price-hero-card-body";

      const top = document.createElement("div");
      top.className = "price-hero-card-top";

      const titleWrap = document.createElement("div");
      titleWrap.className = "price-hero-card-title-wrap";

      const icon = document.createElement("span");
      icon.className = "price-hero-card-icon";
      icon.textContent = item.icon;

      const meta = document.createElement("div");
      const kicker = document.createElement("p");
      kicker.className = "price-hero-card-kicker";
      kicker.textContent = "قیمت لحظه‌ای";
      const title = document.createElement("h3");
      title.className = "price-hero-card-title";
      title.textContent = item.title;
      const subtitle = document.createElement("p");
      subtitle.className = "price-hero-card-subtitle";
      subtitle.textContent = item.unit;
      meta.appendChild(kicker);
      meta.appendChild(title);
      meta.appendChild(subtitle);

      titleWrap.appendChild(icon);
      titleWrap.appendChild(meta);

      const time = document.createElement("span");
      time.className = "price-hero-card-time";
      time.textContent = data.t || "";

      top.appendChild(titleWrap);
      top.appendChild(time);

      const valueRow = document.createElement("div");
      valueRow.className = "price-hero-card-value-row";

      const value = document.createElement("span");
      value.className = "price-hero-card-value";
      value.textContent = formatPrice(data.p, isGlobal);

      const changeEl = document.createElement("span");
      changeEl.className = "price-hero-card-change " + directionClass;
      changeEl.textContent = getChangeArrow(direction) + " " + changeLabel;

      valueRow.appendChild(value);
      valueRow.appendChild(changeEl);

      const chartWrap = document.createElement("div");
      chartWrap.className = "price-hero-chart-wrap";
      chartWrap.innerHTML = buildRateSparkline(direction, item.key + String(data.p || ""), {
        wide: true,
        showMarker: true,
      });

      body.appendChild(top);
      body.appendChild(valueRow);
      body.appendChild(chartWrap);
      body.insertAdjacentHTML("beforeend", buildHeroShareActionHtml());
      el.appendChild(body);
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
      updateMarketTrendStrip(current);
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
      updateMarketTrendStrip(current);
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
        carsListEl.innerHTML = '<p class="cars-empty-friendly">خودرویی با این جستجو پیدا نشد.<span>نام برند یا مدل را کوتاه‌تر بنویس، یا فیلتر را پاک کن.</span></p>';
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
        if (typeof cacheCarPrices === "function") cacheCarPrices(rows);
        if (typeof hideCarsOfflineBanner === "function") hideCarsOfflineBanner();
      } catch (error) {
        console.error("Bama car prices fetch error:", error);
        if (silent) return;
        if (typeof loadCachedCarPrices === "function") {
          const cached = loadCachedCarPrices();
          if (cached && cached.rows) {
            renderCarRows(cached.rows);
            carsLoaded = true;
            if (typeof showCarsOfflineBanner === "function") showCarsOfflineBanner(cached.fetchedAt);
            return;
          }
        }
        showCarsError("خودرو صفر · خطا در دریافت قیمت خودرو. اتصال اینترنت را بررسی کنید.");
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

    function rememberHousingListings(listings) {
      (listings || []).forEach(function (listing) {
        if (listing && listing.token) {
          housingListingsByToken[listing.token] = listing;
        }
      });
    }

    function closeHousingDetailSheet() {
      if (!housingDetailSheetEl) return;
      housingDetailSheetEl.classList.add("hidden");
      housingDetailSheetEl.setAttribute("aria-hidden", "true");
      if (housingDetailContentEl) housingDetailContentEl.innerHTML = "";
    }

    function showHousingDetailLoading() {
      if (!housingDetailContentEl) return;
      housingDetailContentEl.innerHTML =
        '<div class="housing-detail-loading"><span>در حال دریافت جزئیات آگهی...</span></div>';
    }

    function renderHousingDetailContent(listing) {
      if (!housingDetailContentEl || !listing) return;
      housingDetailContentEl.innerHTML = renderHousingListingDetailHtml(listing);
      bindHousingGallery(housingDetailContentEl);
    }

    function openHousingDetailSheet(token) {
      if (!housingDetailSheetEl || !token || housingDetailBusy) return;
      const cached = housingListingsByToken[token];
      if (!cached) return;

      housingDetailSheetEl.classList.remove("hidden");
      housingDetailSheetEl.setAttribute("aria-hidden", "false");
      renderHousingDetailContent(cached);

      const cachedDesc = String(cached.description || "").trim();
      const needsFetch = !cached.enriched || !cachedDesc || cachedDesc === "توضیحات";
      if (!needsFetch || typeof getDivarHousingAdByToken !== "function") return;
      if (!needsFetch || typeof getDivarHousingAdByToken !== "function") return;

      housingDetailBusy = true;
      showHousingDetailLoading();
      Promise.resolve(getDivarHousingAdByToken(token))
        .then(function (detail) {
          const merged = Object.assign({}, cached, detail, {
            dealKey: cached.dealKey,
            thumbUrl: detail.images && detail.images[0] ? detail.images[0] : cached.thumbUrl,
            images: detail.images && detail.images.length ? detail.images : cached.images,
            priceText: cached.priceText || detail.totalPriceText || detail.rentText || "",
            creditText: cached.creditText || detail.creditText || "",
            enriched: true,
          });
          housingListingsByToken[token] = merged;
          renderHousingDetailContent(merged);
        })
        .catch(function (error) {
          console.warn("Housing detail fetch failed:", token, error);
          renderHousingDetailContent(cached);
          showPriceToast((error && error.message) || "دریافت جزئیات کامل آگهی ممکن نشد");
        })
        .finally(function () {
          housingDetailBusy = false;
        });
    }

    function renderHousingListings(listings, append) {
      if (!housingListEl) return;
      rememberHousingListings(listings);
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
        nickname: housingSearchNicknameEl ? housingSearchNicknameEl.value.trim() : "",
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

    function applyHousingQueryToForm(query) {
      if (!query) return;
      housingDealKey = query.dealKey === "rent" ? "rent" : "buy";
      if (housingSearchNicknameEl) housingSearchNicknameEl.value = query.nickname || "";
      if (housingCityEl && query.cityId) housingCityEl.value = query.cityId;
      if (housingBudgetMaxEl) {
        const parsed = parseHousingMoneyInput(query.budgetMax);
        housingBudgetMaxEl.value =
          query.budgetMax && parsed != null ? formatHousingMoneyInput(parsed) : query.budgetMax || "";
      }
      if (housingCreditMaxEl) {
        const parsed = parseHousingMoneyInput(query.creditMax);
        housingCreditMaxEl.value =
          query.creditMax && parsed != null ? formatHousingMoneyInput(parsed) : query.creditMax || "";
      }
      if (housingRentMaxEl) {
        const parsed = parseHousingMoneyInput(query.rentMax);
        housingRentMaxEl.value =
          query.rentMax != null && query.rentMax !== "" && parsed != null
            ? formatHousingMoneyInput(parsed)
            : query.rentMax || "";
      }
      if (housingSizeMinEl) {
        const parsed = parseHousingMoneyInput(query.sizeMin);
        housingSizeMinEl.value =
          query.sizeMin && parsed != null ? formatHousingMoneyInput(parsed) : query.sizeMin || "";
      }
      if (housingSizeMaxEl) {
        const parsed = parseHousingMoneyInput(query.sizeMax);
        housingSizeMaxEl.value =
          query.sizeMax && parsed != null ? formatHousingMoneyInput(parsed) : query.sizeMax || "";
      }
      if (housingRoomsEl && query.rooms != null) housingRoomsEl.value = query.rooms;
      syncHousingDealFields();
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

    function loadSavedHousingSearches() {
      try {
        const raw = localStorage.getItem(SAVED_HOUSING_SEARCHES_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }

    function persistSavedHousingSearches() {
      try {
        localStorage.setItem(SAVED_HOUSING_SEARCHES_KEY, JSON.stringify(savedHousingSearches));
      } catch (e) {}
    }

    function createHousingSearchId() {
      return "hs-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
    }

    function buildHousingSearchTitle(search) {
      if (search.nickname) return search.nickname;
      const city = getHousingCityById(search.cityId);
      const deal = getHousingDeal(city, search.dealKey);
      const dealLabel = deal ? deal.labelFa : search.dealKey === "rent" ? "رهن و اجاره" : "خرید";
      const cityLabel = city ? city.nameFa : "تهران";
      return dealLabel + " · " + cityLabel;
    }

    function buildHousingSearchMeta(search) {
      const parts = [];
      if (search.dealKey === "rent") {
        if (search.creditMax) parts.push("ودیعه تا " + search.creditMax);
        if (search.rentMax) parts.push("اجاره تا " + search.rentMax);
      } else if (search.budgetMax) {
        parts.push("بودجه تا " + search.budgetMax);
      }
      if (search.sizeMin || search.sizeMax) {
        parts.push(
          "متراژ " +
            (search.sizeMin || "—") +
            " تا " +
            (search.sizeMax || "—"),
        );
      }
      if (search.rooms) {
        const roomOpt =
          typeof HOUSING_ROOM_OPTIONS !== "undefined"
            ? HOUSING_ROOM_OPTIONS.find(function (opt) {
                return String(opt.value) === String(search.rooms);
              })
            : null;
        parts.push(roomOpt ? roomOpt.label : search.rooms + " خواب");
      }
      return parts.join(" · ");
    }

    function renderSavedHousingSearchesList() {
      if (!myHousingSearchesListEl) return;
      if (!savedHousingSearches.length) {
        myHousingSearchesListEl.innerHTML = "";
        if (myHousingSearchesEmptyEl) myHousingSearchesEmptyEl.classList.remove("hidden");
        return;
      }
      if (myHousingSearchesEmptyEl) myHousingSearchesEmptyEl.classList.add("hidden");
      myHousingSearchesListEl.innerHTML = savedHousingSearches
        .map(function (search) {
          const title = escapeHtml(buildHousingSearchTitle(search));
          const meta = escapeHtml(buildHousingSearchMeta(search) || "بدون جزئیات بیشتر");
          const activeClass = search.id === selectedHousingSearchId ? " is-active" : "";
          return (
            '<article class="my-car-item' +
            activeClass +
            '" data-saved-housing-id="' +
            escapeHtml(search.id) +
            '">' +
            '<p class="my-car-item-title">' +
            title +
            "</p>" +
            '<p class="my-car-item-meta">' +
            meta +
            "</p>" +
            '<div class="my-car-item-actions">' +
            '<button type="button" class="my-car-item-btn is-primary" data-housing-action="search">جستجو</button>' +
            '<button type="button" class="my-car-item-btn" data-housing-action="select">انتخاب</button>' +
            '<button type="button" class="my-car-item-btn is-danger" data-housing-action="delete">حذف</button>' +
            "</div></article>"
          );
        })
        .join("");
    }

    function saveCurrentHousingSearch() {
      const query = readHousingQueryFromForm();
      const error = validateHousingQuery(query);
      if (error) {
        setHousingStatus(error, true);
        return;
      }
      const item = Object.assign({}, query, {
        id: createHousingSearchId(),
        savedAt: Date.now(),
      });
      savedHousingSearches = [item].concat(
        savedHousingSearches.filter(function (existing) {
          return !(
            existing.cityId === item.cityId &&
            existing.dealKey === item.dealKey &&
            existing.budgetMax === item.budgetMax &&
            existing.creditMax === item.creditMax &&
            existing.rentMax === item.rentMax &&
            existing.sizeMin === item.sizeMin &&
            existing.sizeMax === item.sizeMax &&
            existing.rooms === item.rooms &&
            (existing.nickname || "") === (item.nickname || "")
          );
        }),
      ).slice(0, 20);
      selectedHousingSearchId = item.id;
      persistSavedHousingSearches();
      renderSavedHousingSearchesList();
      showPriceToast("جستجو ذخیره شد · دفعه بعد از «جستجوهای من» دوباره جستجو کن");
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
        housingListingsByToken = {};
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
            setHousingStatus("آگهی‌ای پیدا نشد. بودجه را کمی بالاتر ببر یا متراژ/خواب را بازتر کن.", true);
            return;
          }
          renderHousingListings(payload.rows, append);
          const countText = (housingListEl ? housingListEl.querySelectorAll(".housing-card").length : 0).toLocaleString("fa-IR");
          setHousingStatus(
            "نتایج " + (payload.deal ? payload.deal.labelFa : "") + " در " + (payload.city ? payload.city.nameFa : "تهران") + " · " + countText + " آگهی",
            false,
          );
          if (!append) maybeShowSoftDonatePrompt("housing-search");
        })
        .catch(function (err) {
          console.error("Housing search error:", err);
          if (housingLoadingEl) housingLoadingEl.classList.add("hidden");
          const detail = err && err.message ? err.message : "اتصال اینترنت را بررسی کنید";
          setHousingStatus("مسکن · جستجوی ملک ممکن نشد. " + detail, true);
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

      savedHousingSearches = loadSavedHousingSearches();
      renderSavedHousingSearchesList();

      const prefs = loadHousingPrefs();
      if (prefs) applyHousingQueryToForm(prefs);
      else syncHousingDealFields();
    }

    function switchMarketTab(tab) {
      if (["currency", "gold", "cars", "housing", "tools", "more"].indexOf(tab) === -1) return;

      activeMarketTab = tab;
      pricesPanelEl.classList.toggle("hidden", !isPriceTab(tab));
      currencyViewEl.classList.toggle("hidden", tab !== "currency");
      goldViewEl.classList.toggle("hidden", tab !== "gold");
      carsViewEl.classList.toggle("hidden", tab !== "cars");
      if (housingViewEl) housingViewEl.classList.toggle("hidden", tab !== "housing");
      if (toolsViewEl) toolsViewEl.classList.toggle("hidden", tab !== "tools");
      moreViewEl.classList.toggle("hidden", tab !== "more");
      document.body.classList.toggle("is-tools-tab", tab === "tools");
      syncNavCenterFab(tab);

      navButtons.forEach(function (button) {
        const isNavChrome =
          button.classList.contains("market-nav-btn") ||
          button.classList.contains("market-settings-btn") ||
          button.classList.contains("market-tools-btn");
        if (!isNavChrome) return;
        button.classList.toggle("is-active", button.dataset.marketTab === tab);
      });

      if (isPriceTab(tab)) {
        if (pricesLoaded) showPriceLists();
        else fetchPrices();
      }

      if (tab === "cars") {
        syncCarsSubtabUi();
        if (activeCarsSubtab === "estimate" && activeCarsEstimateMode === "specs") {
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
      if (activeMarketTab === "tools") {
        if (typeof window["__openBankCardModal"] === "function") {
          window["__openBankCardModal"]();
        }
        return;
      }
      if (activeMarketTab === "cars") {
        if (activeCarsSubtab === "prices") fetchCarPrices();
        else if (activeCarsEstimateMode === "specs") ensureMyCarCatalog().catch(function () {});
      } else if (activeMarketTab === "housing") runHousingSearch({ append: false });
      else if (isPriceTab(activeMarketTab)) fetchPrices();
    }

    initMoreTab();
    initHousingTab();
    initMyCarEstimateTab();
    bindCollapseToggle("myCarFormCollapseBtn", "myCarFormCollapse", "market-prices-mycar-form-expanded", {
      openLabel: "باز کردن فرم",
      closeLabel: "بستن فرم",
    });
    bindCollapseToggle("housingFormCollapseBtn", "housingFormCollapse", "market-prices-housing-form-expanded", {
      openLabel: "باز کردن فرم",
      closeLabel: "بستن فرم",
    });

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
          return;
        }
        if (target.closest(".estimate-share-btn")) {
          event.preventDefault();
          handleEstimateShareClick(lastDivarEstimateResult);
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
          return;
        }
        if (target.closest(".estimate-share-btn")) {
          event.preventDefault();
          handleEstimateShareClick(lastMyCarEstimateResult);
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
        if (saved) {
        setMyCarStatus("خودرو ذخیره شد", false);
        showPriceToast("خودرو ذخیره شد · دفعه بعد از «خودروهای من» دوباره تخمین بزن");
      }
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

    if (housingSaveSearchBtnEl) {
      housingSaveSearchBtnEl.addEventListener("click", function () {
        saveCurrentHousingSearch();
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
        const detailsBtn = target.closest("[data-housing-details]");
        if (detailsBtn) {
          event.preventDefault();
          openHousingDetailSheet(detailsBtn.getAttribute("data-housing-details"));
        }
      });
    }

    if (housingDetailBackdropEl) {
      housingDetailBackdropEl.addEventListener("click", closeHousingDetailSheet);
    }

    if (housingDetailContentEl) {
      housingDetailContentEl.addEventListener("click", function (event) {
        const target = event.target;
        if (!target || typeof target.closest !== "function") return;
        const openBtn = target.closest("[data-housing-open]");
        if (openBtn) {
          event.preventDefault();
          openExternalUrl(openBtn.getAttribute("data-housing-open"));
        }
      });
    }

    if (myHousingSearchesListEl) {
      myHousingSearchesListEl.addEventListener("click", function (event) {
        const target = event.target;
        if (!target || typeof target.closest !== "function") return;
        const actionBtn = target.closest("[data-housing-action]");
        const card = target.closest("[data-saved-housing-id]");
        if (!actionBtn || !card) return;
        const searchId = card.getAttribute("data-saved-housing-id");
        const search = savedHousingSearches.find(function (item) {
          return item.id === searchId;
        });
        if (!search) return;
        const action = actionBtn.getAttribute("data-housing-action");
        if (action === "delete") {
          savedHousingSearches = savedHousingSearches.filter(function (item) {
            return item.id !== searchId;
          });
          if (selectedHousingSearchId === searchId) selectedHousingSearchId = null;
          persistSavedHousingSearches();
          renderSavedHousingSearchesList();
          showPriceToast("جستجو حذف شد");
          return;
        }
        selectedHousingSearchId = search.id;
        applyHousingQueryToForm(search);
        renderSavedHousingSearchesList();
        if (action === "search") {
          runHousingSearch({ append: false });
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

    if (softDonateLaterBtnEl) {
      softDonateLaterBtnEl.addEventListener("click", function () {
        const state = loadSoftDonateState();
        state.dismissedAt = Date.now();
        saveSoftDonateState(state);
        hideSoftDonatePrompt();
      });
    }
    if (softDonateGoBtnEl) {
      softDonateGoBtnEl.addEventListener("click", function () {
        openDonateFromSoftPrompt();
      });
    }
    if (softDonatePromptEl) {
      softDonatePromptEl.addEventListener("click", function (event) {
        if (event.target === softDonatePromptEl) {
          const state = loadSoftDonateState();
          state.dismissedAt = Date.now();
          saveSoftDonateState(state);
          hideSoftDonatePrompt();
        }
      });
    }

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

    carsEstimateModeButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        setCarsEstimateMode(button.dataset.carsEstimateMode);
      });
    });
    syncCarsEstimateModeUi();

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
      if (typeof hidePricesOfflineBanner === "function") hidePricesOfflineBanner();
      const trendStrip = document.getElementById("marketTrendStrip");
      if (trendStrip) {
        trendStrip.classList.add("hidden");
        trendStrip.innerHTML = "";
      }
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
    `const response = await fetch(PRICES_API_URL);
        if (!response.ok) throw new Error("پاسخ سرور نامعتبر بود");
        const data = await response.json();
        if (!data.current) throw new Error("داده‌ای دریافت نشد");`,
    `const data = await fetchMoj3PricesPayload();
        if (!data.current) throw new Error("داده‌ای دریافت نشد");
        cacheMarketPrices(data.current);
        hidePricesOfflineBanner();`,
  );

  script = script.replace(
    `      } catch (error) {
        console.error("Prices fetch error:", error);
        if (silent) return;
        showError("خطا در دریافت قیمت‌ها. اتصال اینترنت را بررسی کنید.");
      }`,
    `      } catch (error) {
        console.error("Prices fetch error:", error);
        if (silent) return;
        const cached = loadCachedMarketPrices();
        if (cached?.current) {
          renderPrices(cached.current, { silent: true, offline: true });
          showPricesOfflineBanner(cached.fetchedAt);
          return;
        }
        showError("خطا در دریافت قیمت‌ها. اتصال اینترنت را بررسی کنید.");
      }`,
  );

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
