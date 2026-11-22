// ==========================================================================
// The Grand Horizon - Main UI Controller & Interactions
// ==========================================================================

const HotelUI = {
  currentRoomFilter: "all",
  activeGalleryIndex: 0,
  galleryImages: [
    { src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80", title: "Cliffside Sanctuary & Saltwater Infinity Pool" },
    { src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80", title: "Deluxe Ocean King Suite Balcony" },
    { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80", title: "L'Éclat Michelin-Starred Dining Room" },
    { src: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80", title: "The Azure Executive Living Salon" },
    { src: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80", title: "Saffron & Ember Charred Grill Terrace" },
    { src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80", title: "Overwater Lagoon Bungalow Sundeck" },
    { src: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80", title: "The Mirage Sunset Cocktail Lounge" },
    { src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80", title: "Presidential Horizon Rooftop Plunge Pool" }
  ],

  init() {
    this.renderRooms();
    this.renderAmenities();
    this.renderDining();
    this.renderSpa();
    this.renderOffers();
    this.renderReviews();
    this.renderFAQs();
    this.bindEvents();
    this.initScrollSpy();
  },

  bindEvents() {
    // Header scroll background effect
    window.addEventListener("scroll", () => {
      const header = document.querySelector(".main-header");
      if (header) {
        header.classList.toggle("scrolled", window.scrollY > 40);
      }
    });

    // Mobile menu toggle
    const mobileBtn = document.getElementById("mobileMenuBtn");
    const navLinks = document.getElementById("navLinks");
    if (mobileBtn && navLinks) {
      mobileBtn.addEventListener("click", () => {
        navLinks.classList.toggle("open");
        const icon = mobileBtn.querySelector("i");
        if (icon) {
          icon.classList.toggle("fa-bars");
          icon.classList.toggle("fa-xmark");
        }
      });

      // Close mobile menu on link click
      navLinks.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
          navLinks.classList.remove("open");
          const icon = mobileBtn.querySelector("i");
          if (icon) {
            icon.classList.add("fa-bars");
            icon.classList.remove("fa-xmark");
          }
        });
      });
    }

    // Currency Switcher
    const currencySelect = document.getElementById("currencySelect");
    if (currencySelect) {
      currencySelect.addEventListener("change", (e) => {
        BookingEngine.setCurrency(e.target.value);
        this.showToast(`Currency updated to ${e.target.value}`, "fa-coins");
      });
    }

    // Room category filter buttons
    const filterBtns = document.querySelectorAll(".room-filter-nav .filter-btn");
    filterBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentRoomFilter = btn.dataset.category;
        this.renderRooms();
      });
    });

    // Newsletter VIP Club Form
    const newsletterForm = document.getElementById("newsletterForm");
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("newsletterEmail");
        const email = input ? input.value.trim() : "";
        if (email) {
          this.showToast("VIP Invitation confirmed! Use promo code WELCOME10 for 10% off.", "fa-envelope-circle-check");
          if (input) input.value = "";
          // Also prefill into booking engine
          BookingEngine.applyPromoCode("WELCOME10", false);
        }
      });
    }

    // Contact Form
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.showToast("Your inquiry has been received by our Head Concierge. We will reply within 2 hours.", "fa-paper-plane");
        contactForm.reset();
      });
    }

    // Table Reservation Form inside modal
    const tableForm = document.getElementById("tableReservationForm");
    if (tableForm) {
      tableForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const venue = document.getElementById("diningVenueSelect").value;
        const date = document.getElementById("diningDate").value;
        const time = document.getElementById("diningTime").value;
        const guests = document.getElementById("diningGuests").value;
        this.closeModal("tableModalBackdrop");
        this.showToast(`Table confirmed at ${venue} for ${guests} guests on ${date} at ${time}.`, "fa-utensils");
      });
    }

    // Spa Treatment Booking Form inside modal
    const spaForm = document.getElementById("spaBookingForm");
    if (spaForm) {
      spaForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const treatment = document.getElementById("spaTreatmentSelect").value;
        const date = document.getElementById("spaDate").value;
        const time = document.getElementById("spaTime").value;
        this.closeModal("spaModalBackdrop");
        this.showToast(`Spa appointment booked: ${treatment} on ${date} at ${time}.`, "fa-spa");
      });
    }
  },

  renderRooms() {
    const container = document.getElementById("roomsGrid");
    if (!container) return;

    let filtered = HOTEL_DATA.rooms;
    if (this.currentRoomFilter !== "all") {
      filtered = HOTEL_DATA.rooms.filter(r => r.category === this.currentRoomFilter);
    }

    let html = "";
    filtered.forEach(room => {
      const priceFormatted = BookingEngine.formatPrice(room.priceUSD);
      const amenitiesHtml = room.amenities.slice(0, 4).map(a => `<span class="amenity-pill">${a}</span>`).join("");

      html += `
        <article class="room-card" data-room-id="${room.id}">
          <div class="room-card-image-wrap">
            <img class="room-card-image" src="${room.image}" alt="${room.name}" loading="lazy">
            <span class="room-card-badge">${room.badge}</span>
            <div class="room-card-price-tag">
              <span class="room-price-val">${priceFormatted}</span>
              <span class="room-price-period"> / night</span>
            </div>
          </div>
          <div class="room-card-body">
            <h3 class="room-card-title">${room.name}</h3>
            <div class="room-card-specs">
              <span class="room-spec-item"><i class="fa-solid fa-expand"></i> ${room.size}</span>
              <span class="room-spec-item"><i class="fa-solid fa-user-group"></i> Up to ${room.capacity}</span>
              <span class="room-spec-item"><i class="fa-solid fa-bed"></i> ${room.bed}</span>
            </div>
            <p class="room-card-desc">${room.description}</p>
            <div class="room-amenities-pills">
              ${amenitiesHtml}
            </div>
            <div class="room-card-actions">
              <button class="btn btn-primary" onclick="BookingEngine.openModal('${room.id}')">
                <i class="fa-solid fa-calendar-check"></i> Reserve
              </button>
              <button class="btn btn-outline-white" onclick="HotelUI.openRoomDetails('${room.id}')">
                <i class="fa-solid fa-circle-info"></i> Details
              </button>
            </div>
          </div>
        </article>
      `;
    });

    container.innerHTML = html;
  },

  openRoomDetails(roomId) {
    const room = HOTEL_DATA.rooms.find(r => r.id === roomId);
    if (!room) return;

    const modalBody = document.getElementById("roomDetailsModalBody");
    const modalTitle = document.getElementById("roomDetailsModalTitle");
    if (!modalBody || !modalTitle) return;

    modalTitle.textContent = room.name;

    const galleryHtml = room.gallery.map(img => `
      <div style="border-radius: var(--radius-md); overflow: hidden; height: 160px;">
        <img src="${img}" alt="${room.name}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
    `).join("");

    const amenitiesListHtml = room.amenities.map(a => `
      <li style="display: flex; align-items: center; gap: 10px; color: #cbd5e1; font-size: 0.9rem;">
        <i class="fa-solid fa-check" style="color: var(--gold-primary);"></i> ${a}
      </li>
    `).join("");

    modalBody.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; margin-bottom: 24px;">
        ${galleryHtml}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
        <div>
          <span style="font-size: 0.8rem; letter-spacing: 2px; text-transform: uppercase; color: var(--gold-primary); font-weight: 600;">
            ${room.categoryName}
          </span>
          <h2 style="font-size: 2rem; margin-top: 4px;">${room.name}</h2>
          <p style="color: var(--gold-light); font-size: 0.9rem;"><i class="fa-solid fa-eye"></i> ${room.view}</p>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 2rem; font-family: var(--font-serif); font-weight: 700; color: #fff;">
            ${BookingEngine.formatPrice(room.priceUSD)}
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">per night + resort privileges</div>
        </div>
      </div>

      <p style="color: #cbd5e1; line-height: 1.8; margin-bottom: 24px; font-size: 0.98rem;">
        ${room.description}
      </p>

      <div style="background: rgba(9, 13, 20, 0.6); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 20px; margin-bottom: 28px;">
        <h4 style="font-size: 1.1rem; margin-bottom: 14px; color: var(--gold-light);">
          <i class="fa-solid fa-gem" style="color: var(--gold-primary); margin-right: 8px;"></i> Included Privileges & Amenities
        </h4>
        <ul style="list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px;">
          ${amenitiesListHtml}
        </ul>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 14px;">
        <button class="btn btn-outline-white" onclick="HotelUI.closeModal('roomDetailsModalBackdrop')">Close</button>
        <button class="btn btn-primary" onclick="HotelUI.closeModal('roomDetailsModalBackdrop'); BookingEngine.openModal('${room.id}');">
          <i class="fa-solid fa-calendar-check"></i> Book This Sanctuary
        </button>
      </div>
    `;

    this.openModal("roomDetailsModalBackdrop");
  },

  renderAmenities() {
    const container = document.getElementById("amenitiesGrid");
    if (!container) return;

    let html = "";
    HOTEL_DATA.amenities.forEach(a => {
      html += `
        <div class="amenity-box">
          <div class="amenity-icon-circle">
            <i class="fa-solid ${a.icon}"></i>
          </div>
          <h3 class="amenity-box-title">${a.title}</h3>
          <p class="amenity-box-desc">${a.desc}</p>
        </div>
      `;
    });
    container.innerHTML = html;
  },

  renderDining() {
    const container = document.getElementById("diningFeaturedContainer");
    if (!container) return;

    let html = "";
    HOTEL_DATA.dining.forEach((venue, index) => {
      const isReverse = index % 2 === 1 ? "reverse" : "";
      const dishesHtml = venue.signatureDishes.map(d => `
        <li><strong>${d.name}:</strong> ${d.desc}</li>
      `).join("");

      html += `
        <article class="dining-card ${isReverse}">
          <div class="dining-image-col">
            <img src="${venue.image}" alt="${venue.name}" loading="lazy">
            <span class="dining-badge"><i class="fa-solid fa-star"></i> ${venue.stars}</span>
          </div>
          <div class="dining-text-col">
            <div class="dining-cuisine-tag">${venue.cuisine}</div>
            <h3 class="dining-name">${venue.name}</h3>
            <div class="dining-meta">
              <span class="dining-meta-item"><i class="fa-solid fa-user-tie"></i> ${venue.chef}</span>
              <span class="dining-meta-item"><i class="fa-regular fa-clock"></i> ${venue.hours}</span>
              <span class="dining-meta-item"><i class="fa-solid fa-shirt"></i> ${venue.dressCode}</span>
            </div>
            <p class="dining-description">${venue.description}</p>
            <div class="signature-dishes-box">
              <div class="signature-title"><i class="fa-solid fa-award"></i> Signature Culinary Creations</div>
              <ul class="signature-dish-list">
                ${dishesHtml}
              </ul>
            </div>
            <div class="dining-actions">
              <button class="btn btn-primary" onclick="HotelUI.openTableModal('${venue.name}')">
                <i class="fa-solid fa-utensils"></i> Reserve a Table
              </button>
            </div>
          </div>
        </article>
      `;
    });

    container.innerHTML = html;
  },

  renderSpa() {
    const container = document.getElementById("spaTreatmentsGrid");
    if (!container) return;

    let html = "";
    HOTEL_DATA.spa.forEach(item => {
      html += `
        <div class="spa-card">
          <div class="spa-card-header">
            <div class="spa-icon-box">
              <i class="fa-solid ${item.icon}"></i>
            </div>
            <span class="spa-duration-pill"><i class="fa-regular fa-clock"></i> ${item.duration}</span>
          </div>
          <h3 class="spa-title">${item.title}</h3>
          <p class="spa-desc">${item.description}</p>
          <div style="font-size: 0.78rem; color: var(--gold-light); margin-bottom: 16px;">
            <i class="fa-solid fa-feather"></i> Recommended for: ${item.suitable}
          </div>
          <div class="spa-card-footer">
            <div class="spa-price">${BookingEngine.formatPrice(item.priceUSD)}</div>
            <button class="btn btn-outline-gold btn-sm" onclick="HotelUI.openSpaModal('${item.title}')">
              <i class="fa-solid fa-calendar-plus"></i> Book Ritual
            </button>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  renderOffers() {
    const container = document.getElementById("offersGrid");
    if (!container) return;

    let html = "";
    HOTEL_DATA.specialOffers.forEach(offer => {
      const perksHtml = offer.perks.map(p => `
        <li><i class="fa-solid fa-check"></i> ${p}</li>
      `).join("");

      html += `
        <div class="offer-card">
          <div class="offer-img-box">
            <img src="${offer.image}" alt="${offer.title}" loading="lazy">
            <span class="offer-badge">${offer.tag}</span>
            <span class="offer-discount-tag">${offer.discount}</span>
          </div>
          <div class="offer-body">
            <h3 class="offer-title">${offer.title}</h3>
            <ul class="offer-perks-list">
              ${perksHtml}
            </ul>
            <div class="offer-footer">
              <div>
                <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">PROMO CODE</span>
                <span class="promo-code-chip" onclick="HotelUI.copyPromoCode('${offer.code}')" title="Click to copy">
                  ${offer.code} <i class="fa-regular fa-copy"></i>
                </span>
              </div>
              <button class="btn btn-primary btn-sm" onclick="HotelUI.claimOffer('${offer.code}')">
                Claim Package
              </button>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  claimOffer(code) {
    BookingEngine.applyPromoCode(code, false);
    BookingEngine.openModal();
    this.showToast(`Package code ${code} activated for your booking!`, "fa-gift");
  },

  copyPromoCode(code) {
    navigator.clipboard.writeText(code).then(() => {
      this.showToast(`Code "${code}" copied to clipboard!`, "fa-clipboard-check");
    }).catch(() => {
      this.showToast(`Code: ${code}`, "fa-tag");
    });
  },

  renderReviews() {
    const container = document.getElementById("reviewsGrid");
    if (!container) return;

    let html = "";
    HOTEL_DATA.reviews.forEach(rev => {
      const starsHtml = '<i class="fa-solid fa-star"></i>'.repeat(rev.rating);

      html += `
        <div class="review-card">
          <div class="review-stars">${starsHtml}</div>
          <h4 class="review-title">"${rev.title}"</h4>
          <p class="review-comment">${rev.comment}</p>
          <div class="review-author-wrap">
            <img src="${rev.avatar}" alt="${rev.author}" class="review-avatar">
            <div class="review-author-info">
              <span class="author-name">${rev.author}</span>
              <span class="author-loc">${rev.location} • <i class="fa-solid fa-circle-check" style="color: #10b981;"></i> Verified Stay</span>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  renderFAQs() {
    const container = document.getElementById("faqContainer");
    if (!container) return;

    let html = "";
    HOTEL_DATA.faqs.forEach((faq, index) => {
      html += `
        <div class="faq-item ${index === 0 ? 'active' : ''}">
          <button class="faq-question" onclick="HotelUI.toggleFAQ(this)">
            <span>${faq.q}</span>
            <i class="fa-solid fa-chevron-down faq-icon"></i>
          </button>
          <div class="faq-answer" style="${index === 0 ? 'max-height: 200px;' : ''}">
            <div class="faq-answer-inner">${faq.a}</div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  toggleFAQ(btn) {
    const item = btn.closest(".faq-item");
    const answer = item.querySelector(".faq-answer");
    const isActive = item.classList.contains("active");

    // Close others
    document.querySelectorAll(".faq-item").forEach(other => {
      if (other !== item) {
        other.classList.remove("active");
        const a = other.querySelector(".faq-answer");
        if (a) a.style.maxHeight = null;
      }
    });

    if (isActive) {
      item.classList.remove("active");
      answer.style.maxHeight = null;
    } else {
      item.classList.add("active");
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  },

  openTableModal(venueName = "") {
    const select = document.getElementById("diningVenueSelect");
    if (select && venueName) {
      select.value = venueName;
    }
    // Set default date to today
    const dateInput = document.getElementById("diningDate");
    if (dateInput && !dateInput.value) {
      dateInput.value = BookingEngine.formatDateISO(new Date());
    }
    this.openModal("tableModalBackdrop");
  },

  openSpaModal(treatmentTitle = "") {
    const select = document.getElementById("spaTreatmentSelect");
    if (select && treatmentTitle) {
      select.value = treatmentTitle;
    }
    const dateInput = document.getElementById("spaDate");
    if (dateInput && !dateInput.value) {
      dateInput.value = BookingEngine.formatDateISO(new Date());
    }
    this.openModal("spaModalBackdrop");
  },

  openLightbox(index) {
    this.activeGalleryIndex = index;
    const item = this.galleryImages[index];
    const imgEl = document.getElementById("lightboxImage");
    const captionEl = document.getElementById("lightboxCaption");

    if (imgEl) imgEl.src = item.src;
    if (captionEl) captionEl.textContent = item.title;

    this.openModal("lightboxModalBackdrop");
  },

  prevLightbox() {
    this.activeGalleryIndex = (this.activeGalleryIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
    this.openLightbox(this.activeGalleryIndex);
  },

  nextLightbox() {
    this.activeGalleryIndex = (this.activeGalleryIndex + 1) % this.galleryImages.length;
    this.openLightbox(this.activeGalleryIndex);
  },

  openModal(backdropId) {
    const backdrop = document.getElementById(backdropId);
    if (backdrop) {
      backdrop.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  },

  closeModal(backdropId) {
    const backdrop = document.getElementById(backdropId);
    if (backdrop) {
      backdrop.classList.remove("open");
      document.body.style.overflow = "";
    }
  },

  showToast(message, iconClass = "fa-circle-check") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <i class="fa-solid ${iconClass}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  },

  initScrollSpy() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link[href^='#']");

    window.addEventListener("scroll", () => {
      let currentId = "";
      const scrollY = window.pageYOffset;

      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          currentId = section.getAttribute("id");
        }
      });

      navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentId}`) {
          link.classList.add("active");
        }
      });
    });
  }
};

// Global startup when DOM ready
document.addEventListener("DOMContentLoaded", () => {
  HotelUI.init();
  BookingEngine.init();
});

window.HotelUI = HotelUI;
