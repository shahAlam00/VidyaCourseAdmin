import React, { useState } from "react";
import {
  Bell,
  Search,
  User,
  LogOut,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Topbar = ({ collapsed }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

const handleLogoutConfirm = () => {
  setLoggingOut(true);

  setTimeout(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Optional: agar koi auth-related state/cache hai
    sessionStorage.clear();

    navigate("/login", { replace: true });
  }, 600);
};
  return (
    <>
      <header
        className={`
          fixed right-0 top-0 z-40
          h-[72px]
          border-b border-slate-200
          bg-white/95 backdrop-blur
          transition-all duration-300
          ${collapsed ? "left-[80px]" : "left-[260px]"}
        `}
      >
        <div className="flex h-full items-center justify-between px-6">
          {/* Search */}
          <div className="relative w-[320px]">
            <Search
              size={18}
              className="
                absolute left-3 top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              placeholder="Search students, courses..."
              className="
                h-10 w-full rounded-xl
                border border-slate-200
                bg-slate-50
                pl-10 pr-4
                text-sm
                outline-none
                transition
                focus:border-slate-400
                focus:bg-white
              "
            />
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <button
              className="
                relative flex h-10 w-10
                items-center justify-center
                rounded-xl
                text-slate-500
                hover:bg-slate-100
                cursor-pointer
              "
            >
              <Bell size={19} />

              <span
                className="
                  absolute right-2 top-2
                  h-2 w-2 rounded-full
                  bg-red-500
                "
              />
            </button>

            <div className="h-7 w-px bg-slate-200" />

            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-full bg-slate-900
                  text-white
                "
              >
                <User size={17} />
              </div>

              <div className="hidden md:block">
                <p className="text-sm font-semibold text-slate-900">
                  Admin
                </p>

                <p className="text-xs text-slate-500">
                  Administrator
                </p>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer p-1"
                title="Logout"
              >
                <LogOut size={17} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 shadow-inner">
              <AlertTriangle size={26} />
            </div>

            <h3 className="text-lg font-bold text-slate-900">Confirm Logout</h3>
            <p className="mt-1 text-sm text-slate-500">
              Are you sure you want to end your session? You will need to login again.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                disabled={loggingOut}
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              
              <button
                type="button"
                disabled={loggingOut}
                onClick={handleLogoutConfirm}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 hover:bg-rose-700 transition-all cursor-pointer disabled:opacity-75"
              >
                {loggingOut ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Logging out...</span>
                  </>
                ) : (
                  <span>Yes, Logout</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;