import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../redux/user/userSlice";
import { useNavigate, Link } from "react-router-dom";
import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    photo: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  const [userListings, setUserListings] = useState([]);
  const [showListings, setShowListings] = useState(false);
  const [loadingListings, setLoadingListings] = useState(false);

  // ==================== FETCH PROFILE ====================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = currentUser?.token;

        if (!token) {
          setError("You are not logged in");
          setLoading(false);
          return;
        }

        const res = await fetch(
          "http://localhost:3000/api/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          if (
            res.status === 401 ||
            data.message === "Invalid or expired token"
          ) {
            dispatch(signOut());
            navigate("/sign-in");
            return;
          }

          setError(data.message || "Failed to fetch profile");
          setLoading(false);
          return;
        }

        setUser(data.user);

        setFormData({
          username: data.user.username || "",
          email: data.user.email || "",
          password: "",
          photo: data.user.photo || "",
        });

        setLoading(false);
      } catch (error) {
        console.error("Profile error:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser, dispatch, navigate]);

  // ==================== FETCH USER LISTINGS ====================

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        const token = currentUser?.token;

        if (!token) return;

        setLoadingListings(true);

        const res = await fetch(
          "http://localhost:3000/api/user-listings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          if (
            res.status === 401 ||
            data.message === "Invalid or expired token"
          ) {
            dispatch(signOut());
            navigate("/sign-in");
            return;
          }

          setLoadingListings(false);
          return;
        }

        setUserListings(Array.isArray(data) ? data : []);
        setLoadingListings(false);
      } catch (error) {
        console.error("Listings error:", error);
        setLoadingListings(false);
      }
    };

    fetchUserListings();
  }, [currentUser, dispatch, navigate]);

  // ==================== SHOW / HIDE LISTINGS ====================

  const handleShowListings = () => {
    setShowListings((prev) => !prev);
  };

  // ==================== TEXT CHANGE ====================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // ==================== PROFILE PHOTO ====================

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be smaller than 2MB.");
      return;
    }

    setError(null);
    setMessage("");

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        photo: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  // ==================== UPDATE PROFILE ====================

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);
      setMessage("");
      setError(null);

      const token = currentUser?.token;

      if (!token) {
        setError("You are not logged in");
        setUpdating(false);
        return;
      }

      const res = await fetch(
        "http://localhost:3000/api/update",
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            photo: formData.photo,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (
          res.status === 401 ||
          data.message === "Invalid or expired token"
        ) {
          dispatch(signOut());
          navigate("/sign-in");
          return;
        }

        setError(data.message || "Failed to update profile");
        setUpdating(false);
        return;
      }

      setUser(data.user);

      setFormData({
        username: data.user.username || "",
        email: data.user.email || "",
        password: "",
        photo: data.user.photo || "",
      });

      setMessage("Profile updated successfully!");
      setUpdating(false);
    } catch (error) {
      console.error("Update error:", error);

      setError(error.message);
      setUpdating(false);
    }
  };

  // ==================== DELETE ACCOUNT ====================

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmDelete) return;

    try {
      setError(null);

      const token = currentUser?.token;

      if (!token) {
        setError("You are not logged in");
        return;
      }

      const res = await fetch(
        "http://localhost:3000/api/delete",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (
          res.status === 401 ||
          data.message === "Invalid or expired token"
        ) {
          dispatch(signOut());
          navigate("/sign-in");
          return;
        }

        setError(
          data.message || "Failed to delete account"
        );

        return;
      }

      await firebaseSignOut(auth);

      dispatch(signOut());

      alert("Account deleted successfully!");

      navigate("/sign-in");
    } catch (error) {
      console.error("Delete error:", error);

      setError(
        error.message ||
          "Something went wrong while deleting account"
      );
    }
  };

  // ==================== DELETE LISTING ====================

  const handleDeleteListing = async (listingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (!confirmDelete) return;

    try {
      setError(null);

      const token = currentUser?.token;

      if (!token) {
        setError("You are not logged in");
        return;
      }

      const res = await fetch(
        `http://localhost:3000/api/listings/${listingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (
          res.status === 401 ||
          data.message === "Invalid or expired token"
        ) {
          dispatch(signOut());
          navigate("/sign-in");
          return;
        }

        setError(
          data.message || "Failed to delete listing"
        );

        return;
      }

      setUserListings((prevListings) =>
        prevListings.filter(
          (listing) => listing._id !== listingId
        )
      );

      alert("Listing deleted successfully!");
    } catch (error) {
      console.error("Delete listing error:", error);

      setError(
        error.message || "Failed to delete listing"
      );
    }
  };

  // ==================== SIGN OUT ====================

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);

      dispatch(signOut());

      navigate("/sign-in");
    } catch (error) {
      console.error("Sign out error:", error);

      setError("Failed to sign out");
    }
  };

  // ==================== LOADING ====================

  if (loading) {
    return (
      <p className="text-center mt-10">
        Loading...
      </p>
    );
  }

  // ==================== ERROR ====================

  if (error && !user) {
    return (
      <p className="text-red-500 text-center mt-10">
        {error}
      </p>
    );
  }

  // ==================== UI ====================

  return (
    <div className="p-3 max-w-5xl mx-auto">

      {/* ================= PROFILE ================= */}

      <h1 className="text-3xl font-semibold text-center my-7">
        Profile
      </h1>

      {user && (
        <form
          onSubmit={handleUpdate}
          className="flex flex-col gap-5 max-w-lg mx-auto"
        >

          {/* PROFILE IMAGE */}

          <div className="flex flex-col items-center">

            <label
              htmlFor="photo"
              className="cursor-pointer group"
            >
              {formData.photo ? (
                <img
                  src={formData.photo}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-slate-200 group-hover:opacity-80 transition"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-slate-200 flex items-center justify-center group-hover:opacity-80 transition">
                  <span className="text-4xl text-slate-500">
                    {user?.username
                      ?.charAt(0)
                      .toUpperCase()}
                  </span>
                </div>
              )}
            </label>

            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />

          </div>

          {/* USERNAME */}

          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            placeholder="Username"
          />

          {/* EMAIL */}

          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            placeholder="Email"
          />

          {/* PASSWORD */}

          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            placeholder="Password"
          />

          {/* UPDATE */}

          <button
            type="submit"
            disabled={updating}
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-70"
          >
            {updating ? "Updating..." : "Update"}
          </button>

          {/* MESSAGE */}

          {message && (
            <p className="text-green-600 text-center">
              {message}
            </p>
          )}

          {error && (
            <p className="text-red-500 text-center">
              {error}
            </p>
          )}

          {/* CREATE LISTING */}

          <Link
            to="/create-listing"
            className="w-full bg-green-600 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          >
            Create Listing
          </Link>

          {/* DELETE + SIGN OUT */}

          <div className="flex justify-between items-center mt-2">

            <button
              type="button"
              onClick={handleDelete}
              className="text-red-700 hover:underline"
            >
              Delete Account
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="text-red-700 hover:underline"
            >
              Sign out
            </button>

          </div>

        </form>
      )}

      {/* =================================================
          SHOW LISTINGS
      ================================================= */}

      <div className="mt-12">

        {/* SHOW LISTINGS BUTTON */}

        <div className="text-center mb-8">
          <button
            type="button"
            onClick={handleShowListings}
            className="text-green-700 text-lg font-medium hover:underline"
          >
            {showListings
              ? "Hide listings"
              : "Show listings"}
          </button>
        </div>

        {/* LISTINGS */}

        {showListings && (
          <div>

            <h2 className="text-3xl font-bold text-center mb-10">
              Your listings
            </h2>

            {loadingListings ? (
              <p className="text-center text-slate-500">
                Loading listings...
              </p>
            ) : userListings.length === 0 ? (
              <p className="text-center text-slate-500">
                You have no listings yet.
              </p>
            ) : (
              <div className="flex flex-col gap-5">

                {userListings.map((listing) => (
                  <div
                    key={listing._id}
                    className="border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-white shadow-sm hover:shadow-md transition"
                  >

                    {/* IMAGE + NAME */}

                    <Link
                      to={`/listing/${listing._id}`}
                      className="flex items-center gap-4 min-w-0"
                    >

                      <img
                        src={
                          listing.imageUrls?.[0] ||
                          "https://via.placeholder.com/100"
                        }
                        alt={listing.name}
                        className="w-24 h-20 object-cover rounded-lg flex-shrink-0"
                      />

                      <h3 className="text-xl font-bold truncate">
                        {listing.name}
                      </h3>

                    </Link>

                    {/* DELETE + EDIT */}

                    <div className="flex flex-col items-end gap-1 ml-5 flex-shrink-0">

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteListing(
                            listing._id
                          )
                        }
                        className="text-red-700 text-lg font-medium uppercase hover:underline"
                      >
                        DELETE
                      </button>

                      <Link
                        to={`/create-listing/${listing._id}`}
                        className="text-green-700 text-lg font-medium uppercase hover:underline"
                      >
                        EDIT
                      </Link>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}