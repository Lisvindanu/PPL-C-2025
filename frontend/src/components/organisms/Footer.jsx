import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  const footerLinks = {
    kategori: [
      { label: "Pengembangan Website", path: "/kategori/pengembangan-website" },
      { label: "Pengembangan Aplikasi Mobile", path: "/kategori/pengembangan-aplikasi-mobile" },
      { label: "UI/UX Design", path: "/kategori/ui-ux-design" },
      { label: "Data Science & ML", path: "/kategori/data-science-machine-learning" },
      { label: "Cybersecurity & Testing", path: "/kategori/cybersecurity-testing" },
      { label: "Copy Writing", path: "/kategori/copy-writing" },
    ],
    tentang: [
      { label: "Tentang Kami", path: "/tentang" },
      { label: "Cara Kerja", path: "/cara-kerja" },
      { label: "Blog", path: "/blog" },
      { label: "Karir", path: "/karir" },
      { label: "Press Kit", path: "/press" },
    ],
    bantuan: [
      { label: "FAQ", path: "/faq" },
      { label: "Hubungi Kami", path: "/kontak" },
      { label: "Syarat & Ketentuan", path: "/syarat-ketentuan" },
      { label: "Kebijakan Privasi", path: "/kebijakan-privasi" },
      { label: "Pusat Bantuan", path: "/bantuan" },
    ],
  };

  return (
    <footer className="bg-gradient-to-b from-[#1D375B] to-[#0f1f36] text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <img
                src="/LogoSkillConnect.png"
                alt="SkillConnect"
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-white/80 text-sm mb-6">
              Platform terpercaya untuk menghubungkan klien dengan freelancer profesional di Indonesia.
            </p>
            {/* Social Media */}
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in" />
              </a>
            </div>
          </div>

          {/* Kategori */}
          <div>
            <h4 className="font-bold text-lg mb-4">Kategori</h4>
            <ul className="space-y-2">
              {footerLinks.kategori.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-white/80 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Tentang */}
          <div>
            <h4 className="font-bold text-lg mb-4">Tentang</h4>
            <ul className="space-y-2">
              {footerLinks.tentang.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-white/80 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h4 className="font-bold text-lg mb-4">Bantuan</h4>
            <ul className="space-y-2">
              {footerLinks.bantuan.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-white/80 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              © 2025 SkillConnect. All rights reserved.
            </p>
            <div className="flex gap-6">
              <button
                onClick={() => navigate("/syarat-ketentuan")}
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Syarat & Ketentuan
              </button>
              <button
                onClick={() => navigate("/kebijakan-privasi")}
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Kebijakan Privasi
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
