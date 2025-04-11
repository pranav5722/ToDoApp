import React, { useState, useEffect } from 'react';
import { ListTodo, Calendar, Tags } from 'lucide-react';
import type { Todo, TodoFormData, Status } from './types';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoStats } from './components/TodoStats';

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (data: TodoFormData) => {
    const newTodo: Todo = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const handleEditTodo = (data: TodoFormData) => {
    if (!editingTodo) return;
    setTodos(prev =>
      prev.map(todo =>
        todo.id === editingTodo.id ? { ...todo, ...data } : todo
      )
    );
    setEditingTodo(null);
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const handleStatusChange = (id: string, status: Status) => {
    setTodos(prev =>
      prev.map(todo => (todo.id === id ? { ...todo, status } : todo))
    );
  };

  const filteredTodos = todos
    .filter(todo => statusFilter === 'All' || todo.status === statusFilter)
    .filter(todo =>
      todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(todo =>
      selectedTags.length === 0 ||
      selectedTags.every(tag => todo.tags.includes(tag))
    );

  const allTags = Array.from(
    new Set(todos.flatMap(todo => todo.tags))
  );

  const groupedByDate = filteredTodos.reduce((acc, todo) => {
    const date = todo.dueDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(todo);
    return acc;
  }, {} as Record<string, Todo[]>);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Todo List</h1>
            <TodoStats todos={todos} />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              {editingTodo ? (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Edit Todo</h2>
                  <TodoForm
                    onSubmit={handleEditTodo}
                    initialData={editingTodo}
                    isEditing
                  />
                  <button
                    onClick={() => setEditingTodo(null)}
                    className="mt-4 w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Cancel Editing
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Add New Todo</h2>
                  <TodoForm onSubmit={handleAddTodo} />
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="flex flex-wrap gap-4 items-center mb-6">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search todos..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setView('list')}
                      className={`p-2 rounded-md ${
                        view === 'list'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <ListTodo size={20} />
                    </button>
                    <button
                      onClick={() => setView('calendar')}
                      className={`p-2 rounded-md ${
                        view === 'calendar'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Calendar size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as Status | 'All')}
                    className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All Status</option>
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <div className="flex-1 flex flex-wrap gap-2 items-center">
                    <Tags size={20} className="text-gray-500" />
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() =>
                          setSelectedTags(prev =>
                            prev.includes(tag)
                              ? prev.filter(t => t !== tag)
                              : [...prev, tag]
                          )
                        }
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedTags.includes(tag)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>

                {view === 'list' ? (
                  <TodoList
                    todos={filteredTodos}
                    onEdit={setEditingTodo}
                    onDelete={handleDeleteTodo}
                    onStatusChange={handleStatusChange}
                  />
                ) : (
                  <div className="space-y-6">
                    {Object.entries(groupedByDate)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([date, todos]) => (
                        <div key={date} className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold mb-4">
                            {new Date(date).toLocaleDateString(undefined, {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </h3>
                          <TodoList
                            todos={todos}
                            onEdit={setEditingTodo}
                            onDelete={handleDeleteTodo}
                            onStatusChange={handleStatusChange}
                          />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;