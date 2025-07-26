/**
 * HERITAGE GUNSMITHING - JAVASCRIPT FUNCTIONALITY
 * Professional Gunsmith Website Interactive Features
 * 
 * Features Include:
 * - Mobile Navigation
 * - Smooth Scrolling
 * - Scroll Animations
 * - Service Card Toggles
 * - Gallery Lightbox
 * - FAQ Accordion
 * - Testimonial Carousel
 * - Contact Form Validation
 * - Loading Spinner
 * - Back to Top Button
 */

// ===== GLOBAL VARIABLES =====
let currentTestimonial = 0;
let testimonialInterval;
let galleryItems = [];
let currentGalleryIndex = 0;

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// ===== MAIN INITIALIZATION =====
function initializeWebsite() {
    // Initialize all components
    initMobileNavigation();
    initSmoothScrolling();
    initScrollAnimations();
    initServiceCards();
    initGallery();
    initFAQ();
    initTestimonials();
    initContactForm();
    initBackToTop();
    initStatCounters();
    initLoadingSpinner();
    initNavbarScroll();
    
    // Add event listeners
    addEventListeners();
}

// ===== LOADING SPINNER =====
function initLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    
    // Hide spinner after page load
    window.addEventListener('load', function() {
        setTimeout(() => {
            spinner.classList.add('hidden');
            setTimeout(() => {
                spinner.style.display = 'none';
            }, 500);
        }, 1000); // Show spinner for at least 1 second
    });
}

// ===== MOBILE NAVIGATION =====
function initMobileNavigation() {
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navbarMenu = document.getElementById('navbar-menu');
    const navLinks = document.querySelectorAll('.navbar__link');
    
    if (mobileMenuBtn && navbarMenu) {
        // Toggle mobile menu
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navbarMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navbarMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close mobile menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuBtn.classList.remove('active');
                navbarMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !navbarMenu.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                navbarMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// ===== NAVBAR SCROLL EFFECT =====
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // Special handling for stat counters
                if (entry.target.classList.contains('about__stats')) {
                    animateStatCounters();
                }
                
                // Special handling for gallery items
                if (entry.target.classList.contains('gallery__item')) {
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, Math.random() * 500); // Stagger animations
                }
            }
        });
    }, observerOptions);
    
    // Observe all sections and gallery items
    document.querySelectorAll('.section, .gallery__item').forEach(el => {
        observer.observe(el);
    });
}

// ===== STAT COUNTERS =====
function initStatCounters() {
    let countersAnimated = false;
    
    window.animateStatCounters = function() {
        if (countersAnimated) return;
        countersAnimated = true;
        
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    stat.textContent = Math.floor(current);
                    setTimeout(updateCounter, 20);
                } else {
                    stat.textContent = target;
                }
            };
            
            updateCounter();
        });
    };
}

// ===== SERVICE CARDS =====
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        const toggleBtn = card.querySelector('.service-card__toggle');
        const details = card.querySelector('.service-card__details');
        
        if (toggleBtn && details) {
            toggleBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Close other open cards
                serviceCards.forEach(otherCard => {
                    if (otherCard !== card) {
                        const otherDetails = otherCard.querySelector('.service-card__details');
                        const otherBtn = otherCard.querySelector('.service-card__toggle');
                        if (otherDetails && otherBtn) {
                            otherDetails.classList.remove('expanded');
                            otherBtn.textContent = 'Learn More';
                        }
                    }
                });
                
                // Toggle current card
                details.classList.toggle('expanded');
                
                if (details.classList.contains('expanded')) {
                    toggleBtn.textContent = 'Show Less';
                    
                    // Smooth scroll to show the expanded content
                    setTimeout(() => {
                        card.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest'
                        });
                    }, 300);
                } else {
                    toggleBtn.textContent = 'Learn More';
                }
            });
        }
    });
}

// ===== GALLERY FUNCTIONALITY =====
function initGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Initialize gallery items array
    galleryItems = Array.from(document.querySelectorAll('.gallery__item'));
    
    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.classList.add('is-visible');
                    }, 100);
                } else {
                    item.classList.remove('is-visible');
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Gallery item click handlers
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            openLightbox(index);
        });
    });
    
    // Lightbox event listeners
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', showPrevImage);
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', showNextImage);
    }
    
    // Close lightbox on background click
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });
    
    function openLightbox(index) {
        const visibleItems = galleryItems.filter(item => item.style.display !== 'none');
        const item = visibleItems[index] || galleryItems[index];
        
        if (!item) return;
        
        currentGalleryIndex = galleryItems.indexOf(item);
        
        const img = item.querySelector('img');
        const title = item.getAttribute('data-title') || 'Gallery Image';
        const description = item.getAttribute('data-description') || '';
        
        if (lightboxImage && img) {
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
        }
        
        if (lightboxTitle) {
            lightboxTitle.textContent = title;
        }
        
        if (lightboxDescription) {
            lightboxDescription.textContent = description;
        }
        
        if (lightbox) {
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    function showPrevImage() {
        currentGalleryIndex = currentGalleryIndex > 0 ? currentGalleryIndex - 1 : galleryItems.length - 1;
        openLightbox(currentGalleryIndex);
    }
    
    function showNextImage() {
        currentGalleryIndex = currentGalleryIndex < galleryItems.length - 1 ? currentGalleryIndex + 1 : 0;
        openLightbox(currentGalleryIndex);
    }
}

// ===== FAQ ACCORDION =====
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq__question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqId = this.getAttribute('data-faq');
            const answer = document.querySelector(`.faq__answer[data-faq="${faqId}"]`);
            const icon = this.querySelector('.faq__icon');
            
            // Close other open FAQ items
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this) {
                    const otherFaqId = otherQuestion.getAttribute('data-faq');
                    const otherAnswer = document.querySelector(`.faq__answer[data-faq="${otherFaqId}"]`);
                    const otherIcon = otherQuestion.querySelector('.faq__icon');
                    
                    if (otherAnswer && otherIcon) {
                        otherAnswer.classList.remove('expanded');
                        otherQuestion.classList.remove('active');
                    }
                }
            });
            
            // Toggle current FAQ item
            if (answer) {
                answer.classList.toggle('expanded');
                this.classList.toggle('active');
                
                // Smooth scroll to show the answer
                if (answer.classList.contains('expanded')) {
                    setTimeout(() => {
                        this.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest'
                        });
                    }, 300);
                }
            }
        });
    });
}

// ===== TESTIMONIAL CAROUSEL =====
function initTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.testimonial__dot');
    
    if (testimonials.length === 0) return;
    
    // Auto-rotate testimonials
    function startTestimonialRotation() {
        testimonialInterval = setInterval(() => {
            showTestimonial((currentTestimonial + 1) % testimonials.length);
        }, 5000); // Change every 5 seconds
    }
    
    function stopTestimonialRotation() {
        if (testimonialInterval) {
            clearInterval(testimonialInterval);
        }
    }
    
    function showTestimonial(index) {
        // Hide all testimonials
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        
        // Update dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current testimonial
        if (testimonials[index]) {
            testimonials[index].classList.add('active');
            currentTestimonial = index;
        }
        
        if (dots[index]) {
            dots[index].classList.add('active');
        }
    }
    
    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showTestimonial(index);
            stopTestimonialRotation();
            setTimeout(startTestimonialRotation, 10000); // Restart after 10 seconds
        });
    });
    
    // Pause on hover
    const testimonialCarousel = document.getElementById('testimonial-carousel');
    if (testimonialCarousel) {
        testimonialCarousel.addEventListener('mouseenter', stopTestimonialRotation);
        testimonialCarousel.addEventListener('mouseleave', startTestimonialRotation);
    }
    
    // Start the rotation
    startTestimonialRotation();
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (testimonialCarousel) {
        testimonialCarousel.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        testimonialCarousel.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
        function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next testimonial
                showTestimonial((currentTestimonial + 1) % testimonials.length);
                // Swipe right - previous testimonial
                showTestimonial(currentTestimonial > 0 ? currentTestimonial - 1 : testimonials.length - 1);
            }
            stopTestimonialRotation();
            setTimeout(startTestimonialRotation, 10000);
        }
    }
}

// ===== CONTACT FORM =====
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('form-submit');
    const successMessage = document.getElementById('success-message');
    
    if (!contactForm) return;
    
    // Form validation rules
    const validationRules = {
        name: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s'-]+$/,
            message: 'Please enter a valid name (letters, spaces, hyphens, and apostrophes only)'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        phone: {
            required: false,
            pattern: /^[\+]?[1-9][\d]{0,15}$/,
            message: 'Please enter a valid phone number'
        },
        message: {
            required: true,
            minLength: 10,
            message: 'Please enter a message with at least 10 characters'
        }
    };
    
    // Real-time validation
    Object.keys(validationRules).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (field && errorElement) {
            field.addEventListener('blur', () => validateField(fieldName));
            field.addEventListener('input', () => clearFieldError(fieldName));
        }
    });
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
    
    function validateField(fieldName) {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}-error`);
        const rules = validationRules[fieldName];
        
        if (!field || !errorElement || !rules) return true;
        
        const value = field.value.trim();
        
        // Check if required field is empty
        if (rules.required && !value) {
            showFieldError(fieldName, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`);
            return false;
        }
        
        // Skip validation if field is optional and empty
        if (!rules.required && !value) {
            clearFieldError(fieldName);
            return true;
        }
        
        // Check minimum length
        if (rules.minLength && value.length < rules.minLength) {
            showFieldError(fieldName, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${rules.minLength} characters`);
            return false;
        }
        
        // Check pattern
        if (rules.pattern && !rules.pattern.test(value)) {
            showFieldError(fieldName, rules.message);
            return false;
        }
        
        clearFieldError(fieldName);
        return true;
    }
    
    function validateForm() {
        let isValid = true;
        
        Object.keys(validationRules).forEach(fieldName => {
            if (!validateField(fieldName)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    function showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (field && errorElement) {
            field.style.borderColor = '#dc3545';
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }
    
    function clearFieldError(fieldName) {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (field && errorElement) {
            field.style.borderColor = '';
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }
    
    function clearAllErrors() {
        Object.keys(validationRules).forEach(fieldName => {
            clearFieldError(fieldName);
        });
    }
    
    function submitForm() {
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Hide loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            
            // Show success message
            if (successMessage) {
                successMessage.classList.add('show');
                
                // Scroll to success message
                successMessage.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 5000);
            }
            
            // Reset form
            contactForm.reset();
            clearAllErrors();
            
            // CHANGE: Replace this with actual form submission
            console.log('Form submitted successfully!');
            
            // Example of actual form submission:
            /*
            const formData = new FormData(contactForm);
            
            fetch('/submit-contact-form', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Show success message
                } else {
                    // Show error message
                }
            })
            .catch(error => {
                console.error('Error:', error);
                // Show error message
            });
            */
            
        }, 2000); // Simulate 2-second delay
    }
}

// ===== BACK TO TOP BUTTON =====
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (!backToTopBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    // Smooth scroll to top
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== ADDITIONAL EVENT LISTENERS =====
function addEventListeners() {
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Recalculate gallery layout if needed
            const galleryGrid = document.getElementById('gallery-grid');
            if (galleryGrid) {
                // Force reflow for masonry-like layouts
                galleryGrid.style.display = 'none';
                galleryGrid.offsetHeight; // Trigger reflow
                galleryGrid.style.display = '';
            }
        }, 250);
    });
    
    // Handle page visibility change (pause/resume animations)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Page is hidden - pause animations
            if (testimonialInterval) {
                clearInterval(testimonialInterval);
            }
        } else {
            // Page is visible - resume animations
            if (document.querySelectorAll('.testimonial').length > 0) {
                initTestimonials();
            }
        }
    });
    
    // Add click analytics (optional)
    document.addEventListener('click', function(e) {
        // Track button clicks
        if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
            const btn = e.target.classList.contains('btn') ? e.target : e.target.closest('.btn');
            const btnText = btn.textContent.trim();
            
            // CHANGE: Replace with your analytics tracking
            console.log('Button clicked:', btnText);
            
            // Example Google Analytics 4 event tracking:
            /*
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    event_category: 'Button',
                    event_label: btnText,
                    value: 1
                });
            }
            */
        }
        
        // Track phone number clicks
        if (e.target.tagName === 'A' && e.target.href.startsWith('tel:')) {
            console.log('Phone number clicked:', e.target.href);
            
            // Example analytics tracking:
            /*
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_call', {
                    event_category: 'Contact',
                    event_label: 'Phone Click',
                    value: 1
                });
            }
            */
        }
        
        // Track email clicks
        if (e.target.tagName === 'A' && e.target.href.startsWith('mailto:')) {
            console.log('Email clicked:', e.target.href);
            
            // Example analytics tracking:
            /*
            if (typeof gtag !== 'undefined') {
                gtag('event', 'email_click', {
                    event_category: 'Contact',
                    event_label: 'Email Click',
                    value: 1
                });
            }
            */
        }
    });
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Smooth animation helper
function animateValue(element, start, end, duration, callback) {
    const range = end - start;
    const startTime = performance.now();
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + (range * easeOut);
        
        element.textContent = Math.floor(current);
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        } else {
            element.textContent = end;
            if (callback) callback();
        }
    }
    
    requestAnimationFrame(updateValue);
}

// ===== ACCESSIBILITY ENHANCEMENTS =====

// Keyboard navigation for custom elements
document.addEventListener('keydown', function(e) {
    // Handle Enter and Space for custom buttons
    if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target;
        
        if (target.classList.contains('service-card__toggle') ||
            target.classList.contains('faq__question') ||
            target.classList.contains('filter-btn') ||
            target.classList.contains('testimonial__dot')) {
            
            e.preventDefault();
            target.click();
        }
    }
    
    // Handle Escape key for modals
    if (e.key === 'Escape') {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.classList.contains('active')) {
            lightbox.querySelector('.lightbox__close').click();
        }
    }
});

// Focus management for accessibility
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    
    // Optional: Send error to analytics or logging service
    /*
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            description: e.error.toString(),
            fatal: false
        });
    }
    */
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    
    // Optional: Send error to analytics or logging service
    /*
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            description: e.reason.toString(),
            fatal: false
        });
    }
    */
});

// ===== PERFORMANCE MONITORING =====
window.addEventListener('load', function() {
    // Log performance metrics
    if ('performance' in window) {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
        
        console.log('Page Load Time:', pageLoadTime + 'ms');
        console.log('DOM Ready Time:', domReadyTime + 'ms');
        
        // Optional: Send to analytics
        /*
        if (typeof gtag !== 'undefined') {
            gtag('event', 'timing_complete', {
                name: 'page_load',
                value: pageLoadTime
            });
        }
        */
    }
});

// ===== PROGRESSIVE ENHANCEMENT =====
// Check for feature support and provide fallbacks
function checkFeatureSupport() {
    // Check for Intersection Observer support
    if (!('IntersectionObserver' in window)) {
        // Fallback: Show all sections immediately
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('is-visible');
        });
    }
    
    // Check for CSS Custom Properties support
    if (!CSS.supports('color', 'var(--fake-var)')) {
        // Add fallback class for older browsers
        document.documentElement.classList.add('no-css-variables');
    }
    
    // Check for CSS Grid support
    if (!CSS.supports('display', 'grid')) {
        // Add fallback class
        document.documentElement.classList.add('no-css-grid');
    }
}

// Initialize feature checks
checkFeatureSupport();

// ===== EXPORT FUNCTIONS FOR EXTERNAL USE =====
// Make certain functions available globally if needed
window.GunsimthWebsite = {
    initializeWebsite,
    openLightbox: function(index) {
        const galleryItems = document.querySelectorAll('.gallery__item');
        if (galleryItems[index]) {
            galleryItems[index].click();
        }
    },
    showTestimonial: function(index) {
        const testimonials = document.querySelectorAll('.testimonial');
        if (testimonials[index]) {
            currentTestimonial = index;
            testimonials.forEach((t, i) => {
                t.classList.toggle('active', i === index);
            });
            
            const dots = document.querySelectorAll('.testimonial__dot');
            dots.forEach((d, i) => {
                d.classList.toggle('active', i === index);
            });
        }
    },
    scrollToSection: function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
};

// ===== CONSOLE WELCOME MESSAGE =====
console.log(`
%c🔫 Heritage Gunsmithing Website
%cDeveloped with precision and craftsmanship
%cFor technical support or customization inquiries, please contact the developer.
`, 
'font-size: 18px; font-weight: bold; color: #1e3a2b;',
'font-size: 14px; color: #bfa46f;',
'font-size: 12px; color: #6c757d;'
);