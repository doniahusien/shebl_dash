<script setup>
import Chart from "primevue/chart";
import { ref, onMounted } from "vue";
import { Chart as ChartJS } from "chart.js";

// Plugin defined directly for use within the chart instance
const doughnutCenterTextPlugin = {
  id: "doughnutCenterText",
  beforeDraw(chart) {
    const {
      ctx,
      chartArea: { width, height },
    } = chart;
    const dataValue = chart.config.data.datasets[0].data[0];

    ctx.save();
    ctx.font = "bold 24px Arial";
    ctx.fillStyle = "#EB631E"; // Text color
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${dataValue}%`, width / 2, height / 2);
    ctx.restore();
  },
};

const props = defineProps({
  data: {
    type: Number,
    required: true,
  },
});

const chartData = ref();
const chartOptions = ref(null);
const orders_num = ref([]);

onMounted(() => {
  orders_num.value = setChartValues();
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});

const setChartValues = () => {
  return [props.data || 0, 100 - (props.data || 0)];
};

const setChartData = () => {
  return {
    datasets: [
      {
        data: orders_num.value,
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "#FDB933"); // Start color of the gradient
          gradient.addColorStop(1, "#EB631E"); // End color of the gradient
          return [
            gradient, // Gradient for the percentage part
            "#FFE8BA", // Solid color for the remaining part
          ];
        },
        hoverBackgroundColor: ["#FDB933", "#FFE8BA"],
      },
    ],
  };
};

const setChartOptions = () => {
  return {
    plugins: {
      legend: {
        display: false, // Disable legend
      },
      doughnutCenterTextPlugin, // Pass the custom plugin here
    },
    cutout: "88%", // Doughnut chart cutout for a hollow center
  };
};
</script>

<template>
  <div class="card flex justify-center items-center h-full">
    <Chart
      type="doughnut"
      :data="chartData"
      :options="chartOptions"
      :plugins="[doughnutCenterTextPlugin]"
      class="h-[300px]"
    />
  </div>
</template>
