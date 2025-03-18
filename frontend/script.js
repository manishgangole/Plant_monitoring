const API_ENDPOINT = 'http://localhost:8000/data'; // Your FastAPI endpoint

// Chart setup
const ctx = document.getElementById('sensor-chart').getContext('2d');
const chartData = {
    labels: [],
    datasets: [
        { label: 'Temperature (°C)', data: [], borderColor: '#26a69a', fill: false },
        { label: 'Moisture (%)', data: [], borderColor: '#ffca28', fill: false },
        { label: 'Humidity (%)', data: [], borderColor: '#ef5350', fill: false }
    ]
};
const chart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
        responsive: true,
        scales: {
            y: { beginAtZero: true, max: 100 },
            x: { ticks: { maxTicksLimit: 10 } }
        },
        plugins: { legend: { labels: { color: '#e0e6ed' } } }
    }
});

async function fetchData() {
    const statusEl = document.getElementById('status');
    statusEl.textContent = 'Fetching Data...';
    statusEl.classList.add('loading');

    try {
        const response = await fetch(API_ENDPOINT);
        const data = await response.json();

        // Update current values
        document.getElementById('temperature').textContent = data.temp.toFixed(1);
        document.getElementById('moisture').textContent = data.moisture.toFixed(1);
        document.getElementById('humidity').textContent = data.humidity.toFixed(1);

        // Update chart
        const timestamp = new Date(data.date_time).toLocaleTimeString();
        chartData.labels.push(timestamp);
        chartData.datasets[0].data.push(data.temp);
        chartData.datasets[1].data.push(data.moisture);
        chartData.datasets[2].data.push(data.humidity);

        if (chartData.labels.length > 10) { // Keep last 10 points
            chartData.labels.shift();
            chartData.datasets.forEach(dataset => dataset.data.shift());
        }
        chart.update();

        // Update status
        updateStatus(data);

        // Animation
        document.querySelectorAll('.data-value').forEach(el => {
            el.style.animation = 'fadeIn 0.5s ease';
            setTimeout(() => el.style.animation = '', 500);
        });

        statusEl.classList.remove('loading');
    } catch (error) {
        console.error('Error:', error);
        statusEl.textContent = 'Error fetching data';
        statusEl.classList.remove('loading');
    }
}

function updateStatus(data) {
    const statusEl = document.getElementById('status');
    let status = 'Plant is Healthy';
    let bgColor = 'rgba(38, 166, 154, 0.1)'; // Teal

    if (data.temp < 18 || data.temp > 28) {
        status = 'Temperature Alert!';
        bgColor = 'rgba(239, 83, 80, 0.1)'; // Red
    } else if (data.moisture < 30) {
        status = 'Needs Water!';
        bgColor = 'rgba(255, 167, 38, 0.1)'; // Orange
    } else if (data.humidity < 40) {
        status = 'Low Humidity!';
        bgColor = 'rgba(255, 202, 40, 0.1)'; // Yellow
    }

    const timestamp = new Date(data.date_time).toLocaleTimeString();
    statusEl.textContent = `${status} (Last Updated: ${timestamp})`;
    statusEl.style.background = bgColor;
}

// Initial fetch and auto-refresh every 10 seconds
fetchData();
setInterval(fetchData, 10000);

// Card hover effect
const card = document.querySelector('.plant-card');
card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(38, 166, 154, 0.15), rgba(40, 54, 61, 0.95))`;
});

card.addEventListener('mouseleave', () => {
    card.style.background = 'rgba(40, 54, 61, 0.95)';
});