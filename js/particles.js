// ==========================================================================
// The Grand Horizon — Multi-Layer Particle FX System
// Effects: Hero floating dust, gold bokeh orbs, firefly constellation,
//          shooting stars, mouse-trail sparkles, section ambient motes,
//          spa ripple rings, newsletter confetti burst, cursor glow aura
// ==========================================================================

const ParticleFX = (() => {
  /* ---- Shared Utilities ---- */
  const rand  = (min, max) => Math.random() * (max - min) + min;
  const randI = (min, max) => Math.floor(rand(min, max));
  const PI2   = Math.PI * 2;

  // Detect reduced-motion preference
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // =========================================================================
  // 1. HERO CANVAS — floating gold dust + bokeh orbs + shooting stars
  // =========================================================================
  function initHeroCanvas() {
    const section = document.getElementById("hero");
    if (!section) return;

    const canvas = document.createElement("canvas");
    canvas.id = "heroParticleCanvas";
    canvas.style.cssText = `
      position:absolute; inset:0; width:100%; height:100%;
      pointer-events:none; z-index:2; opacity:0.75;
    `;
    section.style.position = "relative";
    section.insertBefore(canvas, section.firstChild);

    const ctx = canvas.getContext("2d");
    let W, H, animId;
    let dustParticles = [], bokehOrbs = [], stars = [], shooters = [];

    // ----- Resize -----
    function resize() {
      W = canvas.width  = section.offsetWidth;
      H = canvas.height = section.offsetHeight;
    }

    // ----- Dust Mote (small floating specks) -----
    function makeDust() {
      return {
        x:  rand(0, W),
        y:  rand(0, H),
        r:  rand(0.5, 2.2),
        alpha: rand(0.1, 0.55),
        speed: rand(0.15, 0.6),
        angle: rand(0, PI2),
        wobble: rand(0.004, 0.018),
        wobbleAmt: rand(0.3, 1.5),
        hue: rand(38, 54)        // gold range
      };
    }

    // ----- Bokeh Orb (blurred glowing circle) -----
    function makeOrb() {
      return {
        x:  rand(0, W),
        y:  rand(0, H),
        r:  rand(18, 90),
        alpha: rand(0.025, 0.09),
        speed: rand(0.03, 0.14),
        angle: rand(0, PI2),
        hue: rand(35, 58),
        pulse: rand(0, PI2),
        pulseSpeed: rand(0.004, 0.012)
      };
    }

    // ----- Background star (tiny fixed twinkle) -----
    function makeStar() {
      return {
        x: rand(0, W),
        y: rand(0, H * 0.6),
        r: rand(0.3, 1.1),
        alpha: rand(0.3, 0.9),
        twinkleSpeed: rand(0.008, 0.025),
        twinkleDir: Math.random() > 0.5 ? 1 : -1
      };
    }

    // ----- Shooting Star -----
    function makeShooter() {
      const angle = rand(Math.PI * 0.1, Math.PI * 0.4);
      return {
        x:  rand(W * 0.1, W * 0.9),
        y:  rand(H * 0.0, H * 0.3),
        len:  rand(80, 220),
        speed: rand(5, 12),
        angle,
        alpha: 1,
        active: true
      };
    }

    // ----- Init populations -----
    function populate() {
      dustParticles = Array.from({ length: 160 }, makeDust);
      bokehOrbs     = Array.from({ length: 22  }, makeOrb);
      stars         = Array.from({ length: 100 }, makeStar);
      shooters      = [];
    }

    // ----- Draw dust -----
    function drawDust(d) {
      d.angle   += d.wobble;
      d.x       += Math.cos(d.angle) * d.wobbleAmt;
      d.y       -= d.speed;
      if (d.y < -4) { d.y = H + 4; d.x = rand(0, W); }

      ctx.save();
      ctx.globalAlpha = d.alpha;
      ctx.fillStyle   = `hsl(${d.hue},85%,65%)`;
      ctx.shadowColor = `hsl(${d.hue},100%,70%)`;
      ctx.shadowBlur  = 4;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, PI2);
      ctx.fill();
      ctx.restore();
    }

    // ----- Draw bokeh -----
    function drawOrb(o) {
      o.pulse  += o.pulseSpeed;
      o.angle  += 0.004;
      o.x      += Math.cos(o.angle) * o.speed;
      o.y      += Math.sin(o.angle) * o.speed * 0.4;
      const pAlpha = o.alpha + Math.sin(o.pulse) * 0.025;

      if (o.x > W + o.r) o.x = -o.r;
      if (o.x < -o.r)    o.x = W + o.r;
      if (o.y > H + o.r) o.y = -o.r;
      if (o.y < -o.r)    o.y = H + o.r;

      const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
      grad.addColorStop(0, `hsla(${o.hue},90%,65%,${pAlpha})`);
      grad.addColorStop(1, `hsla(${o.hue},80%,50%,0)`);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, PI2);
      ctx.fill();
      ctx.restore();
    }

    // ----- Draw star -----
    function drawStar(s) {
      s.alpha += s.twinkleSpeed * s.twinkleDir;
      if (s.alpha >= 0.95) s.twinkleDir = -1;
      if (s.alpha <= 0.1)  s.twinkleDir =  1;

      ctx.save();
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle   = "#fff";
      ctx.shadowColor = "#ffe8a0";
      ctx.shadowBlur  = 3;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, PI2);
      ctx.fill();
      ctx.restore();
    }

    // ----- Draw shooter -----
    function drawShooter(sh) {
      sh.x    += Math.cos(sh.angle) * sh.speed;
      sh.y    += Math.sin(sh.angle) * sh.speed;
      sh.alpha -= 0.018;
      if (sh.alpha <= 0 || sh.x > W + 50 || sh.y > H + 50) {
        sh.active = false;
        return;
      }
      const tx = sh.x - Math.cos(sh.angle) * sh.len;
      const ty = sh.y - Math.sin(sh.angle) * sh.len;
      const grad = ctx.createLinearGradient(tx, ty, sh.x, sh.y);
      grad.addColorStop(0, `rgba(212,175,55,0)`);
      grad.addColorStop(1, `rgba(240,220,120,${sh.alpha})`);

      ctx.save();
      ctx.strokeStyle = grad;
      ctx.lineWidth   = 2;
      ctx.shadowColor = "#d4af37";
      ctx.shadowBlur  = 10;
      ctx.globalAlpha = sh.alpha;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(sh.x, sh.y);
      ctx.stroke();
      ctx.restore();
    }

    let frame = 0;
    function loop() {
      ctx.clearRect(0, 0, W, H);
      frame++;

      // Spawn shooting star randomly
      if (frame % 220 === 0 && shooters.length < 4) {
        shooters.push(makeShooter());
      }

      stars.forEach(drawStar);
      bokehOrbs.forEach(drawOrb);
      dustParticles.forEach(drawDust);
      shooters = shooters.filter(sh => { drawShooter(sh); return sh.active; });

      animId = requestAnimationFrame(loop);
    }

    window.addEventListener("resize", () => { resize(); populate(); });
    resize();
    populate();
    if (!prefersReducedMotion) loop();
  }

  // =========================================================================
  // 2. MOUSE-TRAIL SPARKLE — gold sparks follow the cursor
  // =========================================================================
  function initMouseTrail() {
    const canvas = document.createElement("canvas");
    canvas.id = "mouseTrailCanvas";
    canvas.style.cssText = `
      position:fixed; inset:0; width:100%; height:100%;
      pointer-events:none; z-index:9999; mix-blend-mode:screen;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    let W = window.innerWidth, H = window.innerHeight;
    let mouse = { x: -200, y: -200 };
    let trail = [];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resize);
    resize();

    function makeTrailParticle(x, y) {
      const angle = rand(0, PI2);
      const speed = rand(0.6, 2.8);
      return {
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - rand(0.5, 1.5),
        r:  rand(1.5, 4),
        alpha: rand(0.6, 1),
        decay: rand(0.025, 0.06),
        hue: rand(40, 55),
        shape: Math.random() > 0.5 ? "circle" : "diamond"
      };
    }

    document.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      // Spawn 3-5 particles per move
      const count = randI(2, 5);
      for (let i = 0; i < count; i++) {
        trail.push(makeTrailParticle(mouse.x + rand(-6, 6), mouse.y + rand(-6, 6)));
      }
    });

    function drawDiamond(ctx, x, y, r) {
      ctx.beginPath();
      ctx.moveTo(x, y - r);
      ctx.lineTo(x + r, y);
      ctx.lineTo(x, y + r);
      ctx.lineTo(x - r, y);
      ctx.closePath();
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      trail = trail.filter(p => p.alpha > 0);
      trail.forEach(p => {
        p.x     += p.vx;
        p.y     += p.vy;
        p.vy    += 0.04;         // gentle gravity
        p.alpha -= p.decay;
        p.r     *= 0.97;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle   = `hsl(${p.hue},95%,65%)`;
        ctx.shadowColor = `hsl(${p.hue},100%,70%)`;
        ctx.shadowBlur  = 8;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, PI2);
          ctx.fill();
        } else {
          drawDiamond(ctx, p.x, p.y, p.r);
          ctx.fill();
        }
        ctx.restore();
      });

      requestAnimationFrame(loop);
    }
    if (!prefersReducedMotion) loop();
  }

  // =========================================================================
  // 3. CURSOR GLOW AURA — soft radial glow that follows cursor
  // =========================================================================
  function initCursorGlow() {
    const el = document.createElement("div");
    el.id = "cursorGlow";
    el.style.cssText = `
      position:fixed; width:280px; height:280px;
      border-radius:50%;
      background: radial-gradient(circle, rgba(212,175,55,0.14) 0%, transparent 70%);
      pointer-events:none; z-index:9998;
      transform:translate(-50%,-50%);
      transition: left 0.08s linear, top 0.08s linear;
      will-change: left, top;
    `;
    document.body.appendChild(el);

    document.addEventListener("mousemove", (e) => {
      el.style.left = e.clientX + "px";
      el.style.top  = e.clientY + "px";
    });
  }

  // =========================================================================
  // 4. FIREFLY CONSTELLATION — section-wide floating fireflies with connecting lines
  // =========================================================================
  function initFireflies(containerId, numFlies = 32) {
    const section = document.getElementById(containerId);
    if (!section) return;

    const canvas = document.createElement("canvas");
    canvas.style.cssText = `
      position:absolute; inset:0; width:100%; height:100%;
      pointer-events:none; z-index:0; opacity:0.55;
    `;
    section.style.position = "relative";
    // Push canvas behind existing content
    section.insertBefore(canvas, section.firstChild);

    const ctx = canvas.getContext("2d");
    let W, H;

    function resize() {
      W = canvas.width  = section.offsetWidth;
      H = canvas.height = section.offsetHeight;
    }

    function makeFly() {
      return {
        x: rand(0, W),
        y: rand(0, H),
        r: rand(1, 2.6),
        alpha: rand(0.2, 0.9),
        vx: rand(-0.3, 0.3),
        vy: rand(-0.3, 0.3),
        pulse: rand(0, PI2),
        pulseSpeed: rand(0.02, 0.06),
        hue: rand(40, 60)
      };
    }

    let flies = [];

    function populate() {
      flies = Array.from({ length: numFlies }, makeFly);
    }

    const CONNECT_DIST = 110;

    function loop() {
      ctx.clearRect(0, 0, W, H);

      flies.forEach(f => {
        f.x     += f.vx;
        f.y     += f.vy;
        f.pulse += f.pulseSpeed;
        const a  = f.alpha * (0.5 + 0.5 * Math.sin(f.pulse));

        if (f.x < 0 || f.x > W) f.vx *= -1;
        if (f.y < 0 || f.y > H) f.vy *= -1;

        // Glow
        ctx.save();
        ctx.globalAlpha = a;
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 4);
        g.addColorStop(0, `hsl(${f.hue},90%,70%)`);
        g.addColorStop(1, `hsla(${f.hue},80%,50%,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r * 4, 0, PI2);
        ctx.fill();
        ctx.restore();

        // Core dot
        ctx.save();
        ctx.globalAlpha = Math.min(1, a * 1.4);
        ctx.fillStyle   = `hsl(${f.hue},95%,78%)`;
        ctx.shadowColor = `hsl(${f.hue},100%,70%)`;
        ctx.shadowBlur  = 6;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, PI2);
        ctx.fill();
        ctx.restore();
      });

      // Connection lines between close fireflies
      for (let i = 0; i < flies.length; i++) {
        for (let j = i + 1; j < flies.length; j++) {
          const dx   = flies[i].x - flies[j].x;
          const dy   = flies[i].y - flies[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const lineAlpha = (1 - dist / CONNECT_DIST) * 0.25;
            ctx.save();
            ctx.globalAlpha  = lineAlpha;
            ctx.strokeStyle  = "rgba(212,175,55,1)";
            ctx.lineWidth    = 0.7;
            ctx.shadowColor  = "rgba(212,175,55,0.5)";
            ctx.shadowBlur   = 4;
            ctx.beginPath();
            ctx.moveTo(flies[i].x, flies[i].y);
            ctx.lineTo(flies[j].x, flies[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      requestAnimationFrame(loop);
    }

    window.addEventListener("resize", () => { resize(); populate(); });
    resize();
    populate();
    if (!prefersReducedMotion) loop();
  }

  // =========================================================================
  // 5. SPA RIPPLE RINGS — calm concentric expanding rings in the spa section
  // =========================================================================
  function initSpaRipples() {
    const section = document.getElementById("spa");
    if (!section) return;

    const canvas = document.createElement("canvas");
    canvas.style.cssText = `
      position:absolute; inset:0; width:100%; height:100%;
      pointer-events:none; z-index:0; opacity:0.4;
    `;
    section.style.position = "relative";
    section.insertBefore(canvas, section.firstChild);

    const ctx = canvas.getContext("2d");
    let W, H, rings = [];

    function resize() {
      W = canvas.width  = section.offsetWidth;
      H = canvas.height = section.offsetHeight;
    }

    function makeRing() {
      return {
        x:     rand(W * 0.1, W * 0.9),
        y:     rand(H * 0.1, H * 0.9),
        r:     0,
        maxR:  rand(60, 160),
        speed: rand(0.4, 1.0),
        alpha: rand(0.4, 0.75),
        hue:   rand(170, 210),   // teal / cyan spa palette
        lineW: rand(0.8, 2)
      };
    }

    function populate() {
      rings = Array.from({ length: 8 }, () => {
        const r = makeRing();
        r.r = rand(0, r.maxR);  // stagger initial radii
        return r;
      });
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      rings.forEach(r => {
        r.r     += r.speed;
        const progress = r.r / r.maxR;
        const a = r.alpha * (1 - progress);

        ctx.save();
        ctx.globalAlpha  = Math.max(0, a);
        ctx.strokeStyle  = `hsl(${r.hue},70%,65%)`;
        ctx.lineWidth    = r.lineW * (1 - progress * 0.5);
        ctx.shadowColor  = `hsl(${r.hue},80%,60%)`;
        ctx.shadowBlur   = 8;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, PI2);
        ctx.stroke();
        ctx.restore();

        if (r.r >= r.maxR) {
          Object.assign(r, makeRing());
        }
      });
      requestAnimationFrame(loop);
    }

    window.addEventListener("resize", () => { resize(); populate(); });
    resize();
    populate();
    if (!prefersReducedMotion) loop();
  }

  // =========================================================================
  // 6. AMBIENT GOLD SNOW — gentle descent across the about/heritage section
  // =========================================================================
  function initGoldSnow(containerId) {
    const section = document.getElementById(containerId);
    if (!section) return;

    const canvas = document.createElement("canvas");
    canvas.style.cssText = `
      position:absolute; inset:0; width:100%; height:100%;
      pointer-events:none; z-index:0; opacity:0.35;
    `;
    section.style.position = "relative";
    section.insertBefore(canvas, section.firstChild);

    const ctx = canvas.getContext("2d");
    let W, H, flakes = [];

    function resize() {
      W = canvas.width  = section.offsetWidth;
      H = canvas.height = section.offsetHeight;
    }

    function makeFlake() {
      return {
        x:    rand(0, W),
        y:    rand(-10, H),
        r:    rand(0.8, 3),
        vy:   rand(0.3, 0.9),
        vx:   rand(-0.3, 0.3),
        alpha: rand(0.3, 0.75),
        hue:  rand(40, 55),
        rot:   rand(0, PI2),
        rotS:  rand(-0.02, 0.02),
        type:  randI(0, 3)   // 0=circle, 1=diamond, 2=cross
      };
    }

    function populate() {
      flakes = Array.from({ length: 55 }, makeFlake);
    }

    function drawFlake(f) {
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.rot);
      ctx.globalAlpha = f.alpha;
      ctx.fillStyle   = `hsl(${f.hue},85%,65%)`;
      ctx.strokeStyle = `hsl(${f.hue},90%,75%)`;
      ctx.lineWidth   = 0.8;
      ctx.shadowColor = `hsl(${f.hue},100%,70%)`;
      ctx.shadowBlur  = 5;

      if (f.type === 0) {
        ctx.beginPath();
        ctx.arc(0, 0, f.r, 0, PI2);
        ctx.fill();
      } else if (f.type === 1) {
        ctx.beginPath();
        ctx.moveTo(0, -f.r);
        ctx.lineTo(f.r, 0);
        ctx.lineTo(0, f.r);
        ctx.lineTo(-f.r, 0);
        ctx.closePath();
        ctx.fill();
      } else {
        // Cross / star shape
        const len = f.r * 1.6;
        ctx.beginPath();
        ctx.moveTo(-len, 0); ctx.lineTo(len, 0);
        ctx.moveTo(0, -len); ctx.lineTo(0, len);
        ctx.moveTo(-len * 0.7, -len * 0.7); ctx.lineTo(len * 0.7, len * 0.7);
        ctx.moveTo(len * 0.7, -len * 0.7);  ctx.lineTo(-len * 0.7, len * 0.7);
        ctx.stroke();
      }
      ctx.restore();
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      flakes.forEach(f => {
        f.x   += f.vx;
        f.y   += f.vy;
        f.rot += f.rotS;
        if (f.y > H + 10) { f.y = -10; f.x = rand(0, W); }
        if (f.x > W + 10) f.x = -10;
        if (f.x < -10)    f.x = W + 10;
        drawFlake(f);
      });
      requestAnimationFrame(loop);
    }

    window.addEventListener("resize", () => { resize(); populate(); });
    resize();
    populate();
    if (!prefersReducedMotion) loop();
  }

  // =========================================================================
  // 7. NEWSLETTER CONFETTI BURST — triggered on successful newsletter signup
  // =========================================================================
  function burstConfetti(originX, originY, count = 90) {
    const canvas = document.getElementById("confettiCanvas") || (() => {
      const c = document.createElement("canvas");
      c.id = "confettiCanvas";
      c.style.cssText = `
        position:fixed; inset:0; width:100%; height:100%;
        pointer-events:none; z-index:10000;
      `;
      document.body.appendChild(c);
      return c;
    })();

    const ctx = canvas.getContext("2d");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const COLORS = [
      "#d4af37","#f4e8c1","#e6c55d","#fffbe7",
      "#c0a020","#ffd700","#ffffff","#b89028"
    ];

    const pieces = Array.from({ length: count }, () => ({
      x:    originX,
      y:    originY,
      vx:   rand(-8, 8),
      vy:   rand(-14, -4),
      r:    rand(4, 10),
      color: COLORS[randI(0, COLORS.length)],
      rot:   rand(0, PI2),
      rotV:  rand(-0.15, 0.15),
      alpha: 1,
      type: randI(0, 3)
    }));

    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;

      pieces.forEach(p => {
        p.x     += p.vx;
        p.y     += p.vy;
        p.vy    += 0.35;
        p.vx    *= 0.98;
        p.rot   += p.rotV;
        p.alpha -= 0.013;

        if (p.alpha <= 0) return;
        alive++;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle   = p.color;

        if (p.type === 0) {
          ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6);
        } else if (p.type === 1) {
          ctx.beginPath();
          ctx.arc(0, 0, p.r / 2, 0, PI2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(0, -p.r);
          ctx.lineTo(p.r * 0.6, p.r * 0.4);
          ctx.lineTo(-p.r * 0.6, p.r * 0.4);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      });

      if (alive > 0) {
        requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    requestAnimationFrame(frame);
  }

  // =========================================================================
  // 8. SCROLL-REVEAL PARTICLE BURST — tiny starburst when section enters view
  // =========================================================================
  function initScrollBurst() {
    const sections = document.querySelectorAll("section[id]");
    const triggered = new Set();

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        if (entry.isIntersecting && !triggered.has(id)) {
          triggered.add(id);
          const rect = entry.target.getBoundingClientRect();
          const cx   = rect.left + rect.width / 2;
          const cy   = rect.top  + 40;
          miniStarburst(cx, cy, 28);
        }
      });
    }, { threshold: 0.1 });

    sections.forEach(s => obs.observe(s));
  }

  function miniStarburst(cx, cy, count) {
    const canvas = document.getElementById("confettiCanvas") || (() => {
      const c = document.createElement("canvas");
      c.id = "confettiCanvas";
      c.style.cssText = `
        position:fixed; inset:0; width:100%; height:100%;
        pointer-events:none; z-index:10000;
      `;
      document.body.appendChild(c);
      return c;
    })();

    const ctx = canvas.getContext("2d");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const sparks = Array.from({ length: count }, () => {
      const angle = rand(0, PI2);
      const speed = rand(1.5, 5);
      return {
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r:  rand(1.5, 3.5),
        alpha: 1,
        hue: rand(40, 58)
      };
    });

    function frame() {
      sparks.forEach(s => {
        s.x     += s.vx;
        s.y     += s.vy;
        s.vy    += 0.1;
        s.alpha -= 0.03;
        s.r     *= 0.97;
        if (s.alpha <= 0) return;

        ctx.save();
        ctx.globalAlpha = Math.max(0, s.alpha);
        ctx.fillStyle   = `hsl(${s.hue},90%,65%)`;
        ctx.shadowColor = `hsl(${s.hue},100%,70%)`;
        ctx.shadowBlur  = 6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, PI2);
        ctx.fill();
        ctx.restore();
      });

      if (sparks.some(s => s.alpha > 0)) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    requestAnimationFrame(frame);
  }

  // =========================================================================
  // 9. BUTTON CLICK RING BURST — ripple when any .btn is clicked
  // =========================================================================
  function initButtonRipple() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn");
      if (!btn) return;
      const rect  = btn.getBoundingClientRect();
      const cx    = e.clientX;
      const cy    = e.clientY;

      let ring = { r: 0, alpha: 0.7, x: cx, y: cy };

      const canvas = document.getElementById("confettiCanvas") || (() => {
        const c = document.createElement("canvas");
        c.id = "confettiCanvas";
        c.style.cssText = `
          position:fixed; inset:0; width:100%; height:100%;
          pointer-events:none; z-index:10000;
        `;
        document.body.appendChild(c);
        return c;
      })();

      const ctx = canvas.getContext("2d");
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;

      function frame() {
        ctx.clearRect(cx - 180, cy - 180, 360, 360);
        ring.r     += 7;
        ring.alpha -= 0.045;
        if (ring.alpha <= 0) return;

        ctx.save();
        ctx.globalAlpha  = ring.alpha;
        ctx.strokeStyle  = "#d4af37";
        ctx.lineWidth    = 2.5;
        ctx.shadowColor  = "#d4af37";
        ctx.shadowBlur   = 14;
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.r, 0, PI2);
        ctx.stroke();
        ctx.restore();

        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    });
  }

  // =========================================================================
  // 10. HEADER GOLD SHIMMER PARTICLES — tiny sparks in the header area
  // =========================================================================
  function initHeaderShimmer() {
    const header = document.querySelector(".main-header");
    if (!header) return;

    const canvas = document.createElement("canvas");
    canvas.style.cssText = `
      position:absolute; inset:0; width:100%; height:100%;
      pointer-events:none; z-index:0;
    `;
    header.style.position = "relative";
    header.insertBefore(canvas, header.firstChild);

    const ctx = canvas.getContext("2d");
    let W, H, sparks = [];

    function resize() {
      W = canvas.width  = header.offsetWidth;
      H = canvas.height = header.offsetHeight;
    }

    function makeSpark() {
      return {
        x:    rand(0, W),
        y:    rand(0, H),
        r:    rand(0.5, 2),
        alpha: rand(0, 0.6),
        fadeDir: 1,
        fadeSpeed: rand(0.008, 0.025),
        hue: rand(38, 56)
      };
    }

    function populate() {
      sparks = Array.from({ length: 35 }, makeSpark);
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      sparks.forEach(s => {
        s.alpha += s.fadeSpeed * s.fadeDir;
        if (s.alpha >= 0.65) s.fadeDir = -1;
        if (s.alpha <= 0)    { Object.assign(s, makeSpark()); s.alpha = 0; s.fadeDir = 1; }

        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle   = `hsl(${s.hue},90%,70%)`;
        ctx.shadowColor = `hsl(${s.hue},100%,75%)`;
        ctx.shadowBlur  = 4;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, PI2);
        ctx.fill();
        ctx.restore();
      });
      requestAnimationFrame(loop);
    }

    window.addEventListener("resize", () => { resize(); populate(); });
    resize();
    populate();
    if (!prefersReducedMotion) loop();
  }

  // =========================================================================
  // Public bootstrap
  // =========================================================================
  function init() {
    // Core hero canvas
    initHeroCanvas();

    // Mouse trail + cursor glow (desktop only)
    if (window.matchMedia("(pointer: fine)").matches) {
      initMouseTrail();
      initCursorGlow();
    }

    // Header shimmer
    initHeaderShimmer();

    // Firefly constellations in selected sections
    initFireflies("amenities", 28);
    initFireflies("reviews", 20);

    // Spa ripple rings
    initSpaRipples();

    // Gold snow/motes in heritage and dining sections
    initGoldSnow("about");
    initGoldSnow("dining");

    // Scroll burst on section entry
    initScrollBurst();

    // Button click ripple
    initButtonRipple();

    // Patch newsletter form to trigger confetti
    const form = document.getElementById("newsletterForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        const btn  = form.querySelector("button[type='submit']");
        const rect = btn ? btn.getBoundingClientRect() : null;
        const cx   = rect ? rect.left + rect.width  / 2 : window.innerWidth  / 2;
        const cy   = rect ? rect.top  + rect.height / 2 : window.innerHeight / 2;
        setTimeout(() => burstConfetti(cx, cy, 110), 120);
      });
    }
  }

  return { init, burstConfetti };
})();

// Auto-launch after DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ParticleFX.init);
} else {
  ParticleFX.init();
}

window.ParticleFX = ParticleFX;
