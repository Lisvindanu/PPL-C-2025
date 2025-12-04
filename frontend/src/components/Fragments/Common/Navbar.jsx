import NavHeader from "../Dashboard/NavHeader";
import NavService from "../Dashboard/NavService";
import NavKategori from "../Dashboard/NavKategori";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-neutral-200 bg-white/95 backdrop-blur">
      <NavHeader />
      <NavKategori />
      <NavService />
    </header>
  );
}
