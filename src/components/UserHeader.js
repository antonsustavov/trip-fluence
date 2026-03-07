import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const UserHeader = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const btnWrapRef = useRef(null);
  const desktopMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [isVerified, setIsVerified] = useState(false);

  const navigate = useNavigate();

  const defaultHeading =
    location.pathname === "/chat"
      ? "Hi, Message page"
      : location.pathname === "/brands-account" ||
        location.pathname === "/find-brands"
      ? "Hi, Brands name"
      : "Hi, Creator name";

  const [heading, setHeading] = useState(defaultHeading);
  useEffect(() => {
    setHeading(defaultHeading);
    let active = true;
    async function load() {
      try {
        const { data } = await supabase.auth.getUser();
        const userId = data?.user?.id;
        if (!userId) return;
        const { data: profile } = await supabase
          .from("users")
          .select("first_nmae, last_name, role, is_verified")
          .eq("auth_id", userId)
          .maybeSingle();
        if (!active) return;
        if (profile) {
          setIsVerified(!!profile.is_verified);
          const first = (profile.first_nmae || "").trim();
          const last = (profile.last_name || "").trim();
          const full = [first, last].filter(Boolean).join(" ");
          if (full) setHeading(`Hi, ${full}`);
          else if (profile.role === "brand") setHeading("Hi, Brand");
          else setHeading("Hi, Creator");
        }
      } catch {}
    }
    load();
    return () => {
      active = false;
    };
  }, [defaultHeading]);

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
    } catch {}
    try {
      localStorage.removeItem("auth_id");
      localStorage.removeItem("user_email");
      localStorage.removeItem("role");
    } catch {}
    setOpen(false);
    window.location.replace("/");
  }

  const isBrand = location.pathname.includes("brand");
  const isCreator =
    location.pathname.includes("creater") ||
    location.pathname.includes("creator");
  const onFindCreators = location.pathname === "/find-creators";
  const onFindBrands = location.pathname === "/find-brands";
  const onChat = location.pathname === "/chat";
  const onCreatorAccount = location.pathname === "/creater-account";
  const onBrandAccount = location.pathname === "/brands-account";
  const onOnboardCreator = location.pathname === "/onboard-creator";
  const onOnboardBrand = location.pathname === "/onboard-brand";
  const hideCollabAndMessages =
    !isVerified && (onOnboardCreator || onOnboardBrand);

  useEffect(() => {
    if (onFindBrands) {
      try {
        sessionStorage.setItem("lastCollabContext", "brands");
      } catch {}
    } else if (onFindCreators) {
      try {
        sessionStorage.setItem("lastCollabContext", "creators");
      } catch {}
    }
  }, [onFindBrands, onFindCreators]);

  useEffect(() => {
    function onDocMouseDown(e) {
      if (!open) return;
      const t = e.target;
      if (btnWrapRef.current && btnWrapRef.current.contains(t)) return;
      if (desktopMenuRef.current && desktopMenuRef.current.contains(t)) return;
      if (mobileMenuRef.current && mobileMenuRef.current.contains(t)) return;
      setOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  let lastCollab = null;
  try {
    lastCollab = sessionStorage.getItem("lastCollabContext");
  } catch {}

  const accountTarget = onFindBrands
    ? "/brands-account"
    : onFindCreators
    ? "/creater-account"
    : onChat && lastCollab === "brands"
    ? "/brands-account"
    : onChat && lastCollab === "creators"
    ? "/creater-account"
    : isBrand
    ? "/brands-account"
    : "/creater-account";

  const collabTarget = onFindBrands
    ? "/find-brands"
    : onFindCreators
    ? "/find-creators"
    : onChat && lastCollab === "brands"
    ? "/find-brands"
    : onChat && lastCollab === "creators"
    ? "/find-creators"
    : onBrandAccount
    ? "/find-brands"
    : onCreatorAccount
    ? "/find-creators"
    : isBrand
    ? "/find-creators"
    : "/find-brands";

  const collabLabel = onFindBrands
    ? "Collab Brands"
    : onFindCreators
    ? "Collab Creaters"
    : onChat && lastCollab === "brands"
    ? "Collab Brands"
    : onChat && lastCollab === "creators"
    ? "Collab Creaters"
    : onBrandAccount
    ? "Collab Brands"
    : onCreatorAccount
    ? "Collab Creaters"
    : isBrand
    ? "Collab Creaters"
    : "Collab Brands";

  const showCollab = location.pathname !== "/chat";

  return (
    <header className="relative h-[80px] md:h-[128px] flex items-center px-4 md:px-6">
      <div className="w-full max-w-[1320px] mx-auto flex items-center justify-between">
        <a href="/" className="flex">
          <img
            src="/assets/logo.png"
            alt="TripFluence"
            className="w-[180px] h-[46px] md:w-[235px] md:h-[60px]"
          />
        </a>

        <nav className="flex items-center gap-4 md:gap-[64px]">
          <div className="hidden md:flex items-center gap-[18px]">
            <button>
              <img src="/assets/user.svg" alt="user" />
            </button>
            <h2 className="text-[#05162A] text-[24px] font-medium leading-[34px] pt-1">
              {heading}
            </h2>
          </div>
          <div className="relative" ref={btnWrapRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center justify-center"
            >
              {open ? (
                <svg
                  width="46"
                  height="46"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 6L18 18"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                  <path
                    d="M18 6L6 18"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              ) : (
                <svg
                  width="46"
                  height="46"
                  viewBox="0 0 46 46"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.75 23H40.25M5.75 11.5H40.25M5.75 34.5H40.25"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              )}
            </button>
            {open && (
              <div
                ref={desktopMenuRef}
                className="hidden md:block absolute right-0 mt-2 z-50 bg-white border border-black/10 shadow-sm rounded-lg w-[300px]"
              >
                <div className="px-4 py-3">
                  <div className="flex flex-col">
                    <a
                      href={accountTarget}
                      className="py-3 text-[#05162A] text-[16px] font-medium leading-[24px]"
                    >
                      Account
                    </a>
                    {!hideCollabAndMessages && showCollab && (
                      <a
                        href={collabTarget}
                        className="py-3 text-[#05162A] text-[16px] font-medium leading-[24px]"
                      >
                        {collabLabel}
                      </a>
                    )}
                    {!hideCollabAndMessages && (
                      <a
                        href="/chat"
                        className="py-3 text-[#05162A] text-[16px] font-medium leading-[24px]"
                      >
                        Messages
                      </a>
                    )}
                    <button
                      onClick={handleLogout}
                      className="text-left py-3 text-[#E11D48] text-[16px] font-medium leading-[24px]"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>

      {open && (
        <div
          ref={mobileMenuRef}
          className="md:hidden absolute z-50 top-full bg-white border border-black/10 shadow-sm left-0 right-0"
        >
          <div className="px-4 py-3 mt-3">
            <div className="mb-4 md:hidden flex items-center gap-3">
              <button>
                <img src="/assets/user.svg" alt="user" />
              </button>
              <h2 className="text-[#05162A] text-[20px] font-medium leading-[34px] pt-1">
                {heading}
              </h2>
            </div>
            <div className="flex flex-col">
              <a
                href={accountTarget}
                className="py-3 text-[#05162A] text-[16px] font-medium leading-[24px]"
              >
                Account
              </a>
              {!hideCollabAndMessages && showCollab && (
                <a
                  href={collabTarget}
                  className="py-3 text-[#05162A] text-[16px] font-medium leading-[24px]"
                >
                  {collabLabel}
                </a>
              )}
              {!hideCollabAndMessages && (
                <a
                  href="/chat"
                  className="py-3 text-[#05162A] text-[16px] font-medium leading-[24px]"
                >
                  Messages
                </a>
              )}
              <button
                onClick={handleLogout}
                className="text-left py-3 text-[#E11D48] text-[16px] font-medium leading-[24px]"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default UserHeader;
