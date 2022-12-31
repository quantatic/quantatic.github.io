use gb_emulator_core::{
    cartridge::Cartridge,
    cpu::Cpu,
    joypad::Button,
    ppu::{PPU_HEIGHT, PPU_WIDTH},
};

use wasm_bindgen::prelude::*;

use crate::ButtonType;

#[derive(Debug)]
#[wasm_bindgen]
pub struct GbEmulator {
    emulator: Cpu,
}

#[wasm_bindgen]
impl GbEmulator {
    #[wasm_bindgen(constructor)]
    pub fn new(data: Box<[u8]>) -> GbEmulator {
        let cartridge = Cartridge::new(data.as_ref()).expect("invalid cartridge data");

        Self {
            emulator: Cpu::new(cartridge),
        }
    }

    pub fn step(&mut self) {
        self.emulator.fetch_decode_execute();
    }

    pub fn buffer(&self) -> Vec<u8> {
        let ppu_buffer = self.emulator.bus.ppu.get_buffer();
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
            ButtonType::A => self.emulator.set_button_pressed(Button::A, pressed),
            ButtonType::B => self.emulator.set_button_pressed(Button::B, pressed),
            ButtonType::Up => self.emulator.set_button_pressed(Button::Up, pressed),
            ButtonType::Down => self.emulator.set_button_pressed(Button::Down, pressed),
            ButtonType::Left => self.emulator.set_button_pressed(Button::Left, pressed),
            ButtonType::Right => self.emulator.set_button_pressed(Button::Right, pressed),
            ButtonType::Select => self.emulator.set_button_pressed(Button::Select, pressed),
            ButtonType::Start => self.emulator.set_button_pressed(Button::Start, pressed),
            _ => {}, // ignore L/R buttons as these don't exist on GB.
        };
    }

    #[wasm_bindgen(js_name = ppuWidth)]
    pub fn ppu_width() -> usize {
        PPU_WIDTH
    }

    #[wasm_bindgen(js_name = ppuHeight)]
    pub fn ppu_height() -> usize {
        PPU_HEIGHT
    }
}