"use client";

import { useAuth } from "react-oidc-context";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function AuthCallbackPage() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Vérifier si l'utilisateur est authentifié après le traitement du callback
    if (!auth.isLoading && auth.isAuthenticated) {
      // Rediriger vers la page d'accueil ou une page protégée
      router.push("/");
    } else if (!auth.isLoading && auth.error) {
      // Gérer l'erreur d'authentification
      console.error("Erreur d'authentification:", auth.error);
      // Rediriger vers une page d'erreur ou la page de connexion
      router.push("/"); // Ou une page /error
    }
    // Ne rien faire pendant le chargement
  }, [auth.isLoading, auth.isAuthenticated, auth.error, router]);

  return <div>Traitement de l&apos;authentification...</div>;
}
