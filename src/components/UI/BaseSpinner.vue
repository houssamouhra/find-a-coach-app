<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="3em"
    height="3em"
    viewBox="0 0 24 24"
  >
    <circle cx="4" cy="12" r="3" fill="#3A606E">
      <animate
        id="svgSpinners3DotsFade0"
        fill="freeze"
        attributeName="opacity"
        begin="0;svgSpinners3DotsFade1.end-0.113s"
        dur="0.338s"
        values="1;0.2"
      />
    </circle>
    <circle cx="12" cy="12" r="3" fill="#3A606E" opacity="0.4">
      <animate
        fill="freeze"
        attributeName="opacity"
        begin="svgSpinners3DotsFade0.begin+0.068s"
        dur="0.338s"
        values="1;0.2"
      />
    </circle>
    <circle cx="20" cy="12" r="3" fill="#3A606E" opacity="0.3">
      <animate
        id="svgSpinners3DotsFade1"
        fill="freeze"
        attributeName="opacity"
        begin="svgSpinners3DotsFade0.begin+0.135s"
        dur="0.338s"
        values="1;0.2"
      />
    </circle>
  </svg>
</template>
