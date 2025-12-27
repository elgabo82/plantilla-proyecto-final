

//const API = "/api/v1/tasks";

//const API = "http://localhost:8080/api/v1/tasks";
const API = `http://${location.hostname}:8080/api/v1/tasks`;


const tbody = document.getElementById("tbody");
const form = document.getElementById("taskForm");
const msg = document.getElementById("msg");

const taskId = document.getElementById("taskId");
const title = document.getElementById("title");
const description = document.getElementById("description");
const statusEl = document.getElementById("status");
const formTitle = document.getElementById("formTitle");

document.getElementById("reloadBtn").addEventListener("click", loadTasks);
document.getElementById("cancelBtn").addEventListener("click", resetForm);

function setMsg(text, isError = false) {
  msg.textContent = text;
  msg.style.color = isError ? "#fca5a5" : "#86efac";
  if (!text) msg.style.color = "";
}

async function http(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data?.message || `Error HTTP ${res.status}`;
    throw new Error(message);
  }
  return data;
}

async function loadTasks() {
  setMsg("");
  tbody.innerHTML = `<tr><td colspan="4" class="muted">Cargando...</td></tr>`;

  try {
    const items = await http(API);
    if (!items.length) {
      tbody.innerHTML = `<tr><td colspan="4" class="muted">Sin registros</td></tr>`;
      return;
    }
    tbody.innerHTML = items.map(row => `
      <tr>
        <td>${row.id}</td>
        <td>${escapeHtml(row.title)}</td>
        <td><span class="muted">${row.status}</span></td>
        <td>
          <button class="btn secondary" onclick="editTask(${row.id})">Editar</button>
          <button class="btn danger" onclick="deleteTask(${row.id})">Eliminar</button>
        </td>
      </tr>
    `).join("");
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="4" class="muted">Error al cargar</td></tr>`;
    setMsg(e.message, true);
  }
}

window.editTask = async function (id) {
  setMsg("");
  try {
    const item = await http(`${API}/${id}`);
    taskId.value = item.id;
    title.value = item.title;
    description.value = item.description || "";
    statusEl.value = item.status;
    formTitle.textContent = `Editar tarea #${item.id}`;
  } catch (e) {
    setMsg(e.message, true);
  }
};

window.deleteTask = async function (id) {
  if (!confirm(`¿Eliminar tarea #${id}?`)) return;
  setMsg("");
  try {
    await http(`${API}/${id}`, { method: "DELETE" });
    setMsg("Eliminado correctamente");
    await loadTasks();
    resetForm();
  } catch (e) {
    setMsg(e.message, true);
  }
};

form.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  setMsg("");

  const payload = {
    title: title.value.trim(),
    description: description.value.trim() || null,
    status: statusEl.value
  };

  try {
    if (!payload.title || payload.title.length < 3) {
      setMsg("Título mínimo 3 caracteres", true);
      return;
    }

    if (taskId.value) {
      await http(`${API}/${taskId.value}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      setMsg("Actualizado correctamente");
    } else {
      await http(API, { method: "POST", body: JSON.stringify(payload) });
      setMsg("Creado correctamente");
    }

    resetForm();
    await loadTasks();
  } catch (e) {
    setMsg(e.message, true);
  }
});

function resetForm() {
  taskId.value = "";
  title.value = "";
  description.value = "";
  statusEl.value = "PENDIENTE";
  formTitle.textContent = "Nueva tarea";
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// init
loadTasks();
