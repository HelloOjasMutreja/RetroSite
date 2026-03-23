"use client";

import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Attract‑mode game selector                                         */
/* ------------------------------------------------------------------ */

type GameType = "invaders" | "snake" | "pacmaze";

const GAMES: GameType[] = ["invaders", "snake", "pacmaze"];

export function AttractModeGame({
  width = 320,
  height = 240,
}: {
  width?: number;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game] = useState<GameType>(
    () => GAMES[Math.floor(Math.random() * GAMES.length)]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;

    switch (game) {
      case "invaders":
        rafId = runInvaders(ctx, width, height);
        break;
      case "snake":
        rafId = runSnake(ctx, width, height);
        break;
      case "pacmaze":
        rafId = runPacMaze(ctx, width, height);
        break;
    }

    return () => cancelAnimationFrame(rafId);
  }, [game, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}

/* ================================================================== */
/*  SPACE INVADERS – 5×3 grid marching left/right/down                 */
/* ================================================================== */

function runInvaders(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number
): number {
  const COLS = 5;
  const ROWS = 3;
  const INV_W = 16;
  const INV_H = 12;
  const GAP_X = 24;
  const GAP_Y = 20;
  const SPEED = 0.6;
  const DROP = 14;

  let offsetX = 20;
  let offsetY = 20;
  let dir = 1;
  let lastTime = 0;

  // Simple invader pixel pattern (8×6)
  const pattern = [
    [0, 0, 1, 0, 0, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [1, 0, 1, 0, 0, 1, 0, 1],
  ];

  function drawInvader(x: number, y: number) {
    const pixel = 2;
    for (let row = 0; row < pattern.length; row++) {
      for (let col = 0; col < pattern[row].length; col++) {
        if (pattern[row][col]) {
          ctx.fillRect(x + col * pixel, y + row * pixel, pixel, pixel);
        }
      }
    }
  }

  function frame(time: number) {
    const delta = time - lastTime;
    lastTime = time;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);

    offsetX += SPEED * dir * (delta / 16);

    const gridWidth = COLS * GAP_X;
    if (offsetX + gridWidth > w - 10 || offsetX < 10) {
      dir *= -1;
      offsetY += DROP;
      if (offsetY > h - 40) offsetY = 20;
    }

    ctx.fillStyle = "#00ff88";
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        drawInvader(offsetX + c * GAP_X, offsetY + r * GAP_Y);
      }
    }

    // Draw simple "player" at bottom
    ctx.fillStyle = "#00e5ff";
    const playerX = w / 2 - 6;
    ctx.fillRect(playerX, h - 18, 12, 4);
    ctx.fillRect(playerX + 4, h - 22, 4, 4);

    return requestAnimationFrame(frame);
  }

  return requestAnimationFrame(frame);
}

/* ================================================================== */
/*  SNAKE – autonomous, grows on food                                  */
/* ================================================================== */

function runSnake(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number
): number {
  const CELL = 8;
  const COLS = Math.floor(w / CELL);
  const ROWS = Math.floor(h / CELL);
  const TICK_MS = 100;

  let snake = [
    { x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) },
  ];
  let dir = { x: 1, y: 0 };
  let food = spawnFood();
  let lastTick = 0;

  function spawnFood() {
    return {
      x: Math.floor(Math.random() * (COLS - 2)) + 1,
      y: Math.floor(Math.random() * (ROWS - 2)) + 1,
    };
  }

  function autoSteer() {
    const head = snake[0];
    const target = food;

    // Possible directions (exclude reverse)
    const options = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ].filter(d => !(d.x === -dir.x && d.y === -dir.y));

    // Prefer direction toward food
    options.sort((a, b) => {
      const dA = Math.abs(head.x + a.x - target.x) + Math.abs(head.y + a.y - target.y);
      const dB = Math.abs(head.x + b.x - target.x) + Math.abs(head.y + b.y - target.y);
      return dA - dB;
    });

    // Pick first safe option
    for (const opt of options) {
      const nx = head.x + opt.x;
      const ny = head.y + opt.y;
      if (nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS) {
        const hitSelf = snake.some(s => s.x === nx && s.y === ny);
        if (!hitSelf) {
          dir = opt;
          return;
        }
      }
    }
  }

  function tick() {
    autoSteer();

    const head = snake[0];
    const newHead = { x: head.x + dir.x, y: head.y + dir.y };

    // Wall or self collision → reset
    if (
      newHead.x < 0 || newHead.x >= COLS ||
      newHead.y < 0 || newHead.y >= ROWS ||
      snake.some(s => s.x === newHead.x && s.y === newHead.y)
    ) {
      snake = [{ x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) }];
      dir = { x: 1, y: 0 };
      food = spawnFood();
      return;
    }

    snake.unshift(newHead);

    if (newHead.x === food.x && newHead.y === food.y) {
      food = spawnFood();
      // Keep grown length
    } else {
      snake.pop();
    }
  }

  function frame(time: number) {
    if (time - lastTick > TICK_MS) {
      tick();
      lastTick = time;
    }

    ctx.fillStyle = "#050510";
    ctx.fillRect(0, 0, w, h);

    // Draw food
    ctx.fillStyle = "#ff2d78";
    ctx.fillRect(food.x * CELL, food.y * CELL, CELL - 1, CELL - 1);

    // Draw snake
    ctx.fillStyle = "#00ff88";
    for (const seg of snake) {
      ctx.fillRect(seg.x * CELL, seg.y * CELL, CELL - 1, CELL - 1);
    }

    // Head slightly brighter
    if (snake.length > 0) {
      ctx.fillStyle = "#66ffbb";
      ctx.fillRect(snake[0].x * CELL, snake[0].y * CELL, CELL - 1, CELL - 1);
    }

    return requestAnimationFrame(frame);
  }

  return requestAnimationFrame(frame);
}

/* ================================================================== */
/*  PAC‑MAZE – pac‑man navigating a simple maze                        */
/* ================================================================== */

function runPacMaze(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number
): number {
  const CELL = 10;
  const COLS = Math.floor(w / CELL);
  const ROWS = Math.floor(h / CELL);

  // Simple maze: 1 = wall, 0 = path
  const maze: number[][] = [];
  for (let r = 0; r < ROWS; r++) {
    maze[r] = [];
    for (let c = 0; c < COLS; c++) {
      // Borders
      if (r === 0 || r === ROWS - 1 || c === 0 || c === COLS - 1) {
        maze[r][c] = 1;
      }
      // Internal walls — every 4th column and row
      else if (
        (r % 4 === 0 && c % 6 !== 0) ||
        (c % 6 === 0 && r % 4 !== 0 && r > 2 && r < ROWS - 2)
      ) {
        maze[r][c] = 1;
      } else {
        maze[r][c] = 0;
      }
    }
  }

  // Build dots on open spaces
  const dots: Set<string> = new Set();
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (maze[r][c] === 0 && (r + c) % 2 === 0) {
        dots.add(`${c},${r}`);
      }
    }
  }

  let pac = { x: 2, y: 2 };
  let pacDir = { x: 1, y: 0 };
  let mouth = 0;
  let mouthDir = 1;
  let lastTick = 0;
  const TICK = 80;

  function tryMove() {
    // Try current direction first
    let nx = pac.x + pacDir.x;
    let ny = pac.y + pacDir.y;

    if (nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS && maze[ny][nx] === 0) {
      pac.x = nx;
      pac.y = ny;
      dots.delete(`${nx},${ny}`);
      return;
    }

    // Try turning — pick random open neighbor
    const dirs = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ];
    for (const d of dirs.sort(() => Math.random() - 0.5)) {
      nx = pac.x + d.x;
      ny = pac.y + d.y;
      if (nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS && maze[ny][nx] === 0) {
        pacDir = d;
        pac.x = nx;
        pac.y = ny;
        dots.delete(`${nx},${ny}`);
        return;
      }
    }
  }

  function frame(time: number) {
    if (time - lastTick > TICK) {
      tryMove();
      lastTick = time;
    }

    // Mouth animation
    mouth += 0.15 * mouthDir;
    if (mouth > 0.8) mouthDir = -1;
    if (mouth < 0) mouthDir = 1;

    // Clear
    ctx.fillStyle = "#000008";
    ctx.fillRect(0, 0, w, h);

    // Draw maze walls
    ctx.fillStyle = "#2244cc";
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (maze[r][c] === 1) {
          ctx.fillRect(c * CELL, r * CELL, CELL - 1, CELL - 1);
        }
      }
    }

    // Draw dots
    ctx.fillStyle = "#ffffff";
    for (const key of dots) {
      const [cx, cy] = key.split(",").map(Number);
      ctx.fillRect(cx * CELL + 3, cy * CELL + 3, 3, 3);
    }

    // Draw Pac‑Man
    const px = pac.x * CELL + CELL / 2;
    const py = pac.y * CELL + CELL / 2;
    const r = CELL / 2 + 1;

    // Rotation based on direction
    let angle = 0;
    if (pacDir.x === 1) angle = 0;
    else if (pacDir.x === -1) angle = Math.PI;
    else if (pacDir.y === -1) angle = -Math.PI / 2;
    else if (pacDir.y === 1) angle = Math.PI / 2;

    ctx.fillStyle = "#ffe600";
    ctx.beginPath();
    ctx.arc(px, py, r, angle + mouth, angle + Math.PI * 2 - mouth);
    ctx.lineTo(px, py);
    ctx.closePath();
    ctx.fill();

    // Respawn dots if most are eaten
    if (dots.size < 10) {
      for (let rr = 0; rr < ROWS; rr++) {
        for (let cc = 0; cc < COLS; cc++) {
          if (maze[rr][cc] === 0 && (rr + cc) % 2 === 0) {
            dots.add(`${cc},${rr}`);
          }
        }
      }
    }

    return requestAnimationFrame(frame);
  }

  return requestAnimationFrame(frame);
}
