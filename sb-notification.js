class SBNotification {
    static init() {
        if (!document.querySelector("#sb-notification-wrapper")) {
            const wrapper = document.createElement("div");
            wrapper.id = "sb-notification-wrapper";
            document.body.appendChild(wrapper);
            this.shadowRoot = wrapper.attachShadow({ mode: "open" });

            const container = document.createElement("div");
            container.id = "sb-notification-container";
            this.shadowRoot.appendChild(container);

            this.injectStyles();
        }
    }

    static show(message, duration = 5, position = "top-right") {
        const container = this.shadowRoot.querySelector("#sb-notification-container");
        container.className = `sb-notification-container ${position}`;

        const notification = document.createElement("div");
        notification.classList.add("sb-notification", "show");

        notification.innerHTML = `
            <span class="sb-time-counter">${duration}</span>
            <span class="sb-text">${message}</span>
            <div class="sb-progress-bar" style="transition: width ${duration}s linear"></div>
        `;

        container.prepend(notification);
        setTimeout(() => notification.querySelector(".sb-progress-bar").style.width = "0%", 10);

        let timeLeft = duration;
        const countdown = setInterval(() => {
            timeLeft -= 1;
            notification.querySelector(".sb-time-counter").textContent = timeLeft;
            if (timeLeft <= 0) clearInterval(countdown);
        }, 1000);

        setTimeout(() => SBNotification.remove(notification), duration * 1000);
    }

    static remove(notification) {
        notification.style.opacity = "0";
        notification.style.transform = "translateX(100%)";
        setTimeout(() => notification.remove(), 500);
    }

    static injectStyles() {
        if (this.shadowRoot.querySelector("style")) return;
        
        const style = document.createElement("style");
        style.textContent = `
            :host {
                --sb-bg-color: #f4f4f4;
                --sb-text-color: #000;
                --sb-notification-bg: linear-gradient(135deg, #ff7eb3, #ff758c);
                --sb-progress-bg: rgba(255, 255, 255, 0.5);
            }
            #sb-notification-container {
                position: fixed;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
                padding: 10px;
            }
            .sb-notification-container.top-right { top: 20px; right: 20px; }
            .sb-notification-container.top-left { top: 20px; left: 20px; }
            .sb-notification-container.bottom-right { bottom: 20px; right: 20px; }
            .sb-notification-container.bottom-left { bottom: 20px; left: 20px; }
            .sb-notification {
                background: var(--sb-notification-bg);
                color: white;
                padding: 12px;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                opacity: 1;
                transform: translateX(100%);
                transition: opacity 0.5s ease-out, transform 0.5s ease-out;
                position: relative;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 300px;
                min-height: 50px;
            }
            .sb-notification.show {
                transform: translateX(0);
            }
            .sb-time-counter {
                font-size: 14px;
                font-weight: bold;
                color: white;
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid white;
                border-radius: 50%;
                flex-shrink: 0;
                margin-right: 10px;
            }
            .sb-progress-bar {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 4px;
                background: var(--sb-progress-bg);
                width: 100%;
                transition: width linear;
            }
            .sb-text {
                flex-grow: 1;
            }
        `;
        this.shadowRoot.appendChild(style);
    }
}

document.addEventListener("DOMContentLoaded", () => SBNotification.init());
