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

const CustomFileUpload = function (props: State<FieldJson>) {

    const {form} = useContext(FormContext);
    // @ts-ignore
    const [state, handlers] = useRuleEngine(props);

    const onChange = (event: any) => {
        const files: FileList = event.target.files;
        handlers.dispatchChange(Array.from(files));
    }

    if(!state.visible)
        return <></>
    return(
        <div>
            <input type={"file"} id={state.id} name={state.name} accept={state?.accept?.join(', ')}
                   onChange={onChange}
                   multiple={state.type.includes('[]')}>

            </input>
        </div>
    )
}

export default CustomFileUpload;
