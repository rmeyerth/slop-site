import React, {useState, useContext, useEffect, useRef} from 'react';
import Layout from '@theme/Layout';
import {
  FluentProvider,
  teamsLightTheme,
  Text,
  Button, Image, makeStyles, Link, Input,
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
import {NestedSubmenus} from "../components/Menu";

const runExpressionEndpoint = "https://9163-18-133-159-179.eu.ngrok.io/api/v1/request";

Button.defaultProps = {
  theme: "blue"
}

const addNewRecord = async (RecordBodyParameters) => {

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
  const [variables, setVariables] = useState({variables: []});
  const [tabs, setTabs] = useState({objects: [sampleJson]});

  function handleExpressionChange(event) {
    setExpressionValue(event.target.value);
  }

  function handleButtonClick() {
    console.log(refreshJson());
    addNewRecord(refreshJson())
      .then(response => {
          setApiResponse('> ' + response);
        }
      );
  }

  function handleOnChange(inVars, tabs) {
    setVariables(inVars);
    setTabs(tabs);
  }

  // useEffect(() => {
  //   refreshJson();
  // }, [variables, tabs, expressionValue]);

  function refreshJson() {
    const value = {
      expression: expressionValue,
      variables: variables.map(aVar => {
        return ({
          [aVar.name]: aVar.value
        });
      }),
      objects: tabs.filter(tab => tab.ref !== "variables").map(tab => {
        return ({
          [tab.name]: JSON.parse(tab.json)
        });
      })
    };
    return value;
  }

  const styles = useIconStyles();
  return (
      <FluentProvider theme={teamsLightTheme}>
        <div style={{display: "flex", width: '100%', justifyContent: "center", paddingTop: 30, paddingLeft: 20, paddingRight: 20}}>
          <div style={{display: "block", boxSizing: "border-box", flexGrow: 1, paddingBottom: 30, maxWidth:'1280px'}}>
              <h1>SLOP Playground</h1>
              <div style={{paddingBottom: 10}}>
                <Text align="justify">Below you can evaluate expressions using <font color="blue">SLOP 1.37</font>. Define your own or select one of the pre-configured examples.</Text>
              </div>
              <div style={{height: 2, backgroundColor: "darkblue"}}></div>
              <div style={{height: 10}}/>
              <form>
                <div style={{display: "flex", width: '100%', marginBottom: 10}}>
                  <Input id="input-online" className="monospace-input" placeholder="Type expression here..." onBlur={refreshJson} onChange={handleExpressionChange} />
                  &nbsp;&nbsp;
                  {expressionValue.length === 0 ?
                      <Button appearance="primary" onClick={handleButtonClick} icon={<RunExpression/>}
                              disabled>Run</Button>
                      :
                      <Button appearance="primary" onClick={handleButtonClick} icon={<RunExpression/>}>Run</Button>
                  }
                  &nbsp;&nbsp;
                  <NestedSubmenus />
                </div>
                <div style={{padding: 10, display: "flex", flexDirection: "column", verticalAlign: "top", width: '100%', backgroundColor: "#eff8fc", border: "1px solid black"}}>
                  <div className={styles.icon} style={{verticalAlign: "center", display: "flex", flexDirection: "row"}}>
                    <QuestionMark aria-label="QuestionMark" {...iconStyleProps} />&nbsp;
                    <Text align="justify" style={{fontWeight: "bold"}}>Custom Expression Mode</Text>
                  </div>
                  <div>
                    <Text align="justify">
                      Here you can define your own expressions and customise the objects and variables within the context. To do this
                      simply use the object name with the path to the field e.g. <span style={{paddingLeft: 4, paddingRight: 4, backgroundColor: "#eaeaea", color: "green", fontFamily: "monospace"}}>Acme.employees.name</span>. Alternatively
                      you can try out some of the examples by clicking the "Examples" button and selecting from one of the pre-defined
                      scenarios available.
                    </Text>
                  </div>
                </div>
                <div style={{height: 5}}/>
                <WithPanels onChange={handleOnChange} />
              </form>
              <div style={{height: 10}}/>
              <div style={{borderTop: "1px solid black", borderLeft: "1px solid black", borderRight: "1px solid black", height: 30, paddingLeft: 10, paddingTop: 3, backgroundColor: "#A9A8A8"}}>
                <Text style={{color: "black"}}>Output (<font color="yellow">Click run to begin</font>)</Text>
              </div>
              <div style={{borderStyle: "solid", borderWidth: "1px", paddingLeft: 8, paddingTop: 3, minHeight: 100, backgroundColor: "#EAEAEA"}}>
                <Text style={{ fontFamily: "Monospaced" }}>
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
