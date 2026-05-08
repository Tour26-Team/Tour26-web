import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { firebaseConfig } from "../firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ========== LOAD NEXT TOUR DATA ==========
const infoConHeaderInfo = document.querySelector(".infoConHeaderInfo");
const infoConText = document.querySelector(".infoConText");
const infoConDestination = document.getElementById("infoConDestination");
const infoConDate = document.getElementById("infoConDate");
const infoConInfo = document.getElementById("infoConInfo");
const infoConBtnCon = document.querySelector(".infoConBtnCon");
const infoConBtn = document.getElementById("infoConBtn");

const docRef = doc(db, "tour-data", "next-tour");
const nextTourData = await getDoc(docRef);

const nextTourDataObj = nextTourData.data();

if (nextTourData.exists()) {
  infoConDestination.textContent = nextTourDataObj.destination;
  infoConDate.textContent = nextTourDataObj.date;
  infoConInfo.textContent = nextTourDataObj.information;
  infoConBtn.href = nextTourDataObj.routeLink;

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

// ========== SET NEW TOUR DATA ==========

const createNewTourCon = document.querySelector(".createNewTourCon");

const createNewTourBtn = document
  .getElementById("createNewTourBtn")
  ?.addEventListener("click", async () => {
    const destinationInput = document.getElementById("destinationInput").value;
    const dateInput = document.getElementById("dateInput").value;
    const informationInput = document.getElementById("informationInput").value;
    const routeInput = document.getElementById("routeInput").value;

    const docData = {
      date: dateInput,
      destination: destinationInput,
      information: informationInput,
      routeLink: routeInput,
    };

    await setDoc(doc(db, "tour-data", "next-tour"), docData);

    createNewTourCon.classList.add("isHidden");
  });
