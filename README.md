# Excalybur - Frontend

Este README explica cómo poner en marcha el frontend y las dependencias mínimas, y documenta los cambios realizados en `public/script.js` e `public/index.html`.

## Requisitos
- Node.js (>=14)
- npm o yarn
- MongoDB corriendo localmente (o remoto)
- Git

## Estructura relevante
- `public/`
  - `index.html` — página principal
  - `script.js` — lógica del catálogo y carrito (refactorizado)
  - `colores.js` — mapa de colores (opcional pero recomendado)
  - `stock.js` — datos de stock (opcional)
  - `animaciones.js` — observador de intersección (UI)

## Notas sobre el backend
El frontend espera un backend en `http://localhost:3000/products` que devuelva un array de productos con estructura aproximada:

```json
[
  {
    "_id": "string",
    "name": "string",
    "image": "ruta/imagen.jpg",
    "style": "string",
    "price": 100,
    "description": "string",
    "variants": [
      { "size": "S", "color": "negro", "stock": 5 },
      { "size": "M", "color": "blanco", "stock": 2 }
    ]
  }
]
```

El backend de este proyecto se encuentra en la carpeta `excalybur-backend/` (si existe). Para arrancarlo:

```powershell
# desde la carpeta excalybur-backend
npm install
node server.js
```

Asegúrate de tener MongoDB corriendo (por ejemplo con `mongod` o el servicio de sistema).

## Cómo servir el frontend (modo desarrollo)
Puedes servir la carpeta `public` con cualquier servidor estático. Un modo rápido con Node:

```powershell
# en excalybur-frontend
npx serve ./public -l 5000
# o usar http-server
npx http-server ./public -p 5000
```

Abrir `http://localhost:5000` en el navegador.

## Cambios realizados (resumen técnico)
- `public/index.html`
  - Reordené los `<script>` para cargar primero `colores.js` y `stock.js` y luego `script.js` (todos con `defer`). Esto evita `ReferenceError` si `script.js` usa variables definidas en esos archivos.

- `public/script.js` (refactor principal):
  - Protecciones defensivas: comprueba existencia de elementos DOM antes de añadir listeners.
  - Protege acceso a variables externas: `mapaColores` y `stock` sólo se usan si están definidas.
  - Mejora en la creación de tarjetas: uso `lastElementChild` y `data-id` ahora guarda `p._id`.
  - Extraje funciones `openCart()` y `closeCart()` para manejo del panel lateral.
  - Arreglé interpolaciones en plantillas y otros pequeños problemas que provocaban crashes cuando faltaban elementos.

## Pruebas recomendadas
1. Levantar backend (ver sección "Notas sobre el backend").
2. Servir frontend (ver sección "Cómo servir el frontend").
3. Abrir la página y comprobar la consola del navegador: no debería haber errores.
4. Interactuar con el catálogo: seleccionar color/talle, agregar al arcón, abrir el panel, modificar cantidades.

## Git / GitHub
- He realizado cambios en `public/index.html` y `public/script.js`.
- Si quieres que haga commit y push en tu repo remotos, puedo ejecutar los comandos `git add`/`commit`/`push` en tu entorno local (necesitarás confirmar y tener credenciales configuradas).

---

Si quieres, hago ahora:
- Un commit local con mensaje claro de los cambios.
- Subir (push) a la rama `main` (necesitarás confirmarme para ejecutar y hacer push).
- Crear un `CHANGELOG.md` más formal.
