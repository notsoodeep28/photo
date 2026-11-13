let layoutFrame = 0;

function layoutPhotoGrid(photoGrid) {
  const photos = [...photoGrid.querySelectorAll(":scope > figure")];
  if (photos.length === 0) {
    return;
  }

  photoGrid.classList.remove("is-masonry");
  for (const photo of photos) {
    photo.style.removeProperty("grid-column");
    photo.style.removeProperty("grid-row");
  }

  const gridStyle = getComputedStyle(photoGrid);
  const columnCount = gridStyle.gridTemplateColumns.trim().split(/\s+/).length;
  const rowGap = Number.parseFloat(gridStyle.rowGap);
  const rowSize = 8;
  if (!columnCount || !Number.isFinite(rowGap)) {
    return;
  }

  const photoHeights = photos.map((photo) => photo.getBoundingClientRect().height);
  photoGrid.classList.add("is-masonry");

  const nextRows = Array(columnCount).fill(1);
  for (const [index, photo] of photos.entries()) {
    const shortestColumn = nextRows.indexOf(Math.min(...nextRows));
    const rowSpan = Math.max(
      1,
      Math.ceil((photoHeights[index] + rowGap) / (rowSize + rowGap))
    );

    photo.style.gridColumn = String(shortestColumn + 1);
    photo.style.gridRow = `${nextRows[shortestColumn]} / span ${rowSpan}`;
    nextRows[shortestColumn] += rowSpan;
  }
}

function layoutPhotoGrids() {
  cancelAnimationFrame(layoutFrame);
  layoutFrame = requestAnimationFrame(() => {
    document.querySelectorAll(".photo-grid").forEach(layoutPhotoGrid);
  });
}

window.layoutPhotoGrids = layoutPhotoGrids;
window.addEventListener("resize", layoutPhotoGrids);
document.addEventListener(
  "load",
  (event) => {
    if (event.target instanceof HTMLImageElement && event.target.closest(".photo-grid")) {
      layoutPhotoGrids();
    }
  },
  true
);
