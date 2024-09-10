// Вершинный шейдер
var VSHADER_SOURCE = 
    'attribute vec4 a_Position;\n' +
    'void main() {\n' +
    ' gl_Position = a_Position;\n' +
    ' gl_PointSize = 10.0;\n' +
    '}\n';

var FSHADER_SOURCE = 
    'void main() {\n' +
    ' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
    '}\n';

function main() {
    // Получить ссылку на canvas
    canvas = document.getElementById('webgl');
    if (!canvas) {
        console.log('Используйте браузер, поддерживающий canvas.');
    }

    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;

    // Получить контекст отображения для WebGL
    gl = getWebGLContext(canvas);
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

    // Указать цвет для очистки области рисования <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Очистить <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Нарисовать три точки
    gl.drawArrays(gl.POINTS, 0, n); // n = 3
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);
    var n = 3; // число вершин

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

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Ошибка получения ссылки на переменную атрибут a_Position.');
    }

    // Сохранить ссылку на буферный объект в переменной a_Position
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Разрешить присваивание переменной a_Position
    gl.enableVertexAttribArray(a_Position);

    return n;
}
