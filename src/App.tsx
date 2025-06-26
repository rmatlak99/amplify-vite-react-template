import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
import {APIProvider, Map} from '@vis.gl/react-google-maps';

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const {signOut, user} = useAuthenticator();

  useEffect(() => {
    const sub = client.models.Todo.observeQuery().subscribe({
      next: ({ items }) => {
        setTodos([...items]);
      },
    });

    return () => sub.unsubscribe();
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  const deleteTodo = (id: string) => {
    client.models.Todo.delete({ id });
  };

  return (
    <>
    <main>
      <h1>My todos</h1>
      <h1>{user?.signInDetails?.loginId}'s todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} onClick={() => deleteTodo(todo.id)}>{todo.content}</li>
        ))}
      </ul>
      <button onClick={signOut}>SignOut</button>
    </main>
    <APIProvider apiKey={'AIzaSyDUCsGRdMUGdOzUfYyZk-OIvzMGLjOzBvY'}>
      <Map
        style={{width: '100vw', height: '100vh'}}
        defaultCenter={{lat: 22.54992, lng: 0}}
        defaultZoom={3}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        mapTypeId="satellite"
        tilt={67}
        heading={45}
      />
    </APIProvider>
  </>
  );
}

export default App;
