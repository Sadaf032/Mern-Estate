import { useEffect, useState } from "react";
import ListingItem from "../components/ListingItem";

export default function Listing() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:3000/api/listings?limit=8"
      );

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        return;
      }

      setListings(data);

      setShowMore(data.length === 8);

      setLoading(false);
    } catch (error) {
      console.error(
        "Fetch listings error:",
        error
      );

      setLoading(false);
    }
  };

  // ================= SHOW MORE =================

  const handleShowMore = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/listings?startIndex=${listings.length}&limit=8`
      );

      const data = await res.json();

      if (!res.ok) {
        return;
      }

      setListings((prev) => [
        ...prev,
        ...data,
      ]);

      setShowMore(data.length === 8);
    } catch (error) {
      console.error(
        "Show more error:",
        error
      );
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-3">

      <h1 className="text-3xl font-semibold border-b pb-3 mt-5">
        All Listings
      </h1>

      {/* ================= LISTINGS ================= */}

      {loading ? (
        <p className="text-center text-xl my-10">
          Loading...
        </p>
      ) : listings.length === 0 ? (
        <p className="text-center text-slate-600 my-10">
          No listings found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

          {listings.map((listing) => (
            <ListingItem
              key={listing._id}
              listing={listing}
            />
          ))}

        </div>
      )}

      {/* ================= SHOW MORE ================= */}

      {showMore && (
        <div className="flex justify-center mt-8 mb-8">

          <button
            onClick={handleShowMore}
            className="text-green-700 hover:underline font-semibold"
          >
            Show More Listings
          </button>

        </div>
      )}

    </main>
  );
}