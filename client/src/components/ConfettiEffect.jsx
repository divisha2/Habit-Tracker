import React, { useEffect, useState } from 'react';

const ConfettiEffect = ({ trigger, duration = 3000 }) => {
  const [particles, setParticles] = useState([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger) {
      createConfetti();
      setIsActive(true);
      
      const timer = setTimeout(() => {
        setIsActive(false);
        setParticles([]);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger, duration]);

  const createConfetti = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
    const shapes = ['🎉', '🎊', '⭐', '✨', '🌟', '💫', '🎈', '🎁'];
    
    const newParticles = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        size: Math.random() * 20 + 10,
        speedX: (Math.random() - 0.5) * 4,
        speedY: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }
    setParticles(newParticles);
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-bounce"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            fontSize: `${particle.size}px`,
            color: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            animation: `confetti-fall ${duration / 1000}s linear forwards`
          }}
        >
          {particle.shape}
        </div>
      ))}
      
      <style jsx>{`
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ConfettiEffect;