"use client";
import React, { useState } from "react";

export interface BroadcastProps {
  initialMessage?: string;
  onUpdate?: (msg: string) => void;
}

const Broadcast: React.FC<BroadcastProps> = ({
  initialMessage = "",
  onUpdate,
}) => {
  const [message, setMessage] = useState(initialMessage);
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(message);

  const handleSave = () => {
    setMessage(input);
    setEditing(false);
    if (onUpdate) onUpdate(input);
  };

  return (
    <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded mb-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-blue-800">Broadcast Message</span>
        <button
          className="text-xs text-blue-700 underline ml-2"
          onClick={() => setEditing((v) => !v)}
        >
          {editing ? "Cancel" : message ? "Edit" : "Add"}
        </button>
      </div>
      {editing ? (
        <div className="mt-2 flex gap-2">
          <input
            className="flex-1 border rounded px-2 py-1 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter broadcast message..."
          />
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      ) : message ? (
        <div className="mt-2 text-blue-900 text-sm">{message}</div>
      ) : (
        <div className="mt-2 text-blue-400 text-sm italic">
          No broadcast message set.
        </div>
      )}
    </div>
  );
};

export default Broadcast;
