function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;} // Archivo de audio enlazado al audio HTML
const audio = document.getElementById('beep');

// Componente padre React con estado para el reloj central de la web. Los temporizadores están definidos por componentes hijos al final del código.
class App extends React.Component {
  constructor(props) {
    super(props);

    /* Estado para el tiempo de descanso, el tiempo de trabajo, el contador total del reloj (en segundos), la sesión actual (trabajo o descanso), y si el reloj está en funcionamiento. */_defineProperty(this, "handlePlayPause",
















    () => {
      const isPlaying = this.state.isPlaying;

      /* Si el reloj está en funcionamiento, queremos pararlo. */
      if (isPlaying) {
        clearInterval(this.loop);
        this.setState({
          isPlaying: false });

      }
      /* Si en cambio, esta parado, queremos ponerlo en funcionamiento. */else
        {
          this.setState({
            isPlaying: true });


          /* Si está parado se llama al método 'setInterval', que llama a una función cada X milisegundos. En este caso, cada 1000 milisegundos (cada 1 segundo). */
          this.loop = setInterval(() => {
            const clockCount = this.state.clockCount;
            const currentTimer = this.state.currentTimer;
            const breakCount = this.state.breakCount;
            const sessionCount = this.state.sessionCount;

            /* Si la cuenta en segundos llega a cero, la sesión actual que empieza será de descanso si hasta ahora ha sido de trabajo. En caso contrario, será de trabajo. 
            Al mismo tiempo, la cuenta total del tiempo (en segundos) se reinicia. Será la duración establecida para una sesión de descanso por 60 (para convertirlo en segundos) si la sesión que acaba de terminar en una sesión de trabajo. En caso contrario, si la sesión que acaba de terminar ha sido de descanso, la cuenta total del tiempo será la duración establecida por una sesión de trabajo por 60 (para convertirlo en segundos). */
            if (clockCount === 0) {
              this.setState({
                currentTimer: currentTimer === 'Session' ? 'Break' : 'Session',
                clockCount: currentTimer === 'Session' ? breakCount * 60 : sessionCount * 60 });


              /* Si la cuenta en segundos llega a cero, también se reproduce un sonido de alarma. */
              audio.play();
            }
            /* Si la cuenta en segundos no llega a cero, simplemente se actualiza la cuenta total para que se le reste uno cada segundo. */else

              {
                this.setState({
                  clockCount: clockCount - 1 });

              }
          }, 1000);
        }
    });_defineProperty(this, "handleReset",


    () => {
      // Reinicia todos los estados a su valores iniciales. 
      this.setState({
        breakCount: 5,
        sessionCount: 25,
        clockCount: 25 * 60,
        currentTimer: 'Session',
        isPlaying: false });


      // Se limpia el bucle de tiempo, se pausa el audio y se establece de nuevo el mismo desde el principio.
      clearInterval(this.loop);

      audio.pause();
      audio.currentTime = 0;
    });_defineProperty(this, "convertToTime",


    count => {
      let minutes = Math.floor(count / 60);
      let seconds = count % 60;

      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;

      return `${minutes}:${seconds}`;
    });_defineProperty(this, "handleLengthChange",


    (count, timerType) => {
      const sessionCount = this.state.sessionCount;
      const breakCount = this.state.breakCount;
      const isPlaying = this.state.isPlaying;
      const currentTimer = this.state.currentTimer;

      let newCount;

      if (timerType === 'session') {
        newCount = sessionCount + count;
      } else {
        newCount = breakCount + count;
      }

      if (newCount > 0 && newCount < 61 && !isPlaying) {
        this.setState({
          [`${timerType}Count`]: newCount });


        if (currentTimer.toLowerCase() === timerType) {
          this.setState({
            clockCount: newCount * 60 });

        }
      }
    });this.state = { breakCount: 5, sessionCount: 25, clockCount: 25 * 60, // En segundos
      currentTimer: 'Session', isPlaying: false };this.loop = undefined;} // Este método es llamado de forma automática exactamente antes de que el componente sea removido del render. En este caso, se limpia el intervalo, para que no se ejecute el bucle de tiempo cuando el componente no se tiene.
  componentWillUnmount() {clearInterval(this.loop);} /* Controlador del botón de play/pausa */render() {
    const breakCount = this.state.breakCount;
    const sessionCount = this.state.sessionCount;
    const clockCount = this.state.clockCount;
    const currentTimer = this.state.currentTimer;
    const isPlaying = this.state.isPlaying;

    /* Objeto que contiene propiedades de las sesiones de descanso */
    const breakProps = {
      title: 'Break',
      count: breakCount,
      handleDecrease: () => this.handleLengthChange(-1, 'break'),
      handleIncrease: () => this.handleLengthChange(1, 'break') };


    /* Objeto que contiene propiedades de las sesiones de trabajo */
    const sessionProps = {
      title: 'Session',
      count: sessionCount,
      handleDecrease: () => this.handleLengthChange(-1, 'session'),
      handleIncrease: () => this.handleLengthChange(1, 'session') };


    return /*#__PURE__*/(
      React.createElement("div", null, /*#__PURE__*/
      React.createElement("div", { className: "flex" }, /*#__PURE__*/
      React.createElement(SetTimer, breakProps), /*#__PURE__*/
      React.createElement(SetTimer, sessionProps)), /*#__PURE__*/


      React.createElement("div", { className: "clock-container" }, /*#__PURE__*/
      React.createElement("h1", { id: "timer-label" }, currentTimer), /*#__PURE__*/
      React.createElement("span", { id: "time-left" }, this.convertToTime(clockCount)), /*#__PURE__*/

      React.createElement("div", { className: "flex" }, /*#__PURE__*/
      React.createElement("button", { id: "start_stop", onClick: this.handlePlayPause }, /*#__PURE__*/
      React.createElement("i", { className: `fas fa-${isPlaying ? 'pause' : 'play'}` })), /*#__PURE__*/

      React.createElement("button", { id: "reset", onClick: this.handleReset }, /*#__PURE__*/
      React.createElement("i", { className: "fas fa-sync" }))))));




  }}


// Componente funcional sin estado para los temporizadores de descanso y trabajo:
const SetTimer = props => {
  const id = props.title.toLowerCase();

  return /*#__PURE__*/(
    React.createElement("div", { className: "timer-container" }, /*#__PURE__*/
    React.createElement("h2", { id: `${id}-label` },
    props.title, " [Tiempo]"), /*#__PURE__*/

    React.createElement("div", { className: "flex actions-wrapper" }, /*#__PURE__*/
    React.createElement("button", { id: `${id}-decrement`, onClick: props.handleDecrease }, /*#__PURE__*/
    React.createElement("i", { className: "fa-solid fa-arrow-down" })), /*#__PURE__*/


    React.createElement("span", { id: `${id}-length` }, props.count), /*#__PURE__*/

    React.createElement("button", { id: `${id}-increment`, onClick: props.handleIncrease }, /*#__PURE__*/
    React.createElement("i", { className: "fas fa-plus" })))));




};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('app'));