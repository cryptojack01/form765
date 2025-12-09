/**
 * Data Models for I-765 Employment Authorization Document (EAD) Form
 * Contains ApplicantProfile class with personal information, immigration details,
 * eligibility information, and metadata
 */

class ApplicantProfile {
  constructor() {
    // Personal Information
    this.personalInfo = {
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '', // Format: YYYY-MM-DD
      gender: '', // M, F, Other
      citizenship: '',
      passport: {
        number: '',
        issuanceCountry: '',
        expirationDate: '' // Format: YYYY-MM-DD
      },
      contact: {
        email: '',
        phoneNumber: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        mailingAddress: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      }
    };

    // Immigration Details
    this.immigrationDetails = {
      uscisNumber: '', // A-Number
      i94Number: '',
      currentStatus: '', // e.g., F-1, H-1B, L-1, Asylee, etc.
      statusValidFrom: '', // Format: YYYY-MM-DD
      statusValidTo: '', // Format: YYYY-MM-DD
      entryDate: '', // Date of entry to US - Format: YYYY-MM-DD
      portOfEntry: '',
      visaType: '',
      i797NoticeNumber: '', // USCIS Receipt Number
      priorEAD: {
        hasObtainedBefore: false,
        previousEADNumber: '',
        previousExpirationDate: '' // Format: YYYY-MM-DD
      },
      greenCard: {
        hasGreenCard: false,
        cardNumber: '',
        expirationDate: '' // Format: YYYY-MM-DD
      },
      advancedParole: {
        hasAdvancedParole: false,
        documentNumber: '',
        expirationDate: '' // Format: YYYY-MM-DD
      },
      refugeeAsyleeStatus: {
        isRefugeeAoffer: false,
        dateOfGrant: '', // Format: YYYY-MM-DD
        isAsyleeGranted: false,
        dateAsylumGranted: '' // Format: YYYY-MM-DD
      }
    };

    // Eligibility Information
    this.eligibilityInfo = {
      category: '', // Category code (e.g., (c)(1)(ii), (c)(26), etc.)
      categoryDescription: '', // Human-readable category description
      basisForEligibility: {
        deferredActionForChildroodsArrivals: false,
        asylumAdjudication: false,
        refugeeStatus: false,
        specialImmigrantStatus: false,
        family: false,
        employment: false,
        other: false,
        otherDescription: ''
      },
      workAuthorization: {
        neverBeenGrantedEAD: false,
        previouslyDeniedEAD: false,
        previouslyRevokedEAD: false,
        invalidatingFactors: [] // List of factors that may invalidate eligibility
      },
      criminalBackground: {
        hasConverterion: false,
        convictionDetails: ''
      },
      applicationPurpose: '', // Reason for applying for work authorization
      requestedCategory: '', // Requested EAD category
      isEligible: null // null = not determined, true = eligible, false = not eligible
    };

    // Form Metadata
    this.metadata = {
      formVersion: '765 (I-765 Employment Authorization Document)',
      formVersionDate: '2025-12-09',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastModifiedBy: 'Miahelloworld',
      status: 'DRAFT', // DRAFT, SUBMITTED, APPROVED, DENIED, PENDING_REVIEW
      submissionDate: null,
      caseNumber: '', // USCIS case number once assigned
      applicationId: this._generateApplicationId(),
      notes: [],
      attachments: [],
      completionPercentage: 0
    };

    // Supporting Documents
    this.supportingDocuments = {
      passportCopy: null,
      birthCertificate: null,
      identificationDocuments: [],
      immigrationDocuments: [],
      previousEADDocuments: [],
      employmentDocuments: [],
      educationDocuments: [],
      asylumDocuments: [],
      otherDocuments: []
    };

    // Employment Information
    this.employmentInfo = {
      jobTitle: '',
      employerName: '',
      employerEIN: '',
      employerAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      startDate: '', // Format: YYYY-MM-DD
      expectedEndDate: '', // Format: YYYY-MM-DD
      positionType: '', // Full-time, Part-time, Temporary, etc.
      salaryRange: {
        minimum: 0,
        maximum: 0,
        currency: 'USD'
      }
    };

    // Payment Information
    this.paymentInfo = {
      filingFee: 0,
      biometricFee: 0,
      totalFee: 0,
      paymentMethod: '', // CARD, CHECK, MONEY_ORDER, DRAFT
      paymentDate: null,
      receiptNumber: '',
      isPaid: false
    };
  }

  /**
   * Generate a unique application ID
   * @private
   * @returns {string} Unique application ID
   */
  _generateApplicationId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `APP-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Validate personal information completeness
   * @returns {object} Validation result with isValid flag and errors array
   */
  validatePersonalInfo() {
    const errors = [];
    const info = this.personalInfo;

    if (!info.firstName) errors.push('First name is required');
    if (!info.lastName) errors.push('Last name is required');
    if (!info.dateOfBirth) errors.push('Date of birth is required');
    if (!info.gender) errors.push('Gender is required');
    if (!info.contact.email) errors.push('Email address is required');
    if (!info.contact.phoneNumber) errors.push('Phone number is required');
    if (!info.contact.address.street) errors.push('Street address is required');
    if (!info.contact.address.city) errors.push('City is required');
    if (!info.contact.address.state) errors.push('State is required');
    if (!info.contact.address.zipCode) errors.push('Zip code is required');

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Validate immigration details completeness
   * @returns {object} Validation result with isValid flag and errors array
   */
  validateImmigrationDetails() {
    const errors = [];
    const details = this.immigrationDetails;

    if (!details.uscisNumber) errors.push('USCIS A-Number is required');
    if (!details.currentStatus) errors.push('Current immigration status is required');
    if (!details.statusValidFrom) errors.push('Status valid from date is required');
    if (!details.statusValidTo) errors.push('Status valid to date is required');
    if (!details.entryDate) errors.push('Entry date to US is required');

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Validate eligibility information
   * @returns {object} Validation result with isValid flag and errors array
   */
  validateEligibility() {
    const errors = [];
    const eligibility = this.eligibilityInfo;

    if (!eligibility.category) errors.push('EAD category is required');
    if (!eligibility.applicationPurpose) errors.push('Application purpose is required');

    if (eligibility.previouslyDeniedEAD || eligibility.previouslyRevokedEAD) {
      errors.push('Applicants with previous denials or revocations may have eligibility issues');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Validate all sections
   * @returns {object} Comprehensive validation result
   */
  validateAll() {
    const personalValidation = this.validatePersonalInfo();
    const immigrationValidation = this.validateImmigrationDetails();
    const eligibilityValidation = this.validateEligibility();

    const allErrors = [
      ...personalValidation.errors,
      ...immigrationValidation.errors,
      ...eligibilityValidation.errors
    ];

    return {
      isValid: allErrors.length === 0,
      sections: {
        personalInfo: personalValidation,
        immigrationDetails: immigrationValidation,
        eligibility: eligibilityValidation
      },
      totalErrors: allErrors.length,
      allErrors: allErrors
    };
  }

  /**
   * Calculate form completion percentage
   * @returns {number} Percentage of form completion (0-100)
   */
  calculateCompletionPercentage() {
    const sections = {
      personalInfo: this._calculateSectionCompletion(this.personalInfo),
      immigrationDetails: this._calculateSectionCompletion(this.immigrationDetails),
      eligibilityInfo: this._calculateSectionCompletion(this.eligibilityInfo),
      employmentInfo: this._calculateSectionCompletion(this.employmentInfo),
      paymentInfo: this._calculateSectionCompletion(this.paymentInfo)
    };

    const totalCompletion = Object.values(sections).reduce((a, b) => a + b, 0);
    const percentage = Math.round((totalCompletion / Object.keys(sections).length) * 100);

    this.metadata.completionPercentage = percentage;
    return percentage;
  }

  /**
   * Calculate section completion percentage
   * @private
   * @param {object} section - Section object to analyze
   * @returns {number} Percentage of completion (0-100)
   */
  _calculateSectionCompletion(section) {
    if (!section || typeof section !== 'object') return 0;

    const fields = this._flattenObject(section);
    const totalFields = Object.keys(fields).length;

    if (totalFields === 0) return 0;

    const filledFields = Object.values(fields).filter(val => 
      val !== '' && val !== null && val !== undefined && val !== false
    ).length;

    return (filledFields / totalFields) * 100;
  }

  /**
   * Flatten nested objects for field counting
   * @private
   * @param {object} obj - Object to flatten
   * @returns {object} Flattened object
   */
  _flattenObject(obj, prefix = '') {
    let flattened = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
          flattened = { ...flattened, ...this._flattenObject(value, newKey) };
        } else {
          flattened[newKey] = value;
        }
      }
    }

    return flattened;
  }

  /**
   * Export profile data as JSON
   * @returns {object} Complete profile data
   */
  toJSON() {
    return {
      personalInfo: this.personalInfo,
      immigrationDetails: this.immigrationDetails,
      eligibilityInfo: this.eligibilityInfo,
      employmentInfo: this.employmentInfo,
      paymentInfo: this.paymentInfo,
      supportingDocuments: this.supportingDocuments,
      metadata: this.metadata
    };
  }

  /**
   * Import profile data from JSON
   * @param {object} data - Profile data to import
   */
  fromJSON(data) {
    if (data.personalInfo) this.personalInfo = { ...this.personalInfo, ...data.personalInfo };
    if (data.immigrationDetails) this.immigrationDetails = { ...this.immigrationDetails, ...data.immigrationDetails };
    if (data.eligibilityInfo) this.eligibilityInfo = { ...this.eligibilityInfo, ...data.eligibilityInfo };
    if (data.employmentInfo) this.employmentInfo = { ...this.employmentInfo, ...data.employmentInfo };
    if (data.paymentInfo) this.paymentInfo = { ...this.paymentInfo, ...data.paymentInfo };
    if (data.supportingDocuments) this.supportingDocuments = { ...this.supportingDocuments, ...data.supportingDocuments };
    if (data.metadata) this.metadata = { ...this.metadata, ...data.metadata };

    this.metadata.updatedAt = new Date().toISOString();
  }

  /**
   * Add a note to the application
   * @param {string} note - Note text to add
   */
  addNote(note) {
    this.metadata.notes.push({
      text: note,
      timestamp: new Date().toISOString(),
      author: 'Miahelloworld'
    });
  }

  /**
   * Reset form to initial state
   */
  reset() {
    const newInstance = new ApplicantProfile();
    Object.assign(this, newInstance);
  }
}

// Export for use in Node.js/CommonJS environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ApplicantProfile;
}
