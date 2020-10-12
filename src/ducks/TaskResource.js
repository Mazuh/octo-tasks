import { makeReduxAssets } from 'resource-toolkit';
import ToDo from '../services/ToDo';

const tasksResource = makeReduxAssets({
  name: 'tasks',
  idKey: 'uuid',
  gateway: {
    create: description => {
      return ToDo.create(description);
    },
    readMany: () => {
      return ToDo.read();
    },
    update: task => {
      return ToDo.update(task.uuid, task);
    },
    delete: task => {
      return ToDo.delete(task.uuid);
    }
  }
});

export const tasksActions = tasksResource.actions;

export default tasksResource.reducer;