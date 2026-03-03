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
const db = firebase.database();
let contactosGlobal = {};

function mostrarMensaje(t){
  document.getElementById("mensajeTexto").innerText=t;
  document.getElementById("modalMensaje").style.display="flex";
}

function cerrarModal(id){
  document.getElementById(id).style.display="none";
}

function existeDuplicado(nombre,numero,ignoreKey=null){
  return Object.keys(contactosGlobal).some(key=>{
    if(key===ignoreKey) return false;
    const c=contactosGlobal[key];
    return c.nombre.toLowerCase()===nombre.toLowerCase()
        && c.numero===numero;
  });
}

function guardarContacto(){
  const apodo=document.getElementById("apodo").value.trim()||"sin_apodo_"+Date.now();
  const nombre=document.getElementById("nombre").value.trim();
  const numero=document.getElementById("numero").value.trim();

  if(!nombre||!numero){
    mostrarMensaje("Completa nombre y número.");
    return;
  }

  if(existeDuplicado(nombre,numero)){
    mostrarMensaje("Ya existe este contacto.");
    return;
  }

  db.ref("contactos/"+apodo).set({
    nombre,numero,destino:"Yape"
  });
}

function renderLista(data){
  const lista=document.getElementById("lista");
  lista.innerHTML="";
  const filtro=document.getElementById("buscador").value.toLowerCase();

  Object.keys(data).forEach(key=>{
    const c=data[key];
    if(
      c.nombre.toLowerCase().includes(filtro)||
      c.numero.includes(filtro)
    ){
      lista.innerHTML+=`
      <div class="card">
        <strong><i class="fa-solid fa-user"></i> ${c.nombre}</strong><br>
        <i class="fa-solid fa-phone"></i> ${c.numero}<br>
        <i class="fa-solid fa-wallet"></i> ${c.destino}
        <div class="actions">
          <button class="icon-btn edit" onclick="abrirEditar('${key}')">
          <i class="fa-solid fa-pen"></i>
          </button>
          <button class="icon-btn delete" onclick="abrirEliminar('${key}')">
          <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
      `;
    }
  });
}

document.getElementById("buscador")
.addEventListener("input",()=>renderLista(contactosGlobal));

db.ref("contactos").on("value",snapshot=>{
  contactosGlobal=snapshot.val()||{};
  renderLista(contactosGlobal);
});

function abrirEditar(key){
  const c=contactosGlobal[key];
  document.getElementById("editKey").value=key;
  document.getElementById("editNombre").value=c.nombre;
  document.getElementById("editNumero").value=c.numero;
  document.getElementById("editApodo").value=key;
  document.getElementById("modalEditar").style.display="flex";
}

function guardarEdicion(){
  const oldKey=document.getElementById("editKey").value;
  const nuevoApodo=document.getElementById("editApodo").value.trim();
  const nombre=document.getElementById("editNombre").value.trim();
  const numero=document.getElementById("editNumero").value.trim();

  if(existeDuplicado(nombre,numero,oldKey)){
    mostrarMensaje("Ya existe este contacto.");
    return;
  }

  db.ref("contactos/"+oldKey).remove().then(()=>{
    db.ref("contactos/"+nuevoApodo).set({
      nombre,numero,destino:"Yape"
    });
  });

  cerrarModal("modalEditar");
}

function abrirEliminar(key){
  document.getElementById("deleteKey").value=key;
  document.getElementById("modalEliminar").style.display="flex";
}

function confirmarEliminar(){
  const key=document.getElementById("deleteKey").value;
  db.ref("contactos/"+key).remove();
  cerrarModal("modalEliminar");
}

function exportarJSON(){
  const data=contactosGlobal;
  if(Object.keys(data).length===0){
    mostrarMensaje("No hay contactos.");
    return;
  }
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download="mis_contactos.json";
  a.click();
  URL.revokeObjectURL(url);
}

document.getElementById("importFile")
.addEventListener("change",function(e){
  const file=e.target.files[0];
  if(!file) return;

  const reader=new FileReader();
  reader.onload=function(event){
    try{
      const data=JSON.parse(event.target.result);
      Object.keys(data).forEach(key=>{
        const c=data[key];
        if(c.nombre&&c.numero&&!existeDuplicado(c.nombre,c.numero)){
          db.ref("contactos/"+key).set({
            nombre:c.nombre,
            numero:c.numero,
            destino:"Yape"
          });
        }
      });
      mostrarMensaje("Importación completada.");
    }catch{
      mostrarMensaje("Archivo inválido.");
    }
  };
  reader.readAsText(file);
});