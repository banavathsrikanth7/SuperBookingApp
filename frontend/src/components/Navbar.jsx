import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import ModalContext from "../context/ModalContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { openLoginModal } = useContext(ModalContext);

  return (
    <nav className="pt-6 pb-6 px-8 border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0"></div>
        <div className="flex-1 max-w-xl relative">
          <input
            className="w-full pl-6 pr-12 py-3 rounded-full border border-gray-400 focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark text-sm placeholder-gray-500"
            placeholder="Search for global destinations and experiences..."
            type="text"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
        </div>
        <div className="flex items-center space-x-6 text-s font-semibold text-brand-dark tracking-wider shrink-0">
          <div className="flex items-center space-x-4">
            <Link to="/my-bookings">
              <div className="flex items-center hover:opacity-80">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
                My Bookings
              </div>
            </Link>
            <div className="w-px h-6 bg-gray-200 mx-2"></div>
            {user ? (
              <>
                <button onClick={logout}>Logout</button>
              </>
            ) : (
              <button
                onClick={openLoginModal}
                className="bg-blue-600 hover:bg-blue-700 text-black px-4 py-2 rounded cursor-pointer"
              >
                <div className="flex items-center hover:opacity-80">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                  Login
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
