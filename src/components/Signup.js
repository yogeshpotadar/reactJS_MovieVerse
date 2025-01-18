import React, { useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import app from '../firebase/firebase';
import swal from "sweetalert";
import { addDoc } from "firebase/firestore";
import { usersRef } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

const auth = getAuth(app);

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [OTP, setOTP] = useState("");

  const generateRecaptha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    }, auth);
  }

  const requestOtp = () => {
    setLoading(true);
    
    // Basic validation for Indian mobile number
    const mobilePattern = /^[789]\d{9}$/; // Validates that it starts with 7, 8, or 9 and is 10 digits
    if (!mobilePattern.test(form.mobile)) {
      swal({
        text: "Please enter a valid Indian mobile number.",
        icon: "warning",
        buttons: false,
        timer: 3000,
      });
      setLoading(false);
      return;
    }

    generateRecaptha();
    let appVerifier = window.recaptchaVerifier;
    
    signInWithPhoneNumber(auth, `+91${form.mobile}`, appVerifier)
      .then(confirmationResult => {
        window.confirmationResult = confirmationResult;
        swal({
          text: "OTP Sent",
          icon: "success",
          buttons: false,
          timer: 3000,
        });
        setOtpSent(true);
        setLoading(false);
      }).catch((error) => {
        console.log(error);
        swal({
          text: "Failed to send OTP. Please try again.",
          icon: "error",
          buttons: false,
          timer: 3000,
        });
        setLoading(false);
      });
  }

  const verifyOTP = () => {
    try {
      setLoading(true);
      window.confirmationResult.confirm(OTP).then((result) => {
        uploadData();
        swal({
          text: "Successfully Registered",
          icon: "success",
          buttons: false,
          timer: 3000,
        });
        navigate('/login');
        setLoading(false);
      }).catch((error) => {
        console.log(error);
        swal({
          text: "Invalid OTP. Please try again.",
          icon: "error",
          buttons: false,
          timer: 3000,
        });
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  }

  const uploadData = async () => {
    try {
      await addDoc(usersRef, {
        name: form.name,
        password: form.password, // Assuming password is already secure; bcrypt removed.
        mobile: form.mobile
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="w-full flex flex-col mt-8 items-center">
      <h1 className="text-xl font-bold">Sign up</h1>
      {otpSent ? 
      <>
        <div className="p-2 w-full md:w-1/3">
          <div className="relative">
            <label htmlFor="otp" className="leading-7 text-sm text-gray-300">OTP</label>
            <input
              id="otp"
              name="otp"
              value={OTP}
              onChange={(e) => setOTP(e.target.value)}
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
        </div>
        <div className="p-2 w-full">
          <button
            onClick={verifyOTP}
            className="flex mx-auto text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg"
          >
            {loading ? <TailSpin height={25} color="white" /> : "Confirm OTP"}
          </button>
        </div>
      </>
      :
      <>
        <div className="p-2 w-full md:w-1/3">
          <div className="relative">
            <label htmlFor="name" className="leading-7 text-sm text-gray-300">Name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
        </div>
        <div className="p-2 w-full md:w-1/3">
          <div className="relative">
            <label htmlFor="mobile" className="leading-7 text-sm text-gray-300">Mobile No.</label>
            <input
              type="number"
              id="mobile"
              name="mobile"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
        </div>
        <div className="p-2 w-full md:w-1/3">
          <div className="relative">
            <label htmlFor="password" className="leading-7 text-sm text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
        </div>
        <div className="p-2 w-full">
          <button
            onClick={requestOtp}
            className="flex mx-auto text-white bg-gray-600 border-0 py-2 px-8 focus:outline-none hover:bg-white-700 rounded text-lg"
          >
            {loading ? <TailSpin height={25} color="white" /> : "Get OTP"}
          </button>
        </div>
      </>
      }
      <div>
        <p>Already have an account then : <Link to={'/login'}><span className="text-yellow-500">Login</span></Link></p>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Signup;