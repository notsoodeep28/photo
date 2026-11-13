const photoIndexUrl = new URL("photo-index.json", document.baseURI);

function createPhotoTrigger(asset, description, alt) {
  const trigger = document.createElement("button");
  trigger.className = "photo-trigger";
  trigger.type = "button";

  const image = document.createElement("img");
  image.src = new URL(asset.path, document.baseURI).href;
  image.alt = alt || `${description} photograph`;
  image.loading = "lazy";
  image.decoding = "async";
  trigger.append(image);

  return trigger;
}

function getSetPhotos(photoIndex, setId) {
  return photoIndex.filter((photo) => photo.set === setId);
}

function renderCollectionCards(photoIndex) {
  const collectionGrid = document.querySelector(".collection-grid");
  if (!collectionGrid) {
    return;
  }

  collectionGrid.replaceChildren();

  for (const set of window.photoSets) {
    const photos = getSetPhotos(photoIndex, set.id);
    if (photos.length === 0) {
      continue;
    }

    const card = document.createElement("article");
    card.className = "collection-card";

    const cover = photos.find((photo) => photo.path === set.cover) || photos[0];
    card.append(createPhotoTrigger(cover, set.title, set.coverAlt));

    const info = document.createElement("div");
    info.className = "collection-info";

    const kicker = document.createElement("span");
    kicker.className = "collection-kicker";
    kicker.textContent = `${set.medium} / ${photos.length} photographs`;

    const title = document.createElement("a");
    title.className = "collection-title";
    title.href = `photo-set.html?set=${encodeURIComponent(set.id)}`;
    title.textContent = set.title;

    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "\u2197";
    title.append(arrow);

    info.append(kicker, title);
    card.append(info);
    collectionGrid.append(card);
  }
}

function renderPhotoSet(photoIndex) {
  const page = document.querySelector("[data-photo-set-page]");
  if (!page) {
    return;
  }

  const setId = new URLSearchParams(window.location.search).get("set");
  const set = window.photoSets.find((item) => item.id === setId);
  const heading = page.querySelector(".page-heading");
  const grid = page.querySelector(".photo-grid");

  if (!set) {
    heading.querySelector(".eyebrow").textContent = "Photo set";
    heading.querySelector("h1").textContent = "Set not found";
    heading.querySelector("p:last-child").textContent =
      "Choose a photo set from the collection page.";
    grid.replaceChildren();
    return;
  }

  const photos = getSetPhotos(photoIndex, set.id);
  heading.querySelector(".eyebrow").textContent =
    `${set.medium} / ${photos.length} photographs`;
  heading.querySelector("h1").textContent = set.title;
  heading.querySelector("p:last-child").textContent = set.description;
  grid.setAttribute("aria-label", `${set.title} photographs`);
  grid.replaceChildren();

  for (const photo of photos) {
    const figure = document.createElement("figure");
    figure.append(createPhotoTrigger(photo, photo.description));

    const caption = document.createElement("figcaption");
    caption.className = "photo-description";
    caption.textContent = photo.description;
    figure.append(caption);
    grid.append(figure);
  }

  window.layoutPhotoGrids();
}

async function loadPhotoLibrary() {
  const response = await fetch(photoIndexUrl);
  if (!response.ok) {
    throw new Error(`Could not load the photo index: ${response.status}`);
  }

  const photoIndex = await response.json();
  if (!Array.isArray(photoIndex)) {
    throw new TypeError("The photo index must be an array.");
  }

  renderCollectionCards(photoIndex);
  renderPhotoSet(photoIndex);
}

loadPhotoLibrary().catch((error) => {
  console.error(error);
  const message = document.querySelector("[data-photo-library-error]");
  if (message) {
    message.hidden = false;
    message.textContent =
      "Photos could not be loaded. Please try again later.";
  }
});
