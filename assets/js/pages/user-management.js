/* ============================================================
   PAGE: User Management
   
   DataTable setup, delete/suspend modal handlers.
   
   Dependencies: jQuery, DataTables,
                 components/data-table.js, components/modal.js,
                 components/sidebar.js
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

});

// ---- Delete Modal Logic ----
var deleteTargetUser = '';

function openDeleteModal(username) {
    deleteTargetUser = username;
    openModal('deleteModal');
}

function closeDeleteModal() {
    closeModal('deleteModal');
}

function confirmDelete() {
    alert('User ' + deleteTargetUser + ' has been deleted.');
    closeDeleteModal();
}

// ---- Suspend Modal Logic ----
var suspendTargetUser = '';

function openSuspendModal(username) {
    suspendTargetUser = username;
    var justification = document.getElementById('suspendJustification');
    if (justification) justification.value = '';
    updateSuspendButtonState();
    openModal('suspendModal');
}

function closeSuspendModal() {
    closeModal('suspendModal');
}

function confirmSuspend() {
    alert('User ' + suspendTargetUser + ' has been suspended.');
    closeSuspendModal();
}

function updateSuspendButtonState() {
    var input = document.getElementById('suspendJustification');
    var btn = document.getElementById('confirmSuspendBtn');
    if (!input || !btn) return;

    if (input.value.trim().length > 0) {
        btn.disabled = false;
        btn.classList.remove('bg-[#d9d9d9]', 'text-[#b3b3b3]', 'cursor-not-allowed');
        btn.classList.add('bg-[#1a4999]', 'text-white', 'hover:bg-[#153a7a]', 'cursor-pointer');
    } else {
        btn.disabled = true;
        btn.classList.add('bg-[#d9d9d9]', 'text-[#b3b3b3]', 'cursor-not-allowed');
        btn.classList.remove('bg-[#1a4999]', 'text-white', 'hover:bg-[#153a7a]', 'cursor-pointer');
    }
}

// Attach suspend justification input listener
document.addEventListener('DOMContentLoaded', function () {
    var justification = document.getElementById('suspendJustification');
    if (justification) {
        justification.addEventListener('input', updateSuspendButtonState);
    }
});
