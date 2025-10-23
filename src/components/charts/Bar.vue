<template>
  <div class="card relative">
    <Chart
      type="bar"
      :data="chartData"
      :options="chartOptions"
      class="h-[300px]"
      ref="chartRef"
    />
    <div v-if="showStatistics">
      <div
        v-if="highestValueIndex !== null"
        class="custom-label z-10 rounded-[30px] min-w-[151px] w-fit whitespace-nowrap absolute bottom-0 p-5 text-center"
        :style="{
          left: `${
            (highestValueIndex + 0.5) * (100 / chartData.labels.length)
          }%`,
          bottom: '100%',
          transform: 'translateX(-50%)',
        }"
      >
        <p v-if="title" class="text-[#4E5356]">{{ title }}</p>
        <p v-else class="text-[#4E5356]">{{ $t("LABELS.Ratings") }}</p>
        <div class="flex gap-1 items-center justify-center">
          <img src="@/assets/images/star.png" alt="rating" v-if="hasIcon" />
          <p class="font-semibold text-xl">{{ highestValue.toFixed(1) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Chart from "primevue/chart";
import { ref, onMounted } from "vue";

const props = defineProps({
  data: {
    type: Array,
    required: false,
    default: () => [],
  },
  title: {
    required: false,
    default: false,
  },
  hasIcon: {
    required: false,
    default: true,
  },
  showStatistics: {
    required: false,
    default: true,
  },
});

const chartData = ref();
const chartOptions = ref();
const highestValueIndex = ref(null);
const highestValue = ref(0);

onMounted(() => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});

const setChartData = () => {
  const labels = props.data.map((item) => item.title || item.name || item.time);
  const dataValues = props.data.map(
    (item) => parseFloat(item.avg || item.rate_avg || item.values) || 0
  );

  highestValue.value = Math.max(...dataValues);
  highestValueIndex.value = dataValues.indexOf(highestValue.value);

  return {
    labels: labels,
    datasets: [
      {
        backgroundColor: dataValues.map((value) =>
          value === highestValue.value ? "#FDB933" : "#FFE4AE"
        ),
        borderColor: dataValues.map((value) =>
          value === highestValue.value ? "#FDB933" : "#FFE4AE"
        ),
        data: dataValues,
        barThickness: 70,
      },
    ],
  };
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--text-color");
  const textColorSecondary = "#BBBDBF";
  const surfaceBorder = "#FFE8BA";

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
          font: {
            weight: 500,
          },
        },
        grid: {
          display: false,
          drawBorder: false,
        },
        barPercentage: 0.1,
        categoryPercentage: 0.1,
      },
      y: {
        position: "right",
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
          drawBorder: false,
        },
      },
    },
  };
};
</script>

<style>
.card {
  position: relative;
}

.custom-label {
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 20px #ffe8ba82;
}
</style>
