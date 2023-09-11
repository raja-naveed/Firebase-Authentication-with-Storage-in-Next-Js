import { useRouter } from "next/router";
import { auth } from "@/firebase/firebase";
import ImageUpload from "@/components/ImageUpload";
import { signOut } from "firebase/auth";

export default function Homee() {
  const router = useRouter();
  const handleClick = () => {
    signOut(auth).then((val) => {
      console.log(val, "val");
      router.push("/");
    });
  };
  return (
    <div>
      <div className="bg-gray-100 h-screen">
        <header className="bg-blue-500 p-4">
          <button
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            onClick={handleClick}
          >
            SignOut
          </button>
        </header>

        <main className="container mx-auto p-4">
          <h1 className="text-3xl font-semibold">e</h1>
          <ImageUpload />
        </main>
      </div>
    </div>
  );
}
