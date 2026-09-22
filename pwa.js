(() => {
  "use strict";

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }

  let installPrompt = null;
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches
    || window.navigator.standalone === true;
  const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);

  function installInstructions() {
    const message = isIOS
      ? "在 Safari 底部点击“分享”，再选择“添加到主屏幕”。首次打开后即可离线游玩。"
      : "请打开浏览器菜单，选择“安装应用”或“添加到主屏幕”。首次打开后即可离线游玩。";
    window.alert(message);
  }

  function showInstallButton() {
    if (isStandalone || document.getElementById("pwa-install")) return;

    const style = document.createElement("style");
    style.textContent = `
      #pwa-install {
        position: fixed;
        z-index: 9999;
        right: 16px;
        bottom: calc(16px + env(safe-area-inset-bottom));
        min-height: 44px;
        padding: 0 16px;
        color: #fff;
        font: 500 14px "Noto Sans SC", "Microsoft YaHei UI", sans-serif;
        background: #e85d2a;
        border: 0;
        border-radius: 7px;
        box-shadow: 0 5px 0 #8f2f14, 0 10px 24px rgba(20, 40, 48, 0.24);
        cursor: pointer;
        touch-action: manipulation;
      }
      #pwa-install:active { transform: translateY(3px); box-shadow: 0 2px 0 #8f2f14; }
    `;

    const button = document.createElement("button");
    button.id = "pwa-install";
    button.type = "button";
    button.textContent = isIOS ? "添加到主屏幕" : "安装到手机";
    button.addEventListener("click", async () => {
      if (!installPrompt) {
        installInstructions();
        return;
      }
      installPrompt.prompt();
      await installPrompt.userChoice;
      installPrompt = null;
      button.remove();
    });

    document.head.appendChild(style);
    document.body.appendChild(button);
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
    showInstallButton();
  });

  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    document.getElementById("pwa-install")?.remove();
  });

  document.addEventListener("DOMContentLoaded", showInstallButton);
})();
