/**
 * BS PARADISE INTERIOR — CORE FE LOGIC & INTERACTION ENGINE
 * Includes: Sticky Navbar, Mobile Drawer, Hero Slider, Lightbox Gallery,
 * Photo Sphere 360° Viewer, Testimonial Slider, Form Validation, Toast Notifications
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. STICKY NAVBAR & ACTIVE NAV LINK TRACKER
  // ------------------------------------------------------------------------
  const header = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Add glassmorphic background on scroll
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // ------------------------------------------------------------------------
  // 2. MOBILE DRAWER NAVIGATION
  // ------------------------------------------------------------------------
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileDrawerClose = document.querySelector('.mobile-drawer-close');
  const drawerOverlay = document.querySelector('.mobile-drawer-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-links .nav-link');

  function openMobileMenu() {
    mobileToggle.classList.add('is-active');
    mobileDrawer.classList.add('is-open');
    drawerOverlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileToggle.classList.remove('is-active');
    mobileDrawer.classList.remove('is-open');
    drawerOverlay.classList.remove('is-visible');
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      if (mobileDrawer.classList.contains('is-open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileDrawerClose) {
    mobileDrawerClose.addEventListener('click', closeMobileMenu);
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeMobileMenu);
  }

  // Attach click handler to all links inside mobile drawer (including Book Consultation button)
  const allMobileDrawerLinks = document.querySelectorAll('.mobile-drawer a');
  allMobileDrawerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      closeMobileMenu();

      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          setTimeout(() => {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      }
    });
  });

  // ------------------------------------------------------------------------
  // 3. HERO BACKGROUND SLIDER
  // ------------------------------------------------------------------------
  const heroSlides = document.querySelectorAll('.hero-slide');
  let currentSlide = 0;

  if (heroSlides.length > 1) {
    setInterval(() => {
      heroSlides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % heroSlides.length;
      heroSlides[currentSlide].classList.add('active');
    }, 6000);
  }

  // ------------------------------------------------------------------------
  // 4. PORTFOLIO FILTERING
  // ------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // ------------------------------------------------------------------------
  // 5. PORTFOLIO LIGHTBOX MODAL
  // ------------------------------------------------------------------------
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  let activePortfolioIndex = 0;
  const visibleItems = () => Array.from(portfolioItems).filter(item => !item.classList.contains('hidden'));

  function openLightbox(index) {
    const items = visibleItems();
    if (items.length === 0) return;
    
    activePortfolioIndex = index;
    const targetItem = items[activePortfolioIndex];
    const imgSrc = targetItem.querySelector('img').getAttribute('src');
    const title = targetItem.querySelector('.portfolio-item-title').textContent;

    lightboxImg.setAttribute('src', imgSrc);
    lightboxCaption.textContent = title;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  portfolioItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      const items = visibleItems();
      const currentIdx = items.indexOf(item);
      openLightbox(currentIdx >= 0 ? currentIdx : 0);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => {
      const items = visibleItems();
      activePortfolioIndex = (activePortfolioIndex - 1 + items.length) % items.length;
      openLightbox(activePortfolioIndex);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => {
      const items = visibleItems();
      activePortfolioIndex = (activePortfolioIndex + 1) % items.length;
      openLightbox(activePortfolioIndex);
    });
  }

  // Close lightbox on Esc key or clicking overlay
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
  });

  // ------------------------------------------------------------------------
  // 6. PHOTO SPHERE VIEWER (360° VIRTUAL TOUR)
  // ------------------------------------------------------------------------
  const viewerContainer = document.getElementById('photosphere-viewer');
  const tourBtns = document.querySelectorAll('.tour-btn');
  let sphereViewer = null;

  /* 
   * Equirectangular panorama image paths. 
   * Replace these paths with actual client panorama equirectangular photos if needed.
   */
  const tourPanoramas = {
    living: 'images/pano_living.png',
    kitchen: 'images/pano_kitchen.png',
    bedroom: 'images/pano_bedroom.png'
  };

  function initPhotoSphereViewer(panoramaUrl) {
    if (!viewerContainer) return;

    // Check if PhotoSphereViewer CDN is loaded
    if (typeof PhotoSphereViewer !== 'undefined' && PhotoSphereViewer.Viewer) {
      if (sphereViewer) {
        sphereViewer.destroy();
      }

      sphereViewer = new PhotoSphereViewer.Viewer({
        container: viewerContainer,
        panorama: panoramaUrl,
        caption: 'BS PARADISE INTERIOR — 360° Virtual Tour',
        loadingImg: 'images/1.jpg',
        touchmoveTwoFingers: true,
        mousewheelCtrlKey: false,
        navbar: [
          'autorotate',
          'zoom',
          'caption',
          'fullscreen'
        ],
        defaultZoomLvl: 30
      });
    } else {
      console.warn('Photo Sphere Viewer CDN not detected. Falling back to background view.');
      viewerContainer.style.backgroundImage = `url('${panoramaUrl}')`;
      viewerContainer.style.backgroundSize = 'cover';
      viewerContainer.style.backgroundPosition = 'center';
    }
  }

  // Initialize viewer with living room tour on startup
  initPhotoSphereViewer(tourPanoramas.living);

  // Handle tour scene switching
  tourBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tourBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tourKey = btn.getAttribute('data-tour');
      if (tourPanoramas[tourKey]) {
        initPhotoSphereViewer(tourPanoramas[tourKey]);
      }
    });
  });

  // ------------------------------------------------------------------------
  // 7. TESTIMONIAL SLIDER (AUTO-SCROLL WITH MANUAL OVERRIDE)
  // ------------------------------------------------------------------------
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const prevTestiBtn = document.querySelector('.testi-prev');
  const nextTestiBtn = document.querySelector('.testi-next');
  let currentTesti = 0;
  let testiInterval = null;

  function showTestimonial(index) {
    testimonialCards.forEach((card, idx) => {
      card.style.display = idx === index ? 'block' : 'none';
    });
  }

  function nextTestimonial() {
    currentTesti = (currentTesti + 1) % testimonialCards.length;
    showTestimonial(currentTesti);
  }

  function prevTestimonial() {
    currentTesti = (currentTesti - 1 + testimonialCards.length) % testimonialCards.length;
    showTestimonial(currentTesti);
  }

  function startTestiAutoScroll() {
    if (testimonialCards.length > 1) {
      if (testiInterval) clearInterval(testiInterval);
      testiInterval = setInterval(nextTestimonial, 5000);
    }
  }

  if (testimonialCards.length > 0) {
    showTestimonial(0);
    startTestiAutoScroll();

    if (prevTestiBtn) {
      prevTestiBtn.addEventListener('click', () => {
        prevTestimonial();
        startTestiAutoScroll(); // restart auto-scroll timer on manual click
      });
    }

    if (nextTestiBtn) {
      nextTestiBtn.addEventListener('click', () => {
        nextTestimonial();
        startTestiAutoScroll(); // restart auto-scroll timer on manual click
      });
    }
  }

  // ------------------------------------------------------------------------
  // 8. APPOINTMENT BOOKING FORM VALIDATION & TOAST
  // ------------------------------------------------------------------------
  const bookingForm = document.getElementById('appointment-form');
  const toastNotification = document.getElementById('toast-notification');

  function showToast(message) {
    if (!toastNotification) return;
    toastNotification.querySelector('.toast-msg').textContent = message;
    toastNotification.classList.add('show');
    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 4500);
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('book-name').value.trim();
      const phone = document.getElementById('book-phone').value.trim();
      const email = document.getElementById('book-email').value.trim();
      const date = document.getElementById('book-date').value;

      if (!name || !phone || !email || !date) {
        showToast('Please fill out all required fields.');
        return;
      }

      // Basic Phone & Email check
      const phoneRegex = /^[0-9+\s-]{8,15}$/;
      if (!phoneRegex.test(phone)) {
        showToast('Please enter a valid phone number.');
        return;
      }

      /* 
       * Backend Integration Comment:
       * Here you can send form data via fetch() to your backend API, Google Forms endpoint, or Calendly webhook.
       * Example:
       * fetch('/api/book-appointment', { method: 'POST', body: JSON.stringify(formData) });
       */

      showToast('Thank you! Your appointment request has been received. Our lead designer will contact you within 24 hours.');
      bookingForm.reset();
    });
  }

  // ------------------------------------------------------------------------
  // 9. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // ------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.service-card, .step-card, .portfolio-item, .contact-info-card, .about-images-wrapper');

  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    revealObserver.observe(el);
  });
});
