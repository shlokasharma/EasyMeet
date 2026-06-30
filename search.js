// ===== SEARCH.JS =====

function renderFilteredAdmin() {
  const query     = document.getElementById("adminSearch")?.value  || "";
  const status    = document.getElementById("statusFilter")?.value || "all";
  const dateRange = document.getElementById("dateFilter")?.value   || "all";

  const facultyId = typeof getLoggedInFacultyId === "function" ? getLoggedInFacultyId() : null;
  let results = (JSON.parse(localStorage.getItem("bookings")) || [])
    .filter(b => facultyId && b.facultyId === facultyId)
    .reverse();

  if (query.trim() !== "") {
    const q = query.toLowerCase().trim();
    results = results.filter(b =>
      b.name?.toLowerCase().includes(q)      ||
      b.email?.toLowerCase().includes(q)     ||
      b.purpose?.toLowerCase().includes(q)   ||
      b.slotLabel?.toLowerCase().includes(q) ||
      b.rollNo?.toLowerCase().includes(q)    ||
      b.id?.toLowerCase().includes(q)
    );
  }

  if (status !== "all") {
    results = results.filter(b => b.status === status);
  }

  if (dateRange !== "all") {
    const today = new Date().toISOString().split("T")[0];
    const now   = new Date();

    if (dateRange === "today") {
      results = results.filter(b => b.date === today);
    }
    if (dateRange === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      const weekAgoStr = weekAgo.toISOString().split("T")[0];
      results = results.filter(b => b.date >= weekAgoStr && b.date <= today);
    }
  }

  renderAdminTable(results);
  if (typeof updateAdminStats === "function") updateAdminStats();
}

function renderAdminTable(bookings) {
  const container = document.getElementById("bookingsTable");
  if (!container) return;

  if (bookings.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>No results found</h3>
        <p>Try a different search or filter.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Booking ID</th>
          <th>Student Name</th>
          <th>Roll No</th>
          <th>Email</th>
          <th>Date</th>
          <th>Time Slot</th>
          <th>Purpose</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${bookings.map(b => `
          <tr id="row-${b.id}" class="${b.status === 'cancelled' ? 'row-cancelled' : ''}">
            <td><span class="booking-id">${b.id}</span></td>
            <td><strong>${b.name}</strong></td>
            <td>${b.rollNo || "N/A"}</td>
            <td>${b.email}</td>
            <td>${b.date || "N/A"}</td>
            <td style="font-weight:700; color:#c8813a;">${b.slotLabel}</td>
            <td>${b.purpose}</td>
            <td>
              <span class="priority-badge priority-${b.priority || 'medium'}">
                ${b.priority === 'urgent' ? '🔴 Urgent' : b.priority === 'low'  ? '🟢 Low' : '🟡 Medium'}
              </span>
            </td>
            <td>
              <span class="booking-status-badge ${b.status === 'cancelled' ? 'badge-cancelled' : 'badge-confirmed'}">
                ${b.status === 'cancelled' ? '❌ Cancelled' : '✅ Confirmed'}
              </span>
            </td>
            <td>
              ${b.status !== 'cancelled' ? `
                <button class="btn-danger-sm" onclick="adminCancelBooking('${b.id}')">Cancel</button>
              ` : `<span style="color:#aaa;font-size:0.82rem">—</span>`}
              <button class="btn-delete-sm" onclick="adminDeleteBooking('${b.id}')">Delete</button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}