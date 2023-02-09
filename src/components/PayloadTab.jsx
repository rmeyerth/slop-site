import React, { memo } from 'react';
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";

const PayloadBody = ({keyValue, json, onChange}) => (
    <div role="tabpanel" key={keyValue} aria-labelledby='payload' style={{minWidth: '100%', width: '100%'}}>
        <JSONInput id='author-input' height='450px' width='100%' placeholder={json} onChange={onChange} locale={locale}/>
    </div>
);

export default memo(PayloadBody);