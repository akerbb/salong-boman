<<<<<<< HEAD
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");

    const isOpen = nav.classList.contains("active");
    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });
}

/* Accordion för kategorier */
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
    category.classList.toggle("collapsed");
    category.classList.toggle("open");
  });
});

/* Filter */
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    categories.forEach((category) => {
      const show = filter === "all" || category.dataset.category === filter;
      category.style.display = show ? "block" : "none";
    });
  });
});

/* Läs mer */
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
=======
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");

    const isOpen = nav.classList.contains("active");
    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });
}

/* Accordion för kategorier */
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
    category.classList.toggle("collapsed");
    category.classList.toggle("open");
  });
});

/* Filter */
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    categories.forEach((category) => {
      const show = filter === "all" || category.dataset.category === filter;
      category.style.display = show ? "block" : "none";
    });
  });
});

/* Läs mer */
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
>>>>>>> 0925739dba8ea5e86c183dc9c1c67b1fa5adb855
});