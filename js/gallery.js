/* ==========================================================================
   GALLERY RENDERER & INTERACTIONS (js/gallery.js)
   Renders carousels, person cards, friend filters, heart likes, and scroll-spy.
   ========================================================================== */

// 1. Reusable Carousel Renderer
function renderCarousel(carouselId, slides, options) {
    var container = document.getElementById(carouselId);
    if (!container || !slides || !slides.length) return;
    var opts = options || {};
    var showIndicators = opts.indicators !== false;
    var imgStyle = opts.imgStyle || "";

    var indicatorsHtml = "";
    if (showIndicators) {
        var btns = slides.map(function (_, idx) {
            return '<button type="button" data-bs-target="#' + carouselId + '" data-bs-slide-to="' + idx + '"' +
                (idx === 0 ? ' class="active" aria-current="true"' : '') +
                ' aria-label="Slide ' + (idx + 1) + '"></button>';
        }).join("");
        indicatorsHtml = '<div class="carousel-indicators">' + btns + '</div>';
    }

    var slidesHtml = slides.map(function (slide, idx) {
        var captionBlock = slide.title && showIndicators
            ? '<div class="carousel-caption d-none d-md-block">' +
              '<h5>' + slide.title + '</h5>' +
              (slide.caption ? '<p>' + slide.caption + '</p>' : '') +
              '</div>'
            : '';
        return '<div class="carousel-item' + (idx === 0 ? ' active' : '') + '">' +
            '<img src="' + slide.picture + '" class="d-block w-100" alt="' + (slide.title || 'Slide') + '"' +
            (imgStyle ? ' style="' + imgStyle + '"' : '') + ' />' +
            captionBlock +
            '</div>';
    }).join("");

    container.innerHTML =
        indicatorsHtml +
        '<div class="carousel-inner' + (opts.innerClass ? ' ' + opts.innerClass : '') + '">' + slidesHtml + '</div>' +
        '<button class="carousel-control-prev" type="button" data-bs-target="#' + carouselId + '" data-bs-slide="prev">' +
        '  <span class="nm-carousel-control"><span class="carousel-control-prev-icon" aria-hidden="true"></span></span>' +
        '  <span class="visually-hidden">Previous</span>' +
        '</button>' +
        '<button class="carousel-control-next" type="button" data-bs-target="#' + carouselId + '" data-bs-slide="next">' +
        '  <span class="nm-carousel-control"><span class="carousel-control-next-icon" aria-hidden="true"></span></span>' +
        '  <span class="visually-hidden">Next</span>' +
        '</button>';
}

if (typeof carousels !== "undefined") {
    renderCarousel("carouselFamily", carousels.family, { indicators: true });
    renderCarousel("carouselFriends", carousels.friends, { indicators: true });
    renderCarousel("carouselColleagues", carousels.colleagues, { indicators: true });
    renderCarousel("carouselExampleAutoplaying", carousels.girlfriend, {
        indicators: false,
        innerClass: "rounded-3",
        imgStyle: "height: 420px; object-fit: cover; border-radius: 14px;"
    });
}

// 2. Render Family Cards (#contentFamily)
var contentFamily = document.getElementById("contentFamily");
for (var i = 0; i < family.length; i++) {
    var fam = family[i];
    var lbIndex = registerLightboxItem({
        category: "Chapter 01 • My Family",
        title: fam.role,
        subtitle: fam.tag || "Family Member",
        description: fam.description,
        picture: fam.picture,
        tags: [fam.role, fam.tag || "Family"]
    });

    contentFamily.innerHTML +=
        '<div class="col-6 col-md-4 col-lg-3">' +
        '  <div class="nm-person-card text-center" onclick="openLightbox(' + lbIndex + ')">' +
        '    <div>' +
        '      <div class="nm-photo-bezel">' +
        '        <img src="' + fam.picture + '" alt="' + fam.role + '" loading="lazy" />' +
        '        <span class="nm-zoom-hint"><i class="bi bi-arrows-angle-expand"></i></span>' +
        '      </div>' +
        '      <h5 class="nm-card-title">' + fam.role + '</h5>' +
        '      <span class="nm-tag-pill">' + (fam.tag || "Family") + '</span>' +
        '      <div class="nm-card-divider"></div>' +
        '      <p class="nm-card-desc">' + fam.description + '</p>' +
        '    </div>' +
        '  </div>' +
        '</div>';
}

// 3. Render & Filter Friends (#contentFriends)
var contentFriends = document.getElementById("contentFriends");
var friendLightboxIndices = [];

for (var j = 0; j < friends.length; j++) {
    var fr = friends[j];
    var parsedTags = fr.tags || fr.description.split(/<br\s*\/?>/i).map(function (s) { return s.trim(); });
    var lbIdx = registerLightboxItem({
        category: "Chapter 02 • My Friends",
        title: fr.name,
        subtitle: "Reason of Friendship",
        description: fr.description.replace(/<br\s*\/?>/gi, " • "),
        picture: fr.picture,
        tags: parsedTags
    });
    friendLightboxIndices.push(lbIdx);
}

function renderFriends(filterCategory) {
    contentFriends.innerHTML = "";
    var shownCount = 0;

    for (var i = 0; i < friends.length; i++) {
        var fr = friends[i];
        var rawParts = fr.description.split(/<br\s*\/?>/i).map(function (s) { return s.trim(); });
        var allTags = fr.tags || rawParts;
        var matches = filterCategory === "All" || allTags.some(function (t) {
            return t.toLowerCase() === filterCategory.toLowerCase();
        }) || fr.description.toLowerCase().indexOf(filterCategory.toLowerCase()) !== -1;

        if (!matches) continue;
        shownCount++;

        var pillsHtml = rawParts.map(function (part) {
            return '<span class="nm-tag-pill">' + part + '</span>';
        }).join("");

        contentFriends.innerHTML +=
            '<div class="col-6 col-md-4 col-lg-3 nm-fade-item">' +
            '  <div class="nm-person-card text-center" onclick="openLightbox(' + friendLightboxIndices[i] + ')">' +
            '    <div>' +
            '      <div class="nm-photo-bezel">' +
            '        <img src="' + fr.picture + '" alt="' + fr.name + '" loading="lazy" />' +
            '        <span class="nm-zoom-hint"><i class="bi bi-arrows-angle-expand"></i></span>' +
            '      </div>' +
            '      <h5 class="nm-card-title">' + fr.name + '</h5>' +
            '      <div class="nm-card-subtitle mb-1">Reason of Friendship</div>' +
            '      <div class="nm-card-divider"></div>' +
            '      <div class="d-flex flex-wrap justify-content-center gap-1 mt-2">' + pillsHtml + '</div>' +
            '    </div>' +
            '  </div>' +
            '</div>';
    }

    var badge = document.getElementById("friendsCountBadge");
    if (badge) {
        badge.textContent = filterCategory === "All"
            ? "Showing All " + shownCount + " Friends"
            : "Showing " + shownCount + " in " + filterCategory;
    }
}

function filterFriends(category, btnEl) {
    var buttons = document.querySelectorAll("#friendsFilterBar .nm-pill-btn");
    buttons.forEach(function (b) { b.classList.remove("active"); });
    if (btnEl) btnEl.classList.add("active");
    renderFriends(category);
}

renderFriends("All");

// 4. Render Colleagues (#contentColleagues)
var contentColleagues = document.getElementById("contentColleagues");
for (var k = 0; k < colleagues.length; k++) {
    var col = colleagues[k];
    var colLbIdx = registerLightboxItem({
        category: "Chapter 03 • My Colleagues",
        title: col.name,
        subtitle: "Reason of Companionship",
        description: col.description,
        picture: col.picture,
        tags: [col.tag || "Colleague", "College Life"]
    });

    contentColleagues.innerHTML +=
        '<div class="col-6 col-md-4">' +
        '  <div class="nm-person-card text-center" onclick="openLightbox(' + colLbIdx + ')">' +
        '    <div>' +
        '      <div class="nm-photo-bezel">' +
        '        <img src="' + col.picture + '" alt="' + col.name + '" loading="lazy" />' +
        '        <span class="nm-zoom-hint"><i class="bi bi-arrows-angle-expand"></i></span>' +
        '      </div>' +
        '      <h5 class="nm-card-title">' + col.name + '</h5>' +
        '      <div class="nm-card-subtitle mb-1">Reason of Companionship</div>' +
        '      <span class="nm-tag-pill">' + (col.tag || "Colleague") + '</span>' +
        '      <div class="nm-card-divider"></div>' +
        '      <p class="nm-card-desc fst-italic">"' + col.description + '"</p>' +
        '    </div>' +
        '  </div>' +
        '</div>';
}

// 5. Render Girlfriend Section & Heart Toggle (#contentGirlfriend)
var contentGirlfriend = document.getElementById("contentGirlfriend");
var likedGirlfriendCards = { 0: true, 1: true, 2: true, 3: true, 4: true };

function updateHeartCounter() {
    var total = 0;
    Object.keys(likedGirlfriendCards).forEach(function (key) {
        if (likedGirlfriendCards[key]) total++;
    });
    var countEl = document.getElementById("heartCountValue");
    if (countEl) countEl.textContent = total;
}

function toggleGirlfriendHeart(event, idx) {
    event.stopPropagation();
    likedGirlfriendCards[idx] = !likedGirlfriendCards[idx];
    var btn = document.getElementById("gfHeartBtn-" + idx);
    if (btn) {
        if (likedGirlfriendCards[idx]) {
            btn.classList.add("liked");
            btn.innerHTML = '<i class="bi bi-heart-fill"></i>';
        } else {
            btn.classList.remove("liked");
            btn.innerHTML = '<i class="bi bi-heart"></i>';
        }
    }
    updateHeartCounter();
}

for (var g = 0; g < girlfriend.length; g++) {
    var gf = girlfriend[g];
    var gfLbIdx = registerLightboxItem({
        category: "Chapter 04 • My Girlfriend ♥",
        title: gf.description,
        subtitle: gf.subtitle || "Special Memory",
        description: gf.description + " — " + (gf.subtitle || "Forever grateful for every moment together."),
        picture: gf.picture,
        tags: ["Love", "Cherished Memory"]
    });

    contentGirlfriend.innerHTML +=
        '<div class="col-6 col-md-4">' +
        '  <div class="nm-person-card text-center" onclick="openLightbox(' + gfLbIdx + ')">' +
        '    <div>' +
        '      <div class="nm-photo-bezel">' +
        '        <img src="' + gf.picture + '" alt="' + gf.description + '" loading="lazy" />' +
        '        <span class="nm-zoom-hint"><i class="bi bi-arrows-angle-expand"></i></span>' +
        '      </div>' +
        '    </div>' +
        '    <div class="d-flex align-items-center justify-content-between gap-2 pt-1 text-start">' +
        '      <div>' +
        '        <div class="fw-bold small" style="color: var(--nm-text);">' + gf.description + '</div>' +
        '        <div class="small" style="color: var(--nm-text-muted); font-size: 0.75rem;">' + (gf.subtitle || "Special Memory") + '</div>' +
        '      </div>' +
        '      <button type="button" id="gfHeartBtn-' + g + '" class="nm-heart-btn liked"' +
        '        onclick="toggleGirlfriendHeart(event, ' + g + ')" aria-label="Like memory">' +
        '        <i class="bi bi-heart-fill"></i>' +
        '      </button>' +
        '    </div>' +
        '  </div>' +
        '</div>';
}

// 6. Navbar Scroll-Spy Active Highlighting
var sectionIds = ["Home", "sectionFamily", "sectionFriends", "sectionColleagues", "sectionGirlfriend"];
window.addEventListener("scroll", function () {
    var scrollPos = window.scrollY + 180;
    var currentId = "Home";
    for (var s = 0; s < sectionIds.length; s++) {
        var sec = document.getElementById(sectionIds[s]);
        if (sec && sec.offsetTop <= scrollPos) {
            currentId = sectionIds[s];
        }
    }
    var navLinks = document.querySelectorAll("[data-nav-section]");
    navLinks.forEach(function (link) {
        if (link.getAttribute("data-nav-section") === currentId) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
});

