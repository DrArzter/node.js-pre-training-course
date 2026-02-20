import { Todo } from './types';

function ifExists(state: Todo[], id: number): boolean {
  return state.some(todo => todo.id === id);
}

export function addTodo(state: Todo[], todo: Todo): Todo[] {
  return [...state, todo];
}

export function updateTodo(state: Todo[], id: number, update: Partial<Omit<Todo, 'id' | 'createdAt'>>): Todo[] {
  if (!ifExists(state, id)) {
    throw new Error(`Todo with id ${id} does not exist`);
  }
  return state.map(todo => {
    if (todo.id === id) {
      return { ...todo, ...update };
    }
    return todo;
  });
}

export function removeTodo(state: Todo[], id: number): Todo[] {
  if (!ifExists(state, id)) {
    throw new Error(`Todo with id ${id} does not exist`);
  }
  return state.filter(todo => todo.id !== id);
}

export function getTodo(state: Todo[], id: number): Todo | undefined {
  return state.find(todo => todo.id === id);
}