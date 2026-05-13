"use client";

import { useEffect, useRef } from "react";

export default function RitualistMap() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.scale(dpr, dpr);

    // =========================
    // RESPONSIVE
    // =========================

    const isMobile = width < 768;

    // =========================
    // CENTER POSITION
    // =========================

    const centerX = isMobile
      ? width / 2
      : width * 0.60;

    const centerY = isMobile
      ? height * 0.57
      : height * 0.52;

    // =========================
    // RINGS CONFIG
    // =========================

    const rings = isMobile
      ? [
          { count: 14, radius: 85, size: 42 },
          { count: 18, radius: 145, size: 38 },
          { count: 24, radius: 200, size: 34 },
          { count: 28, radius: 255, size: 30 },
        ]
      : [
          { count: 20, radius: 120, size: 58 },
          { count: 26, radius: 195, size: 54 },
          { count: 34, radius: 270, size: 50 },
          { count: 42, radius: 345, size: 46 },
        ];

    // =========================
    // IMAGES
    // =========================

    const logo = new Image();
    logo.src = "/images/logo.png";

    const avatars = [];

    // YOUR JPG FILES

    const jpgFiles = [
      "BUNSDEV.JPG",
      "CLARIE.JPG",
      "DUNKEN.JPG",
      "ELIF.JPG",
      "ERIC.JPG",
      "FLASH.JPG",
      "HINATA.JPG",
      "JEZ.JPG",
      "JOSH.JPG",
      "KASH.JPG",
      "MAJORPROJECT.JPG",
      "MEISON.JPG",
      "STEFAN.JPG",
      "WHITESOCK.JPG",
    ];

    jpgFiles.forEach((file) => {
      const img = new Image();
      img.src = `/images/${file}`;
      avatars.push(img);
    });

    // 1.png → 102.png

    for (let i = 1; i <= 103; i++) {
      const img = new Image();

      img.src = `/${i}.png`;

      avatars.push(img);
    }

    // =========================
    // BACKGROUND
    // =========================

    function drawBackground() {
      const gradient = ctx.createLinearGradient(
        0,
        0,
        0,
        height
      );

      gradient.addColorStop(0, "#9b72ff");
      gradient.addColorStop(0.4, "#5d33b5");
      gradient.addColorStop(1, "#12061f");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // glow

      const glow = ctx.createRadialGradient(
        centerX,
        centerY,
        80,
        centerX,
        centerY,
        isMobile ? 280 : 500
      );

      glow.addColorStop(
        0,
        "rgba(255,255,255,0.10)"
      );

      glow.addColorStop(
        1,
        "rgba(255,255,255,0)"
      );

      ctx.fillStyle = glow;

      ctx.beginPath();

      ctx.arc(
        centerX,
        centerY,
        isMobile ? 280 : 500,
        0,
        Math.PI * 2
      );

      ctx.fill();

      // stars

      for (let i = 0; i < 240; i++) {
        const x = (i * 137) % width;
        const y = (i * 89) % height;

        ctx.beginPath();

        ctx.fillStyle =
          i % 2 === 0
            ? "rgba(255,255,255,0.85)"
            : "rgba(255,255,255,0.25)";

        ctx.arc(
          x,
          y,
          (i % 3) + 0.5,
          0,
          Math.PI * 2
        );

        ctx.fill();
      }

      // clouds

      ctx.fillStyle = "#f5d8e5";

      const cloudScale = isMobile ? 0.7 : 1;

      // left

      ctx.beginPath();

      ctx.arc(
        35,
        100,
        58 * cloudScale,
        0,
        Math.PI * 2
      );

      ctx.arc(
        90,
        110,
        42 * cloudScale,
        0,
        Math.PI * 2
      );

      ctx.arc(
        -15,
        120,
        42 * cloudScale,
        0,
        Math.PI * 2
      );

      ctx.fill();

      // right

      ctx.beginPath();

      ctx.arc(
        width - 35,
        100,
        58 * cloudScale,
        0,
        Math.PI * 2
      );

      ctx.arc(
        width - 90,
        110,
        42 * cloudScale,
        0,
        Math.PI * 2
      );

      ctx.arc(
        width + 15,
        120,
        42 * cloudScale,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }

    // =========================
    // DRAW PFP
    // =========================

    function drawAvatar(x, y, size, image) {
      if (
        !image.complete ||
        image.naturalWidth === 0
      )
        return;

      ctx.save();

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        size / 2,
        0,
        Math.PI * 2
      );

      ctx.closePath();

      ctx.clip();

      ctx.drawImage(
        image,
        x - size / 2,
        y - size / 2,
        size,
        size
      );

      ctx.restore();

      // white border

      ctx.beginPath();

      ctx.strokeStyle = "white";

      ctx.lineWidth = isMobile ? 2 : 3;

      ctx.arc(
        x,
        y,
        size / 2,
        0,
        Math.PI * 2
      );

      ctx.stroke();
    }

    // =========================
    // RENDER
    // =========================

    function render() {
      ctx.clearRect(0, 0, width, height);

      drawBackground();

      const time = performance.now() * 0.00009;

      // =========================
      // AVATAR RINGS
      // =========================

      let avatarIndex = 0;

      rings.forEach((ring, ringIndex) => {
        for (let i = 0; i < ring.count; i++) {
          if (avatarIndex >= avatars.length)
            return;

          const angle =
            (Math.PI * 2 * i) / ring.count;

          const rotation =
            time *
            (ringIndex % 2 === 0 ? 1 : -1) *
            (0.14 + ringIndex * 0.03);

          const x =
            centerX +
            Math.cos(angle + rotation) *
              ring.radius;

          const y =
            centerY +
            Math.sin(angle + rotation) *
              ring.radius;

          drawAvatar(
            x,
            y,
            ring.size,
            avatars[avatarIndex]
          );

          avatarIndex++;
        }
      });

      // =========================
      // CENTER LOGO CIRCLE
      // =========================

      // =========================
// CENTER LOGO CIRCLE
// =========================

const orbRadius = isMobile ? 62 : 78;

// glow

ctx.shadowColor =
  "rgba(214,255,214,0.55)";

ctx.shadowBlur = 35;

ctx.beginPath();

ctx.fillStyle = "#d8ffd8";

ctx.arc(
  centerX,
  centerY,
  orbRadius,
  0,
  Math.PI * 2
);

ctx.fill();

// border

ctx.beginPath();

ctx.strokeStyle =
  "rgba(255,255,255,0.95)";

ctx.lineWidth = 4;

ctx.arc(
  centerX,
  centerY,
  orbRadius,
  0,
  Math.PI * 2
);

ctx.stroke();

// =========================
// BIGGER FULL LOGO
// =========================

if (
  logo.complete &&
  logo.naturalWidth > 0
) {
  ctx.shadowBlur = 0;

  // BIG LOGO ONLY

  const logoSize = isMobile
    ? 58
    : 78;

  ctx.drawImage(
    logo,
    centerX - logoSize / 2,
    centerY - logoSize / 2,
    logoSize,
    logoSize
  );
}

      // =========================
      // TEXT
      // =========================

      if (!isMobile) {
        ctx.textAlign = "left";

        ctx.fillStyle = "white";

        ctx.font = "700 68px Georgia";

        ctx.fillText(
          "Ritualist",
          65,
          height / 2 - 10
        );

        ctx.fillText(
          "Map",
          65,
          height / 2 + 70
        );

        ctx.font = "500 17px Inter";

        ctx.fillStyle =
          "rgba(255,255,255,0.82)";

        ctx.fillText(
          "ritual ecosystem community",
          68,
          height / 2 + 115
        );
      } else {
        ctx.textAlign = "center";

        ctx.fillStyle = "white";

        ctx.font = "700 34px Georgia";

        ctx.fillText(
          "Ritualist Map",
          width / 2,
          58
        );

        ctx.font = "500 13px Inter";

        ctx.fillStyle =
          "rgba(255,255,255,0.82)";

        ctx.fillText(
          "ritual ecosystem community",
          width / 2,
          84
        );
      }

      requestAnimationFrame(render);
    }

    render();

    // =========================
    // RESIZE
    // =========================

    function handleResize() {
      location.reload();
    }

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden">
      <canvas ref={canvasRef} />

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          background: #12061f;
          font-family: Inter, sans-serif;
        }

        canvas {
          width: 100vw;
          height: 100vh;
          display: block;
        }
      `}</style>
    </div>
  );
}
