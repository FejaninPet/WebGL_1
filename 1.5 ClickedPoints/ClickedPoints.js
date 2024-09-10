// Вершинный шейдер
var VSHADER_SOURCE = 'attribute vec4 a_Position;\n' +
    'void main () {\n' + 
    ' gl_Position = a_Position;\n' + 
    ' gl_PointSize = 10.0;\n' +
    '}\n';

// Фрагментный шейдер
var FSHADER_SOURCE = 'void main () {\n' +
    ' gl_FragColor = vec4(0.5, 0.5, 0.0, 1.0);\n' +
    '}\n';

function main() {
    // Получить ссылку на canvas
    var canvas = document.getElementById('webgl');
    // Получить контекст отображения для WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Ошибка получения контекста отображения WebGL.');
    }
    // Инициализировать шейдеры
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Ошибка инициализации шейдеров.');
    }
    // Получить ссылку на переменную-атрибут a_Position
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Ошибка получения ссылки на переменную-атрибут a_Position.');
    }
    // Зарегестрировать функцию (обработчик) для вызова по щелчку мышью
    canvas.onmousedown = function (ev) {
        click(ev, gl, canvas, a_Position);
    };
    // Указать цвет для очистки области рисования
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Очистить canvas
    gl.clear(gl.COLOR_BUFFER_BIT);
}

// Массив с координатами точек, где выполнялись щелчки
var g_points = [];

function click(ev, gl, canvas, a_Position) {
    var x = ev.clientX; // координата Х указателя мыши
    var y = ev.clientY; // координата Y указателя мыши
    console.log(`x = ${x}; y = ${y}`)
    var rect = ev.target.getBoundingClientRect();

    // Преобразование координат в соответсвтиями с WebGL
    x = ((x - rect.left) - canvas.width/2) / (canvas.width/2);
    y = (canvas.height/2 - (y - rect.top)) / (canvas.height/2);
    console.log(`new_x = ${x}; new_y = ${y}`)
    // Сохранить координаты в массиве g_points
    g_points.push([x, y]);

    // Очистить canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_points.length;
    for (var i = 0; i < len; i++) {
        // Передать координаты щелчка в переменную a_Position
        gl.vertexAttrib3f(a_Position, g_points[i][0], g_points[i][1], 0.0);

        // Нарисовать точку
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}
