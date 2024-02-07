'use client'
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip, Filler } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip, Filler);

const Chart = ({ priceData }: any) => {

    const lineColors = {
        yellow: '#FEA31B',
        white: 'rgba(255, 255, 255, 1)',
        blue: '#2A3645',

    };


    const options: any = {
        scales: {
            x: {
                type: 'category',
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value: number) => `₹${value}`,
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    color: 'rgba(0, 0, 0, 0.7)',
                },
            },
        },
        elements: {
            point: {
                radius: 4,
            },

        },

    };

    const datasets = priceData.datasets.map((dataset: any, index: number) => ({
        ...dataset,
        borderColor: lineColors[index === 0 ? 'yellow' : index === 1 ? 'white' : 'blue'],
        backgroundColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: lineColors[index === 0 ? 'yellow' : index === 1 ? 'white' : 'blue'],
        pointBorderColor: 'rgba(0, 0, 0, 0)',
    }));

    const customizedData = {
        ...priceData,
        datasets: datasets,
    };

    return (
        <Line data={customizedData} options={options} />
    );
};

export default Chart;
