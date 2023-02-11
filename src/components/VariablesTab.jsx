import React, { memo } from 'react';

const VariablesTab = ({key}) => (
    <div role="tabpanel" key={key} aria-labelledby='variables' style={{minWidth: '100%', width: '100%'}}>
        <div style={{height: 450}}>Blahdom</div>
    </div>
);

export default memo(VariablesTab);