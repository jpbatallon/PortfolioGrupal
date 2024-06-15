// Se crea función selectora del DOM
const $ = (selector) => document.querySelector(selector);
// Constantes que seleccionan el DOM
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
const info = $("#sys-info");
const year = new Date().getFullYear();
const footer = $("footer");
// Array de urls con el avatar de cada usuario de github
const usrersAvatars = [
  {
    user1: "https://avatars.githubusercontent.com/u/166578771?v=4",
    user2: "https://avatars.githubusercontent.com/u/106635349?v=4",
    user3: "https://avatars.githubusercontent.com/u/164105708?v=4",
    user4: "https://avatars.githubusercontent.com/u/166343183?v=4",
    user6: "https://avatars.githubusercontent.com/u/164107854?v=4",
    user7: "https://avatars.githubusercontent.com/u/134340520?v=4",
    user8:
      "https://avatars.githubusercontent.com/u/93176365?s=400&u=256e212b81ba355aa6d1bda5b4f9882ed53474ea&v=4",
  },
];
// Array de nombres de usuarios
const usrersNames = [
  {
    user1: "Agustín Salinas",
    user2: "Maximiliano Tomio",
    user3: "Elias Jacob",
    user4: "Juan P. Batallón",
    user6: "Marina Rebolloso",
    user7: "Franco Morales",
    user8: "Gabriel Calcagni",
  },
];
// Array de urls de github
const usrersUrl = [
  {
    user1: "https://github.com/agus-salinas",
    user2: "https://github.com/maxidtomio",
    user3: "https://github.com/eliasdjacob",
    user4: "https://github.com/jpbatallon",
    user6: "https://github.com/marinarebolloso",
    user7: "https://github.com/Mendoxeneixe",
    user8: "https://github.com/solidsnk86",
  },
];

/* 
Función para obtener información de un array e iterar cada dato para poder crear un template
e ingresarlos al HTML
*/
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

// Función para formatear la fecha
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

// Función donde se utiliza la API del navegador y se accede a los datos de posición (GPS)
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

// Función para guardar datos en el localstorage
function saveDataLocalToStorage(name, data) {
  const res = JSON.stringify(data);
  localStorage.setItem(name, res);
  return true;
}

/* 
Función para crear un iframe y luego ingresar los datos de posicionamiento global
y se le pasan los parámetros de longitud y latitud
*/
function createMap(longitud, latitud) {
  const urlMap = `https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3362.721134731404!2d${longitud}!3d${latitud}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzLCsDMzJzM3LjAiUyA2NcKwMTQnMDYuNSJX!5e0!3m2!1ses-419!2sar!4v1716605671110!5m2!1ses-419!2sar`;
  const iframe = document.createElement("iframe");
  iframe.src = urlMap;
  iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
  iframe.setAttribute("loading", "lazy");
  iframe.classList.add("location-map");
  return iframe;
}
// Función para crear un modal e ingresarlo al HTML
const createModal = (dataJson) => {
  const div = document.createElement("div");
  div.classList.add("modal");
  div.innerHTML = `
    <div class="modal-container">
      <p>
        Muchas gracias por ponerse en contacto con nosotros ${dataJson.nombre}.
        Pronto le enviaremos un correo a ${dataJson.correo}.
      </p>
    </div>
  `;
  document.body.appendChild(div);
};

function formatUserAgent(userAgent) {
  let formattedUserAgent = userAgent;

  if (
    userAgent.includes("Macintosh") ||
    userAgent.includes("iPhone") ||
    userAgent.includes("iPad")
  ) {
    formattedUserAgent = "Apple Safari";
  } else if (userAgent.includes("Windows NT 10.0")) {
    formattedUserAgent = "Windows NT 10.0";
  } else if (userAgent.includes("Android")) {
    formattedUserAgent = "Android OS";
  } else if (userAgent.includes("Linux")) {
    formattedUserAgent = "Linux OS";
  }

  return formattedUserAgent;
}
// Función para detectar la información del sistema a través de la API del navegador
function getInfo() {
  const userAgent = formatUserAgent(navigator.userAgent);

  const vendor = navigator.vendor;
  const lang = navigator.language;
  const online = navigator.onLine;
  const memory = navigator.deviceMemory * 1.95 || "desconocida";
  const cores = navigator.hardwareConcurrency || "desconocida";
  return { userAgent, vendor, lang, online, memory, cores };
}

// Función para arrastrar logo
const $img = document.getElementById("logo-img");

$img.addEventListener("mousedown", startDrag);
$img.addEventListener("touchstart", startDrag);

let isDragging = false;
let startX, startY, initialX, initialY;

function startDrag(event) {
  isDragging = true;
  startX =
    event.type === "mousedown" ? event.clientX : event.touches[0].clientX;
  startY =
    event.type === "mousedown" ? event.clientY : event.touches[0].clientY;
  initialX = $img.offsetLeft;
  initialY = $img.offsetTop;

  document.addEventListener("touchmove", drag);
  document.addEventListener("mouseup", endDrag);
  document.addEventListener("touchend", endDrag);
}

function drag(event) {
  if (isDragging) {
    let currentX =
      event.type === "mousemove" ? event.clientX : event.touches[0].clientX;
    let currentY =
      event.type === "mousemove" ? event.clientY : event.touches[0].clientY;
    let dx = currentX - startX;
    let dy = currentY - startY;

    $img.style.left = initialX + dx + "px";
    $img.style.top = initialY + dy + "px";
  }
}

function endDrag() {
  isDragging = false;
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("touchmove", drag);
  document.removeEventListener("mouseup", endDrag);
  document.removeEventListener("touchend", endDrag);
}

// En cuanto el DOM esté listo empieza la ejecución de funciones
document.addEventListener("DOMContentLoaded", () => {
  // Se inicializa la función de geolocalización
  getCurrentLocation();

  let isMenuHeaderOpen = false;
  // Función para abrir el menú responsive y detectar eventos
  function openHeaderMenu() {
    menuHeader.style.display = "block";
    menuButton.style.display = "none";
    menuHeaderList.style.display = "grid";
    form.style.zIndex = "-1";
    isMenuHeaderOpen = true;
    document.addEventListener("click", outSideClick);
    document.addEventListener("click", closeMenuOnClickLinks);
  }
  // Evento de cierre del menú cuando se hace click en cualquier link del mismo
  function closeMenuOnClickLinks() {
    if (menuLink) {
      menuLink.forEach((link) =>
        link.addEventListener("click", () => {
          closeMenuHeader();
        })
      );
    }
  }
  // Función para cerrar el menú
  function closeMenuHeader() {
    menuHeader.style.display = "";
    menuButton.style.display = "";
    form.style.zIndex = "0";
    isMenuHeaderOpen = false;
    document.addEventListener("click", outSideClick);
  }
  // Cierre del menú con el botón
  function closeButton() {
    closeMenuButton.addEventListener("click", closeMenuHeader);
  }
  // Evento de escucha del botón del menú
  menuButton.onclick = function (event) {
    event.stopPropagation();
    if (!isMenuHeaderOpen) {
      openHeaderMenu();
      closeButton();
    } else {
      closeMenuHeader();
    }
  };
  // Función para detectar el click fuera del menú y fuera del botón para poder cerrarse
  function outSideClick(event) {
    if (!menuHeader.contains(event.target) && event.target !== menuButton) {
      closeMenuHeader();
    }
  }
  // Función para enviar datos del formulario en formato JSON al localstorage y crear la alerta
  function sendDataForm() {
    const dataJson = {
      nombre: names.value,
      correo: email.value,
      comentario: comentario.value,
    };
    inputs.forEach(() => saveDataLocalToStorage("formulario", dataJson));
    if (localStorage.length >= 0) {
      alert(
        `Muchas gracias por ponerse en contacto con nosotros, ${dataJson.nombre}. Pronto le enviaremos un correo a: ${dataJson.correo}.`
      );
    }
  }
  // Evento de escucha del botón de envío
  submitButton.addEventListener("click", () => {
    sendDataForm();
  });
  // Función para obtener la fecha que se guardó en el localstorage anteriormente
  function getDate() {
    const fecha = localStorage.getItem("localization");
    const convertData = JSON.parse(fecha);
    return convertData;
  }

  const dataLocation = getDate();
  // Se crea el template con los datos
  const lastVisit = () => {
    last.innerHTML = `<p>Ultima visita: ${dataLocation.fecha}</p>`;
  };
  // Función para reajustar el tamaño del textarea mientras se escribe en él
  function resize() {
    comentario.addEventListener("input", () => {
      comentario.style.height = "100px";
      comentario.style.height = comentario.scrollHeight + "px";
    });
  }
  // Se crea el mapa pasandole los argumentos
  const mapa = createMap(dataLocation.longitud, dataLocation.latitud);
  map.appendChild(mapa);
  // Se crea template para Información del Sistema
  const { userAgent, vendor, lang, online, memory, cores } = getInfo();
  const createInfo = () => {
    info.innerHTML = `
    <div>
      <h4 style="text-align: center">Información de su Sistema</h4>
      <table>
        <tr>
          <td>Sistema Operativo:</td>
          <td>${userAgent}</td>
        </tr>
        <tr>
          <td>Navegador:</td>
          <td>${vendor}</td>
        </tr>
        <tr>
          <td>Idioma:</td>
          <td>${lang}</td>
        </tr>
        <tr>
          <td>Núcleos Procesador:</td>
          <td>${cores} CPUs</td>
        </tr>
        <tr>
          <td>Memoria Total:</td>
          <td>${memory} GB</td>
        </tr>
        <tr>
          <td>Memoria Disponible Aproximada:</td>
          <td>${memory / 2} GB</td>
        </tr>
        <tr>
          <td>Usuario en Línea:</td>
          <td>${online ? "En línea" : "Desconectado"}</td>
        </tr>
      </table>
    </div>
    `;
  };
  // Ingresamos los datos en el footer
  const addFooter = () => {
    footer.innerHTML = `&copy;Terreneitor · Web ${year}`;
  };
  // Inicializamos las demás funciones
  createAvatars();
  lastVisit();
  resize();
  createInfo();
  addFooter();
  getInfo();
});
