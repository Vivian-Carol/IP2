// Timed function
setTimeout(createCharts, 3000);

function createCharts() {

    // Main Graph
    const mainGraph = document.getElementById('mainGraph').getContext('2d');

    new Chart(mainGraph, {
        type: 'line',
        data: {
            labels: ['January', 'March', 'May', 'July', 'September', 'November'],
            datasets: [
                {
                    label: `${socialMedias[0]}`,
                    data: [
                        filteredResponse[2].interactions, filteredResponse[4].interactions, filteredResponse[6].interactions, filteredResponse[8].interactions, filteredResponse[10].interactions, filteredResponse[12].interactions
                    ],
                    backgroundColor: [
                        'rgb(241, 143, 1)'
                    ],
                    borderColor: 'rgb(241, 143, 1)',
                    borderWidth: 2,
                    hoverOffset: 5
                },
                {
                    label: `${socialMedias[1]}`,
                    data: [
                        filteredResponse[1].interactions, filteredResponse[39].interactions, filteredResponse[5].interactions, filteredResponse[7].interactions, filteredResponse[41].interactions, filteredResponse[13].interactions
                    ],
                    backgroundColor: [
                        'rgb(54, 162, 235)'
                    ],
                    borderColor: 'rgb(54, 162, 235)',
                    borderWidth: 2,
                    hoverOffset: 5
                },
                {
                    label: `${socialMedias[2]}`,
                    data: [
                        filteredResponse[14].interactions, filteredResponse[16].interactions, filteredResponse[18].interactions, filteredResponse[20].interactions, filteredResponse[22].interactions, filteredResponse[24].interactions
                    ],
                    backgroundColor: [
                        'rgb(113, 105, 105)'
                    ],
                    borderColor: 'rgb(113, 105, 105)',
                    borderWidth: 2,
                    hoverOffset: 5
                },
                {
                    label: `${socialMedias[3]}`,
                    data: [
                        filteredResponse[15].interactions, filteredResponse[17].interactions, filteredResponse[19].interactions, filteredResponse[21].interactions, filteredResponse[23].interactions, filteredResponse[25].interactions
                    ],
                    backgroundColor: [
                        'rgb(255, 0, 34)'
                    ],
                    borderColor: 'rgb(255, 0, 34)',
                    borderWidth: 2,
                    hoverOffset: 5
                },
                {
                    label: `${socialMedias[4]}`,
                    data: [
                        filteredResponse[26].interactions, filteredResponse[28].interactions, filteredResponse[30].interactions, filteredResponse[32].interactions, filteredResponse[34].interactions, filteredResponse[36].interactions
                    ],
                    backgroundColor: [
                        'rgb(23, 195, 178)'
                    ],
                    borderColor: 'rgb(23, 195, 178)',
                    borderWidth: 2,
                    hoverOffset: 5
                }
            ]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: `Comparison of the average number of interactions in the different famous social media apps.`
                }
            }
        }
    });

    // Sub Graph
    const subGraph1 = document.getElementById('subGraph1').getContext('2d');
    const subGraph2 = document.getElementById('subGraph2').getContext('2d');
    const subGraph3 = document.getElementById('subGraph3').getContext('2d');
    const subGraph4 = document.getElementById('subGraph4').getContext('2d');

    new Chart(subGraph1, {
        type: 'bar',
        data: {
            labels: [`Comparison Among Continents`],
            datasets: [
                {
                    label: `${continents[5]}`,
                    data: [
                        filteredResponse[21].interactions
                    ],
                    backgroundColor: [
                        'rgb(241, 143, 1)'
                    ],
                    borderWidth: 1,
                    hoverOffset: 5
                },
                {
                    label: `${continents[6]}`,
                    data: [
                        filteredResponse[35].interactions
                    ],
                    backgroundColor: [
                        'rgb(54, 162, 235)'
                    ],
                    borderWidth: 1,
                    hoverOffset: 5
                },
                {
                    label: `${continents[1]}`,
                    data: [
                        filteredResponse[8].interactions
                    ],
                    backgroundColor: [
                        'rgb(23, 195, 178)'
                    ],
                    borderWidth: 1,
                    hoverOffset: 5
                },
                {
                    label: `${continents[4]}`,
                    data: [
                        filteredResponse[1].interactions
                    ],
                    backgroundColor: [
                        'rgb(218, 65, 103)'
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

    new Chart(subGraph2, {
        type: 'bar',
        data: {
            labels: [`Comparison within Africa`],
            datasets: [
                {
                    label: `${africanCountries[0]}`,
                    data: [
                        filteredResponse[48].interactions
                    ],
                    backgroundColor: [
                        'rgb(241, 143, 1)'
                    ],
                    borderWidth: 1,
                    hoverOffset: 5
                },
                {
                    label: `${africanCountries[1]}`,
                    data: [
                        filteredResponse[27].interactions
                    ],
                    backgroundColor: [
                        'rgb(54, 162, 235)'
                    ],
                    borderWidth: 1,
                    hoverOffset: 5
                },
                {
                    label: `${africanCountries[2]}`,
                    data: [
                        filteredResponse[29].interactions
                    ],
                    backgroundColor: [
                        'rgb(23, 195, 178)'
                    ],
                    borderWidth: 1,
                    hoverOffset: 5
                },
                {
                    label: `${africanCountries[3]}`,
                    data: [
                        filteredResponse[14].interactions
                    ],
                    backgroundColor: [
                        'rgb(218, 65, 103)'
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

    new Chart(subGraph3, {
        type: 'pie',
        data: {
            labels: [`${famousBrands[0]}`, `${famousBrands[1]}`, `${famousBrands[2]}`, `${famousBrands[3]}`],
            datasets: [
                {
                    label: "Famous Brands",
                    data: [
                        filteredResponse[48].interactions, filteredResponse[27].interactions, filteredResponse[9].interactions, filteredResponse[36].interactions
                    ],
                    backgroundColor: [
                        'rgb(241, 143, 1)', 'rgb(54, 162, 235)', 'rgb(23, 195, 178)', 'rgb(218, 65, 103)'
                    ],
                    borderWidth: 1,
                    hoverOffset: 5
                },
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `Comparison of the average number of interactions on different Instagram posts in different continents.`
                }
            }
        }
    });

    new Chart(subGraph4, {
        type: 'bar',
        data: {
            labels: [`Comparison among influencer categories`],
            datasets: [
                {
                    label: `${socialMediaCategories[0]}`,
                    data: [
                        filteredResponse[7].interactions
                    ],
                    backgroundColor: [
                        'rgb(241, 143, 1)'
                    ],
                    borderWidth: 1,
                    hoverOffset: 5
                },
                {
                    label: `${socialMediaCategories[1]}`,
                    data: [
                        filteredResponse[19].interactions
                    ],
                    backgroundColor: [
                        'rgb(54, 162, 235)'
                    ],
                    borderWidth: 1,
                    hoverOffset: 5
                },
                {
                    label: `${socialMediaCategories[2]}`,
                    data: [
                        filteredResponse[31].interactions
                    ],
                    backgroundColor: [
                        'rgb(23, 195, 178)'
                    ],
                    borderWidth: 1,
                    hoverOffset: 5
                },
                {
                    label: `${socialMediaCategories[3]}`,
                    data: [
                        filteredResponse[46].interactions
                    ],
                    backgroundColor: [
                        'rgb(218, 65, 103)'
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
                    text: `Comparison of the average number of interactions for different influencr categories.`
                }
            }
        }
    });

}   