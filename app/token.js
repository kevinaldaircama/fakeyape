import { initializeApp, getApps } 
from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

import { getDatabase, ref, onValue, get, update } 
from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getDatabase(app);

const msg = document.getElementById("msg");
const tokenInput = document.getElementById("token");
const loginBtn = document.getElementById("loginBtn");
const maintenanceScreen = document.getElementById("maintenanceScreen");

/* ===== MANTENIMIENTO ===== */
const maintenanceRef = ref(db,"config/maintenance/enabled");

onValue(maintenanceRef, snap=>{
  const enabled = snap.val() === true;
  maintenanceScreen.classList.toggle("active", enabled);
  document.body.style.overflow = enabled ? "hidden" : "";
});

/* ===== LOGIN ===== */
async function checkToken(){

  const token = tokenInput.value.trim();

  if(!token){
    showMsg("Introduce un token","error");
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = "Verificando...";

  try{
    const tokenRef = ref(db,"tokens/"+token);
    const snap = await get(tokenRef);

    if(!snap.exists()){
      showMsg("Token inválido","error");
      resetBtn();
      return;
    }

    const data = snap.val();

    if(data.used){
      showMsg("Este token ya fue usado","error");
      resetBtn();
      return;
    }

    await update(tokenRef,{used:true});
    localStorage.setItem("sessionToken",token);

    showMsg(`Bienvenido ${data.userName}`,"success");

    setTimeout(()=>location.href="inicio",1200);

  }catch(e){
    console.error(e);
    showMsg("Error al verificar token","error");
    resetBtn();
  }
}

function showMsg(text,type){
  msg.textContent = text;
  msg.style.color = type==="success"
    ? "var(--success)"
    : "var(--error)";
}

function resetBtn(){
  loginBtn.disabled=false;
  loginBtn.textContent="Continuar";
}

loginBtn.addEventListener("click",checkToken);

/* ===== SESIÓN ACTIVA ===== */
window.addEventListener("load",()=>{
  if(localStorage.getItem("sessionToken")){
    location.href="inicio";
  }
});
