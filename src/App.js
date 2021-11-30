import { React, useState, useEffect } from "react";
import "./App.css";
import { API } from "aws-amplify";
import imgPage from "./imgPage.png";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { listTodos } from "./graphql/queries";
import {
  createTodo as createTodoMutation,
  deleteTodo as deleteTodoMutation,
  updateTodo as updateTodoMutation
} from "./graphql/mutations";

const initialFormState = { nome: "", idade: "", email: "" };

function App() {
  const [todos, setTodos] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const apiData = await API.graphql({ query: listTodos });
    const todosData = apiData.data.listTodos.items;
    setTodos(todosData);
  }

  async function createTodo() {
    if (!formData.nome || !formData.idade || !formData.email) return;
    await API.graphql({
      query: createTodoMutation,
      variables: { input: formData },
    });
    setTodos([...todos, formData]);
    setFormData(initialFormState);
  }

  async function deleteTodo({ id }) {
    const newTodosArray = todos.filter((todo) => todo.id !== id);
    setTodos(newTodosArray);
    await API.graphql({
      query: deleteTodoMutation,
      variables: { input: { id } },
    });
  }

  async function updateTodo({ id }) {
    const newTodosArray = todos.filter((todo) => todo.id !== id);
    setTodos([...todos, newTodosArray]);
    await API.graphql({
      query: updateTodoMutation,
      variables: { input: { id } },
    });
  }

  return (
    <div className="App">
      <header>
        <img src={imgPage} className="App-logo" alt="logo" />
        <h1>We now have Auth!</h1>
      </header>
      <AmplifySignOut />

      <p className="title">Cadastro de usuários</p>
      <div className="img">
        <img src={imgPage} alt="Logo" />
      </div>
      <div class="container">
        <div className="form">
          <label>Nome: </label>
          <input
            type="text"
            onChange={(event) => {
              setFormData({ ...formData, nome: event.target.value });
            }}
            value={formData.nome}
          />
          <label>Idade: </label>
          <input
            type="number"
            onChange={(event) => {
              setFormData({ ...formData, idade: event.target.value });
            }}
            value={formData.idade}
          />
          <label>E-mail: </label>
          <input
            type="text"
            onChange={(event) => {
              setFormData({ ...formData, email: event.target.value });
            }}
            value={formData.email}
          />
          <button onClick={createTodo}>Novo Usuário</button>
        </div>
        <div>
          {todos.map((val) => {
            return (
              <div className="userCard">
                <h3>Usuário: {val.nome} </h3>
                <h3>Idade: {val.idade} </h3>
                <h3>E-mail: {val.email} </h3>
                <button
                  onClick={() => {
                    deleteTodo(val);
                  }}
                  className="editButton"
                >
                  {" "}
                  Remover
                </button>
                <div className="atualizarCard">
                  <input
                    type="text"
                    placeholder="Nome"
                    onChange={(event) => {
                      setTodos({ ...todos, nome: event.target.value });
                    }}
                  />
                  <div className="formEdit">
                    <input
                      type="number"
                      placeholder="Idade"
                      onChange={(event) => {
                        setTodos({ ...todos, idade: event.target.value });
                      }}
                    />
                    <input
                      type="text"
                      placeholder="E-mail"
                      onChange={(event) => {
                        setTodos({ ...todos, email: event.target.value });
                      }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      updateTodo(val);
                    }}
                    className="editButton"
                  >
                    Atualizar
                  </button>
                  <button
                    onClick={() => {
                      deleteTodo(val);
                    }}
                    className="editButton"
                  >
                    {" "}
                    Remover
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default withAuthenticator(App);
