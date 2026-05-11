        // ==========================================
        // 1. CANVAS PARTICLES SYSTEM (1200 CODE PARTICLES)
        // ==========================================
        const canvas = document.getElementById('particle-canvas');
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function initParticles() {
            const heroWrapper = document.getElementById('heroWrapper');
            if(!heroWrapper) return;
            width = canvas.width = heroWrapper.offsetWidth;
            height = canvas.height = heroWrapper.offsetHeight;
            particles = [];
            
            const chars = ['0', '1', '<', '>', '{', '}'];
            
            for(let i = 0; i < 1200; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.4, 
                    vy: (Math.random() - 0.5) * 0.4,
                    size: Math.random() * 10 + 6, 
                    alpha: Math.random() * 0.25 + 0.05,
                    char: chars[Math.floor(Math.random() * chars.length)] 
                });
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                
                if(p.x < 0) p.x = width;
                if(p.x > width) p.x = 0;
                if(p.y < 0) p.y = height;
                if(p.y > height) p.y = 0;
                
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = '#00d2ff'; 
                ctx.font = p.size + "px 'Space Mono', monospace";
                ctx.fillText(p.char, p.x, p.y);
            });
            
            requestAnimationFrame(animateParticles);
        }

        window.addEventListener('resize', initParticles);
        initParticles();
        animateParticles();


        // ==========================================
        // 2. ROBUST GSAP SLIDER ANIMATIONS
        // ==========================================
        const slides = document.querySelectorAll('.slide');
        let currentSlide = 0;
        let isAnimating = false;

        function drawPaths(slide) {
            const lines = slide.querySelectorAll('.draw-path');
            lines.forEach((line, i) => {
                try {
                    const length = line.getTotalLength();
                    if (length > 0) {
                        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
                        gsap.to(line, { strokeDashoffset: 0, duration: 1.8, delay: i * 0.15, ease: "power2.out" });
                    }
                } catch(e) {
                    // Fallback — force show the line
                    gsap.set(line, { strokeDasharray: 'none', strokeDashoffset: 0, opacity: 1 });
                }
            });
            const joints = slide.querySelectorAll('.pop-in');
            if (joints.length) {
                gsap.fromTo(joints,
                    { scale: 0, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)", stagger: 0.2, delay: 0.3 }
                );
            }
        }

        function resetPaths(slide) {
            const lines = slide.querySelectorAll('.draw-path');
            lines.forEach(line => {
                try {
                    const length = line.getTotalLength();
                    gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
                } catch(e) {}
            });
            const joints = slide.querySelectorAll('.pop-in');
            gsap.set(joints, { scale: 0, opacity: 0 });
        }

        // Initialize first slide
        if (slides.length > 0) {
            // Reset all non-active slides
            slides.forEach((s, i) => {
                if (i !== 0) resetPaths(s);
            });

            const initContent = slides[0].querySelectorAll('.content-section > *');
            const initGraphic = slides[0].querySelectorAll('.center-hub-container, .node-wrapper');

            gsap.from(initContent, { x: -30, opacity: 0, duration: 1, stagger: 0.12, ease: "power2.out" });
            gsap.from(initGraphic, { scale: 0.8, opacity: 0, duration: 1, stagger: 0.15, ease: "back.out(1.2)", delay: 0.3 });
            
            // Draw paths after a frame to ensure SVG is rendered
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    drawPaths(slides[0]);
                });
            });
        }

        function changeSlide(newIndex) {
            if (isAnimating || newIndex === currentSlide || slides.length === 0) return;
            isAnimating = true;

            const oldSlide = slides[currentSlide];
            const nextSlide = slides[newIndex];

            const oldContent = oldSlide.querySelectorAll('.content-section > *');
            const oldGraphic = oldSlide.querySelectorAll('.center-hub-container, .node-wrapper, .svg-layer');
            
            const nextContent = nextSlide.querySelectorAll('.content-section > *');
            const nextGraphic = nextSlide.querySelectorAll('.center-hub-container, .node-wrapper');

            // Kill any running animations on these elements
            gsap.killTweensOf(oldContent);
            gsap.killTweensOf(oldGraphic);
            gsap.killTweensOf(nextContent);
            gsap.killTweensOf(nextGraphic);

            // Reset paths on next slide before showing
            resetPaths(nextSlide);

            const tl = gsap.timeline({
                onComplete: () => {
                    oldSlide.classList.remove('active');
                    isAnimating = false;
                    currentSlide = newIndex;
                }
            });

            // Fade out old slide
            tl.to(oldContent, { x: -20, opacity: 0, duration: 0.35, stagger: 0.04, ease: "power2.in" }, 0)
              .to(oldGraphic, { scale: 0.95, opacity: 0, duration: 0.35, stagger: 0.04, ease: "power2.in" }, 0);

            // Prepare next slide
            gsap.set(nextContent, { x: 25, opacity: 0 });
            gsap.set(nextGraphic, { scale: 0.85, opacity: 0 });
            nextSlide.classList.add('active');

            // Animate in next slide
            tl.to(nextContent, { x: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power3.out" }, 0.45)
              .to(nextGraphic, { scale: 1, opacity: 1, duration: 0.7, stagger: 0.1, ease: "back.out(1.2)" }, 0.55);

            // Draw paths after next slide is visible and rendered
            tl.call(() => {
                requestAnimationFrame(() => drawPaths(nextSlide));
            }, null, 0.6);

            // Update pagination dots
            document.querySelectorAll('.pagination .dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === newIndex);
            });
        }

        function nextSlide() {
            if (slides.length === 0) return;
            let next = currentSlide + 1;
            if (next >= slides.length) next = 0;
            changeSlide(next);
        }

        function prevSlide() {
            if (slides.length === 0) return;
            let prev = currentSlide - 1;
            if (prev < 0) prev = slides.length - 1;
            changeSlide(prev);
        }

        function goToSlide(index) {
            changeSlide(index);
        }

        setInterval(() => {
            if(!isAnimating) nextSlide();
        }, 8000);


        // 3. Mouse Movement Parallax Effect (ISOLATED TO HERO WRAPPER)
        document.addEventListener('mousemove', (e) => {
            const heroWrapper = document.getElementById('heroWrapper');
            if (!heroWrapper) return;
            const rect = heroWrapper.getBoundingClientRect();
            
            if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
                const xPos = (e.clientX / window.innerWidth - 0.5) * 2; 
                const yPos = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

                gsap.to('.content-section', {
                    x: xPos * 25,
                    y: yPos * 25,
                    duration: 1,
                    ease: "power2.out"
                });

                gsap.to('.graphic-wrapper', {
                    x: xPos * -30,
                    y: yPos * -30,
                    rotationY: xPos * 12,
                    rotationX: -yPos * 12,
                    duration: 1,
                    ease: "power2.out"
                });
            }
        });

        // ==========================================
        // HOMEPAGE COUNTER ANIMATION
        // ==========================================
        function hpAnimateCounters() {
            document.querySelectorAll('.hp-stat-num').forEach(counter => {
                const target = +counter.getAttribute('data-target');
                if (counter.dataset.done) return;
                counter.dataset.done = '1';
                const duration = 2000, start = performance.now();
                function update(now) {
                    const p = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - p, 3);
                    counter.textContent = Math.floor(eased * target);
                    if (p < 1) requestAnimationFrame(update);
                    else counter.textContent = target;
                }
                requestAnimationFrame(update);
            });
        }

        // ==========================================
        // HOMEPAGE SCROLL ANIMATIONS
        // ==========================================
        const hpObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('hp-visible');
                    if (entry.target.querySelector('.hp-stat-num')) hpAnimateCounters();
                    hpObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.hp-overview-text, .hp-overview-image, .hp-fstats-bar, .hp-svc-item, .hp-best-card, .hp-port-card, .hp-blog-card, .hp-contact-card').forEach(el => {
            el.classList.add('hp-animate');
            hpObserver.observe(el);
        });
