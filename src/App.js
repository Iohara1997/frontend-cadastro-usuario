import { React, useState } from "react";
import "./App.css";
import Axios from "axios";
import imgPage from "./imgPage.png";

function App() {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState(0);
  const [email, setEmail] = useState("");

  const [newEmail, setNewEmail] = useState("");

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
    Axios.put("http://localhost:8080/update", { email: newEmail, id: id }).then(
      (response) => {
        showListUser(
          listUser.map((val) => {
            listAllUsers();
            return val.id === id
              ? {
                  id: val.id,
                  nome: val.nome,
                  idade: val.idade,
                  email: val.newEmail,
                }
              : val;
          })
        );
      }
    );
  };

  const deleteUser = (id) => {
    Axios.delete(`http://localhost:8080/delete/${id}`).then((response)=>{
      showListUser(listUser.filter((val)=> {
        return val.id !== id
      }))
    })
  };

  return (
    <div className="App">
      <p className="title">Cadastro de usuários</p>
      <div className="img">
        <img src={imgPage} alt="Logo" />
      </div>
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
                  placeholder="E-mail"
                  onChange={(event) => {
                    setNewEmail(event.target.value);
                  }}
                />
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
  );
}

export default App;
