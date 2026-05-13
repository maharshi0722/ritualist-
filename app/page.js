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

    // -----------------------------------
    // DEVICE
    // -----------------------------------

    const mobile = width < 768;

    // move map slightly right
    const centerX = mobile
      ? width / 2
      : width / 2 + 120;

    const centerY = height / 2 + (mobile ? 50 : 10);

    // -----------------------------------
    // RESPONSIVE RINGS
    // -----------------------------------

    const rings = mobile
      ? [
          { count: 10, radius: 78, size: 42 },
          { count: 14, radius: 128, size: 38 },
          { count: 18, radius: 174, size: 34 },
          { count: 22, radius: 220, size: 30 },
        ]
      : [
          { count: 14, radius: 130, size: 72 },
          { count: 20, radius: 220, size: 64 },
          { count: 28, radius: 310, size: 56 },
          { count: 34, radius: 395, size: 48 },
        ];

    // -----------------------------------
    // LOGO
    // -----------------------------------

    const logo = new Image();
    logo.src = "/images/logo.png";

    // -----------------------------------
    // FIRST IMAGE
    // -----------------------------------

    const firstImage = new Image();
    firstImage.src = "/images/BUNSDEV.JPG";

    // -----------------------------------
    // LOAD 1.png -> 102.png
    // -----------------------------------

    const avatars = [];

    for (let i = 1; i <= 102; i++) {
      const img = new Image();

      img.src = `/${i}.png`;

      avatars.push(img);
    }

    // -----------------------------------
    // BACKGROUND
    // -----------------------------------

    function background() {
      const gradient = ctx.createLinearGradient(
        0,
        0,
        0,
        height
      );

      gradient.addColorStop(0, "#9468f4");
      gradient.addColorStop(0.45, "#5d3ba9");
      gradient.addColorStop(1, "#130a22");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // glow

      const glow = ctx.createRadialGradient(
        centerX,
        centerY,
        50,
        centerX,
        centerY,
        mobile ? 260 : 520
      );

      glow.addColorStop(
        0,
        "rgba(255,255,255,0.10)"
      );

      glow.addColorStop(
        1,
        "rgba(255,255,255,0)"
      );

      ctx.beginPath();

      ctx.fillStyle = glow;

      ctx.arc(
        centerX,
        centerY,
        mobile ? 260 : 520,
        0,
        Math.PI * 2
      );

      ctx.fill();

      // stars

      for (let i = 0; i < 180; i++) {
        const x = (i * 91) % width;
        const y = (i * 157) % height;

        ctx.beginPath();

        ctx.fillStyle =
          i % 2 === 0
            ? "rgba(255,255,255,0.7)"
            : "rgba(200,220,255,0.4)";

        ctx.arc(
          x,
          y,
          (i % 3) + 0.5,
          0,
          Math.PI * 2
        );

        ctx.fill();
      }

      // sparkles

      for (let i = 0; i < 24; i++) {
        const x = (i * 173) % width;
        const y = (i * 133) % height;

        ctx.strokeStyle =
          "rgba(255,255,255,0.14)";

        ctx.lineWidth = 1;

        ctx.beginPath();

        ctx.moveTo(x - 4, y);
        ctx.lineTo(x + 4, y);

        ctx.moveTo(x, y - 4);
        ctx.lineTo(x, y + 4);

        ctx.stroke();
      }

      // clouds

      ctx.fillStyle = "#f7d9e7";

      const scale = mobile ? 0.7 : 1;

      // left

      ctx.beginPath();

      ctx.arc(
        40,
        90,
        60 * scale,
        0,
        Math.PI * 2
      );

      ctx.arc(
        95,
        105,
        45 * scale,
        0,
        Math.PI * 2
      );

      ctx.arc(
        -10,
        118,
        45 * scale,
        0,
        Math.PI * 2
      );

      ctx.fill();

      // right

      ctx.beginPath();

      ctx.arc(
        width - 40,
        90,
        60 * scale,
        0,
        Math.PI * 2
      );

      ctx.arc(
        width - 95,
        105,
        45 * scale,
        0,
        Math.PI * 2
      );

      ctx.arc(
        width + 10,
        118,
        45 * scale,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }

    // -----------------------------------
    // DRAW AVATAR
    // -----------------------------------

    function avatar(x, y, size, img) {
      if (
        !img.complete ||
        img.naturalWidth === 0
      )
        return;

      ctx.save();

      ctx.beginPath();

      ctx.arc(x, y, size / 2, 0, Math.PI * 2);

      ctx.closePath();

      ctx.clip();

      ctx.drawImage(
        img,
        x - size / 2,
        y - size / 2,
        size,
        size
      );

      ctx.restore();

      // border

      ctx.beginPath();

      ctx.strokeStyle = "white";

      ctx.lineWidth = mobile ? 2 : 3;

      ctx.arc(x, y, size / 2, 0, Math.PI * 2);

      ctx.stroke();
    }

    // -----------------------------------
    // MAIN
    // -----------------------------------

    function render() {
      ctx.clearRect(0, 0, width, height);

      background();

      // smoother animation

      const time = performance.now() * 0.00008;

      // -----------------------------------
      // FIRST IMAGE
      // -----------------------------------

      const firstSize = mobile ? 58 : 92;

      const firstY = mobile
        ? centerY - 260
        : centerY - 330;

      avatar(
        centerX,
        firstY,
        firstSize,
        firstImage
      );

      // -----------------------------------
      // ROTATING RINGS
      // -----------------------------------

      let current = 0;

      rings.forEach((ring, ringIndex) => {
        for (let i = 0; i < ring.count; i++) {
          if (current >= avatars.length) return;

          const angle =
            (Math.PI * 2 * i) / ring.count;

          // smoother slow rotation

          const rotation =
            time *
            (ringIndex % 2 === 0 ? 1 : -1) *
            (0.25 + ringIndex * 0.08);

          const x =
            centerX +
            Math.cos(angle + rotation) *
              ring.radius;

          const y =
            centerY +
            Math.sin(angle + rotation) *
              ring.radius;

          avatar(
            x,
            y,
            ring.size,
            avatars[current]
          );

          current++;
        }
      });

      // -----------------------------------
      // CENTER ORB
      // -----------------------------------

      const orb = mobile ? 58 : 88;

      ctx.shadowColor = "rgba(255,255,255,0.25)";
      ctx.shadowBlur = 25;

      ctx.beginPath();

      ctx.fillStyle = "#d8ffd8";

      ctx.arc(
        centerX,
        centerY,
        orb,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.beginPath();

      ctx.strokeStyle = "white";

      ctx.lineWidth = 4;

      ctx.arc(
        centerX,
        centerY,
        orb,
        0,
        Math.PI * 2
      );

      ctx.stroke();

      // -----------------------------------
      // LOGO ROTATION
      // -----------------------------------

      if (
        logo.complete &&
        logo.naturalWidth !== 0
      ) {
        const logoSize = mobile ? 70 : 120;

        ctx.save();

        ctx.translate(centerX, centerY);

        ctx.rotate(time * 0.5);

        ctx.drawImage(
          logo,
          -logoSize / 2,
          -logoSize / 2,
          logoSize,
          logoSize
        );

        ctx.restore();
      }

      // -----------------------------------
      // SIDE TITLE
      // -----------------------------------

      if (!mobile) {
        ctx.textAlign = "left";

        ctx.fillStyle = "white";

        ctx.font = "700 68px Georgia";

        ctx.fillText(
          "Ritualist",
          90,
          height / 2 - 40
        );

        ctx.fillText(
          "Map",
          90,
          height / 2 + 40
        );

        ctx.font = "500 18px Inter";

        ctx.fillStyle =
          "rgba(255,255,255,0.75)";

        ctx.fillText(
          "ritual ecosystem community",
          95,
          height / 2 + 95
        );
      } else {
        ctx.textAlign = "center";

        ctx.fillStyle = "white";

        ctx.font = "700 28px Georgia";

        ctx.fillText(
          "Ritualist Map",
          width / 2,
          60
        );

        ctx.font = "500 12px Inter";

        ctx.fillStyle =
          "rgba(255,255,255,0.75)";

        ctx.fillText(
          "ritual ecosystem community",
          width / 2,
          82
        );
      }

      requestAnimationFrame(render);
    }

    render();

    // -----------------------------------
    // RESIZE
    // -----------------------------------

    function resize() {
      location.reload();
    }

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener(
        "resize",
        resize
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
          background: #130a22;
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