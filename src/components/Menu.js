import {
    Button,
    Menu,
    MenuTrigger,
    MenuList,
    MenuItem,
    MenuPopover,
} from "@fluentui/react-components";
const CalendarAgenda = bundleIcon(CalendarAgendaFilled, CalendarAgendaRegular);
const BookNumber = bundleIcon(BookNumber20Filled, BookNumber20Regular);
import varExample from "./newfeatures/variables.json";
import * as React from "react";
import {
    BookNumber20Filled,
    BookNumber20Regular,
    bundleIcon,
    CalendarAgendaFilled,
    CalendarAgendaRegular
} from "@fluentui/react-icons";

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

function loadObjectData(data) {
    const result = new Set();
    data.objects.forEach(o => {
        let rootName = Object.keys(o)[0];
        console.log(o[rootName]);
        result.add(new TabContent(rootName, rootName, <CalendarAgenda/>, false, JSON.stringify(o[rootName]), false))
    });
    console.log(result);
    return result;
}

function loadVariableData(data) {
    return [];
}

const NewFeaturesSubMenu = ({onChange}) => {

    function loadExample(source) {
        switch (source.target.innerText) {
            case "Variables": onChange(loadVariableData(varExample), loadObjectData(varExample)); break;
            default: console.log("other");
        }
    }

    return (
        <Menu>
            <MenuTrigger disableButtonEnhancement>
                <MenuItem>New Features</MenuItem>
            </MenuTrigger>

            <MenuPopover>
                <MenuList>
                    <MenuItem onClick={loadExample}>Variables</MenuItem>
                    <MenuItem>Collection Filters</MenuItem>
                    <MenuItem disabled>Static Referencing</MenuItem>
                    <MenuItem>Unary Operator</MenuItem>
                    <MenuItem>Syntax Validation</MenuItem>
                </MenuList>
            </MenuPopover>
        </Menu>
    );
};
const FunctionsSubMenu = () => {
    return (
        <Menu>
            <MenuTrigger disableButtonEnhancement>
                <MenuItem>Functions</MenuItem>
            </MenuTrigger>

            <MenuPopover>
                <MenuList>
                    <MenuItem>Date</MenuItem>
                    <MenuItem>Random</MenuItem>
                    <MenuItem>Sum</MenuItem>
                </MenuList>
            </MenuPopover>
        </Menu>
    );
};
const StatementsSubMenu = () => {
    return (
        <Menu>
            <MenuTrigger disableButtonEnhancement>
                <MenuItem>Statements</MenuItem>
            </MenuTrigger>

            <MenuPopover>
                <MenuList>
                    <MenuItem>Conditional</MenuItem>
                    <MenuItem>Operation</MenuItem>
                    <MenuItem>Repeat</MenuItem>
                    <MenuItem>Foreach</MenuItem>
                    <MenuItem>Switch</MenuItem>
                    <MenuItem>Field</MenuItem>
                    <MenuItem>Variables</MenuItem>
                </MenuList>
            </MenuPopover>
        </Menu>
    );
};
const LiteralsSubMenu = () => {
    return (
        <Menu>
            <MenuTrigger disableButtonEnhancement>
                <MenuItem>Literals</MenuItem>
            </MenuTrigger>

            <MenuPopover>
                <MenuList>
                    <MenuItem>Strings</MenuItem>
                    <MenuItem>Integers</MenuItem>
                    <MenuItem>Booleans</MenuItem>
                    <MenuItem>Arrays</MenuItem>
                </MenuList>
            </MenuPopover>
        </Menu>
    );
};
export const NestedSubmenus = ({onChange}) => {
    return (
        <Menu>
            <MenuTrigger disableButtonEnhancement>
                <Button appearance="primary" style={{backgroundColor: "green"}}>Examples</Button>
            </MenuTrigger>

            <MenuPopover>
                <MenuList>
                    <LiteralsSubMenu />
                    <StatementsSubMenu />
                    <FunctionsSubMenu />
                    <NewFeaturesSubMenu onChange={onChange} />
                </MenuList>
            </MenuPopover>
        </Menu>
    );
};