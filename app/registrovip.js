/* MODAL TERMINOS */
function abrirTerminos(){
window.abrirTerminos = function(){
  document.getElementById("modalTerminos").style.display = "flex";
}

window.cerrarTerminos = function(){
  document.getElementById("modalTerminos").style.display = "none";
}

window.cerrarSiFondo = function(e){
  if(e.target.id === "modalTerminos"){
    window.cerrarTerminos();
  }
}
/* FIREBASE */
firebase.initializeApp({  
  apiKey: "AIzaSyDVvEXCUiCPB5RmAVVWfmce2x-FALLDL0c",
    authDomain: "roddoxes.firebaseapp.com",
    databaseURL: "https://roddoxes-default-rtdb.firebaseio.com",  
    projectId: "roddoxes",
    storageBucket: "roddoxes.firebasestorage.app",
    messagingSenderId: "688697487472",
    appId: "1:688697487472:web:7e3d19b907ae330dda04b5",
    measurementId: "G-0DLHHJRSFP"
});  
  
const auth = firebase.auth();  
const db = firebase.firestore();  
  
const modal = document.getElementById("modal");  
const modalContent = document.getElementById("modal-content");  
  
const correo = document.getElementById("correo");  
const clave = document.getElementById("clave");  
const clave2 = document.getElementById("clave2");  
const usuario = document.getElementById("usuario");  
const telefono = document.getElementById("telefono");
const monto = document.getElementById("monto");  
const pin = document.getElementById("pin");  
  
function nextStep(step){  
  document.getElementById("step"+step).classList.remove("active");  
  document.getElementById("step"+(step+1)).classList.add("active");  
}  
  
function registrarUsuario(){  
  if(clave.value !== clave2.value){
    alert("Las contraseñas no coinciden");
    return;
  }

  modal.style.display="flex";  
  modalContent.innerHTML="⏳ Registrando...";  
  
  auth.createUserWithEmailAndPassword(correo.value, clave.value)
  .then(res=>{
    return db.collection("usuarios").doc(res.user.uid).set({
      nombre: usuario.value,
      correo: correo.value,
      telefono: telefono.value,
      monto: monto.value,
      pin: pin.value
    });
  })
    .then(()=>{  
      modalContent.innerHTML = `  
        <h3>🎉 Cuenta creada con éxito</h3>  
        <iframe src="https://www.youtube.com/embed/CcRoSvyghzw" allowfullscreen></iframe>  
        <button onclick="continuar()" style="background:#22c55e;margin-top:10px">  
          ✅ Continuar  
        </button>  
      `;  
    })  
    .catch(e=>{  
      modalContent.innerHTML="❌ "+e.message;  
    });  
}  
  
function continuar(){  
  window.location.href="inicio";  
    }
