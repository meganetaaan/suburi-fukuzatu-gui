export interface Content {
  x: number;
  y: number;
  draw(ctx: CanvasRenderingContext2D): void;
}

export interface Container extends Content {
  contents: Content[];
}

interface ContainerProps {
  x: number;
  y: number;
  contents: Content[];
}
export class Container implements Container {
  x;
  y;
  contents: Content[];
  constructor({ x, y, contents }: ContainerProps) {
    this.x = x;
    this.y = y;
    this.contents = contents;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save(); // 現在のコンテキスト状態を保存
    ctx.translate(this.x, this.y); // コンテナの座標にオフセット
    for (const content of this.contents) {
      content.draw(ctx);
    }
    ctx.restore(); // コンテキスト状態を元に戻す
  }
}

interface RootContainerProps extends ContainerProps {
  scrollX: number;
  scrollY: number;
  scale: number;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(Math.min(v, max), min);
}
export class RootContainer extends Container {
  #scale: number;
  scrollX: number;
  scrollY: number;
  scaleMax: number = 2.0;
  scaleMin: number = 0.5;
  constructor({ x, y, scale, scrollX, scrollY, contents }: RootContainerProps) {
    super({ x, y, contents });
    this.#scale = scale;
    this.scrollX = scrollX;
    this.scrollY = scrollY;
  }

  get scale() {
    return this.#scale;
  }

  set scale(scale) {
    this.#scale = clamp(scale, this.scaleMin, this.scaleMax);
  }

  zoomBy(ratio: number, origin?: { x: number; y: number }) {
    const prevScale = this.scale;
    this.scale += ratio; // 新しいズーム倍率を適用

    if (origin != null) {
      // ズームの基準点に基づいてスクロール位置を調整
      const scaleRatio = this.scale / prevScale;
      const [oldX, oldY] = [this.scrollX, this.scrollY];
      this.scrollX = origin.x - (origin.x - this.scrollX) * scaleRatio;
      this.scrollY = origin.y - (origin.y - this.scrollY) * scaleRatio;
      console.log(`(${oldX}, ${oldY}) => (${this.scrollX}, ${this.scrollY})`);
    }
  }

  scrollBy(deltaX: number, deltaY: number) {
    this.scrollX += deltaX;
    this.scrollY += deltaY;
  }

  draw(ctx: CanvasRenderingContext2D) {
    // 現在の描画状態を保存
    ctx.save();

    // スケールとスクロールを適用
    ctx.scale(this.scale, this.scale); // ズームを反映
    ctx.translate(-this.scrollX, -this.scrollY); // スクロールのオフセットを反映

    // コンテナ内のすべてのコンテンツを描画
    this.contents.forEach((content) => {
      content.draw(ctx); // コンテンツを描画
    });

    // 描画状態を元に戻す
    ctx.restore();
  }
}
