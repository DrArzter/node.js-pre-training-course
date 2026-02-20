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

type NewTodo = Omit<Todo, 'id' | 'createdAt' | 'status'> & {status?: TodoStatus};

export { Todo, TodoStatus, NewTodo };