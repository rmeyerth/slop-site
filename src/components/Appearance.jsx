import {
    makeStyles,
    mergeClasses,
    shorthands,
    tokens,
    useId,
    Input,
    Label,
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
export const Appearance = () => {
    const outlineId = useId("input-outline");
    const styles = useStyles();
    return (
        <Input appearance="outline" id={outlineId} placeholder="Type expression here..." style={{width: '100%'}} />
    );
};