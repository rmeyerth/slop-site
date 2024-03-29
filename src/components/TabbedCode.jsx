import * as React from "react";
import {
    makeStyles,
    shorthands,
    tokens,
    Tab,
    Text,
    TabList,
    Button,
    Popover,
    PopoverTrigger,
    PopoverSurface,
    Label,
    Combobox,
    Input,
    Option
} from "@fluentui/react-components";
import {
    bundleIcon,
    CalendarAgendaRegular,
    CalendarAgendaFilled,
    Add20Filled,
    Add20Regular,
    Subtract20Filled,
    Subtract20Regular,
    BookNumber20Regular,
    BookNumber20Filled,
    Edit20Regular,
    Edit20Filled
} from "@fluentui/react-icons";
import {useEffect, useRef, useState} from "react";
import PayloadTab from "./PayloadTab";
import VariablesTab from "./VariablesTab";
const CalendarAgenda = bundleIcon(CalendarAgendaFilled, CalendarAgendaRegular);
const BookNumber = bundleIcon(BookNumber20Filled, BookNumber20Regular);
const useStyles = makeStyles({
    root: {
        alignItems: "stretch",
        display: "flex",
        flexDirection: "column",
        justifyContent: "stretch",
        rowGap: "5px",
    },
    panels: {
        maxWidth: '100%',
        ...shorthands.padding(0, 0),
        "& th": {
            textAlign: "left",
            ...shorthands.padding(0, 0, 0, 0),
        }
    },
    propsTable: {
        maxWidth: '100%',
        "& td:first-child": {
            fontWeight: tokens.fontWeightSemibold,
        },
        "& td": {
            ...shorthands.padding(0, 0, 0, 0),
        }
    }
});

const sampleJson = `{
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
}`;

export const AddContext = bundleIcon(Add20Filled, Add20Regular);
export const DeleteContext = bundleIcon(Subtract20Filled, Subtract20Regular);
export const EditContext = bundleIcon(Edit20Filled, Edit20Regular);

class TabContent {
    constructor(inRef,name,comp,disabled,json,isVariable) {
        this.ref = inRef;
        this.name = name;
        this.icon = comp;
        this.disabled = disabled;
        this.json = json;
        this.isVariable = isVariable;
    }
}

export const WithPanels = ({onChange}) => {
    const styles = useStyles();
    const [selectedValue, setSelectedValue] = useState("acme");
    const [reload, setReload] = useState(1);
    const [count, setCount] = useState(1);
    const [variables, setVariables] = useState([]);
    const [selectedItems, setSelectedItems] = useState(new Set());

    const onTabSelect = (event, data) => {
        setSelectedValue(data.value);
    };

    const onLocalChange = (event, ref) => {
        const found = tabs.filter(item => item.ref === ref).map(tab => tab);
        const instance = found.at(0);
        instance.json = event.json;
        onChange(variables, tabs);
    };

    const [tabs, setTabs] = useState([
        new TabContent("variables", "Variables", <BookNumber/>, false, `{}`, true),
        new TabContent("acme", "Acme", <CalendarAgenda/>,false, sampleJson, false),
    ]);

    function handleAddClick() {
        setCount(c => c + 1);
        const name = "Object" + count;
        tabs.push(new TabContent(name.toLowerCase(), name,
            <CalendarAgenda/>, false, `{"myField": "aValue"}`, false));
        setSelectedValue(name.toLowerCase());
        setTabs(tabs);
        setReload(p => p + 1);
        onChange(variables, tabs);
    }

    function handleDeleteClick() {
        if (tabs.filter((item) => item.ref === selectedValue).at(0).ref === 'variables') {
            setVariables(variables.filter(aVar => !selectedItems.has(variables.indexOf(aVar))));
            setSelectedItems(new Set());
        } else {
            if (tabs.length > 2) {
                const index = tabs.indexOf(tabs.filter((item) => item.ref === selectedValue).at(0));
                setSelectedValue(index !== 0 ? tabs.at(index - 1).ref : tabs.at(0));
                setTabs(tabs.filter((item) => item.ref !== selectedValue));
                setReload(p => p + 1);
            }
        }
        onChange(variables, tabs);
    }

    function handleCancelVariable() {
        //try and focus on something else
        setReload(p => p + 1);
    }

    const VariablePopup = ({edit, name, type, value}) => {
        const options = ["String", "Number", "Boolean", "Array"];
        const comboRef = useRef(null);
        const nameRef = useRef(null);
        const valueRef = useRef(null);

        function handleItemChange(event, data) {
            if (data.optionText === "Array") {
                valueRef.current.value = "[ ]";
            } else if (data.optionText === "Number") {
                valueRef.current.value = "0";
            } else if (data.optionText === "Boolean") {
                valueRef.current.value = "false";
            } else {
                valueRef.current.value = "";
            }
        }

        function handleAddVariable() {
            const localVars = variables.concat(
                {
                    selected: false,
                    name: nameRef.current.value,
                    type: {
                        icon: <BookNumber/>,
                        label: comboRef.current.value
                    },
                    value: valueRef.current.value,
                });
            setVariables(localVars);
        }

        function handleEditVariable() {
            const currentVariable = variables.at(selectedItems.values().next().value);
            currentVariable.name = nameRef.current.value;
            currentVariable.type.label = comboRef.current.value;
            currentVariable.value = valueRef.current.value;
            setReload(p => p + 1);
            onChange(variables, tabs);
        }

        return (
            <div>
                <h3 style={{paddingBottom: 3, borderBottom: '1px solid gray'}}>{edit ? "Edit" : "Add"} Variable</h3>
                <div style={{paddingTop: 0}}>
                    <div style={{paddingBottom: 5, width: '100%', display: "flex", flexDirection: "row"}}>
                        <Label style={{minWidth: 100}}>Name:&nbsp;</Label>
                        <Input style={{minWidth: 250}} ref={nameRef} defaultValue={name} />
                    </div>
                    <div style={{paddingBottom: 5, display: "flex", flexDirection: "row"}}>
                        <Label style={{minWidth: 100}}>Type:&nbsp;</Label>
                            <Combobox style={{minWidth: 250}} onOptionSelect={handleItemChange} ref={comboRef} defaultValue={type} >
                                {options.map(item => (
                                    <Option key={item}>
                                        {item}
                                    </Option>
                                ))}
                        </Combobox>
                    </div>
                    <div style={{paddingBottom: 15, display: "flex", flexDirection: "row"}}>
                        <Label style={{minWidth: 100}}>Value:&nbsp;</Label>
                        <Input style={{minWidth: 250}} ref={valueRef} defaultValue={value} />
                    </div>
                    <div style={{paddingBottom: 5, display: "content", textAlign: "right"}}>
                        <Button style={{alignSelf: "end"}} appearance="primary" onClick={handleCancelVariable}>Cancel</Button>&nbsp;&nbsp;
                        {edit ?
                            <Button style={{alignSelf: "end"}} appearance="primary" onClick={handleEditVariable}>Edit</Button>
                            :
                            <Button style={{alignSelf: "end"}} appearance="primary" onClick={handleAddVariable}>Add</Button>
                        }
                    </div>
                </div>
            </div>
        );
    };

    const EditObject = () => {

        function onSubmit() {
            const found = tabs.filter(item => item.ref === selectedValue).map(tab => tab);
            found.at(0).name = document.getElementById("editVar").value;
            setReload(p => p + 1);
            onChange(variables, tabs);
        }

        const selItem = tabs.filter(item => item.ref === selectedValue).at(0).name;

        return (
            <div>
                <h3 style={{paddingBottom: 3, borderBottom: '1px solid gray'}}>Edit Object</h3>
                <div style={{paddingTop: 0}}>
                    <div style={{paddingBottom: 5, width: '100%', display: "flex", flexDirection: "row"}}>
                        <Label style={{minWidth: 100}}>Name:&nbsp;</Label>
                        <Input id="editVar" style={{minWidth: 250}} defaultValue={selItem} />
                    </div>
                    <div style={{paddingBottom: 5, display: "content", textAlign: "right"}}>
                        <Button style={{alignSelf: "end"}} appearance="primary" onClick={handleCancelVariable}>Cancel</Button>&nbsp;&nbsp;
                        <Button style={{alignSelf: "end"}} appearance="primary" onClick={onSubmit}>Apply</Button>
                    </div>
                </div>
            </div>
        );
    };

    function ContextButtons() {
        const isVariable = selectedValue === 'variables';
        const hasVariables = variables.length !== 0;

        const currentVariable = variables.at(selectedItems.values().next().value);
        const nameValue = currentVariable === undefined ? "" : currentVariable.name;
        const typeValue = currentVariable === undefined ? "" : currentVariable.type.label;
        const valueValue = currentVariable === undefined ? "" : currentVariable.value;

        return (
            <div style={{paddingTop: '10px', minWidth: "fit-content"}}>
                <Text style={{fontWeight: "bold"}}>Context:&nbsp;&nbsp;&nbsp;</Text>
                {isVariable ?
                        <Popover trapFocus positioning={"below-start"}>
                            <PopoverTrigger disableButtonEnhancement>
                                <Button id="addVar" appearance="primary" style={{backgroundColor: "green"}} icon={<AddContext/>}></Button>
                            </PopoverTrigger>

                            <PopoverSurface style={{border: "1px solid black"}}>
                                <VariablePopup edit={false} />
                            </PopoverSurface>
                        </Popover>
                :
                    <Button appearance="primary" style={{backgroundColor: "green"}} icon={<AddContext/>} onClick={handleAddClick} ></Button>}
                &nbsp;
                {isVariable ?
                        hasVariables && selectedItems.size === 1 ?
                            <Popover trapFocus positioning={"below-start"}>
                                <PopoverTrigger disableButtonEnhancement>
                                    <Button appearance="primary" style={{backgroundColor: "#54A3C4"}} icon={<EditContext/>} ></Button>
                                </PopoverTrigger>

                                <PopoverSurface style={{border: "1px solid black"}}>
                                    <VariablePopup edit={true} name={nameValue} type={typeValue} value={valueValue} />
                                </PopoverSurface>
                            </Popover>
                        :
                            <Button appearance="primary" style={{backgroundColor: "#54A3C4"}} icon={<EditContext/>} disabled></Button>
                    :
                        <Popover trapFocus positioning={"below-start"}>
                            <PopoverTrigger disableButtonEnhancement>
                                <Button appearance="primary" style={{backgroundColor: "#54A3C4"}} icon={<EditContext/>}></Button>
                            </PopoverTrigger>

                            <PopoverSurface style={{border: "1px solid black"}}>
                                <EditObject />
                            </PopoverSurface>
                        </Popover>
                }
                &nbsp;
                {tabs.filter((item) => item.ref === selectedValue).at(0).ref === 'variables' && hasVariables && selectedItems.size > 0 || tabs.length > 2 ?
                    <Button appearance="primary" style={{backgroundColor: "#800000"}} icon={<DeleteContext/>} onClick={handleDeleteClick}></Button>
                :
                    <Button appearance="primary" style={{backgroundColor: "#800000"}} icon={<DeleteContext/>} disabled></Button>
                }
            </div>
        )
    }

    function PrintDynamicTabs() {
        const renderTabs = tabs.map((tab) =>
            tab.disabled ?
                <Tab id={tab.ref} key={tab.ref} icon={tab.icon} value={tab.ref} style={{paddingTop: 14, paddingBottom: 8}} disabled>
                    {tab.name}
                </Tab>
            :
                <Tab id={tab.ref} key={tab.ref} icon={tab.icon} value={tab.ref} style={{paddingTop: 14, paddingBottom: 8}}>
                    {tab.name}
                </Tab>
        )
        return (
            <TabList id='tabList' selectedValue={selectedValue} onTabSelect={onTabSelect} style={{minWidth: '100%'}}>
                <ContextButtons />
                {renderTabs}
            </TabList>
        );
    }

    useEffect(() => {
        onChange(variables, tabs);
    }, [variables, tabs]);

    function onSelectionChange(values) {
        // Since we cannot mutate the state value directly better to instantiate new state with the values of the state
        setSelectedItems(values);
    }

    function PrintSelectionCriteria({onSelectionChange}) {
        const template = tabs.filter(refContent => refContent.ref === selectedValue).map((refContent) =>
            refContent
        );
        const instance = template.at(0);
        const ref = instance.ref;
        const isVariable = instance.isVariable;
        return (
            <div className={styles.panels}>
                {Boolean(isVariable) && (<VariablesTab keyValue={ref} variables={variables} selectedItems={selectedItems} onSelectionChange={onSelectionChange} />)}
                {Boolean(!isVariable) && (<PayloadTab keyValue={ref} json={instance.json} onChange={onLocalChange} />)}
            </div>
        );
    }

    return (
        <div className={styles.root}>
            {Boolean(reload) && (<PrintDynamicTabs />)}
            {Boolean(reload) && (<PrintSelectionCriteria onSelectionChange={onSelectionChange} />)}
        </div>
    );
};