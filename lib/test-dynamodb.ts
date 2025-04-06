import { docClient } from "./aws-config";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

export async function testDynamoDBConnection() {
  try {
    // Afficher les informations de configuration
    console.log("Configuration AWS :", {
      region: process.env.NEXT_PUBLIC_AWS_REGION,
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID ? "présent" : "absent",
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY ? "présent" : "absent",
    });

    // Test de connexion en essayant d'ajouter une tâche
    const testTask = {
      id: "test-" + Date.now(),
      text: "Test de connexion",
      completed: false,
    };

    const command = new PutCommand({
      TableName: "todos",
      Item: testTask,
    });

    await docClient.send(command);
    console.log("✅ Connexion à DynamoDB réussie !");
    return true;
  } catch (error) {
    console.error("❌ Erreur de connexion à DynamoDB:", error);
    if (error instanceof Error) {
      if (error.message.includes("Missing the key")) {
        console.error("⚠️ La table 'todos' n'existe pas encore. Veuillez la créer dans la console AWS DynamoDB.");
      } else if (error.message.includes("security token")) {
        console.error("⚠️ Les credentials AWS sont invalides. Vérifiez votre fichier .env.local");
      } else {
        console.error("Message d'erreur détaillé:", error.message);
        console.error("Stack trace:", error.stack);
      }
    }
    return false;
  }
} 