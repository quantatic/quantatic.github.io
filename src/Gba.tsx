import { useEffect, useRef, useState } from 'react';
import { ButtonType, GbaEmulator } from '../emulators-wasm/pkg';
import { GPU } from 'gpu.js';

const PIXEL_SCALE = 5;

const PPU_WIDTH = GbaEmulator.ppuWidth();
const PPU_HEIGHT = GbaEmulator.ppuHeight();

export default function Gba() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [romData, setRomData] = useState<ArrayBuffer | undefined>(undefined);

    const gpu = new GPU();

    useEffect(() => {
        // Ensure that canvas has not been unmounted.
        if (canvasRef.current === null) {
            return;
        }

        if (romData === undefined) {
            return;
        }

        const gba = new GbaEmulator(new Uint8Array(romData));

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
                width: PPU_WIDTH,
            },
            graphical: true,
            output: [PPU_WIDTH * PIXEL_SCALE, PPU_HEIGHT * PIXEL_SCALE],
            canvas: canvasRef.current,
        });

        const CYCLES_PER_SECOND = 16_000_000;

        const runTick = () => {
            const startCycles = gba.cycleCount();
            while (gba.cycleCount() - startCycles < (CYCLES_PER_SECOND / 60)) {
                for (let i = 0; i < 10_000; i++) {
                gba.step();
                }
            }

            const buffer = gba.buffer();
            render(buffer);
        };

        let lastRequestedAnimationFrame: number;
        const animationFrame = () => {
            runTick();
            lastRequestedAnimationFrame = requestAnimationFrame(animationFrame);
        };

        lastRequestedAnimationFrame = requestAnimationFrame(animationFrame);

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
            cancelAnimationFrame(lastRequestedAnimationFrame);
        };
    }, [romData]);

    return (
        <>
            <div>
                <canvas ref={canvasRef}
                        style={{"outline": "1px solid black"}}
                        width={PIXEL_SCALE * PPU_WIDTH}
                        height={PIXEL_SCALE * PPU_HEIGHT}
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
            </div>
        </>
    )
}