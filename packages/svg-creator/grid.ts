import type { Color, Empty } from "@snk/types/grid";
import type { Point } from "@snk/types/point";
import type { Cell } from "@snk/github-user-contribution";
import { createAnimation } from "./css-utils";
import { h } from "./xml-utils";

export type Options = {
  colorDots: Record<Color, string>;
  colorEmpty: string;
  colorDotBorder: string;
  sizeCell: number;
  sizeDot: number;
  sizeDotBorderRadius: number;
};

const createLabels = (cells: Cell[], sizeCell: number) => {
  const svgElements: string[] = [];
  const styles: string[] = [];

  // Add weekday labels
  const weekdays = ["", "Mon", "", "Wed", "", "Fri", ""];
  weekdays.forEach((day, i) => {
    if (day) {
      svgElements.push(
        h("text", {
          x: -sizeCell * 0.5,
          y: i * sizeCell + sizeCell * 0.7,
          class: "label",
          "text-anchor": "end",
        }).replace("/>", `>${day}</text>`),
      );
    }
  });

  // Add month labels - find unique months from cells with dates
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
      // Only check top row cells
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
    svgElements.push(
      h("text", {
        x: x * sizeCell + sizeCell * 0.5,
        y: -sizeCell * 0.5,
        class: "label",
        "text-anchor": "start",
      }).replace("/>", `>${monthName}</text>`),
    );
  });

  styles.push(
    `.label {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      font-size: 11px;
      fill: #57606a;
    }
    @media (prefers-color-scheme: dark) {
      .label {
        fill: #8b949e;
      }
    }`,
  );

  return { svgElements, styles };
};

export const createGrid = (
  cells: (Point & { t: number | null; color: Color | Empty })[],
  { sizeDotBorderRadius, sizeDot, sizeCell }: Options,
  duration: number,
  dateCells?: Cell[],
) => {
  const svgElements: string[] = [];
  const styles = [
    `.c{
      shape-rendering: geometricPrecision;
      fill: var(--ce);
      stroke-width: 1px;
      stroke: var(--cb);
      animation: none ${duration}ms linear infinite;
      width: ${sizeDot}px;
      height: ${sizeDot}px;
    }`,
  ];

  let i = 0;
  for (const { x, y, color, t } of cells) {
    const id = t && "c" + (i++).toString(36);
    const m = (sizeCell - sizeDot) / 2;

    if (t !== null && id) {
      const animationName = id;

      styles.push(
        createAnimation(animationName, [
          { t: t - 0.0001, style: `fill:var(--c${color})` },
          { t: t + 0.0001, style: `fill:var(--ce)` },
          { t: 1, style: `fill:var(--ce)` },
        ]),

        `.c.${id}{
          fill: var(--c${color});
          animation-name: ${animationName}
        }`,
      );
    }

    svgElements.push(
      h("rect", {
        class: ["c", id].filter(Boolean).join(" "),
        x: x * sizeCell + m,
        y: y * sizeCell + m,
        rx: sizeDotBorderRadius,
        ry: sizeDotBorderRadius,
      }),
    );
  }

  // Add labels if date cells are provided
  if (dateCells) {
    const labels = createLabels(dateCells, sizeCell);
    svgElements.push(...labels.svgElements);
    styles.push(...labels.styles);
  }

  return { svgElements, styles };
};
