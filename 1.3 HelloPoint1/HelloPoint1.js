// Вершинный шейдер
var VSHADER_SOURCE = 
    'void main() {\n' +
    ' gl_Position = vec4(0.5, -0.3, 0.0, 1.0);\n' + //Координаты
    ' gl_PointSize = 10.0;\n' + //Установить размер точки
    '}\n';

// Фрагментный шейдер
var FSHADER_SOURCE = 
    'void main() {\n' +
    ' gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n' + //Установить цвет
    '}\n';

function main() {
    // Получить ссылку на элемент canvas
    var canvas = document.getElementById('webgl');
    // Получить контекст отображения для WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Ошибка получения контекста отображения для WebGL');
        return;
    }

    // Инициализация шейдеров
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Ошибка инициализации шейдеров')
    }

    // Указываем цвет очистки canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Очистить canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Рисуем точку
    gl.drawArrays(gl.POINTS, 0, 1);
}
