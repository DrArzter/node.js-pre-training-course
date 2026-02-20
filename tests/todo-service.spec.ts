import { InMemoryRepository } from '../JS-TS/solutions/repository';
import { TodoApi, TodoNotFoundError } from '../JS-TS/solutions/todo-api';
import { TodoService } from '../JS-TS/solutions/todo-service';
import { TodoStatus } from '../JS-TS/solutions/types';

// Mock setTimeout to keep tests fast
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

async function withFakeTimers<T>(fn: () => Promise<T>): Promise<T> {
  const promise = fn();
  promise.catch(() => {});
  await jest.runAllTimersAsync();
  return await promise;
}

describe('InMemoryRepository', () => {
  interface Entity { id: number; name: string; }
  let repo: InMemoryRepository<Entity>;

  beforeEach(() => {
    repo = new InMemoryRepository<Entity>();
  });

  it('add returns the entity and findAll contains it', () => {
    const e = repo.add({ id: 1, name: 'A' });
    expect(e).toEqual({ id: 1, name: 'A' });
    expect(repo.findAll()).toHaveLength(1);
  });

  it('findAll returns a copy, not the internal array', () => {
    repo.add({ id: 1, name: 'A' });
    const all = repo.findAll();
    all.push({ id: 99, name: 'X' });
    expect(repo.findAll()).toHaveLength(1);
  });

  it('findById returns the correct entity', () => {
    repo.add({ id: 1, name: 'A' });
    repo.add({ id: 2, name: 'B' });
    expect(repo.findById(2)?.name).toBe('B');
  });

  it('findById returns undefined for missing id', () => {
    expect(repo.findById(999)).toBeUndefined();
  });

  it('update patches the entity', () => {
    repo.add({ id: 1, name: 'A' });
    const updated = repo.update(1, { name: 'AA' });
    expect(updated.name).toBe('AA');
    expect(repo.findById(1)?.name).toBe('AA');
  });

  it('update throws for non-existing id', () => {
    expect(() => repo.update(999, { name: 'X' })).toThrow();
  });

  it('remove deletes the entity', () => {
    repo.add({ id: 1, name: 'A' });
    repo.remove(1);
    expect(repo.findById(1)).toBeUndefined();
    expect(repo.findAll()).toHaveLength(0);
  });

  it('remove throws for non-existing id', () => {
    expect(() => repo.remove(999)).toThrow();
  });
});

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    service = new TodoService(new TodoApi());
  });

  it('create returns a todo with correct title', async () => {
    const todo = await withFakeTimers(() => service.create('Buy milk'));
    expect(todo.title).toBe('Buy milk');
    expect(todo.status).toBe(TodoStatus.PENDING);
    expect(todo.id).toBeGreaterThan(0);
  });

  it('create trims whitespace from title', async () => {
    const todo = await withFakeTimers(() => service.create('  Buy milk  '));
    expect(todo.title).toBe('Buy milk');
  });

  it('create throws on empty title', async () => {
    await expect(service.create('')).rejects.toThrow();
    await expect(service.create('   ')).rejects.toThrow();
  });

  it('toggleStatus switches PENDING to COMPLETED', async () => {
    const created = await withFakeTimers(() => service.create('Task A'));
    expect(created.status).toBe(TodoStatus.PENDING);

    const toggled = await withFakeTimers(() => service.toggleStatus(created.id));
    expect(toggled.status).toBe(TodoStatus.COMPLETED);
  });

  it('toggleStatus switches COMPLETED back to PENDING', async () => {
    const created = await withFakeTimers(() => service.create('Task B'));
    await withFakeTimers(() => service.toggleStatus(created.id));
    const toggled = await withFakeTimers(() => service.toggleStatus(created.id));
    expect(toggled.status).toBe(TodoStatus.PENDING);
  });

  it('toggleStatus throws on invalid id', async () => {
    await expect(service.toggleStatus(0)).rejects.toThrow();
    await expect(service.toggleStatus(-1)).rejects.toThrow();
  });

  it('toggleStatus throws on non-existing id', async () => {
    await expect(withFakeTimers(() => service.toggleStatus(9999))).rejects.toThrow();
  });

  it('search returns matching todos (case-insensitive)', async () => {
    await withFakeTimers(() => service.create('Learn TypeScript'));
    await withFakeTimers(() => service.create('Buy groceries'));

    const results = await withFakeTimers(() => service.search('typescript'));
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('Learn TypeScript');
  });

  it('search matches description', async () => {
    await withFakeTimers(() => service.create('Task', 'important work'));
    const results = await withFakeTimers(() => service.search('IMPORTANT'));
    expect(results).toHaveLength(1);
  });

  it('search returns empty array when no match', async () => {
    await withFakeTimers(() => service.create('Something'));
    const results = await withFakeTimers(() => service.search('zzznomatch'));
    expect(results).toHaveLength(0);
  });
});

describe('TodoApi', () => {
  let api: TodoApi;

  beforeEach(() => {
    api = new TodoApi();
  });

  it('update throws TodoNotFoundError for missing id', async () => {
    await expect(withFakeTimers(() => api.update(999, { title: 'X' })))
      .rejects.toThrow(TodoNotFoundError);
  });

  it('remove throws TodoNotFoundError for missing id', async () => {
    await expect(withFakeTimers(() => api.remove(999)))
      .rejects.toThrow(TodoNotFoundError);
  });
});
