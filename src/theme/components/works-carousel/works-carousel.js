;(() => {
  'use strict';

  class Carousel {
    static of(rootElement) {
      return new Carousel(rootElement)
    }

    constructor(rootElement) {
      this.rootElement = rootElement
      this.list = rootElement.querySelector('.works-carousel__list')
      this.items = Array.from(rootElement.querySelectorAll('.works-carousel__item'))
      this.controls = rootElement.querySelector('.works-carousel__controls')
      this.prevButton = rootElement.querySelector('.works-carousel__button_type_prev')
      this.nextButton = rootElement.querySelector('.works-carousel__button_type_next')

      this.rootElement.addEventListener('click', (event) => {
        const button = event.target.closest('.works-carousel__dots-button')

        if (!button) {
          return
        }

        const index = parseInt(button.value)
        this.goToSlide(index)
      })

      this.list.addEventListener('scroll', (event) => {
        requestAnimationFrame(() => {
          const slideWidth = this.list.offsetWidth
          const maxAvailableScroll = this.list.scrollWidth - slideWidth
          const ratio = (this.list.scrollLeft + slideWidth / 2) / maxAvailableScroll
          const nearestIndex = Math.floor(ratio * (this.items.length - 1))

          this.rootElement.style.setProperty('--active-index', nearestIndex)
        })
      })

      this.prevButton.addEventListener('click', () => {
        this.list.scrollLeft -= this.list.offsetWidth
      })

      this.nextButton.addEventListener('click', () => {
        this.list.scrollLeft += this.list.offsetWidth
      })

      this.rootElement.style.setProperty('--scrollbar-size', this.list.offsetHeight - this.list.clientHeight)

      this.rootElement.classList.remove('works-carousel_fallback')
    }

    goToSlide(slideIndex) {
      this.list.scrollLeft = slideIndex * this.list.offsetWidth
    }
  }

  Array.from(document.querySelectorAll('.works-carousel'))
    .forEach(Carousel.of)
})()