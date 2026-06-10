/* ============================================================
   PAGE: Admin Dashboard
   
   Chart.js initialization and DataTable setup for the
   admin dashboard page.
   
   Dependencies: jQuery, Chart.js, DataTables,
                 components/data-table.js, components/sidebar.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    // ---- DataTable Initialization ----
    var table = initDataTable('#usersTable', {
        showInfo: true,
        infoType: 'Users',
        infoText: '_TOTAL_ Users',
        pageLength: 5
    });

    // ---- Custom Search ----
    attachSearch('#customSearch', table);

    // ---- Column Filters ----
    attachColumnFilter('#roleFilter', table, 2);
    attachColumnFilter('#statusFilter', table, 3);

    // ---- Line Chart: Total Visits ----
    var visitsEl = document.getElementById('visitsChart');
    if (visitsEl) {
        var ctxVisits = visitsEl.getContext('2d');

        var gradientBlue = ctxVisits.createLinearGradient(0, 0, 0, 400);
        gradientBlue.addColorStop(0, 'rgba(24, 33, 104, 0.2)');
        gradientBlue.addColorStop(1, 'rgba(24, 33, 104, 0)');

        new Chart(ctxVisits, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [
                    {
                        label: 'This year',
                        data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
                        borderColor: '#182168',
                        backgroundColor: gradientBlue,
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 0,
                        pointHoverRadius: 4
                    },
                    {
                        label: 'Last year',
                        data: [8000, 15000, 10000, 18000, 15000, 25000, 20000],
                        borderColor: '#93c5fd',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        tension: 0.4,
                        fill: false,
                        pointRadius: 0,
                        pointHoverRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        border: { display: false },
                        grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
                        ticks: {
                            color: 'rgba(0,0,0,0.4)',
                            font: { size: 11, family: 'Inter' },
                            callback: function (value) {
                                return value === 0 ? '0' : value / 1000 + 'K';
                            }
                        }
                    },
                    x: {
                        border: { display: false },
                        grid: { display: false, drawBorder: false },
                        ticks: {
                            color: 'rgba(0,0,0,0.4)',
                            font: { size: 11, family: 'Inter' }
                        }
                    }
                },
                interaction: { mode: 'nearest', axis: 'x', intersect: false }
            }
        });
    }

    // ---- Donut Chart: User Roles ----
    var rolesEl = document.getElementById('rolesChart');
    if (rolesEl) {
        var ctxRoles = rolesEl.getContext('2d');
        new Chart(ctxRoles, {
            type: 'doughnut',
            data: {
                labels: ['Registered User', 'Forecaster', 'Admin'],
                datasets: [{
                    data: [52.1, 22.8, 13.9],
                    backgroundColor: ['#313b9c', '#facc15', '#4ade80'],
                    borderWidth: 2,
                    borderColor: '#ffffff',
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return ' ' + context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }
});
