/* ========================
   Zoom Functionality
   ======================== */

class ZoomController {
    constructor() {
        this.svgContainer = document.getElementById('svg-container');
        this.zoomLevel = document.getElementById('zoom-level');
        this.zoomInBtn = document.getElementById('zoom-in');
        this.zoomOutBtn = document.getElementById('zoom-out');
        this.zoomResetBtn = document.getElementById('zoom-reset');
        
        this.currentZoom = 100;
        this.minZoom = 50;
        this.maxZoom = 500;
        this.zoomStep = 10;
        
        this.init();
    }

    init() {
        if (this.zoomInBtn) this.zoomInBtn.addEventListener('click', () => this.zoomIn());
        if (this.zoomOutBtn) this.zoomOutBtn.addEventListener('click', () => this.zoomOut());
        if (this.zoomResetBtn) this.zoomResetBtn.addEventListener('click', () => this.resetZoom());
        
        if (this.svgContainer) {
            this.svgContainer.addEventListener('wheel', (e) => this.handleMouseWheelZoom(e));
        }
        
        this.setupTouchZoom();
        document.addEventListener('keydown', (e) => this.handleKeyboardZoom(e));
        
        this.updateZoomDisplay();
    }

    zoomIn() {
        if (this.currentZoom < this.maxZoom) {
            this.currentZoom = Math.min(this.currentZoom + this.zoomStep, this.maxZoom);
            this.applyZoom();
        }
    }

    zoomOut() {
        if (this.currentZoom > this.minZoom) {
            this.currentZoom = Math.max(this.currentZoom - this.zoomStep, this.minZoom);
            this.applyZoom();
        }
    }

    resetZoom() {
        this.currentZoom = 100;
        this.applyZoom();
    }

    applyZoom() {
        if (!this.svgContainer) return;
        
        const svg = this.svgContainer.querySelector('svg, img');
        if (svg) {
            const scale = this.currentZoom / 100;
            svg.style.transform = `scale(${scale})`;
            svg.style.transformOrigin = 'center top';
            svg.style.transition = 'transform 0.2s ease';
        }
        
        this.updateZoomDisplay();
        this.saveZoomLevel();
    }

    updateZoomDisplay() {
        if (this.zoomLevel) {
            this.zoomLevel.textContent = `${this.currentZoom}%`;
        }
    }

    handleMouseWheelZoom(event) {
        if (!event.ctrlKey && !event.metaKey) return;
        
        event.preventDefault();
        
        if (event.deltaY > 0) {
            this.zoomOut();
        } else {
            this.zoomIn();
        }
    }

    handleKeyboardZoom(event) {
        if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '=')) {
            event.preventDefault();
            this.zoomIn();
        }
        else if ((event.ctrlKey || event.metaKey) && event.key === '-') {
            event.preventDefault();
            this.zoomOut();
        }
        else if ((event.ctrlKey || event.metaKey) && event.key === '0') {
            event.preventDefault();
            this.resetZoom();
        }
    }

    setupTouchZoom() {
        if (!this.svgContainer) return;
        
        let lastDistance = 0;

        this.svgContainer.addEventListener('touchmove', (event) => {
            if (event.touches.length === 2) {
                event.preventDefault();
                
                const touch1 = event.touches[0];
                const touch2 = event.touches[1];
                
                const distance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );
                
                if (lastDistance > 0) {
                    const delta = distance - lastDistance;
                    if (delta > 5) {
                        this.zoomIn();
                    } else if (delta < -5) {
                        this.zoomOut();
                    }
                }
                
                lastDistance = distance;
            }
        });

        this.svgContainer.addEventListener('touchend', () => {
            lastDistance = 0;
        });
    }

    saveZoomLevel() {
        try {
            localStorage.setItem('concert-hall-zoom', this.currentZoom);
        } catch (e) {
            console.warn('Could not save zoom level:', e);
        }
    }

    loadZoomLevel() {
        try {
            const saved = localStorage.getItem('concert-hall-zoom');
            if (saved) {
                this.currentZoom = parseInt(saved, 10);
                this.applyZoom();
            }
        } catch (e) {
            console.warn('Could not load zoom level:', e);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.zoomController = new ZoomController();
    window.zoomController.loadZoomLevel();
});

window.ZoomController = ZoomController;