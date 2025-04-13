"use client";

import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button"; // Assurez-vous d'avoir un composant Button (shadcn/ui?)
import React from "react";

export default function AuthControls() {
  const auth = useAuth();

  // Fonction de déconnexion personnalisée pour Cognito
  const signOutCognito = async () => {
    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
    const logoutUri = process.env.NEXT_PUBLIC_COGNITO_LOGOUT_URI;
    const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;

    if (!clientId || !logoutUri || !cognitoDomain) {
      console.error("Configuration de déconnexion Cognito incomplète.");
      // Tenter une déconnexion locale simple comme fallback
      await auth.removeUser();
      return;
    }

    try {
        // Vider l'état local d'abord
        await auth.removeUser();
        // Rediriger vers l'endpoint de déconnexion Cognito
        const logoutUrl = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
        window.location.href = logoutUrl;
    } catch (error) {
        console.error("Erreur lors de la déconnexion Cognito:", error);
        // Tenter une déconnexion locale simple même en cas d'échec de redirection
        await auth.removeUser();
    }
  };

  // Gérer l'état de chargement
  if (auth.isLoading) {
    return <div>Chargement de l&apos;authentification...</div>;
  }

  // Gérer l'état d'erreur
  if (auth.error) {
    console.error("Auth Error:", auth.error);
    return (
      <div>
        Erreur d&apos;authentification: {auth.error.message}
        <Button onClick={() => auth.signinRedirect()} className="ml-2">Réessayer</Button>
      </div>
    );
  }

  // Si authentifié, afficher les infos et le bouton de déconnexion
  if (auth.isAuthenticated) {
    return (
      <div className="flex items-center space-x-4">
        <span>Bonjour, {auth.user?.profile.email ?? auth.user?.profile.name ?? "Utilisateur"}</span>
        <Button variant="outline" onClick={signOutCognito}>Se déconnecter</Button>
        {/* Optionnel: Afficher plus d'infos pour le debug */}
        {/*
        <details>
          <summary>Tokens</summary>
          <pre style={{ fontSize: '10px', overflowX: 'auto' }}>
            ID Token: {auth.user?.id_token}
            Access Token: {auth.user?.access_token}
          </pre>
        </details>
        */}
      </div>
    );
  }

  // Si non authentifié, afficher le bouton de connexion
  return (
    <Button onClick={() => auth.signinRedirect()}>Se connecter</Button>
  );
}
