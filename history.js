// ===== HISTORY.JS =====

function renderAllHistory() {
  const container  = document.getElementById("historyContainer");
  const totalCount = document.getElementById("totalCount");
  if (!container) return;

  const query  = document.getElementById("historySearch")?.value || "";
  const status = document.getElementById("historyStatusFilter")?.value || "all";

  // Get logged in user details
  const loggedEmail = (localStorage.getItem("userEmail") || "").toLowerCase().trim();
  const loggedName  = (localStorage.getItem("userName") || "").toLowerCase().trim();

  // Show bookings belonging to the logged-in user (match by Email OR Name)
  let bookings = (JSON.parse(localStorage.getItem("bookings")) || []).filter(b => {
    const bEmail = (b.email || "").toLowerCase().trim();
    const bName  = (b.name || "").toLowerCase().trim();
    return bEmail === loggedEmail || bName === loggedName;
  });

  // Filter by status
  if (status !== "all") {
    bookings = bookings.filter(b => b.status === status);
  }

  // Filter by search query
  if (query.trim() !== "") {
    const q = query.toLowerCase();
    bookings = bookings.filter(b =>
      b.name?.toLowerCase().includes(q)        ||
      b.purpose?.toLowerCase().includes(q)     ||
      b.slotLabel?.toLowerCase().includes(q)   ||
      b.facultyName?.toLowerCase().includes(q) ||
      b.date?.toLowerCase().includes(q)        ||
      b.id?.toLowerCase().includes(q)
    );
  }

  // Update count badge
  if (totalCount) totalCount.textContent = bookings.length + " Appointment(s)";

  // Empty state
  if (bookings.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>No appointments found</h3>
        <p>You haven't booked any appointments yet.</p>
        <a href="booking.html" class="btn btn-primary" style="margin-top: 10px;">Book Now</a>
      </div>
    `;
    return;
  }

  // Render booking cards
  container.innerHTML = bookings.reverse().map(booking => `
    <div class="history-card ${booking.status === 'cancelled' ? 'card-cancelled' : 'card-confirmed'}" id="card-${booking.id}">
      <div class="history-card-header">
        <span class="booking-id"># ${booking.id}</span>
        <span class="booking-status-badge ${booking.status === 'cancelled' ? 'badge-cancelled' : 'badge-confirmed'}">
          ${booking.status === 'cancelled' ? '❌ Cancelled' : '✅ Confirmed'}
        </span>
      </div>

      <div class="history-card-body">
        <div class="history-detail"><span class="hd-label">🕐 Time Slot</span><span class="hd-value">${booking.slotLabel}</span></div>
        <div class="history-detail"><span class="hd-label">📅 Date</span><span class="hd-value">${booking.date || "N/A"}</span></div>
        <div class="history-detail"><span class="hd-label">👨‍🏫 Faculty</span><span class="hd-value">${booking.facultyName || "N/A"}</span></div>
        <div class="history-detail"><span class="hd-label">🏛️ Department</span><span class="hd-value">${booking.facultyDept || "N/A"}</span></div>
        <div class="history-detail"><span class="hd-label">👤 Name</span><span class="hd-value">${booking.name}</span></div>
        <div class="history-detail"><span class="hd-label">🎓 Roll No</span><span class="hd-value">${booking.rollNo || "N/A"}</span></div>
        <div class="history-detail"><span class="hd-label">📝 Purpose</span><span class="hd-value">${booking.purpose}</span></div>
        <div class="history-detail"><span class="hd-label">⚡ Priority</span><span class="hd-value">${booking.priority || "medium"}</span></div>
      </div>

      ${booking.status !== 'cancelled' ? `
      <div class="history-card-footer">
        <button class="btn btn-danger-sm" style="padding: 8px 16px;" onclick="handleCancel('${booking.id}')">
          🗑️ Cancel Appointment
        </button>
      </div>` : `
      <div class="history-card-footer"><span class="cancelled-note">This appointment was cancelled.</span></div>`}
    </div>
  `).join("");
}

function cancelBooking(bookingId) {
  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  const index    = bookings.findIndex(b => b.id === bookingId);
  if (index === -1) return false;
  bookings[index].status = "cancelled";
  localStorage.setItem("bookings", JSON.stringify(bookings));
  return true;
}

function handleCancel(bookingId) {
  if (!confirm("Are you sure you want to cancel this appointment?")) return;
  if (cancelBooking(bookingId)) {
    renderAllHistory();
    showCancelSuccess();
  }
}

function showCancelSuccess() {
  const existing = document.getElementById("cancelBanner");
  if (existing) existing.remove();
  const banner = document.createElement("div");
  banner.id = "cancelBanner";
  banner.className = "cancel-banner";
  banner.textContent = "✅ Appointment cancelled successfully. Slot is now free.";
  const content = document.querySelector(".page-content");
  if (content) content.prepend(banner);
  setTimeout(() => banner.remove(), 4000);
}