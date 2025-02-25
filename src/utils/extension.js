/**
 * Utility functions for extension detection and communication
 */
import { detectBrowser } from './browserDetection';

/**
 * Checks if the Chess Analyzer extension is installed
 * @returns {Promise<Object>} Object with installed status and browser info
 */
export function checkExtensionInstalled() {
    return new Promise((resolve) => {
        const browser = detectBrowser();

        // Method 1: Try Chrome/Firefox/Edge extension API
        if ((browser === "chrome" || browser === "edge" || browser === "firefox") &&
            typeof window !== 'undefined' &&
            window.chrome &&
            window.chrome.runtime) {
            try {
                // Replace with your actual extension ID when published
                const extensionId = "your_extension_id_here";
                window.chrome.runtime.sendMessage(extensionId, {message: "is_extension_installed"},
                    function(response) {
                        if (response && response.installed) {
                            resolve({installed: true, version: response.version, browser});
                        }
                        // If no response, fall through to the next method
                    }
                );
            } catch (e) {
                // Chrome API not available, continue to next method
                console.log('Chrome extension API not available:', e);
            }
        }

        // Method 2: Look for a global variable
        if (typeof window !== 'undefined' && window.EvalBarExtension) {
            resolve({installed: true, version: window.EvalBarExtension.version, browser});
            return;
        }

        // Method 3: Try to detect using a custom protocol
        if (typeof document !== 'undefined') {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            // Set a timeout for fallback
            const timeoutId = setTimeout(() => {
                iframe.remove();
                resolve({installed: false, browser});
            }, 500);

            // Try to use custom protocol
            iframe.onload = () => {
                clearTimeout(timeoutId);
                iframe.remove();
                resolve({installed: true, browser});
            };

            iframe.onerror = () => {
                clearTimeout(timeoutId);
                iframe.remove();
                resolve({installed: false, browser});
            };

            // Try to open with your custom protocol
            iframe.src = 'evalbar-extension://version';
        } else {
            // If document is not available (e.g., server-side rendering)
            resolve({installed: false, browser});
        }

        // Set a fallback timeout in case all detection methods fail
        setTimeout(() => {
            resolve({installed: false, browser});
        }, 1000);
    });
}