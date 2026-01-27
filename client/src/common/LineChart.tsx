import { Chart, Title, Tooltip, Legend, Colors } from 'chart.js';
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
}

export function LineChart(props : LineChartProps){
  onMount(() => {
    Chart.register(Title, Tooltip, Legend, Colors);
  });

  const chartData = {
    labels: props.labels,
    datasets: props.datasets,
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: props.responsive || true,
    animations: props.animations || false,
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
    plugins:{
        legend:{
            display: false
        }
    },
    scales: {
        x: {
            display: true,
            ticks: {
                display: props.xticks
            },
            suggestedMax: (props.xbounds || {"max" : undefined}).max,
            suggestedMin: (props.xbounds || {"min" : undefined}).min,
            grid:{
                color: "rgb(50,50,50)"
            }
        },
        y: {
            display: true,
            ticks: {
                display: props.yticks
            },
            suggestedMax: (props.ybounds || {"max" : undefined}).max,
            suggestedMin: (props.ybounds || {"min" : undefined}).min,
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