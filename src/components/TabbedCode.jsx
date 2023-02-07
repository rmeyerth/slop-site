import * as React from "react";
import JSONInput from 'react-json-editor-ajrm';
import {
    makeStyles,
    shorthands,
    tokens,
    Tab,
    TabList,
    TabValue
} from "@fluentui/react-components";
import {
    AirplaneRegular,
    AirplaneFilled,
    AirplaneTakeOffRegular,
    AirplaneTakeOffFilled,
    TimeAndWeatherRegular,
    TimeAndWeatherFilled,
    bundleIcon
} from "@fluentui/react-icons";
import {useState} from "react";
const Airplane = bundleIcon(AirplaneFilled, AirplaneRegular);
const AirplaneTakeOff = bundleIcon(
    AirplaneTakeOffFilled,
    AirplaneTakeOffRegular
);
const TimeAndWeather = bundleIcon(TimeAndWeatherFilled, TimeAndWeatherRegular);
const useStyles = makeStyles({
    root: {
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        rowGap: "20px"
    },
    panels: {
        ...shorthands.padding(0, "10px"),
        "& th": {
            textAlign: "left",
            ...shorthands.padding(0, "30px", 0, 0),
        }
    },
    propsTable: {
        "& td:first-child": {
            fontWeight: tokens.fontWeightSemibold,
        },
        "& td": {
            ...shorthands.padding(0, "30px", 0, 0),
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
    const [selectedValue, setSelectedValue] = useState("conditions");
    const onTabSelect = (event, data) => {
        setSelectedValue(data.value);
    };

    function HandleAuthorChange(event) {
        console.log(event.json);
    }

    const Arrivals = React.memo(() => (
        <div role="tabpanel" aria-labelledby="Arrivals">
            <div style={{marginBottom: 10}}>
                <JSONInput id='author-input' height='450px' width='100%' placeholder={sampleJson} onChange={HandleAuthorChange} />
            </div>
        </div>
    ));
    const Departures = React.memo(() => (
        <div role="tabpanel" aria-labelledby="Departures">
            <table>
                <thead>
                <th>Destination</th>
                <th>Gate</th>
                <th>ETD</th>
                </thead>
                <tbody>
                <tr>
                    <td>MSP</td>
                    <td>A7</td>
                    <td>8:26 AM</td>
                </tr>
                <tr>
                    <td>DCA</td>
                    <td>N2</td>
                    <td>9:03 AM</td>
                </tr>
                <tr>
                    <td>LAS</td>
                    <td>E15</td>
                    <td>2:36 PM</td>
                </tr>
                </tbody>
            </table>
        </div>
    ));
    const Conditions = React.memo(() => (
        <div role="tabpanel" aria-labelledby="Conditions">
            <table className={styles.propsTable}>
                <tbody>
                <tr>
                    <td>Time</td>
                    <td>6:45 AM</td>
                </tr>
                <tr>
                    <td>Temperature</td>
                    <td>68F / 20C</td>
                </tr>
                <tr>
                    <td>Forecast</td>
                    <td>Overcast</td>
                </tr>
                <tr>
                    <td>Visibility</td>
                    <td>0.5 miles, 1800 ft runway visual range</td>
                </tr>
                </tbody>
            </table>
        </div>
    ));
    return (
        <div className={styles.root}>
            <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
                <Tab id="Arrivals" icon={<Airplane />} value="arrivals">
                    Arrivals
                </Tab>
                <Tab id="Departures" icon={<AirplaneTakeOff />} value="departures">
                    Departures
                </Tab>
                <Tab id="Conditions" icon={<TimeAndWeather />} value="conditions">
                    Conditions
                </Tab>
            </TabList>
            <div className={styles.panels}>
                {selectedValue === "arrivals" && <Arrivals />}
                {selectedValue === "departures" && <Departures />}
                {selectedValue === "conditions" && <Conditions />}
            </div>
        </div>
    );
};