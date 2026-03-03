const resultElement = document.getElementById("result");
const fileInput = document.getElementById("file-input");
const btnSubir = document.getElementById("btnSubir");
const btnCerrar = document.getElementById("btnCerrar");

let html5QrCode;
let isCameraRunning = false;

/* Botón cerrar */
btnCerrar.addEventListener("click", () => {
  history.back();
});

/* Botón subir */
btnSubir.addEventListener("click", () => {
  fileInput.click();
});

/* Iniciar cámara */
async function startCamera() {
  try {
    if (isCameraRunning) return;

    html5QrCode = new Html5Qrcode("reader");

    await html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      qrCodeMessage => handleQRCode(qrCodeMessage)
    );

    isCameraRunning = true;

  } catch (err) {
    console.error("Error cámara:", err);
  }
}

/* Detener cámara */
async function stopCamera() {
  if (html5QrCode && isCameraRunning) {
    await html5QrCode.stop();
    isCameraRunning = false;
  }
}

/* Subir imagen */
fileInput.addEventListener("change", async e => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    await stopCamera();

    const qrCodeMessage = await html5QrCode.scanFile(file, false);
    handleQRCode(qrCodeMessage);

    await startCamera();

  } catch (err) {
    alert("No se detectó ningún QR en la imagen.");
    await startCamera();
  }
});

/* Manejar QR */
async function handleQRCode(qrCodeMessage) {

  navigator.vibrate?.(200);
  await stopCamera();

  const qrLista = JSON.parse(localStorage.getItem("qrLista") || "[]");
  const encontrado = qrLista.find(item => item.codigo === qrCodeMessage);

  if (encontrado) {
    const nombreEncoded = encodeURIComponent(encontrado.nombre);
    const destinoEncoded = encodeURIComponent(encontrado.destino || "");
    window.location.href =
      `envioqr.html?nombre=${nombreEncoded}&destino=${destinoEncoded}`;
  } else {
    alert("Este código no está en tu lista.");
    await startCamera();
  }
}

window.addEventListener("beforeunload", stopCamera);
startCamera();
