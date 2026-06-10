/* ============================================================
   PAGE: View User Details
   
   Modal handlers for delete/suspend account actions on
   the user detail page.
   
   Dependencies: jQuery, components/modal.js,
                 components/sidebar.js
   ============================================================ */

// ---- Modal State ----
var selectedUser = 'BMKG_USER1';

// ---- Delete Modal ----
function openDeleteModal(username) {
    selectedUser = username;
    openModal('deleteModal');
}

function closeDeleteModal() {
    closeModal('deleteModal');
}

function confirmDelete() {
    alert('User ' + selectedUser + ' has been deleted.');
    closeDeleteModal();
}

// ---- Suspend Modal ----
function openSuspendModal(username) {
    selectedUser = username;
    var justification = document.getElementById('suspendJustification');
    if (justification) justification.value = '';
    updateSuspendButtonState();
    openModal('suspendModal');
}

function closeSuspendModal() {
    closeModal('suspendModal');
}

function confirmSuspend() {
    alert('User ' + selectedUser + ' has been suspended.');
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

document.addEventListener('DOMContentLoaded', function () {
    var justification = document.getElementById('suspendJustification');
    if (justification) {
        justification.addEventListener('input', updateSuspendButtonState);
    }
});
