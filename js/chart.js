// Timed function
setTimeout(createCharts, 2500);

function createCharts() {

    // Main Graph
    const mainGraph = document.getElementById('mainGraph').getContext('2d');

    new Chart(mainGraph, {
        type: 'line',
        data: {
            labels: [`dfmfgmbnd`, `shgjhmkfgm`],
            datasets: [
                {
                    label: `${continents[0]}`,
                    data: [
                        filteredResponse[0].interactions
                    ],
                    backgroundColor: [
                        'rgb(241, 143, 1)'
                    ],
                    borderWidth: 1,
                    hoverOffset: 5
                },
                {
                    label: `${continents[1]}`,
                    data: [
                        filteredResponse[1].interactions
                    ],
                    backgroundColor: [
                        'rgb(54, 162, 235)'
                    ],
                    borderWidth: 1,
                    hoverOffset: 5
                },
                {
                    label: `${continents[2]}`,
                    data: [
                        filteredResponse[2].interactions
                    ],
                    backgroundColor: [
                        'rgb(241, 143, 1)'
                    ],
                    borderWidth: 1,
                    hoverOffset: 5
                },
                {
                    label: `${continents[3]}`,
                    data: [
                        filteredResponse[3].interactions
                    ],
                    backgroundColor: [
                        'rgb(54, 162, 235)'
                    ],
                    borderWidth: 1,
                    hoverOffset: 5
                }
            ]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: `Comparison of the average number of interactions on different Instagram posts in different continents.`
                }
            }
        }
    });

    // Sub Graph
    const subGraph1 = document.getElementById('subGraph1').getContext('2d');

    new Chart(subGraph1, {
        type: 'line',
        data: {
            labels: [`dfmfgmbnd`, `shgjhmkfgm`],
            datasets: [
                {
                    label: `${continents[0]}`,
                    data: [
                        filteredResponse[0].interactions
                    ],
                    backgroundColor: [
                        'rgb(241, 143, 1)'
                    ],
                    borderWidth: 1,
                    hoverOffset: 5
                },
                {
                    label: `${continents[1]}`,
                    data: [
                        filteredResponse[1].interactions
                    ],
                    backgroundColor: [
                        'rgb(54, 162, 235)'
                    ],
                    borderWidth: 1,
                    hoverOffset: 5
                },
                {
                    label: `${continents[2]}`,
                    data: [
                        filteredResponse[2].interactions
                    ],
                    backgroundColor: [
                        'rgb(241, 143, 1)'
                    ],
                    borderWidth: 1,
                    hoverOffset: 5
                },
                {
                    label: `${continents[3]}`,
                    data: [
                        filteredResponse[3].interactions
                    ],
                    backgroundColor: [
                        'rgb(54, 162, 235)'
                    ],
                    borderWidth: 1,
                    hoverOffset: 5
                }
            ]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: `Comparison of the average number of interactions on different Instagram posts in different continents.`
                }
            }
        }
    });

}   