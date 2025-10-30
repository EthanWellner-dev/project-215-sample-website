const sumerativedatafile='./data/summative.csv';
const colorvsbwdatafile='./data/color-vs-bw.csv';

const sumerativeresultscanvas = document.getElementById('sumerativeresultsChart'); 
const colorvsbwcanvas = document.getElementById('color-vs-bw-chart');

async function fetchcsvdata(filepath) {
    const response = await fetch(filepath);
    const text = await response.text();
    return text;
}

async function parsedata(domobject, datafileloc,graphTitle,yAxisTitle,xAxisTitle) {
    const csvdata = await fetchcsvdata(datafileloc);
    const header = csvdata.split('\n').slice(0,1); //getting all the header names

    const rowobject = {}; //setting up return object
    const columnobject = []; //setting up column object
    const columnheaders = header[0].split(','); //splitting header row into individual header names
    columnheaders.forEach(header => {
        rowobject[header] = []; //initializing empty arrays for each column, identified by header name
    });
    
    const table = csvdata.split('\n').slice(1); //getting all the data rows, excluding header row
    table.forEach(row => {

        const cells = row.split(','); //splitting each row into individual cell data

        columnobject.push(cells);

        columnheaders.forEach((header,index) => {
            let parsedcell = isNaN(cells[index]) ? cells[index] : parseFloat(cells[index]); //getting cell data corresponding to current header
            rowobject[header].push(parsedcell); //pushing each cell data into respective header array
        });
    });
    //console.log(rowobject);
    //console.log(columnobject);
    //console.log(columnheaders);

    const rowheaders = rowobject[columnheaders[0]];
    //console.log(rowheaders);


    //rendering datasets
    let jsdatasets = [];  
    for(let i = 0; i < rowheaders.length; i++) {
        //console.log(columnobject[i],i);
        jsdatasets.push({
            label: columnobject[i][0],
            data: columnobject[i].slice(1),
            fill: false,
            borderColor: `hsla(${(255 * i)/(rowheaders.length-1)},100%,50%,0.5)`,
            backgroundColor: `hsla(${(255 * i)/(rowheaders.length-1)},100%,50%,1)`,
            borderWidth: 3 // Line thickness (so weird, like why not just "thickness"?)
        });
    }
    
    const myChart = new Chart(domobject, {  // Construct the chart    
        type: 'line',
        data: {                         // Define data
            labels: columnheaders.slice(1),        // x-axis labels
            datasets: jsdatasets //rendered above
        },
        options: {                        // Define display chart display options 
            responsive: true,             // Re-size based on screen size
            maintainAspectRatio: false,
            scales: {                     // Display options for x & y axes
                x: {                      // x-axis properties
                    title: {
                        display: true,
                        text: '',     // x-axis title
                        font: {                   // font properties
                            size: 14
                        },
                    },
                    ticks: {                      // x-axis tick mark properties
                        // unessisairy clutter HERE
                        font: {
                            size: 14  
                        },
                    },
                    grid: {                       // x-axis grid properties
                        color: '#6c767e'
                    }
                },
                y: {                              // y-axis properties
                    title: {
                        display: true,                          
                        text: yAxisTitle,     // y-axis title
                        font: {
                            size: 14
                        },
                    },
                    ticks: {
                        //maxTicksLimit: data.yTemps.length/10,                 
                        maxTicksLimit: 10,        // Actual value can be set dynamically
                        font: {
                            size: 12
                        }
                    },
                    grid: {                       // y-axis gridlines
                        color: '#6c767e'
                    }
                }
            },
            plugins: {                  // Display options for title and legend
                title: {
                    display: true,
                    text: graphTitle,
                    font: {
                        size: 20,
                    },
                    color: '#black',
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                },
                legend: {
                    align: 'start',
                    position: 'bottom',
                }
            }
        }       
    });

    return {rowobject,rowheaders,columnobject,columnheaders,myChart};
}


const parsed_sumerative_data = parsedata(sumerativeresultscanvas,sumerativedatafile,'Sumerative Data Graph Including All Images Tested','AI Accuracy','Percentage of Adversarial Images In AI Model');
const parsed_color_diff_data = parsedata(colorvsbwcanvas,colorvsbwdatafile,'Color Comparison Graph','AI Accuracy','Percentage of Adversarial Images In AI Model');