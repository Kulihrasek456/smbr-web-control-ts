let colors = [
    "#9adb00",
    "#ffff00",
    "#ffa500",
    "#1d9ef5",
    "#ad270f",
    "#c0c1c1",
    "#642470"
]

export function getColor(index : number){
    return colors[index%colors.length]
}