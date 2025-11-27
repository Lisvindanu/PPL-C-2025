import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import Button from "../atoms/Button";
import Avatar from "../atoms/Avatar";
import useUserIdentity from "../../hooks/useUserIdentity";
import { authService } from "../../services/authService";
import { useToast } from "../organisms/ToastProvider";

const ROLE_HOME = {
  client: "/dashboard",
  freelancer: "/dashboard",
};

function ProfileDropdown({ name, email, avatarUrl, role, hasFreelancerProfile, onProfile, onDashboard, onFavorites, onBookmarks, onOrders, onSwitchRole, onRegisterFreelancer, onLogout }) {
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
          {/* Header dengan Role Badge */}
          <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-500 uppercase">Role Aktif</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                role === "freelancer" 
                  ? "bg-[#E8F4FD] text-[#1D375B]" 
                  : "bg-green-100 text-green-700"
              }`}>
                {role === "freelancer" ? "👨‍💼 Freelancer" : "👤 Klien"}
              </span>
            </div>
          </div>

          <button type="button" role="menuitem" onClick={onProfile} className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50">
            Profile
          </button>
          <button type="button" role="menuitem" onClick={onDashboard} className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50">
            Dashboard
          </button>
          
          {/* Section Ganti Role */}
          {hasFreelancerProfile && (
            <>
              <div className="my-1 h-px bg-neutral-200" />
              <div className="px-4 py-2">
                <div className="text-xs font-semibold text-neutral-500 uppercase mb-2">Ganti Role</div>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => onSwitchRole("client")}
                  className={`w-full px-3 py-2 text-left text-sm rounded-md transition-colors flex items-center justify-between ${
                    role === "client" 
                      ? "bg-[#E8F4FD] text-[#1D375B] font-medium border border-[#9DBBDD]" 
                      : "hover:bg-neutral-50 border border-transparent"
                  }`}
                >
                  <span>Sebagai Klien</span>
                  {role === "client" && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => onSwitchRole("freelancer")}
                  className={`w-full px-3 py-2 text-left text-sm rounded-md transition-colors flex items-center justify-between mt-1.5 ${
                    role === "freelancer" 
                      ? "bg-[#E8F4FD] text-[#1D375B] font-medium border border-[#9DBBDD]" 
                      : "hover:bg-neutral-50 border border-transparent"
                  }`}
                >
                  <span>Sebagai Freelancer</span>
                  {role === "freelancer" && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </>
          )}
          
          {/* Tombol untuk user yang belum punya profil freelancer tapi ingin daftar */}
          {!hasFreelancerProfile && role === "client" && (
            <>
              <div className="my-1 h-px bg-neutral-200" />
              <button
                type="button"
                role="menuitem"
                onClick={onRegisterFreelancer}
                className="w-full px-4 py-2 text-left text-sm text-[#1D375B] hover:bg-[#E8F4FD] font-medium"
              >
                Daftar sebagai Freelancer →
              </button>
            </>
          )}
          {role === "client" && (
            <>
              <div className="my-1 h-px bg-neutral-200" />
              <button type="button" role="menuitem" onClick={onFavorites} className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50">
                Favorit Anda
              </button>
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
  const toast = useToast();
  const { loading, fullName, email, avatarUrl } = useUserIdentity();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [hasFreelancerProfile, setHasFreelancerProfile] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    try {
      const activeRole = authService.getActiveRole();
      setUserRole(activeRole);
    } catch (e) {
      console.error("Failed to read active role", e);
    }
  }, []);

  // Cek apakah user memiliki profil freelancer
  useEffect(() => {
    if (isLoggedIn) {
      const checkFreelancerProfile = async () => {
        try {
          const profile = await authService.getProfile();
          if (profile.success && profile.data?.freelancerProfile) {
            setHasFreelancerProfile(!!profile.data.freelancerProfile);
          }
        } catch (error) {
          console.error("Failed to check freelancer profile", error);
        }
      };
      checkFreelancerProfile();
    }
  }, [isLoggedIn]);

  const handleLogin = () => navigate("/login");
  const handleRegister = () => navigate("/register/client");
  const handleRegisterFreelancer = () => navigate("/register/freelancer");
  const handleProfile = () => navigate("/profile");
  const handleDashboard = () => navigate("/dashboard");
  const handleFavorites = () => navigate("/favorit");
  const handleBookmarks = () => navigate("/bookmarks");
  const handleOrders = () => navigate("/orders");
  const handleSwitchRole = async (newRole) => {
    if (newRole === userRole) return; // Sudah pada role ini

    try {
      const result = await authService.switchRole(newRole);
      if (result.success) {
        if (result.data?.needsFreelancerRegistration) {
          toast.show(result.data.message || "Lengkapi profil freelancer terlebih dahulu", "info");
          navigate("/register/freelancer");
          return;
        }

        const updatedRole = result.data?.role || newRole;
        setUserRole(updatedRole);
        toast.show(`Role berhasil diubah menjadi ${updatedRole === "client" ? "Klien" : "Freelancer"}`, "success");
        const destination = ROLE_HOME[updatedRole] || "/";
        if (typeof window !== "undefined") {
          window.location.assign(destination);
        } else {
          navigate(destination, { replace: true });
        }
      } else {
        toast.show(result.message || "Gagal mengubah role", "error");
      }
    } catch (error) {
      toast.show("Gagal mengubah role", "error");
    }
  };
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
            <div className="flex items-center gap-2 sm:gap-3">
              {!hasFreelancerProfile && (
                <Button
                  onClick={handleRegisterFreelancer}
                  variant="outline"
                  className="text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 whitespace-nowrap shadow-md hover:shadow-lg transition-all bg-[#E8F4FD] border-[#9DBBDD] text-[#1D375B] hover:bg-[#D8E3F3] hover:border-[#4782BE]"
                >
                  Daftar Freelancer
                </Button>
              )}
              <ProfileDropdown
                name={fullName}
                email={email}
                avatarUrl={avatarUrl}
                role={userRole}
                hasFreelancerProfile={hasFreelancerProfile}
                onProfile={handleProfile}
                onDashboard={handleDashboard}
                onFavorites={handleFavorites}
                onBookmarks={handleBookmarks}
                onOrders={handleOrders}
                onSwitchRole={handleSwitchRole}
                onRegisterFreelancer={handleRegisterFreelancer}
                onLogout={handleLogout}
              />
            </div>
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
