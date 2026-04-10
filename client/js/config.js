(function () {
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  window.APP_CONFIG = {
    apiBaseUrl: isLocalhost ? "" : "https://your-backend-url.up.railway.app"
  };
})();
