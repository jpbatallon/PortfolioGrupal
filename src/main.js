const $ = (selector) => document.querySelector(selector);
const name = $("#name");
const mail = $("#mail");
const form = $("form");
const textarea = $(".comentario");
const submitButton = $("#submit");
const menuButton = $(".menu-icon");
const menuHeader = $(".menu-stack");
const menuClose = $(".close-menu");
const menuHeaderList = $(".menu-stack a");
const closeMenuButton = $(".close-button");

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

function createMap(accuracy, longitud, latitud) {
  const urlMap = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d${accuracy}!2d${longitud}!3d${latitud}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95d3056cee406bf3%3A0x80cbd8c58e2ca91d5e0!3m2!1ses-419!2sar!4v1694255285033!5m2!1ses-419!2sar.`;
  const iframe = document.createElement("iframe");
  iframe.src = urlMap;
  return iframe;
}

document.addEventListener("DOMContentLoaded", () => {
  function resize() {
    textarea.addEventListener("input", () => {
      textarea.style.height = "100px";
      textarea.style.height = textarea.scrollHeight + "px";
      textarea.dispatchEvent(new Event("input"));
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

  const sendFormData = (formName = 1) => {
    localStorage.setItem("terreneitor-form", formName);
    name.addEventListener("input", () => {
      for (name in name) {
        localStorage.setItem("nombre", name.value);
      }
    });
    mail.addEventListener("input", () => {
      localStorage.setItem("correo", mail.value);
    });
    textarea.addEventListener("input", () => {
      localStorage.setItem("comentario", textarea.value);
    });
  };

  function getDate() {
    const fecha = localStorage.getItem("localization");
    const convertData = JSON.parse(fecha);
    return convertData;
  }

  const dataLocation = getDate();

  const fetchComents = () => {
    const localName = localStorage.getItem("nombre");
    const localMail = localStorage.getItem("correo");
    const localComment = localStorage.getItem("comentario");
    const comments = $("#comments");

    if (localName && localMail && localComment) {
      comments.innerHTML = `
        <div>
            <p>Publicado por ${localName}</p> 
            <a href="mailto:${localMail}">${localMail}</a>
            <p>${localComment}</p>
            <hr>
            <p>Ultima visita: ${dataLocation.fecha}</p>
        </div>
        `;
    }
    const mapa = createMap(
      dataLocation.accuracy,
      dataLocation.longitud,
      dataLocation.latitud
    );
    document.body.appendChild(mapa);
  };

  if (localStorage.length >= 0) {
    fetchComents();
  } else {
    throw new Error("No hay datos en local storage.");
  }

  submitButton.addEventListener("click", () => {
    fetchComents();
  });
  resize();
  sendFormData();
  getCurrentLocation();
});
