/* Добавляем 3 точки на экран (по клику). С добавлением 
каждой новой точкой, 3-я точка смещается по оси Y. */


// Вершинный шейдер
var VSHADER_SOURCE = 'attribute vec4 a_Position;\n' +
    'void main() {\n' +
    ' gl_Position = a_Position;\n' +
    ' gl_PointSize = 10.0;\n' +
    '}\n';

// Фрагментный шейдер
var FSHADER_SOURCE = 'void main () {\n' +
' gl_FragColor = vec4(0.5, 0.5, 0.0, 1.0);\n' +
'}\n';

function main() {
    // Получить ссылку на canvas
    canvas = document.getElementById('webgl');

    // Получить контекст отображения для WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Ошибка получения контекста отображения для WebGL.');
    }

    // Инициализация шейдеров
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Ошибка инициализации шейдеров.');
    }

    // Получить ссылку на переменную-атрибут на a_Position
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position'); // Если a_Position не существует => -1
    if (a_Position < 0) {
        console.log('Ошибка получения ссылки на переменную-атрибут a_Position.');
    }

    // Зарегестрировать ф-цию для вызова по щелчку мыши
    canvas.onmousedown = function (ev) { click(ev, gl, canvas, a_Position)};

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = [];
var g_colors = [];

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
    g_points.push([x, y]);

    // Очистить canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    console.log(g_points);

    if (g_points.length > 3) {
        console.log('Hi...')
        console.log(g_points[2][1]);
        g_points[2][1] += 0.1;
    }

    var len = g_points.length;
    for (var i = 0; i < len; i++) {
        var xy = g_points[i]
        var rgba = g_colors[i]

        // Передать координаты щелчка в переменную a_Position
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);

        // Нарисовать точку
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}
