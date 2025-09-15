'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
// const select = document.querySelector("[data-select]");
// const selectItems = document.querySelectorAll("[data-select-item]");
// const selectValue = document.querySelector("[data-selecct-value]");
// const filterBtn = document.querySelectorAll("[data-filter-btn]");

// select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
// for (let i = 0; i < selectItems.length; i++) {
//   selectItems[i].addEventListener("click", function () {

//     let selectedValue = this.innerText.toLowerCase();
//     selectValue.innerText = this.innerText;
//     elementToggleFunc(select);
//     filterFunc(selectedValue);

//   });
// }

// filter variables
// const filterItems = document.querySelectorAll("[data-filter-item]");

// const filterFunc = function (selectedValue) {

//   for (let i = 0; i < filterItems.length; i++) {

//     if (selectedValue === "all") {
//       filterItems[i].classList.add("active");
//     } else if (selectedValue === filterItems[i].dataset.category) {
//       filterItems[i].classList.add("active");
//     } else {
//       filterItems[i].classList.remove("active");
//     }

//   }

// }

// add event in all filter button items for large screen
// let lastClickedBtn = filterBtn[0];

// for (let i = 0; i < filterBtn.length; i++) {

//   filterBtn[i].addEventListener("click", function () {

//     let selectedValue = this.innerText.toLowerCase();
//     selectValue.innerText = this.innerText;
//     filterFunc(selectedValue);

//     lastClickedBtn.classList.remove("active");
//     this.classList.add("active");
//     lastClickedBtn = this;

//   });

// }



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

navigationLinks.forEach((btn) => {
  btn.addEventListener("click", () => {
    // prefer data-target if present; otherwise fall back to button text
    const target = (btn.dataset.target || btn.textContent).trim().toLowerCase();

    // toggle pages
    pages.forEach((page) => {
      const match = page.dataset.page === target;
      page.classList.toggle("active", match);
    });

    // toggle nav buttons
    navigationLinks.forEach((link) => {
      const isActive = link === btn;
      link.classList.toggle("active", isActive);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});



document.addEventListener("DOMContentLoaded", () => {
  const ROLE_CONFIG = {
    "software": { subtitle: "Software Engineer", defaultPage: "about" },
    "ai-ml":   { subtitle: "AI/ML Developer", defaultPage: "about" },
    "ui-ux":   { subtitle: "UI/UX Designer", defaultPage: "about" },
  };

  // 1) Read role from URL, then localStorage, else default
  const params = new URLSearchParams(window.location.search);
  let role = params.get("role") || localStorage.getItem("activeRole") || "software";
  if (!ROLE_CONFIG[role]) role = "software";

  // 2) Persist and expose role to the DOM
  localStorage.setItem("activeRole", role);
  document.body.setAttribute("data-role-active", role);

  // 3) Update the small subtitle under your name
  const subtitleEl = document.getElementById("role-subtitle");
  if (subtitleEl) subtitleEl.textContent = ROLE_CONFIG[role].subtitle;

  // 4) Update the browser tab title
  document.title = `Mohammad Al-Buraiki · ${ROLE_CONFIG[role].subtitle}`;

  // 5) Open the default tab for this role
  function setActivePage(pageId) {
    // toggle articles
    document.querySelectorAll("article[data-page]").forEach(a => {
      a.classList.toggle("active", a.dataset.page === pageId);
    });

    // toggle navbar buttons by their text labels
    document.querySelectorAll(".navbar .navbar-link").forEach(btn => {
      const label = btn.textContent.trim().toLowerCase(); // about, resume, projects, contact
      btn.classList.toggle("active", label === pageId);
    });
  }

  setActivePage(ROLE_CONFIG[role].defaultPage);

    // === Category/Role sync ===
  // Treat category == role so we can reuse your role CSS & subtitle.
  const categoryBar = document.getElementById("category-bar");
  const catButtons = categoryBar ? categoryBar.querySelectorAll("[data-set-category]") : [];

  function filterProjectsBy(category) {
    const items = document.querySelectorAll(".project-item");
    let shown = 0;
    items.forEach(li => {
      const rolesAttr = (li.getAttribute("data-roles") || "").toLowerCase();
      const isAll = rolesAttr === "" || rolesAttr === "all";
      const roles = isAll ? [] : rolesAttr.split(",").map(s => s.trim());
      const match = isAll || roles.includes(category);
      li.style.display = match ? "" : "none";
      if (match) shown++;
    });
    if (shown === 0) items.forEach(li => (li.style.display = "")); // safety fallback
  }

  function setCategory(category) {
    // 1) Persist & expose (skills/about already react via CSS)
    localStorage.setItem("activeRole", category);
    document.body.setAttribute("data-role-active", category);

    // 2) Update subtitle + tab title using your ROLE_CONFIG
    if (ROLE_CONFIG[category]) {
      const subtitleEl = document.getElementById("role-subtitle");
      if (subtitleEl) subtitleEl.textContent = ROLE_CONFIG[category].subtitle;
      document.title = `Mohammad Al-Buraiki · ${ROLE_CONFIG[category].subtitle}`;
    }

    // 3) Filter projects to this category
    filterProjectsBy(category);

    // 4) Visually update category buttons
    catButtons.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.setCategory === category);
    });

    // 5) Keep the URL’s role param in sync (nice for sharing)
    const params = new URLSearchParams(location.search);
    params.set("role", category);
    history.replaceState(null, "", `${location.pathname}?${params.toString()}${location.hash}`);
  }

  // Initialize category from role (so /ai-ml picks AI/ML)
  setCategory(role);

  // Wire button clicks
  catButtons.forEach(btn => {
    btn.addEventListener("click", () => setCategory(btn.dataset.setCategory));
  });



  // Show only projects that match the active role.
  function applyRoleToProjects(activeRole) {
    const items = Array.from(document.querySelectorAll(".project-item"));
    let shown = 0;

    items.forEach(li => {
      const rolesAttr = li.getAttribute("data-roles");
      const isAll = !rolesAttr || rolesAttr.trim().toLowerCase() === "all";
      const roles = isAll ? [] : rolesAttr.split(",").map(s => s.trim().toLowerCase());
      const match = isAll || roles.includes(activeRole);
      li.style.display = match ? "" : "none";
      if (match) shown++;
    });

    // Optional fallback. If nothing matches, show all so the grid is never empty.
    if (shown === 0) items.forEach(li => (li.style.display = ""));
  }

  applyRoleToProjects(role);



});
