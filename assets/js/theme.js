/* ============================================================
   THEME INIT
   Runs immediately in <head> to prevent FOUC.
   ============================================================ */
(function () {
  const savedTheme = localStorage.getItem("theme");
  const theme = savedTheme || "light";
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset.theme = theme;
})();
