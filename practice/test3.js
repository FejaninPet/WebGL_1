// Вершинный шейдер
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_ViewMatrix * a_Position;\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

// Фрагментный шейдер
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
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

  // Получить ссылку на переменную-атрибут на a_Position
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position'); // Если a_Position не существует => -1
  if (a_Position < 0) {
      console.log('Ошибка получения ссылки на переменную-атрибут a_Position.');
  }

  // Получить ссылку на u_ViewMatrix
  var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) { 
    console.log('Не удалось получить ссылка на u_ViewMatrix');
    return;
  }

  // Указать цвет для очистки области рисования <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Определить координаты вершин и цвет
  var n = initVertexBuffers(gl, a_Position, u_ViewMatrix);
  if (n < 0) {
    console.log('Ошибка получения положения вершин.');
    return;
  }

  // Зарегестрировать ф-цию для вызова по щелчку мыши
  // canvas.onmousedown = function (ev) { click(ev, gl, a_Position, u_ViewMatrix)};
  // ИЛИ
  // Анимация вращения
  var tick = function () {
    var n = initVertexBuffers(gl, a_Position, u_ViewMatrix);
    requestAnimationFrame(tick);// Потребовать от браузера вызвать tick
  };
  tick();
}

var pointsColor = [
    // Координаты вершин и цвет (RGBA)
    //X    Y      Z     R     G     B
     0.0,  0.5,  -0.4,  0.4,  1.0,  0.4, // Тот, что сзади, зеленый
    -0.5, -0.5,  -0.4,  0.4,  1.0,  0.4,
     0.5, -0.5,  -0.4,  1.0,  0.4,  0.4, 
   
     0.5,  0.4,  -0.2,  1.0,  0.4,  0.4, // Тот, что посередине, желтый
     -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,
     0.0, -0.6,  -0.2,  1.0,  1.0,  0.4, 

     0.0,  0.5,   0.0,  0.4,  0.4,  1.0,  // Тот, что спереди, синий 
     -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,
     0.5, -0.5,   0.0,  1.0,  0.4,  0.4, 
  ];

  var verticesColors = new Float32Array(pointsColor);
  var n = 9;

var startPoint1 = 90; // градусы
var startPoint2 = 210; // градусы
var startPoint3 = 330; // градусы

var step = 1;

function initVertexBuffers(gl, a_Position, u_ViewMatrix) {
  // вращение переднего треугольника
  startPoint1 += step;
  startPoint2 += step;
  startPoint3 += step;
  verticesColors[verticesColors.length - 6] = Math.cos(toRadians(startPoint3))/2; // X
  verticesColors[verticesColors.length - 5] = Math.sin(toRadians(startPoint3))/2;  // Y
  verticesColors[verticesColors.length - 12] = Math.cos(toRadians(startPoint2))/2; // X
  verticesColors[verticesColors.length - 11] = Math.sin(toRadians(startPoint2))/2;  // Y
  verticesColors[verticesColors.length - 18] = Math.cos(toRadians(startPoint1))/2; // X
  verticesColors[verticesColors.length - 17] = Math.sin(toRadians(startPoint1))/2;  // Y

  // Создать буфферный объект
  var vertexColorbuffer = gl.createBuffer();  
  if (!vertexColorbuffer) {
    console.log('Ошибка создания буфферного объекта');
    return -1;
  }

  // Записать координаты и цвет в буфферный объект
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  var FSIZE = verticesColors.BYTES_PER_ELEMENT;
  // Получить ссылку на a_Position
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0) {
    console.log('Ошибка получения ссылки на a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);

  // Получить ссылку на  a_Color
  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(a_Color < 0) {
    console.log('Ошибка получения ссылки на a_Color');
    return -1;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);

  // Отмените привязку буферного объекта
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Установите матрицу, которая будет использоваться для настройки вида камеры
  var viewMatrix = new Matrix4();
  // координаты точки наблюдения (0.2, 0.25, 0.25)
  // координаты точки направления взгляда (0, 0, 0)
  // координаты направления вверх (0, 1, 0)
  viewMatrix.setLookAt(0.2 , 0.25, 0.25, 0, 0, 0, 0, 1, 0);

  // Установите матрицу просмотра
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  // Очистить <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Нарисовать треугольники
  gl.drawArrays(gl.TRIANGLES, 0, n);

  return n;
}

function click(ev, gl, a_Position, u_ViewMatrix) {
    var n = initVertexBuffers(gl, a_Position, u_ViewMatrix);
}

function toRadians (angle) {
    return angle * (Math.PI / 180);
  }