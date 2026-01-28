export function enforceMax(value : string, max : number){
    if(value == "-"){
        return value
    }
    if (value != "") {
        if(isNaN(+value)){
            value = value.slice(0,-1)
            return enforceMax(value, max)
        }
        if (Number(value) > Number(max)) {
            return max.toString() || "";
        }
    }
    return value;
}
export function enforceMin(value : string, min : number){
    if(value == "-"){
        return value
    }
    if (value != "") {
        if(isNaN(+value)){
            value = value.slice(0,-1)
            return enforceMax(value, min)
        }
        if (Number(value) < Number(min)) {
            return min.toString() || "";
        }
    }
    return value;
}

export function enforceMinMax(value : string, min : number, max : number)  {
    if(value == "-"){
        return value
    }
    if (value != "") {
        if(isNaN(+value)){
            value = value.slice(0,-1)
            return enforceMinMax(value, min, max)
        }
        if (Number(value) < Number(min)) {
            return min.toString() || "";
        }
        if (Number(value) > Number(max)) {
            return max.toString() || "";
        }
    }
    return value;
}

