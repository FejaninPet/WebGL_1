function main() {
    var canvas = document.getElementById('webgl');
    gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Ошибка в обращении к элементу canvas.');
    }
    // метод clearColor принимает цвет для заливки/очистки буфера цвета
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // в метод clear передается буфер, который необходимо очистить
    gl.clear(gl.COLOR_BUFFER_BIT);
}
