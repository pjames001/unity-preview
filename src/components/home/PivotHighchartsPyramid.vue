<template>
  <div>
    <div id="highchartsContainer" style="width:300px;height:300px;"></div>
  </div>
</template>

<script>
export default {
  name: "PyramidChartOnly",
  mounted() {
    // Wait for Highcharts to be loaded globally
    if (window.Highcharts) {
      this.renderChart();
    } else {
      const interval = setInterval(() => {
        if (window.Highcharts) {
          clearInterval(interval);
          this.renderChart();
        }
      }, 100);
    }
  },
  methods: {
    renderChart() {
      window.Highcharts.chart('highchartsContainer', {
        credits: {
          enabled: false
        },
        chart: {
          type: 'pyramid',
          backgroundColor: 'transparent'
        },
        title: {
          text: '',
        },
        colors: ['#132146', '#0F292A', '#2D1E23', '#2E1928'],
        plotOptions: {
          series: {
            dataLabels: {
              enabled: false,
            },
          }
        },
        legend: {
          enabled: false
        },
        series: [{
          name: 'Leads',
          data: [
            { name: 'Cold Leads', y: 35000, borderColor: '#5AA9E6', borderWidth: 2 },
            { name: 'Warm Leads', y: 3500, borderColor: '#F8943C', borderWidth: 2 },
            { name: 'Hot Leads', y: 700, borderColor: '#F6726F', borderWidth: 2 },
          ]
        }]
      });
    }
  }
};
</script>