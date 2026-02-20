import { InMemoryRepository } from './repository';
import { Todo, NewTodo } from './types';
import { createTodo } from './todo-factory';

export class TodoNotFoundError extends Error {
  constructor(id: number) {
    super(`Todo with id ${id} not found`);
    this.name = 'TodoNotFoundError';
  }
}

export class TodoApi {
  private repo = new InMemoryRepository<Todo>();

  private randomDelay(): Promise<void> {
    const ms = 300 + Math.floor(Math.random() * 300);
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll(): Promise<Todo[]> {
    await this.randomDelay();
    return this.repo.findAll();
  }

  async add(newTodo: NewTodo): Promise<Todo> {
    await this.randomDelay();
    const todo = createTodo(newTodo);
    return this.repo.add(todo);
  }

  async update(id: number, update: Partial<Omit<Todo, 'id' | 'createdAt'>>): Promise<Todo> {
    await this.randomDelay();
    try {
      return this.repo.update(id, update);
    } catch {
      throw new TodoNotFoundError(id);
    }
  }

  async remove(id: number): Promise<void> {
    await this.randomDelay();
    try {
      this.repo.remove(id);
    } catch {
      throw new TodoNotFoundError(id);
    }
  }
}
