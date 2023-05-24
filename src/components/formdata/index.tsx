/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import React, {useContext, useState} from 'react';
import {FormContext, useRuleEngine} from '@aemforms/af-react-renderer';
import {FieldJson, State} from '@aemforms/af-core';
import {Button} from "@adobe/react-spectrum";

const FormData = function (props: State<FieldJson>) {

    const {form} = useContext(FormContext);
    const [data, setData] = useState('')
    const updateData = () => {
        setData(JSON.stringify(form.exportData()))
    }

    return(
        <div>
            <Button onPress={updateData} variant={"primary"}>Update form state</Button>
            <div>
                Form Data:
                <pre>
                   <code>
                       {data}
                   </code>
                </pre>
                <br/>
            </div>
        </div>
    )
}

export default FormData;
