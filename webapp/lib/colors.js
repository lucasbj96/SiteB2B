// Browser-only color extraction (ported from the design prototype).
// Samples a downscaled canvas render of the logo and picks a primary +
// complementary secondary color, weighting saturation and frequency.

function hue(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (!d) return 0;
  let h;
  if (mx === r) h = ((g - b) / d) % 6;
  else if (mx === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h *= 60;
  return h < 0 ? h + 360 : h;
}

function hueDist(a, b) {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

function toHex(r, g, b) {
  return "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
}

export function extractColors(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const s = 64;
        const c = document.createElement("canvas");
        c.width = s;
        c.height = s;
        const ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0, s, s);
        const d = ctx.getImageData(0, 0, s, s).data;
        const bk = {};
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i], g = d[i + 1], b = d[i + 2], a = d[i + 3];
          if (a < 128) continue;
          const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
          const sat = mx === 0 ? 0 : (mx - mn) / mx;
          const l = 0.299 * r + 0.587 * g + 0.114 * b;
          if (l > 242 || l < 16) continue;
          const k = (r >> 4) + "_" + (g >> 4) + "_" + (b >> 4);
          if (!bk[k]) bk[k] = { r: 0, g: 0, b: 0, n: 0, s: 0 };
          const o = bk[k];
          o.r += r; o.g += g; o.b += b; o.n++; o.s += sat;
        }
        let arr = Object.values(bk).map((o) => ({ r: o.r / o.n, g: o.g / o.n, b: o.b / o.n, n: o.n, sat: o.s / o.n }));
        if (!arr.length) { resolve(null); return; }
        arr.forEach((x) => (x.score = x.n * (0.35 + x.sat * 1.4)));
        arr.sort((a, b) => b.score - a.score);
        const top = arr.slice(0, 6);
        const primary = top[0];
        const h1 = hue(primary.r, primary.g, primary.b);
        let sec = null, best = -1;
        for (const x of top) {
          if (x === primary) continue;
          const dh = hueDist(hue(x.r, x.g, x.b), h1);
          const sc = (dh + 15) * (0.3 + x.sat) * Math.log(x.n + 2);
          if (sc > best) { best = sc; sec = x; }
        }
        if (!sec) sec = primary;
        resolve({
          primary: toHex(primary.r, primary.g, primary.b),
          secondary: toHex(sec.r, sec.g, sec.b),
          palette: top.map((x) => toHex(x.r, x.g, x.b)),
        });
      } catch (e) {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}
