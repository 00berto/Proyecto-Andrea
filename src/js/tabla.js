function agregarFila() {
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
  botonEliminar.className = "btn btn-danger btn-sm";
  botonEliminar.innerText = "❌";
  botonEliminar.onclick = function () {
    eliminarFila(this);
  };
  celdaAccion.appendChild(botonEliminar);
  nuevaFila.appendChild(celdaAccion);

  // Agregar la fila a la tabla
  tabla.appendChild(nuevaFila);
}

function eliminarFila(boton) {
  let fila = boton.parentNode.parentNode;
  fila.parentNode.removeChild(fila);
}

function obtenerDatos() {
  let tabla = document.getElementById("tableXY2");
  let datos = [];

  for (let i = 2; i < tabla.rows.length; i++) {
    let fila = tabla.rows[i];
    let filaDatos = [];

    for (let j = 0; j < fila.cells.length - 1; j++) {
      let input = fila.cells[j].querySelector("input");
      if (input) {
        filaDatos.push(parseFloat(input.value) || 0);
      }
    }
    datos.push(filaDatos);
  }

  return datos;
}

/*
//Posible implementación de pegar datos en la tabla

document.addEventListener("paste", function (event) {
  let clipboardData = event.clipboardData || window.clipboardData;
  let pastedData = clipboardData.getData("Text");

  // Convertir datos pegados en filas y columnas (separadas por tabulaciones y saltos de línea)
  let filas = pastedData.split("\n").map((row) => row.split("\t"));

  // Obtener tbody de la tabla
  let tabla = document
    .getElementById("tableXY2")
    .getElementsByTagName("tbody")[0];
  let filasTabla = tabla.getElementsByTagName("tr");

  // Si no hay suficientes filas, agregamos más
  while (filas.length > filasTabla.length) {
    agregarFila();
    filasTabla = tabla.getElementsByTagName("tr");
  }

  // Rellenar la tabla con los datos pegados
  for (let i = 0; i < filas.length; i++) {
    if (i >= filasTabla.length) break;

    let celdas = filasTabla[i].getElementsByTagName("td");
    for (let j = 0; j < filas[i].length; j++) {
      if (j >= celdas.length - 1) break; // -1 para no tocar la celda de acciones

      let input = celdas[j].querySelector("input");
      if (input) {
        input.value = filas[i][j]; // Asigna el valor pegado al input
      }
    }
  }
});
*/

window.onload = function () {
  let columnas = [
    "T. est. [°C]",
    "COP",
    "T. man [°C]",
    "Pot. Max [W]",
    "Pot. Min [W]",
  ];
  let selectX = document.getElementById("asseX2");
  let selectY = document.getElementById("asseY2");

  columnas.forEach((col, index) => {
    selectX.add(new Option(col, index));
    selectY.add(new Option(col, index));
  });

  selectX.selectedIndex = 0; // Por defecto, T. est. [°C]
  selectY.selectedIndex = 1; // Por defecto, COP
  function dispatchUpdateEvent() {
    let event = new CustomEvent("actualizarSeleccion", {
      detail: {
        x: selectX.value,
        y: selectY.value,
      },
    });
    document.dispatchEvent(event);
  }

  selectX.addEventListener("change", dispatchUpdateEvent);
  selectY.addEventListener("change", dispatchUpdateEvent);
};
