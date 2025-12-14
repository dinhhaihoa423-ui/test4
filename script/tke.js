document.addEventListener('DOMContentLoaded', function() {
    const API_BASE = 'https://test4-7cop.onrender.com';

    async function loadStats() {
        try {
            const res = await fetch(`${API_BASE}/api/stats`);
            if (!res.ok) throw new Error('Server lỗi');
            const data = await res.json();

            // Cập nhật các card số liệu
            document.querySelector('.card-purple .value').textContent = data.totalEvents;
            document.querySelector('.card-orange .value').textContent = data.pendingEvents;
            document.querySelector('.card-blue .value').textContent = data.pendingUgc;

            // Biểu đồ tròn - Phân bố theo tổ chức
            const pieCtx = document.getElementById('pieChart').getContext('2d');
            new Chart(pieCtx, {
                type: 'pie',
                data: {
                    labels: data.pieData.map(item => item.label),
                    datasets: [{
                        data: data.pieData.map(item => item.value),
                        backgroundColor: ['#4a6cff', '#ff7f7f', '#ffca28', '#4caf50', '#e91e63']
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
                                font: { size: 14, weight: 'bold' },
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
            new Chart(barCtx, {
                type: 'bar',
                data: {
                    labels: ['1','2','3','4','5','6','7','8','9','10','11','12'],
                    datasets: [{
                        label: 'Số sự kiện',
                        data: data.monthlyData,
                        backgroundColor: '#4a6cff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { stepSize: 1, color: '#666', font: { size: 12 } },
                            grid: { color: 'rgba(0, 0, 0, 0.1)' }
                        },
                        x: {
                            ticks: { color: '#666', font: { size: 12 } },
                            grid: { color: 'rgba(0, 0, 0, 0.1)' }
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom',
                            labels: { color: '#333', font: { size: 14, weight: 'bold' }, padding: 15 }
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

        } catch (err) {
            console.error('Lỗi load thống kê:', err);
            alert('Không thể kết nối server để lấy dữ liệu thống kê!');
        }
    }

    loadStats();
});

document.querySelector('.logout-btn').addEventListener('click', function() {
    localStorage.clear();
    window.location.href = 'index.html';
});
