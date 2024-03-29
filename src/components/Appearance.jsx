import {
    makeStyles,
    shorthands,
    tokens,
    useId,
    Input,
} from "@fluentui/react-components";
import * as React from "react";
const useStyles = makeStyles({
    base: {
        maxWidth: "100%",
    },
    field: {
        width: '100%',
        display: "grid",
        gridRowGap: tokens.spacingVerticalXXS,
        marginTop: tokens.spacingVerticalMNudge,
        ...shorthands.padding(tokens.spacingHorizontalMNudge),
    },
});
export const Appearance = ({onChange}) => {
    const outlineId = useId("input-outline");

    return (
        <Input appearance="outline" id={outlineId} placeholder="Type expression here..." style={{width: '100%'}} onChange={onChange} />
    );
};