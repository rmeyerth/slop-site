import React, {memo, useState} from 'react';
import {
    Combobox,
    Input,
    makeStyles,
    shorthands,
    Option,
    DataGrid,
    DataGridHeader,
    DataGridRow,
    DataGridHeaderCell,
    DataGridBody,
    DataGridCell,
    createTableColumn, TableCellLayout, Avatar,
} from "@fluentui/react-components";
import {Label} from "reactstrap";
import {
    DocumentPdfRegular,
    DocumentRegular,
    EditRegular,
    FolderRegular,
    OpenRegular,
    PeopleRegular,
    VideoRegular
} from "@fluentui/react-icons";

function VariableTable() {

    const items = [
        {
            file: { label: "Meeting notes", icon: <DocumentRegular /> },
            author: { label: "Max Mustermann", status: "available" },
            lastUpdated: { label: "7h ago", timestamp: 1 },
            lastUpdate: {
                label: "You edited this",
                icon: <EditRegular />,
            },
        },
        {
            file: { label: "Thursday presentation", icon: <FolderRegular /> },
            author: { label: "Erika Mustermann", status: "busy" },
            lastUpdated: { label: "Yesterday at 1:45 PM", timestamp: 2 },
            lastUpdate: {
                label: "You recently opened this",
                icon: <OpenRegular />,
            },
        },
        {
            file: { label: "Training recording", icon: <VideoRegular /> },
            author: { label: "John Doe", status: "away" },
            lastUpdated: { label: "Yesterday at 1:45 PM", timestamp: 2 },
            lastUpdate: {
                label: "You recently opened this",
                icon: <OpenRegular />,
            },
        },
        {
            file: { label: "Purchase order", icon: <DocumentPdfRegular /> },
            author: { label: "Jane Doe", status: "offline" },
            lastUpdated: { label: "Tue at 9:30 AM", timestamp: 3 },
            lastUpdate: {
                label: "You shared this in a Teams chat",
                icon: <PeopleRegular />,
            },
        },
    ];

    const columns = [
        createTableColumn({
            columnId: "file",
            compare: (a, b) => {
                return a.file.label.localeCompare(b.file.label);
            },
            renderHeaderCell: () => {
                return "File";
            },
            renderCell: (item) => {
                return (
                    <TableCellLayout media={item.file.icon}>
                        {item.file.label}
                    </TableCellLayout>
                );
            },
        }),
        createTableColumn({
            columnId: "author",
            compare: (a, b) => {
                return a.author.label.localeCompare(b.author.label);
            },
            renderHeaderCell: () => {
                return "Author";
            },
            renderCell: (item) => {
                return (
                    <TableCellLayout
                        media={
                            <Avatar
                                aria-label={item.author.label}
                                name={item.author.label}
                                badge={{ status: item.author.status }}
                            />
                        }
                    >
                        {item.author.label}
                    </TableCellLayout>
                );
            },
        }),
        createTableColumn({
            columnId: "lastUpdated",
            compare: (a, b) => {
                return a.lastUpdated.timestamp - b.lastUpdated.timestamp;
            },
            renderHeaderCell: () => {
                return "Last updated";
            },

            renderCell: (item) => {
                return item.lastUpdated.label;
            },
        }),
        createTableColumn({
            columnId: "lastUpdate",
            compare: (a, b) => {
                return a.lastUpdate.label.localeCompare(b.lastUpdate.label);
            },
            renderHeaderCell: () => {
                return "Last update";
            },
            renderCell: (item) => {
                return (
                    <TableCellLayout media={item.lastUpdate.icon}>
                        {item.lastUpdate.label}
                    </TableCellLayout>
                );
            },
        }),
    ];

    return (
        <DataGrid
            items={items}
            columns={columns}
            sortable
            style={{width: '100%', paddingTop: 5}}
            selectionMode="multiselect"
            getRowId={(item) => item.file.label}
            onSelectionChange={(e, data) => console.log(data)}
        >
            <DataGridHeader>
                <DataGridRow selectionCell={{ "aria-label": "Select all rows" }}>
                    {({ renderHeaderCell }) => (
                        <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                    )}
                </DataGridRow>
            </DataGridHeader>
            <DataGridBody>
                {({ item, rowId }) => (
                    <DataGridRow
                        key={rowId}
                        selectionCell={{ "aria-label": "Select row" }}
                        >
                        {({ renderCell }) => (
                            <DataGridCell>{renderCell(item)}</DataGridCell>
                        )}
                    </DataGridRow>
                    )}
            </DataGridBody>
        </DataGrid>
    );
}

const VariablesTab = ({key}) => (
    <div role="tabpanel" key={key} aria-labelledby='variables' style={{minWidth: '100%', width: '100%'}}>
        <div style={{height: 450}}>
            <VariableTable />
        </div>
    </div>
);

export default memo(VariablesTab);