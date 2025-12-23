/**
 * Validation Engine for I-765 Form Application
 * Provides comprehensive validation rules with bilingual error messages
 * Last Updated: 2025-12-09
 */

class FormValidator {
  constructor(localizationManager) {
    this.localization = localizationManager || (typeof localization !== 'undefined' ? localization : null);
  }

  /**
   * Validate a field value based on validation rules
   * @param {string} fieldId - Field identifier
   * @param {*} value - Value to validate
   * @param {object} rules - Validation rules
   * @returns {object} Validation result { isValid: boolean, errors: string[] }
   */
  validateField(fieldId, value, rules) {
    const errors = [];
    const isZh = this.localization && this.localization.getCurrentLanguage() === 'zh';

    // Required validation
    if (rules.required && (value === null || value === undefined || value === '')) {
      errors.push(isZh ? '此字段为必填项' : 'This field is required');
      return { isValid: false, errors };
    }

    // Skip other validations if value is empty and not required
    if (!value && !rules.required) {
      return { isValid: true, errors: [] };
    }

    // Pattern validation
    if (rules.pattern && typeof value === 'string') {
      const regex = new RegExp(rules.pattern);
      if (!regex.test(value)) {
        const errorMsg = rules.error_message_zh && isZh 
          ? rules.error_message_zh 
          : (rules.error_message_en || (isZh ? '格式无效' : 'Invalid format'));
        errors.push(errorMsg);
      }
    }

    // Min length validation
    if (rules.min_length && typeof value === 'string' && value.length < rules.min_length) {
      errors.push(
        isZh 
          ? `必须至少包含${rules.min_length}个字符` 
          : `Must be at least ${rules.min_length} characters`
      );
    }

    // Max length validation
    if (rules.max_length && typeof value === 'string' && value.length > rules.max_length) {
      errors.push(
        isZh 
          ? `不能超过${rules.max_length}个字符` 
          : `Must not exceed ${rules.max_length} characters`
      );
    }

    // Email validation
    if (rules.type === 'email' || fieldId.includes('email')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errors.push(
          isZh 
            ? '请输入有效的电子邮件地址' 
            : 'Please enter a valid email address'
        );
      }
    }

    // Phone validation
    if (rules.type === 'phone' || fieldId.includes('phone')) {
      const phoneRegex = /^[\d\s\-\(\)\+]+$/;
      const cleaned = value.replace(/\D/g, '');
      if (!phoneRegex.test(value) || cleaned.length < 10) {
        errors.push(
          isZh 
            ? '请输入有效的电话号码' 
            : 'Please enter a valid phone number'
        );
      }
    }

    // Date validation
    if (rules.type === 'date' || fieldId.includes('date') || fieldId.includes('birth')) {
      if (!this.validateDate(value, rules.format)) {
        errors.push(
          isZh 
            ? '请输入有效的日期 (MM/DD/YYYY)' 
            : 'Please enter a valid date (MM/DD/YYYY)'
        );
      }
    }

    // A-Number validation
    if (fieldId.includes('alien_number') || fieldId.includes('a_number')) {
      const aNumberRegex = /^A\d{8,9}$/;
      if (value && !aNumberRegex.test(value.toUpperCase())) {
        errors.push(
          isZh 
            ? 'A号码格式应为 A 后跟8或9位数字' 
            : 'A-Number format should be A followed by 8 or 9 digits'
        );
      }
    }

    // I-94 validation
    if (fieldId.includes('i94')) {
      const i94Regex = /^\d{11}$/;
      if (value && !i94Regex.test(value)) {
        errors.push(
          isZh 
            ? 'I-94号码应为11位数字' 
            : 'I-94 number should be 11 digits'
        );
      }
    }

    // SSN validation
    if (fieldId.includes('ssn')) {
      const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
      if (value && !ssnRegex.test(value)) {
        errors.push(
          isZh 
            ? 'SSN格式应为 XXX-XX-XXXX' 
            : 'SSN format should be XXX-XX-XXXX'
        );
      }
    }

    // ZIP code validation
    if (fieldId.includes('zip')) {
      const zipRegex = /^\d{5}(-\d{4})?$/;
      if (value && !zipRegex.test(value)) {
        errors.push(
          isZh 
            ? '邮政编码格式应为 XXXXX 或 XXXXX-XXXX' 
            : 'ZIP code format should be XXXXX or XXXXX-XXXX'
        );
      }
    }

    // Eligibility category validation
    if (fieldId.includes('eligibility_category')) {
      const categoryRegex = /^\([a-z]\)\d+\)(?:\([ivx]+\))?$/;
      if (value && !categoryRegex.test(value)) {
        errors.push(
          isZh 
            ? '资格类别格式应为 (a)(8) 或 (c)(17)(iii)' 
            : 'Eligibility category format should be (a)(8) or (c)(17)(iii)'
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate date string
   * @param {string} dateStr - Date string to validate
   * @param {string} format - Expected format (default: MM/DD/YYYY)
   * @returns {boolean} True if valid
   */
  validateDate(dateStr, format = 'MM/DD/YYYY') {
    if (!dateStr || typeof dateStr !== 'string') return false;

    if (format === 'MM/DD/YYYY') {
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const match = dateStr.match(dateRegex);
      if (!match) return false;

      const month = parseInt(match[1], 10);
      const day = parseInt(match[2], 10);
      const year = parseInt(match[3], 10);

      if (month < 1 || month > 12) return false;
      if (day < 1 || day > 31) return false;
      if (year < 1900 || year > 2100) return false;

      // Check if date is valid (e.g., not Feb 30)
      const date = new Date(year, month - 1, day);
      return date.getFullYear() === year && 
             date.getMonth() === month - 1 && 
             date.getDate() === day;
    }

    return false;
  }

  /**
   * Validate date is in the past
   * @param {string} dateStr - Date string
   * @returns {boolean} True if date is in the past
   */
  validateDateInPast(dateStr) {
    if (!this.validateDate(dateStr)) return false;
    const [month, day, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return date < new Date();
  }

  /**
   * Validate date range
   * @param {string} startDate - Start date string
   * @param {string} endDate - End date string
   * @returns {boolean} True if end date is after start date
   */
  validateDateRange(startDate, endDate) {
    if (!this.validateDate(startDate) || !this.validateDate(endDate)) return false;
    const [sMonth, sDay, sYear] = startDate.split('/').map(Number);
    const [eMonth, eDay, eYear] = endDate.split('/').map(Number);
    const start = new Date(sYear, sMonth - 1, sDay);
    const end = new Date(eYear, eMonth - 1, eDay);
    return end >= start;
  }

  /**
   * Validate entire form section
   * @param {object} data - Form data object
   * @param {object} config - Field configuration
   * @returns {object} Validation result
   */
  validateSection(data, config) {
    const errors = {};
    let isValid = true;

    if (!config || !config.fields) {
      return { isValid: false, errors: { general: 'Invalid configuration' } };
    }

    for (const field of config.fields) {
      const value = this.getNestedValue(data, field.data_path);
      const rules = field.validation || {};
      
      // Add field-specific rules
      if (field.required) rules.required = field.required;
      if (field.max_length) rules.max_length = field.max_length;
      if (field.type) rules.type = field.type;

      const result = this.validateField(field.field_id, value, rules);
      
      if (!result.isValid) {
        isValid = false;
        errors[field.field_id] = result.errors;
      }
    }

    return { isValid, errors };
  }

  /**
   * Get nested value from object using dot notation path
   * @private
   * @param {object} obj - Object to traverse
   * @param {string} path - Dot notation path
   * @returns {*} Value or undefined
   */
  getNestedValue(obj, path) {
    if (!path || !obj) return undefined;
    
    const parts = path.split('.');
    let current = obj;

    for (const part of parts) {
      if (current === null || current === undefined) return undefined;
      
      // Handle array indices
      if (part.match(/^\d+$/)) {
        const index = parseInt(part, 10);
        if (Array.isArray(current) && current[index] !== undefined) {
          current = current[index];
        } else {
          return undefined;
        }
      } else {
        current = current[part];
      }
    }

    return current;
  }

  /**
   * Validate applicant profile
   * @param {ApplicantProfile} profile - Applicant profile instance
   * @returns {object} Comprehensive validation result
   */
  validateProfile(profile) {
    const results = {
      isValid: true,
      sections: {},
      allErrors: []
    };

    // Validate personal info
    const personalValidation = profile.validatePersonalInfo();
    results.sections.personalInfo = personalValidation;
    if (!personalValidation.isValid) {
      results.isValid = false;
      results.allErrors.push(...personalValidation.errors);
    }

    // Validate immigration details
    const immigrationValidation = profile.validateImmigrationDetails();
    results.sections.immigrationDetails = immigrationValidation;
    if (!immigrationValidation.isValid) {
      results.isValid = false;
      results.allErrors.push(...immigrationValidation.errors);
    }

    // Validate eligibility
    const eligibilityValidation = profile.validateEligibility();
    results.sections.eligibility = eligibilityValidation;
    if (!eligibilityValidation.isValid) {
      results.isValid = false;
      results.allErrors.push(...eligibilityValidation.errors);
    }

    return results;
  }

  /**
   * Format validation errors for display
   * @param {object} errors - Errors object
   * @returns {string[]} Array of formatted error messages
   */
  formatErrors(errors) {
    const formatted = [];
    
    if (typeof errors === 'string') {
      return [errors];
    }

    if (Array.isArray(errors)) {
      return errors;
    }

    if (typeof errors === 'object') {
      for (const [field, fieldErrors] of Object.entries(errors)) {
        if (Array.isArray(fieldErrors)) {
          formatted.push(...fieldErrors);
        } else if (typeof fieldErrors === 'string') {
          formatted.push(fieldErrors);
        }
      }
    }

    return formatted;
  }
}

// Export for use in different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FormValidator;
}

// Make available globally
if (typeof window !== 'undefined') {
  window.FormValidator = FormValidator;
}


