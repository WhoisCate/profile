// Khởi tạo GSAP và ScrollTrigger
document.addEventListener("DOMContentLoaded", () => {
  // Đăng ký ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Initialize particles.js
  particlesJS("particles-js", {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#ffffff",
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000",
        },
        polygon: {
          nb_sides: 5,
        },
      },
      opacity: {
        value: 0.5,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.1,
          sync: false,
        },
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 0.1,
          sync: false,
        },
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#ffffff",
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200,
        },
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "grab",
        },
        onclick: {
          enable: true,
          mode: "push",
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 140,
          line_linked: {
            opacity: 1,
          },
        },
        bubble: {
          distance: 400,
          size: 40,
          duration: 2,
          opacity: 8,
          speed: 3,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
        push: {
          particles_nb: 4,
        },
        remove: {
          particles_nb: 2,
        },
      },
    },
    retina_detect: true,
  });

  // Create animations for each tab content
  const tabContents = document.querySelectorAll(".tab-content");

  tabContents.forEach((content) => {
    // Create staggered animations for elements inside each tab
    const elements = content.querySelectorAll(
      "h1, h2, h3, p, .info-item, .donate-method, .social-icons, .skills, .profile-img-container, .author-section, .skill-item, .project-card, .timeline-item, .blog-post, .form-group"
    );

    gsap.set(elements, { opacity: 0, y: 30 });

    ScrollTrigger.create({
      trigger: content,
      start: "top 80%",
      onEnter: () => {
        if (content.classList.contains("active")) {
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
          });
        }
      },
      onLeaveBack: () => {
        gsap.to(elements, {
          opacity: 0,
          y: 30,
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.in",
        });
      },
    });
  });

  // Handle tab switching
  const menuItems = document.querySelectorAll(".menu-item");
  const tabContentsArray = Array.from(tabContents);
  let currentTabIndex = 0;

  function switchTab(index) {
    if (index < 0 || index >= tabContentsArray.length) return;

    // Remove active class from all menu items and tab contents
    menuItems.forEach((item) => item.classList.remove("active"));
    tabContentsArray.forEach((tab) => {
      tab.classList.remove("active");
      // Reset scroll position to top
      tab.scrollTop = 0;
    });

    // Add active class to selected menu item and tab content
    menuItems[index].classList.add("active");
    tabContentsArray[index].classList.add("active");

    currentTabIndex = index;

    // Trigger animations for the active tab
    const elements = tabContentsArray[index].querySelectorAll(
      "h1, h2, h3, p, .info-item, .donate-method, .social-icons, .skills, .profile-img-container, .author-section, .skill-item, .project-card, .timeline-item, .blog-post, .form-group"
    );

    gsap.fromTo(
      elements,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      }
    );

    // Refresh ScrollTrigger
    ScrollTrigger.refresh();
  }

  // Add click event listeners to menu items
  menuItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      switchTab(index);
    });
  });

  // Handle mouse wheel navigation between tabs
  let isScrolling = false;
  window.addEventListener("wheel", (event) => {
    if (isScrolling) return;

    const activeTab = tabContentsArray[currentTabIndex];
    const scrollTop = activeTab.scrollTop;
    const scrollHeight = activeTab.scrollHeight;
    const clientHeight = activeTab.clientHeight;
    const isAtTop = scrollTop === 0;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1; // Small buffer for rounding errors

    // Scroll down
    if (event.deltaY > 0) {
      // If not at the bottom of the current tab, allow scrolling within the tab
      if (!isAtBottom) {
        return;
      }
      // If at the bottom and not the last tab, switch to the next tab
      if (currentTabIndex < tabContentsArray.length - 1) {
        isScrolling = true;
        setTimeout(() => {
          isScrolling = false;
        }, 800);
        switchTab(currentTabIndex + 1);
      }
    }
    // Scroll up
    else if (event.deltaY < 0) {
      // If not at the top of the current tab, allow scrolling within the tab
      if (!isAtTop) {
        return;
      }
      // If at the top and not the first tab, switch to the previous tab
      if (currentTabIndex > 0) {
        isScrolling = true;
        setTimeout(() => {
          isScrolling = false;
        }, 800);
        switchTab(currentTabIndex - 1);
      }
    }
  });

  // Add touch swipe support for mobile
  let touchStartY = 0;
  let touchEndY = 0;

  document.addEventListener(
    "touchstart",
    (e) => {
      touchStartY = e.changedTouches[0].screenY;
    },
    false
  );

  document.addEventListener(
    "touchend",
    (e) => {
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    },
    false
  );

  function handleSwipe() {
    if (isScrolling) return;

    const activeTab = tabContentsArray[currentTabIndex];
    const scrollTop = activeTab.scrollTop;
    const scrollHeight = activeTab.scrollHeight;
    const clientHeight = activeTab.clientHeight;
    const isAtTop = scrollTop === 0;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

    const swipeDistance = touchStartY - touchEndY;

    if (swipeDistance > 50) {
      // Swipe up - go to next tab if at bottom
      if (!isAtBottom) return;
      if (currentTabIndex < tabContentsArray.length - 1) {
        isScrolling = true;
        setTimeout(() => {
          isScrolling = false;
        }, 800);
        switchTab(currentTabIndex + 1);
      }
    } else if (swipeDistance < -50) {
      // Swipe down - go to previous tab if at top
      if (!isAtTop) return;
      if (currentTabIndex > 0) {
        isScrolling = true;
        setTimeout(() => {
          isScrolling = false;
        }, 800);
        switchTab(currentTabIndex - 1);
      }
    }
  }

  // Set up social media links
  const links = {
    facebook: "https://www.facebook.com/27.septt/",
    instagram: "https://www.instagram.com/catehehe_/",
    tiktok: "https://www.tiktok.com/@tunz2001",
    github: "https://github.com/WhoisCate",
    messenger: "https://m.me/27.septt",
    telegram: "https://t.me/whoiscate",
    email: "xuantungofficial@gmail.com",
  };

  // Set href attributes for social links
  document.getElementById("facebook").href = links.facebook;
  document.getElementById("instagram").href = links.instagram;
  document.getElementById("tiktok").href = links.tiktok;
  document.getElementById("github").href = links.github;
  document.getElementById("author-facebook").href = links.facebook;
  document.getElementById("author-messenger").href = links.messenger;
  document.getElementById("author-telegram").href = links.telegram;
  document.getElementById("author-email").href = links.email;

  // Handle contact button click
  const contactBtn = document.querySelector(".contact-btn");
  contactBtn.addEventListener("click", (event) => {
    event.preventDefault();
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = "tel:+84765539201";
    } else {
      window.location.href = "mailto:xuantungofficial@gmail.com";
    }
  });

  // Handle form submission (placeholder logic)
  const contactForm = document.querySelector(".contact-form form");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      alert("Cảm ơn bạn đã gửi tin nhắn! Hiện tại form này chỉ là placeholder, chưa có backend xử lý.");
    });
  }

  // Handle scroll to top button
  const scrollToTopBtn = document.querySelector(".scroll-to-top");

  if (scrollToTopBtn) {
    // Show/hide button based on current tab
    function updateScrollButton() {
      if (currentTabIndex > 0) {
        scrollToTopBtn.classList.add("active");
      } else {
        scrollToTopBtn.classList.remove("active");
      }
    }

    // Update button state when switching tabs
    window.addEventListener("wheel", updateScrollButton);
    document.addEventListener("touchend", updateScrollButton);

    // Add click event to scroll to top/first tab
    scrollToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      switchTab(0);
    });
  }

  // Add hover effects with GSAP
  const hoverElements = document.querySelectorAll(
    ".social-icon, .social-circle, .donate-method, .contact-btn, .skill-item, .project-card, .blog-post, .submit-btn, .post-btn, .project-btn"
  );

  hoverElements.forEach((element) => {
    element.addEventListener("mouseenter", function () {
      gsap.to(this, {
        y: -5,
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    element.addEventListener("mouseleave", function () {
      gsap.to(this, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });

  // Animate progress bars on Skills tab
  const skillsTab = document.querySelector("#skills");
  const progressBars = document.querySelectorAll(".progress");

  ScrollTrigger.create({
    trigger: skillsTab,
    start: "top 80%",
    onEnter: () => {
      if (skillsTab.classList.contains("active")) {
        progressBars.forEach((bar) => {
          const width = bar.style.width;
          gsap.fromTo(
            bar,
            { width: 0 },
            {
              width: width,
              duration: 1.5,
              ease: "power3.out",
            }
          );
        });
      }
    },
  });

  // Hide loading overlay when page is fully loaded
  window.addEventListener("load", () => {
    const loadingOverlay = document.querySelector(".loading-overlay");
    setTimeout(() => {
      loadingOverlay.classList.add("loaded");
    }, 500); // Delay to ensure loading animation is visible for a short time
  });

  // Make global functions available
  window.switchTab = switchTab;
});