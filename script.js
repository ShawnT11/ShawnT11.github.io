const menuButton = document.querySelector(".menu-button");
const siteNav = document.querySelector(".site-nav");
const filterButtons = document.querySelectorAll(".filter-chip");
const searchInput = document.querySelector("#article-search");
const articleCards = document.querySelectorAll(".article-card");
const emptyState = document.querySelector("#empty-state");

let activeFilter = "all";
let query = "";

function normalize(value) {
  return value.trim().toLowerCase();
}

function applyFilters() {
  let visibleCount = 0;

  articleCards.forEach((card) => {
    const topic = card.dataset.topic;
    const title = normalize(card.dataset.title || "");
    const text = normalize(card.textContent || "");
    const matchesTopic = activeFilter === "all" || topic === activeFilter;
    const matchesQuery = !query || title.includes(query) || text.includes(query);
    const isVisible = matchesTopic && matchesQuery;
    card.classList.toggle("hidden", !isVisible);
    if (isVisible) {
      visibleCount += 1;
    }
  });

  emptyState.classList.toggle("hidden", visibleCount > 0);
}

menuButton.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    applyFilters();
  });
});

searchInput.addEventListener("input", (event) => {
  query = normalize(event.target.value);
  applyFilters();
});
