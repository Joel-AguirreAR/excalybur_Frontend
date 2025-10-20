// 🧺 Arcón ceremonial: productos seleccionados
let arcon = JSON.parse(localStorage.getItem("arcon")) || [];

// 📦 Cargar productos desde el backend
fetch("http://localhost:3000/products")
  .then((res) => res.json())
  .then((data) => {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";


    // 🔁 Recorrer cada producto
    data.forEach((p) => {
      // 🔢 Agrupar variantes por combinación talle-color
      const variantesAgrupadas = {};
      p.variants.forEach((v) => {
        const clave = `${v.size}-${v.color}`;
        variantesAgrupadas[clave] = v.stock;
      });

      // 🎨 Colores únicos
      const coloresUnicos = [...new Set(p.variants.map((v) => v.color))];
      // 📏 Talles únicos
      const tallesUnicos = [...new Set(p.variants.map((v) => v.size))];

      // 🧱 Estructura HTML del producto
      const productoHTML = `
        <div class="card" data-id="${p._id}">
          <img src="${p.image}" alt="${p.name}" />
          <h3>${p.name}</h3>
          <p><strong>Estilo:</strong> ${p.style}</p>
          <p><strong>Precio:</strong> $${p.price}</p>
          <p><strong>Descripción:</strong> ${p.description}</p>

          <div class="selector-producto">
            <!-- 🎨 Selector de color -->
            <div class="colores">
              <p><strong>Color:</strong></p>
              ${coloresUnicos
                .map(
                  (color) => `
                <button
                  class="color-btn"
                  data-color="${color}"
                  title="${color.charAt(0).toUpperCase() + color.slice(1)}"
                  style="background-color: ${
                    typeof mapaColores !== "undefined" && mapaColores[color]
                      ? mapaColores[color]
                      : color.toLowerCase()
                  }"
                ></button>
              `
                )
                .join("")}
            </div>

            <!-- 📏 Selector de talle -->
            <div class="talles">
              <p><strong>Talle:</strong></p>
              ${tallesUnicos
                .map(
                  (size) => `
                <button class="talle-btn" data-size="${size}">${size}</button>
              `
                )
                .join("")}
            </div>

            <!-- 🔢 Selector de cantidad -->
            <div class="cantidad">
              <p><strong>Cantidad:</strong></p>
              <button class="menos">−</button>
              <span class="valor-cantidad">1</span>
              <button class="mas">+</button>
            </div>

            <!-- 🔍 Información de stock -->
            <div class="stock-info"></div>

            <!-- 🧺 Botón de acción -->
            <div class="acciones">
              <button class="carrito">Agregar al arcón 🧺</button>
            </div>
          </div>
        </div>
      `;

      // 🧱 Insertar producto en el DOM
      contenedor.insertAdjacentHTML("beforeend", productoHTML);

      // Obtener la última tarjeta insertada
      const nuevaCard = contenedor.lastElementChild;
      if (!nuevaCard) return;

      // Activar animación ceremonial de entrada
      nuevaCard.classList.add("visible");

      // Estado de selección individual (local a esta card)
      let seleccion = {
        color: null,
        talle: null,
        cantidad: 1,
      };

      // Elementos de la card (comprobaciones defensivas)
      const btnsColor = nuevaCard.querySelectorAll(".color-btn");
      const btnsTalle = nuevaCard.querySelectorAll(".talle-btn");
      const btnMas = nuevaCard.querySelector(".mas");
      const btnMenos = nuevaCard.querySelector(".menos");
      const spanCantidad = nuevaCard.querySelector(".valor-cantidad");
      const botonCarrito = nuevaCard.querySelector(".carrito");

      // Inicializar cantidad visible
      if (spanCantidad) spanCantidad.innerText = String(seleccion.cantidad);

      // Manejo de selección de color
      btnsColor.forEach((b) =>
        b.addEventListener("click", () => {
          btnsColor.forEach((x) => x.classList.remove("activo"));
          b.classList.add("activo");
          seleccion.color = b.dataset.color || null;
          botonCarrito &&
            (botonCarrito.disabled = !(seleccion.color && seleccion.talle));
        })
      );

      // Manejo de selección de talle
      btnsTalle.forEach((b) =>
        b.addEventListener("click", () => {
          btnsTalle.forEach((x) => x.classList.remove("activo"));
          b.classList.add("activo");
          seleccion.talle = b.dataset.size || null;
          botonCarrito &&
            (botonCarrito.disabled = !(seleccion.color && seleccion.talle));
        })
      );

      // Manejo de cantidad
      btnMas &&
        btnMas.addEventListener("click", () => {
          seleccion.cantidad = (seleccion.cantidad || 1) + 1;
          if (spanCantidad) spanCantidad.innerText = String(seleccion.cantidad);
        });
      btnMenos &&
        btnMenos.addEventListener("click", () => {
          if ((seleccion.cantidad || 1) > 1) seleccion.cantidad -= 1;
          if (spanCantidad) spanCantidad.innerText = String(seleccion.cantidad);
        });

      // Botón agregar al arcón (usa el estado local)
      botonCarrito &&
        botonCarrito.addEventListener("click", () => {
          if (!seleccion.color || !seleccion.talle) {
            if (typeof mostrarNotificacion === "function")
              mostrarNotificacion("⚠️ Elegí color y talle antes de agregar");
            return;
          }
          const idProducto = nuevaCard.dataset.id || null;
          const variante = `${seleccion.color}-${seleccion.talle}`;
          const cantidad = seleccion.cantidad || 1;
          if (typeof mostrarNotificacion === "function")
            mostrarNotificacion(
              `🧺 ${cantidad}x ${variante} agregado al arcón`
            );
          // lógica para agregar al localStorage / actualizar contador...
        });
      // 🔍 Elementos clave para stock y control del botón
      const stockInfo = nuevaCard.querySelector(".stock-info");
      // función para actualizar el display de stock y estado del botón
      function actualizarStock() {
        const clave = `${seleccion.talle}-${seleccion.color}`;
        const stock = variantesAgrupadas[clave];

        if (!seleccion.color || !seleccion.talle) {
          if (stockInfo) stockInfo.textContent = "Seleccioná color y talle";
          if (botonCarrito) botonCarrito.disabled = true;
        } else if (stock === 0 || stock === undefined) {
          if (stockInfo) stockInfo.textContent = "Esta variante está agotada";
          if (botonCarrito) botonCarrito.disabled = true;
        } else {
          if (stockInfo) stockInfo.textContent = `Stock disponible: ${stock} unidades`;
          if (botonCarrito) botonCarrito.disabled = false;
        }
      }

      // Asegurar que la selección actual se refleje en el stock al inicio
      actualizarStock();

      // Llamar actualizarStock desde los handlers de color/talle ya definidos arriba
    });

    actualizarContador();
  })
  .catch((err) => {
    console.error("Error al cargar productos:", err);
  });

// 🧺 Mostrar contenido del arcón como panel editable
const verArconBtnInit = document.getElementById("ver-arcon");
if (verArconBtnInit)
  verArconBtnInit.addEventListener("click", () => {
    const panel = document.getElementById("arcon-lateral");
    const contenido = document.getElementById("contenido-arcon");
    const totalTexto = document.getElementById("total-arcon");

    if (arcon.length === 0) {
      alert("🧺 El arcón está vacío.");
      return;
    }

    //limpieza
    contenido.innerHTML = "";
    let total = 0;

    //Renderiza productos
    arcon.forEach((item, index) => {
      const subtotal = item.precio * item.cantidad;
      total += subtotal;

      const div = document.createElement("div");
      div.className = "item-arcon";
      div.innerHTML = `
      <span>${item.nombre} - ${item.color} ${item.talle}</span>
      <button class="cantidad-btn" data-index="${index}" data-dir="menos">−</button>
      <span>${item.cantidad}</span>
      <button class="cantidad-btn" data-index="${index}" data-dir="mas">+</button>
      <span>→ $${subtotal}</span>
      <button class="eliminar-btn" data-index="${index}">🗑️</button>
    `;
      contenido.appendChild(div);
    });

    totalTexto.textContent = `💰 Total: $${total}`;

    //Mostrar panel de animacion
    panel.classList.remove("oculto");
    setTimeout(() => panel.classList.add("visible"), 10);

    //Cerrar carrito
    const cerrarBtn = document.getElementById("cerrar-arcon");
    if (cerrarBtn)
      cerrarBtn.addEventListener("click", () => {
        const panel = document.getElementById("arcon-lateral");
        panel.classList.remove("visible");
        setTimeout(() => panel.classList.add("oculto"), 400);
      });
  });

// 🧠 Evento: modificar cantidad desde el panel
document.addEventListener("click", (e) => {
  //Modifica cantidad
  if (e.target.classList.contains("cantidad-btn")) {
    const index = parseInt(e.target.dataset.index);
    const dir = e.target.dataset.dir;

    if (dir === "mas") arcon[index].cantidad++;
    if (dir === "menos" && arcon[index].cantidad > 1) arcon[index].cantidad--;

    localStorage.setItem("arcon", JSON.stringify(arcon));
    actualizarContador();
    const verBtn = document.getElementById("ver-arcon");
    if (verBtn) verBtn.click(); // recarga el panel de forma segura
  }

  //Eliminar producto
  if (e.target?.classList?.contains("eliminar-btn")) {
    const index = parseInt(e.target.dataset.index);
    const itemDiv = e.target.closest(".item-arcon");

    itemDiv.classList.add("eliminando");

    setTimeout(() => {
      arcon.splice(index, 1);
      localStorage.setItem("arcon", JSON.stringify(arcon));
      actualizarContador();
      const verBtn2 = document.getElementById("ver-arcon");
      if (verBtn2) verBtn2.click();
    }, 400); // coincide con el tiempo del CSS
  }
});

const arconLateral = document.getElementById("arcon-lateral");

// 🎯 Abrir / Cerrar arcón (funciones reutilizables)
function openCart() {
  if (!arconLateral) return;
  arconLateral.classList.remove("oculto");
  setTimeout(() => arconLateral.classList.add("visible"), 10);
}

function closeCart() {
  if (!arconLateral) return;
  arconLateral.classList.remove("visible");
  setTimeout(() => arconLateral.classList.add("oculto"), 400);
}

const verArconBtnOpen = document.getElementById("ver-arcon");
if (verArconBtnOpen) verArconBtnOpen.addEventListener("click", openCart);
const cerrarArconBtn = document.getElementById("cerrar-arcon");
if (cerrarArconBtn) cerrarArconBtn.addEventListener("click", closeCart);

// 🧹 Vaciar arcón
const vaciarBtn = document.getElementById("vaciar-arcon");
if (vaciarBtn)
  vaciarBtn.addEventListener("click", () => {
    if (arcon.length === 0) {
      alert("🧺 El arcón ya está vacío.");
      return;
    }

    if (confirm("¿Estás seguro de que querés vaciar el arcón?")) {
      arcon = [];
      localStorage.setItem("arcon", JSON.stringify(arcon));
      actualizarContador();
      const verBtn3 = document.getElementById("ver-arcon");
      if (verBtn3) verBtn3.click();
    }
  });

// 🎯 Actualizar contador y animar botón
function actualizarContador() {
  const botonArcon = document.getElementById("ver-arcon");
  const contador = document.getElementById("contador-arcon");
  if (!contador) return; // Evita errores si aún no existe

  if (!botonArcon) return;

  // 🔢 Calcular total de unidades en el arcón
  const totalUnidades = arcon.reduce((acc, item) => acc + item.cantidad, 0);
  contador.textContent = totalUnidades;

  // ✨ Activar animación ceremonial en el botón
  botonArcon.classList.add("rebote");
  setTimeout(() => botonArcon.classList.remove("rebote"), 400);
}

// 🧺 Función de notificación ceremonial
function mostrarNotificacion(mensaje) {
  const noti = document.getElementById("notificacion");
  if (!noti) return;
  noti.textContent = mensaje;
  noti.classList.remove("oculto");
  noti.classList.add("visible");

  setTimeout(() => {
    noti.classList.remove("visible");
    setTimeout(() => {
      noti.classList.add("oculto");
    }, 400);
  }, 2000);
}

//logica de stock y botones
document.addEventListener("DOMContentLoaded", () => {
  if (typeof stock === "undefined") return;

  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";

  for (const p of stock) {
    const coloresUnicos = [...new Set(p.variantes.map(v => v.color))];
    const tallesUnicos = [...new Set(p.variantes.map(v => v.talle))];

    const productoHTML = `
      <div class="card fade-in" data-id="${p._id}">
        <img src="${p.image}" alt="${p.name}" />
        <h3>${p.name}</h3>
        <p><strong>Estilo:</strong> ${p.style}</p>
        <p><strong>Precio:</strong> $${p.price}</p>
        <p><strong>Descripción:</strong> ${p.description}</p>

        <div class="selector-producto">
          <div class="colores">
            <p><strong>Color:</strong></p>
            ${coloresUnicos.map(color => `
              <button class="color-btn" data-color="${color}" title="${color}" 
                style="background-color: ${(typeof mapaColores !== 'undefined' && mapaColores[color]) ? mapaColores[color] : color.toLowerCase()}">
              </button>
            `).join("")}
          </div>

          <div class="talles">
            <p><strong>Talle:</strong></p>
            ${tallesUnicos.map(size => `
              <button class="talle-btn" data-size="${size}">${size}</button>
            `).join("")}
          </div>

          <div class="cantidad">
            <p><strong>Cantidad:</strong></p>
            <button class="menos">−</button>
            <span class="valor-cantidad">1</span>
            <button class="mas">+</button>
          </div>

          <div class="stock-info"></div>

          <div class="acciones">
            <button class="carrito" disabled>Agregar al arcón 🧺</button>
          </div>
        </div>
      </div>
    `;

    contenedor.insertAdjacentHTML("beforeend", productoHTML);
  }

  inicializarContadorArcon();
});

// 🧙‍♂️ Delegación de eventos
document.getElementById("productos").addEventListener("click", (e) => {
  const btn = e.target;
  const card = btn.closest(".card");
  if (!card) return;

  const seleccion = {
    color: card.querySelector(".color-btn.activo")?.dataset.color || null,
    talle: card.querySelector(".talle-btn.activo")?.dataset.size || null,
    cantidad: parseInt(card.querySelector(".valor-cantidad")?.innerText || "1", 10),
    id: card.dataset.id
  };

  // Color
  if (btn.matches(".color-btn")) {
    card.querySelectorAll(".color-btn").forEach(b => b.classList.remove("activo"));
    btn.classList.add("activo");
    actualizarBoton(card);
    return;
  }

  // Talle
  if (btn.matches(".talle-btn")) {
    card.querySelectorAll(".talle-btn").forEach(b => b.classList.remove("activo"));
    btn.classList.add("activo");
    actualizarBoton(card);
    return;
  }

  // Cantidad
  if (btn.matches(".mas") || btn.matches(".menos")) {
    const span = card.querySelector(".valor-cantidad");
    let v = parseInt(span.innerText, 10);
    if (btn.matches(".mas")) v += 1;
    else if (v > 1) v -= 1;
    span.innerText = v;
    return;
  }

  // Agregar al arcón
  if (btn.matches(".carrito")) {
    if (!seleccion.color || !seleccion.talle) {
      mostrarNotificacion("⚠️ Elegí color y talle antes de agregar");
      return;
    }
    const variante = `${seleccion.color}-${seleccion.talle}`;
    addToCart(seleccion.id, variante, seleccion.cantidad);
  }
});

// 🧭 Activar botón si hay selección
function actualizarBoton(card) {
  const color = card.querySelector(".color-btn.activo");
  const talle = card.querySelector(".talle-btn.activo");
  const boton = card.querySelector(".carrito");
  boton.disabled = !(color && talle);
}

// 🧺 Agregar al arcón
function addToCart(id, variante, cantidad) {
  const key = "excalybur_arcon";
  const arcon = JSON.parse(localStorage.getItem(key) || "[]");
  const idx = arcon.findIndex(item => item.id === id && item.variante === variante);

  if (idx >= 0) {
    arcon[idx].cantidad += cantidad;
  } else {
    arcon.push({ id, variante, cantidad });
  }

  localStorage.setItem(key, JSON.stringify(arcon));
  inicializarContadorArcon();
  mostrarNotificacion(`🧺 ${cantidad}x ${variante} agregado al arcón`);
}

// 🔢 Contador
function inicializarContadorArcon() {
  const contador = document.getElementById("contador-arcon");
  const arcon = JSON.parse(localStorage.getItem("excalybur_arcon") || "[]");
  const total = arcon.reduce((s, item) => s + (item.cantidad || 0), 0);
  contador.innerText = total;
}

// 🧾 Renderizar arcón
function renderCart() {
  const arcon = JSON.parse(localStorage.getItem("excalybur_arcon") || "[]");
  const contenedor = document.getElementById("contenido-arcon");
  const totalTexto = document.getElementById("total-arcon");
  contenedor.innerHTML = "";
  let total = 0;

  arcon.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("item-arcon");
    div.innerText = `${item.cantidad}x ${item.variante}`;
    contenedor.appendChild(div);
    const producto = stock.find(p => p._id === item.id);
    if (producto) total += producto.price * item.cantidad;
  });

  totalTexto.innerText = `💰Total: $${total}`;
}

// 🧹 Vaciar arcón
document.getElementById("vaciar-arcon")?.addEventListener("click", () => {
  localStorage.removeItem("excalybur_arcon");
  renderCart();
  inicializarContadorArcon();
  mostrarNotificacion("🧺 Arcón vaciado");
});

// 🧺 Abrir arcón
document.getElementById("ver-arcon")?.addEventListener("click", () => {
  document.getElementById("arcon-lateral")?.classList.remove("oculto");
  renderCart();
});

document.getElementById("cerrar-arcon")?.addEventListener("click", () => {
  document.getElementById("arcon-lateral")?.classList.add("oculto");
});

// ✨ Notificación flotante
function mostrarNotificacion(mensaje) {
  const noti = document.getElementById("notificacion");
  if (!noti) return;
  noti.innerText = mensaje;
  noti.classList.remove("oculto");
  noti.classList.add("visible");

  setTimeout(() => {
    noti.classList.remove("visible");
    noti.classList.add("oculto");
  }, 2500);
}

botonAgregar.style.display = "none";
selectorTalle.addEventListener("change", () => {
  botonAgregar.style.display = "inline-block";
});

// 🎯 Evento de prueba
const agregarProdBtn = document.getElementById("agregar-producto");
if (agregarProdBtn)
  agregarProdBtn.addEventListener("click", () => {
    mostrarNotificacion("🧺 Producto agregado al arcón");
  });

console.log(
  "stock ceremonial:",
  typeof stock !== "undefined" ? stock : "no definido"
);
