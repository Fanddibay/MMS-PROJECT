/* ============================================================
   PAGE: View Role Management
   
   Tab switching, permission category navigation, and
   permission data rendering for the view-only role detail page.
   
   Dependencies: jQuery, components/sidebar.js
   ============================================================ */

$(document).ready(function () {

    // ---- Tab Switching Logic ----
    $('#tabUsers').on('click', function () {
        $(this).addClass('text-[#1a4999] border-[#1a4999]').removeClass('text-[#a1a1aa] border-transparent');
        $('#tabPermissions').addClass('text-[#a1a1aa] border-transparent').removeClass('text-[#1a4999] border-[#1a4999]');
        $('#contentUsers').removeClass('hidden').addClass('block');
        $('#contentPermissions').removeClass('block').addClass('hidden');
    });

    $('#tabPermissions').on('click', function () {
        $(this).addClass('text-[#1a4999] border-[#1a4999]').removeClass('text-[#a1a1aa] border-transparent');
        $('#tabUsers').addClass('text-[#a1a1aa] border-transparent').removeClass('text-[#1a4999] border-[#1a4999]');
        $('#contentPermissions').removeClass('hidden').addClass('block');
        $('#contentUsers').removeClass('block').addClass('hidden');

        // Load default category if not loaded
        if ($('#permissionsBody').children().length === 0) {
            loadPermissions('general');
        }
    });

    // ---- Permissions Data ----
    var currentCategory = 'general';
    var permissionsData = {
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
        }
    };

    function loadPermissions(catKey) {
        currentCategory = catKey;
        var data = permissionsData[catKey] || permissionsData.general;
        $('#currentCatTitle').text(data.title);

        var body = $('#permissionsBody');
        body.empty();

        data.items.forEach(function (item, rowIndex) {
            var row = $(
                '<tr class="' + (rowIndex % 2 === 0 ? 'bg-white' : 'bg-[#f9fafb]/50') + ' border-b border-[#e5e7eb]">' +
                '<td class="px-[17px] py-[16px] text-[14px] text-[#101828] font-normal">' + item.name + '</td>' +
                '<td class="px-[17px] py-[16px] text-center">' + renderCheckbox(item.read) + '</td>' +
                '<td class="px-[17px] py-[16px] text-center">' + renderCheckbox(item.write) + '</td>' +
                '<td class="px-[17px] py-[16px] text-center">' + renderCheckbox(item.delete) + '</td>' +
                '</tr>'
            );
            body.append(row);
        });
        updateStats();
    }

    function renderCheckbox(checked) {
        if (checked === true || checked === 'true') {
            return '<div class="flex justify-center items-center"><i class="fa-solid fa-check text-[#1a4999] text-[16px]"></i></div>';
        } else {
            return '<div class="flex justify-center items-center"><i class="fa-solid fa-xmark text-[#a1a1aa] text-[16px]"></i></div>';
        }
    }

    function updateStats() {
        var data = permissionsData[currentCategory];
        if (!data) return;
        var total = data.items.length * 3;
        var selected = 0;

        data.items.forEach(function (item) {
            if (item.read) selected++;
            if (item.write) selected++;
            if (item.delete) selected++;
        });

        $('#currentCatStats').text('(' + selected + '/' + total + ' selected)');
        $('.perm-cat-btn[data-category="' + currentCategory + '"] span:first-child').text('(' + selected + ')');
    }

    function initializeSidebarCounts() {
        Object.keys(permissionsData).forEach(function (catKey) {
            var data = permissionsData[catKey];
            var selected = 0;
            data.items.forEach(function (item) {
                if (item.read) selected++;
                if (item.write) selected++;
                if (item.delete) selected++;
            });
            $('.perm-cat-btn[data-category="' + catKey + '"] span:first-child').text('(' + selected + ')');
        });
    }

    // ---- Permission Category Click ----
    $('.perm-cat-btn').on('click', function () {
        $('.perm-cat-btn').removeClass('active text-[#1a4999]').addClass('text-[#a1a1aa]');
        $(this).addClass('active text-[#1a4999]').removeClass('text-[#a1a1aa]');
        var cat = $(this).data('category');
        loadPermissions(cat);
    });

    // ---- Initial Load ----
    initializeSidebarCounts();
    loadPermissions('general');
});
