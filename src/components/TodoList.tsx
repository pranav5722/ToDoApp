import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import type { Todo } from '../types';

interface TodoListProps {
  todos: Todo[];
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Todo['status']) => void;
}

const priorityColors = {
  Low: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-red-100 text-red-800',
};

const statusColors = {
  'Todo': 'bg-gray-100 text-gray-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Completed': 'bg-green-100 text-green-800',
};

export function TodoList({ todos, onEdit, onDelete, onStatusChange }: TodoListProps) {
  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date(new Date().setHours(0, 0, 0, 0));
  };

  return (
    <div className="space-y-4">
      {todos.map(todo => (
        <div
          key={todo.id}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">{todo.title}</h3>
              {todo.description && (
                <p className="text-gray-600">{todo.description}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(todo)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <Edit2 size={20} />
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className="p-2 text-red-400 hover:text-red-600"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[todo.priority]}`}>
              {todo.priority}
            </span>
            <select
              value={todo.status}
              onChange={(e) => onStatusChange(todo.id, e.target.value as Todo['status'])}
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${statusColors[todo.status]}`}
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isOverdue(todo.dueDate) ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
            }`}>
              Due: {new Date(todo.dueDate).toLocaleDateString()}
            </span>
          </div>

          {todo.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {todo.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}