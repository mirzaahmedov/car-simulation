import { Car } from "./Car"
import { Road } from "./Road"

const canvas = document.getElementById("canvas") as HTMLCanvasElement

canvas.width = 400
canvas.height = window.innerHeight

const ctx = canvas.getContext("2d")

const road = new Road(canvas.width / 2, canvas.width * 0.9, 3)
const car = new Car(road.getLaneCenter(2), 300, 60, 100, "KEYS")

const traffic = [
  new Car(road.getLaneCenter(2), 200, 60, 100, "DUMMY", 2)
]

animate()

function animate() {
  if (!ctx) {
    return
  }
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

  for (let car of traffic) {
    car.update(road.borders)
  }

  ctx.save()
  ctx.translate(0, -car.y + canvas.height * 0.7)

  road.draw(ctx)
  car.update(road.borders)
  car.draw(ctx)


  for (let car of traffic) {
    car.draw(ctx)
  }

  ctx.restore()
  requestAnimationFrame(animate)
}

