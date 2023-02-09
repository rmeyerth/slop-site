import React, { memo } from 'react';

const VariablesTab = ({key}) => (
    <div role="tabpanel" key={key} aria-labelledby='payload' style={{minWidth: '100%', width: '100%'}}>
        Blahdom
    </div>
);

export default memo(VariablesTab);