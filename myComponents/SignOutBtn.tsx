import { Button } from "@/components/ui/button";
import { signOutUser } from "@/lib/firebase";
import { useState } from "react";

export function SignOutButton({ onSignOut }: { onSignOut?: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOutUser();
    setLoading(false);
    if (onSignOut) onSignOut();
  };

  return (
    <Button
      onClick={handleSignOut}
      disabled={loading}
      className="w-full max-w-xs bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg"
    >
      {loading ? "Cerrando sesión..." : "Cerrar sesión"}
    </Button>
  );
}
