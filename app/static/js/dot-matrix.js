/**
 * [SYS-INIT] dot-matrix.js — Shared dot-matrix canvas renderer.
 *
 * Single source for the animated dot grid used by the loader,
 * footer, error page, and nav mega-menus.
 * Loaded before those scripts via layout.html.
 */

(function () {
  "use strict";

  var DOT_SIZE = 2;
  var DOT_GAP  = 7;

  // ⚡ [SYS] LUT — pre-built fillStyle strings to avoid string concat in hot loop
  var GRAY_LUT = new Array(256);
  for (var gi = 0; gi < 256; gi++) {
    GRAY_LUT[gi] = "rgb(" + gi + "," + gi + "," + gi + ")";
  }

  // ⚡ [CPU] SIN LUT — eliminates ~5 400 Math.sin calls per frame
  var SIN_RES  = 4096;
  var SIN_LUT  = new Float32Array(SIN_RES);
  var TWO_PI   = Math.PI * 2;
  for (var si = 0; si < SIN_RES; si++) {
    SIN_LUT[si] = Math.sin((si / SIN_RES) * TWO_PI);
  }
  function fastSin(rad) {
    var idx = ((rad % TWO_PI + TWO_PI) % TWO_PI) * (SIN_RES / TWO_PI);
    return SIN_LUT[(idx | 0) % SIN_RES];
  }

  /**
   * Populates a dot array sized to fill `width x height` pixels.
   * Each dot stores randomised base values for the wave/flicker shaders.
   *
   * @param {number} width  - Logical canvas width
   * @param {number} height - Logical canvas height
   * @returns {Array<{x:number, y:number, baseGray:number, phase:number, flickerSpeed:number}>}
   */
  function buildDots(width, height) {
    var cols = Math.floor(width / DOT_GAP);
    var rows = Math.floor(height / DOT_GAP);
    var dots = [];

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        dots.push({
          x: c * DOT_GAP + DOT_GAP / 2,
          y: r * DOT_GAP + DOT_GAP / 2,
          baseGray: Math.random() * 30 + 12,
          phase: Math.random() * Math.PI * 2,
          flickerSpeed: 0.4 + Math.random() * 2.2
        });
      }
    }

    return dots;
  }

  /**
   * Renders a single frame of the dot-matrix effect.
   *
   * Wave layers: horizontal scan + vertical + per-dot flicker + breathing.
   * An optional `extraBrightness` (0-1) maps to extra intensity —
   * the loader uses it for load-progress, others leave it at 0.
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {Array} dots             - From buildDots()
   * @param {number} width           - Logical canvas width
   * @param {number} height          - Logical canvas height
   * @param {number} time            - rAF timestamp (ms)
   * @param {number} [extraBrightness=0] - 0..1 additional intensity boost
   */
  function drawDotMatrix(ctx, dots, width, height, time, extraBrightness) {
    ctx.clearRect(0, 0, width, height);

    var t       = time * 0.001;
    var halfDot = DOT_SIZE / 2;
    var breath  = fastSin(t * 0.4) * 0.5 + 0.5;
    var extra   = (extraBrightness || 0) * 40;

    for (var i = 0, len = dots.length; i < len; i++) {
      var d = dots[i];

      var hWave   = fastSin(d.x * 0.04 + t * 2.5 + d.phase) * 0.5 + 0.5;
      var vWave   = fastSin(d.y * 0.06 + t * 1.8) * 0.3 + 0.7;
      var flicker = fastSin(t * d.flickerSpeed + d.phase * 3) * 0.5 + 0.5;

      var intensity = d.baseGray
        + hWave * 50 * vWave
        + flicker * 20
        + breath * 25
        + extra;

      if (intensity < 8)   intensity = 8;
      if (intensity > 160) intensity = 160;

      var g = (intensity + 0.5) | 0;
      ctx.fillStyle = GRAY_LUT[g];
      ctx.fillRect(d.x - halfDot, d.y - halfDot, DOT_SIZE, DOT_SIZE);
    }
  }

  /**
   * Measures a wrapper element, sizes the canvas to fill it (retina-aware),
   * and returns the dot array + dimensions. Convenience for init flows.
   *
   * @param {HTMLCanvasElement} canvas
   * @param {HTMLElement} wrapper
   * @returns {{ dots: Array, width: number, height: number } | null}
   */
  function initDotMatrix(canvas, wrapper) {
    var rect = wrapper.getBoundingClientRect();
    var w = rect.width;
    var h = rect.height;
    if (w === 0 || h === 0) return null;

    // ⚡ [GPU] DPR CAPPED — 3x retina triples pixel count for negligible visual gain
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    return {
      dots: buildDots(w, h),
      width: w,
      height: h
    };
  }

  // === EXPOSE GLOBALLY ===
  window.DotMatrix = {
    buildDots: buildDots,
    draw: drawDotMatrix,
    init: initDotMatrix
  };
})();
