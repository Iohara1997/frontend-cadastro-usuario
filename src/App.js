import { React, useState, useEffect } from "react";
import "./App.css";
import "./index.css";
import { API, Auth, Hub } from "aws-amplify";
import imgPage from "./imgPage.png";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { listTodos } from "./graphql/queries";
import {
  createTodo as createTodoMutation,
  deleteTodo as deleteTodoMutation,
  updateTodo as updateTodoMutation,
} from "./graphql/mutations";
import { ImExit } from "react-icons/im";
import { RiFileEditFill } from "react-icons/ri";
import { BsFillTrashFill } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";

const initialFormState = { nome: "", idade: "", email: "" };
const arrayTodo = [];

const handleSignOutButtonClick = async () => {
  try {
    await Auth.signOut();
    Hub.dispatch("UI Auth", {
      event: "AuthStateChange",
      message: "signedout",
    });
  } catch (error) {
    console.log("error signing out: ", error);
  }
};

const CustomSignOutButton = () => {
  return (
    <button className="buttonSignOut" onClick={handleSignOutButtonClick}>
      <ImExit /> Sair
    </button>
  );
};

function App() {
  var [todos, setTodos] = useState([]);
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
    const id = await API.graphql({
      query: createTodoMutation,
      variables: { input: formData },
    });
    formData.id = id.data.createTodo.id;
    setTodos([...todos, formData]);
    setFormData(initialFormState);
  }

  async function deleteTodo(id) {
    const newTodosArray = todos.filter((todo) => todo.id !== id);
    setTodos(newTodosArray);
    await API.graphql({
      query: deleteTodoMutation,
      variables: { input: { id } },
    });
  }

  async function updateTodo({ id }, array) {
    const newTodosArray = {
      id: id,
      nome: array[0],
      idade: array[1],
      email: array[2],
    };
    await API.graphql({
      query: updateTodoMutation,
      variables: { input: newTodosArray },
    });
    document.location.reload();
  }

  return (
    <div className="App">
      <div className="formTopo">
        <p className="title">Cadastro de usuários</p>
        <CustomSignOutButton />
      </div>
      <div class="container">
        <div className="form">
          <label>
            <br></br> <br></br>
            <br></br>
          </label>
          <div className="img">
            <img
              src={imgPage}
              alt="Logo"
              width="150px"
              height="150px"
              align="center"
            />
          </div>
          <div className="formCard">
            <input
              type="text"
              onChange={(event) => {
                setFormData({ ...formData, nome: event.target.value });
              }}
              value={formData.nome}
              placeholder="Nome"
            />
            <input
              type="number"
              onChange={(event) => {
                setFormData({ ...formData, idade: event.target.value });
              }}
              value={formData.idade}
              placeholder="Idade"
            />
            <input
              type="text"
              onChange={(event) => {
                setFormData({ ...formData, email: event.target.value });
              }}
              value={formData.email}
              placeholder="E-mail"
            />
          </div>
          <button class="btn btn-green" onClick={createTodo}>
            {" "}
            <FaUserPlus /> Novo Usuário
          </button>

          <div className="list">
            {todos.map((val) => {
              return (
                <div className="userCard">
                  <h3>Usuário: {val.nome} </h3>
                  <h3>Idade: {val.idade} </h3>
                  <h3>E-mail: {val.email} </h3>
                  <div className="atualizarCard">
                    <div className="formEdit">
                      <input
                        type="text"
                        placeholder="Nome"
                        onChange={(event) => {
                          arrayTodo[0] = event.target.value;
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Idade"
                        onChange={(event) => {
                          arrayTodo[1] = event.target.value;
                        }}
                      />
                      <input
                        type="text"
                        placeholder="E-mail"
                        onChange={(event) => {
                          arrayTodo[2] = event.target.value;
                        }}
                      />
                    </div>
                    <button
                      onClick={() => {
                        updateTodo(val, arrayTodo);
                      }}
                      className="editButton"
                    >
                      <RiFileEditFill />
                    </button>
                    <button
                      onClick={() => {
                        deleteTodo(val.id);
                      }}
                      className="removeButton"
                    >
                      {" "}
                      <BsFillTrashFill />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuthenticator(App);
