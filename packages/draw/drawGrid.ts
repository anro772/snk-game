import { getColor } from "@snk/types/grid";
import { pathRoundedRect } from "./pathRoundedRect";
import type { Grid, Color } from "@snk/types/grid";
import type { Point } from "@snk/types/point";
import type { Cell } from "@snk/github-user-contribution";

type Options = {
  colorDots: Record<Color, string>;
  colorEmpty: string;
  colorDotBorder: string;
  sizeCell: number;
  sizeDot: number;
  sizeDotBorderRadius: number;
};

const drawLabels = (
  ctx: CanvasRenderingContext2D,
  cells: Cell[],
  o: Options,
) => {
  ctx.save();

  // Set font style for labels
  ctx.font =
    '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';
  ctx.fillStyle = "#57606a";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Draw weekday labels
  const weekdays = ["", "Mon", "", "Wed", "", "Fri", ""];
  weekdays.forEach((day, i) => {
    if (day) {
      ctx.save();
      ctx.textAlign = "end";
      ctx.fillText(day, -o.sizeCell * 0.5, i * o.sizeCell + o.sizeCell * 0.5);
      ctx.restore();
    }
  });

  // Draw month labels
  const monthPositions = new Map<string, number>();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  cells.forEach((cell) => {
    if (cell.date && cell.y === 0) {
      const date = new Date(cell.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      if (!monthPositions.has(monthKey)) {
        monthPositions.set(monthKey, cell.x);
      }
    }
  });

  monthPositions.forEach((x, monthKey) => {
    const [, monthIndex] = monthKey.split("-");
    const monthName = months[parseInt(monthIndex)];
    ctx.save();
    ctx.textAlign = "start";
    ctx.fillText(
      monthName,
      x * o.sizeCell + o.sizeCell * 0.5,
      -o.sizeCell * 0.5,
    );
    ctx.restore();
  });

  ctx.restore();
};

export const drawGrid = (
  ctx: CanvasRenderingContext2D,
  grid: Grid,
  cells: Cell[] | Point[] | null,
  o: Options,
) => {
  // Draw labels if cells have date information
  if (cells && cells.length > 0 && "date" in cells[0]) {
    drawLabels(ctx, cells as Cell[], o);
  }

  for (let x = grid.width; x--; )
    for (let y = grid.height; y--; ) {
      if (!cells || cells.some((c) => c.x === x && c.y === y)) {
        const c = getColor(grid, x, y);
        // @ts-ignore
        const color = !c ? o.colorEmpty : o.colorDots[c];
        ctx.save();
        ctx.translate(
          x * o.sizeCell + (o.sizeCell - o.sizeDot) / 2,
          y * o.sizeCell + (o.sizeCell - o.sizeDot) / 2,
        );

        ctx.fillStyle = color;
        ctx.strokeStyle = o.colorDotBorder;
        ctx.lineWidth = 1;
        ctx.beginPath();

        pathRoundedRect(ctx, o.sizeDot, o.sizeDot, o.sizeDotBorderRadius);

        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
      }
    }
};
