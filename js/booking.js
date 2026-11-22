// ==========================================================================
// The Grand Horizon - Booking Engine & Reservation Manager
// ==========================================================================

const BookingEngine = {
  currency: "USD",
  currentStep: 1,

  bookingState: {
    roomId: "deluxe-ocean",
    checkIn: "",
    checkOut: "",
    adults: 2,
    children: 0,
    selectedAddOns: new Set(["breakfast"]),
    promoCode: "",
    discountPct: 0,
    guest: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "United States",
      requests: ""
    },
    referenceCode: ""
  },

  init() {
    this.setDefaultDates();
    this.bindEvents();
    this.renderAddOns();
    this.renderRoomSelectorOptions();
    this.updateSummary();
  },

  setDefaultDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const checkOutDate = new Date(today);
    checkOutDate.setDate(today.getDate() + 4); // 3 nights default

    this.bookingState.checkIn = this.formatDateISO(tomorrow);
    this.bookingState.checkOut = this.formatDateISO(checkOutDate);

    // Set DOM elements
    const checkInInputs = document.querySelectorAll(".booking-checkin-input");
    const checkOutInputs = document.querySelectorAll(".booking-checkout-input");

    checkInInputs.forEach(input => {
      input.value = this.bookingState.checkIn;
      input.min = this.formatDateISO(today);
    });

    checkOutInputs.forEach(input => {
      input.value = this.bookingState.checkOut;
      input.min = this.bookingState.checkIn;
    });
  },

  formatDateISO(d) {
    return d.toISOString().split("T")[0];
  },

  setCurrency(curr) {
    if (HOTEL_DATA.currencies[curr]) {
      this.currency = curr;
      this.updateSummary();
      // Re-render rooms price tags
      if (window.HotelUI && window.HotelUI.renderRooms) {
        window.HotelUI.renderRooms();
      }
      if (window.HotelUI && window.HotelUI.renderSpa) {
        window.HotelUI.renderSpa();
      }
      this.renderAddOns();
    }
  },

  formatPrice(amountUSD) {
    const c = HOTEL_DATA.currencies[this.currency];
    const converted = amountUSD * c.rate;
    if (this.currency === "INR") {
      return `${c.symbol} ${Math.round(converted).toLocaleString("en-IN")}`;
    }
    return `${c.symbol}${Math.round(converted).toLocaleString()}`;
  },

  getNightsCount() {
    const d1 = new Date(this.bookingState.checkIn);
    const d2 = new Date(this.bookingState.checkOut);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return isNaN(diffDays) || diffDays < 1 ? 1 : diffDays;
  },

  bindEvents() {
    // Quick booking bar submit
    const quickBarForm = document.getElementById("quickBookingForm");
    if (quickBarForm) {
      quickBarForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const checkIn = document.getElementById("barCheckIn").value;
        const checkOut = document.getElementById("barCheckOut").value;
        const guests = parseInt(document.getElementById("barGuests").value, 10) || 2;
        const roomType = document.getElementById("barRoomType").value;
        const promo = document.getElementById("barPromo").value.trim();

        if (checkIn) this.bookingState.checkIn = checkIn;
        if (checkOut) this.bookingState.checkOut = checkOut;
        this.bookingState.adults = guests;
        if (roomType && roomType !== "any") {
          this.bookingState.roomId = roomType;
        }
        if (promo) {
          this.applyPromoCode(promo, false);
        }

        this.openModal(this.bookingState.roomId);
      });
    }

    // Modal navigation
    const nextBtn = document.getElementById("wizardNextBtn");
    const prevBtn = document.getElementById("wizardPrevBtn");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => this.handleNextStep());
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", () => this.handlePrevStep());
    }

    // Promo code apply inside modal
    const promoBtn = document.getElementById("applyPromoBtn");
    if (promoBtn) {
      promoBtn.addEventListener("click", () => {
        const input = document.getElementById("modalPromoInput");
        if (input) {
          this.applyPromoCode(input.value.trim(), true);
        }
      });
    }

    // Autofill demo payment card
    const autofillCardBtn = document.getElementById("autofillCardBtn");
    if (autofillCardBtn) {
      autofillCardBtn.addEventListener("click", () => {
        const cardName = document.getElementById("cardHolderName");
        const cardNum = document.getElementById("cardNumber");
        const cardExp = document.getElementById("cardExpiry");
        const cardCvv = document.getElementById("cardCvv");
        if (cardName) cardName.value = "Lord Alistair Sterling";
        if (cardNum) cardNum.value = "4532 8912 6734 9012";
        if (cardExp) cardExp.value = "08/29";
        if (cardCvv) cardCvv.value = "882";
        HotelUI.showToast("Test card credentials pre-filled securely.", "fa-credit-card");
      });
    }

    // Modal Room selection change
    const roomSelect = document.getElementById("modalRoomSelect");
    if (roomSelect) {
      roomSelect.addEventListener("change", (e) => {
        this.bookingState.roomId = e.target.value;
        this.updateSummary();
      });
    }

    // Dates and guests changes inside modal
    const modalCheckIn = document.getElementById("modalCheckIn");
    const modalCheckOut = document.getElementById("modalCheckOut");
    const modalAdults = document.getElementById("modalAdults");

    if (modalCheckIn) {
      modalCheckIn.addEventListener("change", (e) => {
        this.bookingState.checkIn = e.target.value;
        if (modalCheckOut) modalCheckOut.min = e.target.value;
        this.updateSummary();
      });
    }
    if (modalCheckOut) {
      modalCheckOut.addEventListener("change", (e) => {
        this.bookingState.checkOut = e.target.value;
        this.updateSummary();
      });
    }
    if (modalAdults) {
      modalAdults.addEventListener("change", (e) => {
        this.bookingState.adults = parseInt(e.target.value, 10) || 1;
        this.updateSummary();
      });
    }
  },

  renderRoomSelectorOptions() {
    const selects = [
      document.getElementById("barRoomType"),
      document.getElementById("modalRoomSelect")
    ];

    selects.forEach(sel => {
      if (!sel) return;
      const isBar = sel.id === "barRoomType";
      let html = isBar ? '<option value="any">Any Room or Suite</option>' : '';

      HOTEL_DATA.rooms.forEach(r => {
        html += `<option value="${r.id}">${r.name} (${this.formatPrice(r.priceUSD)}/nt)</option>`;
      });

      sel.innerHTML = html;
    });
  },

  renderAddOns() {
    const container = document.getElementById("addonsContainer");
    if (!container) return;

    let html = "";
    HOTEL_DATA.addOns.forEach(addon => {
      const isChecked = this.bookingState.selectedAddOns.has(addon.id);
      let priceLabel = "";
      if (addon.type === "per_guest_per_day") {
        priceLabel = `${this.formatPrice(addon.priceUSD)} / guest / night`;
      } else if (addon.type === "per_guest_total") {
        priceLabel = `${this.formatPrice(addon.priceUSD)} / guest`;
      } else {
        priceLabel = `${this.formatPrice(addon.priceUSD)} one-time`;
      }

      html += `
        <label class="addon-row ${isChecked ? 'selected' : ''}" data-addon-id="${addon.id}">
          <input type="checkbox" class="addon-checkbox" value="${addon.id}" ${isChecked ? 'checked' : ''} onchange="BookingEngine.toggleAddOn('${addon.id}', this.checked)">
          <div class="addon-info">
            <div class="addon-title">${addon.name}</div>
            <div class="addon-desc">${addon.description}</div>
          </div>
          <div class="addon-price">${priceLabel}</div>
        </label>
      `;
    });

    container.innerHTML = html;
  },

  toggleAddOn(addonId, isChecked) {
    if (isChecked) {
      this.bookingState.selectedAddOns.add(addonId);
    } else {
      this.bookingState.selectedAddOns.delete(addonId);
    }
    this.renderAddOns();
    this.updateSummary();
  },

  applyPromoCode(code, showToastMsg = true) {
    const upperCode = code.toUpperCase().trim();
    if (!upperCode) return;

    if (upperCode === "LOVEHORIZON") {
      this.bookingState.promoCode = upperCode;
      this.bookingState.discountPct = 20;
      if (showToastMsg) HotelUI.showToast("Promo Code LOVEHORIZON applied: 20% Off!", "fa-tag");
    } else if (upperCode === "STAY5PAY4" || upperCode === "ZEN2026") {
      this.bookingState.promoCode = upperCode;
      this.bookingState.discountPct = 20;
      if (showToastMsg) HotelUI.showToast(`Package promo ${upperCode} activated: 20% VIP credit!`, "fa-tag");
    } else if (upperCode === "WELCOME10" || upperCode === "HORIZONVIP") {
      this.bookingState.promoCode = upperCode;
      this.bookingState.discountPct = 10;
      if (showToastMsg) HotelUI.showToast("VIP Club code applied: 10% Off your stay!", "fa-tag");
    } else {
      if (showToastMsg) HotelUI.showToast("Invalid promo code. Try LOVEHORIZON or WELCOME10", "fa-circle-exclamation");
      return;
    }

    const promoInput = document.getElementById("modalPromoInput");
    if (promoInput) promoInput.value = upperCode;
    this.updateSummary();
  },

  calculateTotals() {
    const room = HOTEL_DATA.rooms.find(r => r.id === this.bookingState.roomId) || HOTEL_DATA.rooms[0];
    const nights = this.getNightsCount();
    const guests = this.bookingState.adults + this.bookingState.children;

    const roomSubtotal = room.priceUSD * nights;

    let addOnsSubtotal = 0;
    this.bookingState.selectedAddOns.forEach(addonId => {
      const addon = HOTEL_DATA.addOns.find(a => a.id === addonId);
      if (addon) {
        if (addon.type === "per_guest_per_day") {
          addOnsSubtotal += addon.priceUSD * guests * nights;
        } else if (addon.type === "per_guest_total") {
          addOnsSubtotal += addon.priceUSD * guests;
        } else {
          addOnsSubtotal += addon.priceUSD;
        }
      }
    });

    const subtotal = roomSubtotal + addOnsSubtotal;
    const discountAmount = subtotal * (this.bookingState.discountPct / 100);
    const taxableAmount = subtotal - discountAmount;
    const taxesAndFees = taxableAmount * 0.10; // 10% Luxury resort tax & service
    const grandTotal = taxableAmount + taxesAndFees;

    return {
      room,
      nights,
      guests,
      roomSubtotal,
      addOnsSubtotal,
      subtotal,
      discountAmount,
      taxesAndFees,
      grandTotal
    };
  },

  updateSummary() {
    const totals = this.calculateTotals();
    const summaryContainer = document.getElementById("bookingSummaryBox");
    if (!summaryContainer) return;

    let discountHtml = "";
    if (this.bookingState.discountPct > 0) {
      discountHtml = `
        <div class="summary-row" style="color: #4ade80;">
          <span>VIP Discount (${this.bookingState.promoCode} - ${this.bookingState.discountPct}%):</span>
          <span>-${this.formatPrice(totals.discountAmount)}</span>
        </div>
      `;
    }

    summaryContainer.innerHTML = `
      <div class="summary-row">
        <span><strong>${totals.room.name}</strong> (${totals.nights} night${totals.nights > 1 ? 's' : ''}):</span>
        <span>${this.formatPrice(totals.roomSubtotal)}</span>
      </div>
      <div class="summary-row">
        <span>Curated Add-Ons & Experiences:</span>
        <span>${this.formatPrice(totals.addOnsSubtotal)}</span>
      </div>
      ${discountHtml}
      <div class="summary-row">
        <span>Resort Service & Local Tourism Tax (10%):</span>
        <span>${this.formatPrice(totals.taxesAndFees)}</span>
      </div>
      <div class="summary-row total">
        <span>Total Reservation Cost:</span>
        <span class="total-amount">${this.formatPrice(totals.grandTotal)}</span>
      </div>
    `;

    // Also update any live totals in step buttons
    const payBtnAmount = document.getElementById("payBtnAmount");
    if (payBtnAmount) {
      payBtnAmount.textContent = this.formatPrice(totals.grandTotal);
    }
  },

  openModal(preselectedRoomId = null) {
    if (preselectedRoomId) {
      this.bookingState.roomId = preselectedRoomId;
      const roomSelect = document.getElementById("modalRoomSelect");
      if (roomSelect) roomSelect.value = preselectedRoomId;
    }

    const modalCheckIn = document.getElementById("modalCheckIn");
    const modalCheckOut = document.getElementById("modalCheckOut");
    const modalAdults = document.getElementById("modalAdults");
    if (modalCheckIn) modalCheckIn.value = this.bookingState.checkIn;
    if (modalCheckOut) modalCheckOut.value = this.bookingState.checkOut;
    if (modalAdults) modalAdults.value = this.bookingState.adults;

    this.goToStep(1);
    this.updateSummary();

    const backdrop = document.getElementById("bookingModalBackdrop");
    if (backdrop) {
      backdrop.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  },

  closeModal() {
    const backdrop = document.getElementById("bookingModalBackdrop");
    if (backdrop) {
      backdrop.classList.remove("open");
      document.body.style.overflow = "";
    }
  },

  goToStep(step) {
    this.currentStep = step;
    const steps = [1, 2, 3, 4];

    steps.forEach(s => {
      const panel = document.getElementById(`wizardPanel${s}`);
      const indicator = document.getElementById(`stepIndicator${s}`);
      if (panel) panel.classList.toggle("active", s === step);
      if (indicator) {
        indicator.classList.toggle("active", s === step);
        indicator.classList.toggle("done", s < step);
      }
    });

    const prevBtn = document.getElementById("wizardPrevBtn");
    const nextBtn = document.getElementById("wizardNextBtn");

    if (prevBtn) {
      prevBtn.style.display = (step === 1 || step === 4) ? "none" : "inline-flex";
    }
    if (nextBtn) {
      if (step === 3) {
        nextBtn.innerHTML = `Confirm & Reserve Now (<span id="payBtnAmount">${this.formatPrice(this.calculateTotals().grandTotal)}</span>) <i class="fa-solid fa-lock"></i>`;
      } else if (step === 4) {
        nextBtn.style.display = "none";
      } else {
        nextBtn.innerHTML = `Continue to Next Step <i class="fa-solid fa-arrow-right"></i>`;
        nextBtn.style.display = "inline-flex";
      }
    }
  },

  handleNextStep() {
    if (this.currentStep === 1) {
      // Validate dates
      if (!this.bookingState.checkIn || !this.bookingState.checkOut) {
        HotelUI.showToast("Please choose valid check-in and check-out dates.", "fa-calendar-xmark");
        return;
      }
      this.goToStep(2);
    } else if (this.currentStep === 2) {
      // Validate guest details
      const fName = document.getElementById("guestFirstName").value.trim();
      const lName = document.getElementById("guestLastName").value.trim();
      const email = document.getElementById("guestEmail").value.trim();
      const phone = document.getElementById("guestPhone").value.trim();

      if (!fName || !lName || !email) {
        HotelUI.showToast("Please provide your first name, last name, and email address.", "fa-user-pen");
        return;
      }

      this.bookingState.guest.firstName = fName;
      this.bookingState.guest.lastName = lName;
      this.bookingState.guest.email = email;
      this.bookingState.guest.phone = phone;
      this.bookingState.guest.requests = document.getElementById("guestRequests").value.trim();

      this.goToStep(3);
    } else if (this.currentStep === 3) {
      // Confirm payment simulation
      this.processBookingConfirmation();
    }
  },

  handlePrevStep() {
    if (this.currentStep > 1) {
      this.goToStep(this.currentStep - 1);
    }
  },

  processBookingConfirmation() {
    // Generate unique reference
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.bookingState.referenceCode = `GH-2026-${randomHex}`;

    const totals = this.calculateTotals();
    const voucherContainer = document.getElementById("confirmationVoucherContainer");

    if (voucherContainer) {
      voucherContainer.innerHTML = `
        <div class="booking-voucher">
          <div class="voucher-crest">
            <i class="fa-solid fa-crown"></i>
          </div>
          <h2 style="font-size: 2rem; margin-bottom: 6px;">Reservation Confirmed</h2>
          <p style="color: var(--gold-light);">Welcome to The Grand Horizon Resort & Sanctuary</p>
          
          <div class="voucher-ref-chip">
            BOOKING REFERENCE: ${this.bookingState.referenceCode}
          </div>

          <div class="voucher-details-grid">
            <div>
              <dt>Primary Guest</dt>
              <dd>${this.bookingState.guest.firstName} ${this.bookingState.guest.lastName}</dd>
            </div>
            <div>
              <dt>Confirmation Sent To</dt>
              <dd>${this.bookingState.guest.email}</dd>
            </div>
            <div>
              <dt>Reserved Suite</dt>
              <dd>${totals.room.name}</dd>
            </div>
            <div>
              <dt>Dates of Stay</dt>
              <dd>${this.bookingState.checkIn} to ${this.bookingState.checkOut} (${totals.nights} nights)</dd>
            </div>
            <div>
              <dt>Total Guests</dt>
              <dd>${totals.guests} Guests</dd>
            </div>
            <div>
              <dt>Amount Paid</dt>
              <dd style="color: var(--gold-primary); font-size: 1.15rem;">${this.formatPrice(totals.grandTotal)}</dd>
            </div>
          </div>

          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 24px;">
            A formal reservation letter and our private chauffeur arrangement concierge questionnaire have been dispatched to your email.
          </p>

          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="window.print()">
              <i class="fa-solid fa-print"></i> Print Official Voucher
            </button>
            <button class="btn btn-outline-white" onclick="BookingEngine.closeModal()">
              <i class="fa-solid fa-check"></i> Return to Resort Portal
            </button>
          </div>
        </div>
      `;
    }

    this.goToStep(4);
    HotelUI.showToast("Reservation successfully confirmed! Reference: " + this.bookingState.referenceCode, "fa-circle-check");
  }
};

// Export to window
if (typeof window !== "undefined") {
  window.BookingEngine = BookingEngine;
}
