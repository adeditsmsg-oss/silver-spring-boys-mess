/**
 * ==========================================================================
 * INTERACTIVE SCRIPTS: SILVER SPRING BOYS MESS
 * Handles Navbar sticky states, mobile responsive dropdowns, package tab switching,
 * FAQ accordions, popup modals, WhatsApp integration, and booking forms.
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {

  // 1. Floating Navbar Scroll Effect
  const navbarContainer = document.querySelector(".floating-navbar-container");
  
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbarContainer.classList.add("scrolled");
    } else {
      navbarContainer.classList.remove("scrolled");
    }
  });

  // 2. Mobile Navigation Toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      const icon = mobileMenuBtn.querySelector("i");
      if (navLinks.classList.contains("active")) {
        icon.classList.replace("fa-bars", "fa-xmark");
      } else {
        icon.classList.replace("fa-xmark", "fa-bars");
      }
    });

    // Close menu when clicking links
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        mobileMenuBtn.querySelector("i").classList.replace("fa-xmark", "fa-bars");
      });
    });
  }

  // 3. Smooth Active Link Highlighting on Scroll
  const sections = document.querySelectorAll("section");
  const navAnchorLinks = document.querySelectorAll(".nav-links a");

  window.addEventListener("scroll", () => {
    let currentSection = "";

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 180)) {
        currentSection = section.getAttribute("id");
      }
    });

    navAnchorLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  });

  // 4. Room Packages Tabs Switcher
  const tabBtns = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".room-panel");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove active states
      tabBtns.forEach(b => b.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));

      // Set active
      btn.classList.add("active");
      const targetPanelId = `panel-${btn.dataset.tab}`;
      const targetPanel = document.getElementById(targetPanelId);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });
  });

  // 5. FAQ Accordion Click Expand
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach(question => {
    question.addEventListener("click", () => {
      const faqItem = question.parentElement;
      const isActive = faqItem.classList.contains("active");

      // Collapse all other items
      document.querySelectorAll(".faq-item").forEach(item => {
        item.classList.remove("active");
      });

      // Toggle active status
      if (!isActive) {
        faqItem.classList.add("active");
      }
    });
  });

  // 6. Testimonials Slider Micro-Interaction (Native Swipe + Click Scroll)
  const dots = document.querySelectorAll(".slider-dots .dot");
  const testimonialsSlider = document.querySelector(".testimonials-slider");
  const testimonialCards = document.querySelectorAll(".testimonial-card");

  if (dots.length > 0 && testimonialsSlider) {
    // Click on dots to scroll to the corresponding card
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        dots.forEach(d => d.classList.remove("active"));
        dot.classList.add("active");

        // Scroll testimonials slider to correct item
        const cardWidth = testimonialCards[0].offsetWidth;
        const gap = 20; // grid/flex gap in CSS
        testimonialsSlider.scrollTo({
          left: index * (cardWidth + gap),
          behavior: "smooth"
        });

        // Opacity styling for focus
        testimonialCards.forEach((card, idx) => {
          if (idx === index) {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          } else {
            card.style.opacity = "0.7";
            card.style.transform = "scale(0.98)";
          }
        });
      });
    });

    // Update active dot on scroll (native swipe tracking)
    let isScrolling;
    testimonialsSlider.addEventListener("scroll", () => {
      window.clearTimeout(isScrolling);
      isScrolling = setTimeout(() => {
        const cardWidth = testimonialCards[0].offsetWidth;
        const gap = 20;
        const scrollPosition = testimonialsSlider.scrollLeft;
        const activeIndex = Math.round(scrollPosition / (cardWidth + gap));
        
        if (activeIndex >= 0 && activeIndex < dots.length) {
          dots.forEach(d => d.classList.remove("active"));
          if (dots[activeIndex]) {
            dots[activeIndex].classList.add("active");
          }
          
          testimonialCards.forEach((card, idx) => {
            if (idx === activeIndex) {
              card.style.opacity = "1";
              card.style.transform = "scale(1)";
            } else {
              card.style.opacity = "0.7";
              card.style.transform = "scale(0.98)";
            }
          });
        }
      }, 80);
    });
  }

  // 7. Modals Control (Weekly Menu & Booking Success)
  const menuModal = document.getElementById("menu-modal");
  const successModal = document.getElementById("success-modal");
  const viewMenuTrigger = document.getElementById("view-menu-trigger");
  const closeBtns = document.querySelectorAll(".modal-close-btn, .btn-success-close");

  if (viewMenuTrigger && menuModal) {
    viewMenuTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      menuModal.classList.add("active");
      document.body.style.overflow = "hidden"; // Disable scroll
    });
  }

  closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (menuModal) menuModal.classList.remove("active");
      if (successModal) successModal.classList.remove("active");
      document.body.style.overflow = "auto"; // Re-enable scroll
    });
  });

  // Close modal clicking overlay
  window.addEventListener("click", (e) => {
    if (e.target === menuModal) {
      menuModal.classList.remove("active");
      document.body.style.overflow = "auto";
    }
    if (e.target === successModal) {
      successModal.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });

  // 8. Auto-populate Package Selector from card triggers
  const roomBookTriggers = document.querySelectorAll(".room-book-trigger");
  const roomPrefSelector = document.getElementById("room_pref");

  roomBookTriggers.forEach(trigger => {
    trigger.addEventListener("click", (e) => {
      const selectedPlan = trigger.dataset.room;
      if (roomPrefSelector && selectedPlan) {
        // Match the selector value by searching for matching text in options
        for (let option of roomPrefSelector.options) {
          if (option.text.toLowerCase().includes(selectedPlan.toLowerCase())) {
            roomPrefSelector.value = option.value;
            break;
          }
        }
      }
    });
  });

  // 9. Lead Capture Form Submission Handler
  const leadForm = document.getElementById("lead-capture-form");
  const quickInquiryForm = document.getElementById("quick-inquiry-form");

  if (quickInquiryForm) {
    quickInquiryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // Scroll to main form and focus name
      const targetElement = document.getElementById("inquiry");
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
        const nameInput = document.getElementById("name");
        if (nameInput) nameInput.focus();
      }
    });
  }

  if (leadForm) {
    leadForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Gather form values
      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const planSelect = document.getElementById("room_pref");
      const selectedPlanName = planSelect.options[planSelect.selectedIndex].text;
      const userMessage = document.getElementById("message").value.trim();

      // Show success popup
      if (successModal) {
        successModal.classList.add("active");
        document.body.style.overflow = "hidden";
      }

      // Compile data for WhatsApp redirect
      const whatsappBaseNumber = "918016801695";
      const prewrittenText = `Hi Silver Spring Boys Mess,\n\nI want to submit a booking inquiry:\n- *Name*: ${name}\n- *Phone*: ${phone}\n- *Preferred Plan*: ${selectedPlanName}\n- *Message/Details*: ${userMessage || "No comments"}\n\nPlease confirm availability for August admissions.`;
      
      const encodedText = encodeURIComponent(prewrittenText);
      const whatsappRedirectUrl = `https://wa.me/${whatsappBaseNumber}?text=${encodedText}`;

      // Reset Form fields
      leadForm.reset();

      // Open WhatsApp in a new tab after 2 seconds
      setTimeout(() => {
        window.open(whatsappRedirectUrl, "_blank");
      }, 2000);
    });
  }

});
