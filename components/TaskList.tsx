"use client";

import { Draggable } from "@hello-pangea/dnd";
import TaskItem from "./TaskItem";

// Interface pour la structure d'une tâche
interface Task {
  id: string;
  text: string;
  completed: boolean;
}

// Props du composant TaskList
interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

export default function TaskList({
  tasks,
  onDelete,
  onToggle,
  onEdit,
}: TaskListProps) {
  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <Draggable key={task.id} draggableId={task.id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <TaskItem
                task={task}
                onDelete={onDelete}
                onToggle={onToggle}
                onEdit={onEdit}
              />
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
}