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
                    (typeof mapaColores !== 'undefined' && mapaColores[color]) ? mapaColores[color] : color.toLowerCase()
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

      // 🧙‍♂️ Obtener la última tarjeta insertada (más simple)
      const nuevaCard = contenedor.lastElementChild;

      // 🎭 Activar animación ceremonial de entrada
      nuevaCard.classList.add("visible");

      // 🧭 Estado de selección individual
      let seleccion = {
        color: null,
        talle: null,
        cantidad: 1,
      };

      // 🔍 Elementos clave
      const stockInfo = nuevaCard.querySelector(".stock-info");
      const btnCarrito = nuevaCard.querySelector(".carrito");

      // 🔄 Actualizar stock según selección
      function actualizarStock() {
        const clave = `${seleccion.talle}-${seleccion.color}`;
        const stock = variantesAgrupadas[clave];

        if (!seleccion.color || !seleccion.talle) {
          stockInfo.textContent = "Seleccioná color y talle";
          btnCarrito.disabled = true;
        } else if (stock === 0 || stock === undefined) {
          stockInfo.textContent = "Esta variante está agotada";
          btnCarrito.disabled = true;
        } else {
          stockInfo.textContent = `Stock disponible: ${stock} unidades`;
          btnCarrito.disabled = false;
        }
      }

      // 🎨 Evento: selección de color
      nuevaCard.querySelectorAll(".color-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          seleccion.color = btn.dataset.color;
          nuevaCard
            .querySelectorAll(".color-btn")
            .forEach((b) => b.classList.remove("activo"));
          btn.classList.add("activo");
          actualizarStock();
        });
      });

      // 📏 Evento: selección de talle
      nuevaCard.querySelectorAll(".talle-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          seleccion.talle = btn.dataset.size;
          nuevaCard
            .querySelectorAll(".talle-btn")
            .forEach((b) => b.classList.remove("activo"));
          btn.classList.add("activo");
          actualizarStock();
        });
      });

      // 🔢 Evento: modificar cantidad
      nuevaCard.querySelector(".menos").addEventListener("click", () => {
        if (seleccion.cantidad > 1) {
          seleccion.cantidad--;
          nuevaCard.querySelector(".valor-cantidad").textContent =
            seleccion.cantidad;
        }
      });

      nuevaCard.querySelector(".mas").addEventListener("click", () => {
        seleccion.cantidad++;
        nuevaCard.querySelector(".valor-cantidad").textContent =
          seleccion.cantidad;
      });

      // 🧺 Evento: agregar al arcón
      btnCarrito.addEventListener("click", () => {
        if (!seleccion.color || !seleccion.talle) {
          alert("⚠️ Por favor seleccioná color y talle antes de continuar.");
          return;
        }

        // 🧺 Crear objeto de producto seleccionado
        const productoSeleccionado = {
          id: p._id,
          nombre: p.name,
          color: seleccion.color,
          talle: seleccion.talle,
          cantidad: seleccion.cantidad,
          precio: p.price,
          subtotal: p.price * seleccion.cantidad,
        };

        // 🧠 Guardar en el arcón
        const existente = arcon.find(
          (item) =>
            item.id === productoSeleccionado.id &&
            item.color === productoSeleccionado.color &&
            item.talle === productoSeleccionado.talle
        );

        if (existente) {
          existente.cantidad += productoSeleccionado.cantidad;
          existente.subtotal = existente.precio * existente.cantidad;
        } else {
          arcon.push(productoSeleccionado);
        }
        localStorage.setItem("arcon", JSON.stringify(arcon));
        actualizarContador();

        // 🧾 Confirmación ceremonial
        mostrarNotificacion(`🧺 Se agregó: ${p.name} (${seleccion.color}, ${seleccion.talle}) x${seleccion.cantidad}`);
      });
    });

    actualizarContador();
  })
  .catch((err) => {
    console.error("Error al cargar productos:", err);
  });

// 🧺 Mostrar contenido del arcón como panel editable
const verArconBtnInit = document.getElementById("ver-arcon");
if (verArconBtnInit) verArconBtnInit.addEventListener("click", () => {
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
  panel.classList.remove('oculto');
  setTimeout(() => panel.classList.add('visible'), 10);

  //Cerrar carrito
  const cerrarBtn = document.getElementById('cerrar-arcon');
  if (cerrarBtn) cerrarBtn.addEventListener('click', () => {
    const panel = document.getElementById('arcon-lateral');
    panel.classList.remove('visible');
    setTimeout(() => panel.classList.add('oculto'), 400);
  })
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
  arconLateral.classList.remove('oculto');
  setTimeout(() => arconLateral.classList.add('visible'), 10);
}

function closeCart() {
  if (!arconLateral) return;
  arconLateral.classList.remove('visible');
  setTimeout(() => arconLateral.classList.add('oculto'), 400);
}

const verArconBtnOpen = document.getElementById("ver-arcon");
if (verArconBtnOpen) verArconBtnOpen.addEventListener("click", openCart);
const cerrarArconBtn = document.getElementById("cerrar-arcon");
if (cerrarArconBtn) cerrarArconBtn.addEventListener("click", closeCart);

// 🧹 Vaciar arcón
const vaciarBtn = document.getElementById("vaciar-arcon");
if (vaciarBtn) vaciarBtn.addEventListener("click", () => {
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
  if (typeof stock === 'undefined') return;
  for (const producto in stock){
    for (const variante in stock[producto]){
      const cantidad = stock[producto][variante];
      const idBoton = `${producto}-${variante}`;
      const boton = document.getElementById(idBoton);

      if (boton) {
        if (cantidad === 0) {
          boton.disabled = true;
          boton.classList.add("agotado");
        } else {
          const info = document.createElement("span");
          info.className = "disponible";
          info.innerText = `Disponible: ${cantidad}`;
          boton.parentElement.appendChild(info);
        }
      }
    }
  }
})

// 🎯 Evento de prueba
const agregarProdBtn = document.getElementById("agregar-producto");
if (agregarProdBtn) agregarProdBtn.addEventListener("click", () => {
  mostrarNotificacion("🧺 Producto agregado al arcón");
});

console.log("stock ceremonial:", typeof stock !== 'undefined' ? stock : 'no definido');