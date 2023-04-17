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
import React, {useContext, useEffect, useState} from 'react';
import {FormContext, useRuleEngine} from '@aemforms/af-react-renderer';
import {FieldJson, FieldModel, FieldsetModel, FormModel, State} from '@aemforms/af-core';
import {call} from "ts-loader";

const PanelSummary = function (props: State<FieldJson>) {

    const [state, handlers] = useRuleEngine(props);
    const {form} = useContext(FormContext);
    const [dirty, setDirty] = useState(false);
    const [fields, setFields] = useState([]);

    useEffect(() => {
        const panelRef = state.properties?.['custom:panelRef'];
        const findPanel = (form: FormModel, ref: string) : FieldsetModel => {
            let panel = null;
            form.visit((field: FieldModel|FieldsetModel) => {
                if(field.name == ref)
                    panel = field;
            });
            return panel as FieldsetModel;
        }

        const findPanelV2 = (form: FormModel, ref: string): FieldsetModel => {
            // for clients running an older version of af-core that does not have access to the visit api
            function visit(field: FieldModel | FieldsetModel, callback) {
                callback(field);
                if(field?.type == 'panel') {
                    const fieldset = field as FieldsetModel;
                    fieldset?.items?.forEach(element => visit(element, callback));
                }
            }
            let panel = null;
            form.items.forEach(element => visit(element, (elem: FieldModel | FieldsetModel) => {
                if(elem.name == ref)
                    panel = elem;
            }));
            return panel;
        }

        function collectElements(current: any) {
            // collect elements that have a property `includeInSummary` set.
            const result: any[] = []
            current?.items?.forEach((item: any) => {
                if(item.fieldType == 'panel') {
                    result.push(...collectElements(item));
                } else {
                    result.push(item);
                }
            });
            return result;
        }
        // const panel = findPanel(form, panelRef);
        const panel = findPanelV2(form, panelRef);
        const fields = collectElements(panel);
        fields.forEach(field => {
            field.subscribe(() => {
                // force a re-render of the summary whenever there is a change in the form.
                // this can be optimized
                setDirty(true);
            }, 'change');
        })
        setFields(fields);
    }, [state.id])


    const renderPanelSummary = (elements: any) => {
        return (
            <div>{elements.map((element: any) => {
                return (<div key={element.id}> {element?.label?.value?.toString()} : {element?.value?.toString()} </div>)
            })}
            </div>
        );
    }
    const empty = '';

    if (!state.visible) {
        return empty;
    }
    if(dirty)
        setDirty(false);
    return renderPanelSummary(fields);
}

export default PanelSummary;
