(function () {
    class SBNotification {
        static container;

        static initialize() {
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.className = 'sb-notification-container';
                document.body.appendChild(this.container);
            }
        }

        static show(message, duration = 5, position = 'top-right') {
            this.initialize();

            const notification = document.createElement('div');
            notification.className = `sb-notification sb-${position}`;
            
            const timeCounter = document.createElement('span');
            timeCounter.className = 'sb-time-counter';
            timeCounter.textContent = duration;

            const text = document.createElement('span');
            text.className = 'sb-text';
            text.textContent = message;

            const progressBar = document.createElement('div');
            progressBar.className = 'sb-progress-bar';
            progressBar.style.transition = `width ${duration}s linear`;

            notification.appendChild(timeCounter);
            notification.appendChild(text);
            notification.appendChild(progressBar);
            
            this.container.appendChild(notification);

            setTimeout(() => progressBar.style.width = '0%', 10);

            let timeLeft = duration;
            const countdown = setInterval(() => {
                timeLeft -= 1;
                timeCounter.textContent = timeLeft;
                if (timeLeft <= 0) {
                    clearInterval(countdown);
                }
            }, 1000);

            setTimeout(() => this.remove(notification), duration * 1000);
        }

        static remove(notification) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 500);
        }
    }

    // Inject Styles
    const style = document.createElement('style');
    style.textContent = `
        .sb-notification-container {
            position: fixed;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .sb-top-right { top: 20px; right: 20px; align-items: flex-end; }
        .sb-top-left { top: 20px; left: 20px; align-items: flex-start; }
        .sb-bottom-right { bottom: 20px; right: 20px; align-items: flex-end; }
        .sb-bottom-left { bottom: 20px; left: 20px; align-items: flex-start; }
        
        .sb-notification {
            background: linear-gradient(135deg, #ff7eb3, #ff758c);
            color: white;
            padding: 12px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            opacity: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 320px;
            min-height: 50px;
            position: relative;
            overflow: hidden;
            transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }

        .sb-notification .sb-time-counter {
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

        .sb-notification .sb-progress-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 4px;
            background: rgba(255, 255, 255, 0.5);
            width: 100%;
            transition: width linear;
        }
    `;
    document.head.appendChild(style);

    window.SBNotification = SBNotification;
})();
