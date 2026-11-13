const photoDialog = document.querySelector(".photo-dialog");
const photoDialogImage = photoDialog.querySelector(".photo-dialog-image");
const photoDialogCaption = photoDialog.querySelector(".photo-dialog-caption");
const photoDialogClose = photoDialog.querySelector(".photo-dialog-close");

document.querySelectorAll(".photo-trigger").forEach((trigger) => {
  const image = trigger.querySelector("img");
  const figure = trigger.closest("figure");
  const collection = trigger.closest(".collection-card");
  const description =
    figure?.querySelector(".photo-description") ??
    collection?.querySelector(".collection-kicker");

  if (!image || !description) {
    throw new Error("Every photo needs an image and a description.");
  }

  trigger.addEventListener("click", () => {
    photoDialogImage.src = image.currentSrc || image.src;
    photoDialogImage.alt = image.alt;
    photoDialogCaption.textContent = description.textContent.trim();
    photoDialog.showModal();
  });
});

photoDialogClose.addEventListener("click", () => photoDialog.close());

photoDialog.addEventListener("cancel", () => photoDialog.close());

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && photoDialog.open) {
    photoDialog.close();
  }
});

photoDialog.addEventListener("click", (event) => {
  if (event.target === photoDialog) {
    photoDialog.close();
  }
});

photoDialog.addEventListener("close", () => {
  photoDialogImage.removeAttribute("src");
  photoDialogImage.alt = "";
  photoDialogCaption.textContent = "";
});

document.body.classList.add("has-photo-viewer");
