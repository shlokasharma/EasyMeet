// ===== BULLETPROOF DARK MODE =====

// 1. Load saved theme immediately 
function loadTheme() {
  const theme = localStorage.getItem("theme") || "light";
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}

// 2. Safely Toggle Theme
function toggleDarkMode(event) {
  // Prevent form submissions or link clicks if button is wrapped
  if (event) event.preventDefault(); 
  
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  
  // Safely trigger the popup only if the UI system is loaded
  if (typeof showToast === "function") {
      showToast(isDark ? "🌙 Dark mode enabled" : "☀️ Light mode enabled", "success");
  }
}

// 3. Auto-attach the button when the page loads (This ignores HTML errors)
document.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  
  // Find all dark mode buttons on the page and force them to work
  const toggleBtns = document.querySelectorAll(".dark-mode-btn, #darkModeBtn");
  
  toggleBtns.forEach(btn => {
      // Remove any broken HTML onclick attributes
      btn.removeAttribute("onclick");
      // Force the click listener
      btn.addEventListener("click", toggleDarkMode);
  });
});

// Run once immediately just in case
loadTheme();