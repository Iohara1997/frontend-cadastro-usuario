import { useState } from "react";
import "./App.css";
import Axios from "axios";

function App() {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState(0);
  const [email, setEmail] = useState("");

  const [listaUsuario, mostrarListaUsuario] = useState([]);

  const adicionarUsuario = () => {
    Axios.post("http://localhost:8080/create", {
      nome: nome,
      idade: idade,
      email: email,
    }).then(() => {
      mostrarListaUsuario([
        ...listaUsuario,
        {
          nome: nome,
          idade: idade,
          email: email,
        },
      ]);
    });
  };

  const listarUsuarios = () => {
    Axios.get("http://localhost:8080/list").then((response) => {
      mostrarListaUsuario(response.data);
    });
  };

  return (
    <div className="App">
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
        <button onClick={adicionarUsuario}>Novo Usuário</button>
      </div>
      <hr />
      <div className="listar">
        <button onClick={listarUsuarios}>Listar Usuários</button>

        {listaUsuario.map((val, key) => {
          return (
            <div className="usuarioCard">
              <h3>Usuário: {val.nome} </h3>
              <h3>Idade: {val.idade} </h3>
              <h3>E-mail: {val.email} </h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
