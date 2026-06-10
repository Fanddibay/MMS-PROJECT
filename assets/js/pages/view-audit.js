/* ============================================================
   PAGE: View Audit (User Activity Detail)
   
   Interactive timeline view with dynamic filtering,
   date range searching, collapsing accordions, and exporting.
   
   Dependencies: Flatpickr
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    // ---- Audit Log Dataset ----
    const auditLogs = [
        {
            id: 1,
            isoTimestamp: '2026-05-05T12:52:01',
            displayTime: '12:52:01 PM',
            displayDate: '05 May 2026',
            displayMonth: 'May 2026',
            activity: 'Logged In',
            subtitle: '',
            status: 'Active',
            platform: 'Windows',
            ipAddress: '10.0.0.1',
            icon: 'fa-solid fa-user',
            iconColor: 'blue'
        },
        {
            id: 2,
            isoTimestamp: '2026-05-05T12:32:05',
            displayTime: '12:32:05 PM',
            displayDate: '05 May 2026',
            displayMonth: 'May 2026',
            activity: 'Account Unsuspended',
            subtitle: 'By USER3 (Admin)',
            status: 'Active',
            platform: 'Windows',
            ipAddress: '10.0.0.1',
            icon: 'fa-solid fa-check',
            iconColor: 'green'
        },
        {
            id: 3,
            isoTimestamp: '2026-05-05T12:00:03',
            displayTime: '12:00:03 PM',
            displayDate: '05 May 2026',
            displayMonth: 'May 2026',
            activity: 'Account Suspended',
            subtitle: 'By USER3 (Admin)',
            status: 'Inactive',
            platform: 'Windows',
            ipAddress: '10.0.0.1',
            justification: 'The account was suspended due to multiple violations of our guidelines.',
            icon: 'fa-solid fa-xmark',
            iconColor: 'red'
        },
        {
            id: 4,
            isoTimestamp: '2026-05-02T09:17:05',
            displayTime: '09:17:05 AM',
            displayDate: '02 May 2026',
            displayMonth: 'May 2026',
            activity: 'Logged Out',
            subtitle: '',
            status: 'Active',
            platform: 'Windows',
            ipAddress: '10.0.0.1',
            icon: 'fa-solid fa-user',
            iconColor: 'blue'
        },
        {
            id: 5,
            isoTimestamp: '2026-05-02T09:10:05',
            displayTime: '09:10:05 AM',
            displayDate: '02 May 2026',
            displayMonth: 'May 2026',
            activity: 'Add Data Layer',
            subtitle: '',
            status: 'Active',
            platform: 'Windows',
            ipAddress: '10.0.0.1',
            datalayers: 'INAWAVES (GRID) - Maximum Wave Height (hmax), Mean Wave Direction (dir), Mean Wavelength (lm)',
            icon: 'fa-solid fa-plus',
            iconColor: 'green'
        },
        {
            id: 6,
            isoTimestamp: '2026-05-02T09:00:01',
            displayTime: '09:00:01 AM',
            displayDate: '02 May 2026',
            displayMonth: 'May 2026',
            activity: 'Logged In',
            subtitle: '',
            status: 'Active',
            platform: 'Windows',
            ipAddress: '10.0.0.1',
            icon: 'fa-solid fa-user',
            iconColor: 'blue'
        },
        {
            id: 7,
            isoTimestamp: '2026-04-28T10:45:12',
            displayTime: '10:45:12 AM',
            displayDate: '28 April 2026',
            displayMonth: 'April 2026',
            activity: 'Profile modification',
            subtitle: '',
            status: 'Active',
            platform: 'macOS',
            ipAddress: '10.0.0.2',
            justification: 'Updated account email address to bmkg_user2@bmkg.go.id',
            icon: 'fa-solid fa-pen-to-square',
            iconColor: 'blue'
        },
        {
            id: 8,
            isoTimestamp: '2026-04-27T16:30:15',
            displayTime: '04:30:15 PM',
            displayDate: '27 April 2026',
            displayMonth: 'April 2026',
            activity: 'Logged In',
            subtitle: '',
            status: 'Active',
            platform: 'macOS',
            ipAddress: '10.0.0.2',
            icon: 'fa-solid fa-user',
            iconColor: 'blue'
        },
        {
            id: 9,
            isoTimestamp: '2026-04-24T11:15:00',
            displayTime: '11:15:00 AM',
            displayDate: '24 April 2026',
            displayMonth: 'April 2026',
            activity: 'Logged In',
            subtitle: '',
            status: 'Active',
            platform: 'Windows',
            ipAddress: '10.0.0.1',
            icon: 'fa-solid fa-user',
            iconColor: 'blue'
        },
        {
            id: 10,
            isoTimestamp: '2026-03-15T08:30:00',
            displayTime: '08:30:00 AM',
            displayDate: '15 March 2026',
            displayMonth: 'March 2026',
            activity: 'Logged In',
            subtitle: '',
            status: 'Active',
            platform: 'Windows',
            ipAddress: '10.0.0.1',
            icon: 'fa-solid fa-user',
            iconColor: 'blue'
        }
    ];

    // ---- Collapsed States Tracker (Matching Figma Mockup Default) ----
    const collapsedMonths = new Set(['March 2026']);
    const collapsedDates = new Set(['28 April 2026', '27 April 2026', '24 April 2026']);

    // ---- Filter States ----
    let searchQuery = '';
    let selectedStatus = '';
    let selectedDateRange = null; // [startDate, endDate]

    // Elements
    const timelineContainer = document.getElementById('timelineContainer');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const exportBtn = document.getElementById('exportBtn');

    // ---- Flatpickr Initialization ----
    if (typeof flatpickr !== 'undefined') {
        flatpickr('#dateRangePicker', {
            mode: 'range',
            dateFormat: 'd M Y',
            onChange: function (selectedDates) {
                if (selectedDates.length === 2) {
                    selectedDateRange = selectedDates;
                } else {
                    selectedDateRange = null;
                }
                filterAndRenderTimeline();
            }
        });
    }

    // ---- Event Listeners ----
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            searchQuery = e.target.value.toLowerCase().trim();
            filterAndRenderTimeline();
        });
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', function (e) {
            selectedStatus = e.target.value;
            filterAndRenderTimeline();
        });
    }

    if (exportBtn) {
        exportBtn.addEventListener('click', function () {
            const filtered = getFilteredLogs();
            if (filtered.length === 0) {
                alert('No data to export.');
                return;
            }
            
            // Generate CSV content
            let csvContent = 'data:text/csv;charset=utf-8,';
            csvContent += 'Timestamp,Status,Platform,IP Address,Activity,Details\r\n';
            
            filtered.forEach(log => {
                const details = log.justification || log.datalayers || log.subtitle || '';
                const row = [
                    `"${log.displayDate} ${log.displayTime}"`,
                    `"${log.status}"`,
                    `"${log.platform}"`,
                    `"${log.ipAddress}"`,
                    `"${log.activity}"`,
                    `"${details.replace(/"/g, '""')}"`
                ].join(',');
                csvContent += row + '\r\n';
            });
            
            // Trigger download
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', `BMKG_USER2_activity_log_${new Date().toISOString().slice(0,10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // ---- Filter Logic ----
    function getFilteredLogs() {
        return auditLogs.filter(log => {
            // 1. Search Query Check
            if (searchQuery) {
                const actMatches = log.activity.toLowerCase().includes(searchQuery);
                const platMatches = log.platform.toLowerCase().includes(searchQuery);
                const ipMatches = log.ipAddress.toLowerCase().includes(searchQuery);
                const subMatches = log.subtitle ? log.subtitle.toLowerCase().includes(searchQuery) : false;
                const justMatches = log.justification ? log.justification.toLowerCase().includes(searchQuery) : false;
                const layerMatches = log.datalayers ? log.datalayers.toLowerCase().includes(searchQuery) : false;
                
                if (!actMatches && !platMatches && !ipMatches && !subMatches && !justMatches && !layerMatches) {
                    return false;
                }
            }

            // 2. Status Check
            if (selectedStatus && log.status !== selectedStatus) {
                return false;
            }

            // 3. Date Range Check
            if (selectedDateRange) {
                const logDate = new Date(log.isoTimestamp);
                // Zero-out times for correct date-only comparison
                const start = new Date(selectedDateRange[0]);
                start.setHours(0, 0, 0, 0);
                const end = new Date(selectedDateRange[1]);
                end.setHours(23, 59, 59, 999);
                
                if (logDate < start || logDate > end) {
                    return false;
                }
            }

            return true;
        });
    }

    // ---- Render Timeline ----
    function filterAndRenderTimeline() {
        const filtered = getFilteredLogs();
        
        if (filtered.length === 0) {
            renderEmptyState();
            return;
        }

        // Group by Month, then by Date
        const grouped = {};
        filtered.forEach(log => {
            if (!grouped[log.displayMonth]) {
                grouped[log.displayMonth] = {};
            }
            if (!grouped[log.displayMonth][log.displayDate]) {
                grouped[log.displayMonth][log.displayDate] = [];
            }
            grouped[log.displayMonth][log.displayDate].push(log);
        });

        // Generate HTML
        let html = '';
        
        // Months sorted chronologically (May -> April -> March)
        const monthNames = Object.keys(grouped).sort((a, b) => {
            const dateA = new Date(grouped[a][Object.keys(grouped[a])[0]][0].isoTimestamp);
            const dateB = new Date(grouped[b][Object.keys(grouped[b])[0]][0].isoTimestamp);
            return dateB - dateA;
        });

        monthNames.forEach(month => {
            const isMonthCollapsed = collapsedMonths.has(month);
            const dates = grouped[month];
            
            html += `
                <div class="month-group mb-6" data-month="${month}">
                    <div class="month-header flex justify-between items-center py-3 ${isMonthCollapsed ? 'collapsed' : ''}" onclick="toggleMonth('${month}')">
                        <span class="month-title">${month}</span>
                        <i class="fa-solid fa-chevron-up chevron-icon"></i>
                    </div>
                    <div class="month-divider h-[1px] bg-gray-200 w-full mb-4"></div>
                    <div class="month-content ${isMonthCollapsed ? 'collapsed-content' : 'expanded-content'}">
            `;

            // Sort dates in descending order
            const dateKeys = Object.keys(dates).sort((a, b) => {
                return new Date(dates[b][0].isoTimestamp) - new Date(dates[a][0].isoTimestamp);
            });

            dateKeys.forEach(dateStr => {
                const isDateCollapsed = collapsedDates.has(dateStr);
                const logs = dates[dateStr];
                
                html += `
                    <div class="date-group mb-4" data-date="${dateStr}">
                        <div class="date-header flex justify-between items-center py-2 ${isDateCollapsed ? 'collapsed' : ''}" onclick="toggleDate('${dateStr}')">
                            <div class="date-title-container">
                                <span class="date-dot"></span>
                                <span class="date-title">${dateStr}</span>
                            </div>
                            <i class="fa-solid fa-chevron-up chevron-icon"></i>
                        </div>
                        <div class="date-content pl-2 md:pl-6 ${isDateCollapsed ? 'collapsed-content' : 'expanded-content'}">
                            <ul class="timeline-list">
                `;

                logs.forEach((log, index) => {
                    const isLast = index === logs.length - 1;
                    
                    // Determine icon styling
                    let iconStyleClass = 'timeline-icon-blue';
                    if (log.iconColor === 'green') iconStyleClass = 'timeline-icon-green';
                    if (log.iconColor === 'red') iconStyleClass = 'timeline-icon-red';

                    // Additional details rendering
                    let additionalHtml = '';
                    if (log.justification) {
                        additionalHtml = `
                            <div class="timeline-card-additional">
                                <span class="additional-label">Justification</span>
                                <span class="additional-value">${log.justification}</span>
                            </div>
                        `;
                    } else if (log.datalayers) {
                        additionalHtml = `
                            <div class="timeline-card-additional">
                                <span class="additional-label">Data Layer(s)</span>
                                <span class="additional-value">${log.datalayers}</span>
                            </div>
                        `;
                    }

                    // Subtitle rendering
                    const subtitleHtml = log.subtitle ? `<span class="timeline-card-subtitle">${log.subtitle}</span>` : '';

                    // Status badge rendering
                    const badgeClass = log.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive';
                    
                    html += `
                        <li class="timeline-item">
                            <!-- Timestamp -->
                            <div class="timeline-time">${log.displayTime}</div>
                            
                            <!-- Connector -->
                            <div class="timeline-connector">
                                <div class="timeline-icon-box ${iconStyleClass}">
                                    <i class="${log.icon} text-[15px]"></i>
                                </div>
                                ${!isLast ? '<div class="timeline-line"></div>' : ''}
                            </div>
                            
                            <!-- Content Card -->
                            <div class="timeline-card">
                                <div class="timeline-card-header">
                                    <div class="timeline-card-title-group">
                                        <h4 class="timeline-card-title">${log.activity}</h4>
                                        ${subtitleHtml}
                                    </div>
                                    <span class="status-badge ${badgeClass}">
                                        <span class="status-badge-dot"></span>
                                        ${log.status}
                                    </span>
                                </div>
                                
                                <div class="timeline-card-details">
                                    <div class="detail-item">
                                        <span class="detail-label">Platform</span>
                                        <span class="detail-value">${log.platform}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">IP Address</span>
                                        <span class="detail-value">${log.ipAddress}</span>
                                    </div>
                                </div>
                                
                                ${additionalHtml}
                            </div>
                        </li>
                    `;
                });

                html += `
                            </ul>
                        </div>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        });

        // Add "View Older Activities" Link at the bottom if not filtering
        if (!searchQuery && !selectedStatus && !selectedDateRange) {
            html += `
                <div class="flex justify-start pt-4">
                    <a href="javascript:void(0)" class="text-[#2563eb] hover:text-[#1d4ed8] font-semibold text-[14px] transition-colors" onclick="loadOlderActivities()">
                        View Older Activities
                    </a>
                </div>
            `;
        }

        timelineContainer.innerHTML = html;
    }

    // ---- Empty State Render ----
    function renderEmptyState() {
        timelineContainer.innerHTML = `
            <div class="timeline-empty-state">
                <i class="fa-solid fa-magnifying-glass timeline-empty-icon"></i>
                <h3 class="timeline-empty-title">No activities found</h3>
                <p class="timeline-empty-desc">Try adjusting your search terms or filters to find what you are looking for.</p>
            </div>
        `;
    }

    // ---- Accordion Toggle Handlers (Exposed globally for inline onclick) ----
    window.toggleMonth = function (monthName) {
        const monthGroup = document.querySelector(`.month-group[data-month="${monthName}"]`);
        if (!monthGroup) return;

        const header = monthGroup.querySelector('.month-header');
        const content = monthGroup.querySelector('.month-content');

        if (collapsedMonths.has(monthName)) {
            collapsedMonths.delete(monthName);
            header.classList.remove('collapsed');
            content.classList.remove('collapsed-content');
            content.classList.add('expanded-content');
        } else {
            collapsedMonths.add(monthName);
            header.classList.add('collapsed');
            content.classList.remove('expanded-content');
            content.classList.add('collapsed-content');
        }
    };

    window.toggleDate = function (dateStr) {
        const dateGroup = document.querySelector(`.date-group[data-date="${dateStr}"]`);
        if (!dateGroup) return;

        const header = dateGroup.querySelector('.date-header');
        const content = dateGroup.querySelector('.date-content');

        if (collapsedDates.has(dateStr)) {
            collapsedDates.delete(dateStr);
            header.classList.remove('collapsed');
            content.classList.remove('collapsed-content');
            content.classList.add('expanded-content');
        } else {
            collapsedDates.add(dateStr);
            header.classList.add('collapsed');
            content.classList.remove('expanded-content');
            content.classList.add('collapsed-content');
        }
    };

    // ---- Mock Load Older Activities ----
    window.loadOlderActivities = function () {
        alert('Older activities loaded successfully.');
    };

    // ---- Initial Render ----
    filterAndRenderTimeline();

});
