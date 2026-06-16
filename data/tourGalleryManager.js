import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabase = createClient(
  "https://zcshqqrjxiharymzesnl.supabase.co",
  "sb_publishable_kaHcZU4PciFFO5YICmkh_w_YBru5T2X"
);

const imageExtensions = /\.(jpg|jpeg|png|webp|gif|avif)$/i;
const videoExtensions = /\.(mp4|webm|mov|avi|mkv|ogg)$/i;

async function getTourMedia(tourFolder) {
  if (!tourFolder) return [];

  const { data: files, error } = await supabase.storage
    .from("touren")
    .list(tourFolder, { sortBy: { column: "name", order: "asc" } });

  if (error) {
    console.error("List Error:", error);
    return [];
  }

  const mediaFiles = files.filter(file =>
    imageExtensions.test(file.name) || videoExtensions.test(file.name)
  );

  const mediaPromises = mediaFiles.map(async (file) => {
    const { data: signedUrlData } = await supabase.storage
      .from("touren")
      .createSignedUrl(`${tourFolder}/${file.name}`, 3600 * 24);

    const isVideo = videoExtensions.test(file.name);

    return {
      name: file.name,
      url: signedUrlData?.signedUrl,
      type: isVideo ? "video" : "image",
    };
  });

  const media = await Promise.all(mediaPromises);
  return media.filter(item => item?.url);
}

// Neue Funktion: info.json laden und schönen Namen zurückgeben
async function getTourDisplayName(tourFolder) {
  try {
    const { data: jsonBlob } = await supabase.storage
      .from("touren")
      .download(`${tourFolder}/info.json`);

    if (!jsonBlob) return tourFolder;

    const jsonText = await jsonBlob.text();
    const info = JSON.parse(jsonText);
    
    // Bevorzugt "name" aus info.json, sonst Ordnername
    return info.name || info.displayName || tourFolder;
  } catch (e) {
    console.warn("Konnte info.json nicht laden für Titel:", e);
    return tourFolder;
  }
}

function renderGallery(media) {
  const container = document.getElementById("galleryContainer");
  container.innerHTML = "";

  if (media.length === 0) {
    container.innerHTML = `
      <p class='no-media'>
        Keine Bilder oder Videos gefunden.<br>
        <small>Ordner: <strong>${document.getElementById("galleryTitle").textContent}</strong></small>
      </p>`;
    return;
  }

  media.forEach((item) => {
    const div = document.createElement("div");
    div.className = "gallery-item";

    if (item.type === "video") {
      div.innerHTML = `
        <video src="${item.url}" controls preload="metadata" class="gallery-video"></video>
        <div class="media-name">${item.name}</div>`;
    } else {
      div.innerHTML = `
        <img src="${item.url}" alt="${item.name}" loading="lazy" class="gallery-image">
        <div class="media-name">${item.name}</div>`;
    }
    container.appendChild(div);
  });
}

function addClickHandlers() {
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      const modal = document.createElement('div');
      modal.style = 'position:fixed;inset:0;background:rgba(0,0,0,0.95);display:flex;align-items:center;justify-content:center;z-index:10000;';
      modal.innerHTML = `<img src="${img.src}" style="max-width:95%;max-height:95vh;border-radius:8px;">`;
      modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
      document.body.appendChild(modal);
    });
  });
}

async function init() {
  const urlParams = new URLSearchParams(window.location.search);
  let tourFolder = urlParams.get("tour");

  if (!tourFolder) {
    document.getElementById("galleryTitle").textContent = "Fehler: Keine Tour angegeben";
    return;
  }

  tourFolder = decodeURIComponent(tourFolder).trim();

  // Schönen Namen aus info.json holen
  const displayName = await getTourDisplayName(tourFolder);

  document.getElementById("galleryTitle").textContent = `${displayName} - Galerie`;

  const media = await getTourMedia(tourFolder);
  renderGallery(media);
  addClickHandlers();
}

init();