function main() {
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Ошибка получения доступа к элементу <canvas>.');
        return;
    }

    var canvas_context = canvas.getContext('2d');

    canvas_context.fillStyle = 'rgba(0, 0, 255, 1.0)';
    canvas_context.fillRect(120, 10, 150, 150);
}
