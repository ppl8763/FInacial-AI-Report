import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
    const navigate = useNavigate();
    const [greeting, setGreeting] = useState("");
    const [isHovered, setIsHovered] = useState(false);
    const [niftyValue, setNiftyValue] = useState(null);
    const [displayText, setDisplayText] = useState("");
    const messages = ["AI-driven insights", "Smart financial decisions", "Real-time stock trends"];
    const canvasRef = useRef(null);

    // Get time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    useEffect(() => {
        setGreeting(getGreeting());
        fetchNiftyValue();
        startTypingAnimation();
        initParticles();
    }, []);

    // Fetch real-time NIFTY value (Replace with actual API)
    const fetchNiftyValue = async () => {
        try {
            // Replace with a real API endpoint for NIFTY
            const response = await fetch("https://api.example.com/nifty");
            const data = await response.json();
            setNiftyValue(data.value);
        } catch (error) {
            console.error("Failed to fetch NIFTY value:", error);
        }
    };

    // Typing animation
    const startTypingAnimation = () => {
        let index = 0;
        let charIndex = 0;
        const type = () => {
            if (charIndex < messages[index].length) {
                setDisplayText(messages[index].substring(0, charIndex + 1));
                charIndex++;
                setTimeout(type, 100);
            } else {
                setTimeout(() => {
                    charIndex = 0;
                    index = (index + 1) % messages.length;
                    type();
                }, 1500);
            }
        };
        type();
    };

    // Particle animation
    const initParticles = () => {
        const canvas = canvasRef.current;
        if (!canvas) return; // Ensure canvas exists

        const ctx = canvas.getContext("2d");
        const particlesArray = [];
        const numberOfParticles = 50;

        // Particle class
        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            // Draw particle with red glowing effect
            draw() {
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0, // Start circle (center of particle)
                    this.x, this.y, this.size // End circle (radius of particle)
                );
                gradient.addColorStop(0, this.color); // Center color
                gradient.addColorStop(1, "rgba(0, 0, 255, 0)"); // Transparent edge

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = gradient;
                ctx.fill();
            }

            // Update particle position
            update() {
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        // Initialize particles
        const init = () => {
            particlesArray.length = 0;
            for (let i = 0; i < numberOfParticles; i++) {
                const size = Math.random() * 10 + 5; // Random size between 5 and 15
                const x = Math.random() * (canvas.width - size * 2) + size;
                const y = Math.random() * (canvas.height - size * 2) + size;
                const directionX = (Math.random() * 0.4) - 0.2;
                const directionY = (Math.random() * 0.4) - 0.2;
                const color = "rgba(0, 0, 255, 0.8)"; // Red color with some transparency
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        };

        // Animate particles
        const animate = () => {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particlesArray.forEach(particle => particle.update());
            connectParticles();
        };

        // Connect particles with lines
        const connectParticles = () => {
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    const dx = particlesArray[a].x - particlesArray[b].x;
                    const dy = particlesArray[a].y - particlesArray[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 100) {
                        ctx.strokeStyle = `rgba(0, 0, 255, ${1 - distance / 100})`; // Red lines
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        // Resize canvas on window resize
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();
        animate();
    };

    return (
        <div className="home-container">
            <canvas ref={canvasRef} className="particle-canvas"></canvas>
            <h1 className="home-title">
                {greeting} 👋 <br /> Welcome to AI Financial Insights
            </h1>
            <p className="home-description">
                Discover <span className="typing-text">{displayText}</span> 📊.
            </p>
            {niftyValue && (
                <div className="market-data">
                    <p className="nifty-value">NIFTY 50: ₹{niftyValue}</p>
                    <p className="market-time">Market Time: {new Date().toLocaleTimeString()}</p>
                </div>
            )}
            <button 
                className={`btn ${isHovered ? "btn-hover" : ""}`}
                onClick={() => navigate("/dashboard")}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                Get Started →
            </button>
        </div>
    );
};

export default Home;