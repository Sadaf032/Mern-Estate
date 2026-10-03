import { useState } from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector(
    (state) => state.user
  );

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  // ================= SEARCH INPUT =================

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // ================= SEARCH SUBMIT =================

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedSearch = searchTerm.trim();

    if (!trimmedSearch) {
      navigate("/search");
      return;
    }

    navigate(
      `/search?searchTerm=${encodeURIComponent(
        trimmedSearch
      )}`
    );
  };

  return (
    <header className="bg-slate-200 shadow-md">

      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">

        {/* ================= LOGO ================= */}

        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">
              Sadaf
            </span>

            <span className="text-slate-700">
              Estate
            </span>
          </h1>
        </Link>

        {/* ================= SEARCH ================= */}

        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleChange}
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />

          <button type="submit">
            <FaSearch className="text-slate-600" />
          </button>
        </form>

        {/* ================= NAVIGATION ================= */}

        <ul className="flex gap-4 items-center">

          <li className="hidden sm:inline text-slate-700 hover:underline">
            <Link to="/">Home</Link>
          </li>

          <li className="hidden sm:inline text-slate-700 hover:underline">
            <Link to="/about">About</Link>
          </li>

        <li>
  {currentUser ? (
    <Link to="/profile">
      {currentUser.photo ? (
        <img
          src={currentUser.photo}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover border border-slate-300"
        />
      ) : (
        <FaUserCircle className="text-3xl text-slate-600" />
      )}
    </Link>
  ) : (
    <Link
      to="/sign-in"
      className="text-slate-700 hover:underline"
    >
      Sign In
    </Link>
    )}
    </li>
      </ul>
    </div>

    </header>
  );
}