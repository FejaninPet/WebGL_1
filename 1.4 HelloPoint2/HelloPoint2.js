var VSHADER_SOURCE = 'attribute vec4 a_Position;\n' + // Добавляем атрибуты для получения данных из JS
    'attribute float a_PointSize;\n' +
    'void main() {\n' +
    ' gl_Position = a_Position;\n' +
    ' gl_PointSize = a_PointSize;\n' +
    '}\n';

var FSHADER_SOURCE = 'void main() {\n' +
    ' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
    '}\n';

function main() {
    // Получить ссылку на canvas
    var canvas = document.getElementById('webgl');
    // Получить контекст отображения для WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Ошибка получения контекста отображения для WebGL');
    }
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Ошибка инициализации шейдеров');
    }

    // Получить ссылку на переменную атрибут
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Ошибка получения ссылки на переменную a_Position');
    }
    // Получить ссылку на переменную атрибут
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');

    // Сохранить координаты в переменной-атрибуте (ссылка_на_переменную, x, y, z)
    gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
    // Сохранить координаты в переменной-атрибуте
    gl.vertexAttrib1f(a_PointSize, 50.0);

    // Указать цвет для очистки области рисования
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Очистить canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Нарисовать точку
    gl.drawArrays(gl.POINTS, 0, 1);
}
