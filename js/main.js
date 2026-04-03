/* =============================================
   KOKAN NGO — Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  // ---- Init AOS ----
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60
  });

  // ---- Navbar Scroll ----
  const navbar = document.getElementById('mainNavbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ---- Back to Top ----
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- Counter Animation ----
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString();
    }, 16);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter, .fp-num, [data-target]').forEach(el => {
    counterObserver.observe(el);
  });

  // ---- Testimonial Slider ----
  const track = document.getElementById('testimonialTrack');
  const cards = track ? track.querySelectorAll('.testimonial-card') : [];
  const dotsContainer = document.getElementById('sliderDots');
  let currentSlide = 0;
  let slidesPerView = window.innerWidth > 768 ? 2 : 1;
  let totalSlides = cards.length;
  let autoplayTimer;

  function getMaxSlide() {
    return Math.max(0, totalSlides - slidesPerView);
  }

  function updateSlider() {
    if (!track) return;
    const cardWidth = cards[0] ? cards[0].offsetWidth + 28 : 0;
    track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
    document.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function createDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const maxSlide = getMaxSlide();
    for (let i = 0; i <= maxSlide; i++) {
      const dot = document.createElement('div');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => { currentSlide = i; updateSlider(); resetAutoplay(); });
      dotsContainer.appendChild(dot);
    }
  }

  function nextSlide() {
    currentSlide = currentSlide >= getMaxSlide() ? 0 : currentSlide + 1;
    updateSlider();
  }

  function prevSlide() {
    currentSlide = currentSlide <= 0 ? getMaxSlide() : currentSlide - 1;
    updateSlider();
  }

  function startAutoplay() {
    autoplayTimer = setInterval(nextSlide, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  if (track && cards.length > 0) {
    createDots();
    updateSlider();
    startAutoplay();

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });

    window.addEventListener('resize', () => {
      slidesPerView = window.innerWidth > 768 ? 2 : 1;
      currentSlide = Math.min(currentSlide, getMaxSlide());
      createDots();
      updateSlider();
    });

    // Touch support
    let touchStart = 0;
    track.addEventListener('touchstart', e => { touchStart = e.changedTouches[0].screenX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStart - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide(); else prevSlide();
        resetAutoplay();
      }
    }, { passive: true });
  }

  // ---- Gallery Filter ----
  const filterBtns = document.querySelectorAll('.gf-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // ---- Donate Amount Buttons ----
  const amtBtns = document.querySelectorAll('.donate-amt-btn');
  amtBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amtBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ---- Active Navbar Link on Scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });

  // ---- Smooth Navbar Collapse on Mobile ----
  const navLinks2 = document.querySelectorAll('.navbar-nav .nav-link');
  navLinks2.forEach(link => {
    link.addEventListener('click', () => {
      const navbarCollapse = document.getElementById('navMenu');
      if (navbarCollapse.classList.contains('show')) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
        bsCollapse.hide();
      }
    });
  });

  // ---- Hero Particles (subtle dots) ----
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    for (let i = 0; i < 20; i++) {
      const dot = document.createElement('div');
      dot.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        background: rgba(255,255,255,${Math.random() * 0.3 + 0.05});
        border-radius: 50%;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: floatParticle ${Math.random() * 10 + 8}s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
      `;
      particlesContainer.appendChild(dot);
    }
    const style = document.createElement('style');
    style.textContent = `
      @keyframes floatParticle {
        0%, 100% { transform: translateY(0) translateX(0); opacity: 0.5; }
        50% { transform: translateY(-30px) translateX(15px); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  console.log('✅ Kokan NGO — Homepage Loaded Successfully');
});
