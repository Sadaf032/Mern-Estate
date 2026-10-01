import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./Pages/Home";
import About from "./Pages/About";
import SignIn from "./Pages/SignIn";
import Profile from "./Pages/Profile";
import CreateListing from "./Pages/CreateListing";
import Listing from "./Pages/Listing";
import ListingDetail from "./Pages/ListingDetail";
import Search from "./Pages/Search";
import Header from "./components/Header";

export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/sign-in"
          element={<SignIn />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* CREATE LISTING */}
        <Route
          path="/create-listing"
          element={<CreateListing />}
        />

        {/* UPDATE LISTING */}
        <Route
          path="/create-listing/:id"
          element={<CreateListing />}
        />

        {/* ALL LISTINGS */}
        <Route
          path="/listing"
          element={<Listing />}
        />

        {/* SINGLE LISTING */}
        <Route
          path="/listing/:id"
          element={<ListingDetail />}
        />

        <Route
        path="/search"
       element={<Search />}
      />

      </Routes>
    </BrowserRouter>
  );
}