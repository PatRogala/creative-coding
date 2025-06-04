const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 600, 600 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.lineWidth = width * 0.01;
    context.strokeStyle = 'white';

    const w = 80;
    const h = 80;
    const gap = 20;
    const rows = 5;
    const cols = 5;
    const change_for_double_line = 0.5;
    const double_line_padding = 6;
    let x, y;

    const start_padding = (width - (w * cols + gap * (cols - 1))) * 0.5;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        x = start_padding + (w + gap) * i;
        y = start_padding + (h + gap) * j;

        context.beginPath();
        context.rect(x, y, w, h);
        context.stroke();

        if (Math.random() > change_for_double_line) {
          context.beginPath();
          context.rect(x + double_line_padding, y + double_line_padding, w - double_line_padding * 2, h - double_line_padding * 2);
          context.stroke();
        }
      }
    }
  };
};

canvasSketch(sketch, settings);
