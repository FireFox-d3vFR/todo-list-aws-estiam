import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Configuration du client DynamoDB
const client = new DynamoDBClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || "eu-west-3",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || "",
  },
});

// Création du client document DynamoDB
export const docClient = DynamoDBDocumentClient.from(client); 