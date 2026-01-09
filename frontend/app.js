document.addEventListener("DOMContentLoaded", () => {

    let votos = {
        excelente: 0,
        bueno: 0,
        regular: 0,
        malo: 0
    };

    const formEncuesta = document.getElementById("formEncuesta");
    const btnVotar = document.getElementById("btnVotar");
    const btnNuevaEncuesta = document.getElementById("btnNuevaEncuesta");
    const btnReiniciarVotos = document.getElementById("btnReiniciarVotos");

    const barras = {
        excelente: document.querySelector(".progreso.excelente"),
        bueno: document.querySelector(".progreso.bueno"),
        regular: document.querySelector(".progreso.regular"),
        malo: document.querySelector(".progreso.malo")
    };

    actualizarBarras();

    // CREAR NUEVA ENCUESTA
    btnNuevaEncuesta.addEventListener("click", () => {

        const preguntas = [
            document.getElementById("preg1").value,
            document.getElementById("preg2").value,
            document.getElementById("preg3").value
        ];

        if (preguntas.some(p => p.trim() === "")) {
            alert("Debes escribir todas las preguntas");
            return;
        }

        // Limpiar SOLO preguntas, no el botón
        const botonVotar = btnVotar;
        formEncuesta.innerHTML = "";
        formEncuesta.appendChild(botonVotar);

        preguntas.forEach((texto, index) => {
            const bloque = document.createElement("div");
            bloque.innerHTML = `
                <h4>${texto}</h4>
                <label><input type="radio" name="opinion${index}" value="excelente"> Excelente</label>
                <label><input type="radio" name="opinion${index}" value="bueno"> Bueno</label>
                <label><input type="radio" name="opinion${index}" value="regular"> Regular</label>
                <label><input type="radio" name="opinion${index}" value="malo"> Malo</label>
            `;
            formEncuesta.insertBefore(bloque, botonVotar);
        });

        reiniciarVotos();
    });

    // VOTAR
    btnVotar.addEventListener("click", () => {

        const seleccionados = document.querySelectorAll("input[type='radio']:checked");

        if (seleccionados.length === 0) {
            alert("Debes seleccionar al menos una opción");
            return;
        }

        seleccionados.forEach(radio => {
            votos[radio.value]++;
        });

        actualizarBarras();
        limpiarFormulario();
    });

    // REINICIAR VOTOS
    btnReiniciarVotos.addEventListener("click", () => {
        reiniciarVotos();
    });

    function reiniciarVotos() {
        votos = {
            excelente: 0,
            bueno: 0,
            regular: 0,
            malo: 0
        };
        actualizarBarras();
        limpiarFormulario();
    }

    function actualizarBarras() {
        const total = Object.values(votos).reduce((a, b) => a + b, 0);

        for (let opcion in votos) {
            const porcentaje = total === 0 ? 0 : Math.round((votos[opcion] / total) * 100);
            barras[opcion].style.width = porcentaje + "%";
            barras[opcion].textContent = porcentaje + "%";
        }
    }

    function limpiarFormulario() {
        document.querySelectorAll("input[type='radio']")
            .forEach(r => r.checked = false);
    }

});
