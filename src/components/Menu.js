import {
    Button,
    Menu,
    MenuTrigger,
    MenuList,
    MenuItem,
    MenuPopover,
} from "@fluentui/react-components";
import * as React from "react";
const NewFeaturesSubMenu = () => {
    return (
        <Menu>
            <MenuTrigger disableButtonEnhancement>
                <MenuItem>New Features</MenuItem>
            </MenuTrigger>

            <MenuPopover>
                <MenuList>
                    <MenuItem>Variables</MenuItem>
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
export const NestedSubmenus = () => {
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
                    <NewFeaturesSubMenu />
                </MenuList>
            </MenuPopover>
        </Menu>
    );
};