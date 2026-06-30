// ===== AUTH.JS =====

let selectedRole = null;

// Only clear session state on fresh open, never wipe the whole storage
if (!sessionStorage.getItem("sessionActive")) {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
}
sessionStorage.setItem("sessionActive", "true");

function selectRole(role) {
  selectedRole = role;
  const roleStudent = document.getElementById("roleStudent");
  const roleFaculty = document.getElementById("roleFaculty");
  
  if(roleStudent) roleStudent.classList.remove("active");
  if(roleFaculty) roleFaculty.classList.remove("active");
  
  if (role === "student" && roleStudent) {
    roleStudent.classList.add("active");
  } else if (role === "faculty" && roleFaculty) {
    roleFaculty.classList.add("active");
  }
}

function handleLogin() {
  const nameEl  = document.getElementById("userName");
  const emailEl = document.getElementById("userEmail");
  const errorEl = document.getElementById("loginError");

  const name  = nameEl ? nameEl.value.trim() : "";
  const email = emailEl ? emailEl.value.trim() : "";

  if (!selectedRole || !name || !email.includes("@")) {
    if (typeof showToast === "function") showToast("⚠️ Please fill all details correctly.", "error");
    if (errorEl) errorEl.textContent = "⚠️ Please fill all details correctly.";
    return;
  }

  localStorage.setItem("userRole", selectedRole);
  localStorage.setItem("userName", name);
  localStorage.setItem("userEmail", email.toLowerCase());
  localStorage.setItem("isLoggedIn", "true");
  sessionStorage.setItem("sessionActive", "true");

  // Redirect based on role
  window.location.href = selectedRole === "student" ? "index.html" : "admin.html";
}

function handleLogout() {
  // Clear the session
  sessionStorage.clear();
  
  // CAREFUL DELETION: Only remove login details. Do NOT use localStorage.clear() here!
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  // Your 'bookings' array is now safely left alone in local storage!
  
  window.location.href = "login.html";
}

function requireLogin() {
  if (!localStorage.getItem("isLoggedIn")) window.location.href = "login.html";
}

// ===== DYNAMIC ROLE-BASED NAVBAR =====
function showUserInNav() {
  const name       = localStorage.getItem("userName");
  const role       = localStorage.getItem("userRole"); // "student" or "faculty"
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  
  const navLinks   = document.querySelector(".nav-links");
  const loginBtn   = document.querySelector(".btn-login");

  // 1. Filter links based on role
  const studentLinks = document.querySelectorAll(".student-only");
  const facultyLinks = document.querySelectorAll(".faculty-only");

  studentLinks.forEach(link => {
    link.style.display = (isLoggedIn && role === "student") ? "block" : "none";
  });

  facultyLinks.forEach(link => {
    link.style.display = (isLoggedIn && role === "faculty") ? "block" : "none";
  });

  // 2. Transform the Login button into a Profile/Logout button
  if (isLoggedIn && name && navLinks) {
    if (loginBtn) {
      loginBtn.textContent = `👤 ${name} (${role})`;
      loginBtn.href        = "#";
      loginBtn.style.pointerEvents = "none";
      loginBtn.style.opacity       = "0.85";
    }

    if (!document.getElementById("logoutBtn")) {
      const li = document.createElement("li");
      li.innerHTML = `
        <button id="logoutBtn" class="btn-logout" style="cursor:pointer; margin-left:15px; background: #b94040; color: white; border: none; padding: 6px 14px; border-radius: 20px; font-weight: 600;" onclick="handleLogout()">
          🚪 Logout
        </button>
      `;
      navLinks.appendChild(li);
    }
  }
}

document.addEventListener("DOMContentLoaded", showUserInNav);