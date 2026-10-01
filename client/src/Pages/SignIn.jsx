import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice'

import OAuth from '../components/OAuth'

export default function SignIn() {

  const [showSignUp, setShowSignUp] = useState(false)

  // Sign In states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Sign Up states
  const [username, setUsername] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')

  const [message, setMessage] = useState('')

  const navigate = useNavigate()
  const dispatch = useDispatch()


  // ================= SIGN IN =================

  const handleSignIn = async (e) => {
    e.preventDefault()

    try {

      dispatch(signInStart())
      setMessage('')

      const response = await fetch(
        'http://localhost:3000/api/signin',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {

        dispatch(signInFailure(data.message))
        setMessage(data.message)

        return
      }

      // Save user + token in Redux
      dispatch(
        signInSuccess({
          ...data.user,
          token: data.token,
        })
      )

      // Go to Home
      navigate('/')

    } catch (error) {

      dispatch(signInFailure(error.message))
      setMessage('Something went wrong')

    }
  }


  // ================= SIGN UP =================

  const handleSignUp = async (e) => {
    e.preventDefault()

    try {

      setMessage('')

      const response = await fetch(
        'http://localhost:3000/api/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            email: signUpEmail,
            password: signUpPassword,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {

        setMessage(data.message)

        return
      }

      setMessage(
        'Account created successfully! Please sign in.'
      )

      // Switch back to Sign In
      setShowSignUp(false)

      // Put signup email into signin email
      setEmail(signUpEmail)

      // Clear signup fields
      setUsername('')
      setSignUpEmail('')
      setSignUpPassword('')

    } catch (error) {

      setMessage('Something went wrong')

    }
  }


  return (
    <div className="p-3 max-w-lg mx-auto mt-10">

      {/* ================= SIGN IN ================= */}

      {!showSignUp ? (

        <>
          <h1 className="text-3xl text-center font-semibold my-7">
            Sign In
          </h1>

          <form
            onSubmit={handleSignIn}
            className="flex flex-col gap-4"
          >

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-3 rounded-lg"
              required
            />

            <button
              type="submit"
              className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
            >
              Sign In
            </button>

          </form>


          {/* Google Sign In */}

          <div className="mt-4">
            <OAuth />
          </div>


          <p className="text-center mt-5">
            Don't have an account?{' '}

            <button
              type="button"
              onClick={() => {
                setShowSignUp(true)
                setMessage('')
              }}
              className="text-blue-700 font-semibold"
            >
              Sign Up
            </button>

          </p>
        </>

      ) : (

        /* ================= SIGN UP ================= */

        <>
          <h1 className="text-3xl text-center font-semibold my-7">
            Sign Up
          </h1>

          <form
            onSubmit={handleSignUp}
            className="flex flex-col gap-4"
          >

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              className="border p-3 rounded-lg"
              required
            />

            <button
              type="submit"
              className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
            >
              Sign Up
            </button>

          </form>


          <p className="text-center mt-5">
            Already have an account?{' '}

            <button
              type="button"
              onClick={() => {
                setShowSignUp(false)
                setMessage('')
              }}
              className="text-blue-700 font-semibold"
            >
              Sign In
            </button>

          </p>
        </>

      )}


      {/* Message */}

      {message && (
        <p className="text-center mt-5 text-red-600">
          {message}
        </p>
      )}

    </div>
  )
}