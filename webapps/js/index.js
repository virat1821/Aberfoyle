
// ABOUT ABERFOYLE INN 
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".about-card, .about-image-wrap")
      .forEach(el => el.style.opacity = 1);
  });



  // navbar
document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".navbar-collapse .nav-link");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  navLinks.forEach(function(link) {
    link.addEventListener("click", function () {
      const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
        toggle: false
      });
      bsCollapse.hide();
    });
  });
});



// modal
window.addEventListener("load", function () {
  setTimeout(function () {
    const modal = new bootstrap.Modal(document.getElementById('welcomeModal'));
    modal.show();
  }, 2000);
});




