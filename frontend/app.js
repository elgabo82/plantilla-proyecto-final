const API = "http://localhost:8080/api/v1/productos";

const tbody = document.getElementById("tbody");
const form = document.getElementById("taskForm"); 
const msg = document.getElementById("msg");


const productId = document.getElementById("taskId"); 
const nombre = document.getElementById("title");
const precio = document.getElementById("description"); 
const cantidad = document.getElementById("status"); 
const formTitle = document.getElementById("formTitle");

document.getElementById("reloadBtn").addEventListener("click", loadProducts);
document.getElementById("cancelBtn").addEventListener("click", resetForm);

function setMsg(text, isError = false) {
    msg.textContent = text;
    msg.style.color = isError ? "#fca5a5" : "#86efac";
}

async function http(url, options = {}) {
    const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...options
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.message || `Error HTTP ${res.status}`);
    return data;
}

async function loadProducts() {
    setMsg("");
    tbody.innerHTML = `<tr><td colspan="5" class="muted">Cargando inventario...</td></tr>`;

    try {
        const items = await http(API);
        if (!items || !items.length) {
            tbody.innerHTML = `<tr><td colspan="5" class="muted">No hay productos en bodega</td></tr>`;
            return;
        }
        tbody.innerHTML = items.map(row => `
            <tr>
                <td>${row.id}</td>
                <td>${escapeHtml(row.nombre)}</td>
                <td>$${row.precio}</td>
                <td>${row.cantidad} unidades</td>
                <td>
                    <button class="btn secondary" onclick="editProduct(${row.id})">Editar</button>
                    <button class="btn danger" onclick="deleteProduct(${row.id})">Eliminar</button>
                </td>
            </tr>
        `).join("");
    } catch (e) {
        tbody.innerHTML = `<tr><td colspan="5" class="muted">Error al conectar con el servidor</td></tr>`;
        setMsg(e.message, true);
    }
}

window.editProduct = async function (id) {
    setMsg("");
    try {
        const item = await http(`${API}/${id}`);
        productId.value = item.id;
        nombre.value = item.nombre;
        precio.value = item.precio;
        cantidad.value = item.cantidad;
        formTitle.textContent = `Editar Producto #${item.id}`;
    } catch (e) {
        setMsg(e.message, true);
    }
};

window.deleteProduct = async function (id) {
    if (!confirm(`¿Eliminar producto #${id} del inventario?`)) return;
    try {
        await http(`${API}/${id}`, { method: "DELETE" });
        setMsg("Producto eliminado");
        await loadProducts();
        resetForm();
    } catch (e) {
        setMsg(e.message, true);
    }
};

form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const payload = {
        nombre: nombre.value.trim(),
        precio: parseFloat(precio.value),
        cantidad: parseInt(cantidad.value)
    };

    try {
        if (productId.value) {
            await http(`${API}/${productId.value}`, {
                method: "PUT",
                body: JSON.stringify(payload)
            });
            setMsg("Producto actualizado");
        } else {
            await http(API, { method: "POST", body: JSON.stringify(payload) });
            setMsg("Producto agregado a bodega");
        }
        resetForm();
        await loadProducts();
    } catch (e) {
        setMsg(e.message, true);
    }
});

function resetForm() {
    productId.value = "";
    nombre.value = "";
    precio.value = "";
    cantidad.value = "0";
    formTitle.textContent = "Nuevo Producto";
}

function escapeHtml(str) {
    return String(str).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

loadProducts();