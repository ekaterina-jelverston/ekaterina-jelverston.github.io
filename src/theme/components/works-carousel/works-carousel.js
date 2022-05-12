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
        const offset = 5 // для уменьшения погрешности вычисления
        requestAnimationFrame(() => {
          // const nearestIndex = Math.floor((this.list.scrollLeft + offset) / this.list.offsetWidth)
          const nearestIndex = Math.floor((this.list.scrollLeft + offset) / this.list.offsetWidth)

          // const ratio = (this.list.scrollLeft) / (this.list.scrollWidth - this.list.offsetWidth)
          // const nearestIndex = Math.floor((ratio) * (this.items.length - 1))

          this.rootElement.style.setProperty('--active-index', nearestIndex)
        })
      })

      this.prevButton.addEventListener('click', () => {
        this.list.scrollLeft -= this.list.offsetWidth
      })

      this.nextButton.addEventListener('click', () => {
        this.list.scrollLeft += this.list.offsetWidth
      })
    }

    goToSlide(slideIndex) {
      this.list.scrollLeft = slideIndex * this.list.offsetWidth
    }
  }

  Array.from(document.querySelectorAll('.works-carousel'))
    .forEach(Carousel.of)
})()