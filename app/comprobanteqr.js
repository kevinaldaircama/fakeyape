const params = new URLSearchParams(window.location.search);
const nombre = decodeURIComponent(params.get("nombre") || "Desconocido");
const monto = decodeURIComponent(params.get("monto") || "0");
const destino = decodeURIComponent(params.get("destino") || "Sin destino");

document.getElementById("nombre").textContent = nombre;
document.getElementById("monto").textContent = `S/${monto}`;
document.getElementById("destino").textContent = destino;

const now = new Date();
document.getElementById("fecha").textContent = now.toLocaleDateString('es-PE', { 
  day: '2-digit', month: 'short', year: 'numeric' 
});
document.getElementById("hora").textContent = now.toLocaleTimeString('es-PE', { 
  hour: 'numeric', minute: '2-digit', hour12: true 
}).toLowerCase();

const numeroOperacion = Math.floor(4000000 + Math.random() * 1000000);
document.getElementById("operacion").textContent = numeroOperacion.toString().padStart(8, '0');

// Banner aleatorio
const banners = [
  "imagen/1.jpg",
  "imagen/2.jpg",
  "imagen/3.jpg",
  "imagen/4.jpg"
];
const bannerEl = document.querySelector(".banner img");
const imagenAleatoria = banners[Math.floor(Math.random() * banners.length)];
bannerEl.src = imagenAleatoria;