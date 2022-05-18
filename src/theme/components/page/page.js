;(() => {
  'use strict';

  const rootElement = document.documentElement

  // вычисление размера области просмотра
  function calculate() {
    rootElement.style.setProperty('--viewport-width', window.innerWidth)
  }

  calculate()
  window.addEventListener('resize', calculate)
})()