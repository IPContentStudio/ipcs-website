const header = document.querySelector("[data-header]");
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");
const portfolioGrid = document.querySelector("#portfolio-grid");
const trackToggles = document.querySelectorAll(".track-toggle");

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

trackToggles.forEach((button) => {
  button.addEventListener("click", () => {
    const detail = document.getElementById(button.getAttribute("aria-controls"));
    const isOpen = button.getAttribute("aria-expanded") === "true";

    trackToggles.forEach((otherButton) => {
      const otherDetail = document.getElementById(otherButton.getAttribute("aria-controls"));
      otherButton.setAttribute("aria-expanded", "false");
      if (otherDetail) otherDetail.hidden = true;
    });

    button.setAttribute("aria-expanded", String(!isOpen));
    if (detail) detail.hidden = isOpen;
  });
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
    const link = makeElement("a", "portfolio-link");
    link.href = item.website;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", `${item.name} ${item.linkLabel || "홈페이지"} 새 창에서 열기`);
    article.dataset.portfolioId = item.id;
    article.dataset.year = String(item.year);
    article.dataset.status = item.status;
    article.dataset.investmentTypes = item.investmentTypes.join(" ");

    const top = makeElement("div", "portfolio-card-top");
    top.append(makeElement("span", "", String(index + 1).padStart(2, "0")), makeElement("span", "", `${item.linkLabel || "Visit website"} ↗`));

    const copy = makeElement("div", "portfolio-card-copy");
    copy.append(
      makeElement("p", "", item.category),
      makeElement("h3", "", item.name),
      makeElement("strong", "", item.englishName),
      makeElement("p", "portfolio-description", item.description)
    );

    const tags = makeElement("div", "tag-list");
    item.tags.forEach((tag) => tags.append(makeElement("span", "", tag)));
    link.append(top, copy, tags);
    article.append(link);
    portfolioGrid.append(article);
  });
};

renderPortfolio(window.IPCS_PORTFOLIO ?? []);
