import { TodoService } from './todo-service';
import { TodoApi } from './todo-api';
import { Todo } from './types';

export class ToDoManager {
  private service = new TodoService(new TodoApi());

  async init(): Promise<void> {
    await this.service.create('Learn TypeScript', 'Complete all JS-TS tasks');
    await this.service.create('Write unit tests', 'Cover service and repository');
    await this.service.create('Build CLI app', 'Implement the ToDoManager facade');
  }

  async add(title: string, description = ''): Promise<void> {
    await this.service.create(title, description);
  }

  async complete(id: number): Promise<void> {
    await this.service.toggleStatus(id);
  }

  async list(): Promise<Todo[]> {
    return this.service.search('');
  }
}
