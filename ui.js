// ===== UI.JS =====

function showSuccessPopup(title, message, redirectUrl, redirectLabel) {
  const existing = document.getElementById("successPopup");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "successPopup";
  overlay.className = "popup-overlay";

  overlay.innerHTML = `
    <div class="popup-card">
      <div class="popup-icon">🎉</div>
      <h3 class="popup-title">${title}</h3>
      <p class="popup-message">${message}</p>
      <div class="popup-actions">
        ${redirectUrl ? `<a href="${redirectUrl}" class="btn btn-primary">${redirectLabel || "Continue"}</a>` : ""}
        <button class="btn btn-outline-dark" onclick="closePopup()">Close</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.add("popup-visible"), 10);
}

function closePopup() {
  const popup = document.getElementById("successPopup");
  if (popup) {
    popup.classList.remove("popup-visible");
    setTimeout(() => popup.remove(), 300);
  }
}

function showToast(message, type) {
  const existing = document.getElementById("toastMsg");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "toastMsg";
  toast.className = "toast " + (type === "error" ? "toast-error" : type === "warning" ? "toast-warning" : "toast-success");
  toast.textContent = message;

  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("toast-visible"), 10);
  setTimeout(() => {
    toast.classList.remove("toast-visible");
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

function animatePageEntrance() {
  const content = document.querySelector(".page-content, .login-wrapper, .confirm-wrapper, .hero");
  if (content) {
    content.style.opacity = "0";
    content.style.transform = "translateY(18px)";
    content.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    setTimeout(() => {
      content.style.opacity = "1";
      content.style.transform = "translateY(0)";
    }, 60);
  }
}

// Automatically inject organic background blobs on all pages EXCEPT index.html
function injectBackgroundBlobs() {
  const path = window.location.pathname;
  if (path.endsWith("index.html") || path === "/" || path.endsWith("EasyMeet/")) return;

  if (document.querySelector(".bg-blobs")) return; // Prevent duplicates

  const blobContainer = document.createElement("div");
  blobContainer.className = "bg-blobs";
  blobContainer.innerHTML = `
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>
  `;
  
  // Prepend makes sure it goes to the very back
  document.body.prepend(blobContainer);
}

document.addEventListener("DOMContentLoaded", function () {
  animatePageEntrance();
  injectBackgroundBlobs();
});

// ===== EMOJI CANNON (ui.js) =====
function fireEmojiConfetti() {
  // The emojis we want to explode
  const emojis = ['🎉', '✨', '🎊', '🚀', '✅', '👏'];
  const container = document.body;
  
  // Fire 40 emojis
  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div');
    particle.className = 'emoji-particle';
    particle.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    
    // Start from the exact center of the screen
    particle.style.left = '50vw';
    particle.style.top = '50vh';
    
    // Randomize explosion distance and rotation
    const tx = (Math.random() - 0.5) * 800 + 'px'; // Spread wide left/right
    const ty = (Math.random() - 0.5) * 800 + 'px'; // Spread high/low
    const rot = (Math.random() - 0.5) * 720 + 'deg'; // Spin wildly
    
    // Pass these random values to our CSS variables
    particle.style.setProperty('--tx', tx);
    particle.style.setProperty('--ty', ty);
    particle.style.setProperty('--rot', rot);
    
    // Randomize size and speed
    particle.style.fontSize = (Math.random() * 1.5 + 1.2) + 'rem';
    particle.style.animationDuration = (Math.random() * 1.5 + 1.5) + 's';
    
    container.appendChild(particle);
    
    // Remove them from the HTML after they fade out
    setTimeout(() => {
      particle.remove();
    }, 3000);
  }
}