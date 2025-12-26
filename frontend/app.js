const tbody = document.querySelector("#tbody");
const frm = document.querySelector("#frm");
const fMateria = document.querySelector("#fMateria");
const fEstado = document.querySelector("#fEstado");

async function load() {
  const qs = new URLSearchParams();
  if (fMateria.value.trim()) qs.set("materia", fMateria.value.trim());
  if (fEstado.value) qs.set("estado", fEstado.value);

  const res = await fetch("/api/tareas?" + qs.toString());
  const data = await res.json();

  tbody.innerHTML = data.map(t => `
    <tr>
      <td>${t.id}</td>
      <td>${escapeHtml(t.materia)}</td>
      <td>${escapeHtml(t.titulo)}</td>
      <td>
        <select data-id="${t.id}" class="estado">
          <option ${t.estado==="PENDIENTE"?"selected":""}>PENDIENTE</option>
          <option ${t.estado==="HECHA"?"selected":""}>HECHA</option>
        </select>
      </td>
      <td>
        <button data-del="${t.id}">Eliminar</button>
      </td>
    </tr>
  `).join("");

  document.querySelectorAll(".estado").forEach(sel => {
    sel.addEventListener("change", async (e) => {
      const id = e.target.dataset.id;
      const estado = e.target.value;
      const row = data.find(x => x.id == id);
      await fetch("/api/tareas/" + id, {
        method: "PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ ...row, estado })
      });
      load();
    });
  });

  document.querySelectorAll("button[data-del]").forEach(btn => {
    btn.addEventListener("click", async () => {
      await fetch("/api/tareas/" + btn.dataset.del, { method: "DELETE" });
      load();
    });
  });
}

frm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const materia = document.querySelector("#materia").value;
  const titulo = document.querySelector("#titulo").value;
  const descripcion = document.querySelector("#descripcion").value;

  await fetch("/api/tareas", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ materia, titulo, descripcion })
  });
  frm.reset();
  load();
});

document.querySelector("#btnFiltrar").addEventListener("click", load);
document.querySelector("#btnReset").addEventListener("click", () => {
  fMateria.value = "";
  fEstado.value = "";
  load();
});

function escapeHtml(s) {
  return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
}

load();
