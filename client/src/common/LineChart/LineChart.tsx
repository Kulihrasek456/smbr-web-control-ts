import { Chart, Title, Tooltip, Legend, Colors, type TooltipItem, LogarithmicScale, type ChartOptions, type ChartType, type ScaleChartOptions } from 'chart.js';
import { isNumber } from 'chart.js/helpers';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Line } from 'solid-chartjs';
import { createEffect, createSignal, mergeProps, onMount } from 'solid-js';

interface chartScaleOptions {
    showTicks ?: boolean,
    bounds?: {
        min: number,
        max: number
    }
    beginAtZero?: boolean
    type?: "logarithmic" | "linear" | "time" | "category" | "timeseries" | undefined
    labelCallback?: (value : any, index : number, ticks : any[]) => string
}

export interface CustomChartOptions {
    responsive? : boolean,
    animations? : boolean,
    x?: chartScaleOptions
    y?: chartScaleOptions

    plugins?: {
        legend?: {
            position : 'top' 
                     | 'left' 
                     | 'bottom' 
                     | 'right' 
                     | 'chartArea'
            show? : boolean
        }
        zoom?:{
            mode: "x" | "y" | "xy",
            min:number,
            max:number
            pan?: "x" | "y" | "xy"
        }
        tooltip?:{
            labelCallback?: (item : TooltipItem<any>) => string
            titleCallback?: (items : TooltipItem<any>[]) => string
        }
    }

    raw?: ChartOptions<'line'> //used for applying any chartJS options
}

export interface LineChartProps{
    labels : Array<string | number>,
    datasets : Array<{
        label: string,
        data : Array<number>,
        hidden? : boolean
    }>
    options? : CustomChartOptions
}

function getPlugins(options?: CustomChartOptions) {
    let result : any = {
        tooltip: {
            callbacks: {
                title: function(context: TooltipItem<any>[]){
                    if(context.length>0){
                        return context[0].label + ' µs';
                    }
                }
            },
        },
    };

    result.legend = {
        display: options?.plugins?.legend?.show ?? false,
        position: options?.plugins?.legend?.position ?? "bottom"
    }
    if(options?.plugins?.zoom){
        let zoomOpts = options?.plugins?.zoom;
        (result as any).zoom={
            zoom: {
                mode: zoomOpts.mode,
                wheel: {
                    enabled: true,
                    modifierKey: "shift",
                },
                pinch: {
                    enabled: true,
                },
            },
            limits: {
                x: {min: zoomOpts.min, max: zoomOpts.max}
            },
            pan:{
                enabled : zoomOpts.pan != undefined,
                mode: zoomOpts.pan
            }
        }
    }
    return result;
}

function getScale(options? : chartScaleOptions){
    return {
        display: true,
        type: options?.type,
        beginAtZero: options?.beginAtZero ?? false,
        ticks: {
            display: options?.showTicks ?? true,

            callback: options?.labelCallback
        },
        suggestedMax: options?.bounds?.max,
        suggestedMin: options?.bounds?.min,
        grid: {
            color: "rgb(50,50,50)"
        }
    }
}

function getDefaultOptions(options?: CustomChartOptions): ChartOptions<'line'> {
    return {
        maintainAspectRatio: false,
        responsive: options?.responsive ?? true,
        animation: (options?.animations ?? false) ? undefined : false,
        elements: {
            point: {
                radius: 1
            }
        },
        interaction: {
            mode: "nearest",
            axis: "xy",
            intersect: false
        },
        plugins: getPlugins(options),
        scales: {
            x: getScale(options?.x),
            y: getScale(options?.y)
        }
    }
}

Chart.register(Title, Tooltip, Legend, Colors, zoomPlugin, LogarithmicScale);
export function LineChart(props: LineChartProps) {
    
    const getOptions = () => {
        const defaults = getDefaultOptions(props.options);
        
        return {
            ...defaults,
            ...(props.options?.raw || {})
        };
    };

    return (
        <Line 
            data={{
                labels: props.labels,
                datasets: props.datasets,
            }} 
            options={getOptions()} 
        />
    );
}