/**
 * IndeVets - Interactive Platform Logic
 * Salary Estimator, Modals, Testimonial Toggles & Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSalaryEstimator();
  initTestimonialsToggle();
  initModals();
  initStatsCounter();
});

/* ==========================================================================
   Navigation & Mobile Menu
   ========================================================================== */
function initNavbar() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
      const isExpanded = navMenu.classList.contains('mobile-open');
      toggleBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        navMenu.classList.remove('mobile-open');
      }
    });

    // Smooth scroll for nav links
    document.querySelectorAll('.nav-link, a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId.startsWith('#') && targetId.length > 1) {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            navMenu.classList.remove('mobile-open');
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
  }
}

/* ==========================================================================
   Interactive Shift & Salary Estimator
   ========================================================================== */
function initSalaryEstimator() {
  const daysSlider = document.getElementById('daysPerWeekSlider');
  const daysDisplay = document.getElementById('daysValueDisplay');
  const salaryDisplay = document.getElementById('estimatedSalaryDisplay');
  const ptoDisplay = document.getElementById('estimatedPtoDisplay');
  const ceDisplay = document.getElementById('estimatedCeDisplay');
  const matchDisplay = document.getElementById('estimatedMatchDisplay');
  const roleButtons = document.querySelectorAll('.role-toggle-btn');

  if (!daysSlider) return;

  let currentRole = 'gp'; // 'gp' or 'er'

  // Rates definition: Base day rate according to clinical specialty
  const salaryConfig = {
    gp: {
      dailyRate: 640,         // ~$166,400 for 5 days/wk
      baseCe: 2500,
      cePerDay: 500,
      ptoPerDay: 4            // 4 days PTO per day worked/wk
    },
    er: {
      dailyRate: 850,         // ~$221,000 for 5 days/wk
      baseCe: 3500,
      cePerDay: 600,
      ptoPerDay: 4.5
    }
  };

  function updateCalculations() {
    const days = parseInt(daysSlider.value, 10);
    const config = salaryConfig[currentRole];

    // Total estimated annual salary (52 weeks basis)
    const annualSalary = Math.round(days * config.dailyRate * 52);
    const ptoDays = Math.round(days * config.ptoPerDay);
    const ceAllowance = config.baseCe + (days * config.cePerDay);
    const match401k = Math.round(annualSalary * 0.04);

    // Update DOM
    if (daysDisplay) {
      daysDisplay.textContent = `${days} ${days === 1 ? 'Day' : 'Days'} / Week`;
    }

    if (salaryDisplay) {
      salaryDisplay.innerHTML = `$${annualSalary.toLocaleString()} <span>/ year</span>`;
    }

    if (ptoDisplay) {
      ptoDisplay.textContent = `${ptoDays} Paid Days Off`;
    }

    if (ceDisplay) {
      ceDisplay.textContent = `$${ceAllowance.toLocaleString()} Annual Stipend`;
    }

    if (matchDisplay) {
      matchDisplay.textContent = `$${match401k.toLocaleString()} (4% Match)`;
    }
  }

  daysSlider.addEventListener('input', updateCalculations);

  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      roleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentRole = btn.dataset.role || 'gp';
      updateCalculations();
    });
  });

  // Initial calculation
  updateCalculations();
}

/* ==========================================================================
   Testimonials Tabs Toggle ("From Doctors" vs "From Hospitals")
   ========================================================================== */
function initTestimonialsToggle() {
  const tabs = document.querySelectorAll('.tab-btn');
  const testimonials = document.querySelectorAll('.testi-card');

  const testimonialsData = {
    doctors: [
      {
        quote: "IndeVets gave me my life back. I work 3 shifts a week, have full medical benefits and paid vacation, and zero office politics. I actually love practicing veterinary medicine again.",
        name: "Dr. Kelly Morgan, DVM",
        title: "Associate IndeVet (Philadelphia, PA)",
        avatarText: "KM"
      },
      {
        quote: "No relief agency does it like IndeVets. Being a salaried W-2 employee with dedicated advocacy support means I focus 100% on patients without worrying about insurance or taxes.",
        name: "Dr. James Sterling, VMD",
        title: "Emergency Relief IndeVet (Boston, MA)",
        avatarText: "JS"
      },
      {
        quote: "The IndeVets community is unparalleled. CE events, mentorship from medical directors, and complete autonomy over my schedule. Best career decision I ever made.",
        name: "Dr. Amara Patel, DVM",
        title: "Lead IndeVet (Charlotte, NC)",
        avatarText: "AP"
      }
    ],
    hospitals: [
      {
        quote: "IndeVets doctors show up prepared, energized, and seamlessly step into our fast-paced workflow. Our technicians and clients love them, and our full-time staff can finally take time off.",
        name: "Dr. Gregory Vance, Medical Director",
        title: "Valley Animal Hospital (AAHA Accredited)",
        avatarText: "GV"
      },
      {
        quote: "The VetFit matching is real. Every IndeVet we've hosted has been top notch — clinically sharp, compassionate, and zero ego. Scheduling shifts on the portal takes under 30 seconds.",
        name: "Rachel Collins, CVPM",
        title: "Practice Manager, Metro Veterinary Group",
        avatarText: "RC"
      },
      {
        quote: "Finding reliable emergency relief used to keep me up at night. With IndeVets, we have credentialed, trusted doctors booked months in advance without exorbitant recruiter fees.",
        name: "Dr. Mark Richardson, DVM",
        title: "Chief of Staff, Northside Pet Emergency",
        avatarText: "MR"
      }
    ]
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetCategory = tab.dataset.category || 'doctors';
      const items = testimonialsData[targetCategory];

      testimonials.forEach((card, index) => {
        if (items && items[index]) {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';

          setTimeout(() => {
            const quoteEl = card.querySelector('.quote-text');
            const nameEl = card.querySelector('.author-meta h4');
            const titleEl = card.querySelector('.author-meta p');
            const avatarEl = card.querySelector('.author-avatar');

            if (quoteEl) quoteEl.textContent = `"${items[index].quote}"`;
            if (nameEl) nameEl.textContent = items[index].name;
            if (titleEl) titleEl.textContent = items[index].title;
            if (avatarEl) avatarEl.textContent = items[index].avatarText;

            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 150);
        }
      });
    });
  });
}

/* ==========================================================================
   Modals & Lead Capture
   ========================================================================== */
function initModals() {
  const vetModal = document.getElementById('doctorApplyModal');
  const hospitalModal = document.getElementById('hospitalPartnerModal');
  const closeButtons = document.querySelectorAll('.modal-close-btn, .modal-overlay');

  // Trigger buttons
  document.querySelectorAll('[data-open-modal="doctor"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (vetModal) vetModal.classList.add('active');
    });
  });

  document.querySelectorAll('[data-open-modal="hospital"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (hospitalModal) hospitalModal.classList.add('active');
    });
  });

  // Close handlers
  closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target === btn) {
        if (vetModal) vetModal.classList.remove('active');
        if (hospitalModal) hospitalModal.classList.remove('active');
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (vetModal) vetModal.classList.remove('active');
      if (hospitalModal) hospitalModal.classList.remove('active');
    }
  });

  // Form submissions
  const doctorForm = document.getElementById('doctorApplyForm');
  if (doctorForm) {
    doctorForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = doctorForm.querySelector('input[name="fullname"]').value || 'Doctor';
      if (vetModal) vetModal.classList.remove('active');
      doctorForm.reset();
      showToast(`Thank you, ${name}! Your application has been received. Our clinical director will reach out within 24 hours.`);
    });
  }

  const hospitalForm = document.getElementById('hospitalPartnerForm');
  if (hospitalForm) {
    hospitalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const clinic = hospitalForm.querySelector('input[name="hospital_name"]').value || 'Hospital';
      if (hospitalModal) hospitalModal.classList.remove('active');
      hospitalForm.reset();
      showToast(`Thank you! Our hospital partnership team will contact ${clinic} today.`);
    });
  }
}

/* ==========================================================================
   Toast Notifications
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('siteToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'siteToast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* ==========================================================================
   Statistics Counter Animation
   ========================================================================== */
function initStatsCounter() {
  const statElements = document.querySelectorAll('[data-counter-target]');
  if (!statElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-counter-target'), 10);
        const prefix = el.getAttribute('data-counter-prefix') || '';
        const suffix = el.getAttribute('data-counter-suffix') || '';
        animateValue(el, 0, target, 1800, prefix, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  statElements.forEach(el => observer.observe(el));
}

function animateValue(obj, start, end, duration, prefix = '', suffix = '') {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeOutQuad = 1 - (1 - progress) * (1 - progress);
    const current = Math.floor(easeOutQuad * (end - start) + start);
    obj.textContent = `${prefix}${current.toLocaleString()}${suffix}`;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}
