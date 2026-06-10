/* ============================================================
   COMPONENT: Modal Manager
   
   Reusable modal open/close logic with animation support.
   Used on: user-management, viewUser pages.
   
   Angular Migration: Becomes ModalService or MatDialog wrapper.
   ============================================================ */

/**
 * Open a modal by its overlay ID.
 * Expects the overlay to have a child with id="${overlayId}Content"
 * for the animation target.
 * 
 * @param {string} overlayId - The ID of the modal overlay element
 */
function openModal(overlayId) {
    var overlay = document.getElementById(overlayId);
    var content = document.getElementById(overlayId + 'Content');

    if (!overlay) return;

    overlay.classList.remove('hidden');
    overlay.classList.add('flex');

    if (content) {
        setTimeout(function () {
            content.classList.remove('scale-95', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
        }, 10);
    }
}

/**
 * Close a modal by its overlay ID.
 * 
 * @param {string} overlayId - The ID of the modal overlay element
 */
function closeModal(overlayId) {
    var overlay = document.getElementById(overlayId);
    var content = document.getElementById(overlayId + 'Content');

    if (!overlay) return;

    if (content) {
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-95', 'opacity-0');
    }

    setTimeout(function () {
        overlay.classList.remove('flex');
        overlay.classList.add('hidden');
    }, 300);
}
