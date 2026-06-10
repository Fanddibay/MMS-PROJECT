const THEME_KEY = "theme";
const THEMES = {
  dark: "dark",
  light: "light"
};

const MAP_STYLE = {
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
};

const PORT_COORDINATE = [106.88, -6.104];

const root = document.documentElement;
const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle?.querySelector("i");
const panelToggle = document.getElementById("panelToggle");
const zoomInBtn = document.getElementById("zoomInBtn");
const zoomOutBtn = document.getElementById("zoomOutBtn");
const leftSidebarWrap = document.getElementById("leftSidebarWrap");
const dataLayersPanel = document.getElementById("dataLayersPanel");
const sidebarMenuPrimary = document.getElementById("sidebarMenuPrimary");
const sidebarCloseBtn = document.getElementById("sidebarCloseBtn");
const footerInner = document.getElementById("footerInner");
const bottomBar = document.getElementById("bottomBar");
const bottomToggle = document.getElementById("bottomToggle");
const catalogOverlay = document.getElementById("catalogOverlay");
const catalogCloseBtn = document.getElementById("catalogCloseBtn");
// Data Layers Panel variables are declared below to prevent duplicate scoping conflicts
const toggleInfo = document.getElementById("infoToggle");
const infoContent = document.getElementById("infoModal");
const closeToggleInfo = document.getElementById("closeInfo");
const sidebarBackdrop = document.getElementById("sidebarBackdrop");


// Check both `toggleInfo` and `infoContent` exist before adding the listener,
// and actually toggle the modal open/closed by changing its "hidden" class.
if (toggleInfo && infoContent && closeToggleInfo) {
  toggleInfo.addEventListener("click", () => {
    // Use display style to allow re-opening if previously closed with display="none"
    if (infoContent.classList.contains("hidden") || infoContent.style.display === "none") {
      infoContent.classList.remove("hidden");
      infoContent.style.display = ""; // Reset display in case it was set inline
      toggleInfo.classList.add("text-blue-500");
    } else {
      infoContent.classList.add("hidden");
      infoContent.style.display = ""; // Remove inline display just in case
      toggleInfo.classList.remove("text-blue-500");
    }
  });

  closeToggleInfo.addEventListener("click", () => {
    infoContent.classList.add("hidden");
    infoContent.style.display = "";
    toggleInfo.classList.remove("text-blue-500");
  });
}



let map = null;
try {
  map = new maplibregl.Map({
    container: "map",
    style: MAP_STYLE[root.classList.contains("dark") ? THEMES.dark : THEMES.light],
    center: PORT_COORDINATE,
    zoom: 5.2,
    pitch: 0,
    attributionControl: false
  });

  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "bottom-right");

  new maplibregl.Marker({ color: "#22c55e" })
    .setLngLat(PORT_COORDINATE)
    .setPopup(
      new maplibregl.Popup({ offset: 20 }).setHTML(
        "<strong>Tanjung Priok Port</strong><br/>Jakarta, Indonesia"
      )
    )
    .addTo(map);
} catch (e) {
  console.error("Map initialization failed. This may be due to WebGL not being supported or hardware acceleration disabled.", e);
  const mapContainer = document.getElementById("map");
  if (mapContainer) {
    mapContainer.innerHTML = '<div class="flex items-center justify-center h-full w-full bg-slate-900/50 text-white/50 text-sm p-4 text-center">Map could not be loaded.<br/>Please ensure hardware acceleration is enabled in your browser settings.</div>';
  }
}

function syncThemeIcon() {
  if (!themeIcon) return;
  const isDark = root.classList.contains("dark");
  themeIcon.className = isDark ? "fa-solid fa-moon" : "fa-solid fa-sun";
}

function applyTheme(theme) {
  const isDark = theme === THEMES.dark;
  root.classList.toggle("dark", isDark);
  root.dataset.theme = theme;
  body.classList.toggle("light-theme", !isDark);
  localStorage.setItem(THEME_KEY, theme);
  syncThemeIcon();

  if (map) {
    const currentStyle = map.getStyle()?.sprite || "";
    const styleShouldContain = isDark ? "dark-matter" : "positron";
    if (!currentStyle.includes(styleShouldContain)) {
      map.setStyle(MAP_STYLE[theme]);
    }
  }
}

themeToggle?.addEventListener("click", () => {
  const next = root.classList.contains("dark") ? THEMES.light : THEMES.dark;
  applyTheme(next);
});

function setLeftSidebarOpen(open) {
  if (!leftSidebarWrap) return;
  
  if (open) {
    leftSidebarWrap.classList.remove("-translate-x-full");
    leftSidebarWrap.classList.add("translate-x-0");
    leftSidebarWrap.classList.remove("is-collapsed");
    if (window.innerWidth < 768 && sidebarBackdrop) {
      sidebarBackdrop.classList.remove("hidden");
      setTimeout(() => sidebarBackdrop.classList.remove("opacity-0"), 10);
    }
  } else {
    leftSidebarWrap.classList.add("-translate-x-full");
    leftSidebarWrap.classList.remove("translate-x-0");
    leftSidebarWrap.classList.add("is-collapsed");
    if (sidebarBackdrop) {
      sidebarBackdrop.classList.add("opacity-0");
      setTimeout(() => sidebarBackdrop.classList.add("hidden"), 300);
    }
  }
  
  body.classList.toggle("sidebar-left-open", open);
  sidebarMenuPrimary?.classList.toggle("is-active", open);
  sidebarMenuPrimary?.setAttribute("aria-expanded", String(open));
  dataLayersPanel?.setAttribute("aria-hidden", String(!open));
}

sidebarMenuPrimary?.addEventListener("click", () => {
  footerInner?.classList.add("ml-[54%]");
});

sidebarCloseBtn?.addEventListener("click", () => {
  footerInner?.classList.remove("ml-[54%]");
});

panelToggle?.addEventListener("click", (e) => {
  e.stopPropagation();
  if (!leftSidebarWrap) return;
  const currentlyOpen = !leftSidebarWrap.classList.contains("-translate-x-full");
  setLeftSidebarOpen(!currentlyOpen);
});

sidebarMenuPrimary?.addEventListener("click", () => setLeftSidebarOpen(true));
sidebarCloseBtn?.addEventListener("click", () => setLeftSidebarOpen(false));
sidebarBackdrop?.addEventListener("click", () => setLeftSidebarOpen(false));

// Close sidebar when clicking outside on mobile
document.addEventListener("click", (e) => {
  if (window.innerWidth < 768) {
    if (leftSidebarWrap && !leftSidebarWrap.contains(e.target) && (!panelToggle || !panelToggle.contains(e.target))) {
      setLeftSidebarOpen(false);
    }
  }
});

zoomInBtn?.addEventListener("click", () => map?.zoomIn({ duration: 250 }));
zoomOutBtn?.addEventListener("click", () => map?.zoomOut({ duration: 250 }));

window.addEventListener("resize", () => {
  if (window.innerWidth < 768) {
    setLeftSidebarOpen(false);
    return;
  }
});



function setBottomChartCollapsed(collapsed) {
  const mapBottomPanel = document.getElementById("mapBottomPanel");
  if (!mapBottomPanel) return;
  mapBottomPanel.classList.toggle("bottom-chart-collapsed", collapsed);
  if (bottomToggle) {
    bottomToggle.setAttribute("aria-expanded", String(!collapsed));
  }
}

function syncSidebarLayersActive(open) {
  const sidebarHomeBtn = document.getElementById("sidebarHomeBtn");
  sidebarHomeBtn?.classList.toggle("is-active", open);
  sidebarHomeBtn?.setAttribute("aria-expanded", String(open));
}

function setLayersOpen(open) {
  const panel = document.getElementById("dataLayersPanel");
  const backdrop = document.getElementById("dataLayersBackdrop");

  if (!panel) return;

  if (open) {
    panel.classList.remove("-translate-x-[400px]", "opacity-0", "pointer-events-none");
    panel.classList.add("translate-x-0", "opacity-100", "pointer-events-auto");
    if (backdrop) {
      backdrop.classList.remove("hidden");
      setTimeout(() => backdrop.classList.remove("opacity-0"), 10);
    }
    document.body.classList.add("data-layers-open");
    setBottomChartCollapsed(false);
  } else {
    panel.classList.add("-translate-x-[400px]", "opacity-0", "pointer-events-none");
    panel.classList.remove("translate-x-0", "opacity-100", "pointer-events-auto");
    if (backdrop) {
      backdrop.classList.add("opacity-0");
      setTimeout(() => backdrop.classList.add("hidden"), 300);
    }
    document.body.classList.remove("data-layers-open");
  }

  syncSidebarLayersActive(open);
  panel.setAttribute("aria-hidden", String(!open));
}

// --- Centered Modal: Add Layer to Map Logic (Figma: 3986:2305 + 4017:635) ---
const addLayerModalWrapper = document.getElementById("addLayerModalWrapper");
const addLayerModalBackdrop = document.getElementById("addLayerModalBackdrop");
const addLayerModalCard = document.getElementById("addLayerModalCard");
const addLayerCloseBtn = document.getElementById("addLayerCloseBtn");
const addLayerSearchInput = document.getElementById("addLayerSearchInput");
const addLayerCardsGrid = document.getElementById("addLayerCardsGrid");
const addLayerPrevBtn = document.getElementById("addLayerPrevBtn");
const addLayerNextBtn = document.getElementById("addLayerNextBtn");
const addLayerPaginationInfo = document.getElementById("addLayerPaginationInfo");

// Detail panel refs
const layerDetailPanel = document.getElementById("layerDetailPanel");
const layerDetailTitle = document.getElementById("layerDetailTitle");
const layerDetailSubtitle = document.getElementById("layerDetailSubtitle");
const layerDetailList = document.getElementById("layerDetailList");
const layerDetailCloseBtn = document.getElementById("layerDetailCloseBtn");
const layerDetailBackBtn = document.getElementById("layerDetailBackBtn");
let layerDetailCloseTimer = null;

// Layer catalogue data with sub-variables (Figma: node-id 4017:635)
const ADD_LAYERS_DATA = [
  {
    id: "inaflows", title: "INAFLOWS (GRID)", subtitle: "datalake/model/collections/inaflows",
    variables: [
      { id: "salinity", name: "Sea Water Salinity (S)" },
      { id: "eastward-velocity", name: "Eastward Sea Water Velocity (u)" },
      { id: "surface-elevation", name: "Sea Surface Elevation (zeta)" },
      { id: "temperature", name: "Sea Water Temperature (T)" },
      { id: "northward-velocity", name: "Northward Sea Water Velocity (v)" }
    ]
  },
  {
    id: "inawaves", title: "INAWAVES (GRID)", subtitle: "datalake/model/collections/inawaves",
    variables: [
      { id: "hmax", name: "Maximum Wave Height (hmax)" },
      { id: "dir", name: "Mean Wave Direction (dir)" },
      { id: "lm", name: "Mean Wavelength (lm)" },
      { id: "t01", name: "Mean Wave Period (t01)" },
      { id: "ptp00", name: "Primary Swell Period (ptp00)" },
      { id: "ptp01", name: "Secondary Swell Period (ptp01)" },
      { id: "ptp02", name: "Wind Sea Period (ptp02)" },
      { id: "hs", name: "Sig Wave Height (hs)" },
      { id: "phs00", name: "Primary Swell Height (phs00)" },
      { id: "phs01", name: "Secondary Swell Height (phs01)" },
      { id: "phs02", name: "Wind Sea Height (phs02)" },
      { id: "uwnd", name: "U Wind (uwnd)" }
    ]
  },
  {
    id: "ofs_ind", title: "OFS IND (INAWAVES) (GRID)", subtitle: "",
    variables: [
      { id: "ofs-hs", name: "Significant Wave Height" },
      { id: "ofs-dir", name: "Mean Wave Direction" },
      { id: "ofs-t", name: "Mean Wave Period" }
    ]
  },
  {
    id: "vessel_aws", title: "Vessel AWS (POINT)", subtitle: "datalake/obs/collections/vaws",
    variables: [
      { id: "vaws-wspd", name: "Wind Speed" },
      { id: "vaws-wdir", name: "Wind Direction" },
      { id: "vaws-temp", name: "Air Temperature" }
    ]
  },
  {
    id: "marine_aws", title: "Marine AWS (POINT)", subtitle: "datalake/obs/collections/maws",
    variables: [
      { id: "maws-wspd", name: "Wind Speed" },
      { id: "maws-atmp", name: "Air Temperature" },
      { id: "maws-pres", name: "Sea Level Pressure" }
    ]
  },
  {
    id: "float_arvor_c", title: "Float ARVOR-C (POINT)", subtitle: "datalake/obs/collections/arvor_c",
    variables: [
      { id: "arvor_c-temp", name: "Temperature Profile" },
      { id: "arvor_c-psal", name: "Salinity Profile" }
    ]
  },
  {
    id: "float_arvor_i", title: "Float ARVOR-I (POINT)", subtitle: "datalake/obs/collections/arvor_i",
    variables: [
      { id: "arvor_i-temp", name: "Temperature Profile" },
      { id: "arvor_i-psal", name: "Salinity Profile" }
    ]
  },
  {
    id: "ocean_drifter", title: "Ocean Drifter (POINT)", subtitle: "datalake/obs/collections/svp",
    variables: [
      { id: "svp-sst", name: "Sea Surface Temperature" },
      { id: "svp-vel", name: "Surface Velocity" }
    ]
  },
  {
    id: "radar_imagery_1", title: "Local Radar Imagery (GRID)", subtitle: "",
    variables: [
      { id: "radar-rfl", name: "Radar Reflectivity (dBZ)" },
      { id: "radar-vel", name: "Radial Velocity" }
    ]
  },
  {
    id: "himawari_cloud_1", title: "Himawari Cloud - Raw 16 Channels (GRID)", subtitle: "",
    variables: [
      { id: "him-b01", name: "Band 01 – 0.47 µm (Blue)" },
      { id: "him-b03", name: "Band 03 – 0.64 µm (Red)" },
      { id: "him-b13", name: "Band 13 – 10.4 µm (Thermal IR)" }
    ]
  },
  {
    id: "radar_imagery_2", title: "Local Radar Imagery – Surabaya (GRID)", subtitle: "",
    variables: [
      { id: "radar2-rfl", name: "Radar Reflectivity (dBZ)" }
    ]
  },
  {
    id: "himawari_cloud_2", title: "Himawari Cloud - True Color (GRID)", subtitle: "",
    variables: [
      { id: "him2-tc", name: "True Color Composite" }
    ]
  },
  {
    id: "radar_imagery_3", title: "Local Radar Imagery – Makassar (GRID)", subtitle: "",
    variables: [
      { id: "radar3-rfl", name: "Radar Reflectivity (dBZ)" }
    ]
  },
  {
    id: "himawari_cloud_3", title: "Himawari Cloud - Enhanced IR (GRID)", subtitle: "",
    variables: [
      { id: "him3-eir", name: "Enhanced IR (BD13)" }
    ]
  },
  {
    id: "radar_imagery_4", title: "Local Radar Imagery – Manado (GRID)", subtitle: "",
    variables: [
      { id: "radar4-rfl", name: "Radar Reflectivity (dBZ)" }
    ]
  }
];

let currentPage = 1;
const CARDS_PER_PAGE = 8;
let filteredLayers = [...ADD_LAYERS_DATA];

// Track added state per variable: { layerId: { variableId: true/false } }
const addedVariablesState = {};

function getAddedVariablesCount(layerId) {
  const vars = addedVariablesState[layerId];
  if (!vars) return 0;
  return Object.values(vars).filter(Boolean).length;
}

function renderLayerCards() {
  if (!addLayerCardsGrid) return;
  addLayerCardsGrid.innerHTML = "";

  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const endIndex = Math.min(startIndex + CARDS_PER_PAGE, filteredLayers.length);
  const pageItems = filteredLayers.slice(startIndex, endIndex);

  if (pageItems.length === 0) {
    addLayerCardsGrid.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center py-10 text-slate-400">
        <i class="fa-solid fa-folder-open text-2xl mb-2"></i>
        <p class="text-xs">No layers found matching search query</p>
      </div>
    `;
    updatePaginationControls(0, 0, 0);
    return;
  }

  pageItems.forEach((layer) => {
    const addedCount = getAddedVariablesCount(layer.id);
    const cardEl = document.createElement("div");
    cardEl.className = "bg-[#182168] hover:bg-[#182168]/90 border border-white/10 rounded-[26px] min-h-[41px] py-2 px-5 flex items-center justify-between shadow-sm transition-all duration-200 group";

    const subtitleHtml = layer.subtitle
      ? `<p class="text-[8px] text-white/70 italic leading-tight select-none truncate max-w-[200px]">${layer.subtitle}</p>`
      : "";
    const spacingClass = layer.subtitle ? "gap-0.5" : "";

    // "View Details" is the only first-layer action.
    const viewDetailsBtnHtml = `
      <button class="view-details-btn shrink-0 w-[60px] h-[20px] rounded-[16px] flex items-center justify-center text-[7px] font-bold bg-white text-[#182168] hover:bg-slate-100 shadow-sm transition-all duration-180 cursor-pointer" data-layer-id="${layer.id}">
        View Details
      </button>
    `;

    const badgeHtml = addedCount > 0 ? `<span class="inline-flex items-center justify-center bg-green-500 text-white text-[6px] font-bold rounded-full w-3.5 h-3.5 ml-1 shrink-0">${addedCount}</span>` : "";

    cardEl.innerHTML = `
      <div class="flex flex-col justify-center min-w-0 ${spacingClass} pr-2 flex-1">
        <div class="flex items-center gap-1">
          <h4 class="text-white text-[10px] font-semibold leading-snug tracking-tight truncate select-none">${layer.title}</h4>
          ${badgeHtml}
        </div>
        ${subtitleHtml}
      </div>
      <div class="flex items-center gap-1 shrink-0">
        ${viewDetailsBtnHtml}
      </div>
    `;

    const viewBtn = cardEl.querySelector(".view-details-btn");
    viewBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      openLayerDetail(layer);
    });

    addLayerCardsGrid.appendChild(cardEl);
  });

  updatePaginationControls(startIndex + 1, endIndex, filteredLayers.length);
}

// --- Detail Panel ---
function openLayerDetail(layer) {
  if (!layerDetailPanel || !layerDetailTitle || !layerDetailList) return;

  layerDetailTitle.textContent = layer.title;
  layerDetailSubtitle.textContent = layer.subtitle || "";

  // Populate variable rows
  layerDetailList.innerHTML = "";
  (layer.variables || []).forEach((variable) => {
    const isVarAdded = addedVariablesState[layer.id]?.[variable.id] || false;
    const rowEl = document.createElement("div");
    rowEl.className = "layer-variable-row";

    const btnClass = isVarAdded ? "layer-var-add-btn is-added" : "layer-var-add-btn";
    const btnContent = isVarAdded
      ? '<i class="fa-solid fa-xmark text-[7px]"></i>Remove'
      : "Add to map";

    rowEl.innerHTML = `
      <span class="layer-variable-name">${variable.name}</span>
      <button class="${btnClass}" data-var-id="${variable.id}" data-layer-id="${layer.id}">
        ${btnContent}
      </button>
    `;

    const varBtn = rowEl.querySelector(".layer-var-add-btn");
    varBtn?.addEventListener("click", () => {
      if (!addedVariablesState[layer.id]) addedVariablesState[layer.id] = {};
      const wasAdded = addedVariablesState[layer.id][variable.id] || false;
      addedVariablesState[layer.id][variable.id] = !wasAdded;

      const nowAdded = addedVariablesState[layer.id][variable.id];

      // Toggle CSS classes
      varBtn.classList.toggle("is-added", nowAdded);
      varBtn.innerHTML = nowAdded
        ? '<i class="fa-solid fa-xmark text-[7px]"></i>Remove'
        : "Add to map";

      // Sync with left data layers panel checkbox
      const targetCheckbox = document.querySelector(`.data-layer-row input[data-layer-id="${variable.id}"]`);
      if (targetCheckbox) {
        targetCheckbox.checked = nowAdded;
        const row = targetCheckbox.closest(".data-layer-row");
        if (row) row.classList.toggle("is-selected", nowAdded);
        if (typeof updateActiveBadgeCount === "function") updateActiveBadgeCount();
      }

      // Re-render cards so the first-layer badge updates without closing detail panel
      renderLayerCards();
    });

    layerDetailList.appendChild(rowEl);
  });

  // Show detail panel
  if (layerDetailCloseTimer) clearTimeout(layerDetailCloseTimer);
  addLayerModalCard?.classList.add("hidden");
  layerDetailPanel.classList.add("is-open");
  layerDetailPanel.classList.remove("pointer-events-none");
}

function closeLayerDetail() {
  layerDetailPanel?.classList.remove("is-open");
  if (layerDetailCloseTimer) clearTimeout(layerDetailCloseTimer);
  layerDetailCloseTimer = setTimeout(() => layerDetailPanel?.classList.add("pointer-events-none"), 320);
  addLayerModalCard?.classList.remove("hidden");
}

layerDetailCloseBtn?.addEventListener("click", () => setAddLayerModalOpen(false));
layerDetailBackBtn?.addEventListener("click", closeLayerDetail);

function updatePaginationControls(start, end, total) {
  if (addLayerPaginationInfo) {
    addLayerPaginationInfo.textContent = total === 0 ? "Showing 0 layers" : `Showing ${start}-${end} of ${total} layers`;
  }
  if (addLayerPrevBtn) addLayerPrevBtn.disabled = currentPage === 1;
  if (addLayerNextBtn) addLayerNextBtn.disabled = currentPage * CARDS_PER_PAGE >= total;
}

function setAddLayerModalOpen(open) {
  if (!addLayerModalWrapper) return;

  if (open) {
    // Sync initial added states from left panel checkboxes
    ADD_LAYERS_DATA.forEach((layer) => {
      (layer.variables || []).forEach((variable) => {
        const cb = document.querySelector(`.data-layer-row input[data-layer-id="${variable.id}"]`);
        if (cb) {
          if (!addedVariablesState[layer.id]) addedVariablesState[layer.id] = {};
          addedVariablesState[layer.id][variable.id] = cb.checked;
        }
      });
    });

    addLayerModalWrapper.classList.remove("hidden");
    setTimeout(() => {
      addLayerModalWrapper.classList.remove("opacity-0", "pointer-events-none");
      addLayerModalWrapper.classList.add("opacity-100", "pointer-events-auto");
      addLayerModalCard?.classList.remove("scale-95");
      addLayerModalCard?.classList.add("scale-100");
    }, 10);

    if (addLayerSearchInput) addLayerSearchInput.value = "";
    filteredLayers = [...ADD_LAYERS_DATA];
    currentPage = 1;
    renderLayerCards();
    closeLayerDetail();

    document.getElementById("layersPanelBtn")?.classList.add("is-active");
  } else {
    closeLayerDetail();
    addLayerModalWrapper.classList.add("opacity-0", "pointer-events-none");
    addLayerModalWrapper.classList.remove("opacity-100", "pointer-events-auto");
    addLayerModalCard?.classList.remove("scale-100");
    addLayerModalCard?.classList.add("scale-95");
    setTimeout(() => addLayerModalWrapper.classList.add("hidden"), 300);
    document.getElementById("layersPanelBtn")?.classList.remove("is-active");
  }
}

// Bind search input
addLayerSearchInput?.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase().trim();
  filteredLayers = ADD_LAYERS_DATA.filter((layer) =>
    layer.title.toLowerCase().includes(query) || layer.subtitle.toLowerCase().includes(query)
  );
  currentPage = 1;
  renderLayerCards();
});

// Bind pagination
addLayerPrevBtn?.addEventListener("click", () => { if (currentPage > 1) { currentPage--; renderLayerCards(); } });
addLayerNextBtn?.addEventListener("click", () => { if (currentPage * CARDS_PER_PAGE < filteredLayers.length) { currentPage++; renderLayerCards(); } });

addLayerCloseBtn?.addEventListener("click", () => setAddLayerModalOpen(false));
addLayerModalBackdrop?.addEventListener("click", () => setAddLayerModalOpen(false));

// Bind show/hide triggers
const sidebarHomeBtn = document.getElementById("sidebarHomeBtn");
const layersPanelBtn = document.getElementById("layersPanelBtn");
const dataLayerCloseBtn = document.getElementById("dataLayerCloseBtn");
const dataLayersBackdrop = document.getElementById("dataLayersBackdrop");

if (sidebarHomeBtn) {
  sidebarHomeBtn.addEventListener("click", () => {
    const panel = document.getElementById("dataLayersPanel");
    const isOpen = panel && !panel.classList.contains("opacity-0");
    setLayersOpen(!isOpen);
  });
}

if (layersPanelBtn) {
  layersPanelBtn.addEventListener("click", () => {
    const isOpen = addLayerModalWrapper && !addLayerModalWrapper.classList.contains("opacity-0");
    setAddLayerModalOpen(!isOpen);
  });
}

if (dataLayerCloseBtn) {
  dataLayerCloseBtn.addEventListener("click", () => setLayersOpen(false));
}

if (dataLayersBackdrop) {
  dataLayersBackdrop.addEventListener("click", () => setLayersOpen(false));
}


// Data layer checkboxes (Figma: parameter rows with sparklines)
const dataLayerRows = document.querySelectorAll(".data-layer-row");
const activeBadge = document.getElementById("activeFiltersBadge");
const clearAllBtn = document.getElementById("clearAllFiltersBtn");

function updateActiveBadgeCount() {
  if (!activeBadge) return;
  const checkedCount = document.querySelectorAll(".data-layer-row input[type='checkbox']:checked").length;
  activeBadge.textContent = checkedCount > 0 ? `Active (${checkedCount})` : "Active";
}

function syncDataLayerRowState(row) {
  const input = row.querySelector("input[type='checkbox']");
  if (!input) return;
  row.classList.toggle("is-selected", input.checked);
}

dataLayerRows.forEach((row) => {
  const input = row.querySelector("input[type='checkbox']");
  if (!input) return;
  syncDataLayerRowState(row);
  input.addEventListener("change", () => {
    syncDataLayerRowState(row);
    updateActiveBadgeCount();
  });
});

if (clearAllBtn) {
  clearAllBtn.addEventListener("click", () => {
    dataLayerRows.forEach((row) => {
      const input = row.querySelector("input[type='checkbox']");
      if (input) input.checked = false;
      syncDataLayerRowState(row);
    });
    updateActiveBadgeCount();
  });
}

updateActiveBadgeCount();

function onGlobalEscape(e) {
  if (e.key !== "Escape") return;
  if (addLayerModalWrapper && !addLayerModalWrapper.classList.contains("opacity-0")) {
    setAddLayerModalOpen(false);
    return;
  }
  const panel = document.getElementById("dataLayersPanel");
  if (panel && !panel.classList.contains("opacity-0")) {
    setLayersOpen(false);
    return;
  }
  setCatalogOpen(false);
}

window.addEventListener("keydown", onGlobalEscape);

if (bottomToggle) {
  bottomToggle.addEventListener("click", () => {
    const mapBottomPanel = document.getElementById("mapBottomPanel");
    const collapsed = mapBottomPanel?.classList.contains("bottom-chart-collapsed");
    setBottomChartCollapsed(!collapsed);
  });
}

// ============================================================
// VIRTUAL STATION POPUP (Figma: node 4538-886)
// ============================================================
(function () {
  const compassBtn      = document.getElementById('compassBtn');
  const windBtn         = document.getElementById('windBtn');
  const compassDropdown = document.getElementById('compassDropdown');
  const compassCloseBtn = document.getElementById('compassCloseBtn');
  const compassGoBtn    = document.getElementById('compassGoBtn');
  const compassBackdrop = document.getElementById('compassBackdrop');
  const lonInput        = document.getElementById('compassLonInput');
  const latInput        = document.getElementById('compassLatInput');
  const lonWrap         = document.getElementById('compassLonWrap');
  const latWrap         = document.getElementById('compassLatWrap');
  const lonError        = document.getElementById('compassLonError');
  const latError        = document.getElementById('compassLatError');

  if (!compassDropdown) return;

  let isOpen = false;

  function openDropdown(anchorBtn) {
    isOpen = true;
    compassDropdown.classList.add('is-open');
    if (compassBtn) compassBtn.classList.add('is-active');
    if (windBtn) windBtn.classList.add('is-active');
    if (compassBackdrop) {
      compassBackdrop.style.display = 'block';
      requestAnimationFrame(() => compassBackdrop.classList.add('is-visible'));
    }
  }

  function closeDropdown() {
    isOpen = false;
    compassDropdown.classList.remove('is-open');
    if (compassBtn) compassBtn.classList.remove('is-active');
    if (windBtn) windBtn.classList.remove('is-active');
    if (compassBackdrop) {
      compassBackdrop.classList.remove('is-visible');
      setTimeout(() => { compassBackdrop.style.display = 'none'; }, 200);
    }
    // Clear errors on close
    lonWrap?.classList.remove('compass-input-error');
    latWrap?.classList.remove('compass-input-error');
    lonError?.classList.add('hidden');
    latError?.classList.add('hidden');
  }

  function toggleDropdown(btn) {
    isOpen ? closeDropdown() : openDropdown(btn);
  }

  compassBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown(compassBtn);
  });

  windBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown(windBtn);
  });

  compassCloseBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeDropdown();
  });

  compassBackdrop?.addEventListener('click', closeDropdown);

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (isOpen && compassDropdown && !compassDropdown.contains(e.target)
        && !(compassBtn && compassBtn.contains(e.target))
        && !(windBtn && windBtn.contains(e.target))) {
      closeDropdown();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeDropdown();
  });

  // Spinner buttons (+/-)
  compassDropdown.addEventListener('click', (e) => {
    const btn = e.target.closest('.vs-spin-btn');
    if (!btn) return;
    const targetId = btn.dataset.target;
    const dir = btn.dataset.dir;
    const input = document.getElementById(targetId);
    if (!input) return;
    const step = parseFloat(input.step) || 0.01;
    let val = parseFloat(input.value) || 0;
    val = dir === 'up' ? val + step : val - step;
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    if (!isNaN(min)) val = Math.max(min, val);
    if (!isNaN(max)) val = Math.min(max, val);
    input.value = Math.round(val * 1000) / 1000;
    input.dispatchEvent(new Event('input'));
  });

  // Input validation helpers
  function validateLon() {
    const v = parseFloat(lonInput.value);
    const invalid = lonInput.value !== '' && (isNaN(v) || v < -180 || v > 180);
    lonWrap?.classList.toggle('compass-input-error', invalid);
    lonError?.classList.toggle('hidden', !invalid);
    return !invalid;
  }
  function validateLat() {
    const v = parseFloat(latInput.value);
    const invalid = latInput.value !== '' && (isNaN(v) || v < -90 || v > 90);
    latWrap?.classList.toggle('compass-input-error', invalid);
    latError?.classList.toggle('hidden', !invalid);
    return !invalid;
  }

  lonInput?.addEventListener('input', validateLon);
  latInput?.addEventListener('input', validateLat);

  // Go button: fly map to entered coordinates
  compassGoBtn?.addEventListener('click', () => {
    const lonOk = validateLon();
    const latOk = validateLat();
    if (!lonOk || !latOk) return;

    const lon = parseFloat(lonInput.value);
    const lat = parseFloat(latInput.value);
    if (isNaN(lon) || isNaN(lat)) {
      if (!lonInput.value) { lonWrap?.classList.add('compass-input-error'); lonError?.classList.remove('hidden'); }
      if (!latInput.value) { latWrap?.classList.add('compass-input-error'); latError?.classList.remove('hidden'); }
      return;
    }

    if (typeof map !== 'undefined' && map && map.flyTo) {
      map.flyTo({ center: [lon, lat], zoom: 8, duration: 1500 });
    }
    closeDropdown();
  });
})();


syncThemeIcon();
body.classList.toggle("light-theme", !root.classList.contains("dark"));
setLeftSidebarOpen(false);


// Tab Switching
const catalogTabs = document.querySelectorAll(".catalog-tab");
const catalogPanes = document.querySelectorAll(".catalog-pane");

catalogTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;
    
    // Update active tab UI
    catalogTabs.forEach((t) => t.classList.toggle("is-active", t === tab));
    
    // Show target pane
    catalogPanes.forEach((pane) => {
      pane.classList.toggle("hidden", pane.id !== `pane-${target}`);
    });
  });
});

// Initialize Date Picker
if (typeof flatpickr !== "undefined") {
  flatpickr(".catalog-datepicker", {
    dateFormat: "d/m/Y",
    allowInput: true,
    theme: root.classList.contains("dark") ? "dark" : "light"
  });
}

// Removed redundant jQuery code that doesn't apply to this page's structure.
// All sidebar and table logic is now handled via vanilla JS and Tailwind.

// ============================================================
// NOTIFICATION DROPDOWN (Figma: node 3894-2239)
// ============================================================
(function () {
  const notifBtn        = document.getElementById('notificationBtn');
  const notifDropdown   = document.getElementById('notificationDropdown');
  const notifCloseBtn   = document.getElementById('notifCloseBtn');
  const markAllReadBtn  = document.getElementById('markAllReadBtn');
  const seeAllNotifBtn  = document.getElementById('seeAllNotifBtn');
  const notifBadge      = document.getElementById('notifBadge');

  if (!notifBtn || !notifDropdown) return;

  let dropdownOpen = false;

  function openDropdown() {
    dropdownOpen = true;
    notifDropdown.classList.add('is-open');
    notifBtn.classList.add('is-active');
  }

  function closeDropdown() {
    dropdownOpen = false;
    notifDropdown.classList.remove('is-open');
    notifBtn.classList.remove('is-active');
  }

  notifBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownOpen ? closeDropdown() : openDropdown();
  });

  notifCloseBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeDropdown();
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (dropdownOpen && !notifDropdown.contains(e.target) && !notifBtn.contains(e.target)) {
      closeDropdown();
    }
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dropdownOpen) closeDropdown();
  });

  // Tab filtering inside dropdown
  const notifTabs  = notifDropdown.querySelectorAll('.notif-tab');
  const notifItems = notifDropdown.querySelectorAll('.notif-item');

  notifTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      notifTabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      const filter = tab.dataset.tab;
      notifItems.forEach((item) => {
        if (filter === 'all') {
          item.style.display = '';
        } else if (filter === 'unread') {
          item.style.display = item.dataset.unread === 'true' ? '' : 'none';
        } else if (filter === 'alerts') {
          // Alerts = items with red/orange icon (triangle-exclamation or wind)
          const hasAlert = item.querySelector('.fa-triangle-exclamation, .fa-wind');
          item.style.display = hasAlert ? '' : 'none';
        }
      });
    });
  });

  // Mark all as read – hide red dots, clear badge
  function markAllRead() {
    notifItems.forEach((item) => {
      item.dataset.unread = 'false';
      const dot = item.querySelector('span.rounded-full.bg-\\[\\#fb2c36\\]');
      if (dot) dot.style.display = 'none';
    });
    if (notifBadge) notifBadge.style.display = 'none';
    // Update the unread count in header
    const dropBadge = notifDropdown.querySelector('h3 + span');
    if (dropBadge) dropBadge.style.display = 'none';
    const unreadTab = notifDropdown.querySelector('[data-tab="unread"]');
    if (unreadTab) unreadTab.textContent = 'Unread (0)';
  }

  markAllReadBtn?.addEventListener('click', markAllRead);

  // "See All" button → open the full modal
  seeAllNotifBtn?.addEventListener('click', () => {
    closeDropdown();
    openAllNotifModal();
  });
})();


// ============================================================
// ALL NOTIFICATIONS MODAL (Figma: node 3894-2727)
// ============================================================
(function () {
  const modal         = document.getElementById('allNotificationsModal');
  const card          = document.getElementById('allNotifCard');
  const backdrop      = document.getElementById('allNotifBackdrop');
  const closeBtn      = document.getElementById('allNotifCloseBtn');
  const markAllBtn    = document.getElementById('modalMarkAllReadBtn');
  const searchInput   = document.getElementById('notifSearchInput');
  const allItems      = document.querySelectorAll('.all-notif-item');
  const allTabs       = document.querySelectorAll('.all-notif-tab');

  if (!modal || !card) return;

  function openAllNotifModal() {
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    // Animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        card.classList.add('is-visible');
      });
    });
    document.body.style.overflow = 'hidden';
  }

  function closeAllNotifModal() {
    card.classList.remove('is-visible');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => {
      modal.classList.add('hidden');
    }, 300);
  }

  // Expose openAllNotifModal globally so the dropdown's "See All" can call it
  window.openAllNotifModal = openAllNotifModal;

  closeBtn?.addEventListener('click', closeAllNotifModal);
  backdrop?.addEventListener('click', closeAllNotifModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeAllNotifModal();
    }
  });

  // Tab filtering
  allTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      allTabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      const filter = tab.dataset.filter;
      filterModalItems(filter, searchInput?.value?.toLowerCase()?.trim() || '');
    });
  });

  // Search filtering
  searchInput?.addEventListener('input', () => {
    const activeTab  = modal.querySelector('.all-notif-tab.is-active');
    const filter     = activeTab?.dataset.filter || 'all';
    const query      = searchInput.value.toLowerCase().trim();
    filterModalItems(filter, query);
  });

  function filterModalItems(filter, query) {
    allItems.forEach((item) => {
      const titleEl   = item.querySelector('p');
      const titleText = titleEl ? titleEl.textContent.toLowerCase() : '';
      const type      = item.dataset.type || '';
      const unread    = item.dataset.unread;

      let show = true;
      if (filter === 'unread')  show = unread === 'true';
      else if (filter === 'alerts')  show = type === 'alerts';
      else if (filter === 'system')  show = type === 'system';

      if (show && query) show = titleText.includes(query);
      item.style.display = show ? '' : 'none';
    });
  }

  // Mark all as read inside the modal
  markAllBtn?.addEventListener('click', () => {
    allItems.forEach((item) => {
      item.dataset.unread = 'false';
      const dot = item.querySelector('.rounded-full.bg-\\[\\#fb2c36\\]');
      if (dot) dot.style.display = 'none';
    });
    // Also clear the main badge on the bell button
    const notifBadge = document.getElementById('notifBadge');
    if (notifBadge) notifBadge.style.display = 'none';
    const subText = modal.querySelector('p.text-\\[11px\\].text-slate-400');
    if (subText) subText.textContent = 'All caught up!';
    if (markAllBtn) markAllBtn.style.display = 'none';
  });

  // ==========================================
  // Period Filter Dropdown Logic
  // ==========================================
  const periodBtn = document.getElementById('notifPeriodBtn');
  const periodMenu = document.getElementById('notifPeriodMenu');
  const periodLabel = document.getElementById('notifPeriodLabel');
  const periodOptions = document.querySelectorAll('.period-option');
  const customInput = document.getElementById('notifPeriodCustomInput');
  let periodMenuOpen = false;

  if (periodBtn && periodMenu) {
    function togglePeriodMenu() {
      periodMenuOpen = !periodMenuOpen;
      if (periodMenuOpen) {
        periodMenu.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
        periodMenu.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
        periodBtn.classList.add('border-[#1a4999]/30');
      } else {
        periodMenu.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
        periodMenu.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
        periodBtn.classList.remove('border-[#1a4999]/30');
      }
    }

    periodBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePeriodMenu();
    });

    document.addEventListener('click', (e) => {
      if (periodMenuOpen && !periodMenu.contains(e.target) && !periodBtn.contains(e.target)) {
        togglePeriodMenu();
      }
    });

    // Custom Datepicker Flatpickr Initialization
    let customPicker = null;
    if (customInput && typeof flatpickr !== 'undefined') {
      customPicker = flatpickr(customInput, {
        mode: 'range',
        dateFormat: 'd/m/Y',
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
        onChange: function(selectedDates, dateStr) {
          if (selectedDates.length > 0) {
            periodLabel.textContent = dateStr;
            // Trigger filter update logic here if actual filtering was implemented
          }
        },
        onClose: function() {
          // Close period menu after picking dates
          if (periodMenuOpen) togglePeriodMenu();
        }
      });
    }

    periodOptions.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const val = btn.dataset.value;
        if (val === 'custom') {
          // Don't close menu, flatpickr will open via the hidden input click natively
          // If flatpickr is explicitly initialized, we can open it:
          if (customPicker) {
             customPicker.open();
          }
        } else {
          periodLabel.textContent = btn.textContent;
          togglePeriodMenu();
          // Implement specific filter logic for today/yesterday/week/month here
        }
      });
    });
  }
})();

