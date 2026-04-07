/* ========================
   WCAG Accessibility
   ======================== */

class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
        this.setupFocusManagement();
        this.setupMotionPreferences();
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Tab navigation - already handled by browser
            // Enter - handled by individual elements
            // Escape - closes modals
            if (e.key === 'Escape') {
                const modal = document.getElementById('section-modal');
                if (modal && modal.classList.contains('active')) {
                    modal.classList.remove('active');
                    e.preventDefault();
                }
            }
        });
    }

    setupScreenReaderSupport() {
        // Add ARIA live regions
        const loader = document.getElementById('schema-loader');
        if (loader) {
            loader.setAttribute('role', 'status');
            loader.setAttribute('aria-live', 'polite');
        }

        const errorMessage = document.getElementById('error-message');
        if (errorMessage) {
            errorMessage.setAttribute('role', 'alert');
            errorMessage.setAttribute('aria-live', 'assertive');
        }

        // Add ARIA labels to interactive elements
        this.updateAriaLabels();
    }

    updateAriaLabels() {
        const langBtns = document.querySelectorAll('.lang-btn');
        langBtns.forEach(btn => {
            const lang = btn.getAttribute('data-lang');
            btn.setAttribute('aria-label', `Select ${lang} language`);
        });

        const zoomBtns = {
            'zoom-in': 'Increase zoom level',
            'zoom-out': 'Decrease zoom level',
            'zoom-reset': 'Reset zoom to 100%'
        };

        Object.entries(zoomBtns).forEach(([id, label]) => {
            const btn = document.getElementById(id);
            if (btn) btn.setAttribute('aria-label', label);
        });
    }

    setupFocusManagement() {
        // Ensure focus is visible
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-focus-visible');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-focus-visible');
        });

        // Trap focus in modal when open
        const modal = document.getElementById('section-modal');
        if (modal) {
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Tab' && modal.classList.contains('active')) {
                    this.trapFocus(e, modal);
                }
            });
        }
    }

    trapFocus(e, element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }

    setupMotionPreferences() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
            document.documentElement.style.setProperty('--animation-iteration-count', '1');
        }

        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            if (e.matches) {
                document.documentElement.style.setProperty('--animation-duration', '0.01ms');
            } else {
                document.documentElement.style.removeProperty('--animation-duration');
            }
        });
    }
}

// High Contrast Support
class HighContrastMode {
    static enable() {
        document.documentElement.classList.add('high-contrast');
        localStorage.setItem('concert-hall-contrast', 'high');
    }

    static disable() {
        document.documentElement.classList.remove('high-contrast');
        localStorage.setItem('concert-hall-contrast', 'normal');
    }

    static load() {
        const saved = localStorage.getItem('concert-hall-contrast');
        if (saved === 'high') {
            this.enable();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.accessibility = new AccessibilityManager();
    HighContrastMode.load();
});