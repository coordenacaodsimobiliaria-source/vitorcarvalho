document.addEventListener("DOMContentLoaded", function () {
  var lightbox = document.getElementById("lightbox");
  var lightboxImage = document.getElementById("lightbox-image");
  if (!lightbox || !lightboxImage) return;

  document.querySelectorAll("[data-lightbox]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      lightboxImage.src = link.getAttribute("href");
      lightboxImage.alt = link.querySelector("img").alt;
      lightbox.hidden = false;
    });
  });

  lightbox.querySelector(".lightbox-close").addEventListener("click", function () {
    lightbox.hidden = true;
  });

  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
      lightbox.hidden = true;
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !lightbox.hidden) {
      lightbox.hidden = true;
    }
  });
});
