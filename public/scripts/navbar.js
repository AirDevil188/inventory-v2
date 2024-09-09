function navbarControl() {
  const navElement = document.querySelector("nav");
  const mainContainer = document.querySelector("main");
  const navIcon = document.querySelector("#navIcon");

  if (document.querySelector("header").contains(navIcon)) {
    navIcon.addEventListener("click", () => {
      navElement.classList.toggle("expanded");
      mainContainer.style.gridRow = "3/4";
      return overlayControl();
    });
  }
}

function overlayControl() {
  const mainContainer = document.querySelector("main");
  const overlayElement = document.querySelector(".overlay");
  const navElement = document.querySelector("nav");

  if (navElement.classList.contains("expanded")) {
    overlayElement.classList.add("open");
    overlayElement.style.display = "block";
  } else {
    return;
  }

  overlayElement.addEventListener("click", () => {
    navElement.classList.remove("expanded");
    overlayElement.classList.remove("open");
    overlayElement.style.display = "none";
    mainContainer.style.gridRow = "2/4";
  });
  overlayElement.removeEventListener("click", overlayControl);
}
navbarControl();
