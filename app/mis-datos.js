import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

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

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

let userUID;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    userUID = user.uid;

    const uidSpan = document.getElementById("uid-value");
    if (uidSpan) {
      uidSpan.dataset.original = userUID;
      uidSpan.dataset.hidden = "true";
      uidSpan.textContent = "••••••••";
    }

    const correo = document.getElementById("correo");
    if (correo) correo.textContent = user.email;

    try {
      const docRef = doc(db, "usuarios", userUID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        const nombre = document.getElementById("nombre");
        const monto = document.getElementById("monto");
        const pin = document.getElementById("pin");
        const telefono = document.getElementById("telefono");

        if (nombre) nombre.value = data.nombre ?? "";
        if (monto) monto.value = data.monto ?? "";
        if (pin) pin.value = data.pin ?? "";
        if (telefono) telefono.value = data.telefono ?? "";

      }

    } catch (e) {
      mostrarModal("Error obteniendo datos");
    }
  }
});

/* Mostrar / Ocultar UID */
window.toggleVisibility = (id, iconId) => {
  const span = document.getElementById(id);
  const icon = document.getElementById(iconId);

  if (!span || !icon) return;

  if (span.dataset.hidden === "true") {
    span.textContent = span.dataset.original;
    span.dataset.hidden = "false";
    icon.classList.replace("fa-eye-slash", "fa-eye");
  } else {
    span.textContent = "••••••••";
    span.dataset.hidden = "true";
    icon.classList.replace("fa-eye", "fa-eye-slash");
  }
};

/* Mostrar / Ocultar PIN */
window.toggleVisibilityInput = (inputId, iconId) => {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);

  if (!input || !icon) return;

  if (input.type === "text") {
    input.type = "password";
    icon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    input.type = "text";
    icon.classList.replace("fa-eye-slash", "fa-eye");
  }
};

/* Activar edición (ahora incluye teléfono sin romper nada) */
window.activarEdicion = () => {
  ["nombre", "monto", "telefono"].forEach(id => {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.disabled = false;
    }
  });

  const guardarBtn = document.getElementById("guardarBtn");
  if (guardarBtn) guardarBtn.style.display = "inline-block";
};

/* Guardar cambios */
window.guardarCambios = async () => {
  const nombre = document.getElementById("nombre")?.value.trim();
  const monto = parseFloat(document.getElementById("monto")?.value);
  const telefono = document.getElementById("telefono")?.value.trim();

  try {
    await updateDoc(doc(db, "usuarios", userUID), {
      nombre,
      monto,
      telefono
    });

    mostrarModal("Datos actualizados correctamente.");

    ["nombre", "monto", "telefono"].forEach(id => {
      const elemento = document.getElementById(id);
      if (elemento) {
        elemento.disabled = true;
      }
    });

    const guardarBtn = document.getElementById("guardarBtn");
    if (guardarBtn) guardarBtn.style.display = "none";

  } catch (e) {
    mostrarModal("Error al guardar: " + e.message);
  }
};

window.mostrarModal = (mensaje) => {
  const modalMessage = document.getElementById("modal-message");
  const modal = document.getElementById("modal");

  if (modalMessage) modalMessage.textContent = mensaje;
  if (modal) modal.style.display = "flex";

  setTimeout(() => cerrarModal(), 3000);
};

window.cerrarModal = () => {
  const modal = document.getElementById("modal");
  if (modal) modal.style.display = "none";
};