// Вершинный шейдер
var VSHADER_SOURCE =
    // формулы
    // x’ = x cos b - y sin b
    // y’ = x sin b + y cos b
    // z’ = z
    'attribute vec4 a_Position;\n' +
    'uniform float u_CosB, u_SinB;\n' +
    'void main() {\n' +
    ' gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;\n' +
    ' gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;\n' +
    ' gl_Position.z = a_Position.z;\n' +
    ' gl_Position.w = 1.0;\n' +
    '}\n';

// Фрагментный шейдер
var FSHADER_SOURCE =
    'void main() {\n' +
    ' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
    '}\n';

// Угол поворота
var ANGLE = 90.0;

// создаем функцию main
function main() {
    // Получить canvas
    var canvas = document.getElementById('webgl');
    if (!canvas) {
        console.log('Используйте браузер, поддерживающий canvas.');
    }

    // Получить контекст отображения для WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Ошибка получения контекста отображения WebGL.');
    }

    // Инициализировать шейдеры
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Ошибка инициализации шейдеров.');
    }

    // Определить координаты вершин
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Ошибка получения положения вершин.');
        return;
    }

    // Передать в вершинный шейдер данные, необходимые для поворота фигуры
    var radian = Math.PI * ANGLE / 180.0 // Преобразовать в радианы
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);
    var u_CosB = gl.getUniformLocation(gl.program, 'u_CosB');
    var u_SinB = gl.getUniformLocation(gl.program, 'u_SinB');
    if (!u_CosB || !u_SinB) {
        console.log('Ошибка передачи u_CosB или u_SinB');
        return;
      }
    gl.uniform1f(u_CosB, cosB);
    gl.uniform1f(u_SinB, sinB);

    // Указать цвет для очистки области рисования <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Очистить <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Нарисовать треугольник
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
    // создать массив с координатами
    var vertices = new Float32Array(
        [0.0, 0.5, -0.5, -0.5, 0.5, -0.5]
    )

    // создать переменную n
    var n = 3;

    // Создать буферный объект
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Ошибка создания объекта буффера.');
        return -1;
    }

    // Определить тип буферного объекта
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // Записать данные в буферный объект
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // создать переменную a_Position и связать его с атрибутом
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Ошибка получения ссылки на переменную атрибут a_Position.');
    }

    // Сохранить ссылку на буферный объект в переменной a_Position
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Разрешить присваивание переменной a_Position
    gl.enableVertexAttribArray(a_Position);

    // вернуть n
    return n;
}
