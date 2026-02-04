import { colord } from "colord";


let colors = [
    "#9adb00",
    "#ffff00",
    "#ffa500",
    "#1d9ef5",
    "#ad270f",
    "#c0c1c1",
    "#642470"
]

export function getColor(index : number, darken=0){
    const baseColor = colors[index % colors.length];
    if(darken>0){
        let colorColor = colord(baseColor);
        for(let i=0;i<darken;i++){
            colorColor = colorColor.darken(0.1);
        }
        return colorColor.toHex()
    }
    return baseColor
}
