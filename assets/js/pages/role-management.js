/* ============================================================
   PAGE: Role Management
   
   DataTable setup for the roles list page.
   
   Dependencies: jQuery, DataTables,
                 components/data-table.js, components/sidebar.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    // ---- DataTable Initialization ----
    var table = initDataTable('#rolesTable', {
        showInfo: true,
        infoType: 'Roles',
        infoText: '_TOTAL_ Roles'
    });

    // ---- Custom Search ----
    attachSearch('#customSearch', table);

});
