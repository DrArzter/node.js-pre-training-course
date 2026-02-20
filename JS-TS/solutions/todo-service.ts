import { TodoApi } from './todo-api';
import { Todo, TodoStatus } from './types';

export class TodoService {
  constructor(private readonly api: TodoApi) { }

  async create(title: string, description = ''): Promise<Todo> {
    if (!title || !title.trim()) {
      throw new Error('Title must be a non-empty string');
    }
    return this.api.add({ title: title.trim(), description });
  }

  async toggleStatus(id: number): Promise<Todo> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Id must be a positive integer');
    }
    const todos = await this.api.getAll();
    const todo = todos.find(t => t.id === id);
    if (!todo) {
      throw new Error(`Todo with id ${id} not found`);
    }
    const nextStatus = todo.status === TodoStatus.COMPLETED
      ? TodoStatus.PENDING
      : TodoStatus.COMPLETED;
    return this.api.update(id, { status: nextStatus });
  }

  async search(keyword: string): Promise<Todo[]> {
    const todos = await this.api.getAll();
    const lower = keyword.toLowerCase();
    return todos.filter(t =>
      t.title.toLowerCase().includes(lower) ||
      (t.description ?? '').toLowerCase().includes(lower)
    );
  }
}
