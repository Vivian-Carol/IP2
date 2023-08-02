date = new Date();
year = date.getFullYear();
month = date.getMonth() + 1;
day = date.getDate();
document.getElementById("current_date").innerHTML = month + "." + day + "." + year;

let myChart;
let uniqueDates;
let filledDatasets;

const getRandomColor = () => {
    return `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`;
};

async function getData() {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '7c52887264msh32f7388933da02ep11805djsn59cacfa1bd2b',
            'X-RapidAPI-Host': 'real-time-climate-index.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch('https://real-time-climate-index.p.rapidapi.com/api/climate-data', options);
        const result = await response.json();


        if (Array.isArray(result) && result.length > 0) {
            const datasetsToProcess = result;

            // Helper function to check if a dataset has valid structure
            const isValidDataset = dataset => {
                const dataObj = dataset[0].data;
                return (
                    dataObj &&
                    ((dataObj.outputs && dataObj.outputs.historical && dataObj.outputs.dateRange) ||
                        (dataObj.historical && dataObj.dateRange))
                );
            };

            // Filter out datasets with invalid structure
            const validDatasets = datasetsToProcess.filter(isValidDataset);

            if (validDatasets.length === 0) {
                console.log('No valid datasets found in the response.');
                return;
            }

            // Create a mapping of date to historical data values for each dataset
            const datasetsMapping = validDatasets.map(dataset => {
                const dataObj = dataset[0].data;
                const dateRange = dataObj.outputs ? dataObj.outputs.dateRange : dataObj.dateRange;
                const historicalData = dataObj.outputs ? dataObj.outputs.historical : dataObj.historical;
                const historicalDataMap = new Map();

                if (Array.isArray(dateRange)) {
                    dateRange.forEach(dateRangeItem => {
                        if (Array.isArray(dateRangeItem)) {
                            dateRangeItem.forEach(date => {
                                const timestamp = new Date(date).getTime();
                                const dateIndex = dateRange.findIndex(item => new Date(item).getTime() === timestamp);
                                if (dateIndex !== -1) {
                                    historicalDataMap.set(timestamp, historicalData[dateIndex]);
                                }
                            });
                        } else {
                            const timestamp = new Date(dateRangeItem).getTime();
                            historicalDataMap.set(timestamp, historicalData[dateRange.findIndex(item => new Date(item).getTime() === timestamp)]);
                        }
                    });
                } else {
                    const timestamp = new Date(dateRange).getTime();
                    historicalDataMap.set(timestamp, historicalData);
                }

                return historicalDataMap;
            });

            // Extract unique dates from all datasets
            let allDates = [];
            datasetsMapping.forEach(historicalDataMap => {
                historicalDataMap.forEach((value, date) => {
                    allDates.push(date);
                });
            });

            uniqueDates = Array.from(new Set(allDates)).sort();

            if (uniqueDates.length === 0) {
                console.log('No valid datasets found in the response.');
                return;
            }
            console.log('UniqueDates', uniqueDates);

            // Helper function to handle missing data by filling the gaps with a guesstimate value
            function handleMissingData(dataArray, datesArray) {
                // Calculate the average of non-null values in the dataArray
                const nonNullData = dataArray.filter(value => value !== null);
                const sumOfNonNullData = nonNullData.reduce((acc, value) => acc + value, 0);
                const average = sumOfNonNullData / nonNullData.length;

                const filledDataArray = datesArray.map(date => {
                    const dataIndex = uniqueDates.indexOf(date);
                    const dataValue = dataIndex !== -1 ? dataArray[dataIndex] : null;
                    return dataValue !== null ? dataValue : average;
                });
                return filledDataArray;
            }


            const datasets = validDatasets.map((dataset, index) => {
                const dataObj = dataset[0].data;
                const historicalDataMap = datasetsMapping[index];
                const metadata = dataObj.metadata;
                const name = dataset[0].metadata.name || 'Unknown Dataset';

                const historicalDataForDates = uniqueDates.map(date => {
                    const value = historicalDataMap.get(date);
                    return value === undefined ? null : value;
                });

                console.log('historicalDataForDates', historicalDataForDates);


                function getDatasetName(index) {
                    // Retrieve the dataset based on the datasetsMapping index
                    const dataObj = dataset[0].data;
                    const metadata = dataObj.metadata;
                    const name = dataset[0].metadata.name;

                    // Use the dataset name from the metadata if available, otherwise use a default name
                    return name || `Dataset ${index + 1}`;
                }

                return {
                    label: getDatasetName(index),
                    data: historicalDataForDates,
                    backgroundColor: getRandomColor(),
                    borderColor: getRandomColor(),
                    fill: false,
                };
            });

            // Handle missing data by filling the gaps with a guesstimate value
            filledDatasets = datasets.map(dataset => {
                const historicalDataForDates = handleMissingData(dataset.data, uniqueDates);
                return {
                    ...dataset,
                    data: historicalDataForDates,
                };
            });

            console.log('The filled datasets ', filledDatasets);


            // Function to format date in YYYY-MM-DD format
            function formatDate(date) {
                const year = String(date).slice(0, 4);
                const month = String(date).slice(4, 6).padStart(2, '0');
                const day = String(date).slice(6, 8).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }

            // Format the unique dates for displaying on the x-axis
            const formattedDates = uniqueDates.map(date => formatDate(date));

            console.log(formattedDates);


            if (uniqueDates) {
                const ctx = document.getElementById('myChart').getContext('2d');
                const myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: formattedDates,
                        datasets: filledDatasets,
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        title: {
                            display: true,
                            text: 'Multiple Line Graph',
                        },
                        scales: {
                            x: {
                                type: 'category', // Use category scale for x-axis (instead of time scale)
                                title: {
                                    display: true,
                                    text: 'Date Range',
                                },
                                ticks: {
                                    maxRotation: 45,
                                    minRotation: 45,
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Value',
                                },
                                ticks: {
                                    stepSize: 5,
                                }
                            },
                        },
                        plugins: {
                            legend: {
                                display: true,
                                align: 'centre',
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Real-time climate index',
                            }
                        },
                        elements: {
                            line: {
                                tension: 0.3, // Adjust the tension of the lines (0 = straight lines, 1 = curved lines)
                                borderJoinStyle: 'round', // Set the join style to round to connect lines smoothly
                            },
                        },
                    },
                });

                // Function to update the chart based on the selected dataset
                function updateChart(selectedDataset) {
                    if (selectedDataset === 'all') {
                        // If 'All Datasets' is selected, show all datasets
                        myChart.data.datasets = filledDatasets;
                    } else {
                        // If a specific dataset is selected, show only that dataset
                        const selectedDatasetObj = filledDatasets.find(dataset => dataset.label === selectedDataset);
                        if (selectedDatasetObj) {
                            myChart.data.datasets = [selectedDatasetObj];
                        } else {
                            // If the selected dataset is not found, show all datasets as a fallback
                            myChart.data.datasets = filledDatasets;
                        }
                    }
                    myChart.update();
                }

                // Event listener to handle radio button change
                const radioButtons = document.querySelectorAll('input[name="datasetFilter"]');
                radioButtons.forEach(radioButton => {
                    radioButton.addEventListener('change', event => {
                        const selectedDataset = event.target.value;
                        updateChart(selectedDataset);
                    });
                });
            }
        } else {
            console.log('Error: No datasets found in the response');
        }
    } catch (error) {
        console.error(error);
    }

    populateDatasetTable();

    function populateDatasetTable() {
        // Check if filledDatasets is defined
        if (!filledDatasets) {
            console.error('Filled datasets are not available.');
            return;
        }
        // Create a table to display the datasets
        const datasetTable = document.getElementById('datasetTable');

        // Extract years from the uniqueDates array
        const years = Array.from(new Set(uniqueDates.map(date => new Date(date).getFullYear()))).sort();

        // Create the table header row
        const headerRow = document.createElement('tr');
        const datasetHeader = document.createElement('th');
        datasetHeader.textContent = 'Dataset';
        headerRow.appendChild(datasetHeader);

        // Create header cells for each unique date (year-month-day)
        uniqueDates.forEach(date => {
            const headerCell = document.createElement('th');
            const formattedDate = formatDate(date);
            headerCell.textContent = formattedDate;
            headerRow.appendChild(headerCell);
        });

        datasetTable.appendChild(headerRow);

        // Group filledDatasets by dataset label
        const datasetsByLabel = filledDatasets.reduce((groupedDatasets, dataset) => {
            const label = dataset.label;
            if (!groupedDatasets[label]) {
                groupedDatasets[label] = [];
            }
            groupedDatasets[label].push(dataset);
            return groupedDatasets;
        }, {});

        // Iterate through the grouped datasets
        Object.entries(datasetsByLabel).forEach(([label, datasets]) => {
            const datasetRow = document.createElement('tr');

            // Create the dataset name cell
            const datasetNameCell = document.createElement('td');
            datasetNameCell.textContent = label;
            datasetRow.appendChild(datasetNameCell);

            // Create cells for each filled value within each date
            uniqueDates.forEach(date => {
                const dateValueCell = document.createElement('td');
                const dataIndex = uniqueDates.indexOf(date);
                if (dataIndex !== -1) {
                    // Display the filled value if available
                    const dataValue = datasets.map(dataset => dataset.data[dataIndex]);
                    const nonNullData = dataValue.filter(value => value !== null);
                    const average = nonNullData.reduce((acc, value) => acc + value, 0) / nonNullData.length;
                    const formattedValue = dataValue[dataValue.length - 1] !== null ? dataValue[dataValue.length - 1].toFixed(2) : average.toFixed(2);
                    dateValueCell.textContent = formattedValue;
                } else {
                    dateValueCell.textContent = 'N/A';
                }
                datasetRow.appendChild(dateValueCell);
            });

            datasetTable.appendChild(datasetRow);
        });
    }
}

getData();
