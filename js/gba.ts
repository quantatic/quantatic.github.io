import {ButtonType, GbaEmulator} from '../pkg';
import '../static/main.css';
import {GPU} from 'gpu.js';

const gpu = new GPU();

const PIXEL_SCALE = 5;
const CANVAS_ID = 'gba-render-canvas';

let emulator: GbaEmulator | undefined = undefined;

const romUpload = document.getElementById('rom-upload') as HTMLInputElement;
const saveUpload = document.getElementById('save-upload') as HTMLInputElement;

const handleRomOrSaveUpload = async () => {
  const romFile = romUpload.files?.item(0);

  if (romFile === undefined || romFile === null) {
    console.log('No ROM file has been uploaded yet');
    return;
  }

  const saveFile = saveUpload.files?.item(0);

  const romBuffer = new Uint8Array(await romFile.arrayBuffer());
  let saveBuffer: Uint8Array | undefined;

  if (saveFile === undefined || saveFile === null) {
    saveBuffer = undefined;
  } else {
    saveBuffer = new Uint8Array(await saveFile.arrayBuffer());
  }

  emulator = new GbaEmulator(romBuffer, saveBuffer);
};


saveUpload.addEventListener('input', handleRomOrSaveUpload);
romUpload.addEventListener('input', handleRomOrSaveUpload);

const saveDataDownload = document.getElementById('save-download') as HTMLButtonElement;
saveDataDownload.addEventListener('click', (e) => {
  if (emulator === undefined) {
    console.log('No emulator to generate save data from');
    return;
  }

  const saveData = new Blob([emulator.saveData()]);
  console.log(saveData);

  const a = document.createElement('a');
  a.href = URL.createObjectURL(saveData);
  a.download = `${romUpload.files?.item(0)!.name}.${Date.now()}.sav`;
  a.click();
  a.remove();
});

const handleKeyEvent = (key: string, pressed: boolean) => {
  if (emulator === undefined) {
    return;
  }

  switch (key) {
    case 'x':
      emulator.setButtonPressed(ButtonType.A, pressed);
      break;
    case 'z':
      emulator.setButtonPressed(ButtonType.B, pressed);
      break;
    case 'q':
      emulator.setButtonPressed(ButtonType.L, pressed);
      break;
    case 'e':
      emulator.setButtonPressed(ButtonType.R, pressed);
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

const ppuWidth = GbaEmulator.ppuWidth();
const ppuHeight = GbaEmulator.ppuHeight();

const canvas = document.getElementById(CANVAS_ID) as HTMLCanvasElement | null;

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

const CYCLES_PER_SECOND = 16_000_000;

const runTick = () => {
  if (emulator === undefined) {
    return;
  }

  const startCycles = emulator.cycleCount();
  while (emulator.cycleCount() - startCycles < (CYCLES_PER_SECOND / 60)) {
    for (let i = 0; i < 10_000; i++) {
      emulator.step();
    }
  }

  const buffer = emulator.buffer();
  render(buffer);
};

const animationFrame = () => {
  runTick();
  requestAnimationFrame(animationFrame);
};

requestAnimationFrame(animationFrame);
