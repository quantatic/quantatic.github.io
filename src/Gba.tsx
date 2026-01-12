import { useEffect, useRef, useState } from 'react';
import { ButtonType, GbaEmulator } from '../emulators-wasm/pkg';
import { GPU, IKernelRunShortcut } from 'gpu.js';

const DEFAULT_PIXEL_SCALE = 5;
const PIXEL_SCALE_OPTIONS = Array.from({length: 10}).map((_val, idx) => idx + 1);

const PPU_WIDTH = GbaEmulator.ppuWidth();
const PPU_HEIGHT = GbaEmulator.ppuHeight();
const CYCLES_PER_SECOND = GbaEmulator.cyclesPerSecond();

export default function Gba() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [romData, setRomData] = useState<ArrayBuffer | undefined>(undefined);
    const [pixelScale, setPixelScale] = useState(DEFAULT_PIXEL_SCALE);

    const renderKernelRef = useRef<IKernelRunShortcut | null>(null);
    useEffect(() => {
        const gpu = new GPU();
        renderKernelRef.current = gpu.createKernel(function(data: number[]) {
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
                pixelScale: pixelScale,
                width: PPU_WIDTH,
            },
            output: [PPU_WIDTH * pixelScale, PPU_HEIGHT * pixelScale],
            graphical: true
        });
    }, [pixelScale]);

    const renderFunction = (data: Uint8Array) => {
        // Ensure that canvas ref actually exists.
        if (canvasRef.current === null) {
            return;
        }

        // Ensure that kernel ref is initialized.
        if (renderKernelRef.current === null) {
            return;
        }

        renderKernelRef.current(data);

        const kernelCanvas = renderKernelRef.current.canvas as HTMLCanvasElement;
        canvasRef.current.getContext('2d')?.drawImage(kernelCanvas, 0, 0);
    };

    useEffect(() => {
        // Ensure that canvas has not been unmounted.
        if (canvasRef.current === null) {
            return;
        }

        if (romData === undefined) {
            return;
        }

        let gba: GbaEmulator;
        try {
            gba = new GbaEmulator(new Uint8Array(romData));
        } catch (e) {
            console.error(e);
            return;
        }

	const RENDER_FPS = 60;
        const runTick = () => {
            const startCycles = gba.cycleCount();
            while (gba.cycleCount() - startCycles < (CYCLES_PER_SECOND / RENDER_FPS)) {
                for (let i = 0; i < 10_000; i++) {
                    gba.step();
                }
            }

            const buffer = gba.buffer();
            renderFunction(buffer);
        };

	let animationFrameInterval = setInterval(runTick, 1_000 / RENDER_FPS);

        const handleKeyEvent = (key: string, pressed: boolean) => {
            switch (key) {
                case 'x':
                    gba.setButtonPressed(ButtonType.A, pressed);
                    break;
                case 'z':
                    gba.setButtonPressed(ButtonType.B, pressed);
                    break;
                case 'q':
                    gba.setButtonPressed(ButtonType.L, pressed);
                    break;
                case 'e':
                    gba.setButtonPressed(ButtonType.R, pressed);
                    break;
                case 'Enter':
                    gba.setButtonPressed(ButtonType.Start, pressed);
                    break;
                case 'Shift':
                    gba.setButtonPressed(ButtonType.Select, pressed);
                    break;
                case 'ArrowUp':
                    gba.setButtonPressed(ButtonType.Up, pressed);
                    break;
                case 'ArrowDown':
                    gba.setButtonPressed(ButtonType.Down, pressed);
                    break;
                case 'ArrowLeft':
                    gba.setButtonPressed(ButtonType.Left, pressed);
                    break;
                case 'ArrowRight':
                    gba.setButtonPressed(ButtonType.Right, pressed);
                    break;
                default:
                    console.log(`don't know how to handle: ${key} pressed: ${pressed}`);
                    break;
            }
        };

        const keyDownListener = (e: KeyboardEvent) => {
            handleKeyEvent(e.key, true);
        };

        const keyUpListener = (e: KeyboardEvent) => {
            handleKeyEvent(e.key, false);
        };

        document.addEventListener('keydown', keyDownListener);
        document.addEventListener('keyup', keyUpListener);

        return () => {
            document.removeEventListener('keydown', keyDownListener);
            document.removeEventListener('keyup', keyUpListener);
            clearInterval(animationFrameInterval)
        };
    }, [romData]);

    return (
        <>
            <div>
                <canvas ref={canvasRef}
                        style={{"outline": "1px solid black"}}
                        width={pixelScale * PPU_WIDTH}
                        height={pixelScale * PPU_HEIGHT}
                />
            </div>

            <div>
                <input type="file" onChange={(e) => {
                    const romFile = e.target.files?.item(0) ?? undefined;

                    if (romFile === undefined) {
                        setRomData(undefined);
                        return;
                    }

                    romFile
                        .arrayBuffer()
                        .then(setRomData)
                        .catch((err) => {
                            console.error(err);
                            setRomData(undefined);
                        });
                }} />

            <br />
            <br />
            <div>
                <select defaultValue={DEFAULT_PIXEL_SCALE} onChange={(e) => setPixelScale(Number(e.target.value))}>
                    {PIXEL_SCALE_OPTIONS.map(scaleOption => {
                        return (
                            <option value={scaleOption} key={scaleOption}>
                                Scale {scaleOption}x
                            </option>
                        )
                    })}
                </select>
            </div>
            </div>
        </>
    )
}
