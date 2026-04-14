document.addEventListener('DOMContentLoaded', () => {

    /* ========================================================================= */
    /* NAVBAR STICKY EFFECT */
    /* ========================================================================= */
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', debounce(() => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, 10));

    /* ========================================================================= */
    /* PARTICLE SYSTEM GENERATION */
    /* ========================================================================= */
    const particlesContainer = document.getElementById('particles-container');
    const particleCount = window.innerWidth > 768 ? 50 : 20; // Menos partículas en mobile

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random positions
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';

        // Random animations
        particle.style.animationDelay = (Math.random() * 20) + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';

        // Random opacity & size for depth
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        particlesContainer.appendChild(particle);
    }

    /* ========================================================================= */
    /* INTERSECTION OBSERVER FOR SCROLL ANIMATIONS */
    /* ========================================================================= */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    // Staggered reveal for cards and generic elements
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a slight delay based on index for grid items
                setTimeout(() => {
                    entry.target.classList.add('fade-in-up');
                    entry.target.style.opacity = "1";
                }, index * 100);
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to reveal
    const revealElements = document.querySelectorAll('.service-card-flip, .partner-item, .about-content, .about-image-wrapper');
    revealElements.forEach(el => {
        el.style.opacity = "0"; // Initial state
        revealObserver.observe(el);
    });

    /* ========================================================================= */
    /* ANIMATED COUNTER (Metrics) */
    /* ========================================================================= */
    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target, 2000);
                obs.unobserve(counter);
            }
        });
    }, observerOptions);

    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => counterObserver.observe(counter));

    function animateCounter(element, target, duration = 2000) {
        const frames = 60; // Assuming 60fps
        const totalFrames = Math.round((duration / 1000) * frames);
        const increment = target / totalFrames;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = Math.round(target) + "+";
                clearInterval(timer);
            } else {
                element.textContent = Math.round(current);
            }
        }, 1000 / frames);
    }

    /* ========================================================================= */
    /* MOBILE MENU TOGGLE (Basic implementation) */
    /* ========================================================================= */
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(0,0,0,0.95)';
                navLinks.style.padding = '20px 0';
                navLinks.style.backdropFilter = 'blur(10px)';
            }
        });
    }

    /* ========================================================================= */
    /* FLIP CARD MOBILE TAP SUPPORT */
    /* ========================================================================= */
    // Add touch support for flip cards on mobile devices
    const flipCards = document.querySelectorAll('.service-card-flip');
    flipCards.forEach(card => {
        card.addEventListener('click', function () {
            if (window.innerWidth <= 767) {
                const inner = this.querySelector('.service-card-inner');
                if (inner.style.transform === 'rotateY(180deg)') {
                    inner.style.transform = 'rotateY(0deg)';
                } else {
                    inner.style.transform = 'rotateY(180deg)';
                }
            }
        });
    });

    /* ========================================================================= */
    /* PAUSE OUT-OF-VIEW VIDEOS */
    /* ========================================================================= */
    const videoIframes = document.querySelectorAll('.video-container iframe');
    if (videoIframes.length > 0) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    const iframe = entry.target;
                    if (iframe.contentWindow) {
                        iframe.contentWindow.postMessage(JSON.stringify({
                            event: 'command',
                            func: 'pauseVideo',
                            args: []
                        }), '*');
                    }
                }
            });
        }, { threshold: 0 });
        
        videoIframes.forEach(iframe => videoObserver.observe(iframe));
    }

    /* ========================================================================= */
    /* UTILS */
    /* ========================================================================= */
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }
});

// --- EMAIL GENERATOR ---
function generateEmail(event) {
    event.preventDefault();

    // 1. Get form values
    const name = document.getElementById('studentName').value.trim();
    const position = document.getElementById('position').value;
    const lab = document.getElementById('lab').value;
    const intro = document.getElementById('intro').value.trim();

    // 2. Determine target email based on lab
    // Data from SNNU People page
    const emailMapping = {
        "Exchange Student": "exchange@snn-unit.de",
        "Mindscan Lab (Dr. F. I. Corona-Strauss)": "farah.coronastrauss@uni-saarland.de"
    };

    const targetEmail = emailMapping[lab] || "lab@htwsaar.de";

    // 3. Construct Subject
    const subject = `Application for ${position} - ${name}`;

    // 4. Construct Body
    // Using a formal template
    const body = `Dear Principal Investigator,

${intro}

I have attached my academic CV and relevant documents for your consideration. I would appreciate the opportunity to discuss how my background aligns with the goals of the ${lab}.

Thank you for your time and consideration.

Sincerely,
${name}`;

    // 5. Update UI
    document.getElementById('outTo').textContent = targetEmail;
    document.getElementById('outSubject').textContent = subject;
    document.getElementById('outBody').textContent = body;

    // 6. Create mailto link
    // We encode URI components to ensure spaces and special characters work in email clients
    const mailtoLink = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    document.getElementById('mailToLink').href = mailtoLink;

    // 7. Show result area
    const resultDiv = document.getElementById('emailResult');
    resultDiv.style.display = 'block';

    // Smooth scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function copyEmailData() {
    const to = document.getElementById('outTo').textContent;
    const subject = document.getElementById('outSubject').textContent;
    const body = document.getElementById('outBody').textContent;

    const fullText = `To: ${to}\nSubject: ${subject}\n\n${body}`;

    navigator.clipboard.writeText(fullText).then(() => {
        const copyBtn = document.querySelector('button[onclick="copyEmailData()"]');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.style.background = 'rgba(74, 222, 128, 0.2)'; // Green tint

        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = 'rgba(255,255,255,0.05)';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        alert("Failed to copy text. Please select and copy manually.");
    });
}

// --- CLICK TOOLTIPS LOGIC ---
function toggleTooltip(element, event) {
    event.stopPropagation();
    
    // Close other tooltips first
    document.querySelectorAll('.custom-tooltip-trigger').forEach(el => {
        if (el !== element) {
            el.classList.remove('active');
        }
    });

    // Toggle this tooltip
    element.classList.toggle('active');
}

// Close when clicking outside
document.addEventListener('click', () => {
    document.querySelectorAll('.custom-tooltip-trigger').forEach(el => {
        el.classList.remove('active');
    });
});

function copyTooltipText(element, event) {
    event.stopPropagation(); // prevent tooltip from closing immediately
    
    const textToCopy = element.getAttribute('data-text');
    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = element.innerHTML;
        element.innerHTML = "¡Copiado!";
        element.style.color = "#4ade80"; // Light green for success
        
        setTimeout(() => {
            element.innerHTML = originalText;
            element.style.color = "";
            const parent = element.closest('.custom-tooltip-trigger');
            if(parent) parent.classList.remove('active'); // Close bubble
        }, 800);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}
