/* ========================
   Interactive Features
   ======================== */

class InteractiveFeatures {
    constructor() {
        this.displayModes = document.querySelectorAll('.display-mode');
        this.currentMode = 'normal';
        this.init();
    }

    init() {
        this.setupDisplayModes();
        this.setupTouchOptimization();
    }

    setupDisplayModes() {
        this.displayModes.forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.getAttribute('data-mode');
                this.setDisplayMode(mode);
            });
        });
    }

    setDisplayMode(mode) {
        this.currentMode = mode;
        document.documentElement.setAttribute('data-display-mode', mode);
        localStorage.setItem('concert-hall-display-mode', mode);
        
        this.displayModes.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-mode') === mode) {
                btn.classList.add('active');
            }
        });
    }

    setupTouchOptimization() {
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
        }
    }

    loadDisplayMode() {
        const saved = localStorage.getItem('concert-hall-display-mode') || 'normal';
        this.setDisplayMode(saved);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.interactiveFeatures = new InteractiveFeatures();
    window.interactiveFeatures.loadDisplayMode();
});