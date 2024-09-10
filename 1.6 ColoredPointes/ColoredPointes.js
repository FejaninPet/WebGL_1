// Вершинный шейдер
var VSHADER_SOURCE = 'attribute vec4 a_Position;\n' +
    'void main() {\n' +
    ' gl_Position = a_Position;\n' +
    ' gl_PointSize = 10.0;\n' +
    '}\n';

// Фрагментный шейдер
var FSHADER_SOURCE = 'precision mediump float;\n' + // тип точности
    'uniform vec4 u_FragColor;\n' +
    'void main() {\n' +
    ' gl_FragColor = u_FragColor;\n' +
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

    // Получить ссылку на uniform-переменную u_FragColor
    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor'); // Если u_FragColor не существует => null
    if (!u_FragColor) {
        console.log('Ошибка получения ссылки на uniform-переменную u_FragColor.');
    }

    // Зарегестрировать ф-цию для вызова по щелчку мыши
    canvas.onmousedown = function (ev) { click(ev, gl, canvas, a_Position, u_FragColor)};

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = [];
var g_colors = [];

function click(ev, gl, canvas, a_Position, u_FragColor) {
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

    // Сохранить цвет в массиве g_color
    if (x >= 0.0 && y >= 0.0) {
        g_colors.push([1.0, 0.0, 0.0, 1.0]);
    } else if (x < 0.0 && y < 0.0) {
        g_colors.push([0.0, 1.0, 0.0, 1.0]);
    }
    else {
        g_colors.push([1.0, 1.0, 1.0, 1.0]);
    }

    // Очистить canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_points.length;
    for (var i = 0; i < len; i++) {
        var xy = g_points[i]
        var rgba = g_colors[i]

        // Передать координаты щелчка в переменную a_Position
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        // Передать цвет в переменную u_FragColor
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3])

        // Нарисовать точку
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}
