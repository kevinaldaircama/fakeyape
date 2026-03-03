document.addEventListener("DOMContentLoaded", () => {

  // Fecha y hora actual
  const fecha = new Date();
  const opciones = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };

  const fechaElemento = document.getElementById('fechaHora');
  if (fechaElemento) {
    fechaElemento.textContent =
      new Intl.DateTimeFormat('es-ES', opciones)
        .format(fecha)
        .replace('.', '');
  }

  // Parámetros URL
  const params = new URLSearchParams(window.location.search);

  const username = document.getElementById("username");
  const playerId = document.getElementById("playerId");
  const monto = document.getElementById("monto");
  const paquete = document.getElementById("paquete");

  if (username) username.textContent = params.get("username") || "---";
  if (playerId) playerId.textContent = params.get("id") || "---";
  if (monto) monto.textContent = params.get("monto") || "0.00";
  if (paquete) paquete.textContent = params.get("paquete") || "Diamantes";

  // Botón volver
  const volverBtn = document.getElementById("volverInicio");

  if (volverBtn) {
    volverBtn.addEventListener("click", () => {
      window.location.href = "/";
    });
  }

});