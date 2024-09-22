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

// Угол поворота (град/сек)
var ANGLE_STEP = 20.0;

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
    modelMatrix.setRotate(ANGLE_STEP, 0, 0, 1);

    // Указать цвет для очистки области рисования <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Получить ссылку на переменную u_ModelMatrix
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Ошибка передачи u_xformMatrix.');
        return;
    }
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    // Текущий угол поворота треугольника
    var currentAngle = 0.0;

    // Объект Matrix4 для модели преобразования
    var modelMatrix = new Matrix4();

    // Начать рисование треугольника
    var tick = function () {
        currentAngle = animate(currentAngle);// Изменить угол поворота
        draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);
        requestAnimationFrame(tick);// Потребовать от браузера вызвать tick
    };
    tick();
}


function initVertexBuffers(gl) {
    // создать массив с координатами
    var vertices = new Float32Array([
        0.0, 0.2, -0.2, -0.2, 0.2, -0.2
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

function draw(gl,n, currentAngle, modelMatrix, u_ModelMatrix) {
    // Определить матрицу вращения
    modelMatrix.setRotate(currentAngle, 0, 0, 1);

    // смещение
    modelMatrix.translate(0.2 + currentAngle / 720, 0, 0);

    // Передать матрицу в вершинный шейдер (вращение)
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    // Очистить <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Нарисовать треугольник
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

// Момент времени, когда функция была вызвана в последний раз
var g_last = Date.now();

function animate(angle) {
    // Вычислить прошедшее время
    var now = Date.now();

    var elapsed = now - g_last; // в миллисекундах
    g_last = now;

    // Изменить текущий угол поворота (в соответствии с прошедшим временем)
    var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    console.log(newAngle);
    return newAngle %= 360;
}
