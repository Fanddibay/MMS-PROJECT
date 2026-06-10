/* ============================================================
   COMPONENT: Sidebar Toggle
   
   Manages sidebar menu expand/collapse, mobile drawer,
   and active nav state based on the current page.
   ============================================================ */

const SIDEBAR_MGMT_OPEN_HEIGHT = '100px';

/**
 * Resolve which nav item should be active from the current URL.
 * @returns {{ section: string|null, sub: string|null, expandManagement: boolean }}
 */
function getSidebarNavState() {
    const file = (window.location.pathname.split('/').pop() || '').toLowerCase();

    if (file === 'dashboard.html') {
        return { section: 'dashboard', sub: null, expandManagement: false };
    }

    if (file === 'activity-log.html' || file === 'view-audit.html') {
        return { section: 'activity-log', sub: null, expandManagement: false };
    }

    const userPages = [
        'user-management.html',
        'new-user.html',
        'edit-user.html',
        'viewuser.html',
    ];
    if (userPages.includes(file)) {
        return { section: 'management', sub: 'user-management', expandManagement: true };
    }

    const rolePages = [
        'role-management.html',
        'view-role-management.html',
        'edit-role-management.html',
    ];
    if (rolePages.includes(file)) {
        return { section: 'management', sub: 'role-management', expandManagement: true };
    }

    return { section: null, sub: null, expandManagement: false };
}

/**
 * @param {HTMLElement} el
 */
function clearSidebarNavActive(el) {
    if (!el) return;
    el.classList.remove('bg-[#1a4999]', 'bg-white/5', 'rounded-[8px]');
}

/**
 * @param {boolean} expanded
 * @param {HTMLElement|null} subMenu
 * @param {HTMLElement|null} icon
 */
function setManagementExpanded(expanded, subMenu, icon) {
    if (!subMenu) return;

    if (expanded) {
        subMenu.style.maxHeight = SIDEBAR_MGMT_OPEN_HEIGHT;
        subMenu.style.marginTop = '12px';
        if (icon) {
            icon.classList.remove('fa-plus');
            icon.classList.add('fa-minus');
        }
    } else {
        subMenu.style.maxHeight = '0px';
        subMenu.style.marginTop = '0px';
        if (icon) {
            icon.classList.remove('fa-minus');
            icon.classList.add('fa-plus');
        }
    }
}

/**
 * @returns {boolean}
 */
function isManagementSubMenuOpen(subMenu) {
    if (!subMenu) return false;
    const maxHeight = subMenu.style.maxHeight;
    if (maxHeight === '0px' || maxHeight === '0') return false;
    return subMenu.scrollHeight > 0 && subMenu.offsetHeight > 0;
}

/**
 * Apply correct active styles and expand/collapse Management from current page.
 */
function initSidebarActiveState() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const state = getSidebarNavState();
    const dashboardLink = sidebar.querySelector('a[href="dashboard.html"]');
    const activityLink = sidebar.querySelector('a[href="activity-log.html"]');
    const roleLink = sidebar.querySelector('a[href="role-management.html"]');
    const userLink = sidebar.querySelector('a[href="user-management.html"]');
    const mgmtToggle = document.getElementById('managementToggle');
    const subMenu = document.getElementById('managementSubMenu');
    const icon = document.getElementById('managementIcon');

    [dashboardLink, activityLink, roleLink, userLink, mgmtToggle].forEach(clearSidebarNavActive);

    if (state.section === 'dashboard' && dashboardLink) {
        dashboardLink.classList.add('bg-[#1a4999]');
    }

    if (state.section === 'activity-log' && activityLink) {
        activityLink.classList.add('bg-[#1a4999]');
    }

    if (state.section === 'management') {
        if (mgmtToggle) mgmtToggle.classList.add('bg-white/5');
        if (state.sub === 'role-management' && roleLink) {
            roleLink.classList.add('bg-[#1a4999]', 'rounded-[8px]');
        }
        if (state.sub === 'user-management' && userLink) {
            userLink.classList.add('bg-[#1a4999]', 'rounded-[8px]');
        }
    }

    setManagementExpanded(state.expandManagement, subMenu, icon);
}

/**
 * Initialize the sidebar management submenu toggle.
 */
function initSidebarToggle() {
    const toggle = document.getElementById('managementToggle');
    const subMenu = document.getElementById('managementSubMenu');
    const icon = document.getElementById('managementIcon');

    if (!toggle || !subMenu || !icon) return;

    toggle.addEventListener('click', function () {
        const isOpen = isManagementSubMenuOpen(subMenu);
        setManagementExpanded(!isOpen, subMenu, icon);

        if (!isOpen) {
            toggle.classList.add('bg-white/5');
        } else {
            const state = getSidebarNavState();
            if (state.section !== 'management') {
                toggle.classList.remove('bg-white/5');
            }
        }
    });
}

/**
 * Initialize the mobile sidebar drawer.
 */
function initMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    const menuBtn = document.getElementById('mobileMenuBtn');

    if (!sidebar || !backdrop) return;

    let isOpen = false;

    function toggleSidebar() {
        isOpen = !isOpen;
        if (isOpen) {
            sidebar.classList.remove('-translate-x-full');
            backdrop.classList.remove('hidden');
            setTimeout(function () {
                backdrop.classList.remove('opacity-0');
            }, 10);
        } else {
            sidebar.classList.add('-translate-x-full');
            backdrop.classList.add('opacity-0');
            setTimeout(function () {
                backdrop.classList.add('hidden');
            }, 300);
        }
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', toggleSidebar);
    }
    backdrop.addEventListener('click', toggleSidebar);
}

document.addEventListener('DOMContentLoaded', function () {
    initSidebarActiveState();
    initSidebarToggle();
    initMobileSidebar();
});
