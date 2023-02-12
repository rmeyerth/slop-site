import React, {memo, useState} from 'react';
import {
    DataGrid,
    DataGridHeader,
    DataGridRow,
    DataGridHeaderCell,
    DataGridBody,
    DataGridCell,
    createTableColumn, TableCellLayout, Avatar,
} from "@fluentui/react-components";
import {Label} from "reactstrap";

function VariableTable({items}) {

    const columns = [
        createTableColumn({
            columnId: "name",
            compare: (a, b) => {
                return a.name.label.localeCompare(b.name.label);
            },
            renderHeaderCell: () => {
                return "Name";
            },
            renderCell: (item) => {
                return (
                    <TableCellLayout media={item.name.icon}>
                        {item.name.label}
                    </TableCellLayout>
                );
            },
        }),
        createTableColumn({
            columnId: "type",
            compare: (a, b) => {
                return a.type.label.localeCompare(b.type.label);
            },
            renderHeaderCell: () => {
                return "Type";
            },
            renderCell: (item) => {
                return (
                    <TableCellLayout
                        media={
                            <Avatar
                                aria-label={item.type.label}
                                name={item.type.label}
                                badge={{ status: item.type.status }}
                            />
                        }
                    >
                        {item.type.label}
                    </TableCellLayout>
                );
            },
        }),
        createTableColumn({
            columnId: "value",
            compare: (a, b) => {
                return a.value.label.localeCompare(b.value.label);
            },
            renderHeaderCell: () => {
                return "Value";
            },

            renderCell: (item) => {
                return item.value.label;
            },
        }),
    ];

    return (
        <DataGrid
            items={items}
            columns={columns}
            sortable
            style={{width: '100%'}}
            selectionMode="multiselect"
            getRowId={(item) => item.file.label}
            onSelectionChange={(e, data) => console.log(data)}
        >
            <DataGridHeader style={{backgroundColor: "#EAEAEA"}}>
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

const VariablesTab = ({key, variables}) => (
    <div role="tabpanel" key={key} aria-labelledby='payload' style={{minWidth: '100%', width: '100%', paddingTop: 5}}>
        <div style={{height: 450, border: '1px solid black'}}>
            <VariableTable items={variables} />
            <div style={{minWidth: '100%', alignContent: "center", alignItems: "center", display: "flex", flexDirection: "column"}}>
                <div style={{height: 20}}></div>
                <Label style={{minWidth: '100%', textAlign: "center", fontSize: 16, fontWeight: "Bold", color: "lightgray"}}>
                    Click [+] button to create a new variable
                </Label>
            </div>
        </div>
    </div>
);

export default memo(VariablesTab);