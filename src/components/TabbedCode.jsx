import * as React from "react";
import JSONInput from 'react-json-editor-ajrm';
import {
    makeStyles,
    shorthands,
    tokens,
    Tab,
    Text,
    TabList,
    TabValue, Button
} from "@fluentui/react-components";
import {
    AirplaneRegular,
    AirplaneFilled,
    AirplaneTakeOffRegular,
    AirplaneTakeOffFilled,
    TimeAndWeatherRegular,
    TimeAndWeatherFilled,
    bundleIcon,
    CalendarAgendaRegular,
    CalendarAgendaFilled,
} from "@fluentui/react-icons";
import {useState} from "react";
const CalendarAgenda = bundleIcon(CalendarAgendaFilled, CalendarAgendaRegular);
const Airplane = bundleIcon(AirplaneFilled, AirplaneRegular);
const AirplaneTakeOff = bundleIcon(
    AirplaneTakeOffFilled,
    AirplaneTakeOffRegular
);
const TimeAndWeather = bundleIcon(TimeAndWeatherFilled, TimeAndWeatherRegular);
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

export const WithPanels = () => {
    const styles = useStyles();
    const [selectedValue, setSelectedValue] = useState("acme");
    const onTabSelect = (event, data) => {
        setSelectedValue(data.value);
    };

    function HandleAuthorChange(event) {
        console.log(event.json);
    }

    const Payload = React.memo(() => (
        <div role="tabpanel" aria-labelledby="acme" style={{minWidth: '100%', width: '100%'}}>
            <JSONInput id='author-input' height='450px' width='100%' placeholder={sampleJson} onChange={HandleAuthorChange} />
        </div>
    ));
    return (
        <div className={styles.root}>
            <TabList selectedValue={selectedValue} onTabSelect={onTabSelect} style={{minWidth: '100%'}}>
                <div style={{paddingTop: '10px'}}>
                    <Text style={{fontWeight: "bold"}}>Context Objects:&nbsp;&nbsp;&nbsp;</Text>
                    <Button appearance="primary">Add</Button>
                </div>
                <Tab id="acme" icon={<CalendarAgenda/>} value="acme">
                    acme
                </Tab>
            </TabList>
            <div className={styles.panels}>
                {selectedValue === "acme" && <Payload />}
            </div>
        </div>
    );
};