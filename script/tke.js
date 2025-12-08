document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo biểu đồ
    initializeCharts();
});

function initializeCharts() {
    // Biểu đồ tròn - Phân bố theo tổ chức
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    const pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: ['Azone', 'LCCDCNPT'],
            datasets: [{
                data: [1, 3],
                backgroundColor: ['#4a6cff', '#ff7f7f']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'left',
                    labels: {
                        color: '#333',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    cornerRadius: 6
                }
            }
        }
    });

    // Biểu đồ cột - Sự kiện theo tháng
    const barCtx = document.getElementById('barChart').getContext('2d');
    const barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['1','2','3','4','5','6','7','8','9','10','11','12'],
            datasets: [{
                label: 'Số sự kiện',
                data: [0,0,2,0,0,1,0,1,0,0,0,0],
                backgroundColor: '#4a6cff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: '#666',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#666',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: '#333',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'rect'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    cornerRadius: 6
                }
            }
        }
    });

}

document.querySelector('.logout-btn').addEventListener('click', function() {
    localStorage.clear();
    window.location.href = 'index.html';
});
