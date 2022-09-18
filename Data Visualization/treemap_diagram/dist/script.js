// JSON de películas
const url = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json';

/* Conexión con la API para obtener datos. La función dentro del método 'onload' es llamada cuando una transacción XMLHttpRequest se completa satisfactoriamente después de enviarla ('send'). Por su parte, el método 'responseText' devuelve un DOMString que contiene la respuesta a la consulta como texto, o null si ésta no tuvo exito o aun no ha sido completada. */
const req = new XMLHttpRequest();
req.open("GET", url, true);
req.onload = function () {
  movie_data = JSON.parse(req.responseText);

  sizeSVG();
  treeMapPlot();
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

/* Se genera el mapa de árboles. 
Primero se crea la jerarquía (primer argumento el objeto, segundo argumento especificar donde está el nodo hijo).
Segundo se especifica de donde determinar el área de los bloques (recaudación de cada película).
Tercero se ordenan los datos. Se utilizan dos nodos. Si la resta del nodo 2 con el nodo 1 es positiva, el nodo 2 tiene mayor valor y debe estar adelante del nodo 1.
Al final, en la jerarquía todas las películas están ordenadas de mayor a menor por su valor de recaudación, agrupadas por su género cinematográfico. */
function treeMapPlot() {
  let hierarchy = d3.hierarchy(movie_data, children_node => {
    return children_node['children'];
  }).sum(children_node => {
    return children_node['value'];
  }).sort((children_node1, children_node2) => {
    return children_node2['value'] - children_node1['value'];
  });

  /* Una vez configurada la jerarquía, se puede crear el mapa de árboles con 'treemap()', el cual dará unas coordinadas en los ejes X e Y para cada película, de forma que se pueda situar en el mapa de árboles.*/
  let createTreeMap = d3.treemap().
  size([width, height - 20]);
  createTreeMap(hierarchy);

  // Ahora se añaden grupos para poder escribir texto dentro de los bloques del mapa de árboles y se trasladan dichos grupos a su localización correspondiente dentro del SVG con las coordenadas XO e Y0 generadas al crear el mapa de árboles (y que aparecen con el método 'hierarchy.leaves()'), de forma que la esquina izquierda de cada bloque esté situado en las coordenadas X0 e Y0.
  let blocks = svg.selectAll("g").
  data(hierarchy.leaves()) // Devuelve ramas de la jerarquía en orden
  .enter().
  append('g').
  attr('transform', movie => {
    return 'translate (' + movie['x0'] + ', ' + movie['y0'] + ')';
  });

  // A todos estos grupos se añade los rectángulos que formarán los bloques del mapa de árboles, se colorean los rectángulos dependiendo del género cinematográfico de la película y se establecen su anchura (X1-X0) y su altura (Y1-Y0) correspondientes.
  blocks.append('rect').
  attr('class', 'tile').
  attr('fill', movie => {
    if (movie['data']['category'] === 'Action') {
      return 'tomato';
    } else
    if (movie['data']['category'] === 'Drama') {
      return 'orange';
    } else
    if (movie['data']['category'] === 'Adventure') {
      return 'DeepSkyBlue';
    } else
    if (movie['data']['category'] === 'Family') {
      return 'LightGreen';
    } else
    if (movie['data']['category'] === 'Animation') {
      return 'Cyan';
    } else
    if (movie['data']['category'] === 'Comedy') {
      return 'Teal';
    } else
    {
      return 'LightGrey';
    }
  }).
  attr("data-name", movie => {
    return movie['data']['name'];
  }).
  attr("data-category", movie => {
    return movie['data']['category'];
  }).
  attr("data-value", movie => {
    return movie['data']['value'];
  }).
  attr('width', movie => {
    return movie['x1'] - movie['x0'];
  }).
  attr('height', movie => {
    return movie['y1'] - movie['y0'];
  });

  /* A todos los grupos se les añade el texto que aparecerá en cada bloque */
  blocks.append('text').
  text(movie => {
    return movie['data']['name'];
  }).
  attr('font-size', '10px').
  attr('x', 2).
  attr('y', 10).
  attr('fill', 'black');
}

// Función que crea la leyenda del mapa de árboles
function legend() {
  colors = ['tomato', 'orange', 'DeepSkyBlue', 'LightGreen', 'Cyan', 'Teal', 'LightGrey'];
  legendContainer = svg.append('g').
  attr('id', 'legend');

  legend = legendContainer.selectAll('#legend').
  data(colors).
  enter().
  append('g').
  attr('class', 'legend-label');

  legend.append('rect').
  attr('class', 'legend-item').
  attr('x', (color, value) => {
    return width / colors.length * value;
  }).
  attr('y', height - 20).
  attr('width', width / colors.length).
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
    if (color == colors[4]) {
      return colors[4];
    } else
    if (color == colors[5]) {
      return colors[5];
    } else
    if (color == colors[6]) {
      return colors[6];
    }
  });

  legend.append('text').
  attr('font-weight', 'bold').
  attr('x', (color, value) => {
    if (value == 0) {
      return padding * 1.46;
    }
    if (value == 1) {
      return padding * 3.73;
    }
    if (value == 2) {
      return padding * 6.07;
    }
    if (value == 3) {
      return padding * 8.27;
    }
    if (value == 4) {
      return padding * 10.65;
    }
    if (value == 5) {
      return padding * 12.8;
    }
    if (value == 6) {
      return padding * 15.1;
    }
  }).
  attr('y', height - 10).
  attr('fill', 'black').
  attr('dy', '.35em').
  style('text-anchor', 'end').
  text(function (value) {
    if (value == colors[0]) {
      return 'Acción';
    } else
    if (value == colors[1]) {
      return 'Drama';
    } else
    if (value == colors[2]) {
      return 'Aventura';
    } else
    if (value == colors[3]) {
      return 'Familiar';
    } else
    if (value == colors[4]) {
      return 'Animación';
    } else
    if (value == colors[5]) {
      return 'Comedia';
    } else
    {
      return 'Biográfica';
    }
  });
}

// Realizar tooltip (aparece debajo de la gráfica) que muestra la fecha. Este estará oculto hasta que se pase el ratón sobre alguna de las barras del diagrama.
function tooltip() {
  tooltip = d3.select('text').
  attr('id', 'tooltip').
  style('visibility', 'hidden').
  style('width', 'auto').
  style('height', 'auto');

  svg.selectAll('.tile')
  // Cuando el ratón pasa por las celdas:
  .on('mouseover', (event, object) => {
    console.log(object);
    tooltip.transition().style('visibility', 'visible').
    attr('data-value', object['data']['value']).
    style('color', 'white');
    tooltip.html(object['data']['name'] + '<br>' +
    object['data']['value'].toString().
    replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' $');
  })

  // Cuando el ratón no pasa por las celdas:
  .on('mouseout', () => {
    tooltip.transition().style('visibility', 'hidden');
  });
}