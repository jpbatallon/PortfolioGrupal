const $ = (selector) => document.querySelector(selector);
const names = $("#name");
const email = $("#mail");
const form = $("form");
const comentario = $(".comentario");
const submitButton = $("#submit");
const menuButton = $(".menu-icon");
const menuHeader = $(".menu-stack");
const menuClose = $(".close-menu");
const menuHeaderList = $(".menu-stack a");
const menuLink = document.querySelectorAll(".menu-stack a");
const closeMenuButton = $(".close-button");
const last = $("#last-visit");
const map = $("#map");
const inputs = document.querySelectorAll(".inputs");

const usrersAvatars = [
  {
    user1: "https://avatars.githubusercontent.com/u/126372943?s=100&v=4",
    user2: "https://avatars.githubusercontent.com/u/106635349?v=4",
    user3: "https://avatars.githubusercontent.com/u/164105708?v=4",
    user4: "https://avatars.githubusercontent.com/u/166343183?v=4",
    user5: "https://avatars.githubusercontent.com/u/128757903?v=4",
    user6: "https://avatars.githubusercontent.com/u/164107854?v=4",
    user7: "https://avatars.githubusercontent.com/u/134340520?v=4",
    user8:
      "https://avatars.githubusercontent.com/u/93176365?s=400&u=256e212b81ba355aa6d1bda5b4f9882ed53474ea&v=4",
  },
];

const usrersNames = [
  {
    user1: "Agustín Salinas",
    user2: "Maximiliano Tomio",
    user3: "Elias Jacob",
    user4: "Juan P. Batallón",
    user5: "Daniela Delgado",
    user6: "Marina Rebolloso",
    user7: "Franco Morales",
    user8: "Gabriel Calcagni",
  },
];

const usrersUrl = [
  {
    user1: "https://github.com/agussalinas",
    user2: "https://github.com/maxidtomio",
    user3: "https://github.com/eliasdjacob",
    user4: "https://github.com/jpbatallon",
    user5: "https://github.com/silvia-daniela-delgado",
    user6: "https://github.com/marinarebolloso",
    user7: "https://github.com/Mendoxeneixe",
    user8: "https://github.com/solidsnk86",
  },
];

function createAvatars() {
  const userAvatar = usrersAvatars[0];
  const userNames = usrersNames[0];
  const userUrl = usrersUrl[0];
  const avatarHtml = Object.keys(userAvatar)
    .map(
      (key) =>
        `
        <div class="container-users">
        <img src="${userAvatar[key]}" alt="Avatars de github" title="${userNames[key]}" class="avatar-img"/>
          <a href="${userUrl[key]}" title="Ir al perfil de GitHub de ${userNames[key]}" target="_blank">
            ${userNames[key]}
          </a>
        </div>
        `
    )
    .join("");

  $(".integrantes").innerHTML = avatarHtml;
}

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
  getCurrentLocation();
  function resize() {
    comentario.addEventListener("input", () => {
      comentario.style.height = "100px";
      comentario.style.height = comentario.scrollHeight + "px";
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
    document.addEventListener("click", closeMenuOnClickLinks);
  }

  function closeMenuOnClickLinks() {
    menuLink.forEach((link) =>
      link.addEventListener("click", () => {
        closeMenuHeader();
      })
    );
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

  function sendDataForm() {
    const dataJson = {
      nombre: names.value,
      correo: email.value,
      comentario: comentario.value,
    };
    inputs.forEach(() => saveDataLocalToStorage("formulario", dataJson));
    if (localStorage.length >= 0) {
      alert(`Muchas gracias por enviar el formulario ${dataJson.nombre}.`);
    }
  }

  submitButton.addEventListener("click", () => {
    sendDataForm();
  });

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
  createAvatars();
  lastVisit();
  resize();
});
