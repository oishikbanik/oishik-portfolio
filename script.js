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

// Animate skill bars using IntersectionObserver
function animateSkillBars(sectionSelector) {
    const section = document.querySelector(sectionSelector);
    if (!section) return;

    const bars = section.querySelectorAll('.exp-bar-fill');
    if (!bars.length) {
        console.warn('Skill bars not found');
        return;
    }

    bars.forEach(bar => {
        bar.style.width = '0';
        bar.style.transition = 'none';
    });

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                bars.forEach(bar => {
                    const progress = bar.getAttribute('data-progress');
                    if (progress) {
                        bar.style.transition = 'width 1s ease-out';
                        bar.style.width = `${progress}%`;
                    }
                });
                obs.disconnect();
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });

    observer.observe(section);
}

// Mobile menu functionality
class MobileMenu {
    constructor(toggleBtnSelector, menuSelector) {
        this.icon = document.querySelector(toggleBtnSelector);
        this.menu = document.querySelector(menuSelector);
        this.isOpen = false;

        if (this.icon && this.menu) {
            this.icon.addEventListener('keydown', this.handleKeyboard.bind(this));
        }
    }

    toggle() {
        if (!this.icon || !this.menu) return;

        this.isOpen = !this.isOpen;
        this.icon.classList.toggle('open', this.isOpen);
        this.menu.classList.toggle('open', this.isOpen);
        this.icon.setAttribute('aria-expanded', String(this.isOpen));
    }

    handleKeyboard(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.toggle();
        } else if (event.key === 'Escape' && this.isOpen) {
            this.toggle();
        }
    }
}

// Back to top functionality
class BackToTop {
    constructor(buttonId) {
        this.button = document.getElementById(buttonId);
        if (!this.button) return;

        this.handleScroll = debounce(this.handleScroll.bind(this), 100);
        this.scrollToTop = this.scrollToTop.bind(this);

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

// Reading progress functionality
class ReadingProgress {
    constructor(progressSelector) {
        this.progressBar = document.querySelector(progressSelector);
        if (!this.progressBar) return;

        this.current = 0;     // current displayed width
        this.target = 0;      // target width based on scroll
        this.easing = 0.1;    // 0.1 = smooth, 0.3 = faster

        this.animate = this.animate.bind(this);
        window.addEventListener('scroll', () => this.updateTarget(), { passive: true });

        this.updateTarget(); // initialize
        this.animate();      // start animation loop
    }

    updateTarget() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        this.target = (scrollTop / (scrollHeight - clientHeight)) * 100;
    }

    animate() {
        // Lerp current toward target
        this.current += (this.target - this.current) * this.easing;
        this.progressBar.style.width = `${this.current.toFixed(2)}%`;

        requestAnimationFrame(this.animate);
    }
}



// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    animateSkillBars('#experience');

    const mobileMenu = new MobileMenu('#menu-toggle-btn', '.menu-links');
    document.querySelector('#menu-toggle-btn')?.addEventListener('click', () => {
        mobileMenu.toggle();
    });

    new BackToTop('back-to-top');
    new ReadingProgress('.reading-progress');
});
