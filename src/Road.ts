export class Road {
  x: number
  width: number
  laneCount: number

  left: number
  right: number
  top: number
  bottom: number

  constructor(x: number, width: number, laneCount: number = 3) {
    this.x = x
    this.width = width
    this.laneCount = laneCount

    this.left = this.x - this.width / 2
    this.right = this.x + this.width / 2

    const Infinity = 10000000

    this.top = -Infinity
    this.bottom = Infinity
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 5
    ctx.strokeStyle = "white"

    for (let i = 0; i <= laneCount; i++) {
      // const x = lerc()
    }

    ctx.beginPath()
    ctx.moveTo(this.left, this.top)
    ctx.lineTo(this.left, this.bottom)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(this.right, this.top)
    ctx.lineTo(this.right, this.bottom)
    ctx.stroke()
  }
}
