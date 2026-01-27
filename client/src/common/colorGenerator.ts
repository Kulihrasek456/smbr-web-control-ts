let colors = [
    "#ff0000",
    "#00ff00",
    "#0000ff",
]

export function getColor(index : number){
    return colors[index%colors.length]
}