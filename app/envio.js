// 🔥 CONFIG FIREBASE
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
const firestore = firebase.firestore();
const realtimeDB = firebase.database();

// Elementos
const montoInput = document.getElementById('monto');
const mensaje = document.getElementById('mensaje');
const btnBancos = document.getElementById('btn-bancos');
const btnYapear = document.getElementById('btn-yapear');
const errorMonto = document.getElementById('errorMonto');
const nombreLabel = document.getElementById('nombre-label');
const numeroLabel = document.getElementById('numero-label');

// URL
const urlParams = new URLSearchParams(window.location.search);
const apodo = urlParams.get("apodo");

// Modal
function cerrarModalSaldo() {
  document.getElementById("modalSaldo").style.display = "none";
}
function mostrarModalSaldo() {
  document.getElementById("modalSaldo").style.display = "block";
}

// Cargar contacto
if (apodo) {
  realtimeDB.ref("contactos/" + apodo).once("value").then(snapshot => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      nombreLabel.textContent = data.nombre || apodo;
      if (data.numero) {
  const numero = data.numero.toString();
  const ultimos3 = numero.slice(-3);
  numeroLabel.textContent = "*** *** " + ultimos3;
} else {
  numeroLabel.textContent = "";
      }
    }
  });
}

// Validación monto
montoInput.addEventListener('focus', () => {
  if (montoInput.value === "0") montoInput.value = "";
});

montoInput.addEventListener('input', () => {
  const valor = parseFloat(montoInput.value);
  const valido = !isNaN(valor) && valor > 0;
  errorMonto.style.display = valido ? "none" : "block";
  btnBancos.disabled = !valido;
  btnYapear.disabled = !valido;
});

// Otros bancos
btnBancos.addEventListener('click', () => {
  window.location.href = "envío";
});

// Yapear
btnYapear.addEventListener('click', () => {

  const nombreVal = nombreLabel.textContent.trim();
  const montoVal = parseFloat(montoInput.value.trim());
  const mensajeVal = mensaje.value.trim();
  const telefonoVal = numeroLabel.textContent.trim();

  if (!nombreVal || isNaN(montoVal)) return;

  firebase.auth().onAuthStateChanged(function(user) {

    if (!user) {
      alert("Debes iniciar sesión primero");
      window.location.href = "login.html";
      return;
    }

    const uid = user.uid;
    const userDoc = firestore.collection("usuarios").doc(uid);

    userDoc.get().then(doc => {

      if (!doc.exists) {
        mostrarModalSaldo();
        return;
      }

      const data = doc.data();
      const saldoActual = parseFloat(data.monto);

      if (isNaN(saldoActual) || saldoActual < montoVal) {
        mostrarModalSaldo();
        return;
      }

      userDoc.update({
        monto: (saldoActual - montoVal).toFixed(2)
      }).then(() => {

        firestore.collection("movimientos").add({
          uid: uid,
          nombreDestino: nombreVal,
          monto: montoVal,
          mensaje: mensajeVal,
          fecha: firebase.firestore.Timestamp.now()
        }).then(() => {

          const url = `comprobante.html?nombre=${encodeURIComponent(nombreVal)}&telefono=${encodeURIComponent(telefonoVal)}&monto=${montoVal}`;
          window.location.href = url;

        });

      });

    });

  });

});