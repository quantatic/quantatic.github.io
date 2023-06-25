import { Link } from "react-router-dom"

export default function Homepage() {
  return (
    <>
      <div>
        <Link to="/gb">GameBoy/GameBoy Color Emulator</Link>
      </div>
      <div>
        <Link to="/gba">GameBoy Advance Emulator</Link>
      </div>
    </>
  )
}