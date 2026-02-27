import { moduleInstances, moduleTypes, type moduleInstancesType, type moduleTypesType } from "../../common/other/ModuleListProvider";
import { checkArray, checkNumber, checkString, checkStringEnum, sendJsonApiMessage, type apiMessageOptions } from "../apiMessageBase"

export namespace System{

    export type module = {
        module_type : moduleTypesType
        uid : string
        instance : moduleInstancesType
    }
    export type modulesResult = {
        modules : module[]
    }

    export async function sendModules() : Promise<modulesResult>{
        let opts : apiMessageOptions = {
            url: "/system/modules"
        }

        let response = await sendJsonApiMessage(opts);
        
        checkArray({data:response.jsonValue},"data",(element : any)=>{
            checkStringEnum(element,"module_type",moduleTypes,opts);
            checkString(element,"uid",opts);
            checkStringEnum(element,"instance",moduleInstances,opts);
            return true;
        },opts);

        let result : module[] = response.jsonValue;
        result.sort((a:module,b:module)=>(
            (a.uid===b.uid)?(
                0
            ):(
                (a.uid>b.uid)?(
                    -1
                ):(
                    1
                )
            )
        ))

        return {
            modules: result
        }
    }

    export type  problemResult = {
        message: string,
        problems: {
            type : string,
            id: number,
            message: string,
            detail: string
        }[]
    }

    async function sendProblems(url : string) : Promise<problemResult>{
        let opts : apiMessageOptions = {
            url: url
        }

        let response = await sendJsonApiMessage(opts);
        let data = response.jsonValue;

        checkString(data,"message",opts);
        checkArray(data,"problems",(el)=>{
            checkString(el,"type",opts);
            checkNumber(el,"id",opts);
            checkString(el,"message",opts);
            checkString(el,"detail",opts);
            return true;
        },opts);

        return data;
    }

    export async function sendErrors() : Promise<problemResult>{
        return await sendProblems("/system/errors");
    }

    export async function sendWarnings() : Promise<problemResult>{
       return await sendProblems("/system/warnings");
    }
}