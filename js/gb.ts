import {ButtonType, GbEmulator} from '../pkg';
import '../static/main.css';
import {GPU} from 'gpu.js';

const gpu = new GPU();

const PIXEL_SCALE = 6;
const CANVAS_ID = 'gb-render-canvas';

let emulator: GbEmulator | null = null;

const fileUpload = document.getElementById('file-upload') as HTMLInputElement;
fileUpload.addEventListener('input', (e) => {
  const romFile = fileUpload.files![0];
  romFile.arrayBuffer().then((buf) => {
    emulator = new GbEmulator(new Uint8Array(buf));
  });
});

const handleKeyEvent = (key: string, pressed: boolean) => {
  if (emulator === null) {
    return;
  }

  switch (key) {
    case 'x':
      emulator.setButtonPressed(ButtonType.A, pressed);
      break;
    case 'z':
      emulator.setButtonPressed(ButtonType.B, pressed);
      break;
    case 'Enter':
      emulator.setButtonPressed(ButtonType.Start, pressed);
      break;
    case 'Shift':
      emulator.setButtonPressed(ButtonType.Select, pressed);
      break;
    case 'ArrowUp':
      emulator.setButtonPressed(ButtonType.Up, pressed);
      break;
    case 'ArrowDown':
      emulator.setButtonPressed(ButtonType.Down, pressed);
      break;
    case 'ArrowLeft':
      emulator.setButtonPressed(ButtonType.Left, pressed);
      break;
    case 'ArrowRight':
      emulator.setButtonPressed(ButtonType.Right, pressed);
      break;
    default:
      console.log(`don't know how to handle: ${key} pressed: ${pressed}`);
      break;
  }
};

document.addEventListener('keydown', (e) => {
  handleKeyEvent(e.key, true);
});

document.addEventListener('keyup', (e) => {
  handleKeyEvent(e.key, false);
});

const ppuWidth = GbEmulator.ppuWidth();
const ppuHeight = GbEmulator.ppuHeight();

const canvas = document.getElementById(CANVAS_ID) as HTMLCanvasElement | null;
console.log(canvas);

if (canvas === null) {
  throw new Error(`could not find canvas with id ${CANVAS_ID}`);
}

canvas.width = ppuWidth * PIXEL_SCALE;
canvas.height = ppuHeight * PIXEL_SCALE;

const render = gpu.createKernel(function(data: number[]) {
  /* eslint-disable no-invalid-this */
  const scale = this.constants.pixelScale as number;
  const ppuWidth = this.constants.width as number;

  const x = Math.floor(this.thread.x / scale);
  const y = Math.floor((this.output.y - 1 - this.thread.y) / scale);
  const offset = ((y * ppuWidth) + x) * 3;

  const red = data[offset] / 255;
  const green = data[offset + 1] / 255;
  const blue = data[offset + 2] / 255;

  this.color(red, green, blue);
  /* eslint-enable */
}, {
  constants: {
    pixelScale: PIXEL_SCALE,
    width: ppuWidth,
  },
  graphical: true,
  output: [ppuWidth * PIXEL_SCALE, ppuHeight * PIXEL_SCALE],
  canvas: canvas,
});

const runTick = () => {
  if (emulator === null) {
    return;
  }

  for (let i = 0; i < 7_500; i++) {
    emulator.step();
  }

  const buffer = emulator.buffer();
  render(buffer);
};

const animationFrame = () => {
  runTick();
  requestAnimationFrame(animationFrame);
};

requestAnimationFrame(animationFrame);
