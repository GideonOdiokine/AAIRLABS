export type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: number; // epoch ms
  dueDate?: number; // local midnight of the due day, epoch ms
};
