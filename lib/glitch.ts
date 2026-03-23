const SCRAMBLE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";

export class GlitchController {
  private intervalId: number | null = null;
  private effectTimeoutIds: number[] = [];
  private running = false;
  private activeRafIds: number[] = [];

  start() {
    if (this.running || typeof window === "undefined") {
      return;
    }

    this.running = true;
    this.scheduleNextTick();
  }

  stop() {
    this.running = false;

    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.effectTimeoutIds.forEach((id) => window.clearTimeout(id));
    this.effectTimeoutIds = [];

    this.activeRafIds.forEach((id) => cancelAnimationFrame(id));
    this.activeRafIds = [];
  }

  private scheduleNextTick() {
    if (!this.running) {
      return;
    }

    const delay = 8000 + Math.floor(Math.random() * 8001);
    this.intervalId = window.setInterval(() => {
      if (this.intervalId) {
        window.clearInterval(this.intervalId);
        this.intervalId = null;
      }

      this.runRandomEffect();
      this.scheduleNextTick();
    }, delay);
  }

  private runRandomEffect() {
    const effects = [
      () => this.textScramble(),
      () => this.colorShift(),
      () => this.scanlineSurge(),
      () => this.rgbSplit(),
      () => this.screenTear()
    ];

    const randomIndex = Math.floor(Math.random() * effects.length);
    effects[randomIndex]();
  }

  private textScramble() {
    const glitchElements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-glitch="true"]')
    );

    if (!glitchElements.length) {
      return;
    }

    const originals = glitchElements.map((el) => ({
      el,
      text: el.textContent ?? ""
    }));

    const makeRandomText = (length: number) =>
      Array.from({ length }, () => {
        const idx = Math.floor(Math.random() * SCRAMBLE_CHARS.length);
        return SCRAMBLE_CHARS[idx];
      }).join("");

    let frames = 0;
    const start = performance.now();

    const tick = () => {
      frames += 1;

      originals.forEach(({ el, text }) => {
        el.textContent = makeRandomText(text.length);
      });

      const elapsed = performance.now() - start;
      if (frames < 3 && elapsed < 120) {
        const rafId = requestAnimationFrame(tick);
        this.activeRafIds.push(rafId);
        return;
      }

      const restoreId = window.setTimeout(() => {
        originals.forEach(({ el, text }) => {
          el.textContent = text;
        });
      }, Math.max(0, 120 - elapsed));

      this.effectTimeoutIds.push(restoreId);
    };

    const rafId = requestAnimationFrame(tick);
    this.activeRafIds.push(rafId);
  }

  private colorShift() {
    document.body.classList.add("glitch-hue");
    const timeoutId = window.setTimeout(() => {
      document.body.classList.remove("glitch-hue");
    }, 80);
    this.effectTimeoutIds.push(timeoutId);
  }

  private scanlineSurge() {
    document.body.classList.add("glitch-scanline");
    const timeoutId = window.setTimeout(() => {
      document.body.classList.remove("glitch-scanline");
    }, 200);
    this.effectTimeoutIds.push(timeoutId);
  }

  private rgbSplit() {
    const rgbElements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-glitch-rgb="true"]')
    );

    rgbElements.forEach((el) => el.classList.add("glitch-rgb"));

    const timeoutId = window.setTimeout(() => {
      rgbElements.forEach((el) => el.classList.remove("glitch-rgb"));
    }, 150);
    this.effectTimeoutIds.push(timeoutId);
  }

  private screenTear() {
    const tear = document.createElement("div");
    tear.style.position = "absolute";
    tear.style.left = "0";
    tear.style.width = "100%";
    tear.style.height = "2px";
    tear.style.opacity = "0";
    tear.style.pointerEvents = "none";
    tear.style.background = "rgba(255, 230, 0, 0.6)";
    tear.style.zIndex = "2147483646";

    const yPercent = 20 + Math.random() * 60;
    const yPosition = (window.innerHeight * yPercent) / 100 + window.scrollY;
    tear.style.top = `${yPosition}px`;

    document.body.appendChild(tear);

    const fadeInTime = 30;
    const fadeOutTime = 70;

    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      if (elapsed <= fadeInTime) {
        tear.style.opacity = String(elapsed / fadeInTime);
        const rafId = requestAnimationFrame(animate);
        this.activeRafIds.push(rafId);
        return;
      }

      if (elapsed <= fadeInTime + fadeOutTime) {
        const fadeOutProgress = (elapsed - fadeInTime) / fadeOutTime;
        tear.style.opacity = String(1 - fadeOutProgress);
        const rafId = requestAnimationFrame(animate);
        this.activeRafIds.push(rafId);
        return;
      }

      tear.remove();
    };

    const rafId = requestAnimationFrame(animate);
    this.activeRafIds.push(rafId);
  }
}
