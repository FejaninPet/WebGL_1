// Вершинный шейдер
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'void main() {\n' +
    '   gl_Position = a_Position;\n' +
    '   gl_PointSize = a_PointSize;\n' +
    '}\n';

// Фрагментный шейдер
var FSHADER_SOURCE =
    'void main() {\n' +
    '   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
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
    gl.drawArrays(gl.POINTS, 0, n)
}

// функция инициализации буфера
function initVertexBuffers(gl) {
    // создать массив с координатами и размером для точек
    var verticesSizes = new Float32Array([
        0.0, 0.5, 10.0,
        -0.5, -0.5, 20.0,
        0.5, -0.5, 30.0,
    ])

    // создать переменную n
    var n = 3;

    // Создать буферный объект
    var vertexSizeBuffer = gl.createBuffer();

    // Определить тип буферного объекта
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);

    // Записать данные в буферный объект
    gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);

    // Определить размер одного "элемента" в массиве
    var FSIZE = verticesSizes.BYTES_PER_ELEMENT;

    // создать переменную a_Position и связать его с атрибутом
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Ошибка получения ссылки на переменную атрибут a_Position.');
        return -1;
    }
    // Сохранить ссылку на буферный объект в переменной a_Position
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0);

    // Разрешить присваивание переменной a_Position
    gl.enableVertexAttribArray(a_Position);

    // создать переменную a_PointSize и связать его с атрибутом
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    if (a_PointSize < 0) {
        console.log('Ошибка получения ссылки на переменную атрибут a_PointSize.');
        return -1;
    }

    // Сохранить ссылку на буферный объект в переменной a_PointSize
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE*3, FSIZE*2);

    // Разрешить присваивание переменной a_PointSize
    gl.enableVertexAttribArray(a_PointSize);

    // вернуть значение переменной n
    return n;
}
