/**
 * ANGGA LAS - BODY REPAIR & CAT DUCO (CIBITUNG, BEKASI)
 * Clean, Modern Interactions:
 * 1. Status Bengkel Real-Time (WIB)
 * 2. Before-After Comparison Slider & Case Switcher
 * 3. Rangkai Format Pertanyaan WhatsApp (Template Generator)
 * 4. Gallery Lightbox Modal
 * 5. Counter & Scroll Animations
 * 6. Copy Alamat & Toast Feedback
 */

// Nomor WhatsApp Resmi Pak Wahyu Permana (Pemilik Angga Las)
const WA_PHONE_NUMBER = "6289531168549";

// ============================================================
// 1. DATA KASUS NYATA BEFORE & AFTER (TRANSFORMASI BENGKEL)
// ============================================================
const comparisonCases = {
  avanza: {
    beforeImg: "gambar/IMG-20261021-WA0097.jpg",
    afterImg: "gambar/IMG-20261021-WA0096.jpg",
    beforeAlt: "Sebelum: Mobil Avanza B 1407 FFH ringsek parah bagian depan akibat tabrakan",
    afterAlt: "Sesudah: Mobil Avanza selesai diperbaiki presisi dan disemprot cat silver mulus",
    beforeLabel: "SEBELUM: TABRAKAN PARAH",
    afterLabel: "SESUDAH: PRESISI & MULUS TOTAL",
    title: "Perbaikan Bodi Ringsek Bekas Tabrakan Depan (Toyota Avanza)",
    desc: "Kap mesin tertekuk parah, bumper amblas, dan fender hancur diketok presisi kembali ke lekukan aslinya, lalu dicat duco pernis glossy yang menyatu rata."
  },
  truk: {
    beforeImg: "gambar/IMG-20261021-WA0101.jpg",
    afterImg: "gambar/IMG-20261021-WA0100.jpg",
    beforeAlt: "Sebelum: Kabin truk Colt Diesel keropos bolong parah dimakan karat di bagian bawah",
    afterAlt: "Sesudah: Kabin truk Colt Diesel selesai diganti pelat baru dan cat kuning cerah tahan karat",
    beforeLabel: "SEBELUM: KEROPOS & BOLONG",
    afterLabel: "SESUDAH: PELAT BARU & CAT GLOSS",
    title: "Restorasi Kabin Truk Colt Diesel Keropos Karat Parah",
    desc: "Pelat lama yang rapuh dan berkarat dipotong habis, diganti pelat baja baru dengan las karbit kokoh, kemudian disiram cat duco kuning glossy tahan cuaca ekstrem."
  },
  sedan: {
    beforeImg: "gambar/IMG-20261021-WA0092.jpg",
    afterImg: "gambar/IMG-20261021-WA0093.jpg",
    beforeAlt: "Proses: Sedan Corolla Altis B 1672 NQ tahap pengetokan bodi dan dempul dasar rapi",
    afterAlt: "Sesudah: Sedan Corolla Altis selesai cat duco hitam pekat wet look cermin",
    beforeLabel: "PROSES: KETOK & CAT DASAR",
    afterLabel: "SESUDAH: CAT DUCO WET LOOK",
    title: "Pengecatan Duco Full Body & Poles Wet-Look (Toyota Altis)",
    desc: "Baret-baret dan gelombang bodi diratakan sempurna, dilapis cat duco hitam pekat serta pernis clear coat tahan gores dengan kilau cermin (wet look)."
  }
};

// ============================================================
// 2. STATUS OPERASIONAL BENGKEL REAL-TIME (WIB / UTC+7)
// ============================================================
function updateWorkshopLiveStatus() {
  const statusDot = document.getElementById("liveStatusDot");
  const statusText = document.getElementById("liveStatusText");
  const statusPill = document.getElementById("liveStatusPill");

  // Waktu WIB (UTC+7)
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const wibTime = new Date(utc + 3600000 * 7);

  const hours = wibTime.getHours();
  const minutes = wibTime.getMinutes();
  const currentMinutes = hours * 60 + minutes;

  const openMinutes = 8 * 60;   // 08:00 WIB
  const closeMinutes = 17 * 60; // 17:00 WIB

  const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  const statusString = isOpen ? "Buka Hari Ini • 08.00 - 17.00 WIB" : "Bengkel Tutup • Buka Besok 08.00 WIB";

  if (statusDot) statusDot.className = isOpen ? "status-indicator-dot" : "status-indicator-dot closed";
  if (statusPill) statusPill.className = isOpen ? "hero-status-pill open" : "hero-status-pill closed";
  if (statusText) statusText.innerHTML = statusString;
}

// Active State for Before & After Showcase (Default: Mode Berdampingan)
let currentCaseKey = "avanza";
let currentViewMode = "sidebyside";  // "sidebyside" (default) | "slider"

// ============================================================
// 3. BEFORE-AFTER IMAGE SLIDER & VIEW CONTROLS
// ============================================================
function initBeforeAfterSlider() {
  const container = document.getElementById("baSliderContainer");
  const beforeLayer = document.getElementById("baBeforeLayer");
  const afterLayer = document.getElementById("baAfterLayer");
  const beforeLabel = document.getElementById("baLabelBefore");
  const afterLabel = document.getElementById("baLabelAfter");
  const handle = document.getElementById("baHandle");

  if (!container || !afterLayer || !handle) return;

  let isDragging = false;

  function setSliderPosition(xPos) {
    const rect = container.getBoundingClientRect();
    let offsetX = xPos - rect.left;

    // Clamp between 0 and rect.width
    offsetX = Math.max(0, Math.min(offsetX, rect.width));
    const percentage = (offsetX / rect.width) * 100;

    // After Layer: revealed from 0% to handle position
    afterLayer.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
    afterLayer.style.webkitClipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;

    // Before Layer: revealed from handle position to 100% (prevents before text from sticking!)
    if (beforeLayer) {
      beforeLayer.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;
      beforeLayer.style.webkitClipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;
    }

    handle.style.left = `${percentage}%`;

    // Fade labels smoothly near extreme edges
    if (beforeLabel) {
      beforeLabel.style.opacity = percentage > 78 ? "0" : "1";
    }
    if (afterLabel) {
      afterLabel.style.opacity = percentage < 22 ? "0" : "1";
    }
  }

  // Set default initial position to 50%
  if (afterLayer) {
    afterLayer.style.clipPath = "polygon(0 0, 50% 0, 50% 100%, 0 100%)";
    afterLayer.style.webkitClipPath = "polygon(0 0, 50% 0, 50% 100%, 0 100%)";
  }
  if (beforeLayer) {
    beforeLayer.style.clipPath = "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)";
    beforeLayer.style.webkitClipPath = "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)";
  }
  handle.style.left = "50%";

  // Mouse Events
  container.addEventListener("mousedown", (e) => {
    isDragging = true;
    setSliderPosition(e.clientX);
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    setSliderPosition(e.clientX);
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // Touch Events for Mobile
  container.addEventListener("touchstart", (e) => {
    isDragging = true;
    if (e.touches[0]) setSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (!isDragging || !e.touches[0]) return;
    setSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener("touchend", () => {
    isDragging = false;
  });
}

// 3.1 Toggle View Mode: Slider vs Side-by-Side (Berdampingan)
function setComparisonViewMode(mode) {
  currentViewMode = mode;
  const sliderView = document.getElementById("baSliderWrapperView");
  const sbsView = document.getElementById("baSideBySideView");
  const btnSlider = document.getElementById("btnModeSlider");
  const btnSbs = document.getElementById("btnModeSideBySide");

  if (!sliderView || !sbsView) return;

  if (mode === "sidebyside") {
    sliderView.style.display = "none";
    sbsView.style.display = "block";
    if (btnSbs) btnSbs.classList.add("active");
    if (btnSlider) btnSlider.classList.remove("active");
  } else {
    sliderView.style.display = "block";
    sbsView.style.display = "none";
    if (btnSlider) btnSlider.classList.add("active");
    if (btnSbs) btnSbs.classList.remove("active");
  }
}

// 3.2 Open Current Comparison Case in Full Lightbox Modal
function openCurrentCaseLightbox(which = "after") {
  const data = comparisonCases[currentCaseKey];
  if (!data) return;

  if (which === "before") {
    openLightbox(data.beforeImg, `${data.title} — Kondisi Sebelum Pengerjaan`);
  } else {
    openLightbox(data.afterImg, `${data.title} — Hasil Akhir Sesudah Pengerjaan`);
  }
}

// 3.3 Tab Switcher for Real Cases (Sync Slider & Side-by-Side)
function switchComparisonCase(caseKey, buttonElement) {
  currentCaseKey = caseKey;
  const data = comparisonCases[caseKey];
  if (!data) return;

  // Update active state on tab buttons
  document.querySelectorAll(".case-tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  if (buttonElement) {
    buttonElement.classList.add("active");
  }

  // Update container height class for flexible aspect ratios
  const container = document.getElementById("baSliderContainer");
  if (container) {
    container.classList.remove("case-avanza", "case-truk", "case-sedan");
    container.classList.add(`case-${caseKey}`);
  }

  // Update Slider Elements
  const beforeImg = document.getElementById("baImgBefore");
  const afterImg = document.getElementById("baImgAfter");
  const beforeLabel = document.getElementById("baLabelBefore");
  const afterLabel = document.getElementById("baLabelAfter");
  const caseTitle = document.getElementById("baCaseTitle");
  const caseDesc = document.getElementById("baCaseDesc");
  const beforeLayer = document.getElementById("baBeforeLayer");
  const afterLayer = document.getElementById("baAfterLayer");
  const handle = document.getElementById("baHandle");

  if (beforeImg) {
    beforeImg.src = data.beforeImg;
    beforeImg.alt = data.beforeAlt;
  }
  if (afterImg) {
    afterImg.src = data.afterImg;
    afterImg.alt = data.afterAlt;
  }
  if (beforeLabel) {
    beforeLabel.textContent = data.beforeLabel;
    beforeLabel.style.opacity = "1";
  }
  if (afterLabel) {
    afterLabel.textContent = data.afterLabel;
    afterLabel.style.opacity = "1";
  }
  if (caseTitle) caseTitle.textContent = data.title;
  if (caseDesc) caseDesc.textContent = data.desc;

  // Update Side-by-Side Elements
  const sbsImgBefore = document.getElementById("sbsImgBefore");
  const sbsImgAfter = document.getElementById("sbsImgAfter");
  const sbsDescBefore = document.getElementById("sbsDescBefore");
  const sbsDescAfter = document.getElementById("sbsDescAfter");
  const baSbsCaseTitle = document.getElementById("baSbsCaseTitle");
  const baSbsCaseDesc = document.getElementById("baSbsCaseDesc");

  if (sbsImgBefore) sbsImgBefore.src = data.beforeImg;
  if (sbsImgAfter) sbsImgAfter.src = data.afterImg;
  if (sbsDescBefore) sbsDescBefore.textContent = data.beforeAlt;
  if (sbsDescAfter) sbsDescAfter.textContent = data.afterAlt;
  if (baSbsCaseTitle) baSbsCaseTitle.textContent = data.title;
  if (baSbsCaseDesc) baSbsCaseDesc.textContent = data.desc;

  // Reset slider position to 50%
  if (afterLayer) {
    afterLayer.style.clipPath = "polygon(0 0, 50% 0, 50% 100%, 0 100%)";
    afterLayer.style.webkitClipPath = "polygon(0 0, 50% 0, 50% 100%, 0 100%)";
  }
  if (beforeLayer) {
    beforeLayer.style.clipPath = "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)";
    beforeLayer.style.webkitClipPath = "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)";
  }
  if (handle) {
    handle.style.left = "50%";
  }
}

// ============================================================
// 4. RANGKAI FORMAT PERTANYAAN WHATSAPP (TEMPLATE GENERATOR)
// ============================================================
const templateState = {
  vehicle: "Mobil Keluarga (Avanza / Innova / MPV / SUV)",
  service: "Bodi Penyok / Bumper Robek / Ringsek Bekas Tabrakan",
  quality: "Bahan Bagus Berkualitas & Tahan Lama (Rekomendasi)",
  clientName: "",
  damageNote: ""
};

function selectChip(buttonElement, type) {
  const parentGrid = buttonElement.parentElement;
  if (!parentGrid) return;

  // Uncheck siblings
  parentGrid.querySelectorAll(".select-chip").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Set active
  buttonElement.classList.add("active");
  const val = buttonElement.getAttribute("data-value") || buttonElement.innerText.trim();

  if (type === "vehicle") templateState.vehicle = val;
  if (type === "service") templateState.service = val;
  if (type === "quality") templateState.quality = val;

  updateLivePreview();
}

function updateLivePreview() {
  const rawName = document.getElementById("clientName")?.value.trim();
  const rawNotes = document.getElementById("damageNote")?.value.trim();

  templateState.clientName = rawName || "Pelanggan";
  templateState.damageNote = rawNotes || "-";

  const previewText = 
`Halo Pak Wahyu (Angga Las), saya mau konsultasi perbaikan bodi kendaraan:

- Nama: ${templateState.clientName}
- Jenis Kendaraan: ${templateState.vehicle}
- Kondisi / Bagian Rusak: ${templateState.service}
- Pilihan Bahan: ${templateState.quality}
- Catatan Kerusakan: ${templateState.damageNote}

Mohon info estimasi biaya dan perkiraan pengerjaannya ya Pak. Foto/video bagian yang rusak saya kirimkan setelah ini. Terima kasih!`;

  const previewBox = document.getElementById("waMessagePreview");
  if (previewBox) {
    previewBox.textContent = previewText;
  }

  return previewText;
}

function sendCustomWhatsApp() {
  const message = updateLivePreview();
  const encoded = encodeURIComponent(message);
  const waUrl = `https://wa.me/${WA_PHONE_NUMBER}?text=${encoded}`;
  window.open(waUrl, "_blank");
}

// 4.1 Chat Template Popup Modal Controls
function openChatTemplateModal() {
  const modal = document.getElementById("chatTemplateModal");
  if (!modal) return;
  updateLivePreview();
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeChatTemplateModal() {
  const modal = document.getElementById("chatTemplateModal");
  if (!modal) return;
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

function closeChatModalOnBackdrop(event) {
  if (event.target.id === "chatTemplateModal") {
    closeChatTemplateModal();
  }
}

// ============================================================
// 5. GALLERY LIGHTBOX MODAL
// ============================================================
function openLightbox(src, captionText) {
  const modal = document.getElementById("lightboxModal");
  const img = document.getElementById("lightboxImg");
  const caption = document.getElementById("lightboxCaption");

  if (!modal || !img || !caption) return;

  img.src = src;
  caption.textContent = captionText || "";
  modal.classList.add("active");
  document.body.style.overflow = "hidden"; // Lock background scroll
}

function closeLightbox(event) {
  const modal = document.getElementById("lightboxModal");
  if (!modal) return;

  modal.classList.remove("active");
  document.body.style.overflow = ""; // Restore scroll
}

// Close modals on Escape key
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeLightbox();
    closeChatTemplateModal();
  }
});

// ============================================================
// 5.1 AUTO-ADVANCING GALLERY CAROUSEL
// ============================================================
let currentGallerySlide = 0;
let galleryAutoInterval = null;

function setGallerySlide(index) {
  const track = document.getElementById("galleryTrack");
  const slides = document.querySelectorAll(".gallery-slide");
  const dots = document.querySelectorAll(".carousel-dot");
  if (!track || !slides.length) return;

  const total = slides.length;
  currentGallerySlide = (index + total) % total;

  track.style.transform = `translateX(-${currentGallerySlide * 100}%)`;

  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === currentGallerySlide);
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentGallerySlide);
  });
}

function moveGallerySlide(direction) {
  setGallerySlide(currentGallerySlide + direction);
  resetGalleryAutoPlay();
}

function resetGalleryAutoPlay() {
  if (galleryAutoInterval) clearInterval(galleryAutoInterval);
  galleryAutoInterval = setInterval(() => {
    setGallerySlide(currentGallerySlide + 1);
  }, 3800);
}

function initGalleryCarousel() {
  const wrapper = document.getElementById("carouselWrapper");
  if (!wrapper) return;

  setGallerySlide(0);
  resetGalleryAutoPlay();

  // Pause on hover
  wrapper.addEventListener("mouseenter", () => {
    if (galleryAutoInterval) clearInterval(galleryAutoInterval);
  });
  wrapper.addEventListener("mouseleave", () => {
    resetGalleryAutoPlay();
  });

  // Touch swipe support on mobile devices
  let startX = 0;
  wrapper.addEventListener("touchstart", (e) => {
    if (e.touches[0]) startX = e.touches[0].clientX;
  }, { passive: true });

  wrapper.addEventListener("touchend", (e) => {
    if (e.changedTouches[0]) {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) moveGallerySlide(1);
        else moveGallerySlide(-1);
      }
    }
  });
}

// ============================================================
// 6. ANIMATED STAT COUNTERS
// ============================================================
function initAnimatedCounters() {
  const counters = document.querySelectorAll(".stat-number[data-target]");
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute("data-target"), 10);
        let current = 0;
        const step = Math.max(1, Math.floor(target / 40));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target === 0 ? "0" : target.toLocaleString("id-ID");
            clearInterval(timer);
          } else {
            el.textContent = current.toLocaleString("id-ID");
          }
        }, 30);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((c) => observer.observe(c));
}

// ============================================================
// 7. SCROLL REVEAL ANIMATIONS
// ============================================================
function initScrollReveal() {
  const elements = document.querySelectorAll(".reveal-on-scroll");
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });

  elements.forEach((el) => observer.observe(el));
}

// ============================================================
// 8. SCROLL-SPY ACTIVE NAVBAR
// ============================================================
function initScrollSpy() {
  const sections = document.querySelectorAll("header[id], section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}

// ============================================================
// 9. TOAST NOTIFICATIONS & SALIN ALAMAT
// ============================================================
function showToast(message) {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, 3200);
}

function copyAddress() {
  const address = "Wanasari, Kec. Cibitung, Kabupaten Bekasi, Jawa Barat";

  if (navigator.clipboard) {
    navigator.clipboard.writeText(address).then(() => {
      showToast("Alamat bengkel berhasil disalin ke clipboard!");
    }).catch(() => {
      fallbackCopy(address);
    });
  } else {
    fallbackCopy(address);
  }
}

function fallbackCopy(text) {
  const temp = document.createElement("textarea");
  temp.value = text;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  document.body.removeChild(temp);
  showToast("Alamat bengkel berhasil disalin ke clipboard!");
}

// ============================================================
// 10. MOBILE MENU CONTROLS
// ============================================================
function toggleMenu() {
  const navLinks = document.getElementById("navLinks");
  let overlay = document.getElementById("menuOverlay");
  
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "menuOverlay";
    overlay.className = "menu-overlay";
    overlay.onclick = closeMenu;
    document.body.appendChild(overlay);
  }

  if (navLinks) {
    navLinks.classList.toggle("active");
    overlay.classList.toggle("active");
  }
}

function closeMenu() {
  const navLinks = document.getElementById("navLinks");
  const overlay = document.getElementById("menuOverlay");
  if (navLinks) navLinks.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
}

// ============================================================
// 11. FAQ ACCORDION TOGGLE
// ============================================================
function toggleFaq(buttonElement) {
  const answer = buttonElement.nextElementSibling;
  const arrow = buttonElement.querySelector(".faq-arrow");
  if (!answer) return;

  const isOpen = answer.style.display === "block";

  // Close all other FAQs
  document.querySelectorAll(".faq-answer").forEach((el) => {
    el.style.display = "none";
  });
  document.querySelectorAll(".faq-arrow").forEach((el) => {
    el.style.transform = "rotate(0deg)";
  });

  if (!isOpen) {
    answer.style.display = "block";
    if (arrow) arrow.style.transform = "rotate(180deg)";
  }
}

// ============================================================
// INITIALIZE ON DOM LOAD
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  updateWorkshopLiveStatus();
  initBeforeAfterSlider();
  setComparisonViewMode("sidebyside"); // Default: Mode Berdampingan
  initGalleryCarousel(); // Auto-advancing compact gallery
  updateLivePreview();
  initAnimatedCounters();
  initScrollReveal();
  initScrollSpy();

  // Open first FAQ by default
  const firstFaq = document.querySelector(".faq-item");
  if (firstFaq) {
    const firstAns = firstFaq.querySelector(".faq-answer");
    const firstArrow = firstFaq.querySelector(".faq-arrow");
    if (firstAns && firstArrow) {
      firstAns.style.display = "block";
      firstArrow.style.transform = "rotate(180deg)";
    }
  }

  // Refresh live open status every 60 seconds
  setInterval(updateWorkshopLiveStatus, 60000);
});
