"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

// Composant pour l'ajout de nouvelles tâches
interface TaskInputProps {
  onAdd: (text: string) => void;
}

export default function TaskInput({ onAdd }: TaskInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ajouter une nouvelle tâche..."
        className="flex-1 px-4 py-2 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Ajouter
      </button>
    </form>
  );
}