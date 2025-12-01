import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import Button from "../atoms/Button";
import Avatar from "../atoms/Avatar";
import useUserIdentity from "../../hooks/useUserIdentity";

function ProfileDropdown({ name, email, avatarUrl, role, onProfile, onDashboard, onBookmarks, onOrders, onLogout }) {
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
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex items-center gap-3 rounded-2xl px-2 py-1 hover:bg-neutral-100" aria-haspopup="menu" aria-expanded={open}>
        <Avatar src={avatarUrl} alt={name} size="sm" />
        <div className="hidden md:flex flex-col items-start leading-tight text-left">
          <span className="text-sm font-semibold text-neutral-900">{name}</span>
          <span className="text-[11px] text-neutral-500">{email}</span>
        </div>
        <svg className={`h-4 w-4 text-neutral-600 transition ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div role="menu" className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg">
          <button type="button" role="menuitem" onClick={onProfile} className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50">
            Profile
          </button>
          <button type="button" role="menuitem" onClick={onDashboard} className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50">
            Dashboard
          </button>
          {role === "client" && (
            <>
              <button type="button" role="menuitem" onClick={onBookmarks} className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50">
                Disimpan
              </button>
              <button type="button" role="menuitem" onClick={onOrders} className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50">
                Riwayat Pesanan
              </button>
            </>
          )}
          <div className="my-1 h-px bg-neutral-200" />
          <button type="button" role="menuitem" onClick={onLogout} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default function NavHeader() {
  const navigate = useNavigate();
  const { loading, fullName, email, avatarUrl } = useUserIdentity();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!token);
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserRole(userData.role);
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  const handleLogin = () => navigate("/login");
  const handleRegister = () => navigate("/register/client");
  const handleProfile = () => navigate("/profile");
  const handleDashboard = () => navigate("/dashboard");
  const handleBookmarks = () => navigate("/bookmarks");
  const handleOrders = () => navigate("/orders");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login", { replace: true });
  };

  return (
    <>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 sm:gap-3 px-2 sm:px-4">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <a href="/" className="flex items-center" aria-label="Ke beranda">
            <img src="/assets/logo.png" alt="SkillConnect Logo" className="h-10 sm:h-12 w-auto object-contain" />
          </a>
        </div>

        {/* Search Bar */}
        <div className="hidden sm:flex flex-1 justify-center px-2 md:px-4 min-w-0">
          <SearchBar />
        </div>

        {/* Right side - Login/Register buttons or Profile dropdown */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
          {loading ? (
            <div className="h-9 sm:h-10 w-20 sm:w-24 animate-pulse rounded-full bg-neutral-200" />
          ) : isLoggedIn ? (
            <ProfileDropdown
              name={fullName}
              email={email}
              avatarUrl={avatarUrl}
              role={userRole}
              onProfile={handleProfile}
              onDashboard={handleDashboard}
              onBookmarks={handleBookmarks}
              onOrders={handleOrders}
              onLogout={handleLogout}
            />
          ) : (
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
              <button onClick={handleLogin} className="text-sm sm:text-base text-neutral-900 hover:text-neutral-700 underline font-medium whitespace-nowrap transition-colors">
                Masuk
              </button>
              <Button
                onClick={handleRegister}
                variant="outline"
                className="text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 whitespace-nowrap shadow-md hover:shadow-lg transition-all bg-[#E8F4FD] border-[#9DBBDD] text-[#1D375B] hover:bg-[#D8E3F3] hover:border-[#4782BE]"
              >
                Daftar
              </Button>
            </div>
          )}

          {/* Mobile search toggle */}
          <button type="button" onClick={() => setMobileSearchOpen((v) => !v)} className="sm:hidden rounded-full p-1.5 sm:p-2 hover:bg-neutral-100 flex-shrink-0" aria-label="Buka pencarian">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
              <path d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile search slide-down */}
      {mobileSearchOpen && (
        <div className="block border-t border-neutral-200 px-3 pb-3 pt-2 sm:hidden">
          <SearchBar />
        </div>
      )}
    </>
  );
}
