date = new Date();
year = date.getFullYear();
month = date.getMonth() + 1;
day = date.getDate();
document.getElementById("current_date").innerHTML = month + "." + day + "." + year;



// main.js
let tableData;
let filteredData;
let chartInstance;

// Variables to store the selected filters
let selectedYear = 'all';
let selectedGender = 'all';


// Attach event listeners after the DOM is fully loaded
const yearSelect = document.getElementById('year-select');
const genderSelect = document.getElementById('gender-select');

// Chart tab
function createLineChart(data, chartTitle, canvasId){
   
    const context= document.getElementById(canvasId).getContext('2d');

    // Check if the chart instance exists and destroy it
    if (chartInstance) {
        chartInstance.destroy();
    }

    const containerWidth = document.getElementById('chart-container').clientWidth;
    // const chartHeight = 500; 
    
    context.canvas.width = containerWidth;
    // context.canvas.height = chartHeight;

// sort the data
    data.sort((a, b) => {
        const aRate = a.male.reduce((sum, val) => sum + val, 0) + a.female.reduce((sum, val) => sum + val, 0);
        const bRate = b.male.reduce((sum, val) => sum + val, 0) + b.female.reduce((sum, val) => sum + val, 0);
        return aRate - bRate;
    });

  document.getElementById('chart-title').textContent = chartTitle;

    function getLineColor(index){
        const lineColors = ['#3760E3', '#00C914', '#8E0500'];
        return lineColors[index] || 'black';
    }

    
    // Determine the minimum and maximum unemployment rates from the entire dataset
    const allUnemploymentRates = data.reduce((allRates, entry) => {
        const maleRates = entry.male.filter(rate => !isNaN(rate));
        const femaleRates = entry.female.filter(rate => !isNaN(rate));
        return allRates.concat(maleRates, femaleRates);
    }, []);
    const minUnemploymentRate = Math.min(...allUnemploymentRates);
    const maxUnemploymentRate = Math.max(...allUnemploymentRates);

    const countries = data.map(entry => entry.country);
    const years = data[0].male.map((_, index)=> 2019 + index);

    const datasets = [];
    years.forEach((year, index) => {
        const maleDataPoints = data.map(entry => entry.male[index]);
        const femaleDataPoints = data.map(entry => entry.female[index]);

        datasets.push({
        label: `${year} Male`,
        data: maleDataPoints, 
        borderColor: getLineColor(index),
        backgroundColor : 'transparent', 
        pointBackgroundColor: 'blue', 
        fill: false, 
        });
        datasets.push({
        label: `${year} Female`,
        data: femaleDataPoints,
        borderColor: getLineColor(index),
        backgroundColor : 'transparent',
        pointBackgroundColor:'red',
        fill: false,
        });
    });

   chartInstance =  new Chart(context, {
        type: 'line', 
        data: {
            labels: countries,
            datasets: datasets,
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: chartTitle,
                    font: {
                        size: 18,
                    },
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        fontColor: '#333',
                        generateLabels: function (chart) {
                            const originalLabels = chart.defaults.plugins.legend.labels.generateLabels(chart);
                            const newLabels = [];
                            originalLabels.forEach((label)=> {
                                const datasetLabel = label.text;
                                const yearRegex = /\d{4}/;
                                const yearMatch = datasetLabel.match(yearRegex);
                                const year = yearMatch ? yearMatch[0]: 'Year';
                                const gender = datasetLabel.includes('Male') ? 'Male' : 'Female';
                                if(selectedYear === 'all' || (year === selectedYear && gender === selectedGender)){
                                    label.text = `${year} - ${gender}`;
                                    newLabels.push(label);
                                }
                                
                            });
                            return newLabels;
                        },
                    },
                },
                tooltip: {
                    callbacks: {
                        label: getTooltipLabel,
                        },
                    },
                },
            scales: {
                x: {
                    stacked: false,
                    title: {
                        display: true,
                        text: 'Countries',
                        font: {
                            size: 14,
                            weight: 'normal',
                        },
                        color: 'blue',
                    },
                },
                y: {
                    beginAtZero: false,
                    min: minUnemploymentRate,
                    max: maxUnemploymentRate,
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(2) + 'k';
                        },
                    },
                    title: {
                        display: true,
                        text: 'Enemployment Rates in Thousands',
                        font: {
                            size: 14,
                            weight: 'normal',
                        },
                        color: 'green',
                    },
                },
            },
            elements: {
                point: {
                    radius: 5,
                },
            },
            plugins: {
                colorschemes: {
                    scheme: 'tableau.Classic10',
                    override: true,
                },
            },
            interaction: {
                intersect: false,
            },
          

            },
           
    });
}




// Table tab
const apiUrl = 'https://sdmx.oecd.org/public/rest/data/OECD.ELS.SAE,DSD_LFS@DF_LFS,1.0/G7+EU27+EU19OECD+EU22OECD+IDN+MLT+MKD+ROU+RUS+ZAF+IND+CYP+HRV+BGR+BRA+ARG+AUS+AUT+BEL+CAN+CHL+COL+CRI+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OECD...M+F._T.UNE?startPeriod=2019&endPeriod=2021&lastNObservations=4&dimensionAtObservation=AllDimensions';

// Function to make the API request and display data in the table
async function fetchDataAndProcessData() {
    try {
        const response = await fetch(apiUrl);
        const responseText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(responseText, 'text/xml');
        tableData = processXMLData(xmlDoc);
        console.log(tableData);
         // Remove unwanted entries from data for the table
         const unwantedCountries = [
            "European Union (19 countries) in OECD",
            "European Union (22 countries) in OECD",
            "European Union (27 countries)",
            "G7",
            "OECD"
        ];
        filteredData = tableData.filter(entry => !unwantedCountries.includes(entry.country));
        displayTable(filteredData);
        
       
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}



    // Lookup object to map country codes to full names
    const countryLookup = {
        "AUT": "Austria",
        "ARG": "Argentina",
        "AUS": "Australia",
        "BEL": "Belgium",
        "BRA": "Brazil",
        "BGR": "Bulgaria",
        "CAN": "Canada",
        "CHL": "Chile",	
        "COL": "Colombia",	
        "CRI": "Costa Rica",	
        "HRV": "Croatia",	
        "CUB": "Cuba",	
        "CYP": "Cyprus",	
        "CZE": "Czechia",	
        "DNK": "Denmark",			
        "EUE": "European Union",	
        "EST": "Estonia",
        "FIN": "Finland",
        "FRA": "France",		
        "DEU": "Germany",	
        "GRC": "Greece",		
        "HUN": "Hungary",	
        "ISL": "Iceland",	
        "IND": "India",	
        "IDN": "Indonesia",	
        "IRL": "Ireland",	
        "ISR": "Israel",
        "ITA": "Italy",	
        "JPN": "Japan",			
        "LVA": "Latvia",	
        "LTU": "Lithuania",	
        "LUX": "Luxembourg",	
        "MKD": "Macedonia",	
        "MLT": "Malta",	
        "MEX": "Mexico",
        "NLD": "Netherlands",
        "NZL": "New Zealand",
        "NOR": "Norway",
        "POL": "Poland",
        "PRT": "Portugal",
        "REU": "Reunion",
        "ROU": "Romania",
        "RUS": "Russian Federation",	
        "SVK": "Slovakia",	
        "SVN": "Slovenia",	
        "ZAF": "South Africa",	
        "KOR": "South Korea",	
        "ESP": "Spain",
        "SWE": "Sweden",
        "CHE": "Switzerland",	
        "TUR": "Turkey",		
        "UGA": "Uganda",	
        "GBR": "United Kingdom",	
        "USA": "United States",		
        "EU22OECD": "European Union (22 countries) in OECD",
        "EU19OECD": "European Union (19 countries) in OECD",
        "EU27": "European Union (27 countries)"
    };

// Process the xml to extract table data
function processXMLData(xmlDoc) {
    const namespaceURI = 'http://www.sdmx.org/resources/sdmxml/schemas/v2_1/data/generic';
    const observations = xmlDoc.getElementsByTagNameNS(namespaceURI, 'Obs');
    const tableData = [];



    // Map Years to observations
    const yearObservationsMap = {};


    for (const observation of observations) {
        const dimensions = observation.getElementsByTagNameNS(namespaceURI, 'Value');
        const countryCode = dimensions[1].getAttribute('value');
        const country = countryLookup[countryCode] || countryCode;
        const year = dimensions[0].getAttribute('value');
        const employment = parseFloat(observation.getElementsByTagNameNS(namespaceURI, 'ObsValue')[0].getAttribute('value'));
        const gender = dimensions[4].getAttribute('value');

        // Check year availability
        if(!yearObservationsMap[year]){
            yearObservationsMap[year] = [];
        }
        yearObservationsMap[year].push({country, gender, employment});
    }
    // Iterate through years
    const years = Object.keys(yearObservationsMap).sort();
    for (const year of years) {
        const observationsForYear = yearObservationsMap[year];

        for(const observation of observationsForYear){
            const { country, gender, employment} = observation;
            let entry = tableData.find((item) => item.country === country);
            if (!entry) {
                entry = { country, male: [], female: [] };
                tableData.push(entry);
            }
    
            if (gender === 'M') {
                entry.male.push(employment);
            } else if (gender === 'F'){
                entry.female.push(employment);
            }

        }

    }

    return tableData;
}

// Function to display the data in a table
function displayTable(data) {

    // display alphabetically
    data.sort((a,b)=> a.country.localeCompare(b.country));

    const jobPostingsTable = document.getElementById('job-postings-table');

    // Create the table element dynamically
    const table = document.createElement('table');

    // Create table header
    const tableHeader = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th rowspan="2">Country</th><th colspan="3">Male</th><th colspan="3">Female</th>';
    tableHeader.appendChild(headerRow);

    const yearRow = document.createElement('tr');
    for (let i = 0; i < 3; i++) {
        yearRow.innerHTML += `<th>${2019 + i}</th>`;
    }
    for (let i = 0; i < 3; i++) {
        yearRow.innerHTML += `<th>${2019 + i}</th>`;
    }
    tableHeader.appendChild(yearRow);

    table.appendChild(tableHeader);

    // Create table body and populate data
    const tableBody = document.createElement('tbody');
    for (const entry of filteredData) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${entry.country}</td>`;

        // Populate male employment values for each year
        for (const maleVal of entry.male) {
            row.innerHTML += `<td>${maleVal.toFixed(2)}</td>`;
        }

        // Populate female employment values for each year
        for (const femaleVal of entry.female) {
            row.innerHTML += `<td>${femaleVal.toFixed(2)}</td>`;
        }

        tableBody.appendChild(row);
    }
    table.appendChild(tableBody);

    // Append the table to the jobPostingsTable div
    jobPostingsTable.appendChild(table);
}


function getLineColor(index) {
    const lineColors = ['#3760E3', '#00C914', '#8E0500'];
    return lineColors[index] || 'black';
  }


// Function to handle filter changes and update the chart
function handleFilterChange(filteredChartData) {
    selectedYear = yearSelect.value;
    selectedGender = genderSelect.value;
  
    // Update the chart title based on the selected year and gender filter
    let chartTitle = 'Unemployment Rates';
    if (selectedYear !== 'all') {
      chartTitle += ` for ${selectedYear}`;
    }
    if (selectedGender !== 'all') {
      chartTitle += ` (${selectedGender.charAt(0).toUpperCase() + selectedGender.slice(1)})`;
    }

   document.getElementById('chart-title').textContent = chartTitle;
       console.log(chartTitle);
  
    // Check if chartInstance is defined and filteredChartData is not empty
    if (chartInstance && filteredChartData.length > 0) {
      // Update the datasets in the chart
      chartInstance.data.datasets = [];
      const years = selectedYear !== 'all' ? [selectedYear] : [2019, 2020, 2021];
      years.forEach((year, index) => {
        const maleDataPoints = filteredChartData.map(entry => entry.male[index]);
        const femaleDataPoints = filteredChartData.map(entry => entry.female[index]);
  
        chartInstance.data.datasets.push({
          label: `${year} Male`,
          data: maleDataPoints,
          borderColor: getLineColor(index),
          backgroundColor: 'transparent',
          pointBackgroundColor: 'blue',
          fill: false,
        });
  
        chartInstance.data.datasets.push({
          label: `${year} Female`,
          data: femaleDataPoints,
          borderColor: getLineColor(index),
          backgroundColor: 'transparent',
          pointBackgroundColor: 'red',
          fill: false,
        });
      });
  
      // Update the chart title
    //   chartInstance.options.plugins.title.text = chartTitle;
  
      // Refresh the chart
      chartInstance.update();
    }
  }
  
  




const filterButton = document.getElementById('filter-button');
// filterButton.addEventListener('click', handleFilterChange);
// Attach event listener for the "Filter" button
filterButton.addEventListener('click', () => {
    // Define selectedYear and selectedGender variables here
    const selectedYear = yearSelect.value;
    const selectedGender = genderSelect.value;

    const filteredChartData = filteredData
        .map(entry => {
            const maleData = selectedYear !== 'all' ? [entry.male[selectedYear - 2019]] : entry.male;
            const femaleData = selectedYear !== 'all' ? [entry.female[selectedYear - 2019]] : entry.female;

            if (selectedGender !== 'all') {
                return { ...entry, male: selectedGender === 'male' ? maleData : [], female: selectedGender === 'female' ? femaleData : [] };
            }

            return { ...entry, male: maleData, female: femaleData };
        })
        .filter(entry => (entry.male?.length || 0) > 0 || (entry.female?.length || 0) > 0);

    handleFilterChange(filteredChartData); // Call the filter function with the filtered data
});

// Display correct parameters  on hover on the chart
function getTooltipLabel(context) {
    const datasetLabel = context.dataset.label || '';
    const value = context.parsed.y || 0;
  
    // Get the displayed year and gender directly from the dataset label
    const yearRegex = /\d{4}/;
    const yearMatch = datasetLabel.match(yearRegex);
    const displayedYear = yearMatch ? yearMatch[0] : 'Year';
    const gender = datasetLabel.includes('Male') ? 'Male' : 'Female';
  
    // If data is not available for the selected year and gender, show the value only
    if (isNaN(value)) {
      return `${value.toFixed(2)}%`;
    }
  
    // Get the country name
    const country = filteredChartData[context.dataIndex].country;
  
    // Check if the data for the displayed year and gender is available
    const selectedYear = yearSelect.value;
    const selectedGender = genderSelect.value;
    const yearIndex = selectedYear !== 'all' ? selectedYear - 2019 : context.dataIndex;
    const isDataAvailable = filteredChartData[context.dataIndex][selectedGender.toLowerCase()][yearIndex] !== undefined;
  
    // If data is not available for the displayed year and gender, find the closest available year with data
    if (!isDataAvailable) {
      for (let i = yearIndex - 1; i >= 0; i--) {
        if (filteredChartData[context.dataIndex][selectedGender.toLowerCase()][i] !== undefined) {
          const closestYear = 2019 + i;
          return `${closestYear} - ${gender} in ${country}: No data available, closest data is ${value.toFixed(2)}% in ${displayedYear}`;
        }
      }
      for (let i = yearIndex + 1; i < filteredChartData[context.dataIndex][selectedGender.toLowerCase()].length; i++) {
        if (filteredChartData[context.dataIndex][selectedGender.toLowerCase()][i] !== undefined) {
          const closestYear = 2019 + i;
          return `${closestYear} - ${gender} in ${country}: No data available, closest data is ${value.toFixed(2)}% in ${displayedYear}`;
        }
      }
    }
  
    return `${displayedYear} - ${gender} in ${country}: ${value.toFixed(2)}%`;
  }

// Call the function to populate the "Type of Chart" filter options
document.addEventListener('DOMContentLoaded', async function() {
    await fetchDataAndProcessData(); 
    filterButton.addEventListener('click', handleFilterChange);
    // handleFilterChange();
    const initialChartTitle = 'Unemployment Rates for All Years and Genders';
    createLineChart(filteredData, initialChartTitle, 'line-chart');
    document.getElementById('chart-title').textContent = initialChartTitle;
});


