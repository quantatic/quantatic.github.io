import { useEffect, useRef, useState } from 'react';
import { ButtonType, GbEmulator } from '../emulators-wasm/pkg';
import { GPU } from 'gpu.js';

    
const PIXEL_SCALE = 6;
const PPU_WIDTH = GbEmulator.ppuWidth();
const PPU_HEIGHT = GbEmulator.ppuHeight();

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

        const gb = new GbEmulator(new Uint8Array(romData));

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

        const runTick = () => {
            for (let i = 0; i < 7_500; i++) {
                gb.step();
            }

            const buffer = gb.buffer();
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
                    gb.setButtonPressed(ButtonType.A, pressed);
                    break;
                case 'z':
                    gb.setButtonPressed(ButtonType.B, pressed);
                    break;
                case 'q':
                    gb.setButtonPressed(ButtonType.L, pressed);
                    break;
                case 'e':
                    gb.setButtonPressed(ButtonType.R, pressed);
                    break;
                case 'Enter':
                    gb.setButtonPressed(ButtonType.Start, pressed);
                    break;
                case 'Shift':
                    gb.setButtonPressed(ButtonType.Select, pressed);
                    break;
                case 'ArrowUp':
                    gb.setButtonPressed(ButtonType.Up, pressed);
                    break;
                case 'ArrowDown':
                    gb.setButtonPressed(ButtonType.Down, pressed);
                    break;
                case 'ArrowLeft':
                    gb.setButtonPressed(ButtonType.Left, pressed);
                    break;
                case 'ArrowRight':
                    gb.setButtonPressed(ButtonType.Right, pressed);
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