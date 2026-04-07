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
        
        // Mouse wheel zoom
        if (this.svgContainer) {
            this.svgContainer.addEventListener('wheel', (e) => this.handleMouseWheelZoom(e));
        }
        
        // Touch pinch zoom
        this.setupTouchZoom();
        
        // Keyboard shortcuts
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
        // Only zoom if Ctrl is pressed (Ctrl+scroll)
        if (!event.ctrlKey && !event.metaKey) return;
        
        event.preventDefault();
        
        if (event.deltaY > 0) {
            this.zoomOut();
        } else {
            this.zoomIn();
        }
    }

    handleKeyboardZoom(event) {
        // Ctrl/Cmd + Plus/Equals
        if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '=')) {
            event.preventDefault();
            this.zoomIn();
        }
        // Ctrl/Cmd + Minus
        else if ((event.ctrlKey || event.metaKey) && event.key === '-') {
            event.preventDefault();
            this.zoomOut();
        }
        // Ctrl/Cmd + 0
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

    fitToScreen() {
        const svg = this.svgContainer?.querySelector('svg, img');
        if (!svg) return;
        
        const containerWidth = this.svgContainer.clientWidth;
        const containerHeight = this.svgContainer.clientHeight;
        const svgWidth = svg.naturalWidth || svg.viewBox.baseVal.width;
        const svgHeight = svg.naturalHeight || svg.viewBox.baseVal.height;
        
        const scaleX = (containerWidth / svgWidth) * 100;
        const scaleY = (containerHeight / svgHeight) * 100;
        
        this.currentZoom = Math.min(scaleX, scaleY);
        this.applyZoom();
    }
}

// Auto-fit on window resize
function setupAutoFit() {
    const zoomController = window.zoomController;
    if (!zoomController) return;

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Don't auto-fit if manually zoomed
            if (Math.abs(zoomController.currentZoom - 100) < 5) {
                // zoomController.fitToScreen();
            }
        }, 250);
    });
}

// Smooth scroll for zoom container
function enableSmoothScroll() {
    const svgContainer = document.getElementById('svg-container');
    if (!svgContainer) return;

    let isDown = false;
    let startX;
    let startY;
    let scrollLeft;
    let scrollTop;

    svgContainer.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // Only left click
        isDown = true;
        svgContainer.style.cursor = 'grabbing';
        startX = e.pageX - svgContainer.offsetLeft;
        startY = e.pageY - svgContainer.offsetTop;
        scrollLeft = svgContainer.scrollLeft;
        scrollTop = svgContainer.scrollTop;
    });

    document.addEventListener('mouseleave', () => {
        isDown = false;
        svgContainer.style.cursor = 'grab';
    });

    document.addEventListener('mouseup', () => {
        isDown = false;
        svgContainer.style.cursor = 'grab';
    });

    svgContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        
        const x = e.pageX - svgContainer.offsetLeft;
        const y = e.pageY - svgContainer.offsetTop;
        const walkX = (x - startX) * 1; // 1 = scroll-fast
        const walkY = (y - startY) * 1;
        
        svgContainer.scrollLeft = scrollLeft - walkX;
        svgContainer.scrollTop = scrollTop - walkY;
    });

    // Touch dragging
    svgContainer.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDown = true;
            startX = e.touches[0].pageX - svgContainer.offsetLeft;
            startY = e.touches[0].pageY - svgContainer.offsetTop;
            scrollLeft = svgContainer.scrollLeft;
            scrollTop = svgContainer.scrollTop;
        }
    });

    svgContainer.addEventListener('touchmove', (e) => {
        if (!isDown || e.touches.length !== 1) return;
        
        const x = e.touches[0].pageX - svgContainer.offsetLeft;
        const y = e.touches[0].pageY - svgContainer.offsetTop;
        const walkX = (x - startX);
        const walkY = (y - startY);
        
        svgContainer.scrollLeft = scrollLeft - walkX;
        svgContainer.scrollTop = scrollTop - walkY;
    });

    svgContainer.addEventListener('touchend', () => {
        isDown = false;
    });
}

// Initialize zoom controller on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.zoomController = new ZoomController();
    window.zoomController.loadZoomLevel();
    
    setupAutoFit();
    enableSmoothScroll();
});

// Export for external use
window.ZoomController = ZoomController;