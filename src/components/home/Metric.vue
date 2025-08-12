<template>
  <div class="flex flex-col items-center justify-center font-inter">
    <h1 class="text-2xl font-semibold dark:text-white text-gray-800 mb-4 text-center">
      My Personal Performance
    </h1>

    <div class="flex space-x-4 mb-4">
      <button
        v-for="range in ['daily', 'weekly', 'monthly']"
        :key="range"
        @click="activeRange = range"
        :class="['px-4 py-2 rounded-xl uppercase', activeRange === range ? 'bg-navbtn text-white shadow-inner' : 'bg-gray-200 shadow-outer']"
      >
        {{ range }}
      </button>
    </div>

    <div class="flex space-x-4 mb-4">
      <button
        v-for="(label, idx) in datasetLabels"
        :key="idx"
        @click="activeMetric = idx"
        :style="getMetricButtonStyle(idx)"
        class="px-4 py-2 rounded-xl text-sm border font-medium"
        :class="[
          activeMetric === idx ? 'shadow-inner' : 'shadow-outer',
          'text-[#2c2c2c] dark:text-white'
        ]"
      >
        {{ label }}
      </button>
    </div>

    <div class="w-[300px] h-[220px] relative">
      <canvas ref="chartCanvas"></canvas>
    </div>

    <!-- Move the metric label below the chart -->
    <div class="mt-2 text-center font-bold text-lg">
      {{ datasetLabels[activeMetric] }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const chartCanvas = ref(null)
let chartInstance = null
const activeRange = ref('daily')
const activeMetric = ref(0)
const needleAngle = ref(Math.PI)
let animationFrameId = null

const datasetLabels = [
  'Number of Calls',
  'Touched Accounts',
  'Minutes',
  'Total Collected',
  'Commission',
  'Company Fees'
]

const metricColors = [
  { base: [59, 130, 246], border: 'rgba(59, 130, 246, 1)' },
  { base: [34, 197, 94], border: 'rgba(34, 197, 94, 1)' },
  { base: [234, 179, 8], border: 'rgba(234, 179, 8, 1)' },
  { base: [241, 136, 5], border: 'rgba(241, 136, 5, 1)' },
  { base: [139, 92, 246], border: 'rgba(139, 92, 246, 1)' },
  { base: [244, 63, 94], border: 'rgba(244, 63, 94, 1)' }
]

const getMetricButtonStyle =(idx) => {
  const isActive = activeMetric.value === idx
  const [r, g, b] = metricColors[idx].base
  const alpha = isActive ? 1 : 0.4
  return {
    backgroundColor: `rgba(${r}, ${g}, ${b}, ${alpha})`,
    borderColor: metricColors[idx].border
  }
}

const rawDatasets = {
  daily: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      [250, 215, 270, 189, 150, 170, 200],
      [150, 120, 130, 160, 100, 150, 145],
      [90, 120, 110, 100, 140, 130, 100],
      [7500, 5500, 4750, 2500, 6500, 4500, 10000],
      [300, 500, 600, 200, 100, 150, 700],
      [10000, 1200, 15000, 3000, 900, 4000, 20000]
    ]
  },
  weekly: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      [1320, 1450, 1240, 1290],
      [1020, 980, 890, 920],
      [640, 710, 730, 690],
      [38000, 42000, 35000, 36000],
      [2100, 1800, 1600, 2000],
      [34000, 22000, 31000, 25000]
    ]
  },
  monthly: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      [8000, 7000, 7500, 7600, 7200, 6900, 8100, 8300, 8500, 8700, 8600, 8900],
      [5500, 5200, 5100, 5000, 4900, 4800, 4700, 4600, 4500, 4400, 4300, 4200],
      [4300, 4400, 4200, 4100, 4000, 3900, 3800, 3700, 3600, 3500, 3400, 3300],
      [48000, 50000, 47000, 46000, 45000, 44000, 43000, 42000, 41000, 40000, 39000, 38000],
      [3200, 3100, 3000, 2900, 2800, 2700, 2600, 2500, 2400, 2300, 2200, 2100],
      [52000, 50000, 49000, 48000, 47000, 46000, 45000, 44000, 43000, 42000, 41000, 40000]
    ]
  }
}

const calculateAverage = (arr) => {
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

const animateNeedle = (toAngle) => {
  cancelAnimationFrame(animationFrameId)
  const animationDuration = 800
  const startAngle = needleAngle.value
  const startTime = performance.now()

  const animate = (time) => {
    const elapsed = time - startTime
    const progress = Math.min(elapsed / animationDuration, 1)
    needleAngle.value = startAngle + (toAngle - startAngle) * progress
    chartInstance.update('none')
    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animate)
    }
  }

  animationFrameId = requestAnimationFrame(animate)
}

const gaugePlugin = {
  id: 'gaugePlugin',
  afterDraw(chart) {
    const { ctx, chartArea: { width, height } } = chart
    const centerX = width / 2
    const centerY = height * 0.95
    const radius = Math.min(width, height) * 0.7

    const grad = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY)
    grad.addColorStop(0, '#ef4444')
    grad.addColorStop(0.5, '#f97316')
    grad.addColorStop(1, '#22c55e')

    const dataset = chart.data.datasets[0]
    dataset.backgroundColor = [grad, '#e5e7eb']

    ctx.save()
    ctx.translate(centerX, centerY)
    const tickCount = 10
    const startAngle = Math.PI
    const endAngle = 0

    ctx.lineWidth = 2
    ctx.strokeStyle = '#444'
    ctx.fillStyle = '#444'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    for (let i = 1; i < tickCount; i++) {
      const angle = startAngle + (i / tickCount) * (endAngle - startAngle)
      const xStart = radius * Math.cos(angle)
      const yStart = radius * Math.sin(angle)
      const xEnd = (radius - 10) * Math.cos(angle)
      const yEnd = (radius - 10) * Math.sin(angle)

      ctx.beginPath()
      ctx.moveTo(xStart, yStart)
      ctx.lineTo(xEnd, yEnd)
      ctx.stroke()

      const labelVal = Math.round((i / tickCount) * 100)
      const labelX = (radius - 25) * Math.cos(angle)
      const labelY = (radius - 25) * Math.sin(angle)
      ctx.fillText(labelVal.toString(), labelX, labelY)
    }

    ctx.restore()

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(needleAngle.value)

    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.moveTo(-5, 0)
    ctx.lineTo(radius * 0.85, 0)
    ctx.lineTo(0, -5)
    ctx.lineTo(-5, 0)
    ctx.fill()

    ctx.beginPath()
    ctx.arc(0, 0, 10, 0, 2 * Math.PI)
    ctx.fill()
    ctx.restore()

    // Show average inside the arc (keep this)
    ctx.save()
    const isDark = document.documentElement.classList.contains('dark')
    ctx.fillStyle = isDark ? '#ffffff' : '#2c2c2c'
    ctx.font = 'bold 28px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${Math.round(chart.data.datasets[0].data[0])}`, centerX, centerY - radius / 2)
    ctx.restore()
  }
}

const renderChart = () => {
  if (chartInstance) chartInstance.destroy()

  const data = rawDatasets[activeRange.value].datasets[activeMetric.value]
  const avg = calculateAverage(data)
  const maxDataValue = Math.max(...data)
  const normalizedValue = Math.min((avg / maxDataValue) * 100, 100)

  const ctx = chartCanvas.value.getContext('2d')

  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [],
      datasets: [
        {
          data: [normalizedValue, 100 - normalizedValue],
          backgroundColor: ['#3b82f6', '#e5e7eb'],
          borderWidth: 0,
          circumference: 180,
          rotation: 270,
          cutout: '80%'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      animation: { duration: 800 },
      cutout: '80%'
    },
    plugins: [gaugePlugin]
  })

  const targetAngle = Math.PI + (normalizedValue / 100) * Math.PI
  animateNeedle(targetAngle)
}

watch([activeRange, activeMetric], renderChart)

let darkModeObserver = null

onMounted(() => {
  renderChart()
  darkModeObserver = new MutationObserver(() => {
    renderChart()
  })
  darkModeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
})

onUnmounted(() => {
  if (chartInstance) chartInstance.destroy()
  cancelAnimationFrame(animationFrameId)
})
</script>

<style scoped>
button {
  transition: background-color 0.2s;
}
</style>
