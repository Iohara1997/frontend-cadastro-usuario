import { React, useState } from "react";
import "./App.css";
import Axios from "axios";
import imgPage from "./imgPage.png";
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';


function App() {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState(0);
  const [email, setEmail] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [newIdade, setNewIdade] = useState(0);
  const [newNome, setNewNome] = useState("");

  const [listUser, showListUser] = useState([]);

  

  const addUser = () => {
    Axios.post("http://localhost:8080/create", {
      nome: nome,
      idade: idade,
      email: email,
    }).then(() => {
      showListUser([
        ...listUser,
        {
          nome: nome,
          idade: idade,
          email: email,
        },
      ]);
    });
  };

  const listAllUsers = () => {
    Axios.get("http://localhost:8080/list").then((response) => {
      showListUser(response.data);
      listAllUsers();
    });
  };

  const updateUser = (id) => {
    Axios.put("http://localhost:8080/update", {
      nome: newNome,
      email: newEmail,
      idade: newIdade,
      id: id,
    }).then((response) => {
      showListUser(
        listUser.map((val) => {
          listAllUsers();
          return val.id === id
            ? {
                id: val.id,
                nome: val.newNome,
                idade: val.newIdade,
                email: val.newEmail,
              }
            : val;
        })
      );
    });
  };

  const deleteUser = (id) => {
    Axios.delete(`http://localhost:8080/delete/${id}`).then((response) => {
      showListUser(
        listUser.filter((val) => {
          return val.id !== id;
        })
      );
    });
  };

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
              setNome(event.target.value);
            }}
          />
          <label>Idade: </label>
          <input
            type="number"
            onChange={(event) => {
              setIdade(event.target.value);
            }}
          />
          <label>E-mail: </label>
          <input
            type="text"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <button onClick={addUser}>Novo Usuário</button>
        </div>
        <div className="list">
          <button onClick={listAllUsers}>Listar Usuários</button>

          {listUser.map((val, key) => {
            return (
              <div className="userCard">
                <h3>Usuário: {val.nome} </h3>
                <h3>Idade: {val.idade} </h3>
                <h3>E-mail: {val.email} </h3>
                <div className="atualizarCard">
                  <input
                    type="text"
                    placeholder="Nome"
                    onChange={(event) => {
                      setNewNome(event.target.value);
                    }}
                  />
                  <div className="formEdit">
                    <input
                      type="number"
                      placeholder="Idade"
                      onChange={(event) => {
                        setNewIdade(event.target.value);
                      }}
                    />
                    <input
                      type="text"
                      placeholder="E-mail"
                      onChange={(event) => {
                        setNewEmail(event.target.value);
                      }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      updateUser(val.id);
                    }}
                    className="editButton"
                  >
                    Atualizar
                  </button>
                  <button
                    onClick={() => {
                      deleteUser(val.id);
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
