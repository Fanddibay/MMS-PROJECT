/* ============================================================
   PAGE: Edit Role (Permissions Editor)
   
   Checkbox counting and "Select All" logic for the
   role permission editor page.
   
   Dependencies: jQuery, components/sidebar.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    var sidebarCount = document.getElementById('sidebar-count');
    var headerCount = document.getElementById('header-count');
    var selectAllCb = document.getElementById('selectAllCheckbox');
    var permCheckboxes = document.querySelectorAll('.permission-checkbox');

    function updateCheckboxCounts() {
        var total = permCheckboxes.length;
        var checked = 0;

        permCheckboxes.forEach(function (cb) {
            if (cb.checked) checked++;
        });

        if (sidebarCount) {
            sidebarCount.textContent = '(' + checked + ')';
        }
        if (headerCount) {
            headerCount.textContent = '(' + checked + '/' + total + ' selected)';
        }

        // Update select all state
        if (selectAllCb) {
            selectAllCb.checked = (total > 0 && checked === total);
        }
    }

    // Individual checkbox change
    permCheckboxes.forEach(function (cb) {
        cb.addEventListener('change', updateCheckboxCounts);
    });

    // Select All
    if (selectAllCb) {
        selectAllCb.addEventListener('change', function () {
            var isChecked = selectAllCb.checked;
            permCheckboxes.forEach(function (cb) {
                cb.checked = isChecked;
            });
            updateCheckboxCounts();
        });
    }

    // Initialize count on page load
    updateCheckboxCounts();
});
