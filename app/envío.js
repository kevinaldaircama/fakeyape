function enviar() {

  const nombre = document.getElementById("nombre").value.trim();
  const telefonoSeleccionado = document.getElementById("telefono").value.trim();
  const monto = document.getElementById("monto").value.trim();
  const destinoSeleccionado = document.getElementById("destino").value.trim();

  if (!nombre || !telefonoSeleccionado || !monto || !destinoSeleccionado) {
    alert("Por favor completa todos los campos");
    return;
  }

  const url =
    "comprobante1.html?" +
    "nombre=" + encodeURIComponent(nombre) +
    "&telefono=" + encodeURIComponent(telefonoSeleccionado) +
    "&monto=" + encodeURIComponent(monto) +
    "&destino=" + encodeURIComponent(destinoSeleccionado);

  window.location.href = url;
}
