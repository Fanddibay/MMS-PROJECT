/* ============================================================
   PAGE MODULE: View Role Management
   
   Handles the view-only UI for role permissions and tabs.
   Dependencies: jQuery, assets/js/components/sidebar.js
   
   Angular Migration: Extract into ViewRoleComponent.
   ============================================================ */

$(document).ready(function() {
    function initPermTableScrollHint() {
        const wrap = document.querySelector('.perm-table-scroll-wrap');
        const scroll = document.querySelector('.perm-table-scroll');
        if (!wrap || !scroll) return;

        const update = () => {
            const canScroll = scroll.scrollWidth > scroll.clientWidth + 2;
            const atEnd = scroll.scrollLeft + scroll.clientWidth >= scroll.scrollWidth - 2;
            wrap.classList.toggle('can-scroll-right', canScroll && !atEnd);
        };

        const hint = wrap.querySelector('.perm-scroll-hint');
        scroll.addEventListener('scroll', () => {
            update();
            if (scroll.scrollLeft > 4) hint?.classList.add('is-dismissed');
        }, { passive: true });
        window.addEventListener('resize', update);
        update();
    }

    function scrollActiveCategoryIntoView() {
        const active = document.querySelector('.perm-cat-btn.active');
        if (active) {
            active.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'auto' });
        }
    }

    // Tab Switching Logic
    $('#tabUsers').on('click', function() {
        $(this).addClass('text-[#1a4999] border-[#1a4999]').removeClass('text-[#a1a1aa] border-transparent');
        $('#tabPermissions').addClass('text-[#a1a1aa] border-transparent').removeClass('text-[#1a4999] border-[#1a4999]');
        $('#contentUsers').removeClass('hidden').addClass('block');
        $('#contentPermissions').removeClass('block').addClass('hidden');
    });

    $('#tabPermissions').on('click', function() {
        $(this).addClass('text-[#1a4999] border-[#1a4999]').removeClass('text-[#a1a1aa] border-transparent');
        $('#tabUsers').addClass('text-[#a1a1aa] border-transparent').removeClass('text-[#1a4999] border-[#1a4999]');
        $('#contentPermissions').removeClass('hidden').addClass('block');
        $('#contentUsers').removeClass('block').addClass('hidden');
        
        // Load default category if not loaded
        if ($('#permissionsBody').children().length === 0) {
            loadPermissions('general');
        }
        requestAnimationFrame(initPermTableScrollHint);
    });

    // Permissions Category Logic
    let currentCategory = 'general';
    const permissionsData = {
        general: {
            title: "General Permissions",
            items: [
                { name: "Notifications and Alerts", read: true, write: true, delete: true },
                { name: "Dynamic Presentation Mode", read: true, write: true, delete: false },
                { name: "Report Generation", read: true, write: true, delete: false }
            ]
        },
        inaflow: {
            title: "INAFLOW",
            items: [
                { name: "Model Configuration", read: true, write: true, delete: false },
                { name: "Data Ingestion", read: true, write: true, delete: true },
                { name: "Simulation Runner", read: true, write: false, delete: false }
            ]
        },
        inawaves: {
            title: "INAWAVES",
            items: [
                { name: "Wave Analysis", read: true, write: true, delete: true },
                { name: "Swell Monitoring", read: true, write: true, delete: false }
            ]
        },
        ofs: {
            title: "OFS IND (INAWAVES)",
            items: [
                { name: "OFS Configuration", read: true, write: false, delete: false },
                { name: "Grid Export", read: true, write: true, delete: false }
            ]
        },
        vessel: {
            title: "Vessel AWS (POINT)",
            items: [
                { name: "Vessel Tracking", read: true, write: true, delete: false },
                { name: "Point Data Access", read: true, write: false, delete: false }
            ]
        }
    };

    function loadPermissions(catKey) {
        currentCategory = catKey;
        const data = permissionsData[catKey] || permissionsData.general;
        $('#currentCatTitle').text(data.title);

        const body = $('#permissionsBody');
        body.empty();

        data.items.forEach((item, rowIndex) => {
            const row = $(`
                <tr class="${rowIndex % 2 === 0 ? 'bg-white' : 'bg-alt'}">
                    <td class="perm-col-name">${item.name}</td>
                    <td class="perm-col-action perm-cell" data-row="${rowIndex}" data-type="read" data-state="${item.read}">
                        ${renderCheckbox(item.read)}
                    </td>
                    <td class="perm-col-action perm-cell" data-row="${rowIndex}" data-type="write" data-state="${item.write}">
                        ${renderCheckbox(item.write)}
                    </td>
                    <td class="perm-col-action perm-cell" data-row="${rowIndex}" data-type="delete" data-state="${item.delete}">
                        ${renderCheckbox(item.delete)}
                    </td>
                </tr>
            `);
            body.append(row);
        });
        updateStats();
        requestAnimationFrame(initPermTableScrollHint);
    }

    function renderCheckbox(checked) {
        if (checked === true || checked === 'true') {
            return `<div class="flex justify-center items-center"><i class="fa-solid fa-check text-[#1a4999] text-[16px]"></i></div>`;
        } else {
            return `<div class="flex justify-center items-center"><i class="fa-solid fa-xmark text-[#a1a1aa] text-[16px]"></i></div>`;
        }
    }

    // Cell click events are disabled since this is a view-only screen

    function updateStats() {
        const data = permissionsData[currentCategory];
        const total = data.items.length * 3;
        let selected = 0;
        
        data.items.forEach(item => {
            if (item.read) selected++;
            if (item.write) selected++;
            if (item.delete) selected++;
        });

        // Update Main Panel Header
        $('#currentCatStats').text(`(${selected}/${total} selected)`);
        
        // Update Sidebar Count for current category
        $(`.perm-cat-btn[data-category="${currentCategory}"] span:first-child`).text(`(${selected})`);
    }

    function initializeSidebarCounts() {
        Object.keys(permissionsData).forEach(catKey => {
            const data = permissionsData[catKey];
            let selected = 0;
            data.items.forEach(item => {
                if (item.read) selected++;
                if (item.write) selected++;
                if (item.delete) selected++;
            });
            $(`.perm-cat-btn[data-category="${catKey}"] span:first-child`).text(`(${selected})`);
        });
    }

    $('.perm-cat-btn').on('click', function() {
        $('.perm-cat-btn').removeClass('active');
        $(this).addClass('active');
        const cat = $(this).data('category');
        loadPermissions(cat);
        scrollActiveCategoryIntoView();
    });

    // Initial load (permissions data ready when user opens tab)
    initializeSidebarCounts();
    loadPermissions('general');
    initPermTableScrollHint();
});
