import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch profile");
          setLoading(false);
          return;
        }

        setUser(data.user);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (error) {
    return (
      <p className="text-red-500 text-center mt-10">
        {error}
      </p>
    );
  }

  return (
    <div className="p-3 max-w-lg mx-auto mt-10">

      <h1 className="text-3xl text-center font-semibold mb-7">
        Profile
      </h1>

      {user && (
        <div className="border p-5 rounded-lg">

          <p className="mb-3">
            <strong>Username:</strong> {user.username}
          </p>

          <p className="mb-3">
            <strong>Email:</strong> {user.email}
          </p>

        </div>
      )}

    </div>
  );
}