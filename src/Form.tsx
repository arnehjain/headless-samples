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
import React, {useEffect, useState} from "react";
import {AdaptiveForm} from "@aemforms/af-react-renderer";
import customMappings from './utils/mappings';
import ReactDOM from "react-dom";
import {Action} from "@aemforms/af-core";
//@ts-ignore
import {Provider as Spectrum3Provider, defaultTheme} from '@adobe/react-spectrum'
import localFormJson from '../form-definitions/form-model.json';

let currentFormJson: any = {};

const TY_PANEL_NAME = "ThankyouPanel";

const AEM_URL_PREFIX = "http://arnjain-linux:4504"

const getForm = async () => {
  if (process.env.USE_LOCAL_JSON == 'true') {
    return localFormJson;
  } else {
    let formAPI = process.env.FORM_API;
    // check for null or empty string
    if (!formAPI) {
        const SUFFIX = "jcr:content/guideContainer.model.json";
        const formPath = process.env.AEM_FORM_PATH
        formAPI = `${formPath}/${SUFFIX}`;
    }
    const resp = await fetch(formAPI);
    return (await resp.json());
  }
}

const Form = (props: any) => {
    const [form, setForm] = useState("")
    const fetchForm = async () => {
        const json:any = await getForm();
        if ('afModelDefinition' in json) {
            json.afModelDefination.action = AEM_URL_PREFIX + json.afModelDefination.action;
            setForm(JSON.stringify(json.afModelDefinition))
        } else {
            json.action = AEM_URL_PREFIX + json.action;
            setForm(JSON.stringify(json))
        }
    }

    const getThankYouPanel = (fields: any): any => {
      let field = null;
      Object.keys(fields).forEach((id) => {
        const name = fields[id]?._jsonModel?.name;
        if (name == TY_PANEL_NAME) {
          field =  fields[id];
        }
      })
      return field;
    }

    const hideAllPanels = (fields: any) => {
      Object.keys(fields).forEach((id) => {
        const name = fields[id]?._jsonModel?.name;
        if(name != TY_PANEL_NAME &&  fields[id]?._jsonModel?.fieldType === 'panel'){
          fields[id].visible = false;
        }
      })
    }

    const onSubmitSuccess= (action: Action) => {
      const thankYouPanelElement = getThankYouPanel(currentFormJson._fields);
      if (thankYouPanelElement) {
        thankYouPanelElement.visible = true;
      }
      hideAllPanels(currentFormJson._fields);
    };

    const onInitialize = (action:Action) => {
      currentFormJson = action.target;
    };

    const onFieldChanged = (action: Action) => {
      console.log('On Field Changed (Executes everytime a form field is updated)')
    };

    useEffect(() => {
        fetchForm()
    }, []);
    if (form != "") {
        const element = document.querySelector(".cmp-formcontainer__content")
        const retVal = (<Spectrum3Provider theme={defaultTheme}>
            <AdaptiveForm formJson={JSON.parse(form)} mappings={customMappings} onInitialize={onInitialize} onFieldChanged={onFieldChanged} onSubmitSuccess={onSubmitSuccess}/>
        </Spectrum3Provider>)
        return ReactDOM.createPortal(retVal, element)
    }
    return null
}

export default Form