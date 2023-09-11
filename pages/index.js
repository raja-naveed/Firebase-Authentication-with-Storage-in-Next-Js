import { useEffect, useState } from "react";
import { auth } from '@/firebase/firebase';
import Homee from "@/components/Homee";
import RegisterAndLogin from './../components/RegisterAndLogin';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User is signed in.
        setUser(authUser);
      } else {
        // User is signed out.
        setUser(null);
      }
    });

    // Clean up the listener when the component unmounts.
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? (
        <Homee user={user} />
      ) : (
        <RegisterAndLogin />
      )}
      {/* <ForgotPassword /> */}
    </div>
  );
}
