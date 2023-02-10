import React, {useState, useContext, useEffect} from 'react';
import Layout from '@theme/Layout';
import {
  FluentProvider,
  teamsLightTheme,
  Text,
  Button, Image, makeStyles, Link,
} from '@fluentui/react-components';
import {
  BookQuestionMark20Regular,
  BookQuestionMark20Filled,
  bundleIcon,
  iconFilledClassName,
  iconRegularClassName,
  Play20Regular,
  Play20Filled,
} from "@fluentui/react-icons";

import {WithPanels} from "../components/TabbedCode";
import {Appearance} from "../components/Appearance";
import {NestedSubmenus} from "../components/Menu";

const runExpressionEndpoint = "https://1345-18-170-107-134.eu.ngrok.io/api/v1/request";

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

const addNewRecord = async (expression, payload) => {
  const RecordBodyParameters = {
    'expression': expression,
    'payload': JSON.parse(payload)
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

  const response = await fetch(runExpressionEndpoint, options);
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

const iconStyleProps = {
  primaryFill: "purple",
  className: "iconClass"
};

const useIconStyles = makeStyles({
  icon: {
    ":hover": {
      [`& .${iconFilledClassName}`]: {
        display: "none"
      },
      [`& .${iconRegularClassName}`]: {
        display: "inline"
      }
    }
  }
});

export const QuestionMark = bundleIcon(BookQuestionMark20Filled, BookQuestionMark20Regular);
export const RunExpression = bundleIcon(Play20Filled, Play20Regular);

function RenderResult() {
  const [apiResponse, setApiResponse] = useState("> ");
  const [expressionValue, setExpressionValue] = useState("");
  const [contextValue, setContextValue] = useState(JSON.stringify(sampleJson));

  function handleExpressionChange(event) {
    setExpressionValue(event.target.value);
  }

  function ButtonClick() {
    addNewRecord(expressionValue, contextValue)
      .then(response => {
          console.log(response);
          setApiResponse('> ' + response);
        }
      );
  }

  const styles = useIconStyles();
  return (
      <FluentProvider theme={teamsLightTheme}>
        <div style={{display: "flex", width: '100%', justifyContent: "center", paddingTop: 30, paddingLeft: 20, paddingRight: 20}}>
          <div style={{display: "block", boxSizing: "border-box", flexGrow: 1, paddingBottom: 30, maxWidth:'1280px'}}>
              <h1>SLOP Playground</h1>
              <div style={{paddingBottom: 10}}>
                <Text align="justify">Below you can evaluate expressions using <font color="blue">SLOP 1.35</font>. Define your own or select one of the pre-configured examples.</Text>
              </div>
              <div style={{height: 2, backgroundColor: "darkblue"}}></div>
              <div style={{height: 10}}/>
              <form>
                <div style={{display: "flex", width: '100%', marginBottom: 10}}>
                  <Appearance onChange={handleExpressionChange}/>&nbsp;&nbsp;
                  <Button appearance="primary" onClick={ButtonClick} icon={<RunExpression/>}>Run</Button>&nbsp;&nbsp;
                  <NestedSubmenus />
                </div>
                <div style={{padding: 10, display: "flex", flexDirection: "column", verticalAlign: "top", width: '100%', backgroundColor: "#eff8fc", border: "1px solid black"}}>
                  <div className={styles.icon} style={{verticalAlign: "center", display: "flex", flexDirection: "row"}}>
                    <QuestionMark aria-label="QuestionMark" {...iconStyleProps} />&nbsp;
                    <Text align="justify" style={{fontWeight: "bold"}}>Custom Expression Mode</Text>
                  </div>
                  <div>
                    <Text align="justify">
                      Here you can define your own expressions and customise the objects and variables within the context. Alternatively
                      you can try out some of the examples by clicking the "Examples" button and selecting from one of the pre-defined
                      scenarios available.
                    </Text>
                  </div>
                </div>
                <div style={{height: 5}}/>
                <WithPanels onChange={(event) => setContextValue(event.json) } />
              </form>
              <div style={{height: 10}}/>
              <div style={{borderTop: "2px solid black", borderLeft: "2px solid black", borderRight: "2px solid black", height: 25, paddingLeft: 5, backgroundColor: "gray"}}>
                <Text style={{color: "white"}}>Output - <font color="yellow">Click run to begin</font></Text>
              </div>
              <div style={{borderStyle: "solid", borderWidth: "2px", padding: 3, minHeight: 100, backgroundColor: "#EAEAEA"}}>
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
