// ===== SLOTS.JS =====

const ALL_SLOTS = [
  { id: "slot1",  time: "09:00 AM", label: "9:00 AM - 9:30 AM"   },
  { id: "slot2",  time: "09:30 AM", label: "9:30 AM - 10:00 AM"  },
  { id: "slot3",  time: "10:00 AM", label: "10:00 AM - 10:30 AM" },
  { id: "slot4",  time: "10:30 AM", label: "10:30 AM - 11:00 AM" },
  { id: "slot5",  time: "11:00 AM", label: "11:00 AM - 11:30 AM" },
  { id: "slot6",  time: "11:30 AM", label: "11:30 AM - 12:00 PM" },
  { id: "slot7",  time: "02:00 PM", label: "2:00 PM - 2:30 PM"   },
  { id: "slot8",  time: "02:30 PM", label: "2:30 PM - 3:00 PM"   },
  { id: "slot9",  time: "03:00 PM", label: "3:00 PM - 3:30 PM"   },
  { id: "slot10", time: "03:30 PM", label: "3:30 PM - 4:00 PM"   },
  { id: "slot11", time: "04:00 PM", label: "4:00 PM - 4:30 PM"   },
  { id: "slot12", time: "04:30 PM", label: "4:30 PM - 5:00 PM"   },
];

const FACULTY_LIST = [
  { id: "f1", name: "Dr. Ramesh Kumar",   dept: "Computer Science" },
  { id: "f2", name: "Prof. Anita Sharma", dept: "Mathematics"      },
  { id: "f3", name: "Dr. Suresh Nair",    dept: "Electronics"      },
  { id: "f4", name: "Prof. Meena Iyer",   dept: "Physics"          },
  { id: "f5", name: "Dr. Arvind Singh",   dept: "Mechanical"       },
];

function getFacultyById(id) { return FACULTY_LIST.find(f => f.id === id) || null; }
function getSlotById(id) { return ALL_SLOTS.find(s => s.id === id) || null; }

function getBookedSlotIds(date, facultyId) {
  if (!date || !facultyId) return [];
  try {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    return bookings.filter(b => b.status !== "cancelled" && b.date === date && b.facultyId === facultyId).map(b => b.slotId);
  } catch(e) { 
    return []; 
  }
}

function getBlockedByDuration(date, facultyId) {
  if (!date || !facultyId) return [];
  try {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const blocked = [];
    bookings.filter(b => b.status !== "cancelled" && b.date === date && b.facultyId === facultyId && b.duration === "1hr").forEach(b => {
      const idx = ALL_SLOTS.findIndex(s => s.id === b.slotId);
      if (idx !== -1 && idx + 1 < ALL_SLOTS.length) blocked.push(ALL_SLOTS[idx + 1].id);
    });
    return blocked;
  } catch(e) { 
    return []; 
  }
}

function renderSlotsWithColors(containerId, onSelectCallback) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const dateInput    = document.getElementById("bookingDate");
  const facultyInput = document.getElementById("facultySelect");

  const date      = dateInput ? dateInput.value.trim() : "";
  const facultyId = facultyInput ? facultyInput.value.trim() : "";

  const oldSummary = document.getElementById("slotsSummary");
  if (oldSummary) oldSummary.remove();

  if (!date || !facultyId) {
    container.innerHTML = `<div class="placeholder-text">📅 Please select a <strong>date</strong> and 👨‍🏫 <strong>faculty</strong> above to see available slots.</div>`;
    return;
  }

  const bookedIds      = getBookedSlotIds(date, facultyId);
  const blockedIds     = getBlockedByDuration(date, facultyId);
  const allUnavailable = [...new Set([...bookedIds, ...blockedIds])];

  const total     = ALL_SLOTS.length;
  const booked    = allUnavailable.length;
  const freeCount = total - booked;

  container.innerHTML = ""; // Clear loader/placeholder

  ALL_SLOTS.forEach(slot => {
    const isUnavailable = allUnavailable.includes(slot.id);
    const card = document.createElement("div");
    card.className = "slot-card " + (isUnavailable ? "slot-booked" : "slot-available");
    card.id = slot.id;

    let colorClass = "slot-color-green";
    if (booked / total > 0.8) colorClass = "slot-color-red";
    else if (booked / total > 0.5) colorClass = "slot-color-amber";

    card.innerHTML = `<span class="slot-time">${slot.label}</span><span class="slot-status">${isUnavailable ? '<span class="dot dot-red"></span> Booked' : `<span class="dot ${colorClass}"></span> Available`}</span>`;

    if (!isUnavailable && typeof onSelectCallback === "function") {
      card.style.cursor = "pointer";
      card.onclick = () => onSelectCallback(slot);
    }
    container.appendChild(card);
  });

  const summary = document.createElement("div");
  summary.id = "slotsSummary";
  summary.className = "slots-summary";
  summary.innerHTML = `<div class="slots-progress-bar"><div class="slots-progress-fill" style="width:${(booked / total) * 100}%"></div></div><p class="slots-summary-text"><span class="text-green">${freeCount} slots free</span> &nbsp;•&nbsp; <span class="text-red">${booked} booked</span> &nbsp;•&nbsp; ${total} total</p>`;
  container.after(summary);
}