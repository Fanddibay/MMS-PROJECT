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
const themeIcon = themeToggle.querySelector("i");
const panelToggle = document.getElementById("panelToggle");
const leftPanel = document.getElementById("leftPanel");
const zoomInBtn = document.getElementById("zoomInBtn");
const zoomOutBtn = document.getElementById("zoomOutBtn");
const footerInner = document.getElementById("footerInner");
const bottomBar = document.getElementById("bottomBar");
const bottomToggle = document.getElementById("bottomToggle");
const crosshairBtn = document.getElementById("crosshairBtn");
const catalogOverlay = document.getElementById("catalogOverlay");
const catalogCloseBtn = document.getElementById("catalogCloseBtn");

const map = new maplibregl.Map({
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

function syncThemeIcon() {
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

  const currentStyle = map.getStyle()?.sprite || "";
  const styleShouldContain = isDark ? "dark-matter" : "positron";
  if (!currentStyle.includes(styleShouldContain)) {
    map.setStyle(MAP_STYLE[theme]);
  }
}

themeToggle.addEventListener("click", () => {
  const next = root.classList.contains("dark") ? THEMES.light : THEMES.dark;
  applyTheme(next);
});

function setPanelState(open) {
  if (window.innerWidth >= 768) {
    leftPanel.classList.remove("-translate-x-[120%]");
    return;
  }
  leftPanel.classList.toggle("-translate-x-[120%]", !open);
}

panelToggle.addEventListener("click", () => {
  const hidden = leftPanel.classList.contains("-translate-x-[120%]");
  setPanelState(hidden);
});

zoomInBtn.addEventListener("click", () => map.zoomIn({ duration: 250 }));
zoomOutBtn.addEventListener("click", () => map.zoomOut({ duration: 250 }));

window.addEventListener("resize", () => setPanelState(false));

function setCatalogOpen(open) {
  if (!catalogOverlay || !crosshairBtn) return;
  catalogOverlay.classList.toggle("hidden", !open);
  catalogOverlay.setAttribute("aria-hidden", String(!open));
  crosshairBtn.setAttribute("aria-expanded", String(open));
}

if (crosshairBtn && catalogOverlay) {
  const backdrop = catalogOverlay.querySelector("[data-overlay-backdrop]");

  crosshairBtn.addEventListener("click", () => {
    const isHidden = catalogOverlay.classList.contains("hidden");
    setCatalogOpen(isHidden);
  });

  catalogCloseBtn?.addEventListener("click", () => setCatalogOpen(false));

  backdrop?.addEventListener("click", () => setCatalogOpen(false));

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setCatalogOpen(false);
  });
}

function setBottomBarCollapsed(collapsed) {
  if (!footerInner || !bottomBar || !bottomToggle) return;

  footerInner.classList.toggle("bottom-collapsed", collapsed);
  bottomToggle.setAttribute("aria-expanded", String(!collapsed));

  if (!collapsed) {
    // ensure we animate to the real content height
    bottomBar.style.maxHeight = "0px";
    bottomBar.style.opacity = "0";
    bottomBar.style.transform = "translateY(10px)";
    requestAnimationFrame(() => {
      const h = bottomBar.scrollHeight;
      bottomBar.style.maxHeight = `${h}px`;
      bottomBar.style.opacity = "1";
      bottomBar.style.transform = "translateY(0)";
    });
  } else {
    const h = bottomBar.scrollHeight;
    bottomBar.style.maxHeight = `${h}px`;
    requestAnimationFrame(() => {
      bottomBar.style.maxHeight = "0px";
      bottomBar.style.opacity = "0";
      bottomBar.style.transform = "translateY(10px)";
    });
  }
}

if (bottomToggle && footerInner && bottomBar) {
  // init expanded height
  bottomBar.style.maxHeight = `${bottomBar.scrollHeight}px`;
  bottomToggle.addEventListener("click", () => {
    const collapsed = footerInner.classList.contains("bottom-collapsed");
    setBottomBarCollapsed(!collapsed);
  });
  window.addEventListener("resize", () => {
    if (!footerInner.classList.contains("bottom-collapsed")) {
      bottomBar.style.maxHeight = `${bottomBar.scrollHeight}px`;
    }
  });
}

syncThemeIcon();
body.classList.toggle("light-theme", !root.classList.contains("dark"));
setPanelState(false);
