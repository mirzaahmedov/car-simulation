import { Car } from "./Car"
import { Road } from "./Road"

const canvas = document.getElementById("canvas") as HTMLCanvasElement

canvas.width = 400
canvas.height = window.innerHeight

const ctx = canvas.getContext("2d")

const car = new Car(300, 300, 60, 100)
const road = new Road(canvas.width / 2, canvas.width * 0.9)


animate()

function animate() {
  ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight)

  road.draw(ctx!)

  car.update()
  car.draw(ctx!)

  requestAnimationFrame(animate)
}

