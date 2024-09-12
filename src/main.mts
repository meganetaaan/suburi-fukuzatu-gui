import { Content, RootContainer } from "./contents.mjs";

class Rectangle implements Content {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

const rootContainer = new RootContainer({
  x: 0,
  y: 0,
  scale: 1,
  scrollX: 0,
  scrollY: 0,
  contents: [
    new Rectangle(50, 50, 100, 100, "red"),
    new Rectangle(200, 100, 150, 150, "blue"),
    new Rectangle(400, 200, 200, 200, "green"),
  ],
});

document.addEventListener("DOMContentLoaded", async () => {
  // 初期化処理
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // キャンバスをクリア
    rootContainer.draw(ctx); // RootContainerの描画
    requestAnimationFrame(draw);
  }

  draw(); // 初回描画

  canvas.addEventListener("wheel", (event: WheelEvent) => {
    if (event.ctrlKey) {
      event.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const point = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      console.log(point);
      rootContainer.zoomBy(-event.deltaY * 0.001, point);
    } else {
      rootContainer.scrollBy(event.deltaX * 0.1, event.deltaY * 0.1);
    }
  });
});
