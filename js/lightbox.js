/* ==========================================================================
   LIGHTBOX MODAL CONTROLLER (js/lightbox.js)
   Manages full-size portrait modal viewing and keyboard arrow navigation.
   ========================================================================== */

var lightboxItems = [];
var currentLightboxIndex = 0;
var lightboxModalInstance = null;

function registerLightboxItem(item) {
    var idx = lightboxItems.length;
    lightboxItems.push(item);
    return idx;
}

function openLightbox(index) {
    if (index < 0 || index >= lightboxItems.length) return;
    currentLightboxIndex = index;
    var item = lightboxItems[index];

    document.getElementById("lightboxCategory").textContent = item.category;
    document.getElementById("lightboxTitle").textContent = item.title;
    document.getElementById("lightboxSubtitle").textContent = item.subtitle;
    document.getElementById("lightboxDescription").innerHTML = item.description;
    document.getElementById("lightboxImage").src = item.picture;
    document.getElementById("lightboxImage").alt = item.title;
    document.getElementById("lightboxIndexLabel").textContent = (index + 1) + " / " + lightboxItems.length;

    var tagsHtml = "";
    if (item.tags && item.tags.length) {
        for (var t = 0; t < item.tags.length; t++) {
            tagsHtml += '<span class="nm-tag-pill">' + item.tags[t] + '</span>';
        }
    }
    document.getElementById("lightboxTags").innerHTML = tagsHtml;

    var modalEl = document.getElementById("galleryLightboxModal");
    if (!lightboxModalInstance && typeof bootstrap !== "undefined") {
        lightboxModalInstance = new bootstrap.Modal(modalEl);
    }
    if (lightboxModalInstance) {
        lightboxModalInstance.show();
    }
}

function navigateLightbox(delta) {
    var nextIdx = (currentLightboxIndex + delta + lightboxItems.length) % lightboxItems.length;
    openLightbox(nextIdx);
}

function openHeroPortraitLightbox() {
    openLightbox(0);
}

window.addEventListener("keydown", function (e) {
    var modalEl = document.getElementById("galleryLightboxModal");
    if (modalEl && modalEl.classList && modalEl.classList.contains("show")) {
        if (e.key === "ArrowLeft") navigateLightbox(-1);
        if (e.key === "ArrowRight") navigateLightbox(1);
    }
});

// Register Hero Portrait at index 0
registerLightboxItem({
    category: "Gallery Creator",
    title: "John Eduard Madriaga",
    subtitle: "Co-founder of eduCode",
    description: "Welcome to my Gallery Website showcasing the family, friends, colleagues, and partner who have shaped my life into who I am today.",
    picture: "images/myPic.jpg",
    tags: ["eduCode", "Creator", "Gallery"]
});

