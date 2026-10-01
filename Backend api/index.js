import jwt from "jsonwebtoken";
import authMiddleware from "./Middleware/AuthMiddleware.js";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import dns from "dns";
import bcrypt from "bcrypt";
import User from "./Models/User.model.js";
import Listing from "./Models/Listing.model.js";

// ==================== DNS FIX ====================

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

const app = express();

// ==================== MIDDLEWARE ====================

app.use(cors());
app.use(express.json());

// ==================== HOME ROUTE ====================

app.get("/", (req, res) => {
  res.send("API is working!");
});

// ==================== SIGNUP ROUTE ====================

app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      photo: "",
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      message: "Signup failed",
      error: error.message,
    });
  }
});

// ==================== SIGNIN ROUTE ====================

app.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        photo: user.photo || "",
      },
    });
  } catch (error) {
    console.error("Signin error:", error);

    res.status(500).json({
      message: "Signin failed",
      error: error.message,
    });
  }
});

// ==================== GOOGLE OAUTH ROUTE ====================

app.post("/api/oauth/google", async (req, res) => {
  try {
    const { email, name, photo } = req.body;

    console.log("GOOGLE DATA RECEIVED:");
    console.log("Email:", email);
    console.log("Name:", name);
    console.log("Photo:", photo);

    if (!email) {
      return res.status(400).json({
        message: "Google email is required",
      });
    }

    let user = await User.findOne({ email });

    // ==================== CREATE NEW GOOGLE USER ====================

    if (!user) {
      const randomPassword = Math.random()
        .toString(36)
        .slice(-12);

      const hashedPassword = await bcrypt.hash(
        randomPassword,
        10
      );

      user = new User({
        username: name || email.split("@")[0],
        email: email,
        password: hashedPassword,
        photo: photo || "",
      });

      await user.save();

      console.log("NEW GOOGLE USER CREATED");
    }

    // ==================== UPDATE EXISTING GOOGLE USER ====================

    else {
      if (name && user.username !== name) {
        user.username = name;
      }

      if (photo && user.photo !== photo) {
        user.photo = photo;
      }

      await user.save();

      console.log("GOOGLE USER UPDATED");
    }

    console.log("PHOTO SAVED IN DATABASE:", user.photo);

    // ==================== CREATE JWT ====================

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // ==================== RESPONSE ====================

    res.status(200).json({
      message: "Google login successful",

      token,

      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        photo: user.photo || "",
      },
    });
  } catch (error) {
    console.error("Google OAuth error:", error);

    res.status(500).json({
      message: "Google login failed",
      error: error.message,
    });
  }
});

// ==================== PROFILE ROUTE ====================

app.get(
  "/api/profile",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id)
        .select("-password");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.status(200).json({
        message: "Profile fetched successfully",

        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          photo: user.photo || "",
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      console.error("Profile error:", error);

      res.status(500).json({
        message: "Failed to fetch profile",
        error: error.message,
      });
    }
  }
);

// ==================== UPDATE USER ROUTE ====================

app.put(
  "/api/update",
  authMiddleware,
  async (req, res) => {
    try {
      const { username, email } = req.body;

      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      user.username = username || user.username;
      user.email = email || user.email;

      await user.save();

      res.status(200).json({
        message: "User updated successfully",

        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          photo: user.photo || "",
        },
      });
    } catch (error) {
      console.error("Update user error:", error);

      res.status(500).json({
        message: "Failed to update user",
        error: error.message,
      });
    }
  }
);

// ==================== DELETE USER ROUTE ====================

app.delete(
  "/api/delete",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      await User.findByIdAndDelete(req.user.id);

      res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Delete user error:", error);

      res.status(500).json({
        message: "Failed to delete user",
        error: error.message,
      });
    }
  }
);

// ======================================================
// ==================== LISTING ROUTES ==================
// ======================================================
// ==================== CREATE LISTING ====================

app.post(
  "/api/listings",
  authMiddleware,
  async (req, res) => {
    try {
      console.log(
        "Creating listing for user:",
        req.user.id
      );

      const {
        name,
        description,
        address,
        regularPrice,
        discountPrice,
        bathrooms,
        bedrooms,
        furnished,
        parking,
        type,
        offer,
        imageUrls,
      } = req.body;

      // ==================== VALIDATION ====================

      if (
        !name ||
        !description ||
        !address ||
        regularPrice === undefined ||
        discountPrice === undefined ||
        bathrooms === undefined ||
        bedrooms === undefined ||
        furnished === undefined ||
        parking === undefined ||
        !type ||
        offer === undefined ||
        !Array.isArray(imageUrls) ||
        imageUrls.length === 0
      ) {
        return res.status(400).json({
          message: "All listing fields are required",
        });
      }

      // Maximum 6 images
      if (imageUrls.length > 6) {
        return res.status(400).json({
          message: "You can only upload 6 images",
        });
      }

      // Price validation
      if (
        regularPrice < 0 ||
        discountPrice < 0
      ) {
        return res.status(400).json({
          message: "Price cannot be negative",
        });
      }

      // Offer validation
      if (
        offer === true &&
        discountPrice >= regularPrice
      ) {
        return res.status(400).json({
          message:
            "Discount price must be lower than regular price",
        });
      }

      // ==================== CREATE LISTING ====================

      const listing = new Listing({
        name,
        description,
        address,
        regularPrice,
        discountPrice,
        bathrooms,
        bedrooms,
        furnished,
        parking,
        type,
        offer,
        imageUrls,
        userRef: req.user.id,
      });

      // ==================== SAVE LISTING ====================

      const savedListing =
        await listing.save();

      console.log(
        "Saved listing:",
        savedListing
      );

      // ==================== RESPONSE ====================

      res.status(201).json({
        message: "Listing created successfully",
        listing: savedListing,
      });

    } catch (error) {
      console.error(
        "Create listing error:",
        error
      );

      res.status(500).json({
        message: "Failed to create listing",
        error: error.message,
      });
    }
  }
);

// ==================== GET USER LISTINGS ====================

app.get(
  "/api/user-listings",
  authMiddleware,
  async (req, res) => {
    try {
      console.log(
        "Logged in user ID:",
        req.user.id
      );

      const listings = await Listing.find({
        userRef: req.user.id,
      }).sort({
        createdAt: -1,
      });

      console.log(
        "User listings:",
        listings
      );

      res.status(200).json(listings);
    } catch (error) {
      console.error(
        "Get user listings error:",
        error
      );

      res.status(500).json({
        message: "Failed to fetch user listings",
        error: error.message,
      });
    }
  }
);

// ==================== GET SINGLE LISTING ====================

app.get(
  "/api/listings/:id",
  async (req, res) => {
    try {
      const listing = await Listing.findById(
        req.params.id
      );

      if (!listing) {
        return res.status(404).json({
          message: "Listing not found",
        });
      }

      res.status(200).json(listing);
    } catch (error) {
      console.error(
        "Get listing error:",
        error
      );

      res.status(500).json({
        message: "Failed to fetch listing",
        error: error.message,
      });
    }
  }
);

// ==================== GET ALL LISTINGS ====================

app.get(
  "/api/listings",
  async (req, res) => {
    try {
      const listings = await Listing.find()
        .sort({
          createdAt: -1,
        });

      console.log(
        "All listings:",
        listings
      );

      res.status(200).json({
        listings,
      });
    } catch (error) {
      console.error(
        "Get all listings error:",
        error
      );

      res.status(500).json({
        message: "Failed to fetch listings",
        error: error.message,
      });
    }
  }
);

// ==================== UPDATE LISTING ====================

app.put("/api/listings/:id", authMiddleware, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    // Check ownership
    if (listing.userRef.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only update your own listing",
      });
    }

    const {
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      imageUrls,
    } = req.body;

    // Update fields
    listing.name = name;
    listing.description = description;
    listing.address = address;
    listing.regularPrice = regularPrice;
    listing.discountPrice = discountPrice;
    listing.bathrooms = bathrooms;
    listing.bedrooms = bedrooms;
    listing.furnished = furnished;
    listing.parking = parking;
    listing.type = type;
    listing.offer = offer;
    listing.imageUrls = imageUrls;

    // Validation
    if (
      !name ||
      !description ||
      !address ||
      regularPrice === undefined ||
      discountPrice === undefined ||
      bathrooms === undefined ||
      bedrooms === undefined ||
      furnished === undefined ||
      parking === undefined ||
      !type ||
      offer === undefined ||
      !Array.isArray(imageUrls) ||
      imageUrls.length === 0
    ) {
      return res.status(400).json({
        message: "All listing fields are required",
      });
    }

    if (imageUrls.length > 6) {
      return res.status(400).json({
        message: "You can only upload 6 images",
      });
    }

    if (regularPrice < 0 || discountPrice < 0) {
      return res.status(400).json({
        message: "Price cannot be negative",
      });
    }

    if (offer === true && discountPrice >= regularPrice) {
      return res.status(400).json({
        message: "Discount price must be lower than regular price",
      });
    }

    const updatedListing = await listing.save();

    res.status(200).json({
      message: "Listing updated successfully",
      listing: updatedListing,
    });

  } catch (error) {
    console.error("Update listing error:", error);

    res.status(500).json({
      message: "Failed to update listing",
      error: error.message,
    });
  }
});

// ==================== DELETE USER LISTING ====================

app.delete("/api/listings/:id", authMiddleware, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    // Make sure only listing owner can delete it
    if (listing.userRef.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only delete your own listing",
      });
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Listing deleted successfully",
    });
  } catch (error) {
    console.error("Delete listing error:", error);

    res.status(500).json({
      message: "Failed to delete listing",
      error: error.message,
    });
  }
});

app.get("/api/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("username email photo");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get user error:", error);

    res.status(500).json({
      message: "Failed to fetch user",
      error: error.message,
    });
  }
});

// ================= SEARCH LISTINGS =================
app.get("/api/listings", async (req, res) => {
  try {
    const {
      searchTerm = "",
      type,
      parking,
      furnished,
      offer,
      sort = "createdAt",
      order = "desc",
      startIndex = 0,
      limit = 8,
    } = req.query;

    const query = {};

    // Search by name or address
    if (searchTerm) {
      query.$or = [
        {
          name: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          address: {
            $regex: searchTerm,
            $options: "i",
          },
        },
      ];
    }

    // Rent / Sale
    if (type && type !== "all") {
      query.type = type;
    }

    // Parking
    if (parking === "true") {
      query.parking = true;
    }

    // Furnished
    if (furnished === "true") {
      query.furnished = true;
    }

    // Offer
    if (offer === "true") {
      query.offer = true;
    }

    // Sorting
    const sortOrder = order === "asc" ? 1 : -1;

    const listings = await Listing.find(query)
      .sort({
        [sort]: sortOrder,
      })
      .skip(parseInt(startIndex))
      .limit(parseInt(limit));

    res.status(200).json(listings);
  } catch (error) {
    console.error("Fetch listings error:", error);

    res.status(500).json({
      message: "Failed to fetch listings",
    });
  }
});

app.put("/api/update", authMiddleware, async (req, res) => {
  try {
    const { username, email, photo } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update username
    if (username) {
      user.username = username;
    }

    // Update email
    if (email) {
      user.email = email;
    }

    // Update profile photo
    if (photo !== undefined) {
      user.photo = photo;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",

      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        photo: user.photo || "",
      },
    });

  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
});

// ==================== MONGODB ==========================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(
      process.env.PORT || 3000,
      () => {
        console.log(
          `Server is running on port ${
            process.env.PORT || 3000
          }`
        );
      }
    );
  })
  .catch((error) => {
    console.error(
      "MongoDB connection error:",
      error
    );
  });