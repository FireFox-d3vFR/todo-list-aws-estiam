"use client";

import { useEffect, useState } from "react";
import { testDynamoDBConnection } from "@/lib/test-dynamodb";

export default function TestPage() {
  const [testResult, setTestResult] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runTest = async () => {
      try {
        const result = await testDynamoDBConnection();
        setTestResult(result);
      } catch (error) {
        console.error("Erreur lors du test:", error);
        setTestResult(false);
      } finally {
        setLoading(false);
      }
    };

    runTest();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 rounded-lg bg-card border border-border">
        <h1 className="text-2xl font-bold mb-4">Test de connexion DynamoDB</h1>
        {loading ? (
          <p>Test en cours...</p>
        ) : testResult ? (
          <p className="text-green-500">✅ Connexion réussie !</p>
        ) : (
          <p className="text-red-500">❌ Erreur de connexion</p>
        )}
      </div>
    </div>
  );
} 