import React, {memo, useEffect, useState} from 'react';
import {
    DataGrid,
    DataGridHeader,
    DataGridRow,
    DataGridHeaderCell,
    DataGridBody,
    DataGridCell,
    createTableColumn, TableCellLayout,
} from "@fluentui/react-components";
import {Label} from "reactstrap";

function VariableTable({items, onSelectionChange, selectedItems}) {

    const [localSelectedItems, setSelectedItems] = useState([]);
    const [changeMade, setChangeMade] = useState(false);

    useEffect(() => {
        if (changeMade) {
            onSelectionChange(localSelectedItems);
            setChangeMade(false);
        }
    }, [localSelectedItems, changeMade]);

    function onLocalChangeSelectedItems(event, data) {
        setSelectedItems(data.selectedItems);
        setChangeMade(true);
    }

    const columns = [
        createTableColumn({
            columnId: "name",
            compare: (a, b) => {
                return a.name.localeCompare(b.name);
            },
            renderHeaderCell: () => {
                return "Name";
            },
            renderCell: (item) => {
                return (
                    item.name
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
                    <TableCellLayout media={item.type.icon}>
                        {item.type.label}
                    </TableCellLayout>
                );
            },
        }),
        createTableColumn({
            columnId: "value",
            compare: (a, b) => {
                return a.value.localeCompare(b.value);
            },
            renderHeaderCell: () => {
                return "Value";
            },

            renderCell: (item) => {
                return item.value;
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
            getRowId={(item) => item.name.label}
            onSelectionChange={onLocalChangeSelectedItems}
            defaultSelectedItems={selectedItems}
            resizableColumns
            columnSizingOptions={{
                name: {
                    defaultWidth: 230,
                },
                type: {
                    defaultWidth: 230,
                },
            }}
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

const VariablesTab = ({key, variables, selectedItems, onSelectionChange}) => (
    <div role="tabpanel" key={key} aria-labelledby='payload' style={{minWidth: '100%', width: '100%', paddingTop: 5}}>
        <div style={{height: 450, border: '1px solid black'}}>
            <VariableTable items={variables} onSelectionChange={onSelectionChange} selectedItems={selectedItems} />
            <div style={{minWidth: '100%', alignContent: "center", alignItems: "center", display: "flex", flexDirection: "column"}}>
                <div style={{height: 20}}></div>
                {variables.length === 0 && (<Label style={{minWidth: '100%', textAlign: "center", fontSize: 16, fontWeight: "Bold", color: "lightgray"}}>
                    Click [+] button to create a new variable
                </Label>)}
            </div>
        </div>
    </div>
);

export default memo(VariablesTab);