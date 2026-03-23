const vibeBtn = document.getElementById("vibeBtn");
const statusText = document.getElementById("status");

vibeBtn?.addEventListener("click", () => {
  statusText.textContent = "Vibe boosted. Let's build something awesome. ⚡";
});