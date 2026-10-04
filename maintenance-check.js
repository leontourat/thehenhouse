(function () {
  "use strict";

  const API_URL =
    "https://thehenhouse-reservation.maxgamingdu4.workers.dev";

  const currentPath = window.location.pathname.toLowerCase();
  const currentPage = currentPath.split("/").pop() || "index.html";

  const allowedPages = [
    "maintenance.html",
    "events-admin.html"
  ];

  if (allowedPages.includes(currentPage)) return;

  let redirected = false;

  async function checkMaintenance() {
    if (redirected) return;

    try {
      const response = await fetch(`${API_URL}/maintenance`, {
        method: "GET",
        cache: "no-store",
        headers: { "Accept": "application/json" }
      });

      if (!response.ok) return;

      const data = await response.json();

      if (!data.success || !data.maintenance) return;

      redirected = true;

      const maintenancePage =
        currentPath.includes("/menu/")
          ? "../maintenance.html"
          : "maintenance.html";

      if (!currentPath.endsWith("/maintenance.html")) {
        window.location.replace(maintenancePage);
      }
    } catch (error) {
      console.warn(
        "Impossible de vérifier le mode maintenance.",
        error
      );
    }
  }

  checkMaintenance();
})();
