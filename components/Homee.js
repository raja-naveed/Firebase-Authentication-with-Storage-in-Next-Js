import { useRouter } from "next/router";
import { auth } from "@/firebase/firebase";
import ImageUpload from "@/components/ImageUpload";
import { signOut } from "firebase/auth";
import { useEffect } from 'react';
export default function Homee({ user }) {
  console.log(user);
  const router = useRouter();
  const handleClick = () => {
    signOut(auth).then((val) => {
      console.log(val, "val");
      router.push("/");
    });
  };
  useEffect(() => {
    console.log('user');
  }, []);

  return (
    <div className="bg-gray-100 h-screen">
      <header className="bg-blue-500 p-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-semibold">
          Welcome {user.displayName}
        </h1>
        <button
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          onClick={handleClick}
        >
          Sign Out
        </button>
      </header>

      <main className="container mx-auto p-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">File Upload</h2>
          <ImageUpload />
        </div>
      </main>
    </div>
  );
}
