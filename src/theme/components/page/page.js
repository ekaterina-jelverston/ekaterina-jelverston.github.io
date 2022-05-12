;(() => {
  'use strict';

  const rootElement = document.documentElement

  function calculate() {
    rootElement.style.setProperty('--viewport-width', window.innerWidth)
  }

  calculate()
  window.addEventListener('resize', calculate)
})()