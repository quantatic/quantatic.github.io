pub mod gb;
pub mod gba;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub enum ButtonType {
    A,
    B,
    Up,
    Down,
    Left,
    Right,
    Select,
    Start,
    L,
    R,
}