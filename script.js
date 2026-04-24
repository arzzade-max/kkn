/* =============================================
   Sabka Malik Ek Pratishthan — script.js
   ============================================= */

/* ---- Navbar: scroll & mobile toggle ---- */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  // Sticky class
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Back to top button
  const backTop = document.getElementById('backTop');
  if (window.scrollY > 400) {
    backTop.classList.add('visible');
  } else {
    backTop.classList.remove('visible');
  }

  // Active nav link highlight
  highlightActiveNav();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ---- Active nav link on scroll ---- */
function highlightActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!link) return;

    if (scrollPos >= top && scrollPos < bottom) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

/* ---- Smooth scroll for all anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80; // navbar height
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ---- Back to top button ---- */
document.getElementById('backTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---- Reveal on scroll (IntersectionObserver) ---- */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // animate once
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ---- Counter animation for impact stats ---- */
function animateCounter(el, target, suffix = '') {
  let start     = 0;
  const duration = 1800;
  const step      = 16;
  const increment = target / (duration / step);

  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start) + suffix;
    }
  }, step);
}

// Observe impact section
const impactSection = document.querySelector('.impact-banner');
if (impactSection) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate the numeric stats
        animateCounter(document.querySelector('.impact-stat:nth-child(1) .impact-num'), 500, '+');
        animateCounter(document.querySelector('.impact-stat:nth-child(2) .impact-num'), 10, '+');
        animateCounter(document.querySelector('.impact-stat:nth-child(3) .impact-num'), 3);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  counterObserver.observe(impactSection);
}

/* ---- Contact form ---- */
const contactForm   = document.getElementById('contactForm');
const formSuccess   = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = this.name.value.trim();
    const email   = this.email.value.trim();
    const message = this.message.value.trim();

    if (!name || !email || !message) {
      alert('Please fill in all fields before submitting.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Simulate form submission
    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending…';

    setTimeout(() => {
      formSuccess.style.display = 'flex';
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa fa-paper-plane"></i> Send Message';
      setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
    }, 1400);
  });
}

/* ---- Navbar donate button: ensure present on mobile after resize ---- */
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  }
});

/* ---- Heroimg parallax (subtle) ---- */
const heroImg = document.querySelector('.hero-img');
if (heroImg) {
  window.addEventListener('scroll', () => {
    const offset = window.scrollY;
    heroImg.style.transform = `translateY(${offset * 0.25}px)`;
  }, { passive: true });
}

/* ---- Service card tilt effect (subtle on desktop) ---- */
if (window.innerWidth > 768) {
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const x     = (e.clientX - rect.left) / rect.width - 0.5;
      const y     = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
