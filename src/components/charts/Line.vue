<template>
  <Chart
    type="line"
    :data="chartData"
    :options="chartOptions"
    class="h-[300px]"
    :canvasProps="{ role: 'img', 'aria-label': 'Data' }"
  />
</template>

<script setup>
import Chart from "primevue/chart";
import { ref, onMounted } from "vue";

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
        label: null,
        data: [0, 59, 80, 81, 56, 55, 40],
        fill: true,
        tension: 0.4,
        borderColor: "#EB631E",
        backgroundColor: "rgba(235, 99, 30, 0.04)",
        pointBackgroundColor: "#EB631E",
        pointBorderColor: "#FFFFFF",
        pointBorderWidth: 2,
        borderWidth: 4,
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
    indexAxis: "x", // Setting the data to be along the x-axis
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        display: false, // Disable the legend entirely
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
      },
      y: {
        position: "right", // Move the y-axis to the right
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          display: false, // Hide grid lines for the y-axis
        },
        display: true, // Keep the y-axis displayed
      },
    },
  };
};
</script>
