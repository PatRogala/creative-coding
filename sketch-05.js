const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
	dimensions: [ 1080, 1080 ]
};

let manager;

let logoImage;
let fontFamily = 'serif';

const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

const loadImage = (url) => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject();
		img.src = url;
	});
};

const sketch = ({ context, width, height }) => {
	const cell = 20;
	const cols = Math.floor(width  / cell);
	const rows = Math.floor(height / cell);
	const numCells = cols * rows;

	typeCanvas.width  = cols;
	typeCanvas.height = rows;

	return ({ context, width, height }) => {
		typeContext.fillStyle = 'black';
		typeContext.fillRect(0, 0, cols, rows);

		if (logoImage) {
			const imageAspect = logoImage.width / logoImage.height;
			const canvasAspect = cols / rows;

			let drawWidth, drawHeight;
			if (imageAspect > canvasAspect) {
				drawWidth = cols * 0.8;
				drawHeight = drawWidth / imageAspect;
			} else {
				drawHeight = rows * 0.8;
				drawWidth = drawHeight * imageAspect;
			}

			const x = (cols - drawWidth) * 0.5;
			const y = (rows - drawHeight) * 0.5;

			typeContext.drawImage(logoImage, x, y, drawWidth, drawHeight);
		}

		const typeData = typeContext.getImageData(0, 0, cols, rows).data;

		context.fillStyle = 'black';
		context.fillRect(0, 0, width, height);

		context.textBaseline = 'middle';
		context.textAlign = 'center';

		for (let i = 0; i < numCells; i++) {
			const col = i % cols;
			const row = Math.floor(i / cols);

			const x = col * cell;
			const y = row * cell;

			const r = typeData[i * 4 + 0];
			const g = typeData[i * 4 + 1];
			const b = typeData[i * 4 + 2];
			const a = typeData[i * 4 + 3];

			const glyph = getGlyph(r);

			context.font = `${cell * 2}px ${fontFamily}`;
			if (Math.random() < 0.1) context.font = `${cell * 6}px ${fontFamily}`;

			context.fillStyle = 'white';

			context.save();
			context.translate(x, y);
			context.translate(cell * 0.5, cell * 0.5);

			context.fillText(glyph, 0, 0);

			context.restore();

		}
	};
};

const getGlyph = (v) => {
	if (v < 50) return '';
	if (v < 100) return '.';
	if (v < 150) return '-';
	if (v < 200) return '+';

	const glyphs = '_= /'.split('');

	return random.pick(glyphs);
};

const start = async () => {
	try {
		logoImage = await loadImage('./logo.png');
		manager = await canvasSketch(sketch, settings);
	} catch (error) {
		console.error('Error loading image:', error);
	}
};

start();
