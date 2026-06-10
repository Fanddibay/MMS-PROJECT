/* ============================================================
   COMPONENT: DataTable Initializer
   
   Factory function for creating consistent DataTable instances
   across the project. Reduces boilerplate configuration.
   
   Dependencies: jQuery, DataTables plugin
   Angular Migration: Becomes DataTableService
   ============================================================ */

/**
 * Initialize a DataTable with project-standard configuration.
 * 
 * @param {string} selector - jQuery selector for the table element (e.g., '#usersTable')
 * @param {Object} [options={}] - Override options
 * @param {boolean} [options.showInfo=true] - Show record count
 * @param {string} [options.infoText='_TOTAL_ Records'] - Custom info text
 * @param {number} [options.pageLength=10] - Rows per page
 * @param {string|null} [options.dom=null] - Custom DOM layout
 * @returns {DataTable} The initialized DataTable instance
 */
function initDataTable(selector, options) {
    options = options || {};

    var showInfo = options.showInfo !== undefined ? options.showInfo : true;
    var infoText = options.infoText || '_TOTAL_ Records';
    var pageLength = options.pageLength || 10;
    var infoType = options.infoType || 'Records'; // 'Users', 'Roles', 'Logs'

    return $(selector).DataTable({
        dom: 'rt<"hidden"ip>', // Hide default info/pagination
        language: {
            info: infoText,
            infoEmpty: "0 " + infoType,
            paginate: {
                previous: '<i class="fa-solid fa-chevron-left text-[12px]"></i>',
                next: '<i class="fa-solid fa-chevron-right text-[12px]"></i>'
            }
        },
        paging: true,
        info: showInfo,
        lengthChange: false,
        pageLength: pageLength,
        ordering: options.ordering !== undefined ? options.ordering : true,
        drawCallback: function(settings) {
            const api = this.api();
            const info = api.page.info();
            
            // Check if there is a custom footer defined for the table container
            const container = $(selector).closest('.bg-white').find('#tableFooter, .table-footer');
            if (container.length) {
                let infoHtml = showInfo ? `<div class="text-[#a1a1aa] text-[16px]">${info.recordsTotal} ${infoType}</div>` : '<div></div>';
                
                let paginationHtml = '';
                if (info.pages > 1 || true) { // Always show pagination controls even if 1 page, to match design
                    paginationHtml = `
                        <div class="flex border border-[#e4e4e7] rounded-[8px] overflow-hidden">
                            <button class="paginate-prev w-[38px] h-[38px] bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 border-r border-[#d4d4d8] ${info.page === 0 ? 'opacity-50 cursor-not-allowed' : ''}">
                                <i class="fa-solid fa-chevron-left text-[12px]"></i>
                            </button>
                            <div class="px-[16px] h-[38px] bg-[#1a4999] text-white flex items-center justify-center text-[14px]">
                                ${info.page + 1}
                            </div>
                            <button class="paginate-next w-[38px] h-[38px] bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 border-l border-[#d4d4d8] ${info.page >= info.pages - 1 ? 'opacity-50 cursor-not-allowed' : ''}">
                                <i class="fa-solid fa-chevron-right text-[12px]"></i>
                            </button>
                        </div>
                    `;
                }

                let footerHtml = `
                    ${infoHtml}
                    ${paginationHtml}
                `;
                container.html(footerHtml);

                // Bind clicks
                container.find('.paginate-prev').off('click').on('click', function() {
                    if (info.page > 0) api.page('previous').draw('page');
                });
                container.find('.paginate-next').off('click').on('click', function() {
                    if (info.page < info.pages - 1) api.page('next').draw('page');
                });
            }
        }
    });
}

/**
 * Attach a custom search input to a DataTable.
 * 
 * @param {string} inputSelector - jQuery selector for the search input
 * @param {DataTable} table - The DataTable instance
 */
function preventInputFocusScroll(input) {
    if (!input || input.dataset.scrollFix === 'off') return;
    input.addEventListener('mousedown', function (e) {
        if (e.button !== 0) return;
        e.preventDefault();
        input.focus({ preventScroll: true });
    });
}

function attachSearch(inputSelector, table) {
    $(inputSelector).each(function () {
        preventInputFocusScroll(this);
    });
    $(inputSelector).on('keyup', function () {
        table.search(this.value).draw();
    });
}

/**
 * Attach a column filter (select or input) to a DataTable.
 * 
 * @param {string} filterSelector - jQuery selector for the filter element
 * @param {DataTable} table - The DataTable instance
 * @param {number} columnIndex - The column index to filter
 */
function attachColumnFilter(filterSelector, table, columnIndex) {
    $(filterSelector).on('change', function () {
        table.column(columnIndex).search(this.value).draw();
    });
}
