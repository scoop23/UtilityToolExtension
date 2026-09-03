(function() {
  var saved = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);

  document.addEventListener("DOMContentLoaded", function() {
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
