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
    Combobox, Input
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
    BookNumber20Filled
} from "@fluentui/react-icons";
import {useState} from "react";
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

    const onTabSelect = (event, data) => {
        console.log("Selected on event " + data.value);
        setSelectedValue(data.value);
    };

    const onLocalChange = (event, ref) => {
        console.log("Selected tab on blur: " + selectedValue);
        const found = tabs.filter(item => item.ref === ref).map(tab => tab);
        const instance = found.at(0);
        console.log(event.target);
        instance.json = event.json;
    };

    const [tabs, setTabs] = useState([
        new TabContent("variables", "Variables", <BookNumber/>, false, `{}`, true),
        new TabContent("acme", "Acme", <CalendarAgenda/>,false, sampleJson, false),
    ]);

    function handleAddVariable() {
        console.log("blah");
    }

    function handleAddClick() {
        setCount(c => c + 1);
        const name = "Object" + count;
        tabs.push(new TabContent(name.toLowerCase(), name,
            <CalendarAgenda/>, false, `{"myField": "aValue"}`, false));
        setSelectedValue(name.toLowerCase());
        setTabs(tabs);
        setReload(p => p + 1);
    }

    function handleDeleteClick() {
        if (tabs.length !== 0 && tabs.filter((item) => item.ref === selectedValue).at(0).ref !== 'variables') {
            const index = tabs.indexOf(tabs.filter((item) => item.ref === selectedValue).at(0));
            setSelectedValue(index !== 0 ? tabs.at(index - 1).ref : tabs.at(0));
            setTabs(tabs.filter((item) => item.ref !== selectedValue));
            setReload(p => p + 1);
        }
    }

    function handleCancelVariable() {
        //try and focus on something else
    }

    const ExampleContent = () => {
        return (
            <div>
                <h3 style={{paddingBottom: 3, borderBottom: '1px solid gray'}}>Add Variable</h3>
                <div style={{paddingTop: 0}}>
                    <div style={{paddingBottom: 5, width: '100%', display: "flex", flexDirection: "row"}}><Label style={{minWidth: 100}}>Name:&nbsp;</Label><Input style={{minWidth: 250}} /></div>
                    <div style={{paddingBottom: 5, display: "flex", flexDirection: "row"}}>
                        <Label style={{minWidth: 100}}>Type:&nbsp;</Label><Combobox style={{minWidth: 250}}></Combobox>
                    </div>
                    <div style={{paddingBottom: 15, display: "flex", flexDirection: "row"}}><Label style={{minWidth: 100}}>Value:&nbsp;</Label><Input style={{minWidth: 250}} /></div>
                    <div style={{paddingBottom: 5, display: "content", textAlign: "right"}}>
                        <Button style={{alignSelf: "end"}} appearance="primary" >Add</Button>&nbsp;&nbsp;<Button style={{alignSelf: "end"}} appearance="primary" onClick={handleCancelVariable}>Cancel</Button>
                    </div>
                </div>
            </div>
        );
    };

    function ContextButtons() {
        const addVariable = selectedValue === 'variables';
        return (
            <div style={{paddingTop: '10px', minWidth: "fit-content"}}>
                <Text style={{fontWeight: "bold"}}>Context:&nbsp;&nbsp;&nbsp;</Text>
                {addVariable ?
                        <Popover trapFocus positioning={"below-start"}>
                            <PopoverTrigger disableButtonEnhancement>
                                <Button id="addVar" appearance="primary" style={{backgroundColor: "green"}} icon={<AddContext/>} onClick={handleAddVariable}></Button>
                            </PopoverTrigger>

                            <PopoverSurface style={{border: "1px solid black"}}>
                                <ExampleContent />
                            </PopoverSurface>
                        </Popover>
                :
                    <Button appearance="primary" style={{backgroundColor: "green"}} icon={<AddContext/>} onClick={handleAddClick}></Button>}
                &nbsp;
                <Button appearance="primary" style={{backgroundColor: "#800000"}} icon={<DeleteContext/>} onClick={handleDeleteClick}></Button>
            </div>
        )
    }

    function PrintDynamicTabs() {
        const renderTabs = tabs.map((tab) =>
            tab.disabled ?
                <Tab id={tab.ref} key={tab.ref} icon={<BookNumber/>} value={tab.ref} style={{paddingTop: 14, paddingBottom: 8}} disabled>
                    {tab.name}
                </Tab>
            :
                <Tab id={tab.ref} key={tab.ref} icon={<BookNumber/>} value={tab.ref} style={{paddingTop: 14, paddingBottom: 8}}>
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

    function PrintSelectionCriteria() {
        const template = tabs.filter(refContent => refContent.ref === selectedValue).map((refContent) =>
            refContent
        );
        const instance = template.at(0);
        const ref = instance.ref;
        const isVariable = instance.isVariable;
        return (
            <div className={styles.panels}>
                {Boolean(isVariable) && (<VariablesTab keyValue={ref} />)}
                {Boolean(!isVariable) && (<PayloadTab keyValue={ref} json={instance.json} onChange={onLocalChange} />)}
            </div>
        );
    }

    return (
        <div className={styles.root}>
            {Boolean(reload) && (<PrintDynamicTabs/>)}
            {Boolean(reload) && (<PrintSelectionCriteria/>)}
        </div>
    );
};