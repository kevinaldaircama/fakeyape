/* MODAL */
const modal = document.getElementById("welcomeModal");
const countdownEl = document.getElementById("countdown");
const closeBtn = document.getElementById("closeModal");

let timeLeft = 10;

const timer = setInterval(()=>{
  timeLeft--;
  countdownEl.textContent = timeLeft;

  if(timeLeft<=0){
    clearInterval(timer);
    countdownEl.style.display="none";
    closeBtn.style.display="block";
  }
},1000);

closeBtn.addEventListener("click",()=>{
  modal.style.display="none";
});

/* FIREBASE */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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
const provider = new GoogleAuthProvider();

document.getElementById("googleLogin").addEventListener("click", async ()=>{
  try{
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    alert("Bienvenido "+user.displayName);
    window.location.href="home";
  }catch(error){
    alert(error.message);
  }
});

/* SLIDER */
const slides=document.querySelectorAll(".slide");
const dots=document.querySelectorAll(".dot");
let current=0;

function showSlide(index){
  slides.forEach(s=>s.classList.remove("active"));
  dots.forEach(d=>d.classList.remove("active"));
  slides[index].classList.add("active");
  dots[index].classList.add("active");
}

function nextSlide(){
  current=(current+1)%slides.length;
  showSlide(current);
}

setInterval(nextSlide,3000);

dots.forEach((dot,index)=>{
  dot.addEventListener("click",()=>{
    current=index;
    showSlide(current);
  });
});