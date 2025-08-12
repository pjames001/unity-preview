<template>
  <div id="pie_chart_container"></div>
</template>

<script>
export default {
  name: "PieChartWithAnimation", // Component name

  mounted() {
    // Ensure Highcharts is loaded globally before attempting to render the chart.
    // This uses a polling mechanism similar to the user's example.
    if (window.Highcharts) {
      this.renderChart();
    } else {
      const interval = setInterval(() => {
        if (window.Highcharts) {
          clearInterval(interval); // Stop polling once Highcharts is available
          this.renderChart();
        }
      }, 100); // Check every 100ms
    }
  },
  methods: {
    renderChart() {
      // Define the chart options for Highcharts
      const chartOptions = {
        credits: false,
        chart: {
          type: 'pie',
          renderTo: 'pie_chart_container', // Specifies the ID of the div to render the chart into
          backgroundColor: 'transparent', // Make chart background transparent to blend with parent div
          animation: { // Global chart animation for initial rendering
            duration: 300, // Shorter duration for a quicker entrance
            easing: 'easeOutBounce' // Custom easing for a bouncy effect
          }
        },
        title: {
          text: null // Hide the default Highcharts title, using our H1 instead
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}</b>'
        },

        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f}',
              style: {
                color: (window.Highcharts.theme && window.Highcharts.theme.contrastTextColor) || 'black'
              }
            },
            showInLegend: true, // Show legend for slices
            animation: { // Specific animation for pie series (overrides global if specified)
              duration: 750, // Match global animation duration
              easing: 'easeOutBounce' // Match global easing
            },
            // Additional options to control slice appearance during animation
            startAngle: -90, // Start slices from the top
            endAngle: 270,   // End slices at the top (full circle)
          }
        },
        series: [{
          name: 'Share',
          colorByPoint: false, // Assigns a different color to each slice
          data: [
            { name: 'Chrome', y: 70.67, color: '#4299E1' }, // Tailwind blue-500
            { name: 'Firefox', y: 10.38, color: '#F6AD55' }, // Tailwind orange-400
            { name: 'Edge', y: 4.85, color: '#3182CE' },    // Tailwind blue-600
            { name: 'Safari', y: 4.67, color: '#63B3ED' },  // Tailwind blue-400
            { name: 'Other', y: 3.61, color: '#A0AEC0' }    // Tailwind gray-500
          ]
        }]
      };

      // Create the Highcharts chart instance
      window.Highcharts.chart('pie_chart_container', chartOptions);
      
    }
  }
};

</script>