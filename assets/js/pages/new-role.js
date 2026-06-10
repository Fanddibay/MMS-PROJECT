/* ============================================================
   PAGE MODULE: New Role Creation
   
   Manages interactive category switching, dynamic checking/counting,
   and visual states.
   
   Dependencies: jQuery, assets/js/components/sidebar.js
   ============================================================ */

$(document).ready(function() {
    // Dynamic database of permissions and their state
    const permissionsData = {
        general: {
            title: "General Permissions",
            items: [
                { id: "gen_notif", name: "Notifications and Alerts", read: false, write: false, delete: false },
                { id: "gen_pres", name: "Dynamic Presentation Mode", read: false, write: false, delete: false },
                { id: "gen_report", name: "Report Generation", read: false, write: false, delete: false }
            ]
        },
        inaflow: {
            title: "INAFLOW",
            items: [
                { id: "inaflow_config", name: "Model Configuration", read: false, write: false, delete: false },
                { id: "inaflow_ingest", name: "Data Ingestion", read: false, write: false, delete: false },
                { id: "inaflow_runner", name: "Simulation Runner", read: false, write: false, delete: false }
            ]
        },
        inawaves: {
            title: "INAWAVES",
            items: [
                { id: "inawaves_analysis", name: "Wave Analysis", read: false, write: false, delete: false },
                { id: "inawaves_monitoring", name: "Swell Monitoring", read: false, write: false, delete: false }
            ]
        },
        ofs: {
            title: "OFS IND (INAWAVES)",
            items: [
                { id: "ofs_config", name: "OFS Configuration", read: false, write: false, delete: false },
                { id: "ofs_export", name: "Grid Export", read: false, write: false, delete: false }
            ]
        },
        vessel: {
            title: "Vessel AWS (POINT)",
            items: [
                { id: "vessel_track", name: "Vessel Tracking", read: false, write: false, delete: false },
                { id: "vessel_data", name: "Point Data Access", read: false, write: false, delete: false }
            ]
        },
        marine: {
            title: "Marine AWS (POINT)",
            items: [
                { id: "marine_track", name: "Marine Tracking", read: false, write: false, delete: false },
                { id: "marine_data", name: "AWS Data Export", read: false, write: false, delete: false }
            ]
        },
        float_arvor_c: {
            title: "Float ARVOR-C (POINT)",
            items: [
                { id: "float_arvor_c_view", name: "Float Data View", read: false, write: false, delete: false },
                { id: "float_arvor_c_edit", name: "Float Calibration", read: false, write: false, delete: false }
            ]
        },
        float_arvor_i: {
            title: "Float ARVOR-I (POINT)",
            items: [
                { id: "float_arvor_i_view", name: "Float Calibration & View", read: false, write: false, delete: false }
            ]
        },
        ocean_drifter: {
            title: "Ocean Drifter (POINT)",
            items: [
                { id: "ocean_drifter_track", name: "Ocean Drifter Tracking", read: false, write: false, delete: false }
            ]
        },
        local_radar: {
            title: "Local Radar Imagery (GRID)",
            items: [
                { id: "local_radar_raw", name: "Raw Radar Stream", read: false, write: false, delete: false },
                { id: "local_radar_post", name: "Post Processed Imagery", read: false, write: false, delete: false }
            ]
        },
        himawari: {
            title: "Himawari Cloud - Raw 16",
            items: [
                { id: "himawari_raw", name: "Raw Cloud Channel", read: false, write: false, delete: false }
            ]
        }
    };

    let currentCategory = 'general';

    // Initialize Scroll Hint on tablet/mobile views
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
            active.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' });
        }
    }

    function loadPermissions(catKey) {
        currentCategory = catKey;
        const data = permissionsData[catKey] || permissionsData.general;
        
        // Update Title & Count
        $('#currentCatTitle').text(data.title);

        const body = $('#permissionsBody');
        body.empty();

        data.items.forEach((item, index) => {
            const rowHtml = `
                <tr class="${index % 2 === 0 ? 'bg-white' : 'bg-alt'}">
                    <td class="perm-col-name font-medium">${item.name}</td>
                    <td class="perm-col-action">
                        <label class="custom-checkbox-container">
                            <input type="checkbox" class="perm-cb" data-item-id="${item.id}" data-type="read" ${item.read ? 'checked' : ''}>
                            <span class="checkbox-checkmark"></span>
                        </label>
                    </td>
                    <td class="perm-col-action">
                        <label class="custom-checkbox-container">
                            <input type="checkbox" class="perm-cb" data-item-id="${item.id}" data-type="write" ${item.write ? 'checked' : ''}>
                            <span class="checkbox-checkmark"></span>
                        </label>
                    </td>
                    <td class="perm-col-action">
                        <label class="custom-checkbox-container">
                            <input type="checkbox" class="perm-cb" data-item-id="${item.id}" data-type="delete" ${item.delete ? 'checked' : ''}>
                            <span class="checkbox-checkmark"></span>
                        </label>
                    </td>
                </tr>
            `;
            body.append(rowHtml);
        });

        updateSelectAllState();
        updateCategoryStats();
        initPermTableScrollHint();
    }

    function updateCategoryStats() {
        const data = permissionsData[currentCategory];
        const total = data.items.length * 3;
        let selected = 0;

        data.items.forEach(item => {
            if (item.read) selected++;
            if (item.write) selected++;
            if (item.delete) selected++;
        });

        // Header statistics
        $('#currentCatStats').text(`(${selected}/${total} selected)`);

        // Update navigation button badge
        const navBtnBadge = $(`.perm-cat-btn[data-category="${currentCategory}"] span:first-child`);
        navBtnBadge.text(`(${selected})`);
    }

    function updateSelectAllState() {
        const data = permissionsData[currentCategory];
        let allChecked = true;
        let anyItems = data.items.length > 0;

        data.items.forEach(item => {
            if (!item.read || !item.write || !item.delete) {
                allChecked = false;
            }
        });

        $('#selectAllCheckbox').prop('checked', anyItems && allChecked);
    }

    // Initialize all navigation badges on load
    function initializeAllBadges() {
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

    // Category button click handler
    $('.perm-cat-btn').on('click', function() {
        $('.perm-cat-btn').removeClass('active');
        $(this).addClass('active');
        const catKey = $(this).data('category');
        loadPermissions(catKey);
        scrollActiveCategoryIntoView();
    });

    // Checkbox change handler (Delegated)
    $('#permissionsBody').on('change', '.perm-cb', function() {
        const itemId = $(this).data('item-id');
        const type = $(this).data('type'); // 'read', 'write', or 'delete'
        const isChecked = $(this).is(':checked');

        // Update in-memory state
        const item = permissionsData[currentCategory].items.find(i => i.id === itemId);
        if (item) {
            item[type] = isChecked;
        }

        updateCategoryStats();
        updateSelectAllState();
    });

    // Select All handler
    $('#selectAllCheckbox').on('change', function() {
        const isChecked = $(this).is(':checked');
        const data = permissionsData[currentCategory];

        data.items.forEach(item => {
            item.read = isChecked;
            item.write = isChecked;
            item.delete = isChecked;
        });

        // Re-render checkboxes
        $('.perm-cb').prop('checked', isChecked);
        updateCategoryStats();
    });

    // Form Submission & Validation
    $('#btnCreateRole').on('click', function() {
        const roleName = $('#roleNameInput').val().trim();
        if (!roleName) {
            alert('Please enter a role name.');
            $('#roleNameInput').focus();
            return;
        }

        // Collect all checked permissions
        const payload = [];
        Object.keys(permissionsData).forEach(catKey => {
            const data = permissionsData[catKey];
            data.items.forEach(item => {
                if (item.read || item.write || item.delete) {
                    payload.push({
                        id: item.id,
                        name: item.name,
                        category: data.title,
                        read: item.read,
                        write: item.write,
                        delete: item.delete
                    });
                }
            });
        });

        alert(`Role "${roleName}" has been successfully created with ${payload.length} assigned permissions.`);
        window.location.href = 'role-management.html';
    });

    // Initial setup
    initializeAllBadges();
    loadPermissions('general');
});
