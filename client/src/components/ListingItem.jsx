import { Link } from "react-router-dom";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function ListingItem({ listing }) {
  // Agar database mein image nahi hai to fallback image
  const image =
    listing.imageUrls?.[0] ||
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 w-full sm:w-[330px]">

      {/* ================= IMAGE ================= */}

      <Link to={`/listing/${listing._id}`}>
        <div className="overflow-hidden">
          <img
            src={image}
            alt={listing.name || "Property"}
            className="w-full h-56 object-cover hover:scale-105 transition duration-300"
          />
        </div>
      </Link>

      {/* ================= DETAILS ================= */}

      <div className="p-4">

        {/* NAME */}

        <Link to={`/listing/${listing._id}`}>
          <h2 className="text-xl font-semibold truncate hover:text-slate-600">
            {listing.name || "Beautiful Property"}
          </h2>
        </Link>

        {/* ADDRESS */}

        <p className="flex items-center gap-2 text-sm text-slate-500 mt-2">
          <FaMapMarkerAlt className="text-green-700" />

          <span className="truncate">
            {listing.address || "Location not available"}
          </span>
        </p>

        {/* DESCRIPTION */}

        <p className="text-sm text-slate-600 mt-2 line-clamp-2">
          {listing.description ||
            "Beautiful property with modern facilities and comfortable living space."}
        </p>

        {/* PRICE */}

        <p className="text-lg font-semibold text-slate-700 mt-3">
          $
          {Number(
            listing.offer
              ? listing.discountPrice
              : listing.regularPrice
          ).toLocaleString("en-US")}

          {listing.type === "rent" && " / month"}
        </p>

        {/* ================= TYPE ================= */}

        <span className="inline-block bg-slate-700 text-white text-xs px-3 py-1 rounded mt-2 uppercase">
          {listing.type === "rent" ? "For Rent" : "For Sale"}
        </span>

        {/* ================= PROPERTY DETAILS ================= */}

        <div className="flex gap-4 mt-4 text-green-900 text-sm">

          <span className="flex items-center gap-1">
            <FaBed />
            {listing.bedrooms || 0} Beds
          </span>

          <span className="flex items-center gap-1">
            <FaBath />
            {listing.bathrooms || 0} Baths
          </span>

          <span className="flex items-center gap-1">
            <FaChair />

            {listing.furnished
              ? "Furnished"
              : "Unfurnished"}
          </span>

        </div>
      </div>
    </div>
  );
}