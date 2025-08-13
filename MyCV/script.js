// Toggle course details
function toggleDetails(courseId) {
  const details = document.getElementById(`details-${courseId}`);
  const button = document.querySelector(`[data-course="${courseId}"] .details-btn`);
  if (!details || !button) return;

  if (details.classList.contains('show')) {
    details.classList.remove('show');
    button.innerHTML = '<i class="fas fa-info-circle"></i> Details';
  } else {
    document.querySelectorAll('.course-details').forEach(detail => {
      detail.classList.remove('show');
    });
    document.querySelectorAll('.details-btn').forEach(btn => {
      btn.innerHTML = '<i class="fas fa-info-circle"></i> Details';
    });
    details.classList.add('show');
    button.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Details';
  }
}

// View certificate function
function viewCertificate(courseId) {
  const modal = document.getElementById('certModal');
  if (modal) {
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
  }
}

function closeCertModal() {
  const modal = document.getElementById('certModal');
  if (modal) {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }
}

// Basic anti-copy protections (non-intrusive but bypassable)
(() => {
  const prevent = (e) => e.preventDefault();

  // Disable right-click context menu
  document.addEventListener('contextmenu', prevent);

  // Block copy/cut/paste/drag/selectstart
  ['copy', 'cut', 'paste', 'dragstart', 'selectstart'].forEach(evt => {
    document.addEventListener(evt, prevent);
  });

  // Block common shortcuts (best-effort)
  document.addEventListener('keydown', (e) => {
    const k = e.key?.toLowerCase?.() || '';
    if (e.key === 'F12') return e.preventDefault();
    if (e.ctrlKey && e.shiftKey && (k === 'i' || k === 'c' || k === 'j')) return e.preventDefault();
    if (e.ctrlKey && ['c','x','s','p','u','a'].includes(k)) return e.preventDefault();
  });

  // Try to mitigate PrintScreen
  window.addEventListener('keyup', (e) => {
    if (e.key === 'PrintScreen') {
      navigator.clipboard.writeText('Screenshots are disabled').catch(() => {});
      alert('تم تعطيل تصوير الشاشة في هذا الموقع.');
    }
  });
})();

// Add interactive effects on page load
document.addEventListener('DOMContentLoaded', function () {
  // Wire up print button
  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  // Hide specific labels during print only
  let _hiddenForPrint = [];
  const hideSkillsSummaryForPrint = () => {
    _hiddenForPrint = [];
    const candidates = document.querySelectorAll('h1,h2,h3,h4,h5,h6,.section-title,.section-subtitle,.item-title');
    candidates.forEach(el => {
      const txt = (el.textContent || '').trim().toLowerCase();
      if (txt.includes('skills summary')) {
        _hiddenForPrint.push(el);
        el.dataset._prevDisplay = el.style.display || '';
        el.style.display = 'none';
      }
    });
  };
  const restoreAfterPrint = () => {
    _hiddenForPrint.forEach(el => {
      el.style.display = el.dataset._prevDisplay || '';
      delete el.dataset._prevDisplay;
    });
    _hiddenForPrint = [];
  };
  window.addEventListener('beforeprint', hideSkillsSummaryForPrint);
  window.addEventListener('afterprint', restoreAfterPrint);

  // Wire up details buttons
  document.querySelectorAll('.details-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const host = this.closest('[data-course]');
      if (!host) return;
      const cid = host.getAttribute('data-course');
      toggleDetails(cid);
    });
  });

  // Wire up certificate buttons
  document.querySelectorAll('.certificate-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const host = this.closest('[data-course]');
      const cid = host ? host.getAttribute('data-course') : '';
      viewCertificate(cid);
    });
  });

  // Modal close
  const modalClose = document.querySelector('.modal-close');
  if (modalClose) {
    modalClose.addEventListener('click', closeCertModal);
  }

  // Skill bars animation on scroll
  const skillBars = document.querySelectorAll('.skill-progress');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'skillLoad 2s ease-out';
      }
    });
  });
  skillBars.forEach(bar => observer.observe(bar));

  // Course cards hover effects
  const courseCards = document.querySelectorAll('.course-card');
  courseCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Add scroll-based animations
  const sections = document.querySelectorAll('.section');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    sectionObserver.observe(section);
  });
});
