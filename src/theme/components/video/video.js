;(() => {
  'use strict';

  class Video {
    static of(element) {
      return new Video(element)
    }

    constructor(element) {
      this.rootElement = element
      this.element = element.querySelector('.video__content')
      this.playButton = this.rootElement.querySelector('.video__play')
      this.muteButton = this.rootElement.querySelector('.video__mute')

      this.playButton && this.playButton.addEventListener('click', () => {
        this.togglePlay()
      })
      this.muteButton && this.muteButton.addEventListener('click', () => {
        this.toggleMute()
      })

      this.element.addEventListener('play', () => {
        this.rootElement.style.setProperty('--paused', 0)
      })
      this.element.addEventListener('pause', () => {
        this.rootElement.style.setProperty('--paused', 1)
      })
      this.element.addEventListener('volumechange', (event) => {
        this.rootElement.style.setProperty('--muted', Number(event.target.muted))
      })
    }

    play() {
      return this.element.play()
    }

    pause() {
      return this.element.pause()
    }

    togglePlay() {
      const paused = this.element.paused
      const action = paused
        ? this.play()
        : this.pause()

      if (action instanceof Promise) {
        action.catch(console.log)
      }
    }

    toggleMute() {
      const { element } = this;
      element.muted = !element.muted
    }

    changePlayStyle() {
      this.rootElement.style.setProperty('--paused', Number(this.element.paused))
    }
  }

  Array.from(document.querySelectorAll('.video'))
    .forEach(Video.of)
})()