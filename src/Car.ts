import { Controls } from "./Controls";
import { NeuralNetworks } from "./netrork";
import { Sensor } from "./Sensor";
import { polysIntersect } from "./utils";

export class Car {
  x: number;
  y: number;
  width: number;
  height: number;

  speed: number;
  acceleration: number;
  maxSpeed: number;
  friction: number;
  damaged: boolean;
  polygon: { x: number; y: number }[];

  angle: number;

  sensor?: Sensor;
  brain?: NeuralNetworks;
  useBrain: boolean;
  controls: Controls;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    control_type: string,
    maxSpeed: number = 3
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;

    this.maxSpeed = maxSpeed;
    this.friction = 0.05;
    this.damaged = false;

    this.angle = 0;

    this.polygon = [];

    this.useBrain = control_type === "AI";

    if (control_type !== "DUMMY") {
      this.sensor = new Sensor(this);
      this.brain = new NeuralNetworks([this.sensor.rayCount, 12, 4]);
    }
    this.controls = new Controls(control_type);
  }
  update(roadBorders: { x: number; y: number }[][], traffic: Car[]) {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamage(roadBorders, traffic);
    }
    if (this.sensor && this.brain) {
      this.sensor.update(roadBorders, traffic);
      const offsets = this.sensor.readings.map((s) =>
        s === null ? 0 : 1 - s.offset
      );
      const outputs = NeuralNetworks.feedForward(offsets, this.brain);

      if (this.useBrain) {
        this.controls.forward = !!outputs[0];
        this.controls.left = !!outputs[1];
        this.controls.right = !!outputs[2];
        this.controls.reverse = !!outputs[3];
      }
    }
  }
  draw(
    ctx: CanvasRenderingContext2D,
    color: string,
    drawSensors: boolean = false
  ) {
    ctx.beginPath();

    if (this.damaged) {
      ctx.fillStyle = "grey";
    } else {
      ctx.fillStyle = color;
    }

    const points = this.#createPolygon();

    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.fill();

    if (this.sensor && drawSensors) {
      this.sensor.draw(ctx);
    }
  }
  #createPolygon() {
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);

    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });

    return points;
  }
  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }
    if (this.speed !== 0) {
      if (this.speed > 0) {
        this.speed -= this.friction;
      }
      if (this.speed < 0) {
        this.speed += this.friction;
      }
    }
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    if (this.controls.left) {
      this.angle += 0.01;
    }
    if (this.controls.right) {
      this.angle -= 0.03;
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }
  #assessDamage(roadBorders: { x: number; y: number }[][], traffic: Car[]) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }

    for (let i = 0; i < traffic.length; i++) {
      if (polysIntersect(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }
    return false;
  }
}
