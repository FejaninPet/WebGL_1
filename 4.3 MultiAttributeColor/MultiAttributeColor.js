// Вершинный шейдер
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'varying vec4 v_Color;\n' + // varying-переменная
    'void main() {\n' +
    '   gl_Position = a_Position;\n' +
    '   gl_PointSize = 10.0;\n' +
    '   v_Color = a_Color;\n' + // Передача данных во фрагментный шейдер
    '}\n';

// Фрагментный шейдер
var FSHADER_SOURCE =
    'precision mediump float;\n' + // квалификатор точности (автор скрыл данный фрагмент в книге)
    'varying vec4 v_Color;\n' + // varying-переменная
    'void main() {\n' +
    '   gl_FragColor = v_Color;\n' + // Принять данные из вершинного шейдера
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
    // создать массив с координатами и и цветом вершин
    var verticesColors = new Float32Array([
        0.0, 0.5, 1.0, 0.0, 0.0,
        -0.5, -0.5, 0.0, 1.0, 0.0,
        0.5, -0.5, 0.0, 0.0, 1.0,
    ]);

    // создать переменную n
    var n = 3;

    // Создать буферный объект
    var vertexColorBuffer = gl.createBuffer();

    // Определить тип буферного объекта
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);

    // Записать данные в буферный объект
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    // Определить размер одного "элемента" в массиве
    var FSIZE = verticesColors.BYTES_PER_ELEMENT;

    // создать переменную a_Position и связать его с атрибутом
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Ошибка получения ссылки на переменную атрибут a_Position.');
        return -1;
    }
    // Сохранить ссылку на буферный объект в переменной a_Position
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);

    // Разрешить присваивание переменной a_Position
    gl.enableVertexAttribArray(a_Position);

    // создать переменную a_Color и связать его с атрибутом
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0) {
        console.log('Ошибка получения ссылки на переменную атрибут a_Color.');
        return -1;
    }

    // Сохранить ссылку на буферный объект в переменной a_PointSize
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE*2);

    // Разрешить присваивание переменной a_PointSize
    gl.enableVertexAttribArray(a_Color);

    // вернуть значение переменной n
    return n;
}
