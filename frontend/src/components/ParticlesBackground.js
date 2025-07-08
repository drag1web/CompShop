import React, { useRef, useEffect, useMemo } from 'react';

const ParticlesBackground = () => {
  const canvasRef = useRef(null);
  const particlesArray = useRef([]);
  const colors = useMemo(() => ['#FF6F00', '#FF3D00', '#FFD600'], []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > height) this.speedY = -this.speedY;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function init() {
      particlesArray.current.length = 0;
      for (let i = 0; i < 150; i++) {
        particlesArray.current.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particlesArray.current.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animate);
    }

    function handleResize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      init();
    }

    window.addEventListener('resize', handleResize);

    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [colors]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        background: 'linear-gradient(135deg, #000000, #1a1a1a)',
        width: '100%',
        height: '100%',
      }}
    />
  );
};

export default ParticlesBackground;
