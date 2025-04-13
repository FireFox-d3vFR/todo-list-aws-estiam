"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useTheme } from "next-themes";
import TaskInput from "@/components/TaskInput";
import TaskList from "@/components/TaskList";
import Loader from "@/components/Loader";
import { Sun, Moon } from "lucide-react";
import { todoService, Task } from "@/lib/todo-service";
import AuthControls from "./AuthControls"; // Importer le composant d'authentification
import { useAuth } from "react-oidc-context"; // Importer useAuth pour conditionner l'affichage

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { theme, setTheme } = useTheme();
  const auth = useAuth(); // Récupérer l'état d'authentification

  // Charger les tâches SEULEMENT si l'utilisateur est authentifié
  useEffect(() => {
    if (auth.isAuthenticated && !auth.isLoading) {
      const loadTasks = async () => {
        setIsLoading(true); // Remettre isLoading à true pour le chargement des tâches
        try {
          // TODO: Idéalement, récupérer les tâches spécifiques à l'utilisateur authentifié
          // Pour l'instant, récupère toutes les tâches
          const loadedTasks = await todoService.getAllTasks();
          setTasks(loadedTasks);
        } catch (error) {
          console.error("Erreur lors du chargement des tâches:", error);
        } finally {
          setIsLoading(false);
        }
      };
      loadTasks();
    } else if (!auth.isAuthenticated && !auth.isLoading) {
      // Si l'utilisateur n'est pas authentifié (et que le chargement auth est terminé),
      // vider les tâches et arrêter le chargement
      setTasks([]);
      setIsLoading(false);
    }
    // Si auth.isLoading est true, ne rien faire et attendre la fin
  }, [auth.isAuthenticated, auth.isLoading]); // Déclencher l'effet quand l'état d'authentification change

  // ... fonctions addTask, deleteTask, toggleTask, editTask, handleDragEnd ...
  // (Elles ne devraient être appelables que si l'utilisateur est authentifié,
  // mais l'interface utilisateur les cachera si ce n'est pas le cas)
  const addTask = async (text: string) => {
    if (!auth.isAuthenticated) return; // Sécurité supplémentaire
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      completed: false,
      // TODO: Ajouter l'identifiant de l'utilisateur (ex: auth.user?.profile.sub) si votre backend le supporte
    };
    try {
      await todoService.addTask(newTask);
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la tâche:", error);
    }
  };

  const deleteTask = async (id: string) => {
    if (!auth.isAuthenticated) return;
    try {
      await todoService.deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche:", error);
    }
  };

  const toggleTask = async (id: string) => {
    if (!auth.isAuthenticated) return;
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    try {
      const taskToUpdate = updatedTasks.find((task) => task.id === id);
      if (taskToUpdate) {
        await todoService.updateTask(taskToUpdate);
        setTasks(updatedTasks);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche:", error);
    }
  };

  const editTask = async (id: string, newText: string) => {
    if (!auth.isAuthenticated) return;
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, text: newText } : task
    );
    try {
      const taskToUpdate = updatedTasks.find((task) => task.id === id);
      if (taskToUpdate) {
        await todoService.updateTask(taskToUpdate);
        setTasks(updatedTasks);
      }
    } catch (error) {
      console.error("Erreur lors de la modification de la tâche:", error);
    }
  };

  const handleDragEnd = (result: any) => {
    if (!auth.isAuthenticated) return;
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);
    // TODO: Persister le nouvel ordre si nécessaire
  };
  // Fin des fonctions CRUD

  // Affichage conditionnel pendant le chargement initial de l'authentification ou des tâches
  if (auth.isLoading || (auth.isAuthenticated && isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary transition-colors duration-500 bg">
      <div className="max-w-3xl mx-auto p-6">
        {/* Header avec titre, bouton thème et contrôles d'authentification */}
        <div className="flex justify-between items-center mb-8 bg-blue-500 rounded-lg shadow-lg p-4">
          <h1 className="text-4xl font-bold text-primary text-white">Ma Liste de Tâches</h1>
          <div className="flex items-center space-x-4">
            <AuthControls /> {/* Ajouter les contrôles ici */} 
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-6 h-6" />
              ) : (
                <Moon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Afficher le contenu principal seulement si authentifié */}
        {auth.isAuthenticated ? (
          <>
            <TaskInput onAdd={addTask} />
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="tasks">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="mt-8"
                  >
                    <TaskList
                      tasks={tasks}
                      onDelete={deleteTask}
                      onToggle={toggleTask}
                      onEdit={editTask}
                    />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {tasks.length === 0 && !isLoading && (
              <p className="text-center text-muted-foreground mt-8">
                Aucune tâche pour le moment. Ajoutez-en une !
              </p>
            )}
          </>
        ) : (
          // Message si non authentifié (après chargement initial)
          <p className="text-center text-muted-foreground mt-8">
            Veuillez vous connecter pour voir et gérer vos tâches.
          </p>
        )}
      </div>
    </div>
  );
}
