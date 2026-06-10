/* ============================================================
   PAGE: Activity Log
   
   DataTable, Flatpickr date range, and column filters
   for the activity log page.
   
   Dependencies: jQuery, DataTables, Flatpickr,
                 components/data-table.js, components/sidebar.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    // ---- Flatpickr Date Range Picker ----
    if (typeof flatpickr !== 'undefined') {
        flatpickr('#dateRangePicker', {
            mode: 'range',
            dateFormat: 'd M Y'
        });
    }

    // ---- DataTable Initialization ----
    var table = initDataTable('#activityTable', {
        showInfo: true,
        infoType: 'Logs',
        infoText: '_TOTAL_ Activity Logs'
    });

    // ---- Custom Search ----
    attachSearch('#customSearch', table);

    // ---- Column Filters ----
    attachColumnFilter('#roleFilter', table, 1);
    attachColumnFilter('#statusFilter', table, 2);

});
