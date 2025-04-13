"use client";

import { AuthProvider } from "react-oidc-context";
import React from "react";

const cognitoAuthConfig = {
  authority: process.env.NEXT_PUBLIC_COGNITO_AUTHORITY!,
  client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
  redirect_uri: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI!,
  response_type: "code",
  scope: "openid email phone", // Ajustez les scopes si nécessaire
  // Optionnel: Configuration pour le rafraîchissement automatique du token
  automaticSilentRenew: true,
  // Optionnel: URL de déconnexion post-logout
  post_logout_redirect_uri: process.env.NEXT_PUBLIC_COGNITO_LOGOUT_URI,
};

interface AuthProviderWrapperProps {
  children: React.ReactNode;
}

export default function AuthProviderWrapper({ children }: AuthProviderWrapperProps) {
  // Gérer le cas où les variables d'env ne sont pas définies côté client
  if (!cognitoAuthConfig.authority || !cognitoAuthConfig.client_id || !cognitoAuthConfig.redirect_uri) {
    return (
      <div>
        Erreur de configuration: Vérifiez les variables d&apos;environnement Cognito.
      </div>
    );
  }

  return <AuthProvider {...cognitoAuthConfig}>{children}</AuthProvider>;
}
