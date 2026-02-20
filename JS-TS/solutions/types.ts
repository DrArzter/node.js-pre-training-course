interface Todo {
    id: number;
    title: string;
    description?: string;
    status: TodoStatus;
    createdAt: Date;
}

enum TodoStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed'
}

type newTodo = Omit<Todo, 'id' | 'createdAt'>;

export { Todo, TodoStatus, newTodo };