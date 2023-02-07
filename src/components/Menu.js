import {
    Button,
    Menu,
    MenuTrigger,
    MenuList,
    MenuItem,
    MenuPopover,
} from "@fluentui/react-components";
import * as React from "react";
const EditorLayoutSubMenu = () => {
    return (
        <Menu>
            <MenuTrigger disableButtonEnhancement>
                <MenuItem>Editor Layout</MenuItem>
            </MenuTrigger>

            <MenuPopover>
                <MenuList>
                    <MenuItem>Split Up</MenuItem>
                    <MenuItem>Split Down</MenuItem>
                    <MenuItem>Single</MenuItem>
                </MenuList>
            </MenuPopover>
        </Menu>
    );
};
const AppearanceSubMenu = () => {
    return (
        <Menu>
            <MenuTrigger disableButtonEnhancement>
                <MenuItem>Appearance</MenuItem>
            </MenuTrigger>

            <MenuPopover>
                <MenuList>
                    <MenuItem>Centered Layout</MenuItem>
                    <MenuItem>Zen</MenuItem>
                    <MenuItem disabled>Zoom In</MenuItem>
                    <MenuItem>Zoom Out</MenuItem>
                </MenuList>
            </MenuPopover>
        </Menu>
    );
};
const PreferencesSubMenu = () => {
    return (
        <Menu>
            <MenuTrigger disableButtonEnhancement>
                <MenuItem>Preferences</MenuItem>
            </MenuTrigger>

            <MenuPopover>
                <MenuList>
                    <MenuItem>Settings</MenuItem>
                    <MenuItem>Online Services Settings</MenuItem>
                    <MenuItem>Extensions</MenuItem>
                    <AppearanceSubMenu />
                    <EditorLayoutSubMenu />
                </MenuList>
            </MenuPopover>
        </Menu>
    );
};
export const NestedSubmenus = () => {
    return (
        <Menu>
            <MenuTrigger disableButtonEnhancement>
                <Button>Toggle menu</Button>
            </MenuTrigger>

            <MenuPopover>
                <MenuList>
                    <MenuItem>New </MenuItem>
                    <MenuItem>New Window</MenuItem>
                    <MenuItem disabled>Open File</MenuItem>
                    <MenuItem>Open Folder</MenuItem>
                    <PreferencesSubMenu />
                </MenuList>
            </MenuPopover>
        </Menu>
    );
};