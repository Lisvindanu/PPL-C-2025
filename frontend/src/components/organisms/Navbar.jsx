import { useState } from "react";
import { useNavigate } from "react-router-dom";
import IconButton from "../atoms/IconButton";
import NotificationBell from "../atoms/NotificationBell";
import SearchBar from "../molecules/SearchBar";
import UserMenu from "../molecules/UserMenu";
import useUserIdentity from "../../hooks/useUserIdentity";

export default function Navbar() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { loading, fullName, email, avatarUrl } = useUserIdentity();
  const navigate = useNavigate();

  const goProfile = () => navigate("/profile");
  const goSettings = () => navigate("/settings");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-3 sm:px-4">
        {/* kiri: logo */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <a href="/" className="flex items-center" aria-label="Ke beranda">
            <img
              src="/skillconnet-logo.png"
              alt="Logo"
              width="190"
              height="68"
              className="w-[190px] h-[68px] object-contain"
            />
          </a>

          {/* tengah: search */}
          <div className="hidden sm:flex flex-1 justify-center">
            <SearchBar />
          </div>
        </div>

        {/* kanan: bell + user */}
        <div className="flex items-center gap-2">
          <NotificationBell onClick={() => {}} />

          {loading ? (
            <div className="hidden md:flex h-10 w-36 items-center justify-end gap-2">
              <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-200" />
              <div className="flex flex-col gap-1">
                <div className="h-2 w-24 animate-pulse rounded bg-neutral-200" />
                <div className="h-2 w-20 animate-pulse rounded bg-neutral-100" />
              </div>
            </div>
          ) : (
            <UserMenu
              name={fullName}
              email={email}
              avatarSrc={avatarUrl}
              onProfile={goProfile}
              onSettings={goSettings}
              onLogout={handleLogout}
            />
          )}

          {/* search toggle untuk mobile */}
          <span className="sm:hidden">
            <IconButton
              ariaLabel="Buka pencarian"
              onClick={() => setMobileSearchOpen((v) => !v)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </IconButton>
          </span>
        </div>
      </div>

      {/* search slide-down mobile */}
      {mobileSearchOpen && (
        <div className="block border-t border-neutral-200 px-3 pb-3 pt-2 sm:hidden">
          <SearchBar />
        </div>
      )}
    </header>
  );
}
