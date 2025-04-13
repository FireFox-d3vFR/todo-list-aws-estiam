"use client";

import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button";
import React from "react";

export default function AuthControls() {
  const auth = useAuth();

  const handleSignOut = async () => {
    try {
      await auth.removeUser();
      
      window.location.href = process.env.NEXT_PUBLIC_COGNITO_LOGOUT_URI || "/";
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  if (auth.isLoading) {
    return <div>Chargement de l&apos;authentification...</div>;
  }

  if (auth.error) {
    console.error("Auth Error:", auth.error);
    return (
      <div>
        Erreur d&apos;authentification: {auth.error.message}
        <Button onClick={() => auth.signinRedirect()} className="ml-2">Réessayer</Button>
      </div>
    );
  }

  if (auth.isAuthenticated) {
    return (
      <div className="flex items-center space-x-4">
        <span>Bonjour, {auth.user?.profile.email ?? auth.user?.profile.name ?? "Utilisateur"}</span>
        <Button variant="outline" onClick={handleSignOut}>Se déconnecter</Button>
      </div>
    );
  }

  return (
    <Button onClick={() => auth.signinRedirect()}>Se connecter</Button>
  );
}