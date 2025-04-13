"use client";

import { AuthProvider } from "react-oidc-context";
import React from "react";

// Récupérer les valeurs depuis les variables d'environnement
const authority = process.env.NEXT_PUBLIC_COGNITO_AUTHORITY!;
const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
const redirectUri = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI!;
const postLogoutRedirectUri = process.env.NEXT_PUBLIC_COGNITO_LOGOUT_URI!;
const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!; // Doit être défini dans .env

const cognitoAuthConfig = {
  authority: authority,
  client_id: clientId,
  redirect_uri: redirectUri,
  response_type: "code",
  scope: "openid email phone", // Ajustez si nécessaire
  automaticSilentRenew: true,
  post_logout_redirect_uri: postLogoutRedirectUri,
  // Expliciter les métadonnées pour plus de robustesse
  metadata: {
    issuer: authority,
    authorization_endpoint: `https://${cognitoDomain}/oauth2/authorize`,
    token_endpoint: `https://${cognitoDomain}/oauth2/token`,
    userinfo_endpoint: `https://${cognitoDomain}/oauth2/userInfo`,
    end_session_endpoint: `https://${cognitoDomain}/logout`,
    jwks_uri: `${authority}/.well-known/jwks.json`,
  },
};

interface AuthProviderWrapperProps {
  children: React.ReactNode;
}

export default function AuthProviderWrapper({ children }: AuthProviderWrapperProps) {
  // Vérifier que les variables nécessaires sont chargées
  if (!authority || !clientId || !redirectUri || !cognitoDomain || !postLogoutRedirectUri) {
    console.error("Variables d'environnement Cognito manquantes ou invalides:", {
        authority, clientId, redirectUri, cognitoDomain, postLogoutRedirectUri
    });
    return (
      <div>
        Erreur de configuration: Vérifiez les variables d&apos;environnement Cognito et le rechargement du serveur.
      </div>
    );
  }

  return <AuthProvider {...cognitoAuthConfig}>{children}</AuthProvider>;
}
