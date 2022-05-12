;(() => {
  'use strict';

  const mediaContainerSelector = '.work-detail-card__media'
  const contentSelector = '.work-detail-card__content'

  const container = document.querySelector(mediaContainerSelector)
  const content = document.querySelector(contentSelector)

  if (!content || !container) {
    return
  }

  const FIT_TYPES = {
    WIDTH: 'width',
    HEIGHT: 'height'
  }

  function getFitType(container) {
    const containerAspectRatio = container.offsetWidth / container.offsetHeight

    const fit = containerAspectRatio >= 1
      ? FIT_TYPES.HEIGHT
      : FIT_TYPES.WIDTH

    return fit
  }

  function calculate() {
    const fitType = getFitType(container, content)
    content.setAttribute('data-fit', fitType)
  }

  calculate()
  window.addEventListener('resize', calculate)
  window.addEventListener('orientationchange', calculate)
})();