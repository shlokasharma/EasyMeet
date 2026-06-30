// ===== CALENDAR.JS =====

let currentYear  = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let selectedDate = null;

const MONTH_NAMES = [
  "January","February","March","April",
  "May","June","July","August",
  "September","October","November","December"
];

function renderCalendar(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Read directly from local storage to guarantee we get the data
  const allBookings = JSON.parse(localStorage.getItem("bookings")) || [];
  const loggedFacultyId = typeof getLoggedInFacultyId === "function" ? getLoggedInFacultyId() : null;

  // Find days with active bookings for this faculty
  const bookedDates = allBookings.map(b => {
    if (b.status === "cancelled" || !b.date) return -1;
    if (loggedFacultyId && b.facultyId !== loggedFacultyId) return -1;
    
    const parts = b.date.trim().split("-");
    if (parts.length !== 3) return -1;
    
    const yr = parseInt(parts[0], 10);
    const mo = parseInt(parts[1], 10) - 1; // 0-indexed month
    const dy = parseInt(parts[2], 10);
    
    if (mo === currentMonth && yr === currentYear) return dy;
    return -1;
  }).filter(d => d !== -1);

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = new Date();

  let calHTML = `
    <div class="calendar-wrapper">
      <div class="calendar-header">
        <button class="cal-nav-btn" onclick="prevMonth()">‹</button>
        <span class="cal-title">${MONTH_NAMES[currentMonth]} ${currentYear}</span>
        <button class="cal-nav-btn" onclick="nextMonth()">›</button>
      </div>
      <div class="calendar-grid">
        <div class="cal-day-label">Sun</div><div class="cal-day-label">Mon</div>
        <div class="cal-day-label">Tue</div><div class="cal-day-label">Wed</div>
        <div class="cal-day-label">Thu</div><div class="cal-day-label">Fri</div>
        <div class="cal-day-label">Sat</div>
  `;

  for (let i = 0; i < firstDay; i++) {
    calHTML += `<div class="cal-cell cal-empty"></div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = (d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear());
    const isBooked = bookedDates.includes(d);
    const isSelected = selectedDate === d;
    
    let cellClass = "cal-cell";
    if (isToday) cellClass += " cal-today";
    if (isBooked) cellClass += " cal-has-booking";
    if (isSelected) cellClass += " cal-selected";

    calHTML += `
      <div class="${cellClass}" onclick="selectDate(${d})">
        <span class="cal-date-num">${d}</span>
        ${isBooked ? `<span class="cal-dot"></span>` : ""}
      </div>
    `;
  }

  calHTML += `
      </div>
      <div class="cal-legend">
        <span class="legend-item"><span class="legend-dot dot-today"></span> Today</span>
        <span class="legend-item"><span class="legend-dot dot-booked"></span> Has Bookings</span>
        <span class="legend-item"><span class="legend-dot dot-selected"></span> Selected</span>
      </div>
    </div>
    <div id="calDayDetails" class="cal-day-details" style="display:none; padding:0; background:transparent; border:none; margin-top:25px;"></div>
  `;

  container.innerHTML = calHTML;
  if (selectedDate) showDateBookings(selectedDate);
}

function selectDate(day) {
  selectedDate = day;
  renderCalendar("calendarContainer");
}

function showDateBookings(day) {
  const detailsEl = document.getElementById("calDayDetails");
  if (!detailsEl) return;
  detailsEl.style.display = "block";

  const loggedFacultyId = typeof getLoggedInFacultyId === "function" ? getLoggedInFacultyId() : null;
  const allBookings = JSON.parse(localStorage.getItem("bookings")) || [];

  // Filter bookings for the exactly clicked day
  const bookings = allBookings.filter(b => {
    if (!b.date || b.status === "cancelled") return false;
    if (loggedFacultyId && b.facultyId !== loggedFacultyId) return false;
    
    const parts = b.date.trim().split("-");
    if (parts.length !== 3) return false;
    
    const yr = parseInt(parts[0], 10);
    const mo = parseInt(parts[1], 10) - 1;
    const dy = parseInt(parts[2], 10);
    
    return dy === day && mo === currentMonth && yr === currentYear;
  });

  const dateLabel = `${MONTH_NAMES[currentMonth]} ${day}, ${currentYear}`;

  if (bookings.length === 0) {
    detailsEl.innerHTML = `
      <div class="calendar-wrapper" style="text-align:center; padding:30px;">
        <h4 style="color:#3b2f2f; font-size:1.2rem; margin-bottom:10px;">📅 ${dateLabel}</h4>
        <p style="color:#7a6655; font-style:italic;">No appointments scheduled on this day.</p>
      </div>`;
    return;
  }

  // Inject the exact, full Admin Table format
  detailsEl.innerHTML = `
    <h3 style="color:#3b2f2f; margin-bottom: 15px; border-left: 5px solid #c8813a; padding-left: 10px;">
      📅 Bookings for ${dateLabel} (${bookings.length})
    </h3>
    <div class="bookings-table-wrapper" style="margin-top:0;">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Student Name</th>
            <th>Roll No</th>
            <th>Email</th>
            <th>Time Slot</th>
            <th>Purpose</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${bookings.map(b => `
            <tr class="${b.status === 'cancelled' ? 'row-cancelled' : ''}">
              <td><span class="booking-id">${b.id}</span></td>
              <td><strong>${b.name}</strong></td>
              <td>${b.rollNo || "N/A"}</td>
              <td>${b.email}</td>
              <td style="font-weight:700; color:#c8813a;">${b.slotLabel}</td>
              <td>${b.purpose}</td>
              <td>
                <span class="priority-badge priority-${b.priority || 'medium'}">
                  ${b.priority === 'urgent' ? '🔴 Urgent' : b.priority === 'low' ? '🟢 Low' : '🟡 Medium'}
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
    </div>
  `;
}

function prevMonth() { currentMonth--; if (currentMonth < 0) { currentMonth = 11; currentYear--; } selectedDate = null; renderCalendar("calendarContainer"); }
function nextMonth() { currentMonth++; if (currentMonth > 11) { currentMonth = 0; currentYear++; } selectedDate = null; renderCalendar("calendarContainer"); }
function goToToday() { currentYear = new Date().getFullYear(); currentMonth = new Date().getMonth(); selectedDate = new Date().getDate(); renderCalendar("calendarContainer"); }