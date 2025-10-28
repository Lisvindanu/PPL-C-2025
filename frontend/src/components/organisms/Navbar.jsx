import NavHeader from "../molecules/NavHeader";
import NavService from "../molecules/NavService";
import NavKategori from "../molecules/NavKategori";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-neutral-200 bg-white/95 backdrop-blur">
      <NavHeader />
      <NavKategori />
      <NavService />
    </header>
  );
}
