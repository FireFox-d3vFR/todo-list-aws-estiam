import { APIGatewayProxyHandler } from "aws-lambda";
import { todoService } from "../lib/todo-service";

export const handler: APIGatewayProxyHandler = async () => {
  try {
    const tasks = await todoService.getAllTasks();
    return {
      statusCode: 200,
      body: JSON.stringify(tasks),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Erreur serveur" }),
    };
  }
};
