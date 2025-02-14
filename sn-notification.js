class SNNotification {
    static init() {
        if (!document.querySelector("#sn-notification-wrapper")) {
            const wrapper = document.createElement("div");
            wrapper.id = "sn-notification-wrapper";
            document.body.appendChild(wrapper);
            this.shadowRoot = wrapper.attachShadow({ mode: "open" });

            const container = document.createElement("div");
            container.id = "sn-notification-container";
            this.shadowRoot.appendChild(container);

            this.injectStyles();
        }
    }

    static show(message, duration = 5, position = "top-right") {
        const container = this.shadowRoot.querySelector("#sn-notification-container");
        container.className = `sn-notification-container ${position}`;

        const notification = document.createElement("div");
        notification.classList.add("sn-notification", "show");

        notification.innerHTML = `
            <span class="sn-time-counter">${duration}</span>
            <span class="sn-text">${message}</span>
            <div class="sn-progress-bar" style="transition: width ${duration}s linear"></div>
        `;

        container.prepend(notification);
        setTimeout(() => notification.querySelector(".sn-progress-bar").style.width = "0%", 10);

        let timeLeft = duration;
        const countdown = setInterval(() => {
            timeLeft -= 1;
            notification.querySelector(".sn-time-counter").textContent = timeLeft;
            if (timeLeft <= 0) clearInterval(countdown);
        }, 1000);

        setTimeout(() => SNNotification.remove(notification), duration * 1000);
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
                --sn-bg-color: #f4f4f4;
                --sn-text-color: #000;
                --sn-notification-bg: linear-gradient(135deg, #ff7eb3, #ff758c);
                --sn-progress-bg: rgba(255, 255, 255, 0.5);
            }
            #sn-notification-container {
                position: fixed;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
                padding: 10px;
            }
            .sn-notification-container.top-right { top: 20px; right: 20px; }
            .sn-notification-container.top-left { top: 20px; left: 20px; }
            .sn-notification-container.bottom-right { bottom: 20px; right: 20px; }
            .sn-notification-container.bottom-left { bottom: 20px; left: 20px; }
            .sn-notification {
                background: var(--sn-notification-bg);
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
            .sn-notification.show {
                transform: translateX(0);
            }
            .sn-time-counter {
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
            .sn-progress-bar {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 4px;
                background: var(--sn-progress-bg);
                width: 100%;
                transition: width linear;
            }
            .sn-text {
                flex-grow: 1;
            }
        `;
        this.shadowRoot.appendChild(style);
    }
}

document.addEventListener("DOMContentLoaded", () => SNNotification.init());
