import { v4 as uuidv4 } from 'uuid';

const TASKS_KEY = 'tasks';

export const retrieveTasks = () => {
  return new Promise((resolve) => {
    const serialized = localStorage.getItem(TASKS_KEY);
    const tasks = serialized ? JSON.parse(serialized) : [];
    setTimeout(() => {
      resolve(tasks);
    }, 3000);
  });
};

export const persistTasks = (tasks) => {
  return new Promise((resolve) => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    resolve();
  });
}

export default {
  create: async (description = '') => {
    const existingTasks = await retrieveTasks();

    const task = {
      uuid: uuidv4(),
      description: description.trim(),
      isDone: false,
    };

    if (!task.description) {
      throw new Error('Description is required.');
    }

    const tasks = [...existingTasks, task];

    persistTasks(tasks);
    return task;
  },
  read: async () => {
    return retrieveTasks();
  },
  update: async (uuid, updatingTask) => {
    const existingTasks = await retrieveTasks();
    const updatedTasks = existingTasks.map(task => task.uuid === uuid
      ? updatingTask
      : task
    );
    persistTasks(updatedTasks);
    return updatedTasks;
  },
  delete: async () => {
    throw new Error('not implemented');
  },
};
