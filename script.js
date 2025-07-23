'use strict';

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize skill bars animation
document.addEventListener('DOMContentLoaded', () => {
    const skillBars = document.querySelectorAll('.exp-bar-fill');
    const expSection = document.getElementById('experience');
    
    if (!expSection || !skillBars.length) {
        console.warn('Experience section or skill bars not found');
        return;
    }

    // Initialize bars with 0 width
    skillBars.forEach(bar => {
        bar.style.width = '0';
        bar.style.transition = 'none';
    });

    // Use Intersection Observer for better performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate skill bars
                requestAnimationFrame(() => {
                    skillBars.forEach(bar => {
                        bar.style.transition = 'width 1s ease-out';
                        const progress = bar.getAttribute('data-progress');
                        if (progress) {
                            bar.style.width = `${progress}%`;
                        }
                    });
                });
                
                // Disconnect observer after animation
                observer.disconnect();
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });

    observer.observe(expSection);
});
// Menu functionality
class MobileMenu {
    constructor() {
        this.menu = document.querySelector('.menu-links');
        this.icon = document.querySelector('.hamburger-icon');
        this.isOpen = false;

        // Bind methods
        this.toggle = this.toggle.bind(this);
        this.handleKeyboard = this.handleKeyboard.bind(this);
        
        // Add keyboard support
        this.icon?.addEventListener('keydown', this.handleKeyboard);
    }

    toggle() {
        if (!this.menu || !this.icon) return;
        
        this.isOpen = !this.isOpen;
        this.menu.classList.toggle('open', this.isOpen);
        this.icon.classList.toggle('open', this.isOpen);
        
        // Accessibility
        this.icon.setAttribute('aria-expanded', String(this.isOpen));
    }

    handleKeyboard(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.toggle();
        }
        if (event.key === 'Escape' && this.isOpen) {
            this.toggle();
        }
    }
}

// Back to top functionality
class BackToTop {
    constructor() {
        this.button = document.getElementById('back-to-top');
        if (!this.button) return;

        // Bind methods
        this.handleScroll = debounce(this.handleScroll.bind(this), 100);
        this.scrollToTop = this.scrollToTop.bind(this);

        // Initialize
        this.init();
    }

    init() {
        window.addEventListener('scroll', this.handleScroll, { passive: true });
        this.button.addEventListener('click', this.scrollToTop);
    }

    handleScroll() {
        const shouldShow = window.scrollY > 100;
        this.button.classList.toggle('visible', shouldShow);
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Initialize components
const mobileMenu = new MobileMenu();
const backToTop = new BackToTop();

// Export toggle function for HTML onclick
window.toggleMenu = mobileMenu.toggle.bind(mobileMenu);
