// Import CSS
import "../scss/styles.scss";
import "../scss/styles.css";

const invio = document.getElementById("creaGraf");
const visual = document.getElementById("cargaFile");
const archivoXLSL = document.getElementById("file1");

const progressBar = document.getElementById("progressBar");
const selectHoja = document.getElementById("selectHoja");

const AsseX1 = document.getElementById("asseX1");
const AsseY1 = document.getElementById("asseY1");

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

      AsseY1.innerHTML = "";
      headers.forEach((header) => {
        const option = document.createElement("option");
        option.classList.add("px-1");
        option.value = header;
        option.textContent = header;
        AsseY1.appendChild(option);
      });
    });

    invio.addEventListener("click", function () {
      sheetData = getSheetData();
      generateChart(sheetData.jsonData);
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

// Grafico 2
let columnas = [
  "T. est. [°C]",
  "COP",
  "T. man [°C]",
  "Pot. Max [W]",
  "Pot. Min [W]",
];

/*
const configuracion_Grafico2 = {
  asse_X: columnas[1],
  asse_Y1: columnas[3],
  asse_Y2: columnas[4],
};*/

const configuracion_Grafico2 = {
  asse_X2: columnas.indexOf("T. est. [°C]"),
  asse_Y1: columnas.indexOf("COP"),
  asse_Y2: columnas.indexOf("Pot. Max [W]"),
  asse_Y3: columnas.indexOf("Pot. Min [W]"),
};

console.log("asseX GRAFICO 2:", configuracion_Grafico2.asse_X2);
console.log("asseY1 GRAFICO 2:", configuracion_Grafico2.asse_Y1);
console.log("asseY2 GRAFICO 2:", configuracion_Grafico2.asse_Y2);

// Función cambio color
const colore = document.getElementById("colore");
const colore_cop = document.getElementById("colore_cop");
const colore_Pmax = document.getElementById("colore_Pmin");
const colore_Pmin = document.getElementById("colore_Pmax");

let chartInstance; // almacen del grafico

function UpdateColor() {
  const UpColore = colore.value;
  const UpColore_cop = colore_cop.value;
  const UpColore_pmin = colore_Pmax.value;
  const UpColore_pmax = colore_Pmin.value;

  if (chartInstance) {
    chartInstance.data.datasets[0].backgroundColor = UpColore;
    chartInstance.data.datasets[0].borderColor = UpColore;
    chartInstance.data.datasets[1].backgroundColor = UpColore_cop;
    chartInstance.data.datasets[1].borderColor = UpColore_cop;
    chartInstance.data.datasets[2].backgroundColor = UpColore_pmin;
    chartInstance.data.datasets[2].borderColor = UpColore_pmin;
    chartInstance.data.datasets[3].backgroundColor = UpColore_pmax;
    chartInstance.data.datasets[3].borderColor = UpColore_pmax;
    chartInstance.update();
  }
}

// Función para generar el gráfico

const nome_Grafico_Input = document.getElementById("nomeGrafico");
const titulo_Grafico = document.getElementById("tituloGrafico");

function actualizar_Titulo_Grafico() {
  let nome_Grafico = nome_Grafico_Input.value;
  if (nome_Grafico === "") {
    nome_Grafico = "Grafico";
  }
  titulo_Grafico.textContent = nome_Grafico;
}

// Titulo inicial
actualizar_Titulo_Grafico();

// Cambio titulo en tiempo real
nome_Grafico_Input.addEventListener("input", actualizar_Titulo_Grafico);

function generateChart(data) {
  //Gráfico 1
  const xAxis = AsseX1.value;
  const yAxis = AsseY1.value;

  console.log("\nGR1:\n", xAxis, yAxis);

  const labels = data.map((item) => item[xAxis]);
  const values = data.map((item) => item[yAxis]);

  //Gráfico 2
  const xAxis_grafico2 = configuracion_Grafico2.asse_X2;
  const yAxis1_grafico2 = configuracion_Grafico2.asse_Y1;
  const yAxis2_grafico2 = configuracion_Grafico2.asse_Y2;
  const yAxis3_grafico2 = configuracion_Grafico2.asse_Y3;

  console.log(
    "\nGR2:\n",
    xAxis_grafico2,
    yAxis1_grafico2,
    yAxis2_grafico2,
    yAxis3_grafico2
  );

  const obtenerDatos_tabla = obtenerDatos();

  const valoresX_grafico2 = obtenerDatos_tabla.map(
    (fila) => fila[xAxis_grafico2]
  );

  const valoresY1_grafico2 = obtenerDatos_tabla.map(
    (fila) => fila[yAxis1_grafico2]
  );
  const valoresY2_grafico2 = obtenerDatos_tabla.map(
    (fila) => fila[yAxis2_grafico2]
  );
  const valoresY3_grafico2 = obtenerDatos_tabla.map(
    (fila) => fila[yAxis3_grafico2]
  );

  const dictsGrafico2 = valoresX_grafico2.map((x, i) => ({
    x,
    y1: valoresY1_grafico2[i] ?? 0,
    y2: valoresY2_grafico2[i] ?? 0,
    y3: valoresY3_grafico2[i] ?? 0,
  }));

  console.log(
    "\nValores del grafico1\n",
    labels,
    values,
    "\nValores del grafico2:\n",
    valoresX_grafico2,
    valoresY1_grafico2,
    valoresY2_grafico2,
    valoresY3_grafico2,
    "\nValores de los Dict\n",
    dictsGrafico2
  );

  //min max

  function MinMax(labels, values) {
    let xlabels = labels.map(parseFloat).filter((val) => !isNaN(val));
    let yvalues = values.map(parseFloat).filter((val) => !isNaN(val));

    let minX_excel = xlabels.length > 0 ? Math.min(...xlabels) : null;
    let maxX_excel = xlabels.length > 0 ? Math.max(...xlabels) : null;
    let minY_excel = yvalues.length > 0 ? Math.min(...yvalues) : null;
    let maxY_excel = yvalues.length > 0 ? Math.max(...yvalues) : null;

    return { minX_excel, maxX_excel, minY_excel, maxY_excel };
  }

  let Min_Max = MinMax(labels, values);

  const min_max = {
    escala_minX_AN: -10,
    escala_maxX_AN: 40,

    escala_minY_AN: -4000,
    escala_maxY_AN: 8000,

    escala_minYcop_AN: 0,
    escala_maxYcop_AN: 5,

    escala_minX_grafico: -10,
    escala_maxX_grafico: 25,
  };

  console.log(
    "\nmin X Y Excel",
    "x",
    Min_Max.minX_excel,
    "y",
    Min_Max.minY_excel
  );
  console.log(
    "\nmax X Y Excel",
    "x",
    Min_Max.maxX_excel,
    "y",
    Min_Max.maxY_excel
  );

  // Nombre General del gráfico
  const nomeGrafico = document.getElementById("nomeGrafico").value;

  // Dimensiones Genarales Grafico
  const ctx = document.getElementById("myChart").getContext("2d");
  ctx.canvas.width = 800;
  ctx.canvas.height = 800;

  if (chartInstance) {
    chartInstance.destroy(); // Destruir el gráfico existente
  }

  // Tipo de gráfico
  let type_grafico1 = "scatter";
  let type_grafico2 = "line";

  // opiciones comunes Grafico

  let opciones_comunesAtodos = {
    borderWidth: 2,
    fill: false,
  };

  let scalesX_comun = {
    min: min_max.escala_minX_AN,
    max: min_max.escala_maxX_AN,
    type: "linear",
    position: "center",
  };

  let scalesY_comun = {
    //type: "logarithmic",
    type: "linear",
    position: "left", // Posición del eje (->)
    ticks: { display: true },
    beginAtZero: false,
    stacked: false,
    grid: { drawTicks: false, drawBorder: false, drawOnChartArea: false },
  };

  let y_comun = {
    type: type_grafico1,
    showLine: true,
  };

  let scaleY2_3comun = {
    min: min_max.escala_minY_AN,
    max: min_max.escala_maxY_AN,
    ticks: { display: false },
    grid: { drawTicks: false, drawBorder: false, drawOnChartArea: false },
    beginAtZero: false,
  };

  // Crear el gráfico
  chartInstance = new Chart(ctx, {
    type: type_grafico1,
    data: {
      labels: labels,
      datasets: [
        // Gráfico 1
        {
          label: " Grafico Dispersione",
          data: values,
          ...opciones_comunesAtodos,
          backgroundColor: colore.value,
          borderColor: colore.value,
          xAxisID: "x", // asse X primer grafico
          yAxisID: "y", // asse Y primer grafico
        },

        //Gráfico 2 (y1)
        {
          ...y_comun,
          ...opciones_comunesAtodos,
          label: " Cop",
          pointStyle: "triangle",
          backgroundColor: colore_cop.value,
          borderColor: colore_cop.value,
          //data: dictY1_grafico2,
          data: dictsGrafico2.map(({ x, y1 }) => ({ x, y: y1 })),
          xAxisID: "x2", // asse X2: segundo grafico
          yAxisID: "y1", // asse Y1: segungo grafico
        },

        //Gráfico 2 (y2)
        {
          ...y_comun,
          ...opciones_comunesAtodos,
          label: " P.Max",
          pointStyle: "cross",
          backgroundColor: colore_Pmax.value,
          borderColor: colore_Pmax.value,
          //data: dictY2_grafico2,
          data: dictsGrafico2.map(({ x, y2 }) => ({ x, y: y2 })),
          xAxisID: "x2", // asse X2: segundo grafico
          yAxisID: "y2", // asse Y2: segungo grafico
        },

        //Gráfico 2 (y3)
        {
          ...y_comun,
          ...opciones_comunesAtodos,
          label: " P.Min",
          pointStyle: "dash",
          backgroundColor: colore_Pmin.value,
          borderColor: colore_Pmin.value,
          //data: dictY3_grafico2,
          data: dictsGrafico2.map(({ x, y3 }) => ({ x, y: y3 })),
          xAxisID: "x2", // asse X2: segundo grafico
          yAxisID: "y3", // asse Y3: segungo grafico
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        // Legend
        legend: {
          display: true,
          position: "bottom",
        },

        // Título general
        title: {
          display: true, // Habilita el título
          text: nomeGrafico,
          position: "top",
          font: { size: 16, weight: "bold" },
          padding: { top: 10, bottom: 10 },
        },
      },
      scales: {
        // Gráficos 1

        // Configuración del eje X
        x: {
          title: { display: false, text: xAxis },
          ...scalesX_comun,
        },

        // Configuración eje Y grafico 1
        y: {
          beginAtZero: false,
          title: { display: false, text: yAxis }, // Usa el valor seleccionado en AsseY1
          ticks: { display: true },
          ...scaleY2_3comun,
        },

        // Gráfico 2

        // Configuración del segundo eje X
        x2: {
          ...scalesX_comun,
          //type: "logarithmic",
          title: { display: false, text: xAxis_grafico2 },
          ticks: { display: false },
          grid: { drawTicks: false, drawBorder: false, drawOnChartArea: false },
        },

        // Configuración del primer eje Y del segundo gráfico
        y1: {
          //...scalesY_comun,
          min: min_max.escala_minYcop_AN,
          max: min_max.escala_maxYcop_AN,
          position: "right", // Posición del eje (->)
          offset: true,
          title: { display: false, text: yAxis1_grafico2 },
          beginAtZero: false,
          grid: { drawTicks: false, drawBorder: false, drawOnChartArea: false },
        },

        // Configuración del segundo eje Y del segundo grafico
        y2: {
          //...scalesY_comun,
          title: { display: false, text: yAxis2_grafico2 },
          ...scaleY2_3comun,
        },

        // Configuración del segundo eje Y del segundo grafico
        y3: {
          //...scalesY_comun,
          title: { display: false, text: yAxis3_grafico2 },
          ...scaleY2_3comun,
        },
      },
    },
  });
}

colore.addEventListener("change", UpdateColor);
colore_cop.addEventListener("change", UpdateColor);

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
