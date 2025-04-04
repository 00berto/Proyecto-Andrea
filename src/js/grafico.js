import { obtenerDatos } from "./tabla";

export function generateChart(
  data,
  AsseX1,
  AsseY1,
  configuracion_Grafico2,
  colore,
  colore_cop,
  colore_Pmax,
  colore_Pmin,
  chartInstance,
  datosTabla
) {
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

  const minX_excel = Math.min(...labels.map(parseFloat));
  const minY_excel = Math.min(...values.map(parseFloat));
  const maxX_excel = Math.min(...labels.map(parseFloat));
  const maxY_excel = Math.min(...values.map(parseFloat));

  console.log(...labels.map(parseFloat), ...values.map(parseFloat));
  console.log("\nmin X Y Excel", "x", minX_excel, "y", minY_excel);
  console.log("\nmax X Y Excel", "x", maxX_excel, "y", maxY_excel);

  /*
    const minY1 = Math.min(...valoresY1_grafico2);
    const maxY1 = Math.max(...valoresY1_grafico2);
  
    const minY2 = Math.min(...valoresY2_grafico2);
    const maxY2 = Math.max(...valoresY2_grafico2);
  
    const minY3 = Math.min(...valoresY3_grafico2);
    const maxY3 = Math.max(...valoresY3_grafico2);
  */

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
    min: minX_excel,
    max: maxX_excel,
    type: "linear",
    position: "bottom",
  };

  let scalesY_comun = {
    type: "logarithmic",
    //type: "linear",
    position: "right", // Posición del eje (->)
    ticks: { display: true },
    beginAtZero: false,
    min: minY_excel,
    max: maxY_excel,
    stacked: false,
    grid: { drawTicks: false, drawBorder: false, drawOnChartArea: false },
  };

  let y_comun = {
    type: type_grafico2,
    showLine: true,
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
          title: { display: true, text: xAxis },
          ...scalesX_comun,
        },

        // Configuración eje Y grafico 1
        y: {
          beginAtZero: false,
          title: { display: false, text: yAxis }, // Usa el valor seleccionado en AsseY1
          ticks: { display: false },
        },

        // Gráfico 2

        // Configuración del segundo eje X
        x2: {
          ...scalesX_comun,
          type: "logarithmic",
          title: { display: false, text: xAxis_grafico2 },
          ticks: { display: false },
          grid: { drawTicks: false, drawBorder: false, drawOnChartArea: false },
        },

        // Configuración del primer eje Y del segundo gráfico
        y1: {
          ...scalesY_comun,
          position: "left", // Posición del eje (<-)
          offset: true,
          title: { display: false, text: yAxis1_grafico2 },
        },

        // Configuración del segundo eje Y del segundo grafico
        y2: {
          ...scalesY_comun,
          title: { display: false, text: yAxis2_grafico2 },
        },

        // Configuración del segundo eje Y del segundo grafico
        y3: {
          ...scalesY_comun,
          title: { display: false, text: yAxis3_grafico2 },
        },
      },
    },
  });
}
