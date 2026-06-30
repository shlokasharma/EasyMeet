// ===== MAIN.JS (Interactive Home Page Logic) =====

document.addEventListener("DOMContentLoaded", function () {
  initFloatingParticles();
  initParallaxHero();
});

// 1. Generate Floating Academic Particles
function initFloatingParticles() {
  const container = document.getElementById("particlesContainer");
  if (!container) return;

  const icons = ['🎓', '📚', '📝', '📅', '✨', '💡'];
  const particleCount = 15;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "floating-particle";
    particle.innerText = icons[Math.floor(Math.random() * icons.length)];
    
    // Randomize position, size, and animation timing
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";
    particle.style.fontSize = (Math.random() * 1.5 + 1) + "rem";
    particle.style.animationDuration = (Math.random() * 10 + 10) + "s";
    particle.style.animationDelay = "-" + (Math.random() * 10) + "s";
    
    container.appendChild(particle);
  }
}

// 2. Interactive Parallax Effect on Hero
function initParallaxHero() {
  const heroSection = document.getElementById("heroSection");
  const illustration = document.getElementById("heroIllustration");
  const studentFig = document.getElementById("studentFig");
  const calendarFig = document.getElementById("calendarFig");

  if (!heroSection || !illustration) return;

  heroSection.addEventListener("mousemove", (e) => {
    // Calculate mouse position relative to the center of the screen
    const xAxis = (window.innerWidth / 2 - e.pageX) / 30;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 30;

    // Move the entire illustration block slightly
    illustration.style.transform = `translate(${xAxis}px, ${yAxis}px)`;
    
    // Move the internal elements at different speeds for 3D depth
    if(studentFig) studentFig.style.transform = `translate(${xAxis * 1.5}px, ${yAxis * 1.5}px) rotate(${xAxis / 5}deg)`;
    if(calendarFig) calendarFig.style.transform = `translate(${xAxis * -0.8}px, ${yAxis * -0.8}px) rotate(${xAxis / -5}deg)`;
  });

  // Reset positions when mouse leaves the hero area
  heroSection.addEventListener("mouseleave", () => {
    illustration.style.transform = `translate(0px, 0px)`;
    if(studentFig) studentFig.style.transform = `translate(0px, 0px) rotate(0deg)`;
    if(calendarFig) calendarFig.style.transform = `translate(0px, 0px) rotate(0deg)`;
  });
}