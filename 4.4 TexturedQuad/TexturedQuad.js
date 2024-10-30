// Вершинный шейдер
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_TexCoord;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  v_TexCoord = a_TexCoord;\n' +
  '}\n';

// Фрагментный шейдер
var FSHADER_SOURCE =
  // '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  // '#endif\n' +
  'uniform sampler2D u_Sampler;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
  '}\n';

  // Основная функция
function main() {
  // Получить ссылку на canvas
  var canvas = document.getElementById('webgl');
  if (!canvas)  {
    console.log('Используйте браузер, поддерживающий canvas.');
  }

  // Получить контекст отображения для WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Ошибка получения контекста отображения WebGL.');
    return;
  }

  // Инициализировать шейдеры
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Ошибка инициализации шейдеров.');
    return;
  }

  // Определить координаты вершин
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Ошибка получения положения вершин.');
    return;
  }

  // Указать цвет для очистки области рисования <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Set texture
  if (!initTextures(gl, n)) {
    console.log('Ошибка инициализации текстур.');
    return;
  }
}

// функция инициализации буфера
function initVertexBuffers(gl) {
  // создать массив с координатами точек и изображения
  var verticesTexCoords = new Float32Array([
    // Vertex coordinates, texture coordinate
    -0.5,  0.5,   0.0, 1.0,
    -0.5, -0.5,   0.0, 0.0,
     0.5,  0.5,   1.0, 1.0,
     0.5, -0.5,   1.0, 0.0,
  ]);
  // создать переменную n
  var n = 4;

  // Создать буферный объект
  var vertexTexCoordBuffer = gl.createBuffer();
  if (!vertexTexCoordBuffer) {
    console.log('Ошибка создания буферного объекта.');
    return -1;
  }

  // Определить тип буферного объекта
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
  
  // Записать данные в буферный объект
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

  // Определить размер одного "элемента" в массиве
  var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
  
  // создать переменную a_Position и связать его с атрибутом
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
      console.log('Ошибка получения ссылки на переменную атрибут a_Position.');
      return -1;
  }
  // Сохранить ссылку на буферный объект в переменной a_Position
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
  
  // Разрешить присваивание переменной a_Position
  gl.enableVertexAttribArray(a_Position);

  // создать переменную a_TexCoord и связать его с атрибутом
  var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
  if (a_TexCoord < 0) {
    console.log('Ошибка получения ссылки на переменную атрибут a_TexCoord.');
    return -1;
  }

  // Сохранить ссылку на буферный объект в переменной a_TexCoord
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
  
  // Разрешить присваивание переменной a_TexCoord
  gl.enableVertexAttribArray(a_TexCoord);

  // вернуть значение переменной n
  return n;
}

function initTextures(gl, n) {
  // Создать объект текстуры
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Ошибка создания объекта текстуры.');
    return false;
  }

  // Предоставить доступ к переменной u_Sampler
  var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
  if (!u_Sampler) {
    console.log('Ошибка получения доступа к переменной u_Sampler');
    return false;
  }

  // Создать объект изображения
  var image = new Image();
  if (!image) {
    console.log('Ошибка создания объекта изображения.');
    return false;
  }
  // Зарегистрировать обработчик, вызываемый послезагрузки изображения
  image.onload = function(){ loadTexture(gl, n, texture, u_Sampler, image); };
  // Сообщить браузеру откуда загрузить изображение
  image.src = 'sky.jpg';

  return true;
}

function loadTexture(gl, n, texture, u_Sampler, image) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Повернуть ось Y изображения
  // Выбрать текстурный слот 0
  gl.activeTexture(gl.TEXTURE0);
  // Указать тип объекта текстуры
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Определить параметры текстуры
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Определить изображение текстуры
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Определить указатель на текстурный слот 0
  gl.uniform1i(u_Sampler, 0);
  
  gl.clear(gl.COLOR_BUFFER_BIT);   // Очистить <canvas>

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Нарисовать прямоугольник
}
