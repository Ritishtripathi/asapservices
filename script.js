// ASAP homepage interactions
document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("siteHeader");
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");

  const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 35);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Toggle navigation");
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  const slides = [...document.querySelectorAll(".hero-slide")];
  const current = document.querySelector(".current-slide");
  const progress = document.querySelector(".pagination-line i");
  let active = 0;
  let timer;

  function showSlide(index) {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("active", i === active));
    current.textContent = String(active + 1).padStart(2, "0");
    progress.style.width = `${((active + 1) / slides.length) * 100}%`;
  }
  function restartTimer() {
    clearInterval(timer);
    timer = setInterval(() => showSlide(active + 1), 6500);
  }
  document.querySelector(".slide-prev").addEventListener("click", () => {
    showSlide(active - 1);
    restartTimer();
  });
  document.querySelector(".slide-next").addEventListener("click", () => {
    showSlide(active + 1);
    restartTimer();
  });
  showSlide(0);
  restartTimer();

  document.getElementById("year").textContent = new Date().getFullYear();

  // Gentle reveal animation for content blocks
  const revealItems = document.querySelectorAll(
    ".service-card, .process-grid article, .industry-card, .why-points article, .testimonial-grid blockquote"
  );
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => {
      item.classList.add("will-reveal");
      observer.observe(item);
    });
  }


  // Five-card testimonial carousel: auto-advance, arrows and dots
  const track = document.querySelector(".testimonial-track");
  const cards = [...document.querySelectorAll(".testimonial-card")];
  const dotsWrap = document.querySelector(".testimonial-dots");
  const prevTestimonial = document.querySelector(".testimonial-prev");
  const nextTestimonial = document.querySelector(".testimonial-next");
  let testimonialIndex = 0;
  let testimonialTimer;

  const visibleTestimonials = () => window.innerWidth <= 650 ? 1 : window.innerWidth <= 900 ? 2 : 3;
  const maxTestimonialIndex = () => Math.max(0, cards.length - visibleTestimonials());

  function renderTestimonials() {
    if (!track || !cards.length) return;
    testimonialIndex = Math.min(testimonialIndex, maxTestimonialIndex());
    const gap = 16;
    const cardWidth = cards[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${testimonialIndex * (cardWidth + gap)}px)`;
    [...dotsWrap.children].forEach((dot, i) => dot.classList.toggle("active", i === testimonialIndex));
  }

  function buildTestimonialDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = "";
    for (let i = 0; i <= maxTestimonialIndex(); i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Show feedback group ${i + 1}`);
      dot.addEventListener("click", () => { testimonialIndex = i; renderTestimonials(); restartTestimonials(); });
      dotsWrap.appendChild(dot);
    }
  }

  function moveTestimonial(direction) {
    testimonialIndex += direction;
    if (testimonialIndex > maxTestimonialIndex()) testimonialIndex = 0;
    if (testimonialIndex < 0) testimonialIndex = maxTestimonialIndex();
    renderTestimonials();
  }

  function stopTestimonials() { clearInterval(testimonialTimer); }
  function restartTestimonials() {
    stopTestimonials();
    if (maxTestimonialIndex() > 0) testimonialTimer = setInterval(() => moveTestimonial(1), 5200);
  }

  if (track && cards.length && dotsWrap) {
    buildTestimonialDots();
    renderTestimonials();
    restartTestimonials();
    nextTestimonial?.addEventListener("click", () => { moveTestimonial(1); restartTestimonials(); });
    prevTestimonial?.addEventListener("click", () => { moveTestimonial(-1); restartTestimonials(); });
    const carousel = document.querySelector(".testimonial-carousel");
    carousel.addEventListener("mouseenter", stopTestimonials);
    carousel.addEventListener("mouseleave", restartTestimonials);
    window.addEventListener("resize", () => { testimonialIndex = 0; buildTestimonialDots(); renderTestimonials(); });
  }

});
