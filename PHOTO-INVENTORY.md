# Photo folders

Photographs live under `photos/`, grouped by set and then by the caption shown
for that group:

```text
photos/
  bnw/
    Digital/
      your-photo.jpg
  film/
    Kodak EC200 - Portra 400/
      your-photo.jpg
    Canon EOS XS - Kodacolor 100/
      your-photo.jpg
```

Add a description folder inside a set, then put supported images (`.jpg`,
`.jpeg`, `.png`, `.webp`, or `.gif`) directly inside it. The set page discovers
every description folder and photo automatically; no code changes are needed.
The `photo-index.json` Jekyll template discovers the photos during the GitHub
Pages build, so the site must be published again to show additions. The
description folder name appears as the caption when a photo is opened.

For a local preview, run `node preview-server.js` from the project folder and
open `http://127.0.0.1:8765`. Reload the page after adding photos or folders.

To add a new description, create a folder beneath its set using the caption you
want displayed. To add a new set, add its folder and an entry to `photo-sets.js`. The entry's
`id` must match the folder name; add its title, medium, introduction, cover
path, and cover alt text there.

The existing sets contain 5 black-and-white photographs and 10 film
photographs (15 unique photos total).
