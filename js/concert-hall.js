/* ========================
   Concert Hall Initialization
   ======================== */

class ConcertHall {
    constructor() {
        this.svgContainer = document.getElementById('svg-container');
        this.svgElement = document.getElementById('concert-hall-svg');
        this.loader = document.getElementById('schema-loader');
        this.errorMessage = document.getElementById('error-message');
        this.retryBtn = document.getElementById('retry-btn');
        this.sectionFilter = document.getElementById('section-filter');
        
        this.sections = {
            parterre: {
                name: 'parterre',
                seats: 420,
                available: 420,
                price: '50,000 - 150,000 ₸',
                color: '#27AE60'
            },
            beletage: {
                name: 'beletage',
                seats: 280,
                available: 280,
                price: '40,000 - 120,000 ₸',
                color: '#E74C3C'
            },
            balkon: {
                name: 'balkon',
                seats: 220,
                available: 220,
                price: '30,000 - 100,000 ₸',
                color: '#3498DB'
            },
            galery: {
                name: 'galery',
                seats: 180,
                available: 180,
                price: '20,000 - 80,000 ₸',
                color: '#1ABC9C'
            }
        };
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadSVG();
        this.updateStatistics();
    }

    setupEventListeners() {
        if (this.retryBtn) {
            this.retryBtn.addEventListener('click', () => this.loadSVG());
        }
        
        if (this.sectionFilter) {
            this.sectionFilter.addEventListener('change', (e) => this.filterSections(e.target.value));
        }
    }

    async loadSVG() {
        const svgPath = './img/poly_concert_hall_schema.svg';
        const fallbackPath = './img/poly_concert_hall_schema.png';
        
        try {
            this.loader.style.display = 'flex';
            this.errorMessage.style.display = 'none';
            
            const response = await fetch(svgPath);
            if (!response.ok) throw new Error('SVG not found');
            
            const svgContent = await response.text();
            this.svgElement.innerHTML = svgContent;
            
            this.loader.style.display = 'none';
            this.setupSectionInteractions();
            
        } catch (error) {
            console.error('Error loading SVG:', error);
            this.loadFallback(fallbackPath);
        }
    }

    loadFallback(fallbackPath) {
        const img = document.createElement('img');
        img.src = fallbackPath;
        img.alt = 'Concert Hall Schema';
        img.class = 'concert-hall-svg';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        
        this.svgElement.replaceWith(img);
        this.loader.style.display = 'none';
        this.errorMessage.style.display = 'flex';
    }

    setupSectionInteractions() {
        document.querySelectorAll('[data-section]').forEach(element => {
            const sectionId = element.getAttribute('data-section');
            const section = this.sections[sectionId];
            
            if (section) {
                element.style.cursor = 'pointer';
                element.style.transition = 'opacity 0.3s ease';
                
                element.addEventListener('click', () => this.showSectionModal(sectionId));
                element.addEventListener('mouseover', () => {
                    element.style.opacity = '0.8';
                });
                element.addEventListener('mouseout', () => {
                    element.style.opacity = '1';
                });
                
                element.setAttribute('role', 'button');
                element.setAttribute('tabindex', '0');
                element.setAttribute('aria-label', `${this.t(sectionId)} section`);
                
                element.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.showSectionModal(sectionId);
                    }
                });
            }
        });
    }

    showSectionModal(sectionId) {
        const section = this.sections[sectionId];
        if (!section) return;
        
        const modal = document.getElementById('section-modal');
        const modalColor = document.getElementById('modal-color');
        const modalName = document.getElementById('modal-section-name');
        const modalLabel = document.getElementById('modal-section-label');
        const modalSeats = document.getElementById('modal-section-seats');
        const modalAvailable = document.getElementById('modal-available');
        const modalPrice = document.getElementById('modal-price');
        
        modalColor.style.backgroundColor = section.color;
        modalName.textContent = this.t(sectionId);
        modalLabel.textContent = this.t(sectionId);
        modalSeats.textContent = section.seats;
        modalAvailable.textContent = section.available;
        modalPrice.textContent = section.price;
        
        modal.classList.add('active');
        
        const closeBtn = document.getElementById('modal-close');
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
            }
        });
    }

    filterSections(sectionId) {
        document.querySelectorAll('[data-section]').forEach(element => {
            const elemSectionId = element.getAttribute('data-section');
            if (sectionId === '' || elemSectionId === sectionId) {
                element.style.opacity = '1';
                element.style.pointerEvents = 'auto';
            } else {
                element.style.opacity = '0.3';
                element.style.pointerEvents = 'none';
            }
        });
    }

    updateStatistics() {
        let totalSeats = 0;
        let totalAvailable = 0;
        
        Object.values(this.sections).forEach(section => {
            totalSeats += section.seats;
            totalAvailable += section.available;
        });
        
        const detailsPanel = document.getElementById('section-details');
        if (detailsPanel) {
            detailsPanel.innerHTML = `
                <div class="detail-card">
                    <div class="detail-label">${this.t('total_seats')}</div>
                    <div class="detail-value">${totalSeats}</div>
                </div>
                <div class="detail-card">
                    <div class="detail-label">${this.t('available')}</div>
                    <div class="detail-value">${totalAvailable}</div>
                </div>
                <div class="detail-card">
                    <div class="detail-label">Коэффициент занятости</div>
                    <div class="detail-value">${Math.round((totalAvailable / totalSeats) * 100)}%</div>
                </div>
            `;
        }
    }

    t(key) {
        return window.i18n.t(key) || key;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.concertHall = new ConcertHall();
});