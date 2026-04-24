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
        // 2. SYMMETRICAL GSAP SLIDER ANIMATIONS
        // ==========================================
        const slides = document.querySelectorAll('.slide');
        let currentSlide = 0;
        let isAnimating = false;

        function drawPaths(slide) {
            const lines = slide.querySelectorAll('.draw-path');
            lines.forEach(line => {
                const length = line.getTotalLength();
                gsap.fromTo(line, 
                    { strokeDasharray: length, strokeDashoffset: length },
                    { strokeDashoffset: 0, duration: 2, ease: "power3.out" }
                );
            });
            const joints = slide.querySelectorAll('.pop-in');
            gsap.fromTo(joints, 
                { scale: 0, opacity: 0 }, 
                { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)", stagger: 0.5 }
            );
        }

        if (slides.length > 0) {
            const initContent = slides[0].querySelectorAll('.content-section > *');
            const initGraphic = slides[0].querySelectorAll('.center-hub-container, .node-wrapper');
            
            gsap.from(initContent, { x: -30, opacity: 0, duration: 1, stagger: 0.1, ease: "power2.out" });
            gsap.from(initGraphic, { scale: 0.8, opacity: 0, duration: 1, stagger: 0.1, ease: "back.out(1.2)", delay: 0.3 });
            setTimeout(() => drawPaths(slides[0]), 300);
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

            const tl = gsap.timeline({ onComplete: () => {
                oldSlide.classList.remove('active');
                nextSlide.classList.add('active');
                isAnimating = false;
                currentSlide = newIndex;
            }});

            tl.to(oldContent, { x: -20, opacity: 0, duration: 0.4, stagger: 0.05, ease: "power2.in" }, 0)
              .to(oldGraphic, { scale: 0.95, opacity: 0, duration: 0.4, stagger: 0.05, ease: "power2.in" }, 0);

            gsap.set(nextContent, { x: 20, opacity: 0 });
            gsap.set(nextGraphic, { scale: 0.9, opacity: 0 });
            nextSlide.classList.add('active');

            tl.to(nextContent, { x: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "power3.out" }, 0.5)
              .to(nextGraphic, { scale: 1, opacity: 1, duration: 0.8, stagger: 0.08, ease: "back.out(1.2)" }, 0.6);

            setTimeout(() => drawPaths(nextSlide), 700);
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
