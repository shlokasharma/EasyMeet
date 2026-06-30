// ===== BOOKING.JS =====

let selectedSlot = null;

// Globally accessible, safe booking fetcher
function getBookings() {
  try {
    return JSON.parse(localStorage.getItem("bookings")) || [];
  } catch (e) {
    return [];
  }
}

function isSlotBooked(slotId, date, facultyId) {
  const bookings = getBookings();
  return bookings.some(b =>
    b.slotId === slotId && 
    b.date === date && 
    b.facultyId === facultyId && 
    b.status !== "cancelled"
  );
}

function handleSlotSelect(slot) {
  const date      = document.getElementById("bookingDate")?.value;
  const facultyId = document.getElementById("facultySelect")?.value;

  if (!date || !facultyId) {
    if (typeof showToast === "function") showToast("Please select a date and faculty first.", "error");
    return;
  }
  
  if (isSlotBooked(slot.id, date, facultyId)) return;

  if (selectedSlot) {
    const prev = document.getElementById(selectedSlot.id);
    if (prev) { 
      prev.classList.remove("slot-selected"); 
      prev.classList.add("slot-available"); 
    }
  }

  selectedSlot = slot;
  const card = document.getElementById(slot.id);
  if (card) { 
    card.classList.remove("slot-available"); 
    card.classList.add("slot-selected"); 
  }

  const display = document.getElementById("selectedSlotDisplay");
  if (display) { 
    display.textContent = "✅ Selected: " + slot.label; 
    display.style.color = "#c8813a"; 
    display.style.fontWeight = "bold";
  }
  
  const form = document.getElementById("bookingFormCard");
  if (form) form.scrollIntoView({ behavior: "smooth", block: "center" });
}

function handleBookingSubmit() {
  const name      = document.getElementById("bookingName")?.value.trim();
  const email     = document.getElementById("bookingEmail")?.value.trim();
  const rollNo    = document.getElementById("bookingRollNo")?.value.trim();
  const purpose   = document.getElementById("bookingPurpose")?.value.trim();
  const facultyId = document.getElementById("facultySelect")?.value;
  const date      = document.getElementById("bookingDate")?.value;
  const priority  = document.getElementById("prioritySelect")?.value || "medium";
  const duration  = document.getElementById("durationSelect")?.value || "30min";

  if (!facultyId || !date || !selectedSlot || !name || !email || !rollNo || !purpose) {
    if (typeof showToast === "function") showToast("⚠️ Please fill all required fields.", "error");
    return;
  }

  if (isSlotBooked(selectedSlot.id, date, facultyId)) {
    if (typeof showToast === "function") showToast("⚠️ Slot already booked.", "error");
    return;
  }

  const faculty = typeof getFacultyById === "function" ? getFacultyById(facultyId) : null;

  const booking = {
    id:           "BK" + Date.now(),
    slotId:       selectedSlot.id,
    slotLabel:    selectedSlot.label,
    name:         name,
    email:        email.toLowerCase(),
    rollNo:       rollNo,
    purpose:      purpose,
    facultyId:    facultyId,
    facultyName:  faculty ? faculty.name : "Unknown",
    facultyDept:  faculty ? faculty.dept : "Unknown",
    date:         date,
    priority:     priority,
    duration:     duration,
    bookedAt:     new Date().toLocaleString(),
    status:       "confirmed"
  };

  const bookings = getBookings();
  bookings.push(booking);
  localStorage.setItem("bookings", JSON.stringify(bookings));
  localStorage.setItem("lastBooking", JSON.stringify(booking));

  // 👇 TEAMS-STYLE EMOJI CANNON TRIGGERED HERE 👇
  if (typeof fireEmojiConfetti === "function") fireEmojiConfetti();

  if (typeof showSuccessPopup === "function") {
    showSuccessPopup("Booking Confirmed! 🎉", `Your slot <strong>${booking.slotLabel}</strong> is booked!`, "confirmation.html", "View Details");
  } else {
    // Delays the redirect by 1.5 seconds so the user can enjoy the emoji explosion
    setTimeout(() => {
      window.location.href = "confirmation.html";
    }, 1500);
  }
}