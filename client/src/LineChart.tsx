import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

type LineChartProps = {
    chartData: {
        labels: string[],
        datasets: {
            label: string,
            data: number[]
        }[]
    },
    titleText: string
}

function LineChart({ chartData, titleText }: LineChartProps) {

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: 'white',
                    font: {
                        size: 20
                    }
                }
            },
            title: {
                display: true,
                text: titleText,
                color: "white",
                font: {
                    size: 24
                }

            },
        },
        scales: {
            x: {
                ticks: {
                    color: 'white',
                    font: {
                        size: 16
                    }
                },
                grid: {
                    color: 'rgba(255,255,255,0.1)',
                }
            },
            y: {
                ticks: {
                    color: 'white',
                    font: {
                        size: 18
                    }
                },
                grid: {
                    color: 'rgba(255,255,255,0.1)',
                }
            }
        }
    };

    return (
        <div className="line-chart" style={{ width: "700px", marginRight: "100px" }}>
            <Line options={options} data={chartData} />
        </div>
    )
}
export default LineChart