/**
 * PDF Processor for I-765 Form Application
 * Handles PDF generation and form filling using pdf-lib
 * Last Updated: 2025-12-09
 */

class PDFProcessor {
  constructor() {
    this.pdfLib = null;
    this.templatePDF = null;
    this.initialized = false;
  }

  /**
   * Initialize PDF processor
   * @returns {Promise<boolean>} True if initialized successfully
   */
  async initialize() {
    if (this.initialized) return true;

    try {
      // Try to load pdf-lib from CDN or local file
      if (typeof PDFLib !== 'undefined') {
        this.pdfLib = PDFLib;
      } else if (typeof window !== 'undefined' && window.PDFLib) {
        this.pdfLib = window.PDFLib;
      } else {
        // Try to load from CDN
        await this.loadPDFLib();
      }

      if (!this.pdfLib) {
        console.warn('[PDFProcessor] pdf-lib not available. PDF generation will be limited.');
        return false;
      }

      this.initialized = true;
      return true;
    } catch (error) {
      console.error('[PDFProcessor] Initialization error:', error);
      return false;
    }
  }

  /**
   * Load pdf-lib from CDN
   * @private
   * @returns {Promise<void>}
   */
  async loadPDFLib() {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Window object not available'));
        return;
      }

      // Check if already loaded
      if (window.PDFLib) {
        this.pdfLib = window.PDFLib;
        resolve();
        return;
      }

      // Try to load from CDN
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
      script.onload = () => {
        if (window.PDFLib) {
          this.pdfLib = window.PDFLib;
          resolve();
        } else {
          reject(new Error('PDFLib not found after loading script'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load pdf-lib from CDN'));
      document.head.appendChild(script);
    });
  }

  /**
   * Load PDF template
   * @param {string|ArrayBuffer} templateSource - Template file path or ArrayBuffer
   * @returns {Promise<void>}
   */
  async loadTemplate(templateSource) {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.pdfLib) {
      throw new Error('PDF library not initialized');
    }

    try {
      let arrayBuffer;
      
      if (typeof templateSource === 'string') {
        // Load from URL
        const response = await fetch(templateSource);
        arrayBuffer = await response.arrayBuffer();
      } else if (templateSource instanceof ArrayBuffer) {
        arrayBuffer = templateSource;
      } else {
        throw new Error('Invalid template source');
      }

      this.templatePDF = await this.pdfLib.PDFDocument.load(arrayBuffer);
    } catch (error) {
      console.error('[PDFProcessor] Error loading template:', error);
      throw error;
    }
  }

  /**
   * Build field name mapping from PDF form
   * Maps item numbers to actual PDF field names
   * @private
   * @param {PDFForm} form - PDF form object
   * @returns {Map} Field name mapping
   */
  buildFieldNameMapping(form) {
    const mapping = new Map();
    const allFields = form.getFields();
    
    // Common I-765 field name patterns
    const fieldPatterns = {
      // Part 1 - Reason for Applying
      '1.a.': ['1a', '1_a', 'reason_initial', 'initial', 'Part1_1a'],
      '1.b.': ['1b', '1_b', 'reason_replacement', 'replacement', 'Part1_1b'],
      '1.c.': ['1c', '1_c', 'reason_renewal', 'renewal', 'Part1_1c'],
      
      // Part 2 - Personal Information
      '1.a.': ['1a', '1_a', 'last_name', 'family_name', 'surname', 'Part2_1a'],
      '1.b.': ['1b', '1_b', 'first_name', 'given_name', 'Part2_1b'],
      '1.c.': ['1c', '1_c', 'middle_name', 'Part2_1c'],
      
      // Address fields
      '5.a.': ['5a', '5_a', 'mailing_in_care_of', 'in_care_of'],
      '5.b.': ['5b', '5_b', 'mailing_street', 'street_address'],
      '5.c.': ['5c', '5_c', 'mailing_apt', 'apt', 'suite', 'floor'],
      '5.d.': ['5d', '5_d', 'mailing_city', 'city'],
      '5.e.': ['5e', '5_e', 'mailing_state', 'state'],
      '5.f.': ['5f', '5_f', 'mailing_zip', 'zip_code', 'zipcode'],
      
      // Other common fields
      '8.': ['8', 'alien_number', 'a_number', 'a_number_8'],
      '9.': ['9', 'uscis_account_number', 'account_number'],
      '10.': ['10', 'sex', 'gender'],
      '11.': ['11', 'marital_status'],
      '12.': ['12', 'previously_filed_i765'],
      '13.a.': ['13a', '13_a', 'ssa_issued_card'],
      '13.b.': ['13b', '13_b', 'ssn_number', 'ssn'],
      '14.': ['14', 'want_ssa_card'],
      '15.': ['15', 'consent_for_disclosure'],
      '20.': ['20', 'date_of_birth', 'dob', 'birth_date'],
      '21.a.': ['21a', '21_a', 'i94_number', 'i94'],
      '27.': ['27', 'eligibility_category', 'category'],
    };

    // Try to match fields by name patterns
    for (const [itemNumber, patterns] of Object.entries(fieldPatterns)) {
      for (const field of allFields) {
        const fieldName = field.getName().toLowerCase();
        for (const pattern of patterns) {
          if (fieldName.includes(pattern.toLowerCase()) || 
              fieldName === pattern.toLowerCase() ||
              fieldName.replace(/[^a-zA-Z0-9]/g, '') === pattern.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()) {
            if (!mapping.has(itemNumber)) {
              mapping.set(itemNumber, field.getName());
              console.log(`[PDFProcessor] Mapped ${itemNumber} -> ${field.getName()}`);
            }
          }
        }
      }
    }

    return mapping;
  }

  /**
   * Fill PDF form with data
   * @param {object} formData - Form data mapped by field mapper
   * @param {object} options - Processing options
   * @returns {Promise<Uint8Array>} Filled PDF as Uint8Array
   */
  async fillForm(formData, options = {}) {
    if (!this.templatePDF) {
      throw new Error('PDF template not loaded');
    }

    const {
      flatten = false, // Flatten form fields
      editable = true,  // Keep form editable
      includeSignature = true
    } = options;

    try {
      // Clone the template
      const pdfDoc = await this.pdfLib.PDFDocument.load(await this.templatePDF.save());
      const form = pdfDoc.getForm();
      
      // Build field name mapping
      const fieldMapping = this.buildFieldNameMapping(form);

      // Get all form field names for debugging
      const allFieldNames = form.getFields().map(f => f.getName());
      console.log('[PDFProcessor] Available PDF form fields:', allFieldNames);
      console.log('[PDFProcessor] Form data to fill:', Object.keys(formData));
      console.log('[PDFProcessor] Field name mapping:', Array.from(fieldMapping.entries()));

      const filledFields = [];
      const failedFields = [];

      // Fill form fields
      for (const [fieldId, fieldData] of Object.entries(formData)) {
        if (!fieldData || !fieldData.pdfFieldName) {
          console.warn(`[PDFProcessor] Skipping field ${fieldId}: no pdfFieldName`);
          continue;
        }

        const pdfFieldName = fieldData.pdfFieldName;
        const value = fieldData.value;
        
        // Try to find the field using mapping first
        let actualFieldName = fieldMapping.get(pdfFieldName) || pdfFieldName;
        let fieldFound = false;

        // Try multiple field name variations
        const fieldNameVariations = [
          actualFieldName,
          pdfFieldName,
          pdfFieldName.replace(/\./g, '_'),
          pdfFieldName.replace(/\./g, ''),
          pdfFieldName.toLowerCase(),
          pdfFieldName.toUpperCase()
        ];

        for (const fieldName of fieldNameVariations) {
          if (fieldFound) break;

          try {
            // Try as text field
            try {
              const field = form.getTextField(fieldName);
              if (field) {
                field.setText(String(value || ''));
                filledFields.push({ fieldId, pdfFieldName: fieldName, type: 'text', value });
                fieldFound = true;
                console.log(`[PDFProcessor] ✓ Filled text field: ${fieldName} (original: ${pdfFieldName}) = ${value}`);
                break;
              }
            } catch (textError) {
              // Try as checkbox
              try {
                const checkbox = form.getCheckBox(fieldName);
                if (checkbox) {
                  if (value === true || value === 'X' || value === 'checked' || value === 'Yes' || value === 'initial' || value === 'replacement' || value === 'renewal') {
                    checkbox.check();
                  } else {
                    checkbox.uncheck();
                  }
                  filledFields.push({ fieldId, pdfFieldName: fieldName, type: 'checkbox', value });
                  fieldFound = true;
                  console.log(`[PDFProcessor] ✓ Filled checkbox: ${fieldName} (original: ${pdfFieldName}) = ${value}`);
                  break;
                }
              } catch (checkboxError) {
                // Continue to next variation
              }
            }
          } catch (error) {
            // Continue to next variation
          }
        }

        // If still not found, try fuzzy matching
        if (!fieldFound) {
          const similarField = allFieldNames.find(name => {
            const nameLower = name.toLowerCase();
            const pdfLower = pdfFieldName.toLowerCase();
            return nameLower.includes(pdfLower) ||
                   pdfLower.includes(nameLower) ||
                   nameLower.replace(/[^a-zA-Z0-9]/g, '') === pdfLower.replace(/[^a-zA-Z0-9]/g, '');
          });
          
          if (similarField) {
            try {
              const field = form.getTextField(similarField);
              if (field) {
                field.setText(String(value || ''));
                filledFields.push({ fieldId, pdfFieldName: similarField, type: 'text', value, matched: true });
                fieldFound = true;
                console.log(`[PDFProcessor] ✓ Filled text field (fuzzy matched): ${similarField} (original: ${pdfFieldName}) = ${value}`);
              }
            } catch (matchError) {
              try {
                const checkbox = form.getCheckBox(similarField);
                if (checkbox) {
                  if (value === true || value === 'X' || value === 'checked' || value === 'Yes') {
                    checkbox.check();
                  } else {
                    checkbox.uncheck();
                  }
                  filledFields.push({ fieldId, pdfFieldName: similarField, type: 'checkbox', value, matched: true });
                  fieldFound = true;
                  console.log(`[PDFProcessor] ✓ Filled checkbox (fuzzy matched): ${similarField} (original: ${pdfFieldName}) = ${value}`);
                }
              } catch (matchCheckboxError) {
                // Field not found
              }
            }
          }
        }

        if (!fieldFound) {
          failedFields.push({ fieldId, pdfFieldName, value });
          console.warn(`[PDFProcessor] ✗ Could not fill field: ${pdfFieldName} (fieldId: ${fieldId})`);
        }
      }

      console.log(`[PDFProcessor] Summary: ${filledFields.length} fields filled, ${failedFields.length} fields failed`);
      if (failedFields.length > 0) {
        console.warn('[PDFProcessor] Failed fields:', failedFields);
        console.warn('[PDFProcessor] Available PDF fields:', allFieldNames);
      }

      // Handle signature if provided
      if (includeSignature && formData.applicant_signature && formData.applicant_signature.value) {
        // Signature handling would go here
        // This requires additional implementation for signature images
      }

      // Flatten if requested
      if (flatten) {
        form.flatten();
      }

      // Save PDF
      const pdfBytes = await pdfDoc.save();
      return pdfBytes;
    } catch (error) {
      console.error('[PDFProcessor] Error filling form:', error);
      throw error;
    }
  }

  /**
   * Generate PDF from form data
   * @param {object} formData - Form data
   * @param {object} options - Options
   * @returns {Promise<Blob>} PDF Blob
   */
  async generatePDF(formData, options = {}) {
    const pdfBytes = await this.fillForm(formData, options);
    return new Blob([pdfBytes], { type: 'application/pdf' });
  }

  /**
   * Download PDF
   * @param {Blob|Uint8Array} pdfData - PDF data
   * @param {string} filename - Filename
   */
  downloadPDF(pdfData, filename = 'i765-form.pdf') {
    let blob;
    if (pdfData instanceof Blob) {
      blob = pdfData;
    } else if (pdfData instanceof Uint8Array) {
      blob = new Blob([pdfData], { type: 'application/pdf' });
    } else {
      throw new Error('Invalid PDF data type');
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Generate two versions of PDF (editable and flattened)
   * @param {object} formData - Form data
   * @returns {Promise<object>} Object with editable and flattened PDFs
   */
  async generateBothVersions(formData) {
    const editable = await this.generatePDF(formData, { flatten: false, editable: true });
    const flattened = await this.generatePDF(formData, { flatten: true, editable: false });

    return {
      editable,
      flattened
    };
  }

  /**
   * Create PDF from scratch (fallback if template not available)
   * @param {object} formData - Form data
   * @returns {Promise<Blob>} PDF Blob
   */
  async createPDFFromScratch(formData) {
    if (!this.pdfLib) {
      throw new Error('PDF library not available');
    }

    try {
      const pdfDoc = await this.pdfLib.PDFDocument.create();
      const page = pdfDoc.addPage([612, 792]); // US Letter size

      // Add form title
      const { width, height } = page.getSize();
      const fontSize = 16;
      
      page.drawText('Form I-765 - Application for Employment Authorization', {
        x: 50,
        y: height - 50,
        size: fontSize,
      });

      // Add form data
      let yPosition = height - 100;
      const lineHeight = 20;

      for (const [fieldId, fieldData] of Object.entries(formData)) {
        if (yPosition < 50) {
          // Add new page if needed
          const newPage = pdfDoc.addPage([612, 792]);
          yPosition = newPage.getSize().height - 50;
        }

        const label = fieldData.field?.field_label_en || fieldId;
        const value = String(fieldData.value || '');

        page.drawText(`${label}: ${value}`, {
          x: 50,
          y: yPosition,
          size: 12,
        });

        yPosition -= lineHeight;
      }

      const pdfBytes = await pdfDoc.save();
      return new Blob([pdfBytes], { type: 'application/pdf' });
    } catch (error) {
      console.error('[PDFProcessor] Error creating PDF from scratch:', error);
      throw error;
    }
  }

  /**
   * Validate PDF template
   * @returns {Promise<boolean>} True if template is valid
   */
  async validateTemplate() {
    if (!this.templatePDF) {
      return false;
    }

    try {
      const pages = this.templatePDF.getPages();
      return pages.length > 0;
    } catch (error) {
      console.error('[PDFProcessor] Template validation error:', error);
      return false;
    }
  }

  /**
   * Get form field names from template
   * @returns {Promise<string[]>} Array of field names
   */
  async getFormFieldNames() {
    if (!this.templatePDF) {
      throw new Error('PDF template not loaded');
    }

    try {
      const form = this.templatePDF.getForm();
      const fields = form.getFields();
      return fields.map(field => field.getName());
    } catch (error) {
      console.error('[PDFProcessor] Error getting field names:', error);
      return [];
    }
  }
}

// Export for use in different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PDFProcessor;
}

// Make available globally
if (typeof window !== 'undefined') {
  window.PDFProcessor = PDFProcessor;
}

