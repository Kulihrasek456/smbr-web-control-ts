import { createEffect, createSignal, onCleanup, onMount, Show } from "solid-js";
import styles from "./AutoScroller.module.css"
import { makeResizeObserver } from "@solid-primitives/resize-observer";

export interface AutoScrollerProps {
    class?: string,
    value: string,
}

export function AutoScrollerP(props: AutoScrollerProps) {
    let textEl: HTMLParagraphElement | undefined;
    let containerEl: HTMLDivElement | undefined;
    let autoScrollEl : HTMLParagraphElement | undefined;

    const whiteSpaceWidth = 50;
    const scrollSpeed = 20;
    const refreshInterval = 1000; //must match the transition length in css

    const [overflowing, setOverflowing] = createSignal<boolean>(false);

    const [leftOffset, setLeftOffset] = createSignal<number | undefined>(undefined);


    function checkOverflow(el : Element){
        if (!el || !textEl) return;
        setOverflowing(textEl.scrollWidth > el.clientWidth);
    };

    onMount(() => {
        const observer = makeResizeObserver((entries) => {
            for (const entry of entries) {
                checkOverflow(entry.target);
            }
        });

        if (containerEl) {
            observer.observe(containerEl);
            checkOverflow(containerEl);
        }
    });
    let intervalID : number | undefined = undefined;


    createEffect(()=>{
        if(overflowing()){
            intervalID = setInterval(()=>{
                if(textEl){
                    let offset = (leftOffset() ?? 0);
                    let contentLen = textEl.scrollWidth + whiteSpaceWidth;
                    if( -offset === contentLen){
                        setLeftOffset(undefined);
                    }else{
                        let nextOffset = offset-scrollSpeed;
                        if(-nextOffset > contentLen){
                            setLeftOffset(-contentLen);
                        }else{
                            setLeftOffset(nextOffset);
                        }
                    }
                }
            },refreshInterval);
        }else{
            clearInterval(intervalID);
            intervalID = undefined;
            setLeftOffset(undefined);
        }
    })

    onCleanup(()=>{
        if(intervalID !== undefined){
            clearInterval(intervalID);
        }
    })

    function getTransform(offset : number | undefined){
        if(offset){
            return `translateX(${offset.toString()}px)`
        }else{
            return undefined
        }
    }

    return (
        <div 
            ref={containerEl}
            class={props.class}
            classList={{
                [styles.container]:true,
                [styles.overflowing]: overflowing()
            }}
        >
            <p
                ref={textEl}
                classList={{
                    [styles.text]: true
                }}
                
            >
                {props.value}
            </p>
            <Show when={overflowing()}>
                <p
                    ref={autoScrollEl}
                    style={{
                        transform: getTransform(leftOffset()),
                        transition: (leftOffset())?undefined:'none',
                        display: (overflowing())?"inline-block":"none"
                    }}
                    classList={{
                        [styles.auto_scroller]: true
                    }}
                >
                    {props.value}
                    <span 
                        class={styles.empty_space}
                        style={{
                            width: `${whiteSpaceWidth}px`
                        }}
                    ></span>{
                    props.value}
                </p>
            </Show>
        </div>
    )
}