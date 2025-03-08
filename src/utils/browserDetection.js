/**
 * Utility functions for browser detection and extension store URLs
 */

/**
 * Detects the current browser type
 * @returns {string} Browser type: "chrome", "firefox", "safari", "edge", "opera", or "other"
 */
export function detectBrowser() {
    const userAgent = navigator.userAgent;

    // Safari detection
    if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
        return 'safari';
    }
    // Firefox detection
    else if (/Firefox/i.test(userAgent)) {
        return 'firefox';
    }
    // Edge detection
    else if (/Edg/i.test(userAgent)) {
        return 'edge';
    }
    // Opera detection
    else if (/OPR/i.test(userAgent)) {
        return 'opera';
    }
    // Chrome detection
    else if (/Chrome/i.test(userAgent)) {
        return 'chrome';
    }
    // Other browsers
    else {
        return 'other';
    }
}

/**
 * Gets the appropriate extension store URL for the detected browser
 * @param {string} browser - Browser type from detectBrowser()
 * @returns {string} URL to the extension in the appropriate store
 */
export function getExtensionStoreUrl(browser) {
    // These URLs need to be updated with your actual extension IDs when published
    switch (browser) {
        case 'chrome':
        case 'opera':
        case 'edge':
            return 'https://chrome.google.com/webstore/detail/your-extension-id';
        case 'firefox':
            return 'https://addons.mozilla.org/firefox/addon/your-extension-id';
        case 'safari':
            return 'https://apps.apple.com/app/your-extension-id';
        default:
            return '#';
    }
}
