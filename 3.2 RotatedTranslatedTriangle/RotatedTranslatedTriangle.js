// Вершинный шейдер
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'void main() {\n' +
    ' gl_Position = u_ModelMatrix * a_Position;\n' +
    '}\n';

// Фрагментный шейдер
var FSHADER_SOURCE =
    'void main() {\n' +
    ' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
    '}\n';

// Угол поворота
var ANGLE = 10.0;
var Tx = 0.5, Ty = 0.5, Tz = 0.0;

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

    // Создать объект Matrix4
    var modelMatrix = new Matrix4();
    console.log(modelMatrix);

    // Cоздать матрицу вращения и перемещения в переменной ModelMatrix
    console.log(modelMatrix);
    modelMatrix.setRotate(ANGLE, 0, 0, 1);
    modelMatrix.translate(Tx, 0, 0);

    // Получить ссылку на переменную u_ModelMatrix
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Ошибка передачи u_xformMatrix.');
        return;
    }
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    // Указать цвет для очистки области рисования <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Очистить <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Нарисовать треугольник
    gl.drawArrays(gl.TRIANGLES, 0, n);
}


function initVertexBuffers(gl) {
    // создать массив с координатами
    var vertices = new Float32Array([
        0.0, 0.3, -0.3, -0.3, 0.3, -0.3
    ])

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
    gl.enableVertexAttribArray(a_Position)

    // вернуть n
    return n;
}
