/**
 * LiquidEther Fluid Dynamics Engine
 * Inspired by VividMotion (Eulerian Navier-Stokes WebGL Fluid Dynamics)
 * Multi-pass GPU simulation: Advection (BFECC) + Viscous Diffusion + Divergence + Poisson Pressure Solve
 */
(function () {
  'use strict';

  function initFluidEngine() {
    if (typeof THREE === 'undefined') {
      console.warn('LiquidEther: THREE.js not found');
      return;
    }

    var winWidth = window.innerWidth;
    var winHeight = window.innerHeight;
    var isDesktop = winWidth > 991;
    var isTabActive = true;
    var instances = [];
    var invalidateCallbacks = [];
    window.__fluidDebug = { framesRendered: 0, instances: instances, lastErr: null };

    // Master fixed WebGLRenderer for edge-to-edge multi-viewport rendering
    var renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance'
    });

    var maxDpr = isDesktop ? 2.0 : 1.25;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.setClearColor(0, 0);
    renderer.autoClear = false;
    renderer.domElement.id = 'liquid-ether-canvas';
    renderer.domElement.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;';
    document.body.appendChild(renderer.domElement);
    renderer.setSize(winWidth, winHeight);

    // Global resize handler
    function handleResize() {
      winWidth = window.innerWidth;
      winHeight = window.innerHeight;
      renderer.setSize(winWidth, winHeight);
      for (var i = 0; i < instances.length; i++) {
        instances[i].resize();
      }
    }
    window.addEventListener('resize', handleResize);
    window.addEventListener('load', handleResize);

    document.addEventListener('visibilitychange', function () {
      isTabActive = !document.hidden;
    });

    window.addEventListener('scroll', function () {
      for (var i = 0; i < invalidateCallbacks.length; i++) {
        invalidateCallbacks[i]();
      }
    }, { passive: true });

    // Main render loop
    var lastLoopTime = 0;
    function renderLoop(timestamp) {
      if (isTabActive) {
        var now = performance.now();
        var hasActiveUser = false;
        for (var p = 0; p < instances.length; p++) {
          if (now - instances[p].lastUserInteraction < 2000) {
            hasActiveUser = true;
            break;
          }
        }

        var frameInterval = hasActiveUser ? 1000 / 60 : 1000 / 30;
        var elapsed = timestamp - lastLoopTime;
        if (elapsed >= frameInterval) {
          lastLoopTime = timestamp - (elapsed % frameInterval);

          var hasVisible = false;
          for (var v = 0; v < instances.length; v++) {
            if (instances[v].isVisible) {
              hasVisible = true;
              break;
            }
          }

          if (hasVisible) {
            renderer.setScissorTest(false);
            renderer.setViewport(0, 0, winWidth, winHeight);
            renderer.clear();

            for (var k = 0; k < instances.length; k++) {
              var inst = instances[k];
              if (inst.isVisible) {
                var rect = inst.container.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < winHeight) {
                  inst.renderFrame(rect);
                }
              }
            }
          }
        }
      }
      requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);

    // Shader Definitions
    var vertexShader = [
      'attribute vec3 position;',
      'uniform vec2 px;',
      'uniform vec2 boundarySpace;',
      'varying vec2 uv;',
      'precision highp float;',
      'void main() {',
      '  vec3 pos = position;',
      '  pos.xy = pos.xy * (1.0 - boundarySpace * 2.0);',
      '  uv = vec2(0.5) + pos.xy * 0.5;',
      '  gl_Position = vec4(pos, 1.0);',
      '}'
    ].join('\n');

    var advectionShader = [
      'precision highp float;',
      'uniform sampler2D velocity;',
      'uniform float dt;',
      'uniform float decay;',
      'uniform bool isBFECC;',
      'uniform vec2 fboSize;',
      'uniform vec2 px;',
      'varying vec2 uv;',
      'void main() {',
      '  vec2 ratio = max(fboSize.x, fboSize.y) / fboSize;',
      '  vec2 res;',
      '  if (!isBFECC) {',
      '    res = texture2D(velocity, uv - texture2D(velocity, uv).xy * dt * ratio).xy;',
      '  } else {',
      '    vec2 vel_old = texture2D(velocity, uv).xy;',
      '    vec2 spot_old = uv - vel_old * dt * ratio;',
      '    vec2 vel_new1 = texture2D(velocity, spot_old).xy;',
      '    vec2 spot_new2 = spot_old + vel_new1 * dt * ratio;',
      '    vec2 spot_new3 = uv - (spot_new2 - uv) / 2.0;',
      '    vec2 vel_2 = texture2D(velocity, spot_new3).xy;',
      '    res = texture2D(velocity, spot_new3 - vel_2 * dt * ratio).xy;',
      '  }',
      '  gl_FragColor = vec4(res * decay, 0.0, 0.0);',
      '}'
    ].join('\n');

    var divergenceShader = [
      'precision highp float;',
      'uniform sampler2D velocity;',
      'uniform float dt;',
      'uniform vec2 px;',
      'varying vec2 uv;',
      'void main() {',
      '  float x0 = texture2D(velocity, uv - vec2(px.x, 0.0)).x;',
      '  float x1 = texture2D(velocity, uv + vec2(px.x, 0.0)).x;',
      '  float y0 = texture2D(velocity, uv - vec2(0.0, px.y)).y;',
      '  float y1 = texture2D(velocity, uv + vec2(0.0, px.y)).y;',
      '  gl_FragColor = vec4((x1 - x0 + y1 - y0) * 0.5 / dt, 0.0, 0.0, 1.0);',
      '}'
    ].join('\n');

    var poissonShader = [
      'precision highp float;',
      'uniform sampler2D pressure;',
      'uniform sampler2D divergence;',
      'uniform vec2 px;',
      'varying vec2 uv;',
      'void main() {',
      '  float p0 = texture2D(pressure, uv + vec2(px.x * 2.0, 0.0)).r;',
      '  float p1 = texture2D(pressure, uv - vec2(px.x * 2.0, 0.0)).r;',
      '  float p2 = texture2D(pressure, uv + vec2(0.0, px.y * 2.0)).r;',
      '  float p3 = texture2D(pressure, uv - vec2(0.0, px.y * 2.0)).r;',
      '  gl_FragColor = vec4((p0 + p1 + p2 + p3) / 4.0 - texture2D(divergence, uv).r, 0.0, 0.0, 1.0);',
      '}'
    ].join('\n');

    var pressureShader = [
      'precision highp float;',
      'uniform sampler2D pressure;',
      'uniform sampler2D velocity;',
      'uniform vec2 px;',
      'uniform float dt;',
      'varying vec2 uv;',
      'void main() {',
      '  float p0 = texture2D(pressure, uv + vec2(px.x * 2.0, 0.0)).r;',
      '  float p1 = texture2D(pressure, uv - vec2(px.x * 2.0, 0.0)).r;',
      '  float p2 = texture2D(pressure, uv + vec2(0.0, px.y * 2.0)).r;',
      '  float p3 = texture2D(pressure, uv - vec2(0.0, px.y * 2.0)).r;',
      '  gl_FragColor = vec4(texture2D(velocity, uv).xy - vec2(p0 - p1, p2 - p3) * 0.5 * dt, 0.0, 1.0);',
      '}'
    ].join('\n');

    var forceVertexShader = [
      'precision highp float;',
      'attribute vec3 position;',
      'attribute vec2 uv;',
      'uniform vec2 center;',
      'uniform vec2 scale;',
      'uniform vec2 px;',
      'varying vec2 vUv;',
      'void main() {',
      '  vec2 pos = position.xy * scale * 2.0 * px + center;',
      '  vUv = uv;',
      '  gl_Position = vec4(pos, 0.0, 1.0);',
      '}'
    ].join('\n');

    var forceFragmentShader = [
      'precision highp float;',
      'uniform vec2 force;',
      'uniform vec2 center;',
      'uniform vec2 scale;',
      'uniform vec2 px;',
      'varying vec2 vUv;',
      'void main() {',
      '  vec2 c = (vUv - 0.5) * 2.0;',
      '  float d = 1.0 - min(length(c), 1.0);',
      '  d *= d;',
      '  gl_FragColor = vec4(force * d, 0.0, 1.0);',
      '}'
    ].join('\n');

    var renderFragmentShader = [
      'precision highp float;',
      'uniform sampler2D velocity;',
      'uniform sampler2D palette;',
      'uniform vec2 px;',
      'varying vec2 uv;',
      'void main() {',
      '  vec2 v0 = texture2D(velocity, uv).xy;',
      '  vec2 v1 = texture2D(velocity, uv + vec2(px.x, 0.0)).xy;',
      '  vec2 v2 = texture2D(velocity, uv - vec2(px.x, 0.0)).xy;',
      '  vec2 v3 = texture2D(velocity, uv + vec2(0.0, px.y)).xy;',
      '  vec2 v4 = texture2D(velocity, uv - vec2(0.0, px.y)).xy;',
      '  vec2 v5 = texture2D(velocity, uv + px).xy;',
      '  vec2 v6 = texture2D(velocity, uv - px).xy;',
      '  vec2 v7 = texture2D(velocity, uv + vec2(px.x, -px.y)).xy;',
      '  vec2 v8 = texture2D(velocity, uv + vec2(-px.x, px.y)).xy;',
      '  vec2 vel = (v0 * 4.0 + (v1 + v2 + v3 + v4) * 2.0 + (v5 + v6 + v7 + v8)) * 0.0625;',
      '  float speed = length(vel);',
      '  float lenv = clamp(speed * 0.92, 0.0, 1.0);',
      '  vec3 c = texture2D(palette, vec2(lenv, 0.5)).rgb;',
      '  float alpha = smoothstep(0.012, 0.50, lenv) * 0.48;',
      '  gl_FragColor = vec4(c, alpha);',
      '}'
    ].join('\n');

    // ShaderPass helper
    function ShaderPass(props) {
      this.props = props || {};
      this.uniforms = this.props.material && this.props.material.uniforms;
      this.scene = new THREE.Scene();
      this.camera = new THREE.Camera();
      this.plane = null;
      if (this.uniforms) {
        var matProps = Object.assign({
          depthTest: false,
          depthWrite: false,
          side: THREE.DoubleSide
        }, this.props.material);
        var mat = new THREE.RawShaderMaterial(matProps);
        this.plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
        this.plane.frustumCulled = false;
        this.scene.add(this.plane);
      }
    }
    ShaderPass.prototype.update = function () {
      var out = this.props.output;
      if (out) {
        renderer.setScissorTest(false);
        renderer.setViewport(0, 0, out.width, out.height);
      }
      renderer.setRenderTarget(out || null);
      renderer.render(this.scene, this.camera);
    };

    function createPass(vShader, fShader, uniforms, output) {
      return new ShaderPass({
        material: {
          vertexShader: vShader,
          fragmentShader: fShader,
          uniforms: uniforms,
          depthTest: false,
          depthWrite: false,
          side: THREE.DoubleSide
        },
        output: output
      });
    }

    // Palette Texture Builder (Fiery golden-yellow ember gradient)
    function createPaletteTexture(colors) {
      var arr = Array.isArray(colors) && colors.length > 0 ? (colors.length === 1 ? [colors[0], colors[0]] : colors) : ['#420700', '#aa1801', '#fa4e00', '#ffa400', '#ffd43f'];
      var data = new Uint8Array(4 * arr.length);
      for (var i = 0; i < arr.length; i++) {
        var col = new THREE.Color(arr[i]);
        data[4 * i] = Math.round(255 * col.r);
        data[4 * i + 1] = Math.round(255 * col.g);
        data[4 * i + 2] = Math.round(255 * col.b);
        data[4 * i + 3] = 255;
      }
      var tex = new THREE.DataTexture(data, arr.length, 1, THREE.RGBAFormat);
      tex.magFilter = tex.minFilter = THREE.LinearFilter;
      tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.generateMipmaps = false;
      tex.needsUpdate = true;
      return tex;
    }

    // Container Sizing Tracker
    function ContainerTracker(container) {
      this.container = container;
      this.width = 0;
      this.height = 0;
      this.aspect = 1;
      this.time = 0;
      this.delta = 0;
      this.clock = new THREE.Clock();
      this.clock.start();
      this.resize();
    }
    ContainerTracker.prototype.resize = function () {
      if (this.container) {
        var rect = this.container.getBoundingClientRect();
        this.width = Math.max(1, Math.floor(rect.width));
        this.height = Math.max(1, Math.floor(rect.height));
        this.aspect = this.width / this.height;
      }
    };
    ContainerTracker.prototype.update = function () {
      this.delta = this.clock.getDelta();
      this.time += this.delta;
    };

    // Mouse & Touch Input Manager (Boundary-safe, explosion-proof)
    function MouseManager() {
      this.coords = new THREE.Vector2();
      this.coords_old = new THREE.Vector2();
      this.diff = new THREE.Vector2();
      this.container = null;
      this.isHoverInside = false;
      this.hasMovedInside = false;
      this.isAutoActive = false;
      this.autoIntensity = 1.2;
      this.onInteract = null;
      this._cachedRect = null;

      this._onMouseMove = this.onDocumentMouseMove.bind(this);
      this._onTouchStart = this.onDocumentTouchStart.bind(this);
      this._onTouchMove = this.onDocumentTouchMove.bind(this);
      this._onTouchEnd = this.onTouchEnd.bind(this);
      this._onLeave = this.onLeave.bind(this);
    }

    MouseManager.prototype.getRect = function () {
      if (!this._cachedRect && this.container) {
        this._cachedRect = this.container.getBoundingClientRect();
      }
      return this._cachedRect;
    };

    MouseManager.prototype.invalidateRect = function () {
      this._cachedRect = null;
    };

    MouseManager.prototype.init = function (container) {
      this.container = container;
      window.addEventListener('mousemove', this._onMouseMove);
      window.addEventListener('touchstart', this._onTouchStart, { passive: true });
      window.addEventListener('touchmove', this._onTouchMove, { passive: true });
      window.addEventListener('touchend', this._onTouchEnd);
      window.addEventListener('blur', this._onLeave);
      document.addEventListener('mouseleave', this._onLeave);
    };

    MouseManager.prototype.isInside = function (x, y) {
      if (!this.container) return false;
      var r = this.getRect();
      return r.width > 0 && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    };

    MouseManager.prototype.onLeave = function () {
      this.isHoverInside = false;
      this.hasMovedInside = false;
      this.diff.set(0, 0);
    };

    MouseManager.prototype.onTouchEnd = function () {
      this.isHoverInside = false;
      this.hasMovedInside = false;
      this.diff.set(0, 0);
    };

    MouseManager.prototype.setNormalized = function (x, y) {
      this.coords.set(x, y);
    };

    MouseManager.prototype.onDocumentMouseMove = function (e) {
      if (this.isInside(e.clientX, e.clientY)) {
        var r = this.getRect();
        if (!r || !r.width || !r.height) return;
        var nx = ((e.clientX - r.left) / r.width) * 2 - 1;
        var ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
        nx = Math.max(-0.99, Math.min(0.99, nx));
        ny = Math.max(-0.99, Math.min(0.99, ny));

        if (!this.isHoverInside || !this.hasMovedInside) {
          // First move entering container: align coords & coords_old to prevent boundary spike
          this.coords.set(nx, ny);
          this.coords_old.set(nx, ny);
          this.diff.set(0, 0);
          this.isHoverInside = true;
          this.hasMovedInside = true;
          this.isAutoActive = false;
        } else {
          // Active movement inside container
          this.coords.set(nx, ny);
          this.isHoverInside = true;
        }

        if (this.onInteract) this.onInteract();
      } else {
        if (this.isHoverInside) {
          this.isHoverInside = false;
          this.hasMovedInside = false;
          this.diff.set(0, 0);
        }
      }
    };

    MouseManager.prototype.onDocumentTouchStart = function (e) {
      if (e.touches.length >= 1) {
        var t = e.touches[0];
        if (this.isInside(t.clientX, t.clientY)) {
          var r = this.getRect();
          if (!r || !r.width || !r.height) return;
          var nx = ((t.clientX - r.left) / r.width) * 2 - 1;
          var ny = -(((t.clientY - r.top) / r.height) * 2 - 1);
          this.coords.set(nx, ny);
          this.coords_old.set(nx, ny);
          this.diff.set(0, 0);
          this.isHoverInside = true;
          this.hasMovedInside = true;
          this.isAutoActive = false;
          if (this.onInteract) this.onInteract();
        }
      }
    };

    MouseManager.prototype.onDocumentTouchMove = function (e) {
      if (e.touches.length >= 1) {
        var t = e.touches[0];
        if (this.isInside(t.clientX, t.clientY)) {
          var r = this.getRect();
          if (!r || !r.width || !r.height) return;
          var nx = ((t.clientX - r.left) / r.width) * 2 - 1;
          var ny = -(((t.clientY - r.top) / r.height) * 2 - 1);
          if (!this.isHoverInside || !this.hasMovedInside) {
            this.coords.set(nx, ny);
            this.coords_old.set(nx, ny);
            this.diff.set(0, 0);
            this.isHoverInside = true;
            this.hasMovedInside = true;
          } else {
            this.coords.set(nx, ny);
          }
          if (this.onInteract) this.onInteract();
        } else {
          this.isHoverInside = false;
          this.hasMovedInside = false;
          this.diff.set(0, 0);
        }
      }
    };

    MouseManager.prototype.update = function () {
      if (!this.isHoverInside && !this.isAutoActive) {
        this.diff.set(0, 0);
        this.coords_old.copy(this.coords);
        return;
      }

      this.diff.subVectors(this.coords, this.coords_old);
      this.coords_old.copy(this.coords);

      if (this.isAutoActive) {
        this.diff.multiplyScalar(this.autoIntensity);
      }

      // Physical velocity clamp per frame:
      var maxDelta = 0.12;
      var lenSq = this.diff.lengthSq();
      if (lenSq > maxDelta * maxDelta) {
        this.diff.setLength(maxDelta);
      }
    };

    // Autonomous Wandering Drift Driver
    function AutoDriver(mouse, inst, opt) {
      this.mouse = mouse;
      this.inst = inst;
      this.enabled = opt.enabled;
      this.speed = opt.speed || 0.16;
      this.resumeDelay = opt.resumeDelay || 1000;
      this.rampMs = 1000 * (opt.rampDuration || 0.6);
      this.active = false;
      this.current = new THREE.Vector2();
      this.target = new THREE.Vector2();
      this.lastTime = performance.now();
      this.activationTime = 0;
      this.margin = 0.15;
      this._dir = new THREE.Vector2();
      this.pickTarget();
    }

    AutoDriver.prototype.pickTarget = function () {
      // Gentle meandering in the right flame area to gracefully frame typography
      var tx = 0.20 + 0.50 * Math.random();
      var ty = -0.30 + 0.60 * Math.random();
      this.target.set(tx, ty);
    };

    AutoDriver.prototype.forceStop = function () {
      this.active = false;
      this.mouse.isAutoActive = false;
    };

    AutoDriver.prototype.update = function () {
      if (!this.enabled) return;
      var now = performance.now();
      if (now - this.inst.lastUserInteraction < this.resumeDelay) {
        if (this.active) this.forceStop();
      } else {
        if (!this.active) {
          this.active = true;
          this.current.copy(this.mouse.coords);
          this.mouse.coords_old.copy(this.mouse.coords);
          this.mouse.diff.set(0, 0);
          this.lastTime = now;
          this.activationTime = now;
        }
        this.mouse.isAutoActive = true;
        var dt = Math.min((now - this.lastTime) / 1000, 0.016);
        this.lastTime = now;
        var dir = this._dir.subVectors(this.target, this.current);
        var dist = dir.length();
        if (dist < 0.01) {
          this.pickTarget();
        } else {
          dir.normalize();
          var ramp = this.rampMs > 0 ? Math.min(1, (now - this.activationTime) / this.rampMs) : 1;
          ramp = ramp * ramp * (3 - 2 * ramp);
          this.current.addScaledVector(dir, Math.min(this.speed * dt * ramp, dist));
          this.mouse.setNormalized(this.current.x, this.current.y);
        }
      }
    };

    // Navier-Stokes Eulerian Simulation
    function FluidSimulation(options) {
      this.options = Object.assign({
        iterations_poisson: 18,
        mouse_force: 38,
        resolution: 1.25,
        cursor_size: 140,
        decay: 0.962,
        isBounce: false,
        dt: 0.013,
        BFECC: true
      }, options);
      this.fbos = {};
      this.fboSize = new THREE.Vector2();
      this.cellScale = new THREE.Vector2();
      this.boundarySpace = new THREE.Vector2();
      this.containerInfo = options.containerInfo;
      this.init();
    }

    FluidSimulation.prototype.init = function () {
      this.calcSize();
      this.createFBOs();
      this.createPasses();
      this.seedInitialImpulses();
    };

    FluidSimulation.prototype.calcSize = function () {
      var w = this.containerInfo ? this.containerInfo.width : window.innerWidth;
      var h = this.containerInfo ? this.containerInfo.height : window.innerHeight;
      var e = Math.max(1, Math.round(this.options.resolution * w));
      var t = Math.max(1, Math.round(this.options.resolution * h));
      this.cellScale.set(1 / e, 1 / t);
      this.fboSize.set(e, t);
    };

    FluidSimulation.prototype.createFBOs = function () {
      var type = THREE.HalfFloatType;
      var params = {
        type: type,
        depthBuffer: false,
        stencilBuffer: false,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping
      };
      var names = ['vel_0', 'vel_1', 'div', 'pres_0', 'pres_1'];
      for (var i = 0; i < names.length; i++) {
        this.fbos[names[i]] = new THREE.WebGLRenderTarget(this.fboSize.x, this.fboSize.y, params);
      }
    };

    FluidSimulation.prototype.createPasses = function () {
      var fbos = this.fbos;
      var cellScale = this.cellScale;
      var boundarySpace = this.boundarySpace;
      var opt = this.options;

      this._advUniforms = {
        boundarySpace: { value: cellScale },
        px: { value: cellScale },
        fboSize: { value: this.fboSize },
        velocity: { value: fbos.vel_0.texture },
        dt: { value: opt.dt },
        decay: { value: opt.decay || 0.978 },
        isBFECC: { value: opt.BFECC }
      };
      this._advPass = createPass(vertexShader, advectionShader, this._advUniforms, fbos.vel_1);

      var lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
        -1, -1, 0, -1, 1, 0,
        -1, 1, 0, 1, 1, 0,
        1, 1, 0, 1, -1, 0,
        1, -1, 0, -1, -1, 0
      ]), 3));
      this._advLine = new THREE.LineSegments(lineGeo, new THREE.RawShaderMaterial({
        vertexShader: [
          'attribute vec3 position;',
          'uniform vec2 px;',
          'precision highp float;',
          'varying vec2 uv;',
          'void main() {',
          '  vec3 pos = position;',
          '  uv = 0.5 + pos.xy * 0.5;',
          '  vec2 n = sign(pos.xy);',
          '  pos.xy = abs(pos.xy) - px * 1.0;',
          '  pos.xy *= n;',
          '  gl_Position = vec4(pos, 1.0);',
          '}'
        ].join('\n'),
        fragmentShader: advectionShader,
        uniforms: this._advUniforms
      }));
      this._advPass.scene.add(this._advLine);

      var forceMat = new THREE.RawShaderMaterial({
        vertexShader: forceVertexShader,
        fragmentShader: forceFragmentShader,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: {
          px: { value: cellScale },
          force: { value: new THREE.Vector2() },
          center: { value: new THREE.Vector2() },
          scale: { value: new THREE.Vector2(opt.cursor_size, opt.cursor_size) }
        }
      });
      this._forcePass = new ShaderPass({ output: fbos.vel_1 });
      this._forceMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), forceMat);
      this._forcePass.scene.add(this._forceMesh);

      this._divUniforms = {
        boundarySpace: { value: boundarySpace },
        velocity: { value: fbos.vel_1.texture },
        px: { value: cellScale },
        dt: { value: opt.dt }
      };
      this._divPass = createPass(vertexShader, divergenceShader, this._divUniforms, fbos.div);

      this._poisUniforms = {
        boundarySpace: { value: boundarySpace },
        pressure: { value: fbos.pres_0.texture },
        divergence: { value: fbos.div.texture },
        px: { value: cellScale }
      };
      this._poisPassA = createPass(vertexShader, poissonShader, this._poisUniforms, fbos.pres_1);
      this._poisPassB = createPass(vertexShader, poissonShader, this._poisUniforms, fbos.pres_0);

      this._presUniforms = {
        boundarySpace: { value: boundarySpace },
        pressure: { value: fbos.pres_0.texture },
        velocity: { value: fbos.vel_1.texture },
        px: { value: cellScale },
        dt: { value: opt.dt }
      };
      this._presPass = createPass(vertexShader, pressureShader, this._presUniforms, fbos.vel_0);
    };

    FluidSimulation.prototype.seedInitialImpulses = function () {
      var fu = this._forceMesh.material.uniforms;
      var cs = this.options.cursor_size;

      // Seed a sweeping upward curve of flame along the right flank
      var seeds = [
        { x: 0.44, y: -0.28, fx: -12.0, fy: 17.0, scale: 1.35 },
        { x: 0.38, y: -0.05, fx: -8.0, fy: 18.0, scale: 1.25 },
        { x: 0.32, y: 0.18, fx: 6.0, fy: 14.0, scale: 1.15 },
        { x: 0.40, y: 0.38, fx: 9.0, fy: -7.0, scale: 1.05 }
      ];

      for (var s = 0; s < seeds.length; s++) {
        var pt = seeds[s];
        fu.force.value.set(pt.fx, pt.fy);
        fu.center.value.set(pt.x, pt.y);
        fu.scale.value.set(cs * pt.scale, cs * pt.scale);
        this._forcePass.props.output = this.fbos.vel_0;
        this._forcePass.update();
      }
    };

    FluidSimulation.prototype.resize = function () {
      this.calcSize();
      var keys = Object.keys(this.fbos);
      for (var i = 0; i < keys.length; i++) {
        this.fbos[keys[i]].setSize(this.fboSize.x, this.fboSize.y);
      }
    };

    FluidSimulation.prototype.update = function (mouse) {
      var opt = this.options;
      var fbos = this.fbos;

      if (opt.isBounce) {
        this.boundarySpace.set(0, 0);
      } else {
        this.boundarySpace.copy(this.cellScale);
      }

      this._advUniforms.dt.value = opt.dt;
      this._advUniforms.decay.value = opt.decay;
      this._advUniforms.isBFECC.value = opt.BFECC;
      this._advLine.visible = opt.isBounce;
      this._advPass.update();

      var lenSq = mouse.diff.lengthSq();
      if (lenSq > 0.000001) {
        var fx = mouse.diff.x * opt.mouse_force;
        var fy = mouse.diff.y * opt.mouse_force;
        var rx = opt.cursor_size * this.cellScale.x;
        var ry = opt.cursor_size * this.cellScale.y;
        var cx = Math.min(Math.max(mouse.coords.x, -1 + rx + 2 * this.cellScale.x), 1 - rx - 2 * this.cellScale.x);
        var cy = Math.min(Math.max(mouse.coords.y, -1 + ry + 2 * this.cellScale.y), 1 - ry - 2 * this.cellScale.y);

        var fu = this._forceMesh.material.uniforms;
        fu.force.value.set(fx, fy);
        fu.center.value.set(cx, cy);
        fu.scale.value.set(opt.cursor_size, opt.cursor_size);

        this._forcePass.props.output = fbos.vel_1;
        this._forcePass.update();
      }

      this._divUniforms.velocity.value = fbos.vel_1.texture;
      this._divPass.update();

      var lastPres = fbos.pres_0;
      for (var f = 0; f < opt.iterations_poisson; f++) {
        var pSrc = (f % 2 === 0) ? fbos.pres_0 : fbos.pres_1;
        var pDst = (f % 2 === 0) ? fbos.pres_1 : fbos.pres_0;
        this._poisUniforms.pressure.value = pSrc.texture;
        var pPass = (f % 2 === 0) ? this._poisPassA : this._poisPassB;
        pPass.props.output = pDst;
        pPass.update();
        lastPres = pDst;
      }

      this._presUniforms.velocity.value = fbos.vel_1.texture;
      this._presUniforms.pressure.value = lastPres.texture;
      this._presPass.update();
    };

    // Render Composite Pass
    function RenderView(sim, paletteTex, bgColor) {
      this.sim = sim;
      this.scene = new THREE.Scene();
      this.camera = new THREE.Camera();
      var mat = new THREE.RawShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: renderFragmentShader,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        side: THREE.DoubleSide,
        uniforms: {
          velocity: { value: sim.fbos.vel_0.texture },
          boundarySpace: { value: new THREE.Vector2() },
          px: { value: sim.cellScale },
          palette: { value: paletteTex },
          bgColor: { value: bgColor }
        }
      });
      this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
      this.mesh.frustumCulled = false;
      this.scene.add(this.mesh);
    }
    RenderView.prototype.resize = function () {
      this.sim.resize();
    };
    RenderView.prototype.render = function () {
      renderer.setRenderTarget(null);
      renderer.render(this.scene, this.camera);
    };

    // Instantiate a Fluid Surface Instance
    function createLiquidInstance(options) {
      var opt = Object.assign({
        targetSelector: '',
        colors: ['#420700', '#aa1801', '#fa4e00', '#ffa400', '#ffd43f'],
        bgColor: new THREE.Vector4(7 / 255, 3 / 255, 2 / 255, 0.0),
        mouseForce: 38,
        cursorSize: 140,
        decay: 0.962,
        iterationsPoisson: 18,
        dt: 0.013,
        BFECC: true,
        resolution: 1.25,
        isBounce: false,
        idleFreeze: false,
        autoDemo: true,
        autoSpeed: 0.15,
        autoIntensity: 0.85,
        autoResumeDelay: 1000,
        autoRampDuration: 0.6
      }, options);

      var el = document.querySelector(opt.targetSelector);
      if (!el) {
        console.warn('LiquidEther: element not found: ' + opt.targetSelector);
        return;
      }

      var tracker = new ContainerTracker(el);
      var paletteTex = createPaletteTexture(opt.colors);
      var mouse = new MouseManager();
      mouse.init(el);
      mouse.autoIntensity = opt.autoIntensity;
      mouse.takeoverDuration = opt.takeoverDuration;

      var inst = {
        container: el,
        isVisible: true,
        lastUserInteraction: -1e7
      };

      var autoDriver = null;
      mouse.onInteract = function () {
        inst.lastUserInteraction = performance.now();
        if (opt.idleFreeze) {
          opt.idleFreeze = false;
          opt.autoDemo = true;
          if (autoDriver) autoDriver.enabled = true;
        }
        if (autoDriver) autoDriver.forceStop();
      };

      autoDriver = new AutoDriver(mouse, inst, {
        enabled: opt.autoDemo,
        speed: opt.autoSpeed,
        resumeDelay: opt.autoResumeDelay,
        rampDuration: opt.autoRampDuration
      });

      var sim = new FluidSimulation({
        mouse_force: opt.mouseForce,
        cursor_size: opt.cursorSize,
        iterations_poisson: opt.iterationsPoisson,
        dt: opt.dt,
        decay: opt.decay,
        BFECC: opt.BFECC,
        resolution: opt.resolution,
        isBounce: opt.isBounce,
        containerInfo: tracker
      });

      var renderView = new RenderView(sim, paletteTex, opt.bgColor);

      inst.renderFrame = function (rect) {
        if (window.__fluidDebug) window.__fluidDebug.framesRendered++;
        mouse._cachedRect = rect;
        var userRecent = (performance.now() - inst.lastUserInteraction) < 2000;
        if (!(opt.idleFreeze && !userRecent)) {
          sim.options.iterations_poisson = userRecent ? opt.iterationsPoisson : 10;
          sim.options.mouse_force = opt.mouseForce;
          autoDriver.update();
          mouse.update();
          tracker.update();
          sim.update(mouse);
        }
        var scX = rect.left;
        var scY = window.innerHeight - rect.bottom;
        renderer.setScissor(scX, scY, rect.width, rect.height);
        renderer.setViewport(scX, scY, rect.width, rect.height);
        renderer.setScissorTest(true);
        renderView.render();
      };

      inst.resize = function () {
        tracker.resize();
        renderView.resize();
        mouse.invalidateRect();
      };

      var onInvalidate = function () {
        mouse.invalidateRect();
      };
      invalidateCallbacks.push(onInvalidate);

      instances.push(inst);

      var io = new IntersectionObserver(function (entries) {
        inst.isVisible = entries[0].isIntersecting && entries[0].intersectionRatio > 0;
      }, { threshold: [0, 0.01, 0.1] });
      io.observe(el);

      var ro = new ResizeObserver(function () {
        requestAnimationFrame(function () {
          inst.resize();
        });
      });
      ro.observe(el);
    }

    // Initialize Hero & Footer Fluid Surfaces
    var isMobile = window.matchMedia('(max-width: 991px)').matches;
    var mobileOverrides = isMobile ? {
      resolution: 0.85,
      iterationsPoisson: 12,
      cursorSize: 75,
      mouseForce: 34,
      autoSpeed: 0.10,
      decay: 0.962,
      BFECC: true
    } : {};

    createLiquidInstance(Object.assign({
      targetSelector: '#hero-fluid'
    }, mobileOverrides));

    if (document.querySelector('#footer-fluid')) {
      createLiquidInstance(Object.assign({
        targetSelector: '#footer-fluid'
      }, mobileOverrides));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFluidEngine);
  } else {
    initFluidEngine();
  }
})();
