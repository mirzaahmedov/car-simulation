import { Car } from "./Car";
import { NeuralNetworks } from "./netrork";
import { Road } from "./Road";
import { Visualizer } from "./visualizer";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const networkView = document.getElementById(
  "network_view"
) as HTMLCanvasElement;

canvas.width = 600;
canvas.height = window.innerHeight;

networkView.width = 400;
networkView.height = window.innerHeight;

const CAR_WIDTH = 60;
const CAR_HEIGHT = 120;

const ctx = canvas.getContext("2d");
const vctx = networkView.getContext("2d");

const road = new Road(canvas.width / 2, canvas.width * 0.9, 3);
const N = 1000;
const cars = generateCars(N);

const traffic = Array(40)
  .fill(null)
  .map(() => {
    const x = road.getLaneCenter(Math.floor(Math.random() * 3));

    return new Car(
      x === 3 ? 0 : x,
      -10000 * Math.random() - 400,
      CAR_WIDTH,
      CAR_HEIGHT,
      "DUMMY",
      Math.random() * 5
    );
  });

let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  const brain = () => JSON.parse(localStorage.getItem("bestBrain")!);
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = brain();
    if (i !== 0) {
      NeuralNetworks.mutate(cars[i].brain!, 0.2);
    }
  }
  bestCar.brain = brain();
}

animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}
function discard() {
  localStorage.removeItem("bestBrain");
}

const saveBtn = document.querySelector("#save-button") as HTMLButtonElement;
saveBtn.onclick = save;
const discardBtn = document.querySelector(
  "#discard-button"
) as HTMLButtonElement;
discardBtn.onclick = discard;

function generateCars(n: number) {
  const cars: Car[] = [];

  for (let i = 0; i < n; i++) {
    cars.push(
      new Car(road.getLaneCenter(1), 100, CAR_WIDTH, CAR_HEIGHT, "AI", 7)
    );
  }

  return cars;
}

function animate() {
  if (!ctx) {
    return;
  }
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (let car of traffic) {
    car.update(road.borders, []);
  }

  cars.forEach((car) => {
    car.update(road.borders, traffic);
  });

  bestCar = cars.find((c) => c.y === Math.min(...cars.map((c) => c.y)))!;

  ctx.save();
  ctx.translate(0, -bestCar!.y + canvas.height * 0.7);

  road.draw(ctx);
  ctx.globalAlpha = 0.2;

  cars.forEach((car) => {
    car.draw(ctx, "blue");
  });
  bestCar!.draw(ctx, "blue", true);

  ctx.globalAlpha = 1;

  for (let car of traffic) {
    car.draw(ctx, "red");
  }

  ctx.restore();

  if (vctx) {
    Visualizer.drawNetwork(vctx, bestCar!.brain!);
  }
  requestAnimationFrame(animate);
}
