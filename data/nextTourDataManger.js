import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabase = createClient(
  "https://zcshqqrjxiharymzesnl.supabase.co",
  "sb_publishable_kaHcZU4PciFFO5YICmkh_w_YBru5T2X",
);

// ========== DOM ELEMENTS =================================
const infoConHeaderInfo = document.querySelector(".infoConHeaderInfo");
const infoConText = document.querySelector(".infoConText");
const infoConDestination = document.getElementById("infoConDestination");
const infoConDate = document.getElementById("infoConDate");
const infoConInfo = document.getElementById("infoConInfo");
const infoConBtnCon = document.querySelector(".infoConBtnCon");
const infoConBtn = document.getElementById("infoConBtn");

// ========== LOAD NEXT TOUR DATA ==========================
async function loadNextTour() {
  try {
    const { data, error } = await supabase
      .from("tour_data")
      .select("*")
      .eq("id", "next-tour")
      .maybeSingle();

    if (error) throw error;

    if (data) {
      infoConDestination.textContent = data.destination;
      infoConDate.textContent = data.date;
      infoConInfo.textContent = data.information;
      infoConBtn.href = data.routeLink;

      infoConHeaderInfo.classList.remove("loading");
      infoConText.classList.remove("loading");
      infoConBtnCon.classList.remove("loading");
    } else {
      infoConDestination.textContent = "Derzeit ist keine Tour geplant.";
      infoConHeaderInfo.remove();
      infoConDate.remove();
      infoConInfo.remove();
      infoConBtnCon.remove();

      infoConHeaderInfo.classList.remove("loading");
      infoConText.classList.remove("loading");
      infoConBtn.classList.remove("loading");
    }
  } catch (error) {
    console.error("Error while Loading Data:", err.message);
  }
}

loadNextTour();

// ========== DOM ELEMENTS =================================
const createNewTourCon = document.querySelector(".createNewTourCon");
const createNewTourBtn = document.getElementById("createNewTourBtn");

const destinationInput = document.getElementById("destinationInput");
const dateInput = document.getElementById("dateInput");
const informationInput = document.getElementById("informationInput");
const routeInput = document.getElementById("routeInput");

// ========== SET NEW TOUR DATA (only for Admins) ==========
async function setNextTour() {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    const userRole = user.app_metadata?.role;
    if (userRole !== "admin") {
      console.log("User is not an Admin");
      return;
    }

    const tourData = {
      date: dateInput.value,
      destination: destinationInput.value,
      information: informationInput.value,
      routeLink: routeInput.value,
    };

    const { data, error } = await supabase.from("tour_data").upsert(tourData);

    if (error) throw error;

    createNewTourCon.classList.add("isHidden");
    window.location.reload();
  } catch (error) {
    console.error("Error while setting Data:", error.message);
  }
}

createNewTourBtn.addEventListener("click", async () => {
  setNextTour();
});
