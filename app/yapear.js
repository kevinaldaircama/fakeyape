// Configuración Firebase
const firebaseConfig = {
 apiKey: "AIzaSyDVvEXCUiCPB5RmAVVWfmce2x-FALLDL0c",
    authDomain: "roddoxes.firebaseapp.com",
    databaseURL: "https://roddoxes-default-rtdb.firebaseio.com",  
    projectId: "roddoxes",
    storageBucket: "roddoxes.firebasestorage.app",
    messagingSenderId: "688697487472",
    appId: "1:688697487472:web:7e3d19b907ae330dda04b5",
    measurementId: "G-0DLHHJRSFP"
  };

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const contactList = document.querySelector(".contact-list");
const buscador = document.getElementById("buscador");

let contactosGlobal = {};

// Renderizar contactos
function renderizarContactos(datos) {
  const fragment = document.createDocumentFragment();
  contactList.innerHTML = "";

  if (!datos || Object.keys(datos).length === 0) {
    contactList.innerHTML = `
      <div class="empty">
        No se encontraron contactos.
      </div>
    `;
    return;
  }

  Object.entries(datos).forEach(([apodo, contacto]) => {
    const nombre = contacto.nombre?.trim();
    const numero = contacto.numero?.trim();

    if (!numero) return;

    let mostrarNombre = (!apodo.startsWith("sin_apodo_") && apodo !== nombre)
      ? apodo
      : nombre || "Sin nombre";

    const div = document.createElement("div");
    div.className = "contact";
    div.onclick = () => {
      window.location.href = 'envio.html?apodo=' + encodeURIComponent(apodo);
    };

    div.innerHTML = `
      <div class="contact-name">${mostrarNombre}</div>
      <div class="contact-number">${numero}</div>
    `;

    fragment.appendChild(div);
  });

  contactList.appendChild(fragment);
}

// Carga inicial
db.ref("contactos").once("value").then(snapshot => {
  contactosGlobal = snapshot.val() || {};
  renderizarContactos(contactosGlobal);
});

// Actualizaciones en tiempo real
db.ref("contactos").on("child_changed", () => {
  db.ref("contactos").once("value").then(snapshot => {
    contactosGlobal = snapshot.val() || {};
    renderizarContactos(contactosGlobal);
  });
});

// Buscador
buscador.addEventListener("input", () => {
  const texto = buscador.value.toLowerCase().trim();

  if (!texto) {
    renderizarContactos(contactosGlobal);
    return;
  }

  const filtrados = {};

  Object.entries(contactosGlobal).forEach(([apodo, contacto]) => {
    const nombre = (contacto.nombre || "").toLowerCase();
    const numero = (contacto.numero || "").toLowerCase();
    const alias = apodo.toLowerCase();

    if (
      nombre.includes(texto) ||
      numero.includes(texto) ||
      alias.includes(texto)
    ) {
      filtrados[apodo] = contacto;
    }
  });

  renderizarContactos(filtrados);
});
