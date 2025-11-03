import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import Button from "../atoms/Button";
import Avatar from "../atoms/Avatar";
import useUserIdentity from "../../hooks/useUserIdentity";

function ProfileDropdown({ name, email, avatarUrl, onProfile, onDashboard, onBookmark, onLogout }) {
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
        className="flex items-center gap-3 rounded-2xl px-2 py-1 hover:bg-neutral-100"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Avatar src={avatarUrl} alt={name} size="sm" />
        <div className="hidden md:flex flex-col items-start leading-tight text-left">
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
          className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={onProfile}
            className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50"
          >
            Profile
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={onDashboard}
            className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50"
          >
            Dashboard
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={onBookmark}
            className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
          >
            <i className="fas fa-bookmark text-[#4782BE] text-xs"></i>
            Bookmark
          </button>
          <div className="my-1 h-px bg-neutral-200" />
          <button
            type="button"
            role="menuitem"
            onClick={onLogout}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = () => navigate("/login");
  const handleProfile = () => navigate("/profile");
  const handleDashboard = () => navigate("/dashboard");
  const handleBookmark = () => navigate("/bookmarks");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login", { replace: true });
  };

  return (
    <>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-3 sm:px-4">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className="flex items-center" aria-label="Ke beranda">
            <img
              src="/LogoSkillConnect.png"
              alt="SkillConnect Logo"
              className="h-8 w-auto object-contain"
            />
          </a>
        </div>

        {/* Search Bar */}
        <div className="hidden sm:flex flex-1 justify-center px-4">
          <SearchBar />
        </div>

        {/* Right side - Login button or Profile dropdown */}
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="h-10 w-24 animate-pulse rounded-full bg-neutral-200" />
          ) : isLoggedIn ? (
            <ProfileDropdown
              name={fullName}
              email={email}
              avatarUrl={avatarUrl}
              onProfile={handleProfile}
              onDashboard={handleDashboard}
              onBookmark={handleBookmark}
              onLogout={handleLogout}
            />
          ) : (
            <Button onClick={handleLogin} variant="primary">
              Masuk
            </Button>
          )}

          {/* Mobile search toggle */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen((v) => !v)}
            className="sm:hidden rounded-full p-2 hover:bg-neutral-100"
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
        <div className="block border-t border-neutral-200 px-3 pb-3 pt-2 sm:hidden">
          <SearchBar />
        </div>
      )}
    </>
  );
}
