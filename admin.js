// ===== ADMIN.JS =====

function getLoggedInFacultyId() {
  const storedName = (localStorage.getItem("userName") || "").toLowerCase().trim();
  let match = FACULTY_LIST.find(f => f.name.toLowerCase() === storedName);
  if (!match) {
    match = FACULTY_LIST.find(f => f.name.toLowerCase().includes(storedName) || storedName.includes(f.name.toLowerCase()));
  }
  return match ? match.id : null;
}

function getFacultyBookings() {
  const facultyId = getLoggedInFacultyId();
  if (!facultyId) return [];
  return (JSON.parse(localStorage.getItem("bookings")) || []).filter(b => b.facultyId === facultyId);
}

function updateAdminStats() {
  const all       = getFacultyBookings();
  const confirmed = all.filter(b => b.status === "confirmed").length;
  const cancelled = all.filter(b => b.status === "cancelled").length;

  const elTotal     = document.getElementById("statTotal");
  const elConfirmed = document.getElementById("statConfirmed");
  const elCancelled = document.getElementById("statCancelled");

  if (elTotal)     elTotal.textContent     = all.length;
  if (elConfirmed) elConfirmed.textContent = confirmed;
  if (elCancelled) elCancelled.textContent = cancelled;
}

function adminCancelBooking(bookingId) {
  const confirmed = confirm("Cancel this appointment?");
  if (!confirmed) return;

  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  const index = bookings.findIndex(b => b.id === bookingId);
  if (index === -1) return;

  bookings[index].status = "cancelled";
  localStorage.setItem("bookings", JSON.stringify(bookings));

  // Refresh both views
  if (typeof renderFilteredAdmin === "function") renderFilteredAdmin();
  if (typeof renderCalendar === "function") renderCalendar("calendarContainer");

  showAdminBanner("✅ Booking cancelled successfully.", "success");
}

function adminDeleteBooking(bookingId) {
  const confirmed = confirm("Permanently delete this booking? This cannot be undone.");
  if (!confirmed) return;

  let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  bookings = bookings.filter(b => b.id !== bookingId);
  localStorage.setItem("bookings", JSON.stringify(bookings));

  // Refresh both views
  if (typeof renderFilteredAdmin === "function") renderFilteredAdmin();
  if (typeof renderCalendar === "function") renderCalendar("calendarContainer");

  showAdminBanner("🗑️ Booking deleted permanently.", "warning");
}

function resetSystem() {
  const confirmed = confirm("⚠️ This will DELETE ALL your bookings. Are you sure?");
  if (!confirmed) return;

  const facultyId = getLoggedInFacultyId();
  let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  bookings = bookings.filter(b => b.facultyId !== facultyId);
  localStorage.setItem("bookings", JSON.stringify(bookings));

  if (typeof renderFilteredAdmin === "function") renderFilteredAdmin();
  if (typeof renderCalendar === "function") renderCalendar("calendarContainer");

  showAdminBanner("🔄 Your bookings have been cleared.", "warning");
}

function showAdminBanner(msg, type) {
  const existing = document.getElementById("adminBanner");
  if (existing) existing.remove();

  const banner = document.createElement("div");
  banner.id = "adminBanner";
  banner.className = "cancel-banner " + (type === "warning" ? "banner-warning" : "");
  banner.textContent = msg;

  const content = document.querySelector(".page-content");
  if (content) content.prepend(banner);

  setTimeout(() => banner.remove(), 4000);
}