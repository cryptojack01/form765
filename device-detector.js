/**
 * Device Detector - Automatic PC/Mobile Device Detection and Routing
 * 
 * This module provides automatic detection of user device type (PC/Mobile/Tablet)
 * and routes to appropriate views/layouts based on device capabilities.
 * 
 * Features:
 * - Detects device type (Mobile, Tablet, Desktop)
 * - Handles orientation changes
 * - Provides responsive routing
 * - Caches detection results
 * - Includes touch capability detection
 */

class DeviceDetector {
  constructor() {
    this.deviceType = null;
    this.orientation = null;
    this.isTouchDevice = false;
    this.userAgent = navigator.userAgent;
    this.isInitialized = false;
    this.listeners = [];
    this.cache = {
      deviceType: null,
      orientation: null
    };
    
    // Initialize detection
    this.init();
  }

  /**
   * Initialize device detection
   */
  init() {
    this.detectDevice();
    this.detectOrientation();
    this.detectTouchCapability();
    this.setupEventListeners();
    this.isInitialized = true;
    console.log('[DeviceDetector] Initialized - Device Type:', this.deviceType);
  }

  /**
   * Detect device type based on user agent and screen size
   * @returns {string} 'mobile', 'tablet', or 'desktop'
   */
  detectDevice() {
    const ua = this.userAgent.toLowerCase();
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const pixelRatio = window.devicePixelRatio || 1;

    // User agent checks
    const isMobileUA = /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua);
    const isTabletUA = /ipad|android|kindle|playbook|silk|nexus 7|nexus 10/i.test(ua);
    const isWindowsPhone = /windows phone|zune/i.test(ua);

    // Screen size checks
    const screenDiagonal = Math.sqrt(screenWidth ** 2 + screenHeight ** 2) / pixelRatio;
    const minDimension = Math.min(screenWidth, screenHeight);
    const maxDimension = Math.max(screenWidth, screenHeight);

    // Device detection logic
    if (isWindowsPhone || (isMobileUA && !isTabletUA && minDimension < 768)) {
      this.deviceType = 'mobile';
    } else if (isTabletUA || (minDimension >= 600 && minDimension < 1024 && screenDiagonal > 6)) {
      this.deviceType = 'tablet';
    } else if (minDimension >= 1024) {
      this.deviceType = 'desktop';
    } else if (isMobileUA) {
      this.deviceType = 'mobile';
    } else {
      this.deviceType = 'desktop';
    }

    this.cache.deviceType = this.deviceType;
    return this.deviceType;
  }

  /**
   * Detect current orientation
   * @returns {string} 'portrait' or 'landscape'
   */
  detectOrientation() {
    if (window.innerHeight > window.innerWidth) {
      this.orientation = 'portrait';
    } else {
      this.orientation = 'landscape';
    }
    this.cache.orientation = this.orientation;
    return this.orientation;
  }

  /**
   * Detect touch capability
   * @returns {boolean} true if device supports touch
   */
  detectTouchCapability() {
    this.isTouchDevice = () => {
      return (
        ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0)
      );
    };
    return this.isTouchDevice();
  }

  /**
   * Setup event listeners for orientation and resize changes
   */
  setupEventListeners() {
    // Handle orientation change
    window.addEventListener('orientationchange', () => {
      const previousOrientation = this.orientation;
      this.detectOrientation();
      if (previousOrientation !== this.orientation) {
        this.notifyListeners('orientationchange', {
          orientation: this.orientation,
          deviceType: this.deviceType
        });
      }
    }, false);

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const previousDeviceType = this.deviceType;
        this.detectDevice();
        this.detectOrientation();
        
        if (previousDeviceType !== this.deviceType) {
          this.notifyListeners('devicechange', {
            deviceType: this.deviceType,
            orientation: this.orientation
          });
        } else {
          this.notifyListeners('orientationchange', {
            orientation: this.orientation,
            deviceType: this.deviceType
          });
        }
      }, 250);
    }, false);
  }

  /**
   * Register a listener for device changes
   * @param {Function} callback - Function to call when device changes
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  /**
   * Notify all listeners of changes
   * @param {string} eventType - Type of event
   * @param {Object} data - Event data
   */
  notifyListeners(eventType, data) {
    this.listeners.forEach(callback => {
      try {
        callback({ type: eventType, ...data });
      } catch (error) {
        console.error('[DeviceDetector] Listener error:', error);
      }
    });
  }

  /**
   * Route to appropriate view based on device type
   * @param {Object} routes - Routes configuration object
   * @returns {string|null} Route path or null
   */
  route(routes) {
    if (!routes || typeof routes !== 'object') {
      console.error('[DeviceDetector] Invalid routes configuration');
      return null;
    }

    const route = routes[this.deviceType];
    if (!route) {
      console.warn(`[DeviceDetector] No route defined for device type: ${this.deviceType}`);
      return null;
    }

    console.log(`[DeviceDetector] Routing to ${this.deviceType} route:`, route);
    return route;
  }

  /**
   * Navigate based on device type
   * @param {Object} routes - Routes configuration
   * @param {boolean} shouldReplace - Whether to replace history (default: false)
   * @returns {void}
   */
  navigate(routes, shouldReplace = false) {
    const route = this.route(routes);
    if (route) {
      if (shouldReplace) {
        window.location.replace(route);
      } else {
        window.location.href = route;
      }
    }
  }

  /**
   * Conditionally execute function based on device type
   * @param {Object} callbacks - Object with device type keys and callback functions
   * @returns {*} Result of executed callback
   */
  executeForDevice(callbacks) {
    if (!callbacks || typeof callbacks !== 'object') {
      console.error('[DeviceDetector] Invalid callbacks configuration');
      return null;
    }

    const callback = callbacks[this.deviceType];
    if (typeof callback === 'function') {
      return callback();
    }

    console.warn(`[DeviceDetector] No callback defined for device type: ${this.deviceType}`);
    return null;
  }

  /**
   * Get device information object
   * @returns {Object} Complete device information
   */
  getDeviceInfo() {
    return {
      type: this.deviceType,
      orientation: this.orientation,
      isTouchDevice: this.isTouchDevice(),
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      userAgent: this.userAgent,
      isMobile: this.deviceType === 'mobile',
      isTablet: this.deviceType === 'tablet',
      isDesktop: this.deviceType === 'desktop',
      pixelRatio: window.devicePixelRatio || 1
    };
  }

  /**
   * Check if device is mobile
   * @returns {boolean}
   */
  isMobile() {
    return this.deviceType === 'mobile';
  }

  /**
   * Check if device is tablet
   * @returns {boolean}
   */
  isTablet() {
    return this.deviceType === 'tablet';
  }

  /**
   * Check if device is desktop
   * @returns {boolean}
   */
  isDesktop() {
    return this.deviceType === 'desktop';
  }

  /**
   * Check if device is in portrait orientation
   * @returns {boolean}
   */
  isPortrait() {
    return this.orientation === 'portrait';
  }

  /**
   * Check if device is in landscape orientation
   * @returns {boolean}
   */
  isLandscape() {
    return this.orientation === 'landscape';
  }

  /**
   * Get viewport information
   * @returns {Object} Viewport dimensions and properties
   */
  getViewport() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight
    };
  }

  /**
   * Destroy detector and cleanup
   */
  destroy() {
    this.listeners = [];
    this.isInitialized = false;
    console.log('[DeviceDetector] Destroyed');
  }
}

// Create singleton instance
const deviceDetector = new DeviceDetector();

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = deviceDetector;
  module.exports.DeviceDetector = DeviceDetector;
}

// Make available globally
if (typeof window !== 'undefined') {
  window.deviceDetector = deviceDetector;
  window.DeviceDetector = DeviceDetector;
}
