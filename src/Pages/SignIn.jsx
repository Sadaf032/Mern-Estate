import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signin failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);

      setLoading(false);
      navigate("/profile");

    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">

      <h1 className="text-3xl text-center font-semibold my-7">
        Sign In
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >

        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          type="submit"
          className="bg-slate-500 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

      </form>

      {error && (
        <p className="text-red-500 mt-5">
          {error}
        </p>
      )}

      <div className="flex gap-2 mt-5">
        <p>Don't have an account?</p>

        <Link
          to="/sign-up"
          className="text-slate-700 hover:underline"
        >
          Sign Up
        </Link>
      </div>

    </div>
  );
}