// Вершинный шейдер
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_ModelViewMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_ModelViewMatrix * a_Position;\n' +
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
  // Получить доступ к элементу <canvas>
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

  // Определить координаты вершин и цвет
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Ошибка получения положения вершин.');
    return;
  }

  // Указать цвет для очистки области рисования <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Получить ссылку на u_ModelViewMatrix
  var u_ModelViewMatrix = gl.getUniformLocation(gl.program, 'u_ModelViewMatrix');
  if(!u_ModelViewMatrix) { 
    console.log('Не удалось получить ссылка на u_ModelViewMatrix');
    return;
  }

  // Определить матрицу отображения, которая будет использоваться для настройки вида камеры
  var viewMatrix = new Matrix4();
  viewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0);

  // расчитать матрицу вращения
  var modelMatrix = new Matrix4();
  modelMatrix.setRotate(-10, 0, 0, 1);

  // Умножение матрицы отображения на матрицу вращение
  // БОЛЕЕ ЕФФЕКТИВНЫЙ способ, нежели производить данное вычисление для каждой точки в
  // вершинном шейдере
  var modelViewMatrix = viewMatrix.multiply(modelMatrix);

  /// Установить матрицу вращения и отображения
  gl.uniformMatrix4fv(u_ModelViewMatrix, false, modelViewMatrix.elements);

  // Очистить <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Нарисоать треугольники
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
  var verticesColors = new Float32Array([
    // Координаты вершин и цвет (RGBA)
    //X    Y      Z     R     G     B
     0.0,  0.5,  -0.4,  0.4,  1.0,  0.4, // Тот, что позади, зеленый
    -0.5, -0.5,  -0.4,  0.4,  1.0,  0.4,
     0.5, -0.5,  -0.4,  1.0,  0.4,  0.4, 
   
     0.5,  0.4,  -0.2,  1.0,  0.4,  0.4, // Тот, что посередине, желтый
    -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,
     0.0, -0.6,  -0.2,  1.0,  1.0,  0.4, 

     0.0,  0.5,   0.0,  0.4,  0.4,  1.0, // Тот, что спереди, синий 
    -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,
     0.5, -0.5,   0.0,  1.0,  0.4,  0.4, 
  ]);
  var n = 9;

  // Создать буфферный объект
  var vertexColorBuffer = gl.createBuffer();  
  if (!vertexColorBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Записать координаты и цвет в буфферный объект
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
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

  return n;
}
