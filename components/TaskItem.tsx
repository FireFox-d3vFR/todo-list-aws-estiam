"use client";

import { useState } from "react";
import { Trash2, Check, GripVertical, X, Edit2 } from "lucide-react";

// Interface pour la structure d'une tâche
interface Task {
  id: string;
  text: string;
  completed: boolean;
}

// Props du composant TaskItem
interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

export default function TaskItem({
  task,
  onDelete,
  onToggle,
  onEdit,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleEdit = () => {
    if (editText.trim() !== "") {
      onEdit(task.id, editText);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`group flex items-center gap-3 p-4 rounded-lg bg-card border border-border transition-all ${
        task.completed ? "opacity-75" : ""
      }`}
    >
      <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
      
      <button
        onClick={() => onToggle(task.id)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          task.completed
            ? "bg-primary border-primary"
            : "border-primary hover:bg-primary/10"
        }`}
      >
        {task.completed && <Check className="w-4 h-4 text-primary-foreground" />}
      </button>

      {isEditing ? (
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="flex-1 bg-background px-2 py-1 rounded border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
          <button
            onClick={handleEdit}
            className="p-1 hover:bg-secondary rounded-full transition-colors"
          >
            <Check className="w-5 h-5 text-primary" />
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setEditText(task.text);
            }}
            className="p-1 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-destructive" />
          </button>
        </div>
      ) : (
        <p
          className={`flex-1 ${
            task.completed ? "line-through text-muted-foreground" : ""
          }`}
        >
          {task.text}
        </p>
      )}

      {!isEditing && (
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 hover:bg-secondary rounded-full transition-colors"
          >
            <Edit2 className="w-5 h-5 text-primary" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 hover:bg-secondary rounded-full transition-colors"
          >
            <Trash2 className="w-5 h-5 text-destructive" />
          </button>
        </div>
      )}
    </div>
  );
}