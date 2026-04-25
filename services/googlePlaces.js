const photoCache = new Map();

async function getPhotoRef(id, nom, adresse, ville) {
  if (photoCache.has(id)) return photoCache.get(id);

  const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY,
      "X-Goog-FieldMask": "places.photos,places.displayName",
    },
    body: JSON.stringify({ textQuery: `${nom} ${adresse ?? ""} ${ville} France` }),
  });

  const data = await response.json();
  const ref = data.places?.[0]?.photos?.[0]?.name ?? null;
  photoCache.set(id, ref);
  return ref;
}

async function proxyPhoto(photoRef, res) {
  const url = `https://places.googleapis.com/v1/${photoRef}/media?maxWidthPx=1200&maxHeightPx=1200&key=${process.env.GOOGLE_PLACES_API_KEY}`;
  const response = await fetch(url);
  res.set("Content-Type", response.headers.get("content-type") || "image/jpeg");
  res.set("Cache-Control", "public, max-age=86400");
  const { Readable } = require("stream");
  Readable.fromWeb(response.body).pipe(res);
}

module.exports = { getPhotoRef, proxyPhoto };
