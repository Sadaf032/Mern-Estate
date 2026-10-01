import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

const demoListings = [
  {
    _id: "demo1",
    name: "Modern Green Villa",
    address: "785 Serenity Road, Willow Lake",
    description:
      "A beautiful modern villa surrounded by greenery with a spacious garden, elegant interior and peaceful environment.",
    regularPrice: 3400,
    discountPrice: 3000,
    type: "rent",
    bedrooms: 4,
    bathrooms: 5,
    parking: true,
    furnished: true,
    offer: true,
    imageUrls: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  {
    _id: "demo2",
    name: "Ultra-Modern Penthouse",
    address: "456 Serenity Lane, Meadowville",
    description:
      "An elegant ultra-modern penthouse featuring luxurious rooms, large windows and beautiful outdoor spaces.",
    regularPrice: 500,
    discountPrice: 450,
    type: "rent",
    bedrooms: 6,
    bathrooms: 5,
    parking: true,
    furnished: true,
    offer: true,
    imageUrls: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  {
    _id: "demo3",
    name: "Modern Luxury Loft",
    address: "101 Serenity Shore Road, Willow Lake",
    description:
      "Enjoy stylish modern living in this luxurious loft with beautiful architecture, spacious rooms and peaceful surroundings.",
    regularPrice: 1200,
    discountPrice: 1100,
    type: "rent",
    bedrooms: 3,
    bathrooms: 5,
    parking: true,
    furnished: true,
    offer: false,
    imageUrls: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  {
    _id: "demo4",
    name: "Home Greenery House",
    address: "123 Maple Lane, Green Valley",
    description:
      "A peaceful home surrounded by greenery. Perfect for families looking for a comfortable and refreshing place to live.",
    regularPrice: 850,
    discountPrice: 750,
    type: "sale",
    bedrooms: 4,
    bathrooms: 3,
    parking: true,
    furnished: true,
    offer: true,
    imageUrls: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  {
    _id: "demo5",
    name: "Luxury Garden Residence",
    address: "22 Palm Street, Green Hills",
    description:
      "A spacious luxury residence with a beautiful garden, modern rooms and premium facilities.",
    regularPrice: 1800,
    discountPrice: 1600,
    type: "sale",
    bedrooms: 5,
    bathrooms: 4,
    parking: true,
    furnished: false,
    offer: true,
    imageUrls: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  {
    _id: "demo6",
    name: "Cozy Family Cottage",
    address: "88 Garden Street, Willowbrook",
    description:
      "A cozy family cottage with a bright interior, peaceful garden and comfortable living space.",
    regularPrice: 650,
    discountPrice: 600,
    type: "rent",
    bedrooms: 3,
    bathrooms: 2,
    parking: true,
    furnished: false,
    offer: false,
    imageUrls: [
      "https://images.unsplash.com/photo-1600047509782-20d39509f26d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  {
    _id: "demo7",
    name: "Contemporary Dream Home",
    address: "55 Lake View Avenue, Meadowville",
    description:
      "A contemporary dream home with beautiful views, modern architecture and spacious living areas.",
    regularPrice: 2200,
    discountPrice: 2000,
    type: "sale",
    bedrooms: 5,
    bathrooms: 4,
    parking: true,
    furnished: true,
    offer: true,
    imageUrls: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  {
    _id: "demo8",
    name: "Elegant White Villa",
    address: "45 Rose Garden Road, Green Valley",
    description:
      "A stunning white villa with elegant interiors, beautiful landscaping and a relaxing atmosphere.",
    regularPrice: 1500,
    discountPrice: 1350,
    type: "rent",
    bedrooms: 4,
    bathrooms: 4,
    parking: true,
    furnished: true,
    offer: false,
    imageUrls: [
      "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    ],
  },
];

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });

  const [listings, setListings] = useState([]);

  // View More state
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const searchTerm = urlParams.get("searchTerm") || "";
    const type = urlParams.get("type") || "all";
    const parking = urlParams.get("parking") === "true";
    const furnished = urlParams.get("furnished") === "true";
    const offer = urlParams.get("offer") === "true";
    const sort = urlParams.get("sort") || "createdAt";
    const order = urlParams.get("order") || "desc";

    setSidebardata({
      searchTerm,
      type,
      parking,
      furnished,
      offer,
      sort,
      order,
    });

    let filteredListings = [...demoListings];

    // SEARCH
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();

      filteredListings = filteredListings.filter(
        (listing) =>
          listing.name.toLowerCase().includes(term) ||
          listing.address.toLowerCase().includes(term) ||
          listing.description.toLowerCase().includes(term)
      );
    }

    // TYPE
    if (type !== "all") {
      filteredListings = filteredListings.filter(
        (listing) => listing.type === type
      );
    }

    // PARKING
    if (parking) {
      filteredListings = filteredListings.filter(
        (listing) => listing.parking === true
      );
    }

    // FURNISHED
    if (furnished) {
      filteredListings = filteredListings.filter(
        (listing) => listing.furnished === true
      );
    }

    // OFFER
    if (offer) {
      filteredListings = filteredListings.filter(
        (listing) => listing.offer === true
      );
    }

    // SORT BY PRICE
    if (sort === "regularPrice") {
      filteredListings.sort((a, b) => {
        if (order === "asc") {
          return a.regularPrice - b.regularPrice;
        }

        return b.regularPrice - a.regularPrice;
      });
    }

    // DEMO DATA SORT
    if (sort === "createdAt" && order === "asc") {
      filteredListings.reverse();
    }

    setListings(filteredListings);

    // Reset View More whenever search/filter changes
    setShowMore(false);
  }, [location.search]);

  // HANDLE SIDEBAR CHANGE
  const handleChange = (e) => {
    const { id, value, checked } = e.target;

    // TYPE
    if (id === "all" || id === "rent" || id === "sale") {
      setSidebardata((prev) => ({
        ...prev,
        type: id,
      }));

      return;
    }

    // SEARCH TERM
    if (id === "searchTerm") {
      setSidebardata((prev) => ({
        ...prev,
        searchTerm: value,
      }));

      return;
    }

    // AMENITIES + OFFER
    if (
      id === "parking" ||
      id === "furnished" ||
      id === "offer"
    ) {
      setSidebardata((prev) => ({
        ...prev,
        [id]: checked,
      }));

      return;
    }

    // SORT
    if (id === "sort_order") {
      const [sort, order] = value.split("_");

      setSidebardata((prev) => ({
        ...prev,
        sort,
        order,
      }));
    }
  };

  // HANDLE SEARCH
  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();

    if (sidebardata.searchTerm.trim()) {
      urlParams.set(
        "searchTerm",
        sidebardata.searchTerm.trim()
      );
    }

    if (sidebardata.type !== "all") {
      urlParams.set("type", sidebardata.type);
    }

    if (sidebardata.parking) {
      urlParams.set("parking", "true");
    }

    if (sidebardata.furnished) {
      urlParams.set("furnished", "true");
    }

    if (sidebardata.offer) {
      urlParams.set("offer", "true");
    }

    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);

    navigate(`/search?${urlParams.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row">

      {/* SIDEBAR */}
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-8"
        >

          {/* SEARCH */}
          <div className="flex items-center gap-2">

            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>

            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />

          </div>

          {/* TYPE */}
          <div className="flex gap-2 flex-wrap items-center">

            <label className="font-semibold">
              Type:
            </label>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "all"}
              />

              <span>Rent & Sale</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "rent"}
              />

              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "sale"}
              />

              <span>Sale</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.offer}
              />

              <span>Offer</span>
            </div>

          </div>

          {/* AMENITIES */}
          <div className="flex gap-2 flex-wrap items-center">

            <label className="font-semibold">
              Amenities:
            </label>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.parking}
              />

              <span>Parking</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.furnished}
              />

              <span>Furnished</span>
            </div>

          </div>

          {/* SORT */}
          <div className="flex items-center gap-2">

            <label className="font-semibold">
              Sort:
            </label>

            <select
              id="sort_order"
              onChange={handleChange}
              value={`${sidebardata.sort}_${sidebardata.order}`}
              className="border rounded-lg p-3"
            >

              <option value="regularPrice_desc">
                Price high to low
              </option>

              <option value="regularPrice_asc">
                Price low to high
              </option>

              <option value="createdAt_desc">
                Latest
              </option>

              <option value="createdAt_asc">
                Oldest
              </option>

            </select>

          </div>

          {/* SEARCH BUTTON */}
          <button
            type="submit"
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
          >
            Search
          </button>

        </form>

      </div>

      {/* LISTINGS */}
      <div className="flex-1 p-7">

        {/* NO LISTINGS */}
        {listings.length === 0 && (
          <p className="text-xl text-slate-700">
            No listing found!
          </p>
        )}

        {/* LISTINGS */}
        {listings.length > 0 && (
          <>
            <div className="flex flex-wrap gap-4">

              {listings
                .slice(
                  0,
                  showMore ? listings.length : 6
                )
                .map((listing) => (
                  <ListingItem
                    key={listing._id}
                    listing={listing}
                  />
                ))}

            </div>

            {/* VIEW MORE */}
            {listings.length > 6 && !showMore && (
              <div className="text-center mt-8">

                <button
                  type="button"
                  onClick={() => setShowMore(true)}
                  className="text-green-700 font-semibold hover:underline"
                >
                  View more
                </button>

              </div>
            )}

          </>
        )}

      </div>

    </div>
  );
}