// ===== SMART.JS =====

function getSelectedFacultyAndDate() {
  const date      = document.getElementById("bookingDate")?.value      || "";
  const facultyId = document.getElementById("facultySelect")?.value    || "";
  return { date, facultyId };
}

function findNextAvailableSlot() {
  const { date, facultyId } = getSelectedFacultyAndDate();
  
  // Use the safely restored getBookings()
  const bookedIds = (typeof getBookings === "function" ? getBookings() : [])
    .filter(b => b.status !== "cancelled" && b.date === date && b.facultyId === facultyId)
    .map(b => b.slotId);
    
  return ALL_SLOTS.find(s => !bookedIds.includes(s.id)) || null;
}

function suggestAlternativeSlots(excludeSlotId) {
  const { date, facultyId } = getSelectedFacultyAndDate();
  const bookedIds = (typeof getBookings === "function" ? getBookings() : [])
    .filter(b => b.status !== "cancelled" && b.date === date && b.facultyId === facultyId)
    .map(b => b.slotId);

  return ALL_SLOTS.filter(s => !bookedIds.includes(s.id) && s.id !== excludeSlotId).slice(0, 3);
}

function showSlotSuggestion(excludeSlotId) {
  const existing = document.getElementById("suggestionBanner");
  if (existing) existing.remove();

  const suggestions = suggestAlternativeSlots(excludeSlotId);
  if (suggestions.length === 0) {
    showFullyBookedBanner();
    return;
  }

  const banner = document.createElement("div");
  banner.id = "suggestionBanner";
  banner.className = "suggestion-banner";

  banner.innerHTML = `
    <p class="suggestion-title">💡 That slot is taken. Try one of these:</p>
    <div class="suggestion-slots">
      ${suggestions.map(s => `<button class="suggestion-btn" onclick="pickSuggestedSlot('${s.id}')">🕐 ${s.label}</button>`).join("")}
    </div>
    <button class="suggestion-close" onclick="this.parentElement.remove()">✕</button>
  `;

  const container = document.querySelector(".slots-container");
  if (container) container.after(banner);
}

function pickSuggestedSlot(slotId) {
  const slot = getSlotById(slotId);
  if (!slot) return;
  
  if (typeof handleSlotSelect === "function") handleSlotSelect(slot);
  
  const banner = document.getElementById("suggestionBanner");
  if (banner) banner.remove();
}

function showFullyBookedBanner() {
  const existing = document.getElementById("fullyBookedBanner");
  if (existing) existing.remove();
  
  const banner = document.createElement("div");
  banner.id = "fullyBookedBanner";
  banner.className = "cancel-banner banner-warning";
  banner.innerHTML = `😔 All slots are fully booked for this faculty on this date. <a href="history.html" style="color:#e65100;font-weight:700;margin-left:10px;">View My Appointments →</a>`;
  
  const content = document.querySelector(".page-content");
  if (content) content.prepend(banner);
}

function showNextSlotHint() {
  const hint = document.getElementById("nextSlotHint");
  const { date, facultyId } = getSelectedFacultyAndDate();
  
  if (!hint) return;
  if (!date || !facultyId) { hint.style.display = "none"; return; }

  const next = findNextAvailableSlot();
  if (next) {
    hint.textContent   = "💡 Next available: " + next.label;
    hint.style.display = "block";
    hint.style.color   = "#c8813a";
  } else {
    hint.textContent   = "😔 All slots are fully booked for this faculty on this date.";
    hint.style.display = "block";
    hint.style.color   = "#b94040";
  }
}

function smartSlotClick(slot) {
  const { date, facultyId } = getSelectedFacultyAndDate();

  if (!date || !facultyId) return;

  if (typeof isSlotBooked === "function" && isSlotBooked(slot.id, date, facultyId)) {
    showSlotSuggestion(slot.id);
    return;
  }

  if (typeof handleSlotSelect === "function") handleSlotSelect(slot);
}