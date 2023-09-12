import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile 
} from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/router";


function RegisterAndLogin() {
  const [login, setLogin] = useState(false);
    const history = useRouter();
  const handleSubmit = async (e, type) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    if (type == "signup") {
     await createUserWithEmailAndPassword(auth, email, password)
        .then((data) => {
          const user = data.user;
       updateProfile(user, {
            displayName: name,
          })
          history.push("/");
        })
        .catch((err) => {
          alert(err.code);
          setLogin(true);
        });
    } else {
     await signInWithEmailAndPassword(auth, email, password)
        .then((data) => {
          console.log(data, "authData");
         
          history.push("/");
        })
        .catch((err) => {
          alert(err.code);
        });
    }
  };

  const handleReset = () => {
    history.push("/reset");
  };
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">
            {login ? "Sign In" : "Sign Up"}
          </h1>
        </div>
        <form onSubmit={(e) => handleSubmit(e, login ? "signin" : "signup")}>
        {!login && <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="name"
              name="name"
              id="name"
              placeholder="Enter your Name"
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <p onClick={handleReset} className="text-blue-500 cursor-pointer">
            Forgot Password?
          </p>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              {login ? "Sign In" : "Sign Up"}
            </button>
          </div>
          <div className="mt-4">
            <p className="text-center text-sm text-gray-600">
              {login ? "Don't have an account? " : "Already have an account? "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => setLogin(!login)}
              >
                {login ? "Sign Up" : "Sign In"}
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
export default RegisterAndLogin;
