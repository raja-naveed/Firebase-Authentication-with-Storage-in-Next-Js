import { sendPasswordResetEmail } from "firebase/auth";
import React from "react";
import { auth } from "@/firebase/firebase";
import Link from "next/link";
import { useRouter } from "next/router";

function ForgotPassword() {
  const history = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const emalVal = e.target.email.value;
    sendPasswordResetEmail(auth, emalVal)
      .then((data) => {
        alert("Check your gmail");
        history.push("/");
      })
      .catch((err) => {
        alert(err.code);
      });
  };
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Forgot Password</h1>
        </div>
        <form onSubmit={(e) => handleSubmit(e)}>
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
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Reset
            </button>
          </div>
        </form>
        <div className="mt-4">
          <Link href="/" className="text-blue-500 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
export default ForgotPassword;
