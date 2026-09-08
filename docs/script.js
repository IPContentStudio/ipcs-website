const header = document.querySelector("[data-header]");
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");
const portfolioGrid = document.querySelector("#portfolio-grid");
const trackToggles = document.querySelectorAll(".track-toggle");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.documentElement.classList.add("motion-ready");

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

const updateScrollState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 40);
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
  document.documentElement.style.setProperty("--scroll-progress", String(progress));
};

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) closeMenu();
});

document.querySelectorAll(".email-link[data-subject]").forEach((link) => {
  const subject = link.getAttribute("data-subject");
  link.setAttribute("href", `mailto:jhpark@ipcontentstudio.com?subject=${encodeURIComponent(subject)}`);
});

const copyToast = document.querySelector(".copy-toast");
let copyToastTimer;

const copyText = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
};

document.querySelectorAll("[data-copy-email]").forEach((button) => {
  button.addEventListener("click", async () => {
    try {
      await copyText(button.getAttribute("data-copy-email"));
      if (!copyToast) return;
      window.clearTimeout(copyToastTimer);
      copyToast.hidden = false;
      requestAnimationFrame(() => copyToast.classList.add("is-visible"));
      copyToastTimer = window.setTimeout(() => {
        copyToast.classList.remove("is-visible");
        window.setTimeout(() => { copyToast.hidden = true; }, 220);
      }, 2200);
    } catch {
      if (!copyToast) return;
      copyToast.textContent = "복사하지 못했습니다. 이메일 주소를 직접 선택해 주세요.";
      copyToast.hidden = false;
      copyToast.classList.add("is-visible");
    }
  });
});

trackToggles.forEach((button) => {
  const detail = document.getElementById(button.getAttribute("aria-controls"));
  if (detail) {
    detail.hidden = false;
    detail.setAttribute("aria-hidden", "true");
  }

  button.addEventListener("click", () => {
    const selectedDetail = document.getElementById(button.getAttribute("aria-controls"));
    const isOpen = button.getAttribute("aria-expanded") === "true";

    trackToggles.forEach((otherButton) => {
      const otherDetail = document.getElementById(otherButton.getAttribute("aria-controls"));
      otherButton.setAttribute("aria-expanded", "false");
      otherButton.closest(".track-card")?.classList.remove("is-open");
      otherDetail?.setAttribute("aria-hidden", "true");
    });

    button.setAttribute("aria-expanded", String(!isOpen));
    button.closest(".track-card")?.classList.toggle("is-open", !isOpen);
    selectedDetail?.setAttribute("aria-hidden", String(isOpen));
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
    top.append(makeElement("span", "", String(index + 1).padStart(2, "0")), makeElement("span", "", `${item.linkLabel || "홈페이지"} ↗`));

    const copy = makeElement("div", "portfolio-card-copy");
    copy.append(
      makeElement("p", "", item.category),
      makeElement("h3", "", item.name),
      makeElement("strong", "", item.englishName),
      makeElement("p", "portfolio-description", item.description)
    );

    const tags = makeElement("div", "tag-list");
    item.tags.forEach((tag) => tags.append(makeElement("span", "", tag)));
    const meta = makeElement("dl", "portfolio-meta");
    const yearRow = makeElement("div");
    yearRow.append(makeElement("dt", "", "Investment year"), makeElement("dd", "", String(item.year)));
    const roleRow = makeElement("div");
    roleRow.append(makeElement("dt", "", "IPCS role"), makeElement("dd", "", item.role));
    meta.append(yearRow, roleRow);
    link.append(top, copy, meta, tags);
    article.append(link);
    portfolioGrid.append(article);
  });
};

renderPortfolio(window.IPCS_PORTFOLIO ?? []);

const revealTargets = [
  ...document.querySelectorAll(".section-pad .eyebrow, .glance-layout, .system-heading, .registration-status, .tracks-intro, .tracks, .portfolio-heading, .partners-heading, .partner-cards, .about-grid, .team-block, .company-profile, .footer-top"),
  ...document.querySelectorAll(".capability-list article, .portfolio-grid article")
];

revealTargets.forEach((element, index) => {
  element.classList.add("reveal-item");
  element.style.setProperty("--reveal-order", String(index % 5));
});

const platformVisual = document.querySelector(".platform-visual");
platformVisual?.classList.add("poc-motion");

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealTargets.forEach((element) => element.classList.add("is-visible"));
  platformVisual?.classList.add("is-visible");
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -8%" });

  revealTargets.forEach((element) => revealObserver.observe(element));
  if (platformVisual) revealObserver.observe(platformVisual);
}

const revealHashTarget = (hash) => {
  if (!hash || hash === "#") return;
  const section = document.querySelector(hash);
  if (!section) return;
  section.querySelectorAll(".reveal-item").forEach((element) => element.classList.add("is-visible"));
  if (section === document.querySelector("#platform")) platformVisual?.classList.add("is-visible");
};

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => revealHashTarget(link.getAttribute("href")));
});
window.addEventListener("hashchange", () => revealHashTarget(window.location.hash));
revealHashTarget(window.location.hash);

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll("#site-nav a")];

const updateActiveNavigation = () => {
  const marker = window.scrollY + window.innerHeight * 0.32;
  let currentSection;

  sections.forEach((section) => {
    if (section.offsetTop <= marker) currentSection = section;
  });

  navLinks.forEach((link) => {
    const active = currentSection && link.getAttribute("href") === `#${currentSection.id}`;
    link.classList.toggle("is-active", Boolean(active));
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
};

window.addEventListener("scroll", updateActiveNavigation, { passive: true });
window.addEventListener("resize", updateActiveNavigation);
updateActiveNavigation();
