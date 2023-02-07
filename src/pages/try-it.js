import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import {
  FluentProvider,
  teamsLightTheme,
  Text,
  Button,
  Menu,
  MenuTrigger,
  MenuList,
  MenuItem,
  MenuPopover, makeStyles, tokens, shorthands,
} from '@fluentui/react-components';

import {Input} from "reactstrap";
import {WithPanels} from "../components/TabbedCode";
import {Appearance} from "../components/Appearance";
import {NestedSubmenus} from "../components/Menu";

function blahDom() {
  console.log("hello world!");
}

const addRecordEndpoint = "https://1345-18-170-107-134.eu.ngrok.io/api/v1/request";

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
};

function RenderResult() {
  const inputProps = useInput();
  const [apiResponse, setApiResponse] = useState("> ");
  const [titleValue, setTitleValue] = useState("");
  const [authorValue, setAuthorValue] = useState(JSON.stringify({sampleJson}));
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
      <FluentProvider theme={teamsLightTheme}>
    <div style={{display: "flex", width: '100%', justifyContent: "center", paddingTop: 30, paddingLeft: 20, paddingRight: 20}}>
      <div style={{display: "block", boxSizing: "border-box", flexGrow: 1, paddingBottom: 30, maxWidth:'1280px'}}>
          <h1>Try it for yourself!</h1>
          <form>
            <div style={{display: "flex", width: '100%', marginBottom: 10}}>
              <Appearance/>
              <Button appearance="primary" onClick={ButtonClick}>Run</Button>&nbsp;&nbsp;
              <NestedSubmenus/>
            </div>
            <WithPanels />
          </form>
          <div style={{height: 10}}/>
          <div style={{borderStyle: "dashed", padding: 5, minHeight: 100}}>
            <Text align="justify">
              {apiResponse}
            </Text>
          </div>
      </div>
    </div>
        </FluentProvider>
  );
};

export default function Hello() {
  return (
    <Layout title="Hello" description="Hello React Page">
      <RenderResult />
    </Layout>
  );
}
