// Import CSS
import "../scss/styles.scss";
import "../scss/styles.css";

const invio = document.getElementById("creaGraf");
const visual = document.getElementById("cargaFile");
const archivoXLSL = document.getElementById("file1");

const progressBar = document.getElementById("progressBar");
const selectHoja = document.getElementById("selectHoja");

const AsseX1 = document.getElementById("asseX1");
const AsseX2 = document.getElementById("asseX2"); // puede ser no necesario
//const AsseY1 = document.getElementById("asseY1");
//const AsseY2 = document.getElementById("asseY2");

const chartType = document.getElementById("chartType").value;
const download = document.getElementById("download");

archivoXLSL.addEventListener("change", () => {
  // Mostrar la barra de progreso
  progressBar.style.display = "block";

  const totalPasos = 10; // Ajusta este valor según la complejidad de tu carga
  let pasoActual = 0;
  const interval = setInterval(() => {
    pasoActual++;
    const porcentaje = (pasoActual / totalPasos) * 100;
    progressBar.style.width = porcentaje + "%";
    if (pasoActual === totalPasos) {
      clearInterval(interval);
      // Aquí puedes agregar código para procesar el archivo cargado
      console.log("Archivo cargado exitosamente");
    }
  }, 500);
});

// Evento para leer el archivo Excel al seleccionarlo
archivoXLSL.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result); // archivo en formato binario
    const excel = XLSX.read(data, { type: "array" }); // Leer el contenido del archivo Excel
    const sheetLength = excel.SheetNames;

    // Agregar opciones al select
    selectHoja.innerHTML = ""; // Limpiar opciones anteriores
    sheetLength.forEach((sheetName) => {
      const option = document.createElement("option");
      option.classList.add("px-1");
      option.value = sheetName;
      option.textContent = sheetName;
      selectHoja.appendChild(option);
    });

    // Manejar el cambio de selección y la visualización de los datos

    let sheetData = {};

    // Función para obtener los datos de la hoja
    function getSheetData() {
      const selectedSheet = selectHoja.value;
      const sheet = excel.Sheets[selectedSheet];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { raw: false });
      return { selectedSheet, sheet, jsonData };
    }

    visual.addEventListener("click", function () {
      sheetData = getSheetData();
      displayData(sheetData.jsonData);

      console.log(sheetData.jsonData[0]);

      const headers =
        sheetData.jsonData.length > 0 ? Object.keys(sheetData.jsonData[0]) : [];

      AsseX1.innerHTML = "";
      headers.forEach((header) => {
        const option = document.createElement("option");
        option.classList.add("px-1");
        option.value = header;
        option.textContent = header;
        AsseX1.appendChild(option);
      });

      /*AsseX2.innerHTML = "";
      headers.forEach((header) => {
        const option = document.createElement("option");
        option.classList.add("px-1");
        option.value = header;
        option.textContent = header;
        AsseX2.appendChild(option);
      });*/

      AsseY1.innerHTML = "";
      headers.forEach((header) => {
        const option = document.createElement("option");
        option.classList.add("px-1");
        option.value = header;
        option.textContent = header;
        AsseY1.appendChild(option);
      });

      /*AsseY2.innerHTML = "";
      headers.forEach((header) => {
        const option = document.createElement("option");
        option.classList.add("px-1");
        option.value = header;
        option.textContent = header;
        AsseY2.appendChild(option);
      });*/
    });

    invio.addEventListener("click", function () {
      const chartType = document.getElementById("chartType").value; // Obtener el tipo de gráfico actual
      sheetData = getSheetData();
      generateChart(sheetData.jsonData, chartType);
    });
  };

  reader.readAsArrayBuffer(file); // Leer el archivo como buffer
});

// Función para mostrar datos en la página
function displayData(data) {
  const output = document.getElementById("output");
  output.innerHTML = ""; // Limpiar contenido anterior

  // Crear una tabla para mostrar los datos
  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";

  // Crear encabezados de tabla
  const headers = Object.keys(data[0]);
  const headerRow = document.createElement("tr");
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    th.style.border = "1px solid #ddd";
    th.style.padding = "8px";
    th.style.backgroundColor = "#f4f4f4";
    th.style.textAlign = "left";
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // Crear filas de datos
  data.forEach((row) => {
    const tr = document.createElement("tr");
    headers.forEach((header) => {
      const td = document.createElement("td");
      td.textContent = row[header];
      td.style.border = "1px solid #ddd";
      td.style.padding = "8px";
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });

  // Agregar la tabla al <pre>
  output.appendChild(table);
}

// Funciónes de la tabla

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("btn-add-fila")
    .addEventListener("click", function (event) {
      event.preventDefault(); // Prevenir el envío del formulario
      agregarFila();
    });

  let botonesEliminar = document.querySelectorAll(".btn-remove-fila");
  botonesEliminar.forEach(function (boton) {
    boton.addEventListener("click", function () {
      eliminarFila(this);
    });
  });
});

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

function eliminarFila(boton) {
  let fila = boton.parentNode.parentNode;
  fila.remove();
}

// Variables asse X Y a nivel global
//let AsseX2 = [];
//let AsseY2 = [];

function obtenerDatos() {
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

document.addEventListener("DOMContentLoaded", function () {
  let selectX = document.getElementById("asseX2"); // podria ser no necesario
  let selectY = document.getElementById("asseY2");
  console.log("Opciones de asseY2:", selectY.options);
  console.log("asseY2:", selectY);

  let columnas = [
    "T. est. [°C]",
    "COP",
    "T. man [°C]",
    "Pot. Max [W]",
    "Pot. Min [W]",
  ];

  /*
  let selectX = document.getElementById("asseX2"); // podria ser no necesario
  let selectY = document.getElementById("asseY2");
*/

  columnas.forEach((col, index) => {
    selectX.add(new Option(col, index));
    selectY.add(new Option(col, index));
  });

  selectX.selectedIndex = 0; // Por defecto, T. est. [°C]
  selectY.selectedIndex = 0; // Por defecto, T. est. [°C]
  //selectY.selectedIndex = 1; // Por defecto, COP

  console.log("Opciones de asseY2:", selectY.options);

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
});

// Funcion para obtener los datos de la tabla

const actualizarAsseXY = function (event) {
  let { x, y } = event.detail;

  console.log("Columna X seleccionada:", x);
  console.log("Columna Y seleccionada:", y);

  let datos = obtenerDatos();
  valoresX = datos.map((fila) => fila[x]);
  valoresY = datos.map((fila) => fila[y]);

  console.log("AsseX2:", valoresX);
  console.log("AsseY2:", valoresY);
};

document.addEventListener("actualizarSeleccion", function (event) {
  let { x, y } = event.detail;
  actualizarAsseXY(x, y);
});
/*
document.addEventListener("actualizarSeleccion", function (event) {
  actualizarAsseXY(event);
});*/

// Función cambio color
const colore = document.getElementById("colore");
const colore2 = document.getElementById("colore2");

let chartInstance; // almacen del grafico

function UpdateColor() {
  const UpColore = colore.value;
  const UpColore2 = colore2.value;

  if (chartInstance) {
    chartInstance.data.datasets[0].backgroundColor = UpColore;
    chartInstance.data.datasets[0].borderColor = UpColore;
    chartInstance.data.datasets[1].backgroundColor = UpColore2;
    chartInstance.data.datasets[1].borderColor = UpColore2;
    chartInstance.update();
  }
}

// Función para generar el gráfico

function generateChart(data, type) {
  const xAxis = AsseX1.value;
  const xAxis2 = AsseX2.value;
  const yAxis = AsseY1.value;
  const yAxis2 = AsseY2.value;

  const valoresY = obtenerDatos().map((fila) => fila[yAxis2]);

  const labels = data.map((item) => item[xAxis]);
  //const labels2 = data.map((item) => item[xAxis2]);
  const values = data.map((item) => item[yAxis]);
  const values2 = data.map((item) => item[yAxis2]);

  const nomeGrafico = document.getElementById("nomeGrafico").value;

  const ctx = document.getElementById("myChart").getContext("2d");
  ctx.canvas.width = 600;
  ctx.canvas.height = 300;

  if (chartInstance) {
    chartInstance.destroy(); // Destruir el gráfico existente
  }

  chartInstance = new Chart(ctx, {
    type: type,
    data: {
      labels: labels,
      datasets: [
        {
          label: yAxis + " (Asse Y 1)",
          data: values,
          //backgroundColor: "rgba(75, 192, 192, 0.5)",
          backgroundColor: colore.value + "80",
          borderColor: colore.value,
          borderWidth: 2,
          fill: false,
          xAxisID: "x", // Asocia este dataset al eje 'x' principal
          yAxisID: "y", // Asocia este dataset al eje 'y' principal
        },

        {
          label: yAxis2 + " (Asse Y 2)",
          //data: values2,
          data: valoresY,
          //backgroundColor: "rgba(75, 192, 192, 0.5)",
          backgroundColor: colore2.value + "80",
          borderColor: colore2.value,
          borderWidth: 2,
          fill: false,
          xAxisID: "x1", // Asocia este dataset al eje 'x1' secundario
          yAxisID: "y1", // Asocia este dataset al eje 'y1' secundario
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        // Añade esta sección para el título general
        title: {
          display: true, // Habilita el título
          text: nomeGrafico,
          position: "top",
          font: {
            size: 16,
            weight: "bold",
          },
          padding: {
            top: 10,
            bottom: 10,
          },
        },
      },
      scales: {
        y: {
          // Configuración del primer eje Y
          type: "linear", // Tipo de escala
          position: "left", // Posición del eje (izquierda)
          beginAtZero: true,
          title: {
            // Añade títulos a los ejes
            display: true,
            text: yAxis, // Usa el valor seleccionado en AsseY1
          },
        },

        y1: {
          // Configuración del segundo eje Y
          type: "linear", // Tipo de escala (puedes ajustarlo si es necesario)
          position: "right", // Posición del eje (derecha)
          beginAtZero: true,
          title: {
            display: true,
            text: yAxis2, // Usa el valor seleccionado en AsseY2
          },

          grid: {
            drawOnChartArea: false, // Evita que la grid del segundo eje se superponga al primero
          },
        },

        x: {
          // Configuración del eje X
          title: {
            display: true,
            text: xAxis, // Usa el valor seleccionado en AsseX1
          },
        },

        /*
        x1: {
          // Configuración del segundo eje X
          title: {
            display: true,
            text: xAxis2, // Usa el valor seleccionado en AsseX2
          },
        },*/
      },
    },
  });
}

colore.addEventListener("change", UpdateColor);
colore2.addEventListener("change", UpdateColor);

download.addEventListener("click", () => {
  if (chartInstance) {
    const nomeGrafico = document.getElementById("nomeGrafico").value;

    const canvas = chartInstance.canvas;
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `${nomeGrafico}.png`;
    link.click();
  } else {
    console.error("No hay gráfico para descargar");
  }
});
