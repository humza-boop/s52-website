// <mesh-gradient> — looping WebGL mesh gradient. Config baked from the supplied JSON.
(function () {
  if (customElements.get('mesh-gradient')) return;

  const CFG = {
    colors: ['#060809', '#D2AE84', '#8A5F35', '#3B637A', '#EFE7DA'],
    weights: [0.7, 1.0, 0.8, 2.0, 1.2],
    speed: 2.5,
    horizontalPressure: 4,
    verticalPressure: 3,
    waveFrequencyX: 1,
    waveAmplitude: 0,
    shadows: 2,
    highlights: 7,
    colorSaturation: 4.5,
    colorBrightness: 1,
    colorBlending: 4,
    renderScale: 0.65
  };

  const VERT = `
    attribute vec2 aPos;
    varying vec2 vUv;
    void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }
  `;

  const FRAG = `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime, uAspect, uHP, uVP, uFreqX, uAmp, uShadow, uHigh, uSat, uBright, uBlend;
    uniform vec3 uColors[5];
    uniform float uWeights[5];

    vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m; m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    vec3 satAdjust(vec3 c, float s){
      float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
      return clamp(mix(vec3(l), c, s), 0.0, 1.0);
    }

    void main(){
      vec2 p = (vUv - 0.5) * 2.0;
      p.x *= uAspect;
      p.y += sin(p.x * uFreqX * 3.14159 + uTime * 0.7) * uAmp * 0.05;

      vec2 scale = vec2(uHP, uVP) * 0.11;
      float k = 24.0 / max(uBlend, 0.5);

      vec3 col = vec3(0.0);
      float wsum = 0.0;
      for (int i = 0; i < 5; i++) {
        float fi = float(i);
        float ang = 1.17 * fi;
        vec2 dir = vec2(cos(ang), sin(ang));
        vec2 q = p * scale + dir * (uTime * 0.28) + fi * 11.7;
        float f = snoise(q) + 0.45 * snoise(q * 2.3 - uTime * 0.16);
        float w = exp(k * f * 0.55) * uWeights[i];
        col += uColors[i] * w;
        wsum += w;
      }
      col /= max(wsum, 1e-4);

      float s = snoise(p * vec2(uHP, uVP) * 0.16 + vec2(uTime * 0.22, -uTime * 0.14));
      col *= 1.0 - uShadow * 0.07 * max(0.0, -s);
      col += vec3(1.0, 0.96, 0.90) * (uHigh * 0.045 * pow(max(0.0, s), 2.2));

      col = satAdjust(col, 0.85 + uSat * 0.05);
      col *= uBright;
      gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `;

  const hex = (h) => {
    const n = parseInt(h.replace('#', ''), 16);
    const srgb = [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
    return srgb.map((c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  };

  class MeshGradient extends HTMLElement {
    connectedCallback() {
      if (this._init) return;
      this._init = true;
      this.style.display = 'block';
      this.style.position = 'absolute';
      this.style.inset = '0';
      this.style.overflow = 'hidden';
      const attr = (n) => this.getAttribute(n);
      const cfg = Object.assign({}, CFG);
      if (attr('palette')) cfg.colors = attr('palette').split(',').map((s) => s.trim());
      if (attr('weights')) cfg.weights = attr('weights').split(',').map(Number);
      if (attr('speed')) cfg.speed = Number(attr('speed'));
      if (attr('brightness')) cfg.colorBrightness = Number(attr('brightness'));
      if (attr('blend')) cfg.colorBlending = Number(attr('blend'));
      if (attr('pressure')) {
        const p = attr('pressure').split(',').map(Number);
        cfg.horizontalPressure = p[0];
        cfg.verticalPressure = p[1] != null ? p[1] : p[0];
      }
      this.cfg = cfg;
      const cv = document.createElement('canvas');
      cv.style.cssText = 'display:block;width:100%;height:100%;';
      this.appendChild(cv);
      this.cv = cv;

      const gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
      if (!gl) { this.style.background = cfg.colors[0]; return; }
      this.gl = gl;

      const sh = (t, src) => { const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); return s; };
      const prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      gl.useProgram(prog);
      this.prog = prog;

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'aPos');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      const u = (n) => gl.getUniformLocation(prog, n);
      this.u = { time: u('uTime'), aspect: u('uAspect') };
      gl.uniform1f(u('uHP'), cfg.horizontalPressure);
      gl.uniform1f(u('uVP'), cfg.verticalPressure);
      gl.uniform1f(u('uFreqX'), cfg.waveFrequencyX);
      gl.uniform1f(u('uAmp'), cfg.waveAmplitude);
      gl.uniform1f(u('uShadow'), cfg.shadows);
      gl.uniform1f(u('uHigh'), cfg.highlights);
      gl.uniform1f(u('uSat'), cfg.colorSaturation);
      gl.uniform1f(u('uBright'), cfg.colorBrightness);
      gl.uniform1f(u('uBlend'), cfg.colorBlending);
      gl.uniform3fv(u('uColors'), new Float32Array(cfg.colors.flatMap(hex)));
      gl.uniform1fv(u('uWeights'), new Float32Array(cfg.weights));

      this.resize();
      this.ro = new ResizeObserver(() => this.resize());
      this.ro.observe(this);

      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const t0 = performance.now();
      const frame = (now) => {
        this.raf = requestAnimationFrame(frame);
        const t = reduced ? 6 : ((now - t0) / 1000) * cfg.speed * 0.18;
        gl.uniform1f(this.u.time, t);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        if (reduced) cancelAnimationFrame(this.raf);
      };
      this.raf = requestAnimationFrame(frame);
    }

    resize() {
      const gl = this.gl; const cfg = this.cfg || {}; if (!gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2) * (cfg.renderScale || 0.65);
      const w = Math.max(1, Math.round(this.clientWidth * dpr));
      const h = Math.max(1, Math.round(this.clientHeight * dpr));
      this.cv.width = w; this.cv.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform1f(this.u.aspect, this.clientWidth / Math.max(1, this.clientHeight));
    }

    disconnectedCallback() {
      cancelAnimationFrame(this.raf);
      if (this.ro) this.ro.disconnect();
      this._init = false;
    }
  }
  customElements.define('mesh-gradient', MeshGradient);
})();
