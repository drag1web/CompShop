import React from 'react';
import Particles from 'react-tsparticles';

const HomeParticles = () => (
  <Particles
    options={{
      fullScreen: { enable: false }, // НЕ занимать весь экран
      background: { color: { value: "transparent" } },
      particles: {
        color: { value: ["#f39c12", "#e74c3c", "#f1c40f"] },
        move: { enable: true, speed: 1.2, outModes: "out" },
        number: { value: 40, density: { enable: true, area: 700 } },
        opacity: { value: 0.5, random: { enable: true, minimumValue: 0.3 } },
        shape: { type: "circle" },
        size: { value: { min: 2, max: 5 } },
        links: {
          enable: true,
          distance: 120,
          color: "#f39c12",
          opacity: 0.3,
          width: 1,
        }
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: "grab" },
          onClick: { enable: true, mode: "push" }
        },
        modes: {
          grab: { distance: 140, links: { opacity: 0.7 } },
          push: { quantity: 4 }
        }
      },
      detectRetina: true,
    }}
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: -1,
      pointerEvents: "none",
      borderRadius: "20px",
    }}
  />
);

export default HomeParticles;
