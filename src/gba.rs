use gba_emulator_core::{
    CYCLES_PER_SECOND,
    Cartridge,
    Cpu,
    Key,
    Lcd,
};

use wasm_bindgen::prelude::*;

use crate::ButtonType;

#[wasm_bindgen]
pub struct GbaEmulator {
    emulator: Cpu,
}

#[wasm_bindgen]
impl GbaEmulator {
    #[wasm_bindgen(constructor)]
    pub fn new(data: Box<[u8]>) -> GbaEmulator {
        let cartridge = Cartridge::new(data.as_ref(), None).unwrap();

        Self {
            emulator: Cpu::new(cartridge),
        }
    }

    pub fn step(&mut self) {
        self.emulator.fetch_decode_execute_no_logs();
    }

    pub fn buffer(&self) -> Vec<u8> {
        let ppu_buffer = self.emulator.bus.lcd.get_buffer();
        ppu_buffer
            .into_iter()
            .flatten()
            .flat_map(|palette_color| {
                [palette_color.red, palette_color.green, palette_color.blue]
                    .map(|color| (color << 3) | (color >> 2))
            })
            .collect()
    }

    #[wasm_bindgen(js_name = setButtonPressed)]
    pub fn set_button_pressed(&mut self, button: ButtonType, pressed: bool) {
        match button {
            ButtonType::A => self.emulator.bus.keypad.set_pressed(Key::A, pressed),
            ButtonType::B => self.emulator.bus.keypad.set_pressed(Key::B, pressed),
            ButtonType::Up => self.emulator.bus.keypad.set_pressed(Key::Up, pressed),
            ButtonType::Down => self.emulator.bus.keypad.set_pressed(Key::Down, pressed),
            ButtonType::Left => self.emulator.bus.keypad.set_pressed(Key::Left, pressed),
            ButtonType::Right => self.emulator.bus.keypad.set_pressed(Key::Right, pressed),
            ButtonType::Select => self.emulator.bus.keypad.set_pressed(Key::Select, pressed),
            ButtonType::Start => self.emulator.bus.keypad.set_pressed(Key::Start, pressed),
        };
    }

    #[wasm_bindgen(js_name = ppuWidth)]
    pub fn ppu_width() -> usize {
        Lcd::LCD_WIDTH
    }

    #[wasm_bindgen(js_name = ppuHeight)]
    pub fn ppu_height() -> usize {
        Lcd::LCD_HEIGHT
    }
}
