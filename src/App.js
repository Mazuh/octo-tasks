import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { makeReduxAssets } from 'resource-toolkit';
import Alert from 'react-bootstrap/Alert';
import ToDo from './services/ToDo';
import Pomodoro from './pomodoro.js'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const tasksResource = makeReduxAssets({
  name: 'tasks',
  idKey: 'uuid',
  gateway: {
    create: (description) => {
      return ToDo.create(description);
    },
    readMany: () => {
      return ToDo.read();
    },
    update: (task) => {
      return ToDo.update(task.uuid, task);
    },
    delete: (task) => {
      return ToDo.delete(task.uuid);
    },
  },
});

export default function App() {
  const [state, dispatch] = React.useReducer(tasksResource.reducer, tasksResource.initialState);
  const mappedState = {
    ...state,
    tasks: state.items,
  };

  React.useEffect(() => {
    if (state.error) {
      toast(state.error.message);
    }
  }, [state.error]);

  return (
    <div>
      <AppHeader state={mappedState} dispatch={dispatch} />
      <Pomodoro />
      <TaskForm state={mappedState} dispatch={dispatch} />
      <Container>
        {!mappedState.isLoading && mappedState.tasks.length === 0 && (
          <Flash variant="light">No tasks yet.</Flash>
        )}
      </Container>
      <TasksList state={mappedState} dispatch={dispatch} />
      <ToastContainer />
    </div>
  );
};

const AppHeader = ({ state }) => (
  <Container>
    <h1 className="text-center">
      My tasks app
      {state.isLoading && <small> Loading...</small>}
    </h1>
  </Container>
);

const TaskForm = (props) => {
  const [description, setDescription] = React.useState('');

  const onSubmit = (event) => {
    event.preventDefault();
    props.dispatch({ type: 'loading' });

    tasksResource.actions
      .create(description)(props.dispatch)
      .then(() => {
        setDescription('');
        toast('Task created!');
      });
  };

  return (
    <Container>
      <Form onSubmit={onSubmit} className="mb-4" inline>
        <Row className="w-100">
          <Col md={8} className="ml-auto">
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                name="description"
                className="w-100"
                placeholder="Type a new task description..."
                autoComplete="off"
                value={description}
                onChange={event => setDescription(event.target.value)}
                disabled={props.state.isLoading}
                required
              />
            </Form.Group>
          </Col>
          <Col md={1} className="mr-auto">
            <Button
              variant="primary"
              type="submit"
              disabled={props.state.isLoading}
            >
              Add
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

const TasksList = ({ dispatch, ...props }) => {
  React.useEffect(() => {
    tasksResource.actions.readAll()(dispatch);
  }, [dispatch]);
  
  const onCheckChangeFn = (task) => (event) => {
    const isDone = event.target.checked;
    patchTask(task, { isDone });
  };
  
  const onClickDescriptionFn = (task) => () => {
    const foundTask = props.state.tasks.find(it => it.uuid === task.uuid);
    if (!foundTask) {
      return;
    }
    
    patchTask(task, { isDone: !foundTask.isDone });
  }
  
  const patchTask = (task, patch) => {
    const updatingTask = { ...task, ...patch };
    
    tasksResource.actions.update(task.uuid, updatingTask)(dispatch);
  };

  const onClickDelFn = (task) => () => {
    tasksResource.actions.delete(task.uuid, task)(dispatch).then(() => {
      toast('Task deleted!');
    });
  };

  return (
    <Container>
      <ListGroup>
        {props.state.tasks.map(task => (
          <ListGroup.Item key={task.uuid} className="d-flex">
            <Form.Check
              onChange={onCheckChangeFn(task)}
              type="checkbox"
              checked={task.isDone}
              disabled={props.isLoading}
              className="cursor-pointer"
            />
            <span className="cursor-pointer" onClick={onClickDescriptionFn(task)}>
              {task.description}
            </span>
            <Button
              onClick={onClickDelFn(task)}
              variant="danger"
              type="button"
              size="sm"
              className="ml-auto"
              disabled={props.state.isLoading}
            >
              Del
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

const Flash = (props) => (
  <Alert className="w-50 ml-auto mr-auto mt-4 text-center" {...props} />
);
