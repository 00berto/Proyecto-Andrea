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

// Funcion para generar el grafico
import { generateChart } from "./grafico.js";
import { obtenerDatos } from "./tabla.js";

// Manejar el cambio de selección y la visualización de los datos
let sheetData = {};

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

    // Función para obtener los datos de la hoja
    function getSheetData() {
      const selectedSheet = selectHoja.value;
      const sheet = excel.Sheets[selectedSheet];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { raw: false });
      return { selectedSheet, sheet, jsonData };
    }

    visual.addEventListener("click", function () {
      sheetData = getSheetData();
      Pre_Visual_Data(sheetData.jsonData);

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
      //generateChart(sheetData.jsonData);
      const tablaXY2 = document.getElementById("tableXY2");
      const datosTabla = obtenerDatos(tablaXY2);
      generateChart(
        sheetData.jsonData,
        AsseX1,
        AsseY1,
        configuracion_Grafico2,
        colore,
        colore_cop,
        colore_Pmax,
        colore_Pmin,
        chartInstance,
        datosTabla
      );
    });
  };

  reader.readAsArrayBuffer(file); // Leer el archivo como buffer
});

//previsualDATA
import { Pre_Visual_Data } from "./previsualDATA.js";

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

//funcion para agregar, remover filas y obtener los datos de la tabla
import { agregarFila, eliminarFila } from "./tabla.js";

// Grafico 2
let columnas = [
  "T. est. [°C]",
  "COP",
  "T. man [°C]",
  "Pot. Max [W]",
  "Pot. Min [W]",
];

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
