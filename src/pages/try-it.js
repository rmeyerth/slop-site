import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';

const addRecordEndpoint = "https://demo.slop.dev/api/v1/request";

const addNewRecord = async (Title, Author) => {
  const RecordBodyParameters = {
    'expression': Title,
    'payload': JSON.parse(Author)
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
    },
    body: JSON.stringify(RecordBodyParameters)
  }

  const response = await fetch(addRecordEndpoint, options);
  const jsonResponse = await response.text();
  console.log(JSON.stringify(jsonResponse));
  return jsonResponse;
};

function RenderResult() {
  const [apiResponse, setApiResponse] = useState("> ");
  const [titleValue, setTitleValue] = useState("");
  const [authorValue, setAuthorValue] = useState("");
  const [successCounter, setSuccessCounter] = useState(0);

  function HandleTitleChange(event) {
    setTitleValue(event.target.value);
  }

  function HandleAuthorChange(event) {
    setAuthorValue(event.target.value);
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
    <div>
      <h1>React App</h1>
      <ul>{apiResponse}</ul>
      <form>
        <div>
          <label htmlFor="title-input">Expression:</label>
          <input style={{width: 600}} type="text" value={titleValue} id="title-input" onChange={HandleTitleChange} />
        </div>
        <div>
          <label htmlFor="author-input">JSON Payload:</label>
          <textarea style={{width: 600, height: 400}} type="text" value={authorValue} id="author-input" onChange={HandleAuthorChange} />
        </div>
        <button type="button" onClick={ButtonClick}>Add data</button>
      </form>
    </div>
  );
};

export default function Hello() {
  return (
    <Layout title="Hello" description="Hello React Page">
      <RenderResult />
    </Layout>
  );
}