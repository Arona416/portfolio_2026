const body = document.body;
const header = document.getElementById("header");
const navToggle = document.getElementById("navToggle");
const navPanel = document.getElementById("navPanel");
const themeToggle = document.getElementById("themeToggle");
const toTop = document.getElementById("toTop");
const loader = document.querySelector(".loader");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const contactForm = document.querySelector(".contact-form");

let lastScrollY = window.scrollY;

body.classList.add("is-loading");

// Keep the first impression polished while assets and fonts settle.
window.addEventListener("load", () => {
  window.setTimeout(() => {
    loader.classList.add("is-hidden");
    body.classList.remove("is-loading");
  }, 650);
});

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "light") {
  body.classList.add("light-theme");
}

// Persist the visitor's theme choice for future sessions.
themeToggle.addEventListener("click", () => {
  body.classList.toggle("light-theme");
  localStorage.setItem("portfolio-theme", body.classList.contains("light-theme") ? "light" : "dark");
});

navToggle.addEventListener("click", () => {
  const isOpen = navPanel.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navPanel.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navPanel.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Header behavior balances quick navigation with more reading space.
window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;
  header.classList.toggle("is-scrolled", currentScroll > 24);
  header.classList.toggle("is-hidden", currentScroll > lastScrollY && currentScroll > 420);
  toTop.classList.toggle("is-visible", currentScroll > 650);
  lastScrollY = currentScroll;
});

toTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Reveal content and animate skill bars only once for better performance.
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      const delay = element.dataset.delay || 0;
      element.style.setProperty("--delay", `${delay}ms`);
      element.classList.add("is-visible");

      if (element.classList.contains("skill-card")) {
        const progress = element.querySelector(".progress span");
        progress.style.width = `${element.dataset.level}%`;
      }

      revealObserver.unobserve(element);
    });
  },
  { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

// Project category filtering without dependencies or page reloads.
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      const categories = card.dataset.category || "";
      const shouldShow = filter === "all" || categories.includes(filter);
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

// Placeholder interaction for future detailed case-study pages.
document.querySelectorAll(".project-more").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".project-card");
    const title = card.querySelector("h3")?.textContent || "проект";
    button.textContent = "Скоро будет доступно";
    button.setAttribute("aria-label", `Детальная страница проекта ${title} скоро будет доступна`);

    window.setTimeout(() => {
      button.textContent = "Подробнее";
    }, 1800);
  });
});

if (contactForm) {
  // Let FormSubmit deliver the message while showing immediate local feedback.
  contactForm.addEventListener("submit", () => {
    const status = contactForm.querySelector(".form-status");
    status.textContent = "Спасибо! Сообщение отправляется на email.";
  });
}

// Subtle parallax on the hero analytics panel for a premium desktop feel.
document.addEventListener("mousemove", (event) => {
  const visual = document.querySelector(".data-orbit");
  if (!visual || window.innerWidth < 900) return;

  const x = (event.clientX / window.innerWidth - 0.5) * 10;
  const y = (event.clientY / window.innerHeight - 0.5) * 10;
  visual.style.transform = `translate3d(${x}px, ${y}px, 0)`;
});
