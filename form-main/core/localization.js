/**
 * I-765 Form Application - Bilingual Localization System
 * Supports English and Simplified Chinese (中文)
 * Complete translation management with fallback mechanisms
 * Last Updated: 2025-12-09
 */

const SUPPORTED_LANGUAGES = {
  EN: 'en',
  ZH: 'zh'
};

const LANGUAGE_NAMES = {
  en: 'English',
  zh: '中文 (简体)'
};

/**
 * Complete translation dictionary for I-765 form application
 */
const TRANSLATIONS = {
  en: {
    // Application Headers and Navigation
    'app.title': 'Application for Employment Authorization',
    'app.form': 'Form I-765',
    'app.subtitle': 'Uscis.gov Official Form',
    'app.language': 'Language',
    'app.language.english': 'English',
    'app.language.chinese': '中文',

    // Main Navigation
    'nav.home': 'Home',
    'nav.form': 'Form',
    'nav.preview': 'Preview',
    'nav.submit': 'Submit',
    'nav.help': 'Help',
    'nav.settings': 'Settings',

    // Section Headers
    'section.applicantInfo': 'Part A - Information About You',
    'section.applicationInfo': 'Part B - Application Information',
    'section.biographicInfo': 'Part C - Biographical Information',
    'section.workAuth': 'Part D - Work Authorization Category',
    'section.additionalInfo': 'Part E - Additional Information',

    // Form Fields - Applicant Information
    'field.firstName': 'Given Name (First Name)',
    'field.middleName': 'Middle Name',
    'field.lastName': 'Family Name (Last Name)',
    'field.birthDate': 'Date of Birth',
    'field.birthPlace': 'Country of Birth',
    'field.nationality': 'Country of Nationality',
    'field.gender': 'Gender',
    'field.gender.male': 'Male',
    'field.gender.female': 'Female',
    'field.maritalStatus': 'Marital Status',
    'field.maritalStatus.single': 'Single',
    'field.maritalStatus.married': 'Married',
    'field.maritalStatus.divorced': 'Divorced',
    'field.maritalStatus.widowed': 'Widowed',
    'field.maritalStatus.separated': 'Separated',
    'field.height': 'Height',
    'field.heightUnit.feet': 'Feet',
    'field.heightUnit.cm': 'Centimeters',
    'field.weight': 'Weight',
    'field.weightUnit.lbs': 'Pounds',
    'field.weightUnit.kg': 'Kilograms',
    'field.hairColor': 'Hair Color',
    'field.eyeColor': 'Eye Color',
    'field.distIdentifyFeatures': 'Distinguishing Features/Marks',

    // Immigration Details
    'field.uscisNumber': 'USCIS Number',
    'field.alienNumber': 'Alien Number',
    'field.i94Number': 'I-94 Arrival/Departure Number',
    'field.passportNumber': 'Passport Number',
    'field.passportCountry': 'Country of Passport',
    'field.visaStatus': 'Current Immigration Status',
    'field.admissionClass': 'Class of Admission',
    'field.admissionDate': 'Date of Admission',

    // Contact Information
    'field.address': 'Mailing Address',
    'field.streetAddress': 'Street Address',
    'field.cityState': 'City, State or Province',
    'field.zipCode': 'ZIP Code or Postal Code',
    'field.country': 'Country',
    'field.phoneNumber': 'Telephone Number',
    'field.email': 'Email Address',
    'field.fax': 'Fax Number',

    // Employment Information
    'field.employerName': 'Current Employer Name',
    'field.occupationTitle': 'Occupation/Job Title',
    'field.employmentStartDate': 'Employment Start Date',
    'field.employmentEndDate': 'Employment End Date',
    'field.workAuthorization': 'Work Authorization',
    'field.workAuthorization.asStated': 'As Stated',
    'field.workAuthorization.resetToExpire': 'Has or Has Not Reset and Expires',
    'field.workAuthorizationExpDate': 'Work Authorization Expiration Date',

    // Work Authorization Categories
    'field.category': 'Category Eligibility',
    'field.category.h1b': 'H-1B - Specialty Occupation',
    'field.category.l1a': 'L-1A - Intracompany Transferee (Manager)',
    'field.category.l1b': 'L-1B - Intracompany Transferee (Specialized Knowledge)',
    'field.category.e2': 'E-2 - Treaty Investor',
    'field.category.eb3': 'EB-3 - Skilled Worker',
    'field.category.asylum': 'Asylum Applicant',
    'field.category.refugee': 'Refugee',
    'field.category.nt': 'NT - Family Unity (Nicaraguan/Haitian)',
    'field.category.tps': 'TPS - Temporary Protected Status',

    // Document Information
    'field.documentType': 'Document Type',
    'field.documentNumber': 'Document Number',
    'field.documentIssueDate': 'Issue Date',
    'field.documentExpirationDate': 'Expiration Date',

    // Form Actions
    'action.save': 'Save',
    'action.next': 'Next',
    'action.previous': 'Previous',
    'action.submit': 'Submit Application',
    'action.preview': 'Preview Form',
    'action.print': 'Print',
    'action.reset': 'Reset Form',
    'action.cancel': 'Cancel',
    'action.download': 'Download',
    'action.upload': 'Upload',
    'action.edit': 'Edit',
    'action.delete': 'Delete',
    'action.continue': 'Continue',
    'action.complete': 'Complete',

    // Validation Messages
    'validation.required': 'This field is required',
    'validation.invalidEmail': 'Please enter a valid email address',
    'validation.invalidPhone': 'Please enter a valid phone number',
    'validation.invalidDate': 'Please enter a valid date (MM/DD/YYYY)',
    'validation.dateMustBePast': 'Date must be in the past',
    'validation.dateRangeInvalid': 'End date must be after start date',
    'validation.minLength': 'Must be at least {{min}} characters',
    'validation.maxLength': 'Must not exceed {{max}} characters',
    'validation.numericOnly': 'Only numeric characters are allowed',
    'validation.invalidUSCISNumber': 'Invalid USCIS number format',
    'validation.invalidI94': 'Invalid I-94 number format',
    'validation.invalidPassportNumber': 'Invalid passport number format',

    // Error Messages
    'error.loadingForm': 'Error loading form. Please refresh and try again.',
    'error.savingForm': 'Error saving form. Please try again.',
    'error.submittingForm': 'Error submitting form. Please try again.',
    'error.networkError': 'Network error. Please check your connection.',
    'error.unknownError': 'An unknown error occurred. Please try again.',
    'error.sessionExpired': 'Your session has expired. Please log in again.',
    'error.accessDenied': 'Access denied. You do not have permission to access this form.',

    // Success Messages
    'success.formSaved': 'Form saved successfully',
    'success.formSubmitted': 'Form submitted successfully',
    'success.changesSaved': 'All changes have been saved',
    'success.formReset': 'Form has been reset to default values',

    // Confirmation Messages
    'confirm.resetForm': 'Are you sure you want to reset the form? All changes will be lost.',
    'confirm.submitForm': 'Please review your information before submitting. You cannot edit after submission.',
    'confirm.deleteField': 'Are you sure you want to delete this entry?',
    'confirm.unsavedChanges': 'You have unsaved changes. Do you want to leave without saving?',

    // Helper Text and Instructions
    'help.uscisNumber': 'Usually found on your USCIS approval notice or work permit',
    'help.i94Number': 'Found on your I-94 arrival/departure record',
    'help.passportNumber': 'Found in your passport',
    'help.birthDate': 'Format: MM/DD/YYYY',
    'help.phoneFormat': 'Format: (XXX) XXX-XXXX or +1XXXXXXXXXX',
    'help.zipCodeFormat': 'Format: XXXXX or XXXXX-XXXX',
    'help.employmentAuth': 'Your current employment authorization status',

    // Date and Time
    'date.january': 'January',
    'date.february': 'February',
    'date.march': 'March',
    'date.april': 'April',
    'date.may': 'May',
    'date.june': 'June',
    'date.july': 'July',
    'date.august': 'August',
    'date.september': 'September',
    'date.october': 'October',
    'date.november': 'November',
    'date.december': 'December',
    'date.sunday': 'Sunday',
    'date.monday': 'Monday',
    'date.tuesday': 'Tuesday',
    'date.wednesday': 'Wednesday',
    'date.thursday': 'Thursday',
    'date.friday': 'Friday',
    'date.saturday': 'Saturday',

    // Footer
    'footer.copyright': '© 2025 USCIS. All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.contact': 'Contact Us',
    'footer.accessibility': 'Accessibility',

    // Loading
    'loading.processing': 'Processing...',
  },

  zh: {
    // Application Headers and Navigation
    'app.title': '工作许可申请',
    'app.form': 'I-765表格',
    'app.subtitle': 'USCIS官方表格',
    'app.language': '语言',
    'app.language.english': 'English',
    'app.language.chinese': '中文',

    // Main Navigation
    'nav.home': '主页',
    'nav.form': '表格',
    'nav.preview': '预览',
    'nav.submit': '提交',
    'nav.help': '帮助',
    'nav.settings': '设置',

    // Section Headers
    'section.applicantInfo': '第A部分 - 您的信息',
    'section.applicationInfo': '第B部分 - 申请信息',
    'section.biographicInfo': '第C部分 - 生物特征信息',
    'section.workAuth': '第D部分 - 工作许可类别',
    'section.additionalInfo': '第E部分 - 附加信息',

    // Form Fields - Applicant Information
    'field.firstName': '名字（名）',
    'field.middleName': '中间名',
    'field.lastName': '姓氏',
    'field.birthDate': '出生日期',
    'field.birthPlace': '出生国家',
    'field.nationality': '国籍',
    'field.gender': '性别',
    'field.gender.male': '男性',
    'field.gender.female': '女性',
    'field.maritalStatus': '婚姻状况',
    'field.maritalStatus.single': '未婚',
    'field.maritalStatus.married': '已婚',
    'field.maritalStatus.divorced': '离异',
    'field.maritalStatus.widowed': '丧偶',
    'field.maritalStatus.separated': '分居',
    'field.height': '身高',
    'field.heightUnit.feet': '英尺',
    'field.heightUnit.cm': '厘米',
    'field.weight': '体重',
    'field.weightUnit.lbs': '磅',
    'field.weightUnit.kg': '公斤',
    'field.hairColor': '头发颜色',
    'field.eyeColor': '眼睛颜色',
    'field.distIdentifyFeatures': '识别特征/标记',

    // Immigration Details
    'field.uscisNumber': 'USCIS号码',
    'field.alienNumber': '外国人号码',
    'field.i94Number': 'I-94到达/离境号码',
    'field.passportNumber': '护照号码',
    'field.passportCountry': '护照国家',
    'field.visaStatus': '当前移民身份',
    'field.admissionClass': '入境等级',
    'field.admissionDate': '入境日期',

    // Contact Information
    'field.address': '邮寄地址',
    'field.streetAddress': '街道地址',
    'field.cityState': '城市、州或省份',
    'field.zipCode': '邮政编码',
    'field.country': '国家',
    'field.phoneNumber': '电话号码',
    'field.email': '电子邮件地址',
    'field.fax': '传真号码',

    // Employment Information
    'field.employerName': '现任雇主名称',
    'field.occupationTitle': '职业/工作职位',
    'field.employmentStartDate': '就业开始日期',
    'field.employmentEndDate': '就业结束日期',
    'field.workAuthorization': '工作许可',
    'field.workAuthorization.asStated': '如所述',
    'field.workAuthorization.resetToExpire': '已或未重置并过期',
    'field.workAuthorizationExpDate': '工作许可过期日期',

    // Work Authorization Categories
    'field.category': '类别资格',
    'field.category.h1b': 'H-1B - 特殊职业',
    'field.category.l1a': 'L-1A - 公司内部转让（经理）',
    'field.category.l1b': 'L-1B - 公司内部转让（专业知识）',
    'field.category.e2': 'E-2 - 条约投资者',
    'field.category.eb3': 'EB-3 - 熟练工人',
    'field.category.asylum': '寻求庇护者',
    'field.category.refugee': '难民',
    'field.category.nt': 'NT - 家庭统一（尼加拉瓜/海地）',
    'field.category.tps': 'TPS - 临时保护状态',

    // Document Information
    'field.documentType': '文件类型',
    'field.documentNumber': '文件号码',
    'field.documentIssueDate': '签发日期',
    'field.documentExpirationDate': '过期日期',

    // Form Actions
    'action.save': '保存',
    'action.next': '下一步',
    'action.previous': '上一步',
    'action.submit': '提交申请',
    'action.preview': '预览表格',
    'action.print': '打印',
    'action.reset': '重置表格',
    'action.cancel': '取消',
    'action.download': '下载',
    'action.upload': '上传',
    'action.edit': '编辑',
    'action.delete': '删除',
    'action.continue': '继续',
    'action.complete': '完成',

    // Validation Messages
    'validation.required': '此字段为必填项',
    'validation.invalidEmail': '请输入有效的电子邮件地址',
    'validation.invalidPhone': '请输入有效的电话号码',
    'validation.invalidDate': '请输入有效的日期 (MM/DD/YYYY)',
    'validation.dateMustBePast': '日期必须是过去的日期',
    'validation.dateRangeInvalid': '结束日期必须在开始日期之后',
    'validation.minLength': '必须至少包含{{min}}个字符',
    'validation.maxLength': '不能超过{{max}}个字符',
    'validation.numericOnly': '仅允许数字字符',
    'validation.invalidUSCISNumber': '无效的USCIS号码格式',
    'validation.invalidI94': '无效的I-94号码格式',
    'validation.invalidPassportNumber': '无效的护照号码格式',

    // Error Messages
    'error.loadingForm': '加载表格时出错。请刷新并重试。',
    'error.savingForm': '保存表格时出错。请重试。',
    'error.submittingForm': '提交表格时出错。请重试。',
    'error.networkError': '网络错误。请检查您的连接。',
    'error.unknownError': '发生未知错误。请重试。',
    'error.sessionExpired': '您的会话已过期。请重新登录。',
    'error.accessDenied': '访问被拒绝。您没有权限访问此表格。',

    // Success Messages
    'success.formSaved': '表格已成功保存',
    'success.formSubmitted': '表格已成功提交',
    'success.changesSaved': '所有更改已保存',
    'success.formReset': '表格已重置为默认值',

    // Confirmation Messages
    'confirm.resetForm': '您确定要重置表格吗？所有更改将丢失。',
    'confirm.submitForm': '请在提交前检查您的信息。提交后无法编辑。',
    'confirm.deleteField': '您确定要删除此条目吗？',
    'confirm.unsavedChanges': '您有未保存的更改。您想不保存就离开吗？',

    // Helper Text and Instructions
    'help.uscisNumber': '通常在您的USCIS批准通知或工作许可证上找到',
    'help.i94Number': '在您的I-94到达/离境记录上找到',
    'help.passportNumber': '在您的护照中找到',
    'help.birthDate': '格式：MM/DD/YYYY',
    'help.phoneFormat': '格式：(XXX) XXX-XXXX 或 +1XXXXXXXXXX',
    'help.zipCodeFormat': '格式：XXXXX 或 XXXXX-XXXX',
    'help.employmentAuth': '您当前的工作许可状态',

    // Date and Time
    'date.january': '一月',
    'date.february': '二月',
    'date.march': '三月',
    'date.april': '四月',
    'date.may': '五月',
    'date.june': '六月',
    'date.july': '七月',
    'date.august': '八月',
    'date.september': '九月',
    'date.october': '十月',
    'date.november': '十一月',
    'date.december': '十二月',
    'date.sunday': '星期日',
    'date.monday': '星期一',
    'date.tuesday': '星期二',
    'date.wednesday': '星期三',
    'date.thursday': '星期四',
    'date.friday': '星期五',
    'date.saturday': '星期六',

    // Footer
    'footer.copyright': '© 2025 USCIS。版权所有。',
    'footer.privacy': '隐私政策',
    'footer.terms': '服务条款',
    'footer.contact': '联系我们',
    'footer.accessibility': '无障碍访问',

    // Loading
    'loading.processing': '处理中...',
  }
};

/**
 * Localization Manager Class
 * Handles all translation operations and language switching
 */
class LocalizationManager {
  constructor(defaultLanguage = SUPPORTED_LANGUAGES.EN) {
    this.currentLanguage = defaultLanguage;
    this.defaultLanguage = defaultLanguage;
    this.fallbackLanguage = SUPPORTED_LANGUAGES.EN;
    this.missingTranslations = new Set();
    this.translationCache = {};
    this.listeners = [];
  }

  /**
   * Get current language
   * @returns {string} Current language code
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * Set current language
   * @param {string} language - Language code (en or zh)
   * @returns {boolean} True if language was successfully set
   */
  setLanguage(language) {
    if (!Object.values(SUPPORTED_LANGUAGES).includes(language)) {
      console.warn(`Unsupported language: ${language}. Falling back to ${this.defaultLanguage}`);
      return false;
    }
    
    if (this.currentLanguage !== language) {
      this.currentLanguage = language;
      this.notifyListeners();
      // Persist language preference
      this.saveLanguagePreference(language);
    }
    return true;
  }

  /**
   * Get supported languages
   * @returns {object} Object mapping language codes to display names
   */
  getSupportedLanguages() {
    return LANGUAGE_NAMES;
  }

  /**
   * Translate a key to the current language
   * @param {string} key - Translation key (e.g., 'field.firstName')
   * @param {object} variables - Optional variables for interpolation
   * @returns {string} Translated string or fallback text
   */
  t(key, variables = {}) {
    const cacheKey = `${this.currentLanguage}_${key}`;
    
    // Check cache first
    if (this.translationCache[cacheKey]) {
      return this.interpolate(this.translationCache[cacheKey], variables);
    }

    // Get translation from current language
    let translation = this.getTranslation(this.currentLanguage, key);

    // Fall back to default language if not found
    if (!translation && this.currentLanguage !== this.defaultLanguage) {
      translation = this.getTranslation(this.defaultLanguage, key);
    }

    // Fall back to fallback language if still not found
    if (!translation && this.defaultLanguage !== this.fallbackLanguage) {
      translation = this.getTranslation(this.fallbackLanguage, key);
    }

    // Use key itself as fallback
    if (!translation) {
      translation = key;
      this.missingTranslations.add(key);
      console.warn(`Missing translation for key: ${key} in language: ${this.currentLanguage}`);
    }

    // Cache the result
    this.translationCache[cacheKey] = translation;

    // Interpolate variables
    return this.interpolate(translation, variables);
  }

  /**
   * Get translation from specific language
   * @private
   * @param {string} language - Language code
   * @param {string} key - Translation key
   * @returns {string|null} Translation or null if not found
   */
  getTranslation(language, key) {
    const parts = key.split('.');
    let current = TRANSLATIONS[language];

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return null;
      }
    }

    return typeof current === 'string' ? current : null;
  }

  /**
   * Interpolate variables in translation string
   * @private
   * @param {string} text - Text containing {{variable}} placeholders
   * @param {object} variables - Variables to interpolate
   * @returns {string} Interpolated string
   */
  interpolate(text, variables = {}) {
    let result = text;
    
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      result = result.replace(placeholder, value);
    }

    return result;
  }

  /**
   * Check if a translation key exists
   * @param {string} key - Translation key
   * @returns {boolean} True if key exists in current language
   */
  hasKey(key) {
    return this.getTranslation(this.currentLanguage, key) !== null;
  }

  /**
   * Get all missing translations
   * @returns {Set} Set of missing translation keys
   */
  getMissingTranslations() {
    return new Set(this.missingTranslations);
  }

  /**
   * Clear missing translations tracking
   */
  clearMissingTranslations() {
    this.missingTranslations.clear();
  }

  /**
   * Clear translation cache
   */
  clearCache() {
    this.translationCache = {};
  }

  /**
   * Get all translations for current language
   * @returns {object} All translations
   */
  getAllTranslations() {
    return TRANSLATIONS[this.currentLanguage] || {};
  }

  /**
   * Format date according to current language
   * @param {Date|string|number} date - Date to format
   * @param {string} format - Format string (short, medium, long)
   * @returns {string} Formatted date string
   */
  formatDate(date, format = 'medium') {
    if (typeof date === 'string' || typeof date === 'number') {
      date = new Date(date);
    }

    if (!(date instanceof Date) || isNaN(date)) {
      return '';
    }

    const monthNames = [
      this.t('date.january'),
      this.t('date.february'),
      this.t('date.march'),
      this.t('date.april'),
      this.t('date.may'),
      this.t('date.june'),
      this.t('date.july'),
      this.t('date.august'),
      this.t('date.september'),
      this.t('date.october'),
      this.t('date.november'),
      this.t('date.december')
    ];

    const dayNames = [
      this.t('date.sunday'),
      this.t('date.monday'),
      this.t('date.tuesday'),
      this.t('date.wednesday'),
      this.t('date.thursday'),
      this.t('date.friday'),
      this.t('date.saturday')
    ];

    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const dayOfWeek = date.getDay();

    let formatted;
    switch (format) {
      case 'short':
        // MM/DD/YYYY
        formatted = `${String(month + 1).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}`;
        break;
      case 'long':
        // Monday, January 15, 2025
        formatted = `${dayNames[dayOfWeek]}, ${monthNames[month]} ${day}, ${year}`;
        break;
      case 'medium':
      default:
        // January 15, 2025
        formatted = `${monthNames[month]} ${day}, ${year}`;
        break;
    }

    return formatted;
  }

  /**
   * Format phone number according to current language preferences
   * @param {string} phone - Phone number string
   * @returns {string} Formatted phone number
   */
  formatPhoneNumber(phone) {
    if (!phone) return '';
    
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');

    if (this.currentLanguage === SUPPORTED_LANGUAGES.ZH) {
      // Chinese format: +86 XX XXXX XXXX
      if (cleaned.length === 11 && cleaned.startsWith('1')) {
        return `+86 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)} ${cleaned.slice(6)}`;
      }
      // US format with +1: +1 (XXX) XXX-XXXX
      if (cleaned.length === 10) {
        return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      }
    } else {
      // US/English format: (XXX) XXX-XXXX
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      }
      if (cleaned.length === 11 && cleaned.startsWith('1')) {
        return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
      }
    }

    return phone;
  }

  /**
   * Format currency according to current language
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code (USD, CNY, etc.)
   * @returns {string} Formatted currency string
   */
  formatCurrency(amount, currency = 'USD') {
    const locale = this.currentLanguage === SUPPORTED_LANGUAGES.ZH ? 'zh-CN' : 'en-US';
    const options = {
      style: 'currency',
      currency: currency
    };

    try {
      return new Intl.NumberFormat(locale, options).format(amount);
    } catch (e) {
      console.error(`Error formatting currency: ${e.message}`);
      return `${currency} ${amount}`;
    }
  }

  /**
   * Format number according to current language
   * @param {number} number - Number to format
   * @param {number} decimals - Number of decimal places
   * @returns {string} Formatted number string
   */
  formatNumber(number, decimals = 0) {
    const locale = this.currentLanguage === SUPPORTED_LANGUAGES.ZH ? 'zh-CN' : 'en-US';
    const options = {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    };

    try {
      return new Intl.NumberFormat(locale, options).format(number);
    } catch (e) {
      console.error(`Error formatting number: ${e.message}`);
      return String(number);
    }
  }

  /**
   * Register listener for language changes
   * @param {Function} callback - Function to call when language changes
   */
  onChange(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback);
    }
  }

  /**
   * Unregister listener
   * @param {Function} callback - Function to remove
   */
  offChange(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  /**
   * Notify all listeners of language change
   * @private
   */
  notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.currentLanguage);
      } catch (e) {
        console.error(`Error in language change listener: ${e.message}`);
      }
    });
  }

  /**
   * Save language preference to localStorage
   * @private
   * @param {string} language - Language code
   */
  saveLanguagePreference(language) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('i765_form_language', language);
      }
    } catch (e) {
      console.warn(`Could not save language preference: ${e.message}`);
    }
  }

  /**
   * Load language preference from localStorage
   * @private
   * @returns {string|null} Saved language code or null
   */
  loadLanguagePreference() {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem('i765_form_language');
      }
    } catch (e) {
      console.warn(`Could not load language preference: ${e.message}`);
    }
    return null;
  }

  /**
   * Initialize from saved preference or browser locale
   */
  initializeLanguage() {
    // Try to load saved preference
    const savedLanguage = this.loadLanguagePreference();
    if (savedLanguage && Object.values(SUPPORTED_LANGUAGES).includes(savedLanguage)) {
      this.currentLanguage = savedLanguage;
      return;
    }

    // Try to detect from browser
    if (typeof navigator !== 'undefined' && navigator.language) {
      const browserLang = navigator.language.toLowerCase().split('-')[0];
      if (browserLang === SUPPORTED_LANGUAGES.ZH) {
        this.currentLanguage = SUPPORTED_LANGUAGES.ZH;
        return;
      }
    }

    // Fall back to default
    this.currentLanguage = this.defaultLanguage;
  }

  /**
   * Export translations to JSON format
   * @param {string} language - Language to export
   * @returns {string} JSON string of translations
   */
  exportTranslations(language = this.currentLanguage) {
    return JSON.stringify(TRANSLATIONS[language] || {}, null, 2);
  }

  /**
   * Get translation statistics
   * @returns {object} Statistics about translations
   */
  getStatistics() {
    const stats = {
      totalKeys: Object.keys(TRANSLATIONS[this.defaultLanguage] || {}).length,
      translatedKeys: {},
      missingKeys: {},
      missingTranslationsCount: this.missingTranslations.size
    };

    Object.keys(SUPPORTED_LANGUAGES).forEach(lang => {
      const langCode = SUPPORTED_LANGUAGES[lang];
      const keys = Object.keys(TRANSLATIONS[langCode] || {});
      stats.translatedKeys[langCode] = keys.length;
      stats.missingKeys[langCode] = stats.totalKeys - keys.length;
    });

    return stats;
  }

  /**
   * Pluralize string based on count
   * @param {string} singular - Singular form
   * @param {string} plural - Plural form
   * @param {number} count - Count to determine singular/plural
   * @returns {string} Appropriate singular or plural form
   */
  pluralize(singular, plural, count) {
    return count === 1 ? singular : plural;
  }
}

/**
 * Create and export singleton instance
 */
const localization = new LocalizationManager(SUPPORTED_LANGUAGES.EN);

/**
 * Helper function - shorthand for t()
 */
const i18n = (key, variables = {}) => localization.t(key, variables);

/**
 * Module exports
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LocalizationManager,
    localization,
    i18n,
    SUPPORTED_LANGUAGES,
    LANGUAGE_NAMES,
    TRANSLATIONS
  };
}

// Export for ES modules
if (typeof exports !== 'undefined') {
  exports.LocalizationManager = LocalizationManager;
  exports.localization = localization;
  exports.i18n = i18n;
  exports.SUPPORTED_LANGUAGES = SUPPORTED_LANGUAGES;
  exports.LANGUAGE_NAMES = LANGUAGE_NAMES;
  exports.TRANSLATIONS = TRANSLATIONS;
}

// Make available globally for browser
if (typeof window !== 'undefined') {
  window.LocalizationManager = LocalizationManager;
  window.localization = localization;
  window.i18n = i18n;
  window.SUPPORTED_LANGUAGES = SUPPORTED_LANGUAGES;
  window.LANGUAGE_NAMES = LANGUAGE_NAMES;
}

