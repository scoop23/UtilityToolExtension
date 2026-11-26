(function() {
  if (new URLSearchParams(window.location.search).get("mode") === "toolbar") {
    document.documentElement.classList.add("toolbar-popup");
  }

  var saved = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);

  document.addEventListener("DOMContentLoaded", function() {
    var clickAnimations = new WeakMap();
    document.addEventListener("click", function(event) {
      var button = event.target.closest("button");
      if (!button || button.disabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      var previous = clickAnimations.get(button);
      if (previous) previous.cancel();
      var animation = button.animate([
        { transform: "scale(1)", filter: "brightness(1)" },
        { transform: "scale(0.96)", filter: "brightness(1.15)", offset: 0.3 },
        { transform: "scale(1)", filter: "brightness(1)" }
      ], { duration: 220, easing: "ease-out" });
      clickAnimations.set(button, animation);
    });

    var btn = document.getElementById("theme-toggle");
    if (!btn) return;

    function updateIcon() {
      var isDark = document.documentElement.getAttribute("data-theme") === "dark";
      btn.textContent = isDark ? "\u2600" : "\u263E";
    }
    updateIcon();

    btn.addEventListener("click", function() {
      var isDark = document.documentElement.getAttribute("data-theme") === "dark";
      var next = isDark ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      updateIcon();
    });
  });
})();
