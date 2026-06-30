function showToast(msg) {
  const t = document.createElement("div");
  t.className = "toast toast-success";
  t.innerText = msg;
  document.body.appendChild(t);

  setTimeout(() => t.remove(), 3000);
}

function animatePageEntrance() {
  document.body.style.opacity = 0;
  setTimeout(() => {
    document.body.style.opacity = 1;
  }, 100);
}

document.addEventListener("DOMContentLoaded", animatePageEntrance);