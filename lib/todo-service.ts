import { PutCommand, GetCommand, DeleteCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "./aws-config";

const TABLE_NAME = "todos";

export interface Task {
  id: string;  // Clé de partition
  text: string;
  completed: boolean;
}

export const todoService = {
  // Récupérer toutes les tâches
  async getAllTasks(): Promise<Task[]> {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
    });

    const response = await docClient.send(command);
    return response.Items as Task[];
  },

  // Ajouter une nouvelle tâche
  async addTask(task: Task): Promise<void> {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: task,
    });

    await docClient.send(command);
  },

  // Mettre à jour une tâche
  async updateTask(task: Task): Promise<void> {
    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id: task.id },
      UpdateExpression: "set #taskText = :taskText, completed = :completed",
      ExpressionAttributeNames: {
        "#taskText": "text"  // Utilisation d'un alias pour éviter le mot réservé
      },
      ExpressionAttributeValues: {
        ":taskText": task.text,
        ":completed": task.completed,
      },
    });

    await docClient.send(command);
  },

  // Supprimer une tâche
  async deleteTask(id: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { id },
    });

    await docClient.send(command);
  },
}; 