export default function Card({ title, subtitle, children, className = "" }) {
  return (
    <section className={"rounded-2xl border border-[#D9D9D9] bg-white p-4 sm:p-5 shadow-sm " + className}>
      {title ? (
        <header className="mb-3">
          <h3 className="text-sm font-semibold text-[#2E2A28]">{title}</h3>
          {subtitle ? <p className="mt-1 text-xs text-[#6C5A55]">{subtitle}</p> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
