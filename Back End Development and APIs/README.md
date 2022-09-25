# DESARROLLO BACK-END Y API'S

En este apartado se recopilan los archivos requeridos de los proyectos NO guiados realizados con `Nodejs`, `Express`, `MongoDB` y `Mongoose` que se piden para obtener la certificación de desarrollo `back-end` y `APIs` de la web `freeCodeCamp`.

------------

##### Resumen:
- **timestamp_microservice**: Creación de un microservicio que se encarga de dar el tiempo Unix y el tiempo UTC para las fechas (YYYY-MM-DD o 'Day Month Year') o marcas temporales que se escriben en el endpoint de la URL. Si no se especifica ninguna, se muestra el tiempo Unix y el tiempo UTC actuales en el momento de ejecutar el microservicio. Por último, si hay alguna marca temporal o fecha mal asignada, el microservicio devolverá error.  

- **request_header_parser_microservice**: Creación de un microservicio que muestra información de la solicitud (la `IP`; el idioma favorito usado para la conexión con el microservicio; y el software elegido para la conexión con el microservicio).

- **url_shortener_microservice**: Creación de un microservicio que devuelve una respuesta `JSON` con un valor numérico entero y único por cada página web introducida en el formulario. Cada una de estas páginas web introducidas en el formulario se registran también como un documento `JSON` junto con sus números enteros en una colección de una base de datos `MongoDB`. Además, si se introduce en la `URL` el valor de un entero numérico, el navegador redireccionará a la página web asociada con el valor de dicho número entero.

- **exercise_tracker_microservice**: Creación de un microservicio que se comporta como un rastreador de ejercicios. Por un lado permite registrar usuarios (y consultar cuántos usuarios registrados hay ya). Además, permite añadir ejercicios para cada usuario especificando una descripción, una duración (en minutos) y una fecha para cada ejercicio (si no se proporciona una fecha, ésta será la fecha actual). Por otra parte, se puede consultar los registros (logs) de ejercicios de cada usuario, de forma que se muestre el número total de ejercicios que ha realizado un usuario (además de la descripción, duración y fecha para cada uno de ellos). Por último, opcionalmente, se pueden consultar los registros de ejercicios de cada usuario durante un intervalo de tiempo específico (especificando una fecha inicial y una fecha límite) o limitar los resultados a un número concreto de ejercicios.

- **file_metadata_microservice**: Creación de un microservicio de metadatos de archivos. Permite subir cualquier archivo de nuestro PC, del que se dará una respuesta `JSON` con su nombre de archivo original, el tipo de archivo, y su tamaño en bytes.
