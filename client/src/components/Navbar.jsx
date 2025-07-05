import { Link } from "react-router-dom";
import useThemeStore from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare, Sun, Moon, User, LogOut } from "lucide-react";

const Navbar = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className={`fixed w-full top-0 z-40 backdrop-blur-lg ${
        theme === "dark" ? "bg-gray-900/80 border-gray-800" : "bg-white/80 border-gray-200"
      } border-b`}
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Left side: Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-all">
            <div
              className={`size-8 rounded-lg flex items-center justify-center ${
                theme === "dark" ? "bg-blue-900/50 text-blue-400" : "bg-blue-100 text-blue-600"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
            </div>
            <h1
              className={`text-lg font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              CodeChat
            </h1>
          </Link>

          {/* Right side: Theme Toggle + Auth Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full hover:${
                theme === "dark" ? "bg-gray-700" : "bg-gray-200"
              } transition-colors`}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {authUser && (
              <>
                <Link to={"/profile"} className="btn btn-sm gap-2">
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;