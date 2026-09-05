/**
 * Xavier Harris Portfolio - Interactive Engine
 * Modules:
 * 1. Sacred Geometry & Neural Constellation Canvas
 * 2. 3D Card Tilt with Specular Reflection
 * 3. Art Gallery Modal Lightbox
 * 4. IntersectionObserver Scroll Reveal
 * 5. Contact Form Validation & State
 */

document.addEventListener('DOMContentLoaded', () => {
    initGeometryCanvas();
    initCardTilt();
    initArtLightbox();
    initScrollReveal();
    initContactForm();
});

/* ==========================================================================
   1. SACRED GEOMETRY & NEURAL CONSTELLATION CANVAS
   ========================================================================== */
function initGeometryCanvas() {
    const canvas = document.querySelector('#hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const heroSection = canvas.closest('.brand-hero') || canvas.parentElement;
    let animationFrameId = null;
    let isVisible = true;

    // Retina / High-DPI Display Scaling
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resizeCanvas() {
        const rect = heroSection.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.scale(dpr, dpr);
    }

    // Node & Sacred Geometry Network
    const nodes = [];
    const nodeCount = Math.min(Math.floor(window.innerWidth / 22), 48);
    const maxDistance = 120;

    const mouse = {
        x: null,
        y: null,
        radius: 150
    };

    class Node {
        constructor() {
            this.x = Math.random() * (width || 800);
            this.y = Math.random() * (height || 400);
            this.vx = (Math.random() - 0.5) * 0.7;
            this.vy = (Math.random() - 0.5) * 0.7;
            this.radius = 1.6 + Math.random() * 1.8;
            this.phase = Math.random() * Math.PI * 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce gently off canvas bounds
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse proximity interaction (subtle attraction)
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.hypot(dx, dy);

                if (dist < mouse.radius && dist > 10) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x += (dx / dist) * force * 0.6;
                    this.y += (dy / dist) * force * 0.6;
                }
            }
        }

        draw(time) {
            // Harmonic pulse based on sacred ratios
            const pulse = Math.sin(time * 0.002 + this.phase) * 0.6;
            const currentRadius = Math.max(1, this.radius + pulse);

            ctx.beginPath();
            ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(6, 182, 212, 0.75)';
            ctx.shadowColor = 'rgba(99, 102, 241, 0.5)';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    // Initialize nodes
    resizeCanvas();
    for (let i = 0; i < nodeCount; i++) {
        nodes.push(new Node());
    }

    // Interactive mouse tracking relative to the hero element
    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    heroSection.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Battery-efficient animation loop
    function animate(time) {
        if (!isVisible) return;

        ctx.clearRect(0, 0, width, height);

        // Draw connections between nodes (Geometric chord lattice)
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.hypot(dx, dy);

                if (dist < maxDistance) {
                    const alpha = (1 - dist / maxDistance) * 0.35;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }

            // Draw line to cursor if in range
            if (mouse.x !== null && mouse.y !== null) {
                const dx = nodes[i].x - mouse.x;
                const dy = nodes[i].y - mouse.y;
                const dist = Math.hypot(dx, dy);

                if (dist < mouse.radius) {
                    const alpha = (1 - dist / mouse.radius) * 0.55;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            nodes[i].update();
            nodes[i].draw(time);
        }

        animationFrameId = requestAnimationFrame(animate);
    }

    // Pause when scrolled offscreen to conserve CPU / GPU
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            if (isVisible) {
                if (!animationFrameId) {
                    animationFrameId = requestAnimationFrame(animate);
                }
            } else {
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
            }
        });
    }, { threshold: 0.1 });

    observer.observe(canvas);

    // Throttled window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            resizeCanvas();
        }, 120);
    });

    animationFrameId = requestAnimationFrame(animate);
}

/* ==========================================================================
   2. 3D CARD PERSPECTIVE TILT & SPECULAR SHEEN
   ========================================================================== */
function initCardTilt() {
    // Respect user's motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = document.querySelectorAll('.project-card, .art-card, .profile-card');
    const maxTilt = 10; // degrees

    cards.forEach(card => {
        card.classList.add('tilt-card');

        let isHovered = false;

        card.addEventListener('mouseenter', () => {
            isHovered = true;
        });

        card.addEventListener('mousemove', (e) => {
            if (!isHovered) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Normalized coordinates (-0.5 to 0.5)
            const normX = (x / rect.width) - 0.5;
            const normY = (y / rect.height) - 0.5;

            const rotateX = (-normY * maxTilt).toFixed(2);
            const rotateY = (normX * maxTilt).toFixed(2);

            // Update transform and specular gradient position
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        card.addEventListener('mouseleave', () => {
            isHovered = false;
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });
}

/* ==========================================================================
   3. ART GALLERY MODAL LIGHTBOX
   ========================================================================== */
function initArtLightbox() {
    const artCards = Array.from(document.querySelectorAll('.art-card'));
    const modal = document.querySelector('#art-lightbox');
    if (!artCards.length || !modal) return;

    const modalImg = modal.querySelector('.lightbox-img');
    const modalTitle = modal.querySelector('.lightbox-title');
    const modalDesc = modal.querySelector('.lightbox-desc');
    const closeBtn = modal.querySelector('.lightbox-close-btn');
    const prevBtn = modal.querySelector('.lightbox-prev');
    const nextBtn = modal.querySelector('.lightbox-next');

    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        const card = artCards[currentIndex];
        const img = card.querySelector('img');
        const titleEl = card.querySelector('h4');
        const descEl = card.querySelector('p');

        if (!img) return;

        modalImg.src = card.dataset.src || img.src;
        modalImg.alt = img.alt || 'Artwork';
        modalTitle.textContent = card.dataset.title || (titleEl ? titleEl.textContent : 'Art Piece');
        modalDesc.textContent = card.dataset.desc || (descEl ? descEl.textContent : '');

        if (typeof modal.showModal === 'function') {
            modal.showModal();
        } else {
            modal.setAttribute('open', '');
        }
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (typeof modal.close === 'function') {
            modal.close();
        } else {
            modal.removeAttribute('open');
        }
        document.body.style.overflow = '';
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % artCards.length;
        openLightbox(currentIndex);
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + artCards.length) % artCards.length;
        openLightbox(currentIndex);
    }

    artCards.forEach((card, index) => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `View ${card.querySelector('h4')?.textContent || 'artwork'} in high resolution`);

        card.addEventListener('click', () => openLightbox(index));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', showNext);
    if (prevBtn) prevBtn.addEventListener('click', showPrev);

    // Close when clicking modal backdrop
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeLightbox();
        }
    });

    // Keyboard navigation: Escape, ArrowLeft, ArrowRight
    window.addEventListener('keydown', (e) => {
        if (!modal.open) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });
}

/* ==========================================================================
   4. SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!revealElements.length) return;

    if (!('IntersectionObserver' in window)) {
        revealElements.forEach(el => el.classList.add('is-revealed'));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   5. CONTACT FORM
   ========================================================================== */
function initContactForm() {
    const contactForm = document.querySelector('#contact-form');
    if (!contactForm) return;

    const nameInput = document.querySelector('#name');
    const emailInput = document.querySelector('#email');
    const messageInput = document.querySelector('#message');
    const messagesList = document.querySelector('#messages-list');

    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        if (!name || !email || !message) return;

        if (messagesList) {
            const item = document.createElement('li');
            const sanitizedName = name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            const sanitizedEmail = email.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            const sanitizedMessage = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");

            item.innerHTML = `<strong>${sanitizedName}</strong> <span style="color: var(--text-muted); font-size: 0.85rem;">(${sanitizedEmail})</span><p style="margin-top: 6px; color: var(--text-secondary);">${sanitizedMessage}</p>`;
            messagesList.prepend(item);
        }

        // Clear inputs
        nameInput.value = '';
        emailInput.value = '';
        messageInput.value = '';
    });
}