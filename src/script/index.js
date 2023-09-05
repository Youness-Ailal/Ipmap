// console.log(iconLocation);
// App Variables
const ipText = document.querySelector("#ip");
const cityText = document.querySelector("#city");
const regionText = document.querySelector("#region");
const countryText = document.querySelector("#country");
const flagImg = document.querySelector(".result__flag-image");
const ispText = document.querySelector(".isp");
const utcText = document.querySelector(".utc");
const spinner = document.querySelector(".spinner");

const formBtn = document.querySelector(".header__btn");
const form = document.querySelector(".header__form");

// Map variables
const map = L.map("map", {
  attributionControl: false,
}).setView([51, -0.09], 18);

// Get Local IP Address
spinner.classList.remove("hidden");
const resIp = await fetch(`https://api.ipify.org?format=json`);
const { ip } = await resIp.json();

if (ip) {
  renderLocation("ipAddress", ip);
} else {
  spinner.classList.add("hidden");
}
// Get IP, Location, Timezone, ISP
async function renderLocation(type, data) {
  spinner.classList.remove("hidden");
  try {
    const dataRes = await (
      await fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=at_aHzPdbzv3u3KBYNXAYAwJqr0syjx2&${type}=${data}`
      )
    ).json();

    const { lat, lng, city, region, country, timezone } = dataRes.location;
    const countryData = await fetch(
      `https://restcountries.com/v3.1/alpha/${country}`
    ).then(res => res.json());

    const countryName = countryData[0].name.common || "Unkown";
    const countryFlag = countryData[0].flags.png || "Unkown";
    const { isp } = dataRes;

    ipText.textContent = ip;
    cityText.textContent = city;
    regionText.textContent = region + " ";
    countryText.textContent = countryName;
    utcText.textContent = timezone;
    flagImg.src = countryFlag;

    ispText.textContent = isp;
    displayMap(lat, lng);
  } catch (err) {
    alert("Invalid IP address or domain!");
    console.log(err);
  } finally {
    spinner.classList.add("hidden");
  }
}

//Handles form input submission
form.addEventListener("submit", e => {
  e.preventDefault();
  const input = document.querySelector(".header__input").value;
  if (/\d+\.\d+/.test(input)) {
    renderLocation("ipAddress", input);
  } else {
    renderLocation("domain", input);
  }
});

// Display Map
function displayMap(lat, lon) {
  map.setView([lat, lon], 18);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker([lat, lon]).addTo(map);
}
