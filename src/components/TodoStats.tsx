import React from 'react';
import type { Todo } from '../types';

interface TodoStatsProps {
  todos: Todo[];
}

export function TodoStats({ todos }: TodoStatsProps) {
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.status === 'Completed').length;
  const overdueTodos = todos.filter(todo => 
    new Date(todo.dueDate) < new Date(new Date().setHours(0, 0, 0, 0)) && 
    todo.status !== 'Completed'
  ).length;

  const stats = [
    { label: 'Total Tasks', value: totalTodos },
    { label: 'Completed', value: completedTodos },
    { label: 'Completion Rate', value: `${totalTodos ? Math.round((completedTodos / totalTodos) * 100) : 0}%` },
    { label: 'Overdue', value: overdueTodos },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(({ label, value }) => (
        <div key={label} className="bg-white p-4 rounded-lg shadow-md text-center">
          <dt className="text-sm font-medium text-gray-500">{label}</dt>
          <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
        </div>
      ))}
    </div>
  );
}