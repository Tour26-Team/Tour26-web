const navContainer = document.querySelector(".navContainer");
const isMobile = () => window.innerWidth <= 640;

const navHeaderBtn = document
  .getElementById("navHeaderBtn")
  ?.addEventListener("click", () => {
    if (isMobile()) {
      navContainer.classList.toggle("open");
    } else {
      navContainer.classList.toggle("collapsed");
    }
  });

// CREATE NEW TOUR UTILS
const createNewTourCon = document.querySelector(".createNewTourCon");

const createTourBtn = document
  .getElementById("createTourBtn")
  ?.addEventListener("click", () => {
    createNewTourCon.classList.remove("isHidden");
  });

const createNewTourCloseBtn = document
  .getElementById("createNewTourCloseBtn")
  ?.addEventListener("click", () => {
    createNewTourCon.classList.add("isHidden");
  });
