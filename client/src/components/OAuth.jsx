import { useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/user/userSlice";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleGoogleClick = async () => {
    // Prevent multiple popup requests
    if (loading) return;

    try {
      setLoading(true);

      // Google authentication
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(
        auth,
        provider
      );

      // Check Google profile information
      console.log("GOOGLE USER:", result.user);
      console.log(
        "GOOGLE PHOTO:",
        result.user.photoURL
      );

      // Send Google user to Railway backend
      const response = await fetch(
        "https://mern-estate-production-1689.up.railway.app/api/oauth/google",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: result.user.email,
            name: result.user.displayName,
            photo: result.user.photoURL,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "GOOGLE BACKEND RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Google authentication failed"
        );
      }

      // Save backend user + JWT token in Redux
      dispatch(
        signInSuccess({
          ...data.user,
          token: data.token,
        })
      );

      // Go to profile
      navigate("/profile");
    } catch (error) {
      console.error(
        "Could not sign in with Google:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      disabled={loading}
      className="w-full bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
    >
      {loading
        ? "Signing in..."
        : "Continue with Google"}
    </button>
  );
}