// react component that renders a date field
import React, {useState} from 'react';
import { useRuleEngine } from '@aemforms/af-react-renderer';
import { DatePicker } from '@adobe/react-spectrum';
import {FieldJson} from "@aemforms/af-core";
const DateField = function (props: FieldJson) {
    // @ts-ignore
    const [state, handlers] = useRuleEngine(props, true);
    const [date, setDate] = useState<any>(null);

    const onChange = (value) => {
        const year = value.year;
        const month = value.month;
        const day = value.day;
        handlers.dispatchChange(`${month}/${day}/${year}`);
        setDate(value)
    }

    return (
        <div>
            <DatePicker
                label={state.label.value}
                onChange={onChange}
                value={date}
            />
            <br />
            Edit Format: {state.editFormat}
            <br />
            Display Format: {state.displayFormat}
            <br />
            Date Value: {state.value}
            <br />
            Display Value: {state.displayValue}
            <br />
        </div>
    )
}

export default DateField;