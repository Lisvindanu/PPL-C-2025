import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import Button from "../atoms/Button";
import Avatar from "../atoms/Avatar";
import useUserIdentity from "../../hooks/useUserIdentity";

function ProfileDropdown({
  name,
  email,
  avatarUrl,
  onProfile,
  onDashboard,
  onLogout,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 px-2 py-1 rounded-2xl hover:bg-neutral-100"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Avatar src={avatarUrl} alt={name} size="sm" />
        <div className="flex-col items-start hidden leading-tight text-left md:flex">
          <span className="text-sm font-semibold text-neutral-900">{name}</span>
          <span className="text-[11px] text-neutral-500">{email}</span>
        </div>
        <svg
          className={`h-4 w-4 text-neutral-600 transition ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 w-56 mt-2 overflow-hidden bg-white border shadow-lg rounded-xl border-neutral-200"
        >
          <button
            type="button"
            role="menuitem"
            onClick={onProfile}
            className="w-full px-4 py-2 text-sm text-left hover:bg-neutral-50"
          >
            Profile
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={onDashboard}
            className="w-full px-4 py-2 text-sm text-left hover:bg-neutral-50"
          >
            Dashboard
          </button>
          <div className="h-px my-1 bg-neutral-200" />
          <button
            type="button"
            role="menuitem"
            onClick={onLogout}
            className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

function NotificationDialog({ name, avatarUrl, messages }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-full hover:bg-neutral-100"
        aria-label="Buka notifikasi"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="absolute bg-red-500 rounded-full top-2 right-2 size-2" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-bell-icon lucide-bell"
        >
          <path d="M10.268 21a2 2 0 0 0 3.464 0" />
          <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          className="absolute z-20 mt-2 bg-white border border-black shadow-lg -right-2.5 w-80 rounded-xl before:absolute before:-top-2 before:right-5 before:w-4 before:h-4 before:bg-white before:border-l before:border-t before:border-black before:transform before:rotate-45"
        >
          <div className="p-4">
            <h3 className="mb-2 text-lg font-semibold border-b border-black">
              Notifikasi
            </h3>
            {messages.length === 0 ? (
              <p className="text-sm text-neutral-500">
                Tidak ada notifikasi baru.
              </p>
            ) : (
              <ul className="overflow-y-auto max-h-40">
                {messages.map((msg, index) => (
                  <li key={index} className="mb-2">
                    <Button
                      variant="link"
                      className="flex items-center w-full gap-2 !p-0 rounded-md text-start hover:bg-neutral-200"
                    >
                      <Avatar
                        src={avatarUrl}
                        alt={name}
                        size="sm"
                        className="ml-2"
                      />
                      <div>
                        <p className="text-sm font-medium">{name}</p>
                        <p className="text-sm text-neutral-600">{msg}</p>
                      </div>
                    </Button>
                  </li>
                ))}
                <li className="w-full text-center border-t border-black">
                  <Button
                    variant="link"
                    className="!p-0 text-sm rounded-none hover:underline"
                  >
                    Lihat semua notifikasi
                  </Button>
                </li>
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function NavHeader() {
  const navigate = useNavigate();
  const { loading, fullName, email, avatarUrl } = useUserIdentity();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = () => navigate("/login");
  const handleProfile = () => navigate("/profile");
  const handleDashboard = () => navigate("/dashboard");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login", { replace: true });
  };

  return (
    <>
      <div className="flex items-center h-16 gap-3 px-3 mx-auto max-w-7xl sm:px-4">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className="flex items-center" aria-label="Ke beranda">
            <img
              src="/LogoSkillConnect.png"
              alt="SkillConnect Logo"
              className="object-contain w-auto h-8"
            />
          </a>
        </div>

        {/* Search Bar */}
        <div className="justify-center flex-1 hidden px-4 sm:flex">
          <SearchBar />
        </div>

        {/* Right side - Login button or Profile dropdown */}
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="w-24 h-10 rounded-full animate-pulse bg-neutral-200" />
          ) : isLoggedIn ? (
            <>
              <a href="/chat/messages" className="relative font-bold size-6">
                <span className="absolute top-0 right-0 bg-red-500 rounded-full size-2" />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M6.5 13.5h7v-1h-7zm0-3h11v-1h-11zm0-3h11v-1h-11zM3 20.077V4.616q0-.691.463-1.153T4.615 3h14.77q.69 0 1.152.463T21 4.616v10.769q0 .69-.463 1.153T19.385 17H6.077zM5.65 16h13.735q.23 0 .423-.192t.192-.423V4.615q0-.23-.192-.423T19.385 4H4.615q-.23 0-.423.192T4 4.615v13.03zM4 16V4z"
                    strokeWidth={1}
                    stroke="currentColor"
                  ></path>
                </svg>
              </a>
              <NotificationDialog
                name={fullName}
                avatarUrl={avatarUrl}
                messages={[
                  "Pesan baru dari Admin",
                  "Pengingat: Selesaikan profil Anda",
                ]}
              />
              <ProfileDropdown
                name={fullName}
                email={email}
                avatarUrl={avatarUrl}
                onProfile={handleProfile}
                onDashboard={handleDashboard}
                onLogout={handleLogout}
              />
            </>
          ) : (
            <Button onClick={handleLogin} variant="primary">
              Masuk
            </Button>
          )}

          {/* Mobile search toggle */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen((v) => !v)}
            className="p-2 rounded-full sm:hidden hover:bg-neutral-100"
            aria-label="Buka pencarian"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile search slide-down */}
      {mobileSearchOpen && (
        <div className="block px-3 pt-2 pb-3 border-t border-neutral-200 sm:hidden">
          <SearchBar />
        </div>
      )}
    </>
  );
}
