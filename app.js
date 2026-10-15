// =========================
// UI BEHAVIORS (robust)
// =========================

document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;

  const header = document.querySelector('header');

  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.style.background = "rgba(5,8,22,0.95)";
      } else {
        header.style.background = "rgba(5,8,22,0.7)";
      }
    });
  }

  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    const closeMenu = () => {
      navLinks.classList.remove('is-open');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menú');
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      menuToggle.classList.toggle('is-open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (event) => {
      if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 700) closeMenu();
    }, { passive: true });
  }

  const progressBar = document.querySelector('.progress span');
  if (progressBar) {
    let width = 0;
    const interval = setInterval(() => {
      if (width >= 85) {
        clearInterval(interval);
      } else {
        width++;
        progressBar.style.width = width + '%';
      }
    }, 30);
  }

  const buttons = document.querySelectorAll('.btn');
  if (buttons && buttons.length) {
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.05)');
      btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');
    });
  }

  // Logo overlay handling: allow closing and remember preference
  const logoOverlay = document.getElementById('logoOverlay');
  const overlayClose = document.getElementById('overlayClose');

  const hideOverlay = () => {
    if (!logoOverlay) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    logoOverlay.style.transition = 'opacity .35s ease';
    logoOverlay.style.opacity = '0';
    setTimeout(() => { logoOverlay.style.display = 'none'; }, 360);
  };

  if (logoOverlay) {
    // Always show overlay on page load
    logoOverlay.style.display = 'flex';
    setTimeout(() => { logoOverlay.classList.add('show'); }, 40);
    setTimeout(hideOverlay, 4000);
  }

  if (overlayClose) overlayClose.addEventListener('click', hideOverlay);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideOverlay();
  });

  // --- Futuristic interactions: cursor follower & parallax ---
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Cursor follower (lightweight, only when motion is enabled)
  try {
    if (!prefersReducedMotion && !isTouchDevice) {
      const cursor = document.createElement('div');
      cursor.className = 'cursor-follower';
      document.body.appendChild(cursor);

      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;
      let curX = mouseX;
      let curY = mouseY;

      document.addEventListener('pointermove', (ev) => {
        mouseX = ev.clientX;
        mouseY = ev.clientY;
        cursor.style.opacity = '1';
      }, { passive: true });

      const animateCursor = () => {
        curX += (mouseX - curX) * 0.12;
        curY += (mouseY - curY) * 0.12;
        cursor.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(animateCursor);
      };
      requestAnimationFrame(animateCursor);

      const interactive = document.querySelectorAll('a, button, .btn');
      interactive.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor-large'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-large'));
      });

      let fadeTimeout;
      document.addEventListener('pointermove', () => {
        cursor.style.opacity = '0.92';
        clearTimeout(fadeTimeout);
        fadeTimeout = setTimeout(() => { cursor.style.opacity = '0.18'; }, 1200);
      }, { passive: true });
    }
  } catch (e) {}

  // Parallax background & hero tilt (single RAF loop for better FPS)
  try {
    if (!prefersReducedMotion && !isTouchDevice) {
      const gridBg = document.querySelector('.grid-bg');
      const heroCard = document.querySelector('.hero-card');
      const heroContent = document.querySelector('.hero-content');

      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;

      document.addEventListener('pointermove', (e) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetY = (e.clientY / window.innerHeight - 0.5) * 2;
      }, { passive: true });

      const renderParallax = () => {
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;

        if (gridBg) {
          gridBg.style.transform = `translate3d(${currentX * 12}px, ${currentY * 12}px, 0) scale(1.01)`;
        }

        if (heroCard) {
          heroCard.style.transform = `translate3d(${ -currentX * 8 }px, ${ -currentY * 6 }px, 0) rotateX(${ -currentY * 3 }deg) rotateY(${ currentX * 3 }deg)`;
        }

        if (heroContent) {
          heroContent.style.transform = `translate3d(${ currentX * 6 }px, ${ currentY * 4 }px, 0)`;
        }

        requestAnimationFrame(renderParallax);
      };

      requestAnimationFrame(renderParallax);
    }
  } catch (e) {}

  // Reveal sections while scrolling
  try {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    reveals.forEach(el => observer.observe(el));
  } catch (e) {}

  // Save draft of the contact form so user data is not lost
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    const draftKey = 'fooxcoon-contact-draft';
    const messagesKey = 'fooxcoon-contact-messages';
    const formStatus = document.getElementById('formStatus');

    const setFormStatus = (message, isError = false) => {
      if (!formStatus) return;
      formStatus.textContent = message;
      formStatus.classList.toggle('is-error', isError);
    };

    const saveDraft = () => {
      const formData = {};
      contactForm.querySelectorAll('input, textarea').forEach(field => {
        const key = field.name || field.id || field.placeholder;
        if (key) {
          formData[key] = field.value;
        }
      });
      try {
        localStorage.setItem(draftKey, JSON.stringify(formData));
        setFormStatus('Borrador guardado automáticamente en este navegador.');
      } catch (error) {
        setFormStatus('No se pudo guardar el borrador en este navegador.', true);
      }
    };

    try {
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        const data = JSON.parse(savedDraft);
        contactForm.querySelectorAll('input, textarea').forEach(field => {
          const fieldKey = field.name || field.id || field.placeholder;
          const legacyKey = field.placeholder || field.name || field.id;
          if (fieldKey && data[fieldKey] !== undefined) {
            field.value = data[fieldKey];
          } else if (legacyKey && data[legacyKey] !== undefined) {
            field.value = data[legacyKey];
          }
        });
        setFormStatus('Borrador restaurado desde este navegador.');
      }
    } catch (error) {
      setFormStatus('No se pudo recuperar el borrador guardado.', true);
    }

    contactForm.addEventListener('input', saveDraft);

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = Object.fromEntries(
        Array.from(contactForm.querySelectorAll('input, textarea'), field => [field.name, field.value.trim()])
      );

      try {
        const savedMessages = JSON.parse(localStorage.getItem(messagesKey) || '[]');
        if (!Array.isArray(savedMessages)) throw new Error('Invalid saved messages');
        savedMessages.push({ ...message, savedAt: new Date().toISOString() });
        localStorage.setItem(messagesKey, JSON.stringify(savedMessages));
        localStorage.removeItem(draftKey);
        contactForm.reset();
        setFormStatus('Mensaje guardado en este navegador. No se envió por correo.');
      } catch (error) {
        setFormStatus('No se pudo guardar el mensaje. Tus datos siguen en el formulario.', true);
      }
    });
  }
});