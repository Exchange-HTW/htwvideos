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
            navLinks.classList.toggle('active');
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
            if (parent) parent.classList.remove('active'); // Close bubble
        }, 800);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

/* ========================================================================= */
/* FAQ GALLERY LOGIC (HOVER INLINE ROCOLA / COVERFLOW) */
/* ========================================================================= */
document.addEventListener('DOMContentLoaded', () => {
    const faqGrid = document.getElementById('faq-gallery-grid');
    if (!faqGrid) return; // Only run on FAQ page

    // Allow subdirectories (e.g. anahuac/) to override the image base path
    const imgBase = (typeof window.faqImageBase !== 'undefined') ? window.faqImageBase : 'images/';

    const faqGroups = [
        { id: 1, start: 1, end: 5 },
        { id: 2, start: 6, end: 10 },
        { id: 3, start: 11, end: 15 },
        { id: 4, start: 16, end: 20 },
        { id: 5, start: 21, end: 25 },
        { id: 6, start: 26, end: 31 } // 6 images in last group
    ];

    // Generate thumbnails Grid
    faqGroups.forEach(group => {
        const numSlides = group.end - group.start + 1;
        const groupEl = document.createElement('div');
        groupEl.className = 'faq-group-thumbnail';
        groupEl.setAttribute('data-group', group.id);

        let slidesHtml = '';
        for (let i = group.start; i <= group.end; i++) {
            slidesHtml += `<div class="swiper-slide"><img src="${imgBase}${i}.png" alt="FAQ diapositiva ${i}"></div>`;
        }

        groupEl.innerHTML = `
            <div class="faq-static-cover">
                <img src="${imgBase}${group.start}.png" alt="FAQ Grupo ${group.id}">
                <div class="faq-group-overlay">
                    <span>Ver ${numSlides} diapositivas</span>
                </div>
            </div>
            
            <div class="swiper faq-swiper dynamic-swiper">
                <div class="swiper-wrapper">
                    ${slidesHtml}
                </div>
            </div>
        `;
        faqGrid.appendChild(groupEl);

        const swiperContainer = groupEl.querySelector('.faq-swiper');
        let swiper = null;

        // Mouse Enter (Activa el Coverflow y lo hace visible)
        groupEl.addEventListener('mouseenter', () => {
            groupEl.classList.add('is-active');

            // Inicializar swiper si no existe, solo cuando es necesario
            if (!swiper) {
                swiper = new Swiper(swiperContainer, {
                    effect: 'coverflow',
                    grabCursor: true,
                    centeredSlides: true,
                    slidesPerView: 1.5,
                    initialSlide: 0,
                    coverflowEffect: {
                        rotate: 20,
                        stretch: 0,
                        depth: 150,
                        modifier: 1,
                        slideShadows: true,
                    },
                    speed: 400
                });
            } else {
                swiper.update();
            }
        });

        // Mouse Leave (Desactiva y vuelve a la portada)
        groupEl.addEventListener('mouseleave', () => {
            groupEl.classList.remove('is-active');
        });

        // Click: Abrir la foto actual en Lightbox
        groupEl.addEventListener('click', (e) => {
            if (groupEl.classList.contains('is-active') && swiper) {
                const activeSlideIndex = swiper.activeIndex;
                openLightbox(group, activeSlideIndex);
            }
        });

        // Desplazamiento moviendo el ratón a los lados (Proporcional a la caja)
        groupEl.addEventListener('mousemove', (e) => {
            if (!groupEl.classList.contains('is-active') || !swiper) return;

            const rect = groupEl.getBoundingClientRect();
            // Evitar valores negativos o mayores al ancho
            let x = e.clientX - rect.left;
            if (x < 0) x = 0;
            if (x > rect.width) x = rect.width;

            const percentage = x / rect.width; // 0.0 to 1.0

            let targetSlide = Math.floor(percentage * numSlides);
            if (targetSlide >= numSlides) targetSlide = numSlides - 1;

            swiper.slideTo(targetSlide);
        });
    });

    /* --- LIGHTBOX DOM & Logic --- */
    const lightbox = document.createElement('div');
    lightbox.id = 'faq-lightbox';
    lightbox.className = 'faq-lightbox';
    lightbox.innerHTML = `
        <button id="faq-lightbox-close" class="faq-lightbox-close" aria-label="Close Lightbox">&times;</button>
        <button id="faq-lightbox-prev" class="faq-lightbox-nav prev" aria-label="Previous image">&bull;</button>
        <button id="faq-lightbox-next" class="faq-lightbox-nav next" aria-label="Next image">&bull;</button>
        <img id="faq-lightbox-img" src="" alt="Zoomed FAQ">
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = document.getElementById('faq-lightbox-img');
    const lightboxCloseBtn = document.getElementById('faq-lightbox-close');
    const lightboxPrevBtn = document.getElementById('faq-lightbox-prev');
    const lightboxNextBtn = document.getElementById('faq-lightbox-next');

    let currentLightboxGroup = null;
    let currentLightboxIndex = 0;

    function openLightbox(group, index) {
        currentLightboxGroup = group;
        currentLightboxIndex = index;
        lightboxImg.src = `${imgBase}${group.start + index}.png`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateLightboxNav();
    }

    function updateLightboxNav() {
        if (!currentLightboxGroup) return;
        const totalSlides = currentLightboxGroup.end - currentLightboxGroup.start + 1;
        lightboxPrevBtn.style.display = currentLightboxIndex > 0 ? 'flex' : 'none';
        lightboxNextBtn.style.display = currentLightboxIndex < totalSlides - 1 ? 'flex' : 'none';
    }

    function lightboxNavigate(direction) {
        if (!currentLightboxGroup) return;
        const totalSlides = currentLightboxGroup.end - currentLightboxGroup.start + 1;

        currentLightboxIndex += direction;

        // Limits
        if (currentLightboxIndex < 0) currentLightboxIndex = 0;
        if (currentLightboxIndex >= totalSlides) currentLightboxIndex = totalSlides - 1;

        lightboxImg.src = `${imgBase}${currentLightboxGroup.start + currentLightboxIndex}.png`;
        updateLightboxNav();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => lightboxImg.src = '', 300); // clear after fade out
    }

    lightboxCloseBtn.addEventListener('click', closeLightbox);

    lightboxPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        lightboxNavigate(-1);
    });

    lightboxNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        lightboxNavigate(1);
    });

    lightbox.addEventListener('click', (e) => {
        // Cierra si se hace clic fuera de la imagen y fuera de los botones
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Soporte para teclado (Flechas direccionales y ESC)
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'ArrowLeft') {
            lightboxNavigate(-1);
        } else if (e.key === 'ArrowRight') {
            lightboxNavigate(1);
        } else if (e.key === 'Escape') {
            closeLightbox();
        }
    });

});

/* ========================================================================= */
/* THEME TOGGLE LOGIC */
/* ========================================================================= */
document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.createElement('button');
    themeBtn.id = 'theme-toggle-btn';
    themeBtn.className = 'theme-toggle-btn';
    themeBtn.innerHTML = '☀️';
    themeBtn.setAttribute('aria-label', 'Toggle light/dark theme');
    document.body.appendChild(themeBtn);

    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
        themeBtn.innerHTML = '🌙';
    } else {
        document.body.classList.remove('light-theme');
        themeBtn.innerHTML = '☀️';
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        themeBtn.innerHTML = isLight ? '🌙' : '☀️';
    });
});

