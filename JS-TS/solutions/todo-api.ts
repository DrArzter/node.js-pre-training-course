import { Todo, NewTodo } from './types';
import { createTodo } from './todo-factory';

export class TodoNotFoundError extends Error {
  constructor(id: number) {
    super(`Todo with id ${id} not found`);
    this.name = 'TodoNotFoundError';
  }
}

export class TodoApi {
  private todos: Todo[] = [];

  private randomDelay(): Promise<void> {
    const ms = 300 + Math.floor(Math.random() * 300);
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll(): Promise<Todo[]> {
    await this.randomDelay();
    return [...this.todos];
  }

  async add(newTodo: NewTodo): Promise<Todo> {
    await this.randomDelay();
    const todo = createTodo(newTodo);
    this.todos.push(todo);
    return todo;
  }

  async update(id: number, update: Partial<Omit<Todo, 'id' | 'createdAt'>>): Promise<Todo> {
    await this.randomDelay();
    const index = this.todos.findIndex(t => t.id === id);
    if (index === -1) {
      throw new TodoNotFoundError(id);
    }
    this.todos[index] = { ...this.todos[index], ...update };
    return this.todos[index];
  }

  async remove(id: number): Promise<void> {
    await this.randomDelay();
    const index = this.todos.findIndex(t => t.id === id);
    if (index === -1) {
      throw new TodoNotFoundError(id);
    }
    this.todos.splice(index, 1);
  }
}
