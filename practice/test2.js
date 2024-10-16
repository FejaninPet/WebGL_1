// Вершинный шейдер
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'void main() {\n' +
    ' gl_Position = a_Position;\n' +
    '}\n';

// Фрагментный шейдер
var FSHADER_SOURCE =
    'void main() {\n' +
    ' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
    '}\n';

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

    // Получить ссылку на переменную-атрибут на a_Position
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position'); // Если a_Position не существует => -1
    if (a_Position < 0) {
        console.log('Ошибка получения ссылки на переменную-атрибут a_Position.');
    }

    // Указать цвет для очистки области рисования <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Определить координаты вершин
    var n = initVertexBuffers(gl, a_Position, null, null);
    if (n < 0) {
        console.log('Ошибка получения положения вершин.');
        return;
    }   

    // Нарисовать прямоугольник
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // +
    // gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
    // gl.drawArrays(gl.TRIANGLES, 0, n);

    // Зарегестрировать ф-цию для вызова по щелчку мыши
    canvas.onmousedown = function (ev) { click(ev, gl, canvas, a_Position)};    
}

var g_points = [
    -0.5, 0.5,
    -0.5, -0.0,
    -0.3, 0.5,
    -0.3, -0.0,
    -0.1, 0.5,
    -0.1, -0.0,
    0.2, 0.5,
    0.2, -0.0,
    0.5, 0.5,
    0.5, -0.0,
    0.8, 0.5,
    0.8, -0.0, // x3
    0.8, -0.0, // x3
    0.8, -0.0, // x3
    0.8, -0.5,
    0.5, -0.0,
    0.5, -0.5,
    0.2, -0.0,
    0.2, -0.5,
    -0.1, -0.0,
    -0.1, -0.5,
    // и т.д
    
];

function initVertexBuffers(gl, a_Position, x, y) {

    console.log(g_points);
    let vertices = 0;
    console.log(vertices);


    // создать массив с точками
    vertices = new Float32Array(g_points)
    console.log(vertices);
    if (x && y) {
        vertices[vertices.length - 2] = x;
        vertices[vertices.length - 1] = y;
    }
    console.log(vertices);

    // указываем количество вершин
    var n = vertices.length / 2;

    // Создать буферный объект
    var vertexBuffer = gl.createBuffer()
    if (!vertexBuffer) {
        console.log('Ошибка создания объекта буффера.');
        return -1;
    }

    // Определить тип буферного объекта
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // Записать данные в буферный объект
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Сохранить ссылку на буферный объект в переменной a_Position
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Разрешить присваивание переменной a_Position
    gl.enableVertexAttribArray(a_Position);

    // Очистить <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Нарисовать прямоугольник
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // +
    // gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
    // gl.drawArrays(gl.TRIANGLES, 0, n);

    // Вернуть количество вершин
    return n;
}

function click(ev, gl, canvas, a_Position) {
    var x = ev.clientX; // координата Х указателя мыши
    var y = ev.clientY; // координата Y указателя мыши
    console.log(`x = ${x}; y = ${y}`)
    var rect = ev.target.getBoundingClientRect();

    // Преобразование координат в соответствии с WebGL
    x = ((x - rect.left) - canvas.width/2) / (canvas.width/2);
    y = (canvas.height/2 - (y - rect.top)) / (canvas.height/2);
    console.log(`new_x = ${x}; new_y = ${y}`)
    // Сохранить координаты в массиве g_points
    // g_points.push([x, y]);
    // g_points[-2] = x;
    // g_points[-1] = y;

    var n = initVertexBuffers(gl, a_Position, x, y);
}
