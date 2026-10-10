/**
 * ReactBits SplashCursor Fluid Dynamics Engine (Vanilla WebGL)
 * Based on ReactBits SplashCursor (Eulerian Navier-Stokes WebGL Fluid Simulation)
 * Multi-pass WebGL2 / WebGL1 GPU simulation: Advection + Vorticity + Divergence + Poisson Pressure Solve
 * Parameters configured from:
 * https://reactbits.dev/animations/splash-cursor?COLOR=EF4444&PRESSURE=0.55&RAINBOW_MODE=true&CURL=4&COLOR_UPDATE_SPEED=4&DENSITY_DISSIPATION=2.5&VELOCITY_DISSIPATION=6.5&SPLAT_RADIUS=0.45&SHADING=false
 */
(function () {
  'use strict';

  function createSplashCursor(container, userConfig) {
    if (!container) return null;

    // Create Canvas inside target container
    var canvas = document.createElement('canvas');
    canvas.className = 'splash-fluid-canvas';
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;display:block;';
    container.appendChild(canvas);

    var dataset = container.dataset || {};
    var isRainbow = dataset.fluidRainbow !== undefined ? (dataset.fluidRainbow === 'true') : true;
    var articleColor = dataset.fluidColor || '#EF4444';

    var config = Object.assign({
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: window.innerWidth > 991 ? 1440 : 512,
      CAPTURE_RESOLUTION: 512,
      DENSITY_DISSIPATION: 2.5,
      VELOCITY_DISSIPATION: 6.5,
      PRESSURE: 0.55,
      PRESSURE_ITERATIONS: 20,
      CURL: 4,
      SPLAT_RADIUS: 0.45,
      SPLAT_FORCE: 6000,
      SHADING: false,
      COLOR_UPDATE_SPEED: 4,
      BACK_COLOR: { r: 0, g: 0, b: 0 },
      TRANSPARENT: true,
      RAINBOW_MODE: isRainbow,
      COLOR: articleColor,
      PAUSED: false
    }, userConfig || {});

    function pointerPrototype() {
      this.id = -1;
      this.texcoordX = 0;
      this.texcoordY = 0;
      this.prevTexcoordX = 0;
      this.prevTexcoordY = 0;
      this.deltaX = 0;
      this.deltaY = 0;
      this.down = false;
      this.moved = false;
      this.color = [0, 0, 0];
    }

    var pointers = [new pointerPrototype()];

    // WebGL Context setup
    var params = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false
    };

    var gl = canvas.getContext('webgl2', params);
    var isWebGL2 = !!gl;
    if (!gl) {
      gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);
    }
    if (!gl) {
      console.warn('SplashCursor: WebGL not supported');
      return null;
    }

    var halfFloat;
    var supportLinearFiltering;
    if (isWebGL2) {
      gl.getExtension('EXT_color_buffer_float');
      supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
    } else {
      halfFloat = gl.getExtension('OES_texture_half_float');
      supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
    }
    gl.clearColor(0.0, 0.0, 0.0, 0.0);

    var halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat && halfFloat.HALF_FLOAT_OES;

    function supportRenderTextureFormat(glCtx, internalFormat, format, type) {
      var texture = glCtx.createTexture();
      glCtx.bindTexture(glCtx.TEXTURE_2D, texture);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_MIN_FILTER, glCtx.NEAREST);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_MAG_FILTER, glCtx.NEAREST);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_WRAP_S, glCtx.CLAMP_TO_EDGE);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_WRAP_T, glCtx.CLAMP_TO_EDGE);
      glCtx.texImage2D(glCtx.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
      var fbo = glCtx.createFramebuffer();
      glCtx.bindFramebuffer(glCtx.FRAMEBUFFER, fbo);
      glCtx.framebufferTexture2D(glCtx.FRAMEBUFFER, glCtx.COLOR_ATTACHMENT0, glCtx.TEXTURE_2D, texture, 0);
      var status = glCtx.checkFramebufferStatus(glCtx.FRAMEBUFFER);
      return status === glCtx.FRAMEBUFFER_COMPLETE;
    }

    function getSupportedFormat(glCtx, internalFormat, format, type) {
      if (!supportRenderTextureFormat(glCtx, internalFormat, format, type)) {
        switch (internalFormat) {
          case glCtx.R16F:
            return getSupportedFormat(glCtx, glCtx.RG16F, glCtx.RG, type);
          case glCtx.RG16F:
            return getSupportedFormat(glCtx, glCtx.RGBA16F, glCtx.RGBA, type);
          default:
            return null;
        }
      }
      return { internalFormat: internalFormat, format: format };
    }

    var formatRGBA, formatRG, formatR;
    if (isWebGL2) {
      formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
      formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
      formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
    } else {
      formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    }

    if (!supportLinearFiltering) {
      config.DYE_RESOLUTION = 256;
      config.SHADING = false;
    }

    function hashCode(s) {
      if (s.length === 0) return 0;
      var hash = 0;
      for (var i = 0; i < s.length; i++) {
        hash = (hash << 5) - hash + s.charCodeAt(i);
        hash |= 0;
      }
      return hash;
    }

    function compileShader(type, source, keywords) {
      if (keywords) {
        var kwStr = '';
        keywords.forEach(function (kw) { kwStr += '#define ' + kw + '\n'; });
        source = kwStr + source;
      }
      var shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn('Shader compile error:', gl.getShaderInfoLog(shader));
      }
      return shader;
    }

    function createProgram(vertexShader, fragmentShader) {
      var program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.warn('Program link error:', gl.getProgramInfoLog(program));
      }
      return program;
    }

    function getUniforms(program) {
      var uniforms = {};
      var uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (var i = 0; i < uniformCount; i++) {
        var uniformName = gl.getActiveUniform(program, i).name;
        uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
      }
      return uniforms;
    }

    function Program(vertexShader, fragmentShader) {
      this.program = createProgram(vertexShader, fragmentShader);
      this.uniforms = getUniforms(this.program);
      this.bind = function () {
        gl.useProgram(this.program);
      };
    }

    function Material(vertexShader, fragmentShaderSource) {
      this.vertexShader = vertexShader;
      this.fragmentShaderSource = fragmentShaderSource;
      this.programs = {};
      this.activeProgram = null;
      this.uniforms = {};

      this.setKeywords = function (keywords) {
        var hash = 0;
        for (var i = 0; i < keywords.length; i++) hash += hashCode(keywords[i]);
        var prog = this.programs[hash];
        if (!prog) {
          var fragmentShader = compileShader(gl.FRAGMENT_SHADER, this.fragmentShaderSource, keywords);
          prog = createProgram(this.vertexShader, fragmentShader);
          this.programs[hash] = prog;
        }
        if (prog === this.activeProgram) return;
        this.uniforms = getUniforms(prog);
        this.activeProgram = prog;
      };

      this.bind = function () {
        gl.useProgram(this.activeProgram);
      };
    }

    // Shaders
    var baseVertexShader = compileShader(
      gl.VERTEX_SHADER,
      'precision highp float;' +
      'attribute vec2 aPosition;' +
      'varying vec2 vUv;' +
      'varying vec2 vL;' +
      'varying vec2 vR;' +
      'varying vec2 vT;' +
      'varying vec2 vB;' +
      'uniform vec2 texelSize;' +
      'void main () {' +
      '  vUv = aPosition * 0.5 + 0.5;' +
      '  vL = vUv - vec2(texelSize.x, 0.0);' +
      '  vR = vUv + vec2(texelSize.x, 0.0);' +
      '  vT = vUv + vec2(0.0, texelSize.y);' +
      '  vB = vUv - vec2(0.0, texelSize.y);' +
      '  gl_Position = vec4(aPosition, 0.0, 1.0);' +
      '}'
    );

    var copyShader = compileShader(
      gl.FRAGMENT_SHADER,
      'precision mediump float;' +
      'precision mediump sampler2D;' +
      'varying highp vec2 vUv;' +
      'uniform sampler2D uTexture;' +
      'void main () {' +
      '  gl_FragColor = texture2D(uTexture, vUv);' +
      '}'
    );

    var clearShader = compileShader(
      gl.FRAGMENT_SHADER,
      'precision mediump float;' +
      'precision mediump sampler2D;' +
      'varying highp vec2 vUv;' +
      'uniform sampler2D uTexture;' +
      'uniform float value;' +
      'void main () {' +
      '  gl_FragColor = value * texture2D(uTexture, vUv);' +
      '}'
    );

    var displayShaderSource =
      'precision highp float;\n' +
      'precision highp sampler2D;\n' +
      'varying vec2 vUv;\n' +
      'varying vec2 vL;\n' +
      'varying vec2 vR;\n' +
      'varying vec2 vT;\n' +
      'varying vec2 vB;\n' +
      'uniform sampler2D uTexture;\n' +
      'uniform vec2 texelSize;\n' +
      'void main () {\n' +
      '  vec3 c = texture2D(uTexture, vUv).rgb;\n' +
      '#ifdef SHADING\n' +
      '  vec3 lc = texture2D(uTexture, vL).rgb;\n' +
      '  vec3 rc = texture2D(uTexture, vR).rgb;\n' +
      '  vec3 tc = texture2D(uTexture, vT).rgb;\n' +
      '  vec3 bc = texture2D(uTexture, vB).rgb;\n' +
      '  float dx = length(rc) - length(lc);\n' +
      '  float dy = length(tc) - length(bc);\n' +
      '  vec3 n = normalize(vec3(dx, dy, length(texelSize)));\n' +
      '  vec3 l = vec3(0.0, 0.0, 1.0);\n' +
      '  float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);\n' +
      '  c *= diffuse;\n' +
      '#endif\n' +
      '  float a = max(c.r, max(c.g, c.b));\n' +
      '  gl_FragColor = vec4(c, a);\n' +
      '}\n';

    var splatShader = compileShader(
      gl.FRAGMENT_SHADER,
      'precision highp float;\n' +
      'precision highp sampler2D;\n' +
      'varying vec2 vUv;\n' +
      'uniform sampler2D uTarget;\n' +
      'uniform float aspectRatio;\n' +
      'uniform vec3 color;\n' +
      'uniform vec2 point;\n' +
      'uniform float radius;\n' +
      'void main () {\n' +
      '  vec2 p = vUv - point.xy;\n' +
      '  p.x *= aspectRatio;\n' +
      '  vec3 splat = exp(-dot(p, p) / radius) * color;\n' +
      '  vec3 base = texture2D(uTarget, vUv).xyz;\n' +
      '  gl_FragColor = vec4(base + splat, 1.0);\n' +
      '}\n'
    );

    var advectionShader = compileShader(
      gl.FRAGMENT_SHADER,
      'precision highp float;\n' +
      'precision highp sampler2D;\n' +
      'varying vec2 vUv;\n' +
      'uniform sampler2D uVelocity;\n' +
      'uniform sampler2D uSource;\n' +
      'uniform vec2 texelSize;\n' +
      'uniform vec2 dyeTexelSize;\n' +
      'uniform float dt;\n' +
      'uniform float dissipation;\n' +
      'vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {\n' +
      '  vec2 st = uv / tsize - 0.5;\n' +
      '  vec2 iuv = floor(st);\n' +
      '  vec2 fuv = fract(st);\n' +
      '  vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);\n' +
      '  vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);\n' +
      '  vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);\n' +
      '  vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);\n' +
      '  return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);\n' +
      '}\n' +
      'void main () {\n' +
      '#ifdef MANUAL_FILTERING\n' +
      '  vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;\n' +
      '  vec4 result = bilerp(uSource, coord, dyeTexelSize);\n' +
      '#else\n' +
      '  vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;\n' +
      '  vec4 result = texture2D(uSource, coord);\n' +
      '#endif\n' +
      '  float decay = 1.0 + dissipation * dt;\n' +
      '  gl_FragColor = result / decay;\n' +
      '}\n',
      supportLinearFiltering ? null : ['MANUAL_FILTERING']
    );

    var divergenceShader = compileShader(
      gl.FRAGMENT_SHADER,
      'precision mediump float;' +
      'precision mediump sampler2D;' +
      'varying highp vec2 vUv;' +
      'varying highp vec2 vL;' +
      'varying highp vec2 vR;' +
      'varying highp vec2 vT;' +
      'varying highp vec2 vB;' +
      'uniform sampler2D uVelocity;' +
      'void main () {' +
      '  float L = texture2D(uVelocity, vL).x;' +
      '  float R = texture2D(uVelocity, vR).x;' +
      '  float T = texture2D(uVelocity, vT).y;' +
      '  float B = texture2D(uVelocity, vB).y;' +
      '  vec2 C = texture2D(uVelocity, vUv).xy;' +
      '  if (vL.x < 0.0) { L = -C.x; }' +
      '  if (vR.x > 1.0) { R = -C.x; }' +
      '  if (vT.y > 1.0) { T = -C.y; }' +
      '  if (vB.y < 0.0) { B = -C.y; }' +
      '  float div = 0.5 * (R - L + T - B);' +
      '  gl_FragColor = vec4(div, 0.0, 0.0, 1.0);' +
      '}'
    );

    var curlShader = compileShader(
      gl.FRAGMENT_SHADER,
      'precision mediump float;' +
      'precision mediump sampler2D;' +
      'varying highp vec2 vUv;' +
      'varying highp vec2 vL;' +
      'varying highp vec2 vR;' +
      'varying highp vec2 vT;' +
      'varying highp vec2 vB;' +
      'uniform sampler2D uVelocity;' +
      'void main () {' +
      '  float L = texture2D(uVelocity, vL).y;' +
      '  float R = texture2D(uVelocity, vR).y;' +
      '  float T = texture2D(uVelocity, vT).x;' +
      '  float B = texture2D(uVelocity, vB).x;' +
      '  float vorticity = R - L - T + B;' +
      '  gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);' +
      '}'
    );

    var vorticityShader = compileShader(
      gl.FRAGMENT_SHADER,
      'precision highp float;' +
      'precision highp sampler2D;' +
      'varying vec2 vUv;' +
      'varying vec2 vL;' +
      'varying vec2 vR;' +
      'varying vec2 vT;' +
      'varying vec2 vB;' +
      'uniform sampler2D uVelocity;' +
      'uniform sampler2D uCurl;' +
      'uniform float curl;' +
      'uniform float dt;' +
      'void main () {' +
      '  float L = texture2D(uCurl, vL).x;' +
      '  float R = texture2D(uCurl, vR).x;' +
      '  float T = texture2D(uCurl, vT).x;' +
      '  float B = texture2D(uCurl, vB).x;' +
      '  float C = texture2D(uCurl, vUv).x;' +
      '  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));' +
      '  force /= length(force) + 0.0001;' +
      '  force *= curl * C;' +
      '  force.y *= -1.0;' +
      '  vec2 velocity = texture2D(uVelocity, vUv).xy;' +
      '  velocity += force * dt;' +
      '  velocity = min(max(velocity, -1000.0), 1000.0);' +
      '  gl_FragColor = vec4(velocity, 0.0, 1.0);' +
      '}'
    );

    var pressureShader = compileShader(
      gl.FRAGMENT_SHADER,
      'precision mediump float;' +
      'precision mediump sampler2D;' +
      'varying highp vec2 vUv;' +
      'varying highp vec2 vL;' +
      'varying highp vec2 vR;' +
      'varying highp vec2 vT;' +
      'varying highp vec2 vB;' +
      'uniform sampler2D uPressure;' +
      'uniform sampler2D uDivergence;' +
      'void main () {' +
      '  float L = texture2D(uPressure, vL).x;' +
      '  float R = texture2D(uPressure, vR).x;' +
      '  float T = texture2D(uPressure, vT).x;' +
      '  float B = texture2D(uPressure, vB).x;' +
      '  float divergence = texture2D(uDivergence, vUv).x;' +
      '  float pressure = (L + R + B + T - divergence) * 0.25;' +
      '  gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);' +
      '}'
    );

    var gradientSubtractShader = compileShader(
      gl.FRAGMENT_SHADER,
      'precision mediump float;' +
      'precision mediump sampler2D;' +
      'varying highp vec2 vUv;' +
      'varying highp vec2 vL;' +
      'varying highp vec2 vR;' +
      'varying highp vec2 vT;' +
      'varying highp vec2 vB;' +
      'uniform sampler2D uPressure;' +
      'uniform sampler2D uVelocity;' +
      'void main () {' +
      '  float L = texture2D(uPressure, vL).x;' +
      '  float R = texture2D(uPressure, vR).x;' +
      '  float T = texture2D(uPressure, vT).x;' +
      '  float B = texture2D(uPressure, vB).x;' +
      '  vec2 velocity = texture2D(uVelocity, vUv).xy;' +
      '  velocity.xy -= vec2(R - L, T - B);' +
      '  gl_FragColor = vec4(velocity, 0.0, 1.0);' +
      '}'
    );

    // Full-screen Quad Buffer
    var blit = (function () {
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);
      return function (target, clear) {
        if (target == null) {
          gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        } else {
          gl.viewport(0, 0, target.width, target.height);
          gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
        }
        if (clear) {
          gl.clearColor(0.0, 0.0, 0.0, 1.0);
          gl.clear(gl.COLOR_BUFFER_BIT);
        }
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      };
    })();

    var dye, velocity, divergence, curl, pressure;

    var copyProgram = new Program(baseVertexShader, copyShader);
    var clearProgram = new Program(baseVertexShader, clearShader);
    var splatProgram = new Program(baseVertexShader, splatShader);
    var advectionProgram = new Program(baseVertexShader, advectionShader);
    var divergenceProgram = new Program(baseVertexShader, divergenceShader);
    var curlProgram = new Program(baseVertexShader, curlShader);
    var vorticityProgram = new Program(baseVertexShader, vorticityShader);
    var pressureProgram = new Program(baseVertexShader, pressureShader);
    var gradientSubtractProgram = new Program(baseVertexShader, gradientSubtractShader);
    var displayMaterial = new Material(baseVertexShader, displayShaderSource);

    function createFBO(w, h, internalFormat, format, type, param) {
      w = Math.max(4, Math.round(w) || 4);
      h = Math.max(4, Math.round(h) || 4);
      gl.activeTexture(gl.TEXTURE0);
      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

      var fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);

      return {
        texture: texture,
        fbo: fbo,
        width: w,
        height: h,
        texelSizeX: 1.0 / w,
        texelSizeY: 1.0 / h,
        attach: function (id) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        }
      };
    }

    function createDoubleFBO(w, h, internalFormat, format, type, param) {
      w = Math.max(4, Math.round(w) || 4);
      h = Math.max(4, Math.round(h) || 4);
      var fbo1 = createFBO(w, h, internalFormat, format, type, param);
      var fbo2 = createFBO(w, h, internalFormat, format, type, param);
      return {
        width: w,
        height: h,
        texelSizeX: fbo1.texelSizeX,
        texelSizeY: fbo1.texelSizeY,
        get read() { return fbo1; },
        set read(val) { fbo1 = val; },
        get write() { return fbo2; },
        set write(val) { fbo2 = val; },
        swap: function () {
          var temp = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
        }
      };
    }

    function resizeFBO(target, w, h, internalFormat, format, type, param) {
      w = Math.max(4, Math.round(w) || 4);
      h = Math.max(4, Math.round(h) || 4);
      var newFBO = createFBO(w, h, internalFormat, format, type, param);
      copyProgram.bind();
      gl.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
      blit(newFBO);
      return newFBO;
    }

    function resizeDoubleFBO(target, w, h, internalFormat, format, type, param) {
      w = Math.max(4, Math.round(w) || 4);
      h = Math.max(4, Math.round(h) || 4);
      if (target.width === w && target.height === h) return target;
      target.read = resizeFBO(target.read, w, h, internalFormat, format, type, param);
      target.write = createFBO(w, h, internalFormat, format, type, param);
      target.width = w;
      target.height = h;
      target.texelSizeX = 1.0 / w;
      target.texelSizeY = 1.0 / h;
      return target;
    }

    function getResolution(resolution) {
      var w = canvas.width || gl.drawingBufferWidth || window.innerWidth || 100;
      var h = canvas.height || gl.drawingBufferHeight || window.innerHeight || 100;
      var aspectRatio = w / h;
      if (isNaN(aspectRatio) || aspectRatio <= 0) aspectRatio = 1.0;
      if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio;
      var min = Math.max(4, Math.round(resolution));
      var max = Math.max(4, Math.round(resolution * aspectRatio));
      if (w > h) return { width: max, height: min };
      else return { width: min, height: max };
    }

    function initFramebuffers() {
      var simRes = getResolution(config.SIM_RESOLUTION);
      var dyeRes = getResolution(config.DYE_RESOLUTION);
      var texType = halfFloatTexType;
      var rgba = formatRGBA;
      var rg = formatRG;
      var r = formatR;
      var filtering = supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
      gl.disable(gl.BLEND);

      if (!dye) {
        dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
      } else {
        dye = resizeDoubleFBO(dye, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
      }

      if (!velocity) {
        velocity = createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
      } else {
        velocity = resizeDoubleFBO(velocity, simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
      }

      divergence = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
      curl = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
      pressure = createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
    }

    function updateKeywords() {
      var displayKeywords = [];
      if (config.SHADING) displayKeywords.push('SHADING');
      displayMaterial.setKeywords(displayKeywords);
    }

    function scaleByPixelRatio(input) {
      var pixelRatio = Math.min(window.devicePixelRatio || 1, 2.0);
      return Math.floor(input * pixelRatio);
    }

    function resizeCanvas() {
      var clientW = canvas.clientWidth || container.clientWidth || window.innerWidth;
      var clientH = canvas.clientHeight || container.clientHeight || window.innerHeight;
      var width = Math.max(16, scaleByPixelRatio(clientW));
      var height = Math.max(16, scaleByPixelRatio(clientH));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
      }
      return false;
    }

    // Color Helpers
    function hexToRGB(hex) {
      var val = hex.replace('#', '');
      if (val.length === 3) val = val[0] + val[0] + val[1] + val[1] + val[2] + val[2];
      var r = parseInt(val.slice(0, 2), 16) / 255;
      var g = parseInt(val.slice(2, 4), 16) / 255;
      var b = parseInt(val.slice(4, 6), 16) / 255;
      return { r: r * 0.15, g: g * 0.15, b: b * 0.15 };
    }

    function HSVtoRGB(h, s, v) {
      var r, g, b, i, f, p, q, t;
      i = Math.floor(h * 6);
      f = h * 6 - i;
      p = v * (1 - s);
      q = v * (1 - f * s);
      t = v * (1 - (1 - f) * s);
      switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
      }
      return { r: r, g: g, b: b };
    }

    function generateColor() {
      if (!config.RAINBOW_MODE) {
        return hexToRGB(config.COLOR);
      }
      var c = HSVtoRGB(Math.random(), 1.0, 1.0);
      c.r *= 0.15;
      c.g *= 0.15;
      c.b *= 0.15;
      return c;
    }

    function wrap(value, min, max) {
      var range = max - min;
      if (range === 0) return min;
      return ((value - min) % range) + min;
    }

    function correctRadius(radius) {
      var aspectRatio = canvas.width / canvas.height;
      if (aspectRatio > 1) radius *= aspectRatio;
      return radius;
    }

    function correctDeltaX(delta) {
      var aspectRatio = canvas.width / canvas.height;
      if (aspectRatio < 1) delta *= aspectRatio;
      return delta;
    }

    function correctDeltaY(delta) {
      var aspectRatio = canvas.width / canvas.height;
      if (aspectRatio > 1) delta /= aspectRatio;
      return delta;
    }

    function splat(x, y, dx, dy, color) {
      splatProgram.bind();
      gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
      gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(splatProgram.uniforms.point, x, y);
      gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
      gl.uniform1f(splatProgram.uniforms.radius, correctRadius(config.SPLAT_RADIUS / 100.0));
      blit(velocity.write);
      velocity.swap();

      gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
      gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
      blit(dye.write);
      dye.swap();
    }

    function splatPointer(pointer) {
      var dx = pointer.deltaX * config.SPLAT_FORCE;
      var dy = pointer.deltaY * config.SPLAT_FORCE;
      splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
    }

    function clickSplat(pointer) {
      var color = generateColor();
      color.r *= 10.0;
      color.g *= 10.0;
      color.b *= 10.0;
      var dx = 10 * (Math.random() - 0.5);
      var dy = 30 * (Math.random() - 0.5);
      splat(pointer.texcoordX, pointer.texcoordY, dx, dy, color);
    }

    function updatePointerDownData(pointer, id, posX, posY) {
      pointer.id = id;
      pointer.down = true;
      pointer.moved = false;
      pointer.texcoordX = posX / canvas.width;
      pointer.texcoordY = 1.0 - posY / canvas.height;
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.deltaX = 0;
      pointer.deltaY = 0;
      pointer.color = generateColor();
    }

    function updatePointerMoveData(pointer, posX, posY, color) {
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.texcoordX = posX / canvas.width;
      pointer.texcoordY = 1.0 - posY / canvas.height;
      pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
      pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
      pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
      pointer.color = color;
    }

    function applyInputs() {
      for (var i = 0; i < pointers.length; i++) {
        var p = pointers[i];
        if (p.moved) {
          p.moved = false;
          splatPointer(p);
        }
      }
    }

    function step(dt) {
      gl.disable(gl.BLEND);
      curlProgram.bind();
      gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(curl);

      vorticityProgram.bind();
      gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
      gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
      gl.uniform1f(vorticityProgram.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      divergenceProgram.bind();
      gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      clearProgram.bind();
      gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
      gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
      blit(pressure.write);
      pressure.swap();

      pressureProgram.bind();
      gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
      for (var i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      gradientSubtractProgram.bind();
      gl.uniform2f(gradientSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
      gl.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      advectionProgram.bind();
      gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      if (!supportLinearFiltering) {
        gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
      }
      var velocityId = velocity.read.attach(0);
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
      gl.uniform1i(advectionProgram.uniforms.uSource, velocityId);
      gl.uniform1f(advectionProgram.uniforms.dt, dt);
      gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
      blit(velocity.write);
      velocity.swap();

      if (!supportLinearFiltering) {
        gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
      }
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
      gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
      blit(dye.write);
      dye.swap();
    }

    function render(target) {
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      displayMaterial.bind();
      if (config.SHADING) {
        var w = target == null ? gl.drawingBufferWidth : target.width;
        var h = target == null ? gl.drawingBufferHeight : target.height;
        gl.uniform2f(displayMaterial.uniforms.texelSize, 1.0 / w, 1.0 / h);
      }
      gl.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
      blit(target);
    }

    var lastUpdateTime = Date.now();
    var colorUpdateTimer = 0.0;
    var isActive = true;
    var isVisible = true;
    var animFrameId = null;

    function updateColors(dt) {
      colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED;
      if (colorUpdateTimer >= 1) {
        colorUpdateTimer = wrap(colorUpdateTimer, 0, 1);
        pointers.forEach(function (p) {
          p.color = generateColor();
        });
      }
    }

    var lastInteraction = Date.now();
    var lastAutoTime = 0;

    function updateFrame() {
      if (!isActive) return;
      if (!isVisible) {
        animFrameId = requestAnimationFrame(updateFrame);
        return;
      }
      var now = Date.now();
      var dt = Math.min((now - lastUpdateTime) / 1000, 0.016666);
      lastUpdateTime = now;

      if (resizeCanvas()) {
        initFramebuffers();
      }
      updateColors(dt);
      applyInputs();

      // Gentle ambient drift if user is idle for > 2.2s so screen stays gracefully alive
      if (isVisible && (now - lastInteraction) > 2200) {
        if (now - lastAutoTime > 1400) {
          lastAutoTime = now;
          var autoCol = generateColor();
          autoCol.r *= 3.5;
          autoCol.g *= 3.5;
          autoCol.b *= 3.5;
          var t = now * 0.001;
          var ax = 0.55 + 0.25 * Math.sin(t * 0.7);
          var ay = 0.45 + 0.20 * Math.cos(t * 0.9);
          var adx = Math.sin(t * 1.5) * 350;
          var ady = Math.cos(t * 1.3) * 350;
          splat(ax, ay, adx, ady, autoCol);
        }
      }

      step(dt);
      render(null);
      animFrameId = requestAnimationFrame(updateFrame);
    }

    // Input Handlers (maps clientX/clientY to container coordinates)
    function getContainerCoords(clientX, clientY) {
      var rect = container.getBoundingClientRect();
      var inside = clientX >= rect.left && clientX <= rect.right &&
                     clientY >= rect.top && clientY <= rect.bottom;
      var dpr = Math.min(window.devicePixelRatio || 1, 2.0);
      var posX = (clientX - rect.left) * dpr;
      var posY = (clientY - rect.top) * dpr;
      return { inside: inside, posX: posX, posY: posY };
    }

    function handleMouseDown(e) {
      var pt = getContainerCoords(e.clientX, e.clientY);
      if (!pt.inside) return;
      lastInteraction = Date.now();
      var pointer = pointers[0];
      updatePointerDownData(pointer, -1, pt.posX, pt.posY);
      clickSplat(pointer);
    }

    var firstMove = false;
    function handleMouseMove(e) {
      var pt = getContainerCoords(e.clientX, e.clientY);
      if (!pt.inside) return;
      lastInteraction = Date.now();
      var pointer = pointers[0];
      if (!firstMove) {
        var col = generateColor();
        updatePointerMoveData(pointer, pt.posX, pt.posY, col);
        firstMove = true;
      } else {
        updatePointerMoveData(pointer, pt.posX, pt.posY, pointer.color);
      }
    }

    function handleTouchStart(e) {
      var touches = e.targetTouches;
      if (!touches || !touches.length) return;
      var pointer = pointers[0];
      var pt = getContainerCoords(touches[0].clientX, touches[0].clientY);
      if (!pt.inside) return;
      lastInteraction = Date.now();
      updatePointerDownData(pointer, touches[0].identifier, pt.posX, pt.posY);
      clickSplat(pointer);
    }

    function handleTouchMove(e) {
      var touches = e.targetTouches;
      if (!touches || !touches.length) return;
      var pointer = pointers[0];
      var pt = getContainerCoords(touches[0].clientX, touches[0].clientY);
      if (!pt.inside) return;
      lastInteraction = Date.now();
      updatePointerMoveData(pointer, pt.posX, pt.posY, pointer.color);
    }

    function handleTouchEnd() {
      pointers[0].down = false;
    }

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    // IntersectionObserver to suspend simulation when container is scrolled out
    var io = new IntersectionObserver(function (entries) {
      isVisible = entries[0].isIntersecting && entries[0].intersectionRatio > 0;
    }, { threshold: [0, 0.05, 0.2] });
    io.observe(container);

    // Initial setup
    updateKeywords();
    resizeCanvas();
    initFramebuffers();
    animFrameId = requestAnimationFrame(updateFrame);

    // Initial introductory splats so hero glows gracefully immediately on open
    function doInitialSplats() {
      var count = config.RAINBOW_MODE ? 4 : 3;
      for (var i = 0; i < count; i++) {
        var col = generateColor();
        col.r *= 5.0;
        col.g *= 5.0;
        col.b *= 5.0;
        var x = 0.55 + 0.35 * (Math.random() - 0.5);
        var y = 0.45 + 0.35 * (Math.random() - 0.5);
        var dx = (Math.random() - 0.5) * 800;
        var dy = (Math.random() - 0.5) * 800;
        splat(x, y, dx, dy, col);
      }
    }

    doInitialSplats();
    setTimeout(doInitialSplats, 350);

    return {
      destroy: function () {
        isActive = false;
        if (animFrameId) cancelAnimationFrame(animFrameId);
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
        io.disconnect();
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      },
      splat: splat,
      config: config
    };
  }

  window.createSplashCursor = createSplashCursor;

  // Auto-initialize on DOM ready
  function autoInit() {
    var heroEl = document.querySelector('#hero-fluid');
    if (heroEl) {
      window.heroSplash = createSplashCursor(heroEl);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }
})();
