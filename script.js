// Additional JavaScript functionality for Portfolio Website

// Enhanced Typing Effect with Multiple Styles
class AdvancedTypingEffect {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = texts;
        this.options = {
            typeSpeed: 100,
            deleteSpeed: 50,
            pauseTime: 2000,
            loop: true,
            ...options
        };
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.start();
    }

    start() {
        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let speed = this.isDeleting ? this.options.deleteSpeed : this.options.typeSpeed;

        if (!this.isDeleting && this.charIndex === currentText.length) {
            speed = this.options.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            speed = 500;
        }

        setTimeout(() => this.type(), speed);
    }
}

// Smooth Page Transitions
class PageTransitions {
    constructor() {
        this.init();
    }

    init() {
        // Add page transition overlay
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            z-index: 10000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.5s ease;
        `;
        document.body.appendChild(overlay);

        // Handle internal links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    this.smoothScrollTo(target);
                }
            });
        });
    }

    smoothScrollTo(target) {
        const targetPosition = target.offsetTop - 80;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        requestAnimationFrame(animation);
    }

    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
}

// Advanced Particle System
class ParticleSystem {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.options = {
            particleCount: 50,
            connectionDistance: 100,
            particleSpeed: 0.5,
            particleSize: 2,
            ...options
        };
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.animate();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.options.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.options.particleSpeed,
                vy: (Math.random() - 0.5) * this.options.particleSpeed,
                size: Math.random() * this.options.particleSize + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Draw particle
            this.ctx.fillStyle = `rgba(99, 102, 241, ${particle.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Draw connections
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.options.connectionDistance) {
                    const opacity = (1 - distance / this.options.connectionDistance) * 0.3;
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Form Enhancement
class FormEnhancer {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.addFloatingLabels();
        this.addValidation();
        this.addSubmitHandler();
    }

    addFloatingLabels() {
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            const wrapper = document.createElement('div');
            wrapper.className = 'floating-label-wrapper';
            wrapper.style.position = 'relative';
            
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);
            
            const label = document.createElement('label');
            label.textContent = input.placeholder;
            label.className = 'floating-label';
            label.style.cssText = `
                position: absolute;
                top: 50%;
                left: 15px;
                transform: translateY(-50%);
                transition: all 0.3s ease;
                pointer-events: none;
                color: #94a3b8;
                background: white;
                padding: 0 5px;
            `;
            
            wrapper.appendChild(label);
            
            input.addEventListener('focus', () => {
                label.style.top = '0';
                label.style.fontSize = '12px';
                label.style.color = '#6366f1';
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    label.style.top = '50%';
                    label.style.fontSize = '16px';
                    label.style.color = '#94a3b8';
                }
            });
        });
    }

    addValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'This field is required';
        } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            message = 'Please enter a valid email address';
        }

        if (!isValid) {
            this.showError(field, message);
        } else {
            this.clearError(field);
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showError(field, message) {
        field.style.borderColor = '#ef4444';
        
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.cssText = `
                color: #ef4444;
                font-size: 12px;
                margin-top: 5px;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        setTimeout(() => errorElement.style.opacity = '1', 10);
    }

    clearError(field) {
        field.style.borderColor = '';
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.opacity = '0';
            setTimeout(() => errorElement.remove(), 300);
        }
    }

    addSubmitHandler() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const inputs = this.form.querySelectorAll('input, textarea');
            let isFormValid = true;
            
            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isFormValid = false;
                }
            });
            
            if (isFormValid) {
                this.submitForm();
            }
        });
    }

    submitForm() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check me-2"></i>Message Sent!';
            
            setTimeout(() => {
                this.form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Show success notification
                this.showNotification('Thank you! Your message has been sent successfully.', 'success');
            }, 2000);
        }, 1500);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#6366f1'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.style.transform = 'translateX(0)', 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

// Initialize enhanced features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize page transitions
    new PageTransitions();
    
    // Initialize form enhancer
    new FormEnhancer('#contactForm');
    
    // Add scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top-btn';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        border: none;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(99, 102, 241, 0.3);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// Export classes for external use
window.AdvancedTypingEffect = AdvancedTypingEffect;
window.ParticleSystem = ParticleSystem;
window.FormEnhancer = FormEnhancer;