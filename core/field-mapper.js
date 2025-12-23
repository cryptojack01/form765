/**
 * Field Mapper Engine for I-765 Form Application
 * Maps ApplicantProfile data to PDF form fields
 * Last Updated: 2025-12-09
 */

class FieldMapper {
  constructor(config) {
    this.config = config || null;
    this.fieldMapping = new Map();
    this.loadConfig();
  }

  /**
   * Load field configuration
   */
  async loadConfig() {
    if (this.config) {
      this.buildMapping();
      return;
    }

    try {
      // Try different paths
      let response;
      const paths = [
        './core/i765-config.json',
        '../core/i765-config.json',
        'core/i765-config.json'
      ];
      
      let loaded = false;
      for (const path of paths) {
        try {
          response = await fetch(path);
          if (response.ok) {
            this.config = await response.json();
            this.buildMapping();
            loaded = true;
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      if (!loaded) {
        throw new Error('Could not load config from any path');
      }
    } catch (error) {
      console.error('[FieldMapper] Error loading config:', error);
      // Fallback to empty config
      this.config = { parts: [] };
    }
  }

  /**
   * Build field mapping from configuration
   * @private
   */
  buildMapping() {
    if (!this.config || !this.config.parts) return;

    for (const part of this.config.parts) {
      if (!part.fields) continue;

      for (const field of part.fields) {
        if (field.field_id && field.data_path) {
          this.fieldMapping.set(field.field_id, {
            pdfFieldName: field.pdf_field_name,
            dataPath: field.data_path,
            field: field
          });
        }
      }
    }
  }

  /**
   * Map applicant profile to form data structure
   * @param {ApplicantProfile} profile - Applicant profile instance
   * @returns {object} Mapped form data
   */
  mapProfileToForm(profile) {
    const formData = {};

    if (!this.config || !this.config.parts) {
      console.warn('[FieldMapper] Configuration not loaded');
      return formData;
    }

    console.log('[FieldMapper] Starting to map profile to form data...');
    let mappedCount = 0;
    let skippedCount = 0;

    for (const part of this.config.parts) {
      if (!part.fields) continue;

      for (const field of part.fields) {
        if (!field.field_id || !field.data_path) {
          skippedCount++;
          continue;
        }

        const value = this.getNestedValue(profile, field.data_path);
        
        // Include field even if empty for required fields or checkboxes
        const shouldInclude = value !== undefined && value !== null && value !== '' ||
          field.type === 'Checkbox' || field.type === 'Radio';
        
        if (shouldInclude) {
          // Apply value mapping if exists
          let mappedValue = value;
          if (field.value_mapping) {
            mappedValue = this.applyValueMapping(value, field.value_mapping);
          }

          // Format value based on field type
          mappedValue = this.formatValue(mappedValue, field.type);

          // Use pdf_field_name or item_number as fallback
          const pdfFieldName = field.pdf_field_name || field.item_number || field.field_id;

          formData[field.field_id] = {
            value: mappedValue,
            pdfFieldName: pdfFieldName,
            field: field,
            originalValue: value
          };
          
          mappedCount++;
          console.log(`[FieldMapper] Mapped ${field.field_id} (${field.field_label_zh || field.field_label_en}) -> ${pdfFieldName} = ${mappedValue}`);
        } else {
          skippedCount++;
        }
      }
    }

    console.log(`[FieldMapper] Mapping complete: ${mappedCount} fields mapped, ${skippedCount} fields skipped`);
    console.log('[FieldMapper] Form data keys:', Object.keys(formData));
    
    return formData;
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
   * Apply value mapping
   * @private
   * @param {*} value - Original value
   * @param {object} mapping - Value mapping object
   * @returns {*} Mapped value
   */
  applyValueMapping(value, mapping) {
    if (typeof mapping === 'object') {
      // Handle checkbox mappings
      if (mapping.checked !== undefined && value === true) {
        return mapping.checked;
      }
      
      // Handle direct mappings
      if (mapping[value] !== undefined) {
        return mapping[value];
      }
    }

    return value;
  }

  /**
   * Format value based on field type
   * @private
   * @param {*} value - Value to format
   * @param {string} type - Field type
   * @returns {string} Formatted value
   */
  formatValue(value, type) {
    if (value === null || value === undefined) return '';

    switch (type) {
      case 'Date Input':
        return this.formatDate(value);
      
      case 'Checkbox':
        return value === true || value === 'true' ? 'X' : '';
      
      case 'Radio':
        return String(value);
      
      case 'Text Input':
      default:
        return String(value);
    }
  }

  /**
   * Format date value
   * @private
   * @param {string|Date} date - Date value
   * @returns {string} Formatted date (MM/DD/YYYY)
   */
  formatDate(date) {
    if (!date) return '';

    let dateObj;
    if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'string') {
      // Handle YYYY-MM-DD format
      if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = date.split('-');
        dateObj = new Date(year, month - 1, day);
      } else if (date.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        // Already in MM/DD/YYYY format
        return date;
      } else {
        dateObj = new Date(date);
      }
    } else {
      return '';
    }

    if (isNaN(dateObj.getTime())) return '';

    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = dateObj.getFullYear();

    return `${month}/${day}/${year}`;
  }

  /**
   * Map form data back to applicant profile
   * @param {object} formData - Form data object
   * @param {ApplicantProfile} profile - Profile to update
   * @returns {ApplicantProfile} Updated profile
   */
  mapFormToProfile(formData, profile) {
    if (!this.config || !this.config.parts) {
      console.warn('[FieldMapper] Configuration not loaded');
      return profile;
    }

    for (const part of this.config.parts) {
      if (!part.fields) continue;

      for (const field of part.fields) {
        if (!field.field_id || !field.data_path) continue;

        const fieldData = formData[field.field_id];
        if (!fieldData || fieldData.value === undefined) continue;

        let value = fieldData.value;

        // Reverse value mapping
        if (field.value_mapping) {
          value = this.reverseValueMapping(value, field.value_mapping);
        }

        // Parse value based on type
        value = this.parseValue(value, field.type);

        // Set nested value
        this.setNestedValue(profile, field.data_path, value);
      }
    }

    return profile;
  }

  /**
   * Reverse value mapping
   * @private
   * @param {*} value - Mapped value
   * @param {object} mapping - Value mapping object
   * @returns {*} Original value
   */
  reverseValueMapping(value, mapping) {
    if (typeof mapping === 'object') {
      // Find key by value
      for (const [key, mappedVal] of Object.entries(mapping)) {
        if (mappedVal === value) {
          if (key === 'checked') return true;
          return key;
        }
      }
    }

    return value;
  }

  /**
   * Parse value based on field type
   * @private
   * @param {*} value - Value to parse
   * @param {string} type - Field type
   * @returns {*} Parsed value
   */
  parseValue(value, type) {
    if (value === null || value === undefined || value === '') {
      return type === 'Checkbox' ? false : '';
    }

    switch (type) {
      case 'Checkbox':
        return value === 'X' || value === true || value === 'true';
      
      case 'Radio':
        return String(value);
      
      case 'Date Input':
        return this.parseDate(value);
      
      case 'Text Input':
      default:
        return String(value);
    }
  }

  /**
   * Parse date string
   * @private
   * @param {string} dateStr - Date string
   * @returns {string} Date in YYYY-MM-DD format
   */
  parseDate(dateStr) {
    if (!dateStr) return '';

    // Handle MM/DD/YYYY format
    const mmddyyyy = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (mmddyyyy) {
      const [, month, day, year] = mmddyyyy;
      return `${year}-${month}-${day}`;
    }

    // Handle YYYY-MM-DD format
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateStr;
    }

    // Try to parse as Date
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    return '';
  }

  /**
   * Set nested value in object using dot notation path
   * @private
   * @param {object} obj - Object to update
   * @param {string} path - Dot notation path
   * @param {*} value - Value to set
   */
  setNestedValue(obj, path, value) {
    if (!path || !obj) return;

    const parts = path.split('.');
    const lastPart = parts.pop();
    let current = obj;

    for (const part of parts) {
      // Handle array indices
      if (part.match(/^\d+$/)) {
        const index = parseInt(part, 10);
        if (!Array.isArray(current)) {
          current[part] = [];
        }
        if (!current[index]) {
          current[index] = {};
        }
        current = current[index];
      } else {
        if (!current[part] || typeof current[part] !== 'object') {
          current[part] = {};
        }
        current = current[part];
      }
    }

    current[lastPart] = value;
  }

  /**
   * Get PDF field mapping for a field ID
   * @param {string} fieldId - Field identifier
   * @returns {object|null} Field mapping or null
   */
  getPDFFieldMapping(fieldId) {
    return this.fieldMapping.get(fieldId) || null;
  }

  /**
   * Get all field mappings
   * @returns {Map} All field mappings
   */
  getAllMappings() {
    return new Map(this.fieldMapping);
  }
}

// Export for use in different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FieldMapper;
}

// Make available globally
if (typeof window !== 'undefined') {
  window.FieldMapper = FieldMapper;
}

