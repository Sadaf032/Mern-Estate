import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
} from "swiper/modules";
import { useSelector } from "react-redux";

import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";

import Contact from "../components/Contact";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ListingDetail() {
  const { id } = useParams();

  const { currentUser } = useSelector(
    (state) => state.user
  );

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);

  // ================= DEMO / FALLBACK DATA =================

  const demoListings = [
    {
      _id: "demo-1",
      name: "Modern Luxury Villa",
      address: "123 Serenity Lane, Karachi, Pakistan",
      description:
        "This beautiful modern villa offers a comfortable and luxurious living experience. It features spacious rooms, a beautiful garden, modern interiors and easy access to nearby facilities.",
      regularPrice: 850,
      discountPrice: 750,
      offer: true,
      type: "rent",
      bedrooms: 4,
      bathrooms: 3,
      parking: true,
      furnished: true,
      imageUrls: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=80",
      ],
    },

    {
      _id: "demo-2",
      name: "Modern Family House",
      address: "456 Clifton Avenue, Karachi, Pakistan",
      description:
        "A spacious family house with modern architecture, large bedrooms, comfortable living areas and a beautiful outdoor space.",
      regularPrice: 1200,
      discountPrice: 1100,
      offer: true,
      type: "rent",
      bedrooms: 5,
      bathrooms: 4,
      parking: true,
      furnished: true,
      imageUrls: [
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80",
      ],
    },

    {
      _id: "demo-3",
      name: "Luxury Modern Apartment",
      address: "789 DHA Phase 6, Karachi, Pakistan",
      description:
        "A stylish modern apartment designed for comfortable city living. The property includes spacious bedrooms, modern bathrooms and secure parking.",
      regularPrice: 95000,
      discountPrice: 90000,
      offer: true,
      type: "rent",
      bedrooms: 3,
      bathrooms: 2,
      parking: true,
      furnished: true,
      imageUrls: [
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80",
      ],
    },
  ];

  // ================= FETCH DATABASE =================

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:3000/api/listings/${id}`
        );

        const data = await res.json();

        console.log("DATABASE LISTING:", data);

        // ================= DATABASE SUCCESS =================

        if (res.ok && data) {
          setListing(data);
          setLoading(false);
          return;
        }

        // ================= DATABASE FAILED =================

        console.log(
          "Database listing not found. Using demo listing."
        );

        const demo =
          demoListings[
            Math.floor(
              Math.random() * demoListings.length
            )
          ];

        setListing(demo);
        setLoading(false);
      } catch (error) {
        console.log(
          "Database error. Showing demo listing:",
          error
        );

        // ================= FALLBACK =================

        const demo =
          demoListings[
            Math.floor(
              Math.random() * demoListings.length
            )
          ];

        setListing(demo);
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  // ================= SHARE =================

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        window.location.href
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="text-center my-20">
        <p className="text-2xl text-slate-700">
          Loading...
        </p>
      </div>
    );
  }

  // ================= NO LISTING =================

  if (!listing) {
    return (
      <div className="text-center my-20">
        <p className="text-2xl text-red-600">
          Listing not found!
        </p>
      </div>
    );
  }

  // ================= PRICE =================

  const price = listing.offer
    ? Number(listing.discountPrice)
    : Number(listing.regularPrice);

  // ================= DISCOUNT =================

  const discount =
    Number(listing.regularPrice) -
    Number(listing.discountPrice);

  return (
    <main className="bg-white min-h-screen">

      {/* ================================================= */}
      {/* IMAGE SLIDER */}
      {/* ================================================= */}

      <div className="w-full">

        <Swiper
          modules={[
            Navigation,
            Pagination,
            Autoplay,
          ]}
          navigation
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={
            listing.imageUrls?.length > 1
          }
          className="listing-swiper h-[350px] sm:h-[450px] md:h-[520px]"
        >

          {listing.imageUrls?.map(
            (url, index) => (
              <SwiperSlide key={index}>

                <img
                  src={url}
                  alt={`${listing.name} ${
                    index + 1
                  }`}
                  className="w-full h-full object-cover"
                />

              </SwiperSlide>
            )
          )}

        </Swiper>

      </div>

      {/* ================================================= */}
      {/* SHARE BUTTON */}
      {/* ================================================= */}

      <button
        onClick={handleShare}
        className="fixed top-[15%] right-5 z-20
        bg-white shadow-lg border
        rounded-full w-12 h-12
        flex items-center justify-center
        hover:bg-slate-100 transition"
      >
        <FaShare className="text-slate-600" />
      </button>

      {/* COPIED MESSAGE */}

      {copied && (
        <div
          className="fixed top-[23%] right-5 z-20
          bg-slate-800 text-white
          px-4 py-2 rounded-lg shadow-lg"
        >
          Link copied!
        </div>
      )}

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <div className="max-w-4xl mx-auto px-5 py-8">

        {/* ================================================= */}
        {/* TITLE + PRICE */}
        {/* ================================================= */}

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">

          {listing.name}

          {" - $"}

          {price.toLocaleString("en-US")}

          {listing.type === "rent" &&
            " / month"}

        </h1>

        {/* ================================================= */}
        {/* LOCATION */}
        {/* ================================================= */}

        <p
          className="flex items-center
          gap-2 mt-4
          text-slate-600"
        >

          <FaMapMarkerAlt
            className="text-green-700"
          />

          <span>
            {listing.address}
          </span>

        </p>

        {/* ================================================= */}
        {/* RENT / SALE + OFFER */}
        {/* ================================================= */}

        <div className="flex flex-col sm:flex-row gap-4 mt-5">

          {/* TYPE */}

          <p
            className="bg-red-900
            text-white
            text-center
            p-2
            rounded-md
            w-full
            sm:max-w-[220px]"
          >
            {listing.type === "rent"
              ? "For Rent"
              : "For Sale"}
          </p>

          {/* OFFER */}

          {listing.offer && (
            <p
              className="bg-green-900
              text-white
              text-center
              p-2
              rounded-md
              w-full
              sm:max-w-[220px]"
            >
              ${discount.toLocaleString("en-US")}{" "}
              discount
            </p>
          )}

        </div>

        {/* ================================================= */}
        {/* DESCRIPTION */}
        {/* ================================================= */}

        <p
          className="text-slate-800
          mt-6
          leading-7"
        >

          <span className="font-bold text-black">
            Description -{" "}
          </span>

          {listing.description}

        </p>

        {/* ================================================= */}
        {/* PROPERTY DETAILS */}
        {/* ================================================= */}

        <ul
          className="text-green-900
          font-semibold
          text-sm
          flex
          flex-wrap
          items-center
          gap-6
          mt-6"
        >

          {/* BEDROOMS */}

          <li className="flex items-center gap-2">

            <FaBed className="text-lg" />

            {listing.bedrooms > 1
              ? `${listing.bedrooms} Beds`
              : `${listing.bedrooms} Bed`}

          </li>

          {/* BATHROOMS */}

          <li className="flex items-center gap-2">

            <FaBath className="text-lg" />

            {listing.bathrooms > 1
              ? `${listing.bathrooms} Baths`
              : `${listing.bathrooms} Bath`}

          </li>

          {/* PARKING */}

          <li className="flex items-center gap-2">

            <FaParking className="text-lg" />

            {listing.parking
              ? "Parking spot"
              : "No Parking"}

          </li>

          {/* FURNISHED */}

          <li className="flex items-center gap-2">

            <FaChair className="text-lg" />

            {listing.furnished
              ? "Furnished"
              : "Unfurnished"}

          </li>

        </ul>

        {/* ================================================= */}
        {/* CONTACT LANDLORD */}
        {/* ================================================= */}

        {currentUser &&
          String(listing.userRef) !==
            String(
              currentUser._id ||
              currentUser.id
            ) &&
          !contact && (

            <button
              onClick={() =>
                setContact(true)
              }
              className="w-full
              mt-8
              bg-slate-700
              text-white
              p-3
              rounded-lg
              uppercase
              font-semibold
              hover:opacity-90
              transition"
            >
              Contact Landlord
            </button>

          )}

        {/* ================================================= */}
        {/* DEMO CONTACT BUTTON */}
        {/* ================================================= */}

        {!currentUser && !contact && (
          <button
            onClick={() =>
              setContact(true)
            }
            className="w-full
            mt-8
            bg-slate-700
            text-white
            p-3
            rounded-lg
            uppercase
            font-semibold
            hover:opacity-90
            transition"
          >
            Contact Landlord
          </button>
        )}

        {/* ================================================= */}
        {/* CONTACT FORM */}
        {/* ================================================= */}

        {contact && (
          <div className="mt-6">
            <Contact listing={listing} />
          </div>
        )}

      </div>

      {/* ================================================= */}
      {/* SWIPER STYLE */}
      {/* ================================================= */}

      <style>
        {`

          .listing-swiper
          .swiper-button-next,
          .listing-swiper
          .swiper-button-prev {

            color: white;

            filter:
              drop-shadow(
                0 0 5px
                rgba(0,0,0,0.8)
              )

              drop-shadow(
                0 0 5px
                rgba(255,255,255,0.8)
              );
          }

          .listing-swiper
          .swiper-button-next:hover,
          .listing-swiper
          .swiper-button-prev:hover {

            filter:
              drop-shadow(
                0 0 8px
                rgba(0,0,0,0.9)
              )

              drop-shadow(
                0 0 12px
                white
              );
          }

          .listing-swiper
          .swiper-pagination-bullet {

            background: white;

            opacity: 0.7;

            box-shadow:
              0 0 5px
              rgba(255,255,255,0.8);
          }

          .listing-swiper
          .swiper-pagination-bullet-active {

            background: white;

            opacity: 1;

            box-shadow:
              0 0 6px white,
              0 0 12px
              rgba(255,255,255,0.9);
          }

        `}
      </style>

    </main>
  );
}