const initial_message = `# <center>Previsualizador</center>
![Markdown](https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Markdown-mark.svg/1200px-Markdown-mark.svg.png)

------------

## Resumen
\`\`\`
Esta herramienta permite previsualizar el texto escrito de la ventana del editor en formato Markdown tal y como se puede apreciar en la ventana del previsualizador de la derecha.
\`\`\`

> **Markdown** es un lenguaje de marcado ligero que trata de conseguir la máxima legibilidad y facilidad de publicación tanto en su forma de entrada como de salida.
Si quieres saber más sobre el formato \`Markdown\`, pincha [aquí](https://es.wikipedia.org/wiki/Markdown).

Para usar la herramientas solo tienes que hacer lo siguiente:
- Escribir el texto en el editor
- Esperar la previsualización`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Contenido dentro del editor ('textarea'):
      text: initial_message };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      // 'event.target' devuelve el elemento DOM que ha desencadenado el evento. Y 'value', su valor.
      text: event.target.value });

  }

  render() {
    const text = this.state.text;

    // El método 'parse' de la librería 'marked' transforma el argumento entre paréntesis a formato 'markdown'. '{breaks:true} activa los saltos de líneas en el previsualizador para saltos de línea en el editor':
    const markdown = marked.parse(text, { breaks: true });

    return /*#__PURE__*/(
      React.createElement("div", null, /*#__PURE__*/
      React.createElement("h2", { className: "text-center m-4" }, "Convierte tu documento Markdown"), /*#__PURE__*/
      React.createElement("div", { className: "row" }, /*#__PURE__*/
      React.createElement("div", { className: "col-6" }, /*#__PURE__*/
      React.createElement("h6", { className: "text-center" }, "Editor"), /*#__PURE__*/
      React.createElement("textarea", { className: "form-control rounded p-2", id: "editor", value: text, onChange: this.handleChange })), /*#__PURE__*/


      React.createElement("div", { className: "col-6" }, /*#__PURE__*/
      React.createElement("h6", { className: "text-center" }, "Previsualizador"), /*#__PURE__*/

      React.createElement("div", { className: "preview rounded p-2 mb-1", id: "preview", dangerouslySetInnerHTML: { __html: markdown } })))));





  }}


ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('app'));