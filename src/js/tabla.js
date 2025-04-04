export function agregarFila() {
  let tabla = document
    .getElementById("tableXY2")
    .getElementsByTagName("tbody")[0];
  let nuevaFila = document.createElement("tr");

  // Crear las celdas con inputs
  for (let i = 0; i < 5; i++) {
    let celda = document.createElement("td");
    let input = document.createElement("input");
    input.type = "text";
    input.className = "form-control";
    celda.appendChild(input);
    nuevaFila.appendChild(celda);
  }

  // Celda de botón eliminar
  let celdaAccion = document.createElement("td");
  let botonEliminar = document.createElement("button");
  botonEliminar.className = "btn btn-danger btn-sm btn-remove-fila";
  botonEliminar.innerText = "❌";
  botonEliminar.onclick = function () {
    eliminarFila(this);
  };
  celdaAccion.appendChild(botonEliminar);
  nuevaFila.appendChild(celdaAccion);

  // Agregar la fila a la tabla
  tabla.appendChild(nuevaFila);
}

export function eliminarFila(boton) {
  let fila = boton.parentNode.parentNode;
  fila.remove();
}

export function obtenerDatos() {
  let tabla = document.getElementById("tableXY2");
  let datos = [];

  for (let i = 2; i < tabla.rows.length; i++) {
    let fila = tabla.rows[i];
    let filaDatos = [];

    for (let j = 0; j < fila.cells.length - 1; j++) {
      let input = fila.cells[j].querySelector("input");
      if (input) {
        let valor = input.value.trim() !== "" ? parseFloat(input.value) : null;
        filaDatos.push(valor);
      }
    }
    datos.push(filaDatos);
  }

  return datos;
}
