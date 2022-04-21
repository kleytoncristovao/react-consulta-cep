import { useState, useEffect } from "react";
import consultarCep, { cep } from 'cep-promise';
import CEPDados from "./Components/CEPDados";

function numberOnly(str){
  return str.replace(/[^\d]/g, '')
}

function translate(cepDados){
  return {
    "ESTADO" :  cepDados.state,
    "CIDADE" : cepDados.city,
    "BAIRRO" : cepDados.neighborhood,
    "LOGRADOURO" : cepDados.street
  }

}

function Pesquisa(props) {
    const goTo = props.goTo;
    const ticket = props.ticket;
    const setResultado = props.setResultado;
    const setErrorMessage = props.setErrorMessage;
    const [cepNumber, setCepNumber] = useState("");
    const [cepFavorito, setCepFavorito] = useState("");
    const [cepDados, setCepDados] = useState({});

    useEffect(() => {
      const storedCep = localStorage.getItem("cepFavorito") || "";
      setCepFavorito(storedCep);
    },[]);

    useEffect(()=> {
      if(!cepFavorito){
        return;
      }
      localStorage.setItem("cepFavorito", cepFavorito);
      consultarCep(cepFavorito)
      .then(resultado => setCepDados(resultado))
      .catch(err => setCepDados({"ERRO" : err.message}))
    },[cepFavorito]);

    function handleChange(evt){
      const value = evt.target.value;
      setCepNumber(numberOnly(value));
    }

    function handleSuccess(cepDados){
      const resultado = translate(cepDados);
      setResultado(resultado);
      goTo("RESULTADOS");
    }

    function handleError(err){
      const errorMessage = err.message;
      setErrorMessage(errorMessage);
      goTo("ERRO");
    }

    function handleSearch (){
      ticket.current++;
      const currentTicket = ticket.current;
      goTo("CARREGANDO");
      consultarCep(cepNumber)
      .then(result => currentTicket == ticket.current && handleSuccess(result))
      .catch(err => currentTicket == ticket.current && handleError(err))
    }
    function handleAdicionarfavorito(){
      setCepFavorito(cepNumber);
    }

    return <>
      <p> Qual CEP você deseja pesquisar?</p>
      <input value={numberOnly(cepNumber)} onChange={handleChange}/>
      <button onClick={handleSearch}>CONSULTAR</button>
      <button onClick={handleAdicionarfavorito}>SALVAR FAVORITO</button>
      <br/>
      <p>Favorito: {cepFavorito}</p>
      <CEPDados cepDados={translate(cepDados)}/>
    </>
  
}

  export default Pesquisa;