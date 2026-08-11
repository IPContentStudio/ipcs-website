const header = document.querySelector("[data-header]");
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");
const portfolioGrid = document.querySelector("#portfolio-grid");

const closeMenu = () => {
  toggle?.setAttribute("aria-expanded", "false");
  header?.classList.remove("menu-open");
};

toggle?.addEventListener("click", () => {
  const isOpen = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!isOpen));
  header?.classList.toggle("menu-open", !isOpen);
});

nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 40);
}, { passive: true });

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) closeMenu();
});

document.querySelectorAll(".email-link[data-subject]").forEach((link) => {
  const subject = link.getAttribute("data-subject");
  link.setAttribute("href", `mailto:jhpark@human108.com?subject=${encodeURIComponent(subject)}`);
});

const makeElement = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
};

const renderPortfolio = (items) => {
  if (!portfolioGrid) return;
  portfolioGrid.replaceChildren();

  items.forEach((item, index) => {
    const article = makeElement("article", item.highlight === "platform-operator" ? "is-platform-operator" : "");
    article.dataset.portfolioId = item.id;
    article.dataset.year = String(item.year);
    article.dataset.status = item.status;
    article.dataset.investmentTypes = item.investmentTypes.join(" ");

    const top = makeElement("div", "portfolio-card-top");
    top.append(makeElement("span", "", String(index + 1).padStart(2, "0")), makeElement("span", "", "Portfolio"));

    const copy = makeElement("div", "portfolio-card-copy");
    copy.append(
      makeElement("p", "", item.category),
      makeElement("h3", "", item.name),
      makeElement("strong", "", item.englishName),
      makeElement("p", "portfolio-description", item.description)
    );

    const tags = makeElement("div", "tag-list");
    item.tags.forEach((tag) => tags.append(makeElement("span", "", tag)));
    article.append(top, copy, tags);
    portfolioGrid.append(article);
  });
};

renderPortfolio(window.IPCS_PORTFOLIO ?? []);
