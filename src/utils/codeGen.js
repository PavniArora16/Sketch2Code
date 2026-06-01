/**
 * Maps pixel dimensions to approximate Tailwind classes.
 * We do best-fit rounding to the Tailwind scale.
 */

// Tailwind spacing scale (in px, factor of 4, up to 96)
const SPACING = [0,1,2,4,6,8,10,12,14,16,20,24,28,32,36,40,44,48,52,56,60,64,72,80,96];
function toSpacing(px) {
  const rem = px / 4;
  const closest = SPACING.reduce((a, b) =>
    Math.abs(b - rem) < Math.abs(a - rem) ? b : a
  );
  return closest;
}

function wClass(px) { return `w-[${px}px]`; }
function hClass(px) { return `h-[${px}px]`; }

function pxClass(px) {
  const v = toSpacing(px);
  return `px-${v}`;
}
function pyClass(px) {
  const v = toSpacing(px);
  return `py-${v}`;
}

// Approximate border radius
function roundedClass(h) {
  if (h <= 28) return "rounded-full";
  if (h <= 44) return "rounded-lg";
  return "rounded-xl";
}

export function generateCode(shape) {
  if (!shape || !shape.type) return null;

  const { w, h, type } = shape;
  const px = Math.round(Math.max(8, w * 0.1));
  const py = Math.round(Math.max(4, h * 0.18));

  switch (type) {
    case "button":
      return {
        jsx: `<button
  className="${wClass(w)} ${hClass(h)} ${pxClass(px)} ${pyClass(py)} ${roundedClass(h)} bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors"
>
  Click me
</button>`,
        tailwind: `${wClass(w)} ${hClass(h)} ${pxClass(px)} ${pyClass(py)} ${roundedClass(h)} bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors`,
        css: `width: ${w}px;\nheight: ${h}px;\npadding: ${py}px ${px}px;\nborder-radius: ${h <= 28 ? "9999px" : h <= 44 ? "8px" : "12px"};\nbackground: #3b82f6;\ncolor: white;\nfont-weight: 600;\nborder: none;\ncursor: pointer;`,
      };

    case "input":
      return {
        jsx: `<input
  type="text"
  placeholder="Type here..."
  className="${wClass(w)} ${hClass(h)} ${pxClass(px)} ${pyClass(py)} rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
/>`,
        tailwind: `${wClass(w)} ${hClass(h)} ${pxClass(px)} ${pyClass(py)} rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm`,
        css: `width: ${w}px;\nheight: ${h}px;\npadding: ${py}px ${px}px;\nborder-radius: 8px;\nborder: 1px solid #d1d5db;\nfont-size: 14px;\noutline: none;`,
      };

    case "card":
      return {
        jsx: `<div
  className="${wClass(w)} ${hClass(h)} ${pxClass(px)} ${pyClass(py)} rounded-xl bg-white shadow-md border border-gray-100 flex flex-col gap-2"
>
  <h3 className="font-semibold text-gray-800">Card Title</h3>
  <p className="text-sm text-gray-500">Card content goes here.</p>
</div>`,
        tailwind: `${wClass(w)} ${hClass(h)} ${pxClass(px)} ${pyClass(py)} rounded-xl bg-white shadow-md border border-gray-100`,
        css: `width: ${w}px;\nheight: ${h}px;\npadding: ${py}px ${px}px;\nborder-radius: 12px;\nbackground: white;\nbox-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);\nborder: 1px solid #f3f4f6;`,
      };

    case "navbar":
      return {
        jsx: `<nav
  className="${wClass(w)} ${hClass(h)} ${pxClass(px)} ${pyClass(py)} bg-white border-b border-gray-200 flex items-center justify-between shadow-sm"
>
  <span className="font-bold text-lg">Logo</span>
  <div className="flex gap-6 text-sm text-gray-600">
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#">Contact</a>
  </div>
</nav>`,
        tailwind: `${wClass(w)} ${hClass(h)} ${pxClass(px)} ${pyClass(py)} bg-white border-b border-gray-200 flex items-center justify-between shadow-sm`,
        css: `width: ${w}px;\nheight: ${h}px;\npadding: ${py}px ${px}px;\nbackground: white;\nborder-bottom: 1px solid #e5e7eb;\ndisplay: flex;\nalign-items: center;\njustify-content: space-between;\nbox-shadow: 0 1px 3px rgb(0 0 0 / 0.1);`,
      };

    default:
      return null;
  }
}
