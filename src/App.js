import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Alert from 'react-bootstrap/Alert';
import ToDo from './services/ToDo';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

export default function App() {
  const [tasks, setTasks] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (error) {
      toast(error.message);
    }
  }, [error]);

  return (
    <div>
      <AppHeader isLoading={isLoading} />
      <TaskForm
        tasks={tasks}
        setTasks={setTasks}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        error={error}
        setError={setError}
      />
      <Container>
        {!isLoading && tasks.length === 0 && <Flash variant="light">No tasks yet.</Flash>}
      </Container>
      <TasksList
        tasks={tasks}
        setTasks={setTasks}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        error={error}
        setError={setError}
      />
      <ToastContainer />
    </div>
  );
};

const AppHeader = ({ isLoading }) => (
  <Container>
    <h1 className="text-center">
      My tasks app
      {isLoading && <small> Loading...</small>}
    </h1>
  </Container>
);

const TaskForm = (props) => {
  const [description, setDescription] = React.useState('');

  const onSubmit = (event) => {
    event.preventDefault();
    props.setIsLoading(true);

    ToDo.create(description).then((task) => {
      props.setTasks([...props.tasks, task]);
      setDescription('');
      props.setError(null);
      toast('Task created!');
    }).catch((error) => {
      props.setError(error);
    }).finally(() => {
      props.setIsLoading(false);
    });
  };

  return (
    <Container>
      <Form onSubmit={onSubmit} inline>
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
                disabled={props.isLoading}
                required
              />
            </Form.Group>
          </Col>
          <Col md={1} className="mr-auto">
            <Button
              variant="primary"
              type="submit"
              disabled={props.isLoading}
            >
              Add
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

const TasksList = ({ setTasks, setIsLoading, setError, ...props }) => {
  React.useEffect(() => {
    ToDo.read().then((retrievedTasks) => {
      setTasks(retrievedTasks);
      setError(null);
    }).catch((error) => {
      setError(error);
    }).finally(() => {
      setIsLoading(false);
    });
  }, [setTasks, setIsLoading, setError]);

  const onCheckChangeFn = (task) => (event) => {
    const isDone = event.target.checked;
    const updatingTask = { ...task, isDone };

    setIsLoading(true);
    ToDo.update(task.uuid, updatingTask).then((tasks) => {
      setTasks(tasks);
    }).catch((error) => {
      setError(error);
    }).finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <Container>
      <ListGroup>
        {props.tasks.map(task => (
          <ListGroup.Item key={task.uuid} className="d-flex">
            <Form.Check
              type="checkbox"
              onChange={onCheckChangeFn(task)}
              checked={task.isDone}
              disabled={props.isLoading}
            />
            {task.description}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

const Flash = (props) => (
  <Alert className="w-50 ml-auto mr-auto mt-4 text-center" {...props} />
);
