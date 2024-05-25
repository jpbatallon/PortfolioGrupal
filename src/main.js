const $ = (selector) => document.querySelector(selector);
const names = $("#name");
const email = $("#mail");
const form = $("form");
const textarea = $(".comentario");
const submitButton = $("#submit");
const menuButton = $(".menu-icon");
const menuHeader = $(".menu-stack");
const menuClose = $(".close-menu");
const menuHeaderList = $(".menu-stack a");
const closeMenuButton = $(".close-button");
const last = $("#last-visit");
const map = $("#map");

function formatDate(date) {
  const dateFormat = new Date(date).toLocaleDateString("es-Es", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return dateFormat;
}

const getCurrentLocation = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      var longitude = position.coords.longitude;
      var latitude = position.coords.latitude;
      var altitude = position.coords.altitude;
      var accuracy = position.coords.accuracy;
      var speed = position.coords.speed;
      var heading = position.coords.heading;
      var time = position.timestamp;
      var altitudeAccuracy = position.coords.altitudeAccuracy;

      const jsonData = {
        longitud: longitude,
        latitud: latitude,
        altitud: altitude,
        exactitud: `${accuracy} metros`,
        altitud_exatca: altitudeAccuracy,
        velocidad: speed,
        encabezado: heading,
        fecha: formatDate(time),
      };
      if (jsonData) {
        localStorage.setItem("localization", JSON.stringify(jsonData));
      }
    });
  }
};

function saveDataLocalToStorage(name, data) {
  const res = JSON.stringify(data);
  localStorage.setItem(name, res);
  return true;
}

function createMap(longitud, latitud) {
  const urlMap = `https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3362.721134731404!2d${longitud}!3d${latitud}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzLCsDMzJzM3LjAiUyA2NcKwMTQnMDYuNSJX!5e0!3m2!1ses-419!2sar!4v1716605671110!5m2!1ses-419!2sar`;
  const iframe = document.createElement("iframe");
  iframe.src = urlMap;
  iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
  iframe.setAttribute("loading", "lazy");
  iframe.classList.add("location-map");
  return iframe;
}

document.addEventListener("DOMContentLoaded", () => {
  function resize() {
    textarea.addEventListener("input", () => {
      textarea.style.height = "100px";
      textarea.style.height = textarea.scrollHeight + "px";
    });
  }

  let isMenuHeaderOpen = false;

  function openHeaderMenu() {
    menuHeader.style.display = "block";
    menuButton.style.display = "none";
    menuHeaderList.style.display = "grid";
    form.style.zIndex = "-1";
    isMenuHeaderOpen = true;
    document.addEventListener("click", outSideClick);
  }

  function closeMenuHeader() {
    menuHeader.style.display = "";
    menuButton.style.display = "";
    form.style.zIndex = "0";
    isMenuHeaderOpen = false;
    document.addEventListener("click", outSideClick);
  }

  function closeButton() {
    closeMenuButton.addEventListener("click", closeMenuHeader);
  }

  menuButton.onclick = function (event) {
    event.stopPropagation();
    if (!isMenuHeaderOpen) {
      openHeaderMenu();
      closeButton();
    } else {
      closeMenuHeader();
    }
  };

  function outSideClick(event) {
    if (!menuHeader.contains(event.target) && event.target !== menuButton) {
      closeMenuHeader();
    }
  }

  function sendDataForm(event) {
    event.preventDefault();
    const dataJson = {
      nombre: names.value,
      correo: email.value,
      comentario: textarea.value,
    };
    saveDataLocalToStorage("formulario", JSON.stringify(dataJson));
  }

  function getDate() {
    const fecha = localStorage.getItem("localization");
    const convertData = JSON.parse(fecha);
    return convertData;
  }

  const dataLocation = getDate();

  const lastVisit = () => {
    last.innerHTML = `<p>Ultima visita: ${dataLocation.fecha}</p>`;
  };

  const mapa = createMap(dataLocation.longitud, dataLocation.latitud);
  map.appendChild(mapa);

  submitButton.addEventListener("click", () => {
    sendDataForm();
  });
  lastVisit();
  resize();
  getCurrentLocation();
});
