let map;
let marker;

/* 🔊 sonido de alerta */
let sonidoAlerta = new Audio("sonido/sonido.mp3");
sonidoAlerta.volume = 1.0;
sonidoAlerta.loop = true;

/* ===================== ALERTA ===================== */

function activarAlerta(tipo) {

  if (!confirm("¿Deseas enviar la alerta de emergencia?")) return;

  const app = document.querySelector(".app");
  const mensajeUI = document.getElementById("mensaje");

  /* 🚨 ANIMACIÓN */
  if (app) {
    app.classList.add("alerta-activa");
  }

  /* 🔊 SONIDO */
  sonidoAlerta.currentTime = 0;
  sonidoAlerta.play().catch(() => {
    console.log("Audio bloqueado por el navegador");
  });

  /* 📳 VIBRACIÓN */
  if (navigator.vibrate) {
    navigator.vibrate([300, 100, 300, 100, 300, 100, 1000, 200, 1000]);
  }

  /* 🟡 Paso 1 */
  mensajeUI.innerHTML = "📡 Obteniendo ubicación...";

  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition((pos) => {

      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      /* 🟢 Paso 2 */
      mensajeUI.innerHTML = "📍 Ubicación encontrada, preparando alerta...";
const baseURL = "https://denisecl1.github.io/Proyecto_Boton_panico/";

const linkApp = `${baseURL}?lat=${lat}&lon=${lon}&tipo=${tipo}`;

      /* ✨ MENSAJE MEJORADO */
     const mensaje = `🚨 *ALERTA DE EMERGENCIA* 🚨

🔴 *Estado:* Necesito ayuda urgente
⚠️ *Tipo:* ${tipo}

📍 *Ubicación en tiempo real:*
${linkApp}

📱 *Enviado desde app de emergencia*

🙏 Por favor acude lo antes posible.`;
      /* 🔵 Paso 3 */
      mensajeUI.innerHTML = "📲 Enviando alerta...";

      setTimeout(() => {

        /* 🔊 detener sonido */
        sonidoAlerta.pause();
        sonidoAlerta.currentTime = 0;

        /* 📳 detener vibración */
        if (navigator.vibrate) {
          navigator.vibrate(0);
        }

        /* 🚨 quitar animación */
        if (app) {
          app.classList.remove("alerta-activa");
        }

        /* abrir WhatsApp */
        const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
        window.open(url, "_blank");

        /* 🔴 Paso 4 */
        mensajeUI.innerHTML = `
          🚨 Emergencia: ${tipo} <br>
          ✅ Listo para enviar por WhatsApp
        `;

        mostrarMapa(lat, lon);

      }, 2500);

    }, () => {

      mensajeUI.innerHTML = "❌ No se pudo obtener la ubicación";

      sonidoAlerta.pause();
      sonidoAlerta.currentTime = 0;

      if (navigator.vibrate) navigator.vibrate(0);
      if (app) app.classList.remove("alerta-activa");
    });

  } else {

    mensajeUI.innerHTML = "❌ Geolocalización no soportada";

    sonidoAlerta.pause();
    sonidoAlerta.currentTime = 0;

    if (navigator.vibrate) navigator.vibrate(0);
    if (app) app.classList.remove("alerta-activa");
  }
}

/* ===================== MAPA ===================== */

function mostrarMapa(lat, lon) {

  if (!map) {

    map = L.map('map').setView([lat, lon], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Mapa'
    }).addTo(map);

    marker = L.marker([lat, lon]).addTo(map)
      .bindPopup("Ubicación actual")
      .openPopup();

    setTimeout(() => {
      map.invalidateSize();
    }, 100);

  } else {

    map.setView([lat, lon], 15);
    marker.setLatLng([lat, lon]);
  }
}

/* ===================== LEER LINK ===================== */

function obtenerParametros() {

  const params = new URLSearchParams(window.location.search);

  const lat = params.get("lat");
  const lon = params.get("lon");
  const tipo = params.get("tipo");

  if (lat && lon) {

    mostrarMapa(parseFloat(lat), parseFloat(lon));

    const mensaje = document.getElementById("mensaje");

    mensaje.innerHTML = `
      🚨 Emergencia recibida: ${tipo} <br>
      📍 Ubicación en el mapa
    `;

    /* 🔊 sonido al abrir el link */
    sonidoAlerta.currentTime = 0;
    sonidoAlerta.play().catch(() => {});

    /* 📳 vibración al abrir */
    if (navigator.vibrate) {
      navigator.vibrate([1000, 300, 1000]);
    }
  }
}

/* ===================== CARGA INICIAL ===================== */

window.onload = function () {
  obtenerParametros();
};