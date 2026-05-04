document.addEventListener("DOMContentLoaded", () => {
  initMenu();
  loadSiteContent();
  loadTreatments();
  initFloatingButtons();
});

function initMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");

  if (!menuToggle || !nav) return;

  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");

    const isOpen = nav.classList.contains("active");
    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    });
  });
}

async function loadSiteContent() {
  try {
    const response = await fetch("content/site.json");
    if (!response.ok) return;

    const site = await response.json();

    document.querySelectorAll(".logo").forEach((logo) => {
      logo.textContent = site.companyName || "Salong Boman";
    });

    setText("heroTitle", site.heroTitle);
    setText("heroText", site.heroText);
    setText("siteAddress", site.address);

    const email = document.getElementById("siteEmail");
    if (email && site.email) {
      email.textContent = site.email;
      email.href = `mailto:${site.email}`;
    }

    const phone = document.getElementById("sitePhone");
    if (phone && site.phone) {
      phone.textContent = site.phone;
      phone.href = `tel:${site.phone.replace(/\D/g, "")}`;
    }

    document.querySelectorAll(".book-btn, .sticky-book").forEach((button) => {
      if (site.bookingUrl && button.textContent.toLowerCase().includes("boka")) {
        button.href = site.bookingUrl;
      }
    });

    document.querySelectorAll("footer p").forEach((footer) => {
      if (site.address && site.phone) {
        footer.textContent = `${site.address} | ${site.phone}`;
      }
    });
  } catch (error) {
    console.warn("Kunde inte läsa site.json", error);
  }
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element && value) {
    element.textContent = value;
  }
}

async function loadTreatments() {
  const container = document.getElementById("treatmentsContainer");
  if (!container) return;

  try {
    const response = await fetch("content/treatments.json");
    if (!response.ok) return;

    const data = await response.json();
    const treatments = data.items || [];

    if (!treatments.length) {
      container.innerHTML = "<p>Inga behandlingar hittades.</p>";
      return;
    }

    const grouped = groupByCategory(treatments);
    container.innerHTML = renderTreatmentCategories(grouped);

    initAccordion();
    initReadMore();
  } catch (error) {
    console.warn("Kunde inte läsa treatments.json", error);
    container.innerHTML = "<p>Kunde inte ladda behandlingar just nu.</p>";
  }
}

function groupByCategory(items) {
  return items.reduce((groups, item) => {
    const category = item.category || "Övrigt";

    if (!groups[category]) {
      groups[category] = [];
    }

    groups[category].push(item);
    return groups;
  }, {});
}

function renderTreatmentCategories(grouped) {
  return Object.entries(grouped)
    .map(([category, treatments]) => {
      const slug = slugify(category);

      const treatmentHTML = treatments
        .map((treatment) => {
          return `
            <article class="treatment">
              <div>
                <h3>${escapeHTML(treatment.title || "")}</h3>
                ${treatment.time ? `<span class="treatment-meta">${escapeHTML(treatment.time)}</span>` : ""}
                ${
                  treatment.description
                    ? `<p class="treatment-description collapsed">${escapeHTML(treatment.description)}</p>`
                    : ""
                }
              </div>
              <strong class="treatment-price">${escapeHTML(treatment.price || "")}</strong>
            </article>
          `;
        })
        .join("");

      return `
        <section class="category" data-category="${slug}">
          <h2>${escapeHTML(category)} <span class="category-count"></span></h2>
          ${treatmentHTML}
        </section>
      `;
    })
    .join("");
}

function initAccordion() {
  const categories = document.querySelectorAll(".category[data-category]");

  categories.forEach((category, index) => {
    const heading = category.querySelector("h2");
    if (!heading) return;

    if (index === 0) {
      category.classList.add("open");
      category.classList.remove("collapsed");
    } else {
      category.classList.add("collapsed");
      category.classList.remove("open");
    }

    heading.addEventListener("click", () => {
      const isOpen = category.classList.contains("open");

      categories.forEach((item) => {
        item.classList.add("collapsed");
        item.classList.remove("open");
      });

      if (!isOpen) {
        category.classList.remove("collapsed");
        category.classList.add("open");
      }
    });
  });
}

function initReadMore() {
  document.querySelectorAll(".treatment-description").forEach((text) => {
    if (text.scrollHeight > text.clientHeight) {
      const button = document.createElement("button");
      button.className = "read-more-btn";
      button.textContent = "Läs mer";

      button.addEventListener("click", (event) => {
        event.stopPropagation();

        text.classList.toggle("collapsed");

        button.textContent = text.classList.contains("collapsed")
          ? "Läs mer"
          : "Visa mindre";
      });

      text.after(button);
    }
  });
}

function initFloatingButtons() {
  const stickyBook = document.querySelector(".sticky-book");
  const scrollTop = document.querySelector(".scroll-top");

  function toggleFloatingButtons() {
    const show = window.scrollY > 350;

    if (stickyBook) {
      stickyBook.classList.toggle("visible", show);
    }

    if (scrollTop) {
      scrollTop.classList.toggle("visible", show);
    }
  }

  window.addEventListener("scroll", toggleFloatingButtons);
  toggleFloatingButtons();
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replaceAll("å", "a")
    .replaceAll("ä", "a")
    .replaceAll("ö", "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}