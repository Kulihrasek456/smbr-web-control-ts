import { createSignal, For } from "solid-js";
import { Button } from "../../common/Button/Button";
import { GridElement } from "../../common/GridstackGrid/GridstackGrid";
import { LineChart } from "../../common/LineChart/LineChart";
import { getCountdownArray, getEmptyDatasets } from "../../common/other/utils";
import { Widget, WidgetHotbarValue } from "../common/Widget";

import styles from  "./KineticFluorometer.module.css"
import { SliderSimple } from "../../common/Slider/Slider";
import { RadialOption, RadialSelect } from "../../common/RadialSelect/RadialSelect";

import { createUniqueId } from "solid-js";
import { enforceMax, enforceMin, enforceMinMax } from "../../common/other/inputFilters";
import { Icon } from "../../common/Icon/Icon";

type statRow = {
    name: string;
    value:  string | number | undefined;
}
interface InputElementProps{
    unit : string;
    setter : (value : number) => void;
    getter : () => number;
    min : number;
    max : number;
}

function InputElement(props :InputElementProps){
    return (
        <div class={styles.input_container}>
            <input
                class={"button"}
                type="text"
                onInput={e => {
                    e.currentTarget.value = enforceMax(e.currentTarget.value,props.max);
                }}
                onChange={e => {
                    e.currentTarget.value = enforceMin(e.currentTarget.value,props.min);
                    props.setter(+e.currentTarget.value)
                }}
                value={props.getter()}
            ></input>
            <p class={styles.input_unit}>
                {props.unit}
            </p>
        </div>
    )
}

interface KinematicFluorometerProps{
    id: string;
}

export function KinematicFluorometer(props: KinematicFluorometerProps){
    
    const [stats, setStats] = createSignal<statRow[]>([
        {name:"test",value: 1},
        {name:"test",value: "ahoj"},
        {name:"test",value: undefined},
        {name:"test",value: undefined},
        {name:"test",value: undefined},
        {name:"test",value: undefined},
        {name:"test",value: undefined},
        {name:"test",value: 11564242}
    ]);
    
    const [length,setLength] = createSignal<number>(0);
    const [intensity,setIntensity] = createSignal<number>(0);
    const gainGroupName = createUniqueId();


    return (
        <GridElement id={props.id} w={2} h={8}>
            <Widget 
                name="Kinematic fluorometer"
                hotbarTargets={() => (
                        <>
                            <Button callback={async () => { return true }} >
                                <p>calibrate</p>
                            </Button>
                            <Button callback={async () => { return true }}>
                                <Icon name="image_arrow_up"></Icon>
                            </Button>
                            <Button callback={async () => { return true }}>
                                <Icon name="upload_file"></Icon>
                            </Button>
                        </>
                    )
                }
            
            >
                <div class={styles.chart}>
                    <LineChart 
                        labels={getCountdownArray(15)}
                        datasets={[{data:getCountdownArray(15),label:"test"}]}
                        legend={{position:"bottom",show:true}}
                        animations={false}
                        xlogarithmic={true}
                        ybounds={{
                            min:0,
                            max:1
                        }}
                    ></LineChart>
                    <p class={styles.chart_comment}>use [shift] + scroll wheel to zoom</p>
                </div>
                <div class={styles.panel}>
                    <div class={styles.stats_panel}>
                        <h2>current capture</h2>
                        <div class={styles.stats_container}>
                            <For each={stats()}>
                                {(row,index)=>(
                                    <div class={styles.stats_row}><p>{row.name}</p><p>{row.value}</p></div>
                                )}
                            </For>
                        </div>
                    </div>
                    <div class={styles.control_panel}>
                        <h2>New capture</h2>
                        <div class={styles.control_container}>
                            <div class={styles.controls}>
                                <div>
                                    <p>Length: </p>
                                    <SliderSimple 
                                        direction="H"
                                        bounds={{min:0.2,max:4}}
                                        setter={setLength}
                                        getter={length}
                                        step={0.1}
                                    ></SliderSimple>
                                    <InputElement
                                        unit="s"
                                        setter={setLength}
                                        getter={length}
                                        min={0.2}
                                        max={4}
                                    ></InputElement>
                                </div>
                                <div>
                                    <p>Intensity: </p>
                                    <SliderSimple 
                                        direction="H"
                                        bounds={{min:0,max:100}}
                                        setter={setIntensity}
                                        getter={intensity}
                                    ></SliderSimple>
                                    <InputElement
                                        unit="%"
                                        setter={setIntensity}
                                        getter={intensity}
                                        min={0}
                                        max={100}
                                    ></InputElement>
                                </div>
                                <div>
                                    <p>Gain: </p>
                                    <div>
                                        <RadialSelect
                                            groupName={gainGroupName}
                                            selections={[
                                                {value:"x1",label:"1"},
                                                {value:"x10",label:"10"},
                                                {value:"x50",label:"50"}
                                            ]}
                                        ></RadialSelect>
                                    </div>
                                </div>
                            </div>
                            <Button class={styles.begin_button}>
                                begin capture
                            </Button>
                        </div>
                    </div>
                </div>
            </Widget>
        </GridElement>
    )
}