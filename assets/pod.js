document.addEventListener("DOMContentLoaded", () => {
    const stats = document.querySelectorAll(".wemustpod-stat-value");

    if (!stats.length) return;

    const animateValue = (element) => {
        const original = element.textContent.trim();

        // Extract number
        const number = parseFloat(original.replace(/,/g, "").match(/[\d.]+/)[0]);

        // Extract suffix (%, Hour, etc.)
        const suffix = original.replace(/[\d.,]/g, "").trim();

        const hasComma = original.includes(",");
        const hasDecimal = original.includes(".");

        const duration = 2000;
        let start = null;

        const step = (timestamp) => {
            if (!start) start = timestamp;

            const progress = Math.min((timestamp - start) / duration, 1);

            const value = number * progress;

            let display;

            if (hasDecimal) {
                display = value.toFixed(2);
            } else {
                display = Math.floor(value).toString();
            }

            if (hasComma) {
                display = Number(display).toLocaleString();
            }

            element.textContent = `${display}${suffix ? " " + suffix : ""}`;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.textContent = original;
            }
        };

        requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    stats.forEach(animateValue);
                    obs.disconnect(); // Run only once
                }
            });
        },
        {
            threshold: 0.4
        }
    );

    observer.observe(document.querySelector(".wemustpod-stats-card"));
});