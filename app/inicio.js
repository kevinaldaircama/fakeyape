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

/* SEGURIDAD LOGIN */

let intentosFallidos = 0;
let bloqueoLogin = false;

/* GENERAR ID DISPOSITIVO */

function generarID(){
  return 'dev-' + Math.random().toString(36).substr(2,9) + Date.now();
}

let dispositivoID = localStorage.getItem("deviceID");

if(!dispositivoID){
  dispositivoID = generarID();
  localStorage.setItem("deviceID", dispositivoID);
}

/* =========================
   INICIAR SESIÓN
========================= */

async function iniciarSesion() {

  if(bloqueoLogin){
    alert("⚠️ Demasiados intentos. Espera 30 segundos.");
    return;
  }

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

    await user.reload();

    intentosFallidos = 0;

    /* CORREO NO VERIFICADO */

    if (!user.emailVerified) {

      modalContent.innerHTML = `

      <h3>❌ Correo no verificado</h3>

      <p>Tu correo aún no está verificado.</p>
      <p>Haz click para recibir el enlace de verificación.</p>

      <button onclick="enviarVerificacion()"
      style="background:#22c55e;padding:10px 20px;border:none;border-radius:6px;color:white;width:100%;margin-top:10px">
      📩 Verificar correo
      </button>

      <button onclick="window.location.reload()"
      style="background:#7A1B7E;padding:10px 20px;border:none;border-radius:6px;color:white;width:100%;margin-top:10px">
      Volver
      </button>

      `;

      verificarCorreoAutomatico();

      return;
    }

    loginUsuario(user);

  } catch (error) {

    intentosFallidos++;

    if(intentosFallidos >= 5){

      bloqueoLogin = true;

      modalContent.innerHTML = `
      <h3>🚫 Demasiados intentos</h3>
      <p>Tu acceso fue bloqueado por seguridad.</p>
      <p>Espera 30 segundos para intentar nuevamente.</p>
      `;

      setTimeout(()=>{
        bloqueoLogin = false;
        intentosFallidos = 0;
      },30000);

      return;
    }

    modalContent.innerHTML = "❌ " + error.message;

  }

}

/* =========================
   ENVIAR VERIFICACION
========================= */

async function enviarVerificacion(){

  const user = auth.currentUser;

  if(!user){
    modalContent.innerHTML="❌ No hay sesión activa";
    return;
  }

  try{

    await user.sendEmailVerification({
      url:"https://roddox.es/inicio.html",
      handleCodeInApp:false
    });

    modalContent.innerHTML=`

    <h3>📩 Correo enviado</h3>

    <p>Te enviamos un enlace de verificación.</p>
    <p>Revisa tu bandeja de entrada o spam.</p>

    `;

    verificarCorreoAutomatico();

  }catch(e){

    modalContent.innerHTML="❌ "+e.message;

  }

}

/* =========================
   DETECTAR VERIFICACION
========================= */

function verificarCorreoAutomatico(){

  const intervalo = setInterval(async()=>{

    const user = auth.currentUser;

    if(user){

      await user.reload();

      if(user.emailVerified){

        clearInterval(intervalo);

        modalContent.innerHTML = `
        <h3>✅ Cuenta verificada</h3>
        <p>Tu correo fue verificado correctamente.</p>
        `;

        loginUsuario(user);

      }

    }

  },4000);

}

/* =========================
   LOGIN USUARIO
========================= */

async function loginUsuario(user){

  const uid = user.uid;

  const doc = await db.collection("usuarios").doc(uid).get();

  if(doc.exists){

    const usuario = doc.data();

    /* GUARDAR DATOS */

    localStorage.setItem("nombreUsuario", usuario.nombre);
    localStorage.setItem("saldoUsuario", usuario.monto);

    /* GUARDAR DISPOSITIVO */

    db.collection("usuarios").doc(uid).update({
      ultimoDispositivo: dispositivoID,
      ultimoLogin: new Date()
    });

    modalContent.innerHTML="✅ Inicio de sesión correcto";

    setTimeout(()=>{
      window.location.href="login";
    },1200);

  }else{

    modalContent.innerHTML="⚠️ Usuario no encontrado";

  }

}

/* =========================
   RECUPERAR PASSWORD
========================= */

function recuperarPassword(){

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
    .then(()=>{
      alert("✅ Se envió un correo para recuperar tu contraseña.");
    })
    .catch(error=>{
      alert("❌ "+error.message);
    });

}

/* =========================
   VOLVER
========================= */

function volver(){
  window.location.href="/";
}
