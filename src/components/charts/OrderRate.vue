<template>
  <div class="card">
    <h2 v-if="title" class="font-semibold text-xl">{{ title }}</h2>
    <Chart
      type="line"
      :data="chartData"
      :options="chartOptions"
      class="h-[300px]"
      :canvasProps="{ role: 'img', 'aria-label': 'Data' }"
    />
  </div>
</template>

<script setup>
import Chart from "primevue/chart";

import { ref, onMounted } from "vue";
defineProps({
  title: {
    required: false,
    default: false
  }
})
onMounted(() => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  return {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "",
        data: [0, 59, 80, 81, 56, 55, 40],
        fill: false,
        tension: 0.4,
        borderColor: "#BDC1DF",
      },
    ],
  };
};
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--text-color");
  const textColorSecondary = documentStyle.getPropertyValue(
    "--text-color-secondary"
  );
  const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

  return {
    stacked: false,
    indexAxis: "x",
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
        display: false,
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
          //   drawBorder: false,
        },

        labels: ["January", "February", "March", "April", "May", "June"],
      },
    },
  };
};
</script>
