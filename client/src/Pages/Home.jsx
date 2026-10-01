import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  SwiperCore.use([Navigation, Autoplay]);

  // Beautiful property images for Home page
  const homeImages = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80',
  ];

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(
          'http://localhost:3000/api/listings?offer=true&limit=4'
        );

        const data = await res.json();

        if (!res.ok) {
          console.log(data.message);
          return;
        }

        setOfferListings(Array.isArray(data) ? data : []);

        fetchRentListings();
      } catch (error) {
        console.log('Offer listings error:', error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch(
          'http://localhost:3000/api/listings?type=rent&limit=4'
        );

        const data = await res.json();

        if (!res.ok) {
          console.log(data.message);
          return;
        }

        setRentListings(Array.isArray(data) ? data : []);

        fetchSaleListings();
      } catch (error) {
        console.log('Rent listings error:', error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(
          'http://localhost:3000/api/listings?type=sale&limit=4'
        );

        const data = await res.json();

        if (!res.ok) {
          console.log(data.message);
          return;
        }

        setSaleListings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log('Sale listings error:', error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* Top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span>
          <br />
          place with ease
        </h1>

        <div className='text-gray-400 text-xs sm:text-sm'>
          Sadaf Estate is the best place to find your next perfect place to
          live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>

        <Link
          to='/search'
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Let's get started...
        </Link>
      </div>

      {/* Beautiful Property Image Slider */}
      <Swiper
        navigation
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        loop={true}
      >
        {homeImages.map((image, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                backgroundImage: `url(${image})`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
              }}
              className='h-[500px]'
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Listing Results */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>

        {/* Offers */}
        {offerListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>
                Recent offers
              </h2>

              <Link
                className='text-sm text-blue-800 hover:underline'
                to='/search?offer=true'
              >
                Show more offers
              </Link>
            </div>

            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem
                  listing={listing}
                  key={listing._id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Rent */}
        {rentListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>
                Recent places for rent
              </h2>

              <Link
                className='text-sm text-blue-800 hover:underline'
                to='/search?type=rent'
              >
                Show more places for rent
              </Link>
            </div>

            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItem
                  listing={listing}
                  key={listing._id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Sale */}
        {saleListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>
                Recent places for sale
              </h2>

              <Link
                className='text-sm text-blue-800 hover:underline'
                to='/search?type=sale'
              >
                Show more places for sale
              </Link>
            </div>

            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItem
                  listing={listing}
                  key={listing._id}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ================= EXPLORE PROPERTIES ================= */}

<div className="max-w-6xl mx-auto p-3 my-10">

  <div className="flex items-center justify-between mb-5">
    <h2 className="text-2xl font-semibold text-slate-600">
      Explore Our Properties
    </h2>

    <Link
      to="/search"
      className="text-sm text-blue-800 hover:underline"
    >
      View all →
    </Link>
  </div>

  <Swiper
    modules={[Navigation, Autoplay]}
    navigation
    autoplay={{
      delay: 3000,
      disableOnInteraction: false,
    }}
    loop={true}
    spaceBetween={20}
    slidesPerView={1}
    breakpoints={{
      640: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
      1280: {
        slidesPerView: 4,
      },
    }}
  >

    {/* Property 1 */}
    <SwiperSlide>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">

        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85"
          alt="Modern luxury house"
          className="w-full h-56 object-cover"
        />

        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-700">
            Modern Luxury House
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            📍 California, USA
          </p>

          <div className="flex justify-between mt-3 text-sm text-gray-500">
            <span>🛏 4 Beds</span>
            <span>🛁 3 Baths</span>
          </div>

          <p className="text-lg font-bold text-slate-700 mt-3">
            $450,000
          </p>
        </div>

      </div>
    </SwiperSlide>


    {/* Property 2 */}
    <SwiperSlide>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">

        <img
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85"
          alt="Luxury villa"
          className="w-full h-56 object-cover"
        />

        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-700">
            Luxury Villa
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            📍 Miami, USA
          </p>

          <div className="flex justify-between mt-3 text-sm text-gray-500">
            <span>🛏 5 Beds</span>
            <span>🛁 4 Baths</span>
          </div>

          <p className="text-lg font-bold text-slate-700 mt-3">
            $595,000
          </p>
        </div>

      </div>
    </SwiperSlide>


    {/* Property 3 */}
    <SwiperSlide>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">

        <img
          src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85"
          alt="Family home"
          className="w-full h-56 object-cover"
        />

        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-700">
            Beautiful Family Home
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            📍 Texas, USA
          </p>

          <div className="flex justify-between mt-3 text-sm text-gray-500">
            <span>🛏 3 Beds</span>
            <span>🛁 2 Baths</span>
          </div>

          <p className="text-lg font-bold text-slate-700 mt-3">
            $380,000
          </p>
        </div>

      </div>
    </SwiperSlide>


    {/* Property 4 */}
    <SwiperSlide>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">

        <img
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85"
          alt="Modern villa"
          className="w-full h-56 object-cover"
        />

        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-700">
            Modern Villa
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            📍 New York, USA
          </p>

          <div className="flex justify-between mt-3 text-sm text-gray-500">
            <span>🛏 4 Beds</span>
            <span>🛁 3 Baths</span>
          </div>

          <p className="text-lg font-bold text-slate-700 mt-3">
            $520,000
          </p>
        </div>

      </div>
    </SwiperSlide>


    {/* Property 5 */}
    <SwiperSlide>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">

        <img
          src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=85"
          alt="Beautiful modern home"
          className="w-full h-56 object-cover"
        />

        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-700">
            Contemporary Home
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            📍 Los Angeles, USA
          </p>

          <div className="flex justify-between mt-3 text-sm text-gray-500">
            <span>🛏 4 Beds</span>
            <span>🛁 3 Baths</span>
          </div>

          <p className="text-lg font-bold text-slate-700 mt-3">
            $475,000
          </p>
        </div>

      </div>
    </SwiperSlide>


    {/* Property 6 */}
    <SwiperSlide>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">

        <img
          src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=85"
          alt="Premium house"
          className="w-full h-56 object-cover"
        />

        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-700">
            Premium Family House
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            📍 Florida, USA
          </p>

          <div className="flex justify-between mt-3 text-sm text-gray-500">
            <span>🛏 5 Beds</span>
            <span>🛁 4 Baths</span>
          </div>

          <p className="text-lg font-bold text-slate-700 mt-3">
            $620,000
          </p>
        </div>

      </div>
    </SwiperSlide>

  </Swiper>

</div>
    </div>
  );
}