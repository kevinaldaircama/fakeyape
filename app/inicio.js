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

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");

/* =========================
   INICIAR SESIÓN SEGURO
========================= */
async function iniciarSesion() {
  const correo = document.getElementById('correo').value.trim();
  const clave = document.getElementById('clave').value.trim();

  if (!correo || !clave) {
    alert("Completa todos los campos");
    return;
  }

  modal.style.display = "flex";
  modalContent.innerHTML = "⏳ Verificando...";

  try {
    const credenciales = await auth.signInWithEmailAndPassword(correo, clave);
    const user = credenciales.user;

    // 🔄 Recargar usuario para obtener estado real
    await user.reload();

    // 🚫 BLOQUEO SI NO VERIFICA
    if (!user.emailVerified) {
      const actionCodeSettings = {
        url: "https://kevin-5e678.firebaseapp.com/inicio.html",
        handleCodeInApp: false
      };

      await user.sendEmailVerification(actionCodeSettings);
      await auth.signOut();

      modalContent.innerHTML = `
        <h3>❌ Correo no verificado</h3>
        <p>Te enviamos un enlace de verificación a tu correo.</p>
        <p>Revisa tu bandeja de entrada o spam.</p>
        <button onclick="window.location.reload()" 
          style="background:#f59e0b;padding:10px 15px;border:none;border-radius:6px;color:white;cursor:pointer;margin-top:10px;">
          🔄 Reintentar
        </button>
      `;
      return;
    }

    // ✅ SI ESTÁ VERIFICADO
    const uid = user.uid;
    const doc = await db.collection("usuarios").doc(uid).get();

    if (doc.exists) {
      const usuario = doc.data();
      localStorage.setItem("nombreUsuario", usuario.nombre);
      localStorage.setItem("saldoUsuario", usuario.monto);

      modalContent.innerHTML = "✅ Inicio de sesión correcto";

      setTimeout(() => {
        window.location.href = "login";
      }, 1200);
    } else {
      modalContent.innerHTML = "⚠️ Usuario no encontrado";
    }
  } catch (error) {
    modalContent.innerHTML = "❌ " + error.message;
  }
}

/* =========================
   REENVIAR VERIFICACIÓN
========================= */
async function reenviarVerificacion() {
  const correo = document.getElementById('correo').value.trim();
  const clave = document.getElementById('clave').value.trim();

  if (!correo || !clave) {
    alert("Completa todos los campos para reenviar el correo");
    return;
  }

  try {
    const credenciales = await auth.signInWithEmailAndPassword(correo, clave);
    const user = credenciales.user;

    const actionCodeSettings = {
      url: "https://kevin-5e678.firebaseapp.com/inicio.html",
      handleCodeInApp: false
    };

    await user.sendEmailVerification(actionCodeSettings);
    await auth.signOut();

    alert("📩 Se reenviò el correo de verificación. Revisa tu bandeja de entrada o spam.");
  } catch (error) {
    alert("❌ Error al reenviar el correo: " + error.message);
  }
}

/* =========================
   RECUPERAR PASSWORD
========================= */
function recuperarPassword() {
  const correo = document.getElementById('correo').value.trim();

  if (!correo) {
    alert("Escribe tu correo primero");
    return;
  }

  const actionCodeSettings = {
    url: "https://roddox.es/inicio.html",
    handleCodeInApp: false
  };

  auth.sendPasswordResetEmail(correo, actionCodeSettings)
    .then(() => {
      alert("✅ Se envió un correo para recuperar tu contraseña. Revisa bandeja de entrada o spam.");
    })
    .catch(error => {
      if (error.code === "auth/user-not-found") {
        alert("⚠️ Este correo no está registrado.");
      } else if (error.code === "auth/invalid-email") {
        alert("⚠️ El correo ingresado no es válido.");
      } else {
        alert("❌ Error: " + error.message);
      }
    });
}

/* =========================
   VOLVER
========================= */
function volver() {
  window.location.href = "/";
}