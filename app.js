// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme system first
    initThemeSystem();
    
    // Initialize all other functionality
    initNavigation();
    initScrollEffects();
    initProgressBars();
    initSkillAnimations();
    initContactForm();
    initSmoothScrolling();
    initMobileNavigation();
    initScrollAnimations();
    
    // Initialize enhanced features
    enhanceThemeToggle();
    enableSmoothThemeTransitions();
});

// Theme System - Dark Mode Implementation
function initThemeSystem() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Determine initial theme
    let currentTheme;
    if (savedTheme) {
        currentTheme = savedTheme;
    } else {
        currentTheme = systemPrefersDark ? 'dark' : 'light';
    }
    
    // Apply initial theme
    applyTheme(currentTheme);
    
    // Theme toggle button event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            const currentTheme = html.getAttribute('data-color-scheme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Add click animation
            themeToggle.style.transform = 'scale(0.95)';
            setTimeout(() => {
                themeToggle.style.transform = 'scale(1)';
            }, 150);
        });
        
        // Add keyboard support
        themeToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
    
    function applyTheme(theme) {
        html.setAttribute('data-color-scheme', theme);
        
        // Update meta theme color
        if (metaThemeColor) {
            if (theme === 'dark') {
                metaThemeColor.setAttribute('content', '#1a1a1a');
            } else {
                metaThemeColor.setAttribute('content', '#fcfcf9');
            }
        }
        
        // Trigger theme change event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }
}

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;
    
    // Handle navbar background on scroll
    function handleNavbarScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    }
    
    // Throttled scroll handler for better performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(handleNavbarScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', function() {
        ticking = false;
        requestTick();
    });
}

// Mobile navigation toggle
function initMobileNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Animate hamburger bars
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach((bar, index) => {
                if (navToggle.classList.contains('active')) {
                    if (index === 0) {
                        bar.style.transform = 'translateY(8px) rotate(45deg)';
                    } else if (index === 1) {
                        bar.style.opacity = '0';
                    } else if (index === 2) {
                        bar.style.transform = 'translateY(-8px) rotate(-45deg)';
                    }
                } else {
                    bar.style.transform = '';
                    bar.style.opacity = '';
                }
            });
        });
        
        // Close mobile menu when clicking on nav links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                
                // Reset hamburger bars
                const bars = navToggle.querySelectorAll('.bar');
                bars.forEach(bar => {
                    bar.style.transform = '';
                    bar.style.opacity = '';
                });
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                
                // Reset hamburger bars
                const bars = navToggle.querySelectorAll('.bar');
                bars.forEach(bar => {
                    bar.style.transform = '';
                    bar.style.opacity = '';
                });
            }
        });
    }
}

// Smooth scrolling for navigation links - FIXED
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip empty hrefs or non-section links
            if (!href || href === '#' || href.length <= 1) {
                return;
            }
            
            e.preventDefault();
            
            const targetSection = document.querySelector(href);
            
            if (targetSection) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const offsetTop = targetSection.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: Math.max(0, offsetTop),
                    behavior: 'smooth'
                });
                
                // Update URL without triggering page jump
                if (history.pushState) {
                    history.pushState(null, null, href);
                }
            }
        });
    });
}

// Progress bar animations for languages
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const progressObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const progress = progressBar.getAttribute('data-progress');
                
                // Animate progress bar
                setTimeout(() => {
                    progressBar.style.setProperty('--progress-width', progress + '%');
                    progressBar.classList.add('animate');
                }, 200);
                
                // Stop observing once animated
                progressObserver.unobserve(progressBar);
            }
        });
    }, observerOptions);
    
    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
}

// Skill animations for skill items
function initSkillAnimations() {
    const skillItems = document.querySelectorAll('.skill-item');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillItem = entry.target;
                const container = skillItem.closest('.skills-category');
                const allSkillsInContainer = container.querySelectorAll('.skill-item');
                const skillIndex = Array.from(allSkillsInContainer).indexOf(skillItem);
                
                // Add staggered animation
                setTimeout(() => {
                    skillItem.classList.add('animate-in');
                }, skillIndex * 100);
                
                // Stop observing once animated
                skillObserver.unobserve(skillItem);
            }
        });
    }, observerOptions);
    
    skillItems.forEach(item => {
        skillObserver.observe(item);
    });
}

// Contact form handling
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Validate form
            if (!name || !email || !subject || !message) {
                showFormError('Please fill in all fields.');
                return;
            }
            
            // Create mailto link
            const mailtoLink = `mailto:rachit0malik@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hello Rachit,\n\nMy name is ${name}.\n\n${message}\n\nBest regards,\n${name}\n\nEmail: ${email}`)}`;
            
            // Show success message
            showFormSuccess();
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Reset form after short delay
            setTimeout(() => {
                contactForm.reset();
            }, 1000);
        });
    }
}

// Show form success message
function showFormSuccess() {
    const submitButton = document.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Message Sent! ✓';
    submitButton.style.background = '#34C759';
    submitButton.disabled = true;
    
    setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.style.background = '';
        submitButton.disabled = false;
    }, 3000);
}

// Show form error message
function showFormError(message) {
    const submitButton = document.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = message;
    submitButton.style.background = '#FF3B30';
    submitButton.disabled = true;
    
    setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.style.background = '';
        submitButton.disabled = false;
    }, 3000);
}

// Scroll effects and animations
function initScrollEffects() {
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.1;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Update active navigation link based on scroll position
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    const scrollPosition = window.pageYOffset + 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    // If we're at the very top, highlight about section
    if (window.pageYOffset < 100) {
        currentSection = 'about';
    }
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Scroll-triggered animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.glass-card, .section-title');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const animationObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Set initial state and observe elements
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        animationObserver.observe(element);
    });
}

// Enhanced interactive effects
function initInteractiveEffects() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.cta-button, .cta-button-secondary, .submit-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Enhanced hover effects for cards
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Typing animation for hero tagline
    const tagline = document.querySelector('.hero-tagline');
    if (tagline) {
        const text = tagline.textContent;
        tagline.textContent = '';
        tagline.style.opacity = '1';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                tagline.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        // Start typing animation after a short delay
        setTimeout(typeWriter, 1500);
    }
    
    // Add subtle particle effect to hero section
    createParticleEffect();
}

// Particle effect for hero section
function createParticleEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particlesContainer = document.createElement('div');
    particlesContainer.style.position = 'absolute';
    particlesContainer.style.top = '0';
    particlesContainer.style.left = '0';
    particlesContainer.style.width = '100%';
    particlesContainer.style.height = '100%';
    particlesContainer.style.pointerEvents = 'none';
    particlesContainer.style.overflow = 'hidden';
    hero.style.position = 'relative';
    hero.appendChild(particlesContainer);
    
    // Create floating particles
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 3 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(0, 122, 255, 0.08)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Animate particles
        particle.animate([
            { transform: 'translateY(0px)', opacity: 0.1 },
            { transform: 'translateY(-150px)', opacity: 0.3 },
            { transform: 'translateY(-300px)', opacity: 0 }
        ], {
            duration: Math.random() * 4000 + 3000,
            iterations: Infinity,
            direction: 'normal',
            easing: 'ease-in-out'
        });
        
        particlesContainer.appendChild(particle);
    }
}

// Performance optimization: Debounce scroll events
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Optimize scroll handlers
const optimizedScrollHandler = debounce(function() {
    updateActiveNavLink();
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Enhanced theme toggle with better UX
function enhanceThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        // Add ARIA live region for screen readers
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'theme-status';
        document.body.appendChild(liveRegion);
        
        // Update ARIA live region when theme changes
        window.addEventListener('themeChanged', function(e) {
            const theme = e.detail.theme;
            liveRegion.textContent = `Switched to ${theme} mode`;
            
            // Update button aria-label
            themeToggle.setAttribute('aria-label', 
                theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            );
        });
        
        // Set initial aria-label
        const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'light';
        themeToggle.setAttribute('aria-label', 
            currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
        );
    }
}

// Smooth theme transitions
function enableSmoothThemeTransitions() {
    // Add transition class when theme changes
    window.addEventListener('themeChanged', function() {
        document.body.classList.add('theme-transition');
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 300);
    });
}

// Keyboard accessibility
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Initialize interactive effects and loading animations
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    initInteractiveEffects();
    
    // Trigger initial animations for hero elements
    const heroElements = document.querySelectorAll('.hero-title, .hero-contact, .hero-cta');
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200 + 500);
    });
});

// Set initial styles for loading animation
document.addEventListener('DOMContentLoaded', function() {
    const heroElements = document.querySelectorAll('.hero-title, .hero-contact, .hero-cta');
    heroElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    });
});