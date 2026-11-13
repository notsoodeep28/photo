(() => {
  const preferenceKey = "curious-observer-theme";
  const root = document.documentElement;
  const themeColor = document.querySelector('meta[name="theme-color"]');

  let theme = "dark";
  try {
    theme = localStorage.getItem(preferenceKey) === "light" ? "light" : "dark";
  } catch {
    // Theme switching still works for this page when storage is unavailable.
  }

  const applyTheme = (nextTheme) => {
    theme = nextTheme;
    root.dataset.theme = theme;
    if (themeColor) {
      themeColor.content = theme === "light" ? "#EAE6DD" : "#0B0B0F";
    }

    const toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      const nextLabel = theme === "light" ? "Turn light theme off" : "Turn light theme on";
      toggle.setAttribute("aria-label", nextLabel);
      toggle.setAttribute("aria-pressed", String(theme === "light"));
    }
  };

  applyTheme(theme);

  const initializeToggle = () => {
    const toggle = document.querySelector(".theme-toggle");
    if (!toggle) {
      return;
    }

    applyTheme(theme);
    toggle.addEventListener("click", () => {
      const nextTheme = theme === "light" ? "dark" : "light";
      applyTheme(nextTheme);
      try {
        localStorage.setItem(preferenceKey, nextTheme);
      } catch {
        // The selected theme remains active until the page is closed.
      }
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeToggle, { once: true });
  } else {
    initializeToggle();
  }
})();
