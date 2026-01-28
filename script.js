var map = L.map("map", {
  zoomControl: false,
});

L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}{r}.png",
  {
    subdomains: "abcd",
    maxZoom: 30,
    attribution: "&copy; OpenStreetMap &copy; CARTO",
  },
).addTo(map);

var usBounds = [
  [24.396308, -124.848974],
  [49.384358, -66.885444],
];
map.fitBounds(usBounds);

var states = [
  { name: "Alabama", lat: 32.8, lng: -86.9, capital: "Montgomery" },
  { name: "Arizona", lat: 34.2, lng: -111.7, capital: "Phoenix" },
  { name: "Arkansas", lat: 35.2, lng: -92.3, capital: "Little Rock" },
  { name: "California", lat: 36.7, lng: -119.4, capital: "Sacramento" },
  { name: "Colorado", lat: 39.0, lng: -105.5, capital: "Denver" },
  { name: "Connecticut", lat: 41.6, lng: -72.7, capital: "Hartford" },
  { name: "Delaware", lat: 39.0, lng: -75.5, capital: "Dover" },
  { name: "Florida", lat: 27.8, lng: -81.7, capital: "Tallahassee" },
  { name: "Georgia", lat: 32.6, lng: -83.4, capital: "Atlanta" },
  { name: "Idaho", lat: 44.1, lng: -114.7, capital: "Boise" },
  { name: "Illinois", lat: 40.0, lng: -89.2, capital: "Springfield" },
  { name: "Indiana", lat: 40.0, lng: -86.1, capital: "Indianapolis" },
  { name: "Iowa", lat: 42.1, lng: -93.5, capital: "Des Moines" },
  { name: "Kansas", lat: 38.5, lng: -98.0, capital: "Topeka" },
  { name: "Kentucky", lat: 37.5, lng: -85.3, capital: "Frankfort" },
  { name: "Louisiana", lat: 30.9, lng: -91.9, capital: "Baton Rouge" },
  { name: "Maine", lat: 45.3, lng: -69.0, capital: "Augusta" },
  { name: "Maryland", lat: 39.0, lng: -76.7, capital: "Annapolis" },
  { name: "Massachusetts", lat: 42.4, lng: -71.4, capital: "Boston" },
  { name: "Michigan", lat: 44.3, lng: -85.6, capital: "Lansing" },
  { name: "Minnesota", lat: 46.3, lng: -94.2, capital: "Saint Paul" },
  { name: "Mississippi", lat: 32.7, lng: -89.7, capital: "Jackson" },
  { name: "Missouri", lat: 38.5, lng: -92.3, capital: "Jefferson City" },
  { name: "Montana", lat: 46.9, lng: -110.4, capital: "Helena" },
  { name: "Nebraska", lat: 41.5, lng: -99.8, capital: "Lincoln" },
  { name: "Nevada", lat: 39.3, lng: -116.6, capital: "Carson City" },
  { name: "New Hampshire", lat: 43.7, lng: -71.6, capital: "Concord" },
  { name: "New Jersey", lat: 40.1, lng: -74.5, capital: "Trenton" },
  { name: "New Mexico", lat: 34.5, lng: -106.0, capital: "Santa Fe" },
  { name: "New York", lat: 42.9, lng: -75.0, capital: "Albany" },
  { name: "North Carolina", lat: 35.5, lng: -79.4, capital: "Raleigh" },
  { name: "North Dakota", lat: 47.5, lng: -100.5, capital: "Bismarck" },
  { name: "Ohio", lat: 40.3, lng: -82.8, capital: "Columbus" },
  { name: "Oklahoma", lat: 35.6, lng: -97.5, capital: "Oklahoma City" },
  { name: "Oregon", lat: 44.0, lng: -120.5, capital: "Salem" },
  { name: "Pennsylvania", lat: 41.0, lng: -77.8, capital: "Harrisburg" },
  { name: "Rhode Island", lat: 41.7, lng: -71.6, capital: "Providence" },
  { name: "South Carolina", lat: 33.8, lng: -80.9, capital: "Columbia" },
  { name: "South Dakota", lat: 44.4, lng: -100.2, capital: "Pierre" },
  { name: "Tennessee", lat: 35.7, lng: -86.4, capital: "Nashville" },
  { name: "Texas", lat: 31.0, lng: -99.9, capital: "Austin" },
  { name: "Utah", lat: 39.3, lng: -111.7, capital: "Salt Lake City" },
  { name: "Vermont", lat: 44.0, lng: -72.7, capital: "Montpelier" },
  { name: "Virginia", lat: 37.5, lng: -78.7, capital: "Richmond" },
  { name: "Washington", lat: 47.4, lng: -120.7, capital: "Olympia" },
  { name: "West Virginia", lat: 38.6, lng: -80.6, capital: "Charleston" },
  { name: "Wisconsin", lat: 44.6, lng: -89.6, capital: "Madison" },
  { name: "Wyoming", lat: 43.0, lng: -107.6, capital: "Cheyenne" },
];

let score = 0;
let streak = 0;
let mistakes = 0;
let totalClicks = 0;

let remainingCountries = [...states];

let currentCountry = null;
const tolerancePerCountry = {
  "Texas": 6,
  "California": 5,
  "Montana": 4,
  "Florida": 4,
  "Rhode Island": 1.2,
  "Delaware": 1.2,
  "New Jersey": 1.2,
  "Connecticut": 1.2,
  "Massachusetts": 1.2,
};

const scoreEl = document.getElementById("score");
const messageEl = document.getElementById("message");
const infoEl = document.getElementById("info");

function pickCountry() {
  if (remainingCountries.length === 0) {
    showEndScreen();
    return;
  }

  const index = Math.floor(Math.random() * remainingCountries.length);
  currentCountry = remainingCountries[index];

  if (capitalMode) {
    infoEl.innerHTML = `Which state's capital is <b>${currentCountry.capital}</b>?`;
  } else {
    infoEl.innerHTML = `Where is <b>${currentCountry.name}</b>?`;
  }

  mistakes = 0;

  if (messageEl.textContent === "Nope. Try again.") {
    messageEl.textContent = "Good job!";
  }
}

map.on("click", function (e) {
  totalClicks++;
  const tolerance = tolerancePerCountry[currentCountry.name] || 2;
  const dist = Math.sqrt(
    Math.pow(e.latlng.lat - currentCountry.lat, 2) +
      Math.pow(e.latlng.lng - currentCountry.lng, 2),
  );

  if (dist < tolerance) {
    L.circle([e.latlng.lat, e.latlng.lng], {
      radius: 30000,
      color: "green",
    })
      .addTo(map)
      .bindPopup(`✅ Correct! ${currentCountry.name}`)
      .openPopup();

    score++;
    streak++;
    scoreEl.textContent = `Score: ${score} | Streak: ${streak}`;

    remainingCountries = remainingCountries.filter(
      (c) => c.name !== currentCountry.name,
    );

    pickCountry();
  } else {
    mistakes++;

    score = Math.max(0, score - 1);
    streak = 0;
    scoreEl.textContent = `Score: ${score} | Streak: ${streak}`;
    messageEl.textContent = `❌ Wrong! Try again.`;

    const wrongCircle = L.circle([e.latlng.lat, e.latlng.lng], {
      radius: 30000,
      color: "red",
      fillColor: "red",
      fillOpacity: 0.6,
      opacity: 1,
    }).addTo(map);

    setTimeout(() => {
      let opacity = 1;
      const fadeInterval = setInterval(() => {
        opacity -= 0.05;
        if (opacity <= 0) {
          clearInterval(fadeInterval);
          map.removeLayer(wrongCircle);
        } else {
          wrongCircle.setStyle({
            opacity: opacity,
            fillOpacity: opacity * 0.6,
          });
        }
      }, 50);
    }, 5000);

    if (mistakes >= 3) {
      hintPulse(currentCountry.lat, currentCountry.lng);
    }
  }
});

function hintPulse(lat, lng) {
  const pulse = L.circle([lat, lng], {
    radius: 100000,
    color: "#00bcd4",
    weight: 1,
    fillOpacity: 0,
    opacity: 0.2,
  }).addTo(map);

  let radius = 100000;
  let opacity = 0.8;

  const pulseInterval = setInterval(() => {
    radius += 25000;
    opacity -= 0.05;

    if (opacity <= 0) {
      clearInterval(pulseInterval);
      map.removeLayer(pulse);
    } else {
      pulse.setStyle({ opacity });
      pulse.setRadius(radius);
    }
  }, 60);
}

document.addEventListener("DOMContentLoaded", () => {
  const scoreEl = document.getElementById("score");
  const messageEl = document.getElementById("message");
  const infoEl = document.getElementById("info");

  window.showLightningModal();

  pickCountry();

  document.getElementById("restartBtn").addEventListener("click", () => {
    score = 0;
    streak = 0;
    mistakes = 0;
    totalClicks = 0;
    remainingCountries = [...states];

    scoreEl.textContent = "Score: 0 | Streak: 0";
    messageEl.textContent = "Welcome!";
    document.getElementById("endScreen").classList.add("hidden");
    document.getElementById("paymentQR").classList.add("hidden");

    window.showLightningModal();

    pickCountry();
  });
});

const faqBtn = document.getElementById("faqBtn");
const paymentsBtn = document.getElementById("paymentsBtn");
const capitalModeBtn = document.getElementById("capitalModeBtn");

const faqPopup = document.getElementById("faqPopup");
const paymentsPopup = document.getElementById("paymentsPopup");

document.querySelectorAll(".closePopup").forEach(btn => {
  btn.addEventListener("click", e => {
    e.target.closest(".popup").classList.add("hidden");
  });
});

faqBtn.addEventListener("click", () => {
  faqPopup.classList.toggle("hidden");
  paymentsPopup.classList.add("hidden");
});

paymentsBtn.addEventListener("click", () => {
  paymentsPopup.classList.toggle("hidden");
  faqPopup.classList.add("hidden");
});

let capitalMode = false;
capitalModeBtn.addEventListener("click", () => {
  capitalMode = !capitalMode;
  capitalModeBtn.textContent = capitalMode ? "🏛️ Capital Mode ON" : "🏛️ Capital Mode";
});


async function getInvoiceFromLightningAddress(address, sats) {
  const [name, domain] = address.split("@");
  const lnurlpUrl = `https://${domain}/.well-known/lnurlp/${name}`;

  const lnurlpRes = await fetch(lnurlpUrl).then(r => r.json());

  const callback = lnurlpRes.callback;
  const msats = sats * 1000;

  const invoiceRes = await fetch(`${callback}?amount=${msats}`).then(r => r.json());

  return invoiceRes.pr;
}

function showEndScreen() {
  const endScreen = document.getElementById("endScreen");
  const finalStats = document.getElementById("finalStats");

  const accuracy = totalClicks > 0 ? Math.round((score / totalClicks) * 100) : 0;

  finalStats.innerHTML = `
    <strong>Final Score:</strong> ${score}<br>
    <strong>Total Clicks:</strong> ${totalClicks}<br>
    <strong>Accuracy:</strong> ${accuracy}%
  `;

  endScreen.classList.remove("hidden");
  document.getElementById("claimRewardBtn").onclick = () => {
    window.payForScore(score);
  };
}
