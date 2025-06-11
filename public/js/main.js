// Main JavaScript for AI Student Portfolio

document.addEventListener('DOMContentLoaded', function() {
    // Add loading animation to elements
    const animatedElements = document.querySelectorAll('.skill-card, .project-card, .hero-content');
    animatedElements.forEach(el => el.classList.add('loading'));

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add active state to navigation based on scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Add typing effect to hero title (if needed)
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        // Simple fade-in effect
        setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 300);
    }

    // Add hover effects to cards
    const cards = document.querySelectorAll('.skill-card, .project-card .card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Console welcome message
    console.log(`
    🤖 Welcome to AI Student Portfolio!
    
    Built with:
    - Node.js & Express
    - Bootstrap 5
    - EJS Templates
    - Custom CSS & JS
    
    Feel free to explore the code!
    `);
});

// Utility function for smooth animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate');
        }
    });
}

// Add scroll listener for animations
window.addEventListener('scroll', animateOnScroll);

// Initialize animations on load
animateOnScroll();
