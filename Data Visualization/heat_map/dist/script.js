/* El archivo JSON contiene un objeto con dos propiedades. Una de ellas tiene como valor un entero, y la otra tiene como valor un array de objetos. */
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

/* Conexión con la API para obterner datos. La función dentro del método 'onload' es llamada cuando una transacción XMLHttpRequest se completa satisfactoriamente después de enviarla ('send'). Por su parte, el método 'responseText' devuelve un DOMString que contiene la respuesta a la consulta como texto, o null si ésta no tuvo exito o aun no ha sido completada. */
const req = new XMLHttpRequest();
req.open("GET", url, true);
req.onload = function () {
  data = JSON.parse(req.responseText);
  baseTemperature = data['baseTemperature'];
  monthlyVariance = data['monthlyVariance'];

  sizeSVG();
  scales();
  axisPlot();
  cellsPlot();
  legend();
  tooltip();
};
req.send();

// Los datos ya estarían recopilados dentro de la función del 'onload'. Ahora se pasaría a realizar el mapa de calor dentro del gráfico vectorial escalable con esos datos ya recogidos. Como los valores de la API están recogidos dentro de la función del método 'onload' y son de ámbito local, se definen funciones para ejecutarlas dentro del 'onload':
// Anchura, altura y padding del gráfico vectorial escalable
const width = 1100;
const height = 420;
const padding = 70;

// Tamaño del SVG
function sizeSVG() {
  svg = d3.select("#canvas").
  attr("width", width).
  attr("height", height);
}

// Se generan las escalas que se usan posteriormente
function scales() {
  // Se establece la escala para determinar donde colocar horizontalmente las distintas celdas del mapa de calor, para que no sobrepasen el SVG, y que representan los años. Se crean variables para los años menores y máximos, puesto que son variables que se utilizarán posteriormente para definir la anchura de cada celda:
  minYear = d3.min(monthlyVariance, object => {
    return object['year'];
  });

  maxYear = d3.max(monthlyVariance, object => {
    return object['year'];
  });

  xAxisScale = d3.scaleLinear().
  domain([minYear, maxYear + 1]).
  range([padding, width - padding]);

  // Se establece la escala para determinar donde colocar verticalmente las distintas celdas del mapa de calor, para que no sobrepasen el SVG, y que representan los meses (0-11). En este caso 12, para que haya un hueco más para dibujar otra fila de celdas:
  yAxisScale = d3.scaleTime().
  domain([new Date(0, 0, 0, 0, 0, 0, 0),
  new Date(0, 12, 0, 0, 0, 0, 0)]).
  range([padding, height - padding]);
}

// Se generan los ejes
function axisPlot() {
  // Se crea el eje X basándonos en las escalas definidas anteriormente. Posteriormente, éste se renderiza con un componente 'g' (grupo) y se posiciona en el lugar correcto con el atributo de transformación.
  let xAxis = d3.axisBottom(xAxisScale).
  tickFormat(d3.format('d')); // Años sin comas

  svg.append("g").
  call(xAxis).
  attr('id', 'x-axis').
  attr('transform', 'translate(0,' + (height - padding) + ')').
  style('color', 'navy');

  // Se crea el eje Y basándonos en las escalas definidas anteriormente. Posteriormente, éste se renderiza con un componente 'g' (grupo) y se posiciona en el lugar correcto con el atributo de transformación.
  yAxis = d3.axisLeft(yAxisScale).
  tickFormat(d3.timeFormat('%B')); // Mostras nombres de los meses completos

  svg.append("g").
  call(yAxis).
  attr('id', 'y-axis').
  attr('transform', 'translate(' + padding + ', 0)').
  style('color', 'navy');
}

/* Se generan las celdas del mapa de calor y se establecen cinco colores para cada una de ellas dependiendo del valor de la temperatura global */
function cellsPlot() {
  svg.selectAll("rect").
  data(monthlyVariance).
  enter().
  append("rect").
  attr('class', 'cell').
  attr('fill', object => {
    variance = object['variance'];
    globalTemper = baseTemperature + variance;

    if (globalTemper <= 4.0) {
      return '#0D1140';
    } else
    if (globalTemper > 4.0 & globalTemper <= 7.0) {
      return '#09AFF1';
    } else
    if (globalTemper > 7.0 & globalTemper <= 8.66) {
      return '#C89E60';
    } else
    if (globalTemper > 8.66 & globalTemper <= 10) {
      return '#E9681D';
    } else
    {
      return '#900C3F';
    }
  }).
  attr("data-month", object => {
    return object['month'] - 1; // Meses del (0-11)
  }).
  attr("data-year", object => {
    return object['year'];
  }).
  attr("data-temp", object => {
    return baseTemperature + object['variance'];
  })
  // Altura de cada celda:
  .attr("height", (height - 2 * padding) / 12)

  // Posición vertical de cada celda:
  .attr("y", object => {
    return yAxisScale(new Date(0, object['month'] - 1, 0, 0, 0, 0, 0));
  })

  // Anchura de cada celda
  .attr("width", (width - 2 * padding) / (maxYear - minYear))

  // Posición horizontal de cada celda:
  .attr("x", object => {
    return xAxisScale(object['year']);
  });
}

// Leyenda del mapa de calor
function legend() {
  colors = ['#0D1140', '#09AFF1', '#C89E60', '#E9681D', '#900C3F'];
  legendContainer = svg.append('g').
  attr('id', 'legend');

  legend = legendContainer.selectAll('#legend').
  data(colors).
  enter().
  append('g').
  attr('class', 'legend-label');

  legend.append('rect').
  attr('x', (color, value) => {
    return padding + 150 * value;
  }).
  attr('y', height - padding + padding / 2).
  attr('width', 150).
  attr('height', 20).
  attr('fill', color => {
    if (color == colors[0]) {
      return colors[0];
    } else
    if (color == colors[1]) {
      return colors[1];
    } else
    if (color == colors[2]) {
      return colors[2];
    } else
    if (color == colors[3]) {
      return colors[3];
    } else
    {
      return colors[4];
    }
  });

  legend.append('text').
  attr('font-weight', 'bold').
  attr('x', (color, value) => {
    if (value == 0) {
      return padding * 2.5;
    }
    if (value == 1) {
      return padding * 4.70;
    }
    if (value == 2) {
      return padding * 7.05;
    }
    if (value == 3) {
      return padding * 9.25;
    }
    if (value == 4) {
      return padding * 11.2;
    }
  }).
  attr('y', height - padding + padding / 1.57).
  attr('fill', 'white').
  attr('dy', '.35em').
  style('text-anchor', 'end').
  text(function (value) {
    if (value == colors[0]) {
      return '(-∞, 4°C]';
    } else
    if (value == colors[1]) {
      return '(4°C, 7°C]';
    } else
    if (value == colors[2]) {
      return '(7°C, 8.66°C]';
    } else
    if (value == colors[3]) {
      return '(8.66°C, 10°C]';
    } else
    {
      return '(10°C, +∞)';
    }
  });
}

// Realizar tooltip (aparece debajo de la gráfica) que muestra la fecha. Este estará oculto hasta que se pase el ratón sobre alguna de las barras del diagrama.
function tooltip() {
  tooltip = d3.select('body').
  append('text').
  attr('id', 'tooltip').
  style('visibility', 'hidden').
  style('width', 'auto').
  style('height', 'auto');

  svg.selectAll('.cell')
  // Cuando el ratón pasa por las celdas:
  .on('mouseover', (event, object) => {
    two_decimals = d3.format('.2f'); // Redondeo a dos decimales
    formatTime = d3.timeFormat("%B"); // Nombre de los meses

    tooltip.transition().style('visibility', 'visible').
    text("Temperatura global: " +
    two_decimals(baseTemperature +
    object['variance']) + ' °C ' +
    '(' + formatTime(new Date(0, object['month'],
    0, 0, 0, 0, 0)) +
    ' ' + object['year'] + ')').
    attr('data-year', object['year']).
    style('color', 'black');
  })
  // Cuando el ratón no pasa por las celdas:
  .on('mouseout', () => {
    tooltip.transition().style('visibility', 'hidden');
  });
}