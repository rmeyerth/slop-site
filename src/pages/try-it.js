import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import JSONInput from 'react-json-editor-ajrm';
import styled from 'styled-components';

const addRecordEndpoint = "https://1345-18-170-107-134.eu.ngrok.io/api/v1/request";

const StyledInput = styled.input`
  display: block;
  margin: 0px 0px;
  border: 1px solid lightblue;
  width: 100%;
  height: 30px;
`;

const theme = {
  blue: {
    default: "#3f51b5",
    hover: "#283593"
  },
  pink: {
    default: "#e91e63",
    hover: "#ad1457"
  }
}

const Button = styled.button`
  background-color: ${(props) => theme[props.theme].default};
  color: white;
  padding: 5px 15px;
  border-radius: 5px;
  outline: 0;
  text-transform: uppercase;
  margin: 0px 0px;
  cursor: pointer;
  box-shadow: 0px 2px 2px lightgray;
  transition: ease background-color 250ms;
  &:hover {
    background-color: ${(props) => theme[props.theme].hover};
  }
  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`;

Button.defaultProps = {
  theme: "blue"
}

function useInput(defaultValue) {
  const [value, setValue] = useState(defaultValue);
  function onChange(e) {
    setValue(e.target.value);
  }
  return {
    value,
    onChange,
  };
}

const addNewRecord = async (Title, Author) => {
  console.log(Author);
  const RecordBodyParameters = {
    'expression': Title,
    'payload': JSON.parse(Author)
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST'
    },
    body: JSON.stringify(RecordBodyParameters)
  }

  const response = await fetch(addRecordEndpoint, options);
  const jsonResponse = await response.text();
  console.log(JSON.stringify(jsonResponse));
  return jsonResponse;
};

const sampleJson = {
  "name": "Acme Corp",
    "employees": [
  {
    "name": "Bob",
    "age": 23
  },
  {
    "name": "Sally",
    "age": 49
  },
  {
    "name": "Terrence",
    "age": 60
  },
  {
    "name": "Anna",
    "age": 25
  }
]
}

function RenderResult() {
  const inputProps = useInput();
  const [apiResponse, setApiResponse] = useState("> ");
  const [titleValue, setTitleValue] = useState("");
  const [authorValue, setAuthorValue] = useState(JSON.stringify(sampleJson));
  const [successCounter, setSuccessCounter] = useState(0);

  function HandleTitleChange(event) {
    setTitleValue(event.target.value);
  }

  function HandleAuthorChange(event) {
    setAuthorValue(event.json);
  }

  function ButtonClick() {
    addNewRecord(titleValue, authorValue)
      .then(response => {
          console.log(response);
          setApiResponse('> ' + response);
        }
      );
  }

  return (
<div style={{display: "flex", width: '100%', justifyContent: "center", paddingTop: 30, paddingLeft: 20, paddingRight: 20}}>
    <div style={{display: "block", boxSizing: "border-box", flexGrow: 1, paddingBottom: 30, maxWidth:'1280px'}}>
      <h1>Try it for yourself!</h1>
      <form>
        <div style={{display: "flex", marginBottom: 10}}>
          <StyledInput {...inputProps} placeholder="Type expression here..." value={titleValue} id="title-input" onChange={HandleTitleChange} />
        </div>
        <div style={{marginBottom: 10}}>
          <JSONInput id='author-input' height='450px' width='100%' placeholder={sampleJson} onChange={HandleAuthorChange} />
        </div>
      </form>
      <Button onClick={ButtonClick}>Evaluate</Button>
      <div style={{height: 10}}/>
      <div style={{width: '100%', height: 100, backgroundColor: "lightgray", borderColor: "black", borderStyle: "dashed"}}>{apiResponse}</div>
    </div></div>
  );
};

export default function Hello() {
  return (
    <Layout title="Hello" description="Hello React Page">
      <RenderResult />
    </Layout>
  );
}
