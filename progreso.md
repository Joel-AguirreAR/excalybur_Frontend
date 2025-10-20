# 📜 Progreso del proyecto — Excalybur

Este archivo documenta el avance técnico y simbólico del catálogo ceremonial Excalybur.

---

## 🧱 Etapa 1 — Fundación del Catálogo ✅

- Generación dinámica de cards por producto
- Separación de variantes por color y talle
- Diseño modular con `stock.js` como fuente
- Estructura limpia con `.card`, `.selector-producto`, `.acciones`

---

## 🧱 Etapa 2 — Ritual de Interacción ✅

- Delegación de eventos eficiente
- Selección de variantes con estado local
- Botón “Agregar al arcón” con validación
- Persistencia en `localStorage` con contador sincronizado
- Panel lateral animado como cofre ritual
- Vaciar arcón con renderizado ceremonial
- Notificación flotante con estilo Cinzel

---

## 🧱 Etapa 3 — Ceremonia de Movimiento 🔄

### Gestos completados:

- Animación en `.card:hover` con elevación dorada
- Botones `.mas` y `.menos` como engranajes rituales
- `.stock-info` con estados visuales: disponible, agotado, pendiente
- Resumen flotante del arcón al hacer hover
- Badge ceremonial al vaciar el arcón: “Arcón purificado 🧺”

### Próximos gestos:

- Transición suave en contador del arcón
- Animación de entrada para `.notificacion`
- Escalado sutil en `.card.visible`
- Commit final de Etapa 3

---

## 🧵 Tecnologías

- HTML, CSS (con animaciones y transiciones suaves)
- JavaScript modular (delegación, persistencia, eventos)
- Tipografía Cinzel para estética medieval
- Git + GitHub como sistema ceremonial de seguimiento

---

## 🧺 Protocolo de commits

Cada avance se registra con:

- `git add .`
- `git commit -m "✨ Etapa X — descripción ritual"`

Ejemplo reciente:

```bash
git commit -m "✨ Etapa 3 — animaciones, stock ceremonial y badge ritual completados"