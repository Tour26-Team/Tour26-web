import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabase = createClient(
  "https://zcshqqrjxiharymzesnl.supabase.co",
  "sb_publishable_kaHcZU4PciFFO5YICmkh_w_YBru5T2X",
);

async function getTourList() {
  const { data: mainItems, error: mainError } = await supabase.storage
    .from("touren")
    .list("", {
      sortBy: { column: "name", order: "desc" },
    });

  if (mainError) throw mainError;

  const fullTourData = await Promise.all(
    mainItems.map(async (folder) => {
      const folderName = folder.name;

      const { data: files, error: filesError } = await supabase.storage
        .from("touren")
        .list(folderName);

      if (filesError) {
        console.error(`Error while Loading ${folderName}:`, filesError);
        return null;
      }

      const hasInfo = files.some((f) => f.name === "info.json");
      const collageFile = files.find((f) => f.name.startsWith("collage."));

      if (!hasInfo || !collageFile) {
        return null;
      }

      // Generate a signed URL for the collage file
      const { data: signedUrlData, error: urlError } = await supabase.storage
        .from("touren")
        .createSignedUrl(`${folderName}/${collageFile.name}`, 3600);

      if (urlError) {
        console.error(
          `Error while generating URL for ${folderName}:`,
          urlError,
        );
        return null;
      }

      const { data: jsonBlob, error: jsonError } = await supabase.storage
        .from("touren")
        .download(`${folderName}/info.json`);

      let infoData = {
        name: folderName,
        km: "Unbekannt",
        dauer: "Unbekannt",
        datum: "",
        route: "#",
      };

      if (!jsonError && jsonBlob) {
        const jsonText = await jsonBlob.text();
        try {
          infoData = JSON.parse(jsonText);
        } catch (e) {
          console.error(`Ungültiges JSON in Ordner ${folderName}`, e);
        }
      }

      return {
        ...infoData,
        collageUrl: signedUrlData.signedUrl,
      };
    }),
  );

  return fullTourData.filter((tour) => tour !== null);
}

function renderTourCards(touren) {
  const container = document.getElementById("tourListContainer"); // Dein <main> Element
  if (!container) return;

  touren.forEach((tour) => {
    // Erstelle das Karten-Element
    const card = document.createElement("div");
    card.className = "tour-card";

    // Befülle die Karte mit der exakten Struktur aus deinem Screenshot
    card.innerHTML = `
      <img src="${tour.collageUrl}" alt="${tour.name}" class="tour-collage">
      <div class="tour-info">
        <h2 class="tour-title">${tour.name}</h2>
        <p class="tour-date">${tour.datum}</p>
        <p class="tour-stats">${tour.km}, ${tour.dauer}</p>
        <a href="${tour.route}" target="_blank" class="tour-route-btn">Route</a>
      </div>
    `;

    // In das <main>-Tag einfügen
    container.appendChild(card);
  });
}

async function init() {
  const touren = await getTourList();
  renderTourCards(touren);
}

init();
