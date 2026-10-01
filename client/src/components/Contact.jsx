import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ================= DEMO LANDLORD =================

  const demoLandlord = {
    username: "Property Landlord",
    email: "landlord@example.com",
  };

  // ================= MESSAGE =================

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  // ================= FETCH LANDLORD =================

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        setError("");

        // =========================================
        // AGAR DEMO LISTING HAI
        // =========================================

        if (
          !listing?.userRef ||
          String(listing.userRef).startsWith("demo-")
        ) {
          setLandlord(demoLandlord);
          return;
        }

        // =========================================
        // DATABASE LISTING
        // =========================================

        const res = await fetch(
          `http://localhost:3000/api/user/${listing.userRef}`
        );

        const data = await res.json();

        if (!res.ok) {
          console.log(
            "Landlord API failed, using demo landlord"
          );

          setLandlord(demoLandlord);
          return;
        }

        setLandlord(data);
      } catch (error) {
        console.error(
          "Fetch landlord error:",
          error
        );

        // =========================================
        // FALLBACK
        // =========================================

        setLandlord(demoLandlord);
      }
    };

    fetchLandlord();
  }, [listing?.userRef]);

  // ================= LOADING =================

  if (!landlord) {
    return (
      <p className="text-slate-600">
        Loading landlord information...
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">

      {/* ========================================= */}
      {/* CONTACT TEXT */}
      {/* ========================================= */}

      <p className="text-lg text-slate-800">

        Contact{" "}

        <span className="font-semibold">
          {landlord.username}
        </span>{" "}

        for{" "}

        <span className="font-semibold">
          {listing?.name?.toLowerCase()}
        </span>

      </p>

      {/* ========================================= */}
      {/* MESSAGE */}
      {/* ========================================= */}

      <textarea
        name="message"
        id="message"
        rows="4"
        value={message}
        onChange={onChange}
        placeholder="Enter your message here..."
        className="
          w-full
          border
          border-gray-200
          p-3
          rounded-lg
          outline-none
          focus:ring-2
          focus:ring-slate-400
          resize-none
        "
      />

      {/* ========================================= */}
      {/* SEND MESSAGE */}
      {/* ========================================= */}

      <Link
        to={`mailto:${landlord.email}?subject=${encodeURIComponent(
          `Regarding ${listing?.name || "Property"}`
        )}&body=${encodeURIComponent(
          message ||
            `Hello, I am interested in ${listing?.name || "this property"}.`
        )}`}
        className="
          bg-slate-700
          text-white
          text-center
          p-3
          uppercase
          rounded-lg
          font-semibold
          hover:opacity-95
          transition
        "
      >
        Send Message
      </Link>

      {/* ========================================= */}
      {/* ERROR */}
      {/* ========================================= */}

      {error && (
        <p className="text-red-600 text-sm">
          {error}
        </p>
      )}

    </div>
  );
}