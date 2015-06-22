/*
 * Function to draw the pie chart
 */
function builtPie() {
    
    // 'external' data
    var data = new Array();

    data.push({
        name: 'Level 0',
        y: 70,
        color: '#3669c9'
    });

    data.push({
        name: 'Level 1',
        y: 123,
        color: '#1c9523'
    });

    data.push({
        name: 'Level 2',
        y: 30,
        color: '#DF5353'
    });

    $('#container-pie2').highcharts({
        
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        
        title: {
            text: ''
        },
        
        credits: {
            enabled: false
        },
        
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        
        series: [{
            type: 'pie',
            name: 'Anteil',
            data: data
        }]
    });
}

/*
* Call the function to built the chart when the template is rendered
*/

Template.piechart.onRendered(function() {
    builtPie();
});
