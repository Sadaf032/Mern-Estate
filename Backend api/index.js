import jwt from 'jsonwebtoken';
import authMiddleware from './Middleware/AuthMiddleware.js';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import dns from 'dns';
import bcrypt from 'bcrypt';
import User from './Models/User.model.js';

// DNS Fix
dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();

const app = express();

// ==================== MIDDLEWARE ====================

app.use(cors());
app.use(express.json());


// ==================== HOME ROUTE ====================

app.get('/', (req, res) => {
  res.send('API is working!');
});


// ==================== SIGNUP ROUTE ====================

app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check fields
    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required'
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    // Save user
    await user.save();

    res.status(201).json({
      message: 'User registered successfully'
    });

  } catch (error) {
    console.error('Signup error:', error);

    res.status(500).json({
      message: 'Signup failed',
      error: error.message
    });
  }
});


// ==================== SIGNIN ROUTE ====================

app.post('/api/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    // Check password
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: 'Invalid password'
      });
    }

    // ==================== CREATE JWT ====================

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    // ==================== LOGIN RESPONSE ====================

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Signin error:', error);

    res.status(500).json({
      message: 'Signin failed',
      error: error.message
    });
  }
});


// ==================== PROTECTED PROFILE ROUTE ====================

app.get('/api/profile', authMiddleware, async (req, res) => {
  try {

    // Find logged-in user
    const user = await User.findById(req.user.id)
      .select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.status(200).json({
      message: 'Profile fetched successfully',
      user
    });

  } catch (error) {
    console.error('Profile error:', error);

    res.status(500).json({
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});


// ==================== MONGODB CONNECTION ====================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {

    console.log('MongoDB Connected');

    app.listen(process.env.PORT || 3000, () => {

      console.log(
        `Server is running on port ${process.env.PORT || 3000}`
      );

    });

  })
  .catch((error) => {

    console.error(
      'MongoDB connection error:',
      error
    );

  });