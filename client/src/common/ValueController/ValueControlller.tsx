import styles from "./ValueController.module.css"

interface ValueControllerProps{
    title : string,
    valueName : string,
    buttonText : string,
    inputPlaceholder? : string,
    unit? : string,
    
    getter : () => number,
    setter : (value : number) => void,

    onChange? : (value : number)=>void,
    onInput? : (value : number)=>void,
    inputFilter? : (value : string)=>string
}

export function ValueController(props : ValueControllerProps){
    let inputField : HTMLInputElement | undefined;

    return (
        <div class={styles.container}>
            <div class={styles.top}>
                <p class={styles.label}>
                    {props.title}
                </p>
                <p class={styles.valueLabel}>
                    {(props.valueName || "current value") + ": "}
                    <span class={styles.value}>{props.getter()}</span>
                </p>
            </div>
            <div class={styles.bottom}>
                <button class="button" >{props.buttonText}</button>
                <div class={styles["input-container"]}>
                    <input 
                        class={"button " + styles.input}
                        type="text"
                        ref={inputField}
                        placeholder={props.inputPlaceholder}
                        onInput={e => {
                            if(props.inputFilter){
                                
                                let old_value = e.currentTarget.value;
                                let new_value = props.inputFilter(old_value);
                                console.log("clipping: ",old_value, " to ", new_value);
                                e.currentTarget.value = props.inputFilter(old_value);   
                            }
                        }}
                    ></input>

                    <button 
                        class={"button " + styles["set-button"]}
                        onClick={e => {if(inputField) props.setter(+inputField.value)}}
                    >set</button>
                </div>
            </div>
        </div>
    )
}