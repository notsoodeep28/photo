const photoGrid = document.querySelector(".photo-grid");

if (photoGrid) {
  const photos = [...photoGrid.querySelectorAll(":scope > figure")];
  const rowSize = 1;

  function resetMasonry() {
    photoGrid.classList.remove("is-masonry");
    for (const photo of photos) {
      photo.style.removeProperty("grid-column");
      photo.style.removeProperty("grid-row");
    }
  }

  function layoutPhotos() {
    const gridStyle = getComputedStyle(photoGrid);
    const columnCount = gridStyle.gridTemplateColumns.trim().split(/\s+/).length;
    const columnWidth = Number.parseFloat(gridStyle.gridTemplateColumns);
    const columnGap = Number.parseFloat(gridStyle.columnGap);

    if (
      !columnWidth ||
      photos.some((photo) => !photo.querySelector("img[width][height]"))
    ) {
      resetMasonry();
      return;
    }

    resetMasonry();
    const figureHeights = photos.map((photo) => photo.getBoundingClientRect().height);
    photoGrid.classList.add("is-masonry");

    const nextRows = Array(columnCount).fill(1);

    for (const [index, photo] of photos.entries()) {
      const shortestColumn = nextRows.indexOf(Math.min(...nextRows));
      const rowSpan = Math.max(
        1,
        Math.ceil((figureHeights[index] + columnGap) / rowSize)
      );

      photo.style.gridColumn = String(shortestColumn + 1);
      photo.style.gridRow = `${nextRows[shortestColumn]} / span ${rowSpan}`;
      nextRows[shortestColumn] += rowSpan;
    }
  }

  let resizeFrame = 0;
  window.addEventListener("resize", () => {
    resetMasonry();
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(layoutPhotos);
  });

  layoutPhotos();
}
