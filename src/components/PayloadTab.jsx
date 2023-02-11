import React, {memo, useState} from 'react';
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";

const PayloadBody = ({keyValue, json, onChange}) => {
    const [jsonPayload, setJsonPayload] = useState("{}");
    const [ref, setRef] = useState("");

    if (ref !== keyValue) {
        setRef(keyValue);
    }
    let payloadSet = false;
    if (jsonPayload !== json) {
        setJsonPayload(json);
        payloadSet = true;
    }

    function handleFocusLost(event) {
        let valid = true;
        try {
            JSON.parse(event.json);
        } catch (e) {
            valid = false;
        }
        if (!payloadSet && valid) {
            onChange(event, ref);
        }
    }

    return (<div role="tabpanel" key={keyValue} aria-labelledby='payload' style={{minWidth: '100%', width: '100%', paddingTop: 5}}>
        <JSONInput id={keyValue} height='450px' width='100%' placeholder={JSON.parse(jsonPayload)}
                   onBlur={handleFocusLost} locale={locale}/>
    </div>);
};

export default memo(PayloadBody);