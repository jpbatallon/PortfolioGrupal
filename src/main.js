const $ = (selector) => document.querySelector(selector);
const name = $("#name");
const mail = $("#mail");
const form = $("form");
const textarea = $(".comentario");
const menuButton = $(".menu-icon");
const menuHeader = $(".menu-stack");
const menuClose = $(".close-menu");
const menuHeaderList = $(".menu-stack a");

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
    menuHeaderList.style.display = "inline-flex"
    isMenuHeaderOpen = true;
    document.addEventListener("click", outSideClick);
  }

  function closeMenuHeader() {
    menuHeader.style.display = "";
    menuButton.style.display = "";
    isMenuHeaderOpen = false;
    document.addEventListener("click", outSideClick);
  }

  menuButton.onclick = function (event) {
    event.stopPropagation();
    if (!isMenuHeaderOpen) {
      openHeaderMenu();
    } else {
      closeMenuHeader();
    }
  };

  function outSideClick(event) {
    if (!menuHeader.contains(event.target) && event.target !== menuButton) {
      closeMenuHeader();
    }
  }

  const sendFormData = () => {
    name.addEventListener("input", () => {
      localStorage.setItem("nombre", name.value);
    });
    mail.addEventListener("input", () => {
      localStorage.setItem("correo", mail.value);
    });
    textarea.addEventListener("input", () => {
      localStorage.setItem("comentario", textarea.value);
    });
  };

  const fetchComents = () => {
    const localName = localStorage.getItem("nombre");
    const localMail = localStorage.getItem("correo");
    const localComment = localStorage.getItem("comentario");
    const comments = $("#comments");

    if (localName && localMail && localComment) {
      comments.innerHTML = `
        <div>
            <p>Nombre: ${localName}</p>
            <p>Mail: ${localMail}</p>
            <p>Comentario:</p>
            <p>${localComment}</p>
        </div>
        `;
    }
  };

  resize();
  sendFormData();
  form.addEventListener("submit", () => {
    fetchComents();
  });
});
