export class Controls {
  forward: boolean
  left: boolean
  right: boolean
  reverse: boolean

  constructor(type: string) {
    this.forward = false
    this.left = false
    this.right = false
    this.reverse = false

    if (type === "KEYS") {
      this.#addKeyboardListeners()
    } else {
      this.forward = true
    }
  }

  #addKeyboardListeners() {
    document.onkeydown = (e) => {
      switch (e.key) {
        case "ArrowLeft":
          this.left = true
          break
        case "ArrowRight":
          this.right = true
          break
        case "ArrowUp":
          this.forward = true
          break
        case "ArrowDown":
          this.reverse = true
          break
      }
    }
    document.onkeyup = (e) => {
      switch (e.key) {
        case "ArrowLeft":
          this.left = false
          break
        case "ArrowRight":
          this.right = false
          break
        case "ArrowUp":
          this.forward = false
          break
        case "ArrowDown":
          this.reverse = false
          break
      }
    }
  }
}
