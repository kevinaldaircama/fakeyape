import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

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
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

const input = document.getElementById("clave");
const dots = document.querySelectorAll(".dot");
const keypad = document.getElementById("keypad");
const modal = document.getElementById("modal");
const modalText = document.getElementById("modal-text");
const maintenanceScreen = document.getElementById("maintenanceScreen");

function updateDots(){
  dots.forEach((d,i)=>d.classList.toggle("active", i < input.value.length));
}

function addNumber(n){
  if(input.value.length < 6){
    input.value += n;
    updateDots();
    if(input.value.length === 6) verificarPIN();
  }
}

function deleteNumber(){
  input.value = input.value.slice(0,-1);
  updateDots();
}

function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function generateKeypad(){
  keypad.innerHTML="";
  const nums = shuffle([0,1,2,3,4,5,6,7,8,9]);
  const layout=[...nums.slice(0,9),"finger",nums[9],"del"];

  layout.forEach(item=>{
    const b=document.createElement("button");
    if(typeof item==="number"){
      b.textContent=item;
      b.onclick=()=>addNumber(item);
    }else if(item==="del"){
      b.innerHTML='<i class="fa-solid fa-delete-left"></i>';
      b.onclick=deleteNumber;
    }else{
      b.innerHTML='<i class="fa-solid fa-fingerprint"></i>';
      b.onclick=()=>alert("🔒 Huella no disponible aún");
    }
    keypad.appendChild(b);
  });
}

async function verificarPIN(){
  modal.style.display="flex";
  modalText.textContent="Verificando...";

  onAuthStateChanged(auth, async user=>{
    if(!user){
      modalText.textContent="⚠️ No has iniciado sesión";
      return;
    }

    const snap = await getDoc(doc(db,"usuarios",user.uid));

    if(snap.exists() && input.value === snap.data().pin){
      location.href="home";
    }else{
      modalText.textContent="❌ PIN incorrecto";
      input.value="";
      updateDots();
      generateKeypad();
    }
  });
}

generateKeypad();

/* MODO MANTENIMIENTO DESDE FIREBASE */
const maintenanceRef = ref(rtdb, "config/maintenance/enabled");

onValue(maintenanceRef, snap=>{
  const state = snap.exists() && snap.val() === true;

  if(state){
    maintenanceScreen.style.display="flex";
    document.body.style.overflow="hidden";
  }else{
    maintenanceScreen.style.display="none";
    document.body.style.overflow="";
  }
});
