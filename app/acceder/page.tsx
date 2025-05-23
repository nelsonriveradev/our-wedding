"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import type { User } from "firebase/auth";
import { auth, signInWithGoogle } from "@/lib/firebase"; // Adjust path if necessary
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@/myComponents/SignOutBtn";

export default function SignIn() {
  const router = useRouter();
  const [userData, setUserData] = useState<User | undefined>();
  //   const [userToken, setUserToken] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      setUserData(currentUser || undefined);
      setLoading(false);
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  async function authHandle() {
    try {
      setLoading(true);
      const user = await signInWithGoogle();
      if (user?.displayName) {
        setUserData(user);
        console.log("Signed in user:", user);
        router.push("/subir-fotos");
        setLoading(false);
      } else {
        console.error("Google Sign-In failed from page.");
        // Optionally, display an error message to the user here
      }
    } catch (error) {
      console.error(`Error Logging in: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  // If loading, show a loading message
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-amber-50 items-center justify-center p-4">
        {userData?.email ? <SignOutButton /> : null}
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-8 w-8 text-[#669D31] mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <p className="text-lg text-[#669D31]">Cargando...</p>
        </div>
      </div>
    );
  }

  // If user is already signed in (e.g. navigated back to sign-in page),
  // this part might not be reached if useEffect redirects first.
  // However, it's good for clarity or if redirection in useEffect is conditional.
  if (userData?.email) {
    // This part will likely not be rendered if useEffect redirects immediately.
    // You might want to show a "Redirecting..." message or handle this differently.
    return (
      <div className="flex flex-col min-h-screen bg-amber-50 items-center justify-center p-4">
        <p>Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-amber-50 items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#11270b]">
          Nelson & Yashalee
        </h1>
        <div
          className="relative w-24 h-24 mx-auto my-4 overflow-hidden rounded-full border-4"
          style={{ borderColor: "#71b340" }}
        >
          <Image
            src="/placeholder.svg?height=100&width=100"
            alt="Wedding Logo"
            fill
            className="object-cover"
          />
        </div>
        <p className="text-lg text-[#669D31]">
          Inicia sesión para ver y compartir fotos de la boda
        </p>
      </div>

      <Button
        onClick={authHandle}
        className="w-full max-w-xs bg-[#669D31] hover:bg-[#598B2c] text-white font-semibold py-2 rounded-lg flex items-center justify-center"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
          <path d="M1 1h22v22H1z" fill="none" />
        </svg>
        Sign in with Google
      </Button>
    </div>
  );
}
