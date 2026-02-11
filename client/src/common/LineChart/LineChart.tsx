import { Chart, Title, Tooltip, Legend, Colors } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Line } from 'solid-chartjs';
import { onMount } from 'solid-js';

export interface LineChartProps{
    labels : Array<string | number>,
    datasets : Array<{
        label: string,
        data : Array<number>
    }>
    responsive? : boolean,
    animations? : boolean,
    xticks? : boolean,
    yticks? : boolean,
    xlogarithmic? : boolean,
    ylogarithmic? : boolean,
    xbounds? : {
        max : number,
        min : number
    },
    ybounds? : {
        max : number,
        min : number
    }
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
}

function getPlugins(props: LineChartProps) {
    let result : {} = {};

    (result as any).legend = {
        display: props.legend?.show ?? false,
        position: props.legend?.position ?? "bottom"
    }
    if(props.zoom){
        (result as any).zoom={
            zoom: {
                mode: props.zoom.mode,
                wheel: {
                    enabled: true,
                    modifierKey: "shift",
                },
                pinch: {
                    enabled: true,
                },
            },
            limits: {
                x: {min: props.zoom.min, max: props.zoom.max}
            },
            pan:{
                enabled : props.zoom.pan != undefined,
                mode: props.zoom.pan
            }
        }
    }
    return result;
}

export function LineChart(props : LineChartProps){
  onMount(() => {
    Chart.register(Title, Tooltip, Legend, Colors, zoomPlugin);
  });

  const chartData = {
    labels: props.labels,
    datasets: props.datasets,
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: props.responsive ?? true,
    animations: props.animations ?? false,
    elements: {
        point:{
            radius: 1
        }
    },
    interaction:{
        mode: "nearest",
        axis: "xy",
        intersect: false
    },
    plugins:getPlugins(props),
    scales: {
        x: {
            display: true,
            ticks: {
                display: props.xticks
            },
            suggestedMax: (props.xbounds ?? {"max" : undefined}).max,
            suggestedMin: (props.xbounds ?? {"min" : undefined}).min,
            grid:{
                color: "rgb(50,50,50)"
            }
        },
        y: {
            display: true,
            ticks: {
                display: props.yticks
            },
            suggestedMax: (props.ybounds ?? {"max" : undefined}).max,
            suggestedMin: (props.ybounds ?? {"min" : undefined}).min,
            grid:{
                color: "rgb(50,50,50)"
            }
        }
    },
    grid: {
        color: "red"
    }
  }


  return <Line data={chartData} options={chartOptions} />;
};