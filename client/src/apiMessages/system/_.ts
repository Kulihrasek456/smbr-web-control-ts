import { moduleInstances, moduleTypes, type moduleInstancesType, type moduleTypesType } from "../../common/other/ModuleListProvider";
import { checkArray, checkString, checkStringEnum, sendJsonApiMessage, type apiMessageOptions } from "../apiMessageBase"

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
}