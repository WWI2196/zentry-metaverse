import React, { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import Button from './Button';
import { TiArrowBack } from "react-icons/ti";
import { FaTrophy, FaRedo, FaPause, FaPlay } from "react-icons/fa";
import { GiShipWheel } from "react-icons/gi";
import gsap from 'gsap';
import { useNavigate, useLocation } from 'react-router-dom';
import AnimatedTitle from './AnimatedTitle';

// Spaceship game constants
const GAME_STATE = {
  READY: 'ready',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver'
};

// Starship colors
const SHIP_COLORS = [
  '#edff66', // Yellow 
  '#4fb7dd', // Blue
  '#ff66ed', // Pink  
];

// Asteroid colors
const ASTEROID_COLORS = [
  '#774FB7', // Purple
  '#FFB266', // Orange
  '#66FFFF', // Cyan
];

const ComingSoon = () => {
    const location = useLocation();
    const containerRef = useRef(null);
    const gameContainerRef = useRef(null);
    const gameCanvasRef = useRef(null);
    const shipRef = useRef(null);
    const loaderRef = useRef(null);
    const navigate = useNavigate();
    
    // Page loading state
    const [isLoading, setIsLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingComplete, setLoadingComplete] = useState(false);
    
    // Game state
    const [gameState, setGameState] = useState(GAME_STATE.READY);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [highScore, setHighScore] = useState(0);
    const [shipColor, setShipColor] = useState(SHIP_COLORS[0]);
    
    // Refs for game mechanics
    const gameLoopRef = useRef(null);
    const timerRef = useRef(null);
    const asteroidsRef = useRef([]);
    const starsRef = useRef([]);
    const keysRef = useRef({
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        ' ': false, // Spacebar
    });
    
    // Safety mechanism to ensure loading screen doesn't get stuck
    useLayoutEffect(() => {
        if (!location.state?.from === 'features') {
            const safetyTimeout = setTimeout(() => {
                setIsLoading(false);
                if (loaderRef.current) {
                    loaderRef.current.style.opacity = 0;
                    loaderRef.current.style.pointerEvents = 'none';
                }
            }, 5000);
            
            return () => clearTimeout(safetyTimeout);
        }
    }, [location.state]);
    
    // Simulate loading the page assets
    useEffect(() => {
        // Prevent duplicate loading animation if coming from features
        if (location.state?.from === 'features') {
            setTimeout(() => {
                setIsLoading(false);
                setLoadingComplete(true);
            }, 1000);
            return;
        }
        
        // Pre-load game assets here
        const starshipImage = new Image();
        starshipImage.src = '/img/logo.png'; // Using logo as stand-in for ship
        
        const loadingTl = gsap.timeline({
            onComplete: () => handleLoadingComplete()
        });
        
        const interval = setInterval(() => {
            setLoadingProgress(prev => {
                const next = prev + Math.random() * 8 + 2;
                if (next >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return next;
            });
        }, 100);
        
        const handleLoadingComplete = () => {
            if (loaderRef.current) {
                gsap.to(loaderRef.current, {
                    opacity: 0,
                    pointerEvents: 'none',
                    duration: 0.5,
                    onComplete: () => {
                        setIsLoading(false);
                        setLoadingComplete(true);
                        
                        // Animate in content
                        if (containerRef.current) {
                            const ctx = gsap.context(() => {
                                gsap.from('.reveal-item', {
                                    y: 40,
                                    opacity: 0,
                                    duration: 0.8,
                                    stagger: 0.15,
                                    ease: 'power2.out'
                                });
                                
                                gsap.to('.floating-element', {
                                    y: -15,
                                    duration: 1.5,
                                    ease: 'power1.inOut',
                                    stagger: 0.2,
                                    repeat: -1,
                                    yoyo: true
                                });
                            }, containerRef);
                            
                            return () => ctx.revert();
                        }
                    }
                });
            } else {
                setIsLoading(false);
                setLoadingComplete(true);
            }
        };
        
        // When loading reaches 100%
        const checkProgress = () => {
            if (loadingProgress >= 99) {
                clearInterval(interval);
                // Ensure we end at exactly 100%
                setLoadingProgress(100);
                loadingTl.play();
            }
        };
        
        const progressCheck = setInterval(checkProgress, 200);
        
        return () => {
            clearInterval(interval);
            clearInterval(progressCheck);
            loadingTl.kill();
        };
    }, [location.state]);
    
    // Load high score from localStorage
    useEffect(() => {
        try {
            const savedHighScore = localStorage.getItem('metaverseVoyagerScore');
            if (savedHighScore) {
                setHighScore(parseInt(savedHighScore, 10) || 0);
            }
        } catch (e) {
            console.error("Error loading high score:", e);
        }
    }, []);
    
    // Initialize the game canvas with proper context handling
    useEffect(() => {
        if (!gameCanvasRef.current || !gameContainerRef.current) return;
        
        const canvas = gameCanvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Make sure canvas dimensions match the container size
        const resizeCanvas = () => {
            if (gameContainerRef.current && canvas) {
                const rect = gameContainerRef.current.getBoundingClientRect();
                
                // Set actual size in memory (scaled to account for extra pixel density)
                const scale = window.devicePixelRatio || 1;
                canvas.width = rect.width * scale;
                canvas.height = rect.height * scale;
                
                // CSS size remains the same (this is important for positioning)
                canvas.style.width = `${rect.width}px`;
                canvas.style.height = `${rect.height}px`;
                
                // Normalize coordinate system to use CSS pixels
                ctx.scale(scale, scale);
                
                // Initialize stars on resize
                createStars();
                
                // Re-initialize ship position after resize
                if (shipRef.current) {
                    shipRef.current.x = rect.width / 2;
                    shipRef.current.y = rect.height - 100;
                } else {
                    initShip();
                }
            }
        };
        
        // Create initial starfield
        const createStars = () => {
            if (!canvas) return;
            
            starsRef.current = [];
            const starCount = Math.floor((canvas.width * canvas.height) / 2000);
            
            for (let i = 0; i < starCount; i++) {
                starsRef.current.push({
                    x: Math.random() * (canvas.width / window.devicePixelRatio || 1),
                    y: Math.random() * (canvas.height / window.devicePixelRatio || 1),
                    size: Math.random() * 2 + 0.5,
                    speed: Math.random() * 2 + 0.5,
                    opacity: Math.random() * 0.8 + 0.2
                });
            }
        };
        
        // Initialize ship
        const initShip = () => {
            if (!canvas) return;
            const width = canvas.width / (window.devicePixelRatio || 1);
            const height = canvas.height / (window.devicePixelRatio || 1);
            
            // Create ship in the middle-bottom of the screen
            shipRef.current = {
                x: width / 2,
                y: height - 100,
                width: 40,
                height: 40,
                speed: 5,
                color: shipColor,
                shield: 100, // Shield health
            };
        };
        
        // Initial setup
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas(); // Call once to set initial size
        
        // Ensure the ship is created
        if (!shipRef.current) {
            initShip();
        }
        
        // Clean up event listeners
        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [shipColor]);
    
    // Handle keyboard controls with improved event handling
    useEffect(() => {
        if (gameState !== GAME_STATE.PLAYING) return;
        
        const handleKeyDown = (e) => {
            if (Object.keys(keysRef.current).includes(e.key)) {
                keysRef.current[e.key] = true;
                e.preventDefault();
            }
        };
        
        const handleKeyUp = (e) => {
            if (Object.keys(keysRef.current).includes(e.key)) {
                keysRef.current[e.key] = false;
                e.preventDefault();
            }
            
            // Spacebar to fire
            if (e.key === ' ' && gameState === GAME_STATE.PLAYING) {
                fireLaser();
                e.preventDefault();
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [gameState]);
    
    // Game timer
    useEffect(() => {
        if (gameState !== GAME_STATE.PLAYING) return;
        
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    endGame();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [gameState]);
    
    // Create the game loop
    useEffect(() => {
        if (gameState !== GAME_STATE.PLAYING) return;
        
        const canvas = gameCanvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Main game animation loop
        const gameLoop = () => {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw stars (background)
            updateStars(ctx);
            
            // Move ship based on key presses
            updateShip(ctx);
            
            // Update and draw asteroids
            updateAsteroids(ctx);
            
            // Spawn new asteroids randomly
            if (Math.random() < 0.02) { // 2% chance per frame
                spawnAsteroid();
            }
            
            // Check for collisions
            checkCollisions();
            
            gameLoopRef.current = requestAnimationFrame(gameLoop);
        };
        
        gameLoopRef.current = requestAnimationFrame(gameLoop);
        
        return () => {
            if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current);
            }
        };
    }, [gameState]);
    
    // Update the starfield with optimized rendering
    const updateStars = (ctx) => {
        if (!ctx || !ctx.canvas) return;
        
        const canvasWidth = ctx.canvas.width / (window.devicePixelRatio || 1);
        const canvasHeight = ctx.canvas.height / (window.devicePixelRatio || 1);
        
        starsRef.current.forEach((star, index) => {
            // Move stars down to create scrolling effect
            star.y += star.speed;
            
            // Reset stars that move off screen
            if (star.y > canvasHeight) {
                star.y = 0;
                star.x = Math.random() * canvasWidth;
            }
            
            // Draw star with a more visible appearance
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Add glow effect to some stars
            if (star.size > 1.5) {
                ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
                ctx.shadowBlur = 4;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0; // Reset shadow
            }
        });
    };
    
    // Update ship position based on key presses with improved visuals
    const updateShip = (ctx) => {
        const ship = shipRef.current;
        if (!ship || !ctx || !ctx.canvas) return;
        
        const canvasWidth = ctx.canvas.width / (window.devicePixelRatio || 1);
        const canvasHeight = ctx.canvas.height / (window.devicePixelRatio || 1);
        
        // Move ship based on keys pressed
        if (keysRef.current.ArrowLeft) ship.x -= ship.speed;
        if (keysRef.current.ArrowRight) ship.x += ship.speed;
        if (keysRef.current.ArrowUp) ship.y -= ship.speed;
        if (keysRef.current.ArrowDown) ship.y += ship.speed;
        
        // Keep ship within canvas bounds
        ship.x = Math.max(ship.width / 2, Math.min(canvasWidth - ship.width / 2, ship.x));
        ship.y = Math.max(ship.height / 2, Math.min(canvasHeight - ship.height / 2, ship.y));
        
        // Draw ship
        ctx.save();
        ctx.translate(ship.x, ship.y);
        
        // Ship body - improved design
        ctx.fillStyle = ship.color;
        ctx.beginPath();
        ctx.moveTo(0, -ship.height / 2); // Nose of the ship
        ctx.lineTo(ship.width / 2, ship.height / 2); // Bottom right
        ctx.lineTo(ship.width / 5, ship.height / 4); // Inward curve on right
        ctx.lineTo(-ship.width / 5, ship.height / 4); // Inward curve on left
        ctx.lineTo(-ship.width / 2, ship.height / 2); // Bottom left
        ctx.closePath();
        ctx.fill();
        
        // Add some detail
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.moveTo(-ship.width / 4, ship.height / 4);
        ctx.lineTo(ship.width / 4, ship.height / 4);
        ctx.lineTo(0, -ship.height / 3);
        ctx.closePath();
        ctx.fill();
        
        // Shield effect around ship with pulsing
        const pulse = 0.05 * Math.sin(Date.now() / 200);
        const shieldOpacity = (ship.shield / 100 * 0.5) + pulse; // Fade based on shield health with pulse
        ctx.strokeStyle = `rgba(120, 220, 255, ${shieldOpacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, ship.width / 1.5, 0, Math.PI * 2);
        ctx.stroke();
        
        // Engine glow with animated effect
        const flicker = 0.2 * Math.random();
        const engineGlowGradient = ctx.createRadialGradient(
            0, ship.height / 2,
            0,
            0, ship.height / 2,
            ship.width / 2
        );
        engineGlowGradient.addColorStop(0, `rgba(255, 100, 0, ${0.8 + flicker})`);
        engineGlowGradient.addColorStop(0.4, `rgba(255, 100, 0, ${0.5 + flicker})`);
        engineGlowGradient.addColorStop(1, 'rgba(255, 50, 0, 0)');
        
        ctx.fillStyle = engineGlowGradient;
        ctx.beginPath();
        ctx.moveTo(-ship.width / 4, ship.height / 2);
        ctx.lineTo(0, ship.height / 2 + 15 + Math.random() * 5);
        ctx.lineTo(ship.width / 4, ship.height / 2);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    };
    
    // Spawn a new asteroid with improved randomization
    const spawnAsteroid = () => {
        const canvas = gameCanvasRef.current;
        if (!canvas) return;
        
        const canvasWidth = canvas.width / (window.devicePixelRatio || 1);
        const size = Math.random() * 30 + 20; // Random size between 20-50
        const colorIndex = Math.floor(Math.random() * ASTEROID_COLORS.length);
        const verticesCount = Math.floor(Math.random() * 3) + 6; // 6-8 vertices for variety
        
        // Create vertices variation pattern once
        const verticesVariation = [];
        for (let i = 0; i < verticesCount; i++) {
            verticesVariation.push(0.8 + Math.random() * 0.4);
        }
        
        // Spawn from top of screen at random x position
        asteroidsRef.current.push({
            x: Math.random() * canvasWidth,
            y: -size,
            size: size,
            speed: Math.random() * 2 + 1,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.05,
            color: ASTEROID_COLORS[colorIndex],
            points: Math.round((60 - size) / 5), // Smaller asteroids worth more points
            vertices: verticesCount,
            verticesVariation: verticesVariation
        });
    };
    
    // Update and render asteroids with improved visual effects
    const updateAsteroids = (ctx) => {
        const canvas = gameCanvasRef.current;
        if (!canvas || !ctx) return;
        
        const canvasHeight = canvas.height / (window.devicePixelRatio || 1);
        
        // Update each asteroid
        asteroidsRef.current = asteroidsRef.current.filter(asteroid => {
            // Move asteroid down
            asteroid.y += asteroid.speed;
            asteroid.rotation += asteroid.rotationSpeed;
            
            // Remove if off screen
            if (asteroid.y > canvasHeight + asteroid.size) {
                return false;
            }
            
            // Draw asteroid
            ctx.save();
            ctx.translate(asteroid.x, asteroid.y);
            ctx.rotate(asteroid.rotation);
            
            // Create gradient for 3D effect
            const gradient = ctx.createRadialGradient(
                -asteroid.size * 0.2, -asteroid.size * 0.2, 0,
                0, 0, asteroid.size
            );
            gradient.addColorStop(0, asteroid.color);
            gradient.addColorStop(1, shadeColor(asteroid.color, -30));
            
            // Asteroid body
            ctx.fillStyle = gradient;
            ctx.beginPath();
            
            // Create irregular polygon for asteroid
            for (let i = 0; i < asteroid.vertices; i++) {
                const angle = (Math.PI * 2 * i) / asteroid.vertices;
                const radius = asteroid.size * asteroid.verticesVariation[i];
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.closePath();
            ctx.fill();
            
            // Asteroid crater details
            for (let i = 0; i < asteroid.vertices / 2; i++) {
                const craterX = (Math.random() - 0.5) * asteroid.size;
                const craterY = (Math.random() - 0.5) * asteroid.size;
                const craterSize = asteroid.size * (0.1 + Math.random() * 0.15);
                
                ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.beginPath();
                ctx.arc(craterX, craterY, craterSize, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
            
            return true;
        });
    };
    
    // Helper function to darken or lighten a color
    const shadeColor = (color, percent) => {
        let R = parseInt(color.substring(1, 3), 16);
        let G = parseInt(color.substring(3, 5), 16);
        let B = parseInt(color.substring(5, 7), 16);
    
        R = Math.max(0, Math.min(255, R + percent));
        G = Math.max(0, Math.min(255, G + percent));
        B = Math.max(0, Math.min(255, B + percent));
    
        const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
        const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
        const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));
    
        return "#" + RR + GG + BB;
    };
    
    // Check for collisions between ship and asteroids
    const checkCollisions = () => {
        const ship = shipRef.current;
        if (!ship) return;
        
        asteroidsRef.current = asteroidsRef.current.filter(asteroid => {
            // Simple circular collision detection
            const dx = ship.x - asteroid.x;
            const dy = ship.y - asteroid.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < ship.width / 2 + asteroid.size * 0.7) {
                // Collision detected!
                
                // Reduce shield health
                ship.shield -= 20;
                
                // Visual feedback for hit
                gsap.to(gameCanvasRef.current, {
                    duration: 0.1,
                    opacity: 0.7,
                    yoyo: true,
                    repeat: 1,
                });
                
                // End game if shield depleted
                if (ship.shield <= 0) {
                    endGame();
                }
                
                // Add points for destroying asteroid
                setScore(prev => prev + asteroid.points);
                
                // Create explosion effect
                createExplosion(asteroid.x, asteroid.y, asteroid.color);
                
                // Remove the asteroid
                return false;
            }
            return true;
        });
    };
    
    // Create an explosion effect
    const createExplosion = (x, y, color) => {
        const canvas = gameCanvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Draw explosion particles
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2 + 1;
            const size = Math.random() * 4 + 1;
            
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.backgroundColor = color;
            particle.style.borderRadius = '50%';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.zIndex = '50';
            particle.style.boxShadow = `0 0 10px ${color}`;
            
            gameContainerRef.current.appendChild(particle);
            
            gsap.to(particle, {
                x: Math.cos(angle) * speed * 30,
                y: Math.sin(angle) * speed * 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power1.out',
                onComplete: () => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }
            });
        }
    };
    
    // Fire laser from the ship with improved visuals and hit detection
    const fireLaser = () => {
        const ship = shipRef.current;
        const canvas = gameCanvasRef.current;
        if (!ship || !canvas || !gameContainerRef.current) return;
        
        const canvasRect = canvas.getBoundingClientRect();
        const containerRect = gameContainerRef.current.getBoundingClientRect();
        
        // Calculate laser position in the DOM
        const laserLeft = ship.x + canvasRect.left - containerRect.left - 2;
        const laserTop = ship.y + canvasRect.top - containerRect.top - ship.height / 2 - 10;
        
        const laserBeam = document.createElement('div');
        laserBeam.className = 'laser-beam';
        laserBeam.style.position = 'absolute';
        laserBeam.style.width = '4px';
        laserBeam.style.height = '20px';
        laserBeam.style.backgroundColor = shipColor;
        laserBeam.style.boxShadow = `0 0 8px ${shipColor}`;
        laserBeam.style.borderRadius = '2px';
        laserBeam.style.left = `${laserLeft}px`;
        laserBeam.style.top = `${laserTop}px`;
        laserBeam.style.zIndex = '25';
        
        gameContainerRef.current.appendChild(laserBeam);
        
        // Create a laser object for collision detection
        const laserObj = {
            x: ship.x,
            y: ship.y - ship.height / 2,
            width: 4,
            height: 20
        };
        
        // Sound effect for laser
        if (Math.random() > 0.5) {
            // Only play sound for 50% of lasers (to avoid too many sounds)
            const laserSound = new Audio('/audio/laser.mp3');
            laserSound.volume = 0.2;
            laserSound.play().catch(e => console.log("Couldn't play sound - user may not have interacted yet"));
        }
        
        // Animate laser beam
        gsap.to(laserBeam, {
            top: `${-canvasRect.height}px`,
            duration: 0.8,
            ease: 'none',
            onUpdate: () => {
                if (!gameCanvasRef.current) return;
                
                // Update laser position for collision
                const laserRect = laserBeam.getBoundingClientRect();
                laserObj.y = laserRect.top - canvasRect.top + laserRect.height / 2;
                
                // Check each asteroid for collision with laser
                asteroidsRef.current = asteroidsRef.current.filter(asteroid => {
                    const dx = asteroid.x - laserObj.x;
                    const dy = asteroid.y - laserObj.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < asteroid.size) {
                        // Hit asteroid! Remove laser and asteroid
                        if (laserBeam.parentNode) {
                            laserBeam.parentNode.removeChild(laserBeam);
                        }
                        
                        // Add points
                        setScore(prev => prev + asteroid.points * 2);
                        
                        // Create explosion
                        createExplosion(asteroid.x, asteroid.y, asteroid.color);
                        
                        return false;
                    }
                    return true;
                });
            },
            onComplete: () => {
                if (laserBeam.parentNode) {
                    laserBeam.parentNode.removeChild(laserBeam);
                }
            }
        });
    };
    
    // Start the game
    const startGame = () => {
        if (gameState === GAME_STATE.PLAYING) return;
        
        setGameState(GAME_STATE.PLAYING);
        setScore(0);
        setTimeLeft(60);
        
        // Reset ship
        if (shipRef.current) {
            shipRef.current.shield = 100;
        }
        
        // Clear existing asteroids
        asteroidsRef.current = [];
        
        // Set random ship color
        setShipColor(SHIP_COLORS[Math.floor(Math.random() * SHIP_COLORS.length)]);
    };
    
    // Toggle pause
    const togglePause = () => {
        if (gameState === GAME_STATE.PLAYING) {
            setGameState(GAME_STATE.PAUSED);
            
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            
            if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current);
            }
        } else if (gameState === GAME_STATE.PAUSED) {
            setGameState(GAME_STATE.PLAYING);
        }
    };
    
    // End game
    const endGame = useCallback(() => {
        setGameState(GAME_STATE.GAME_OVER);
        
        // Clean up timers
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        
        if (gameLoopRef.current) {
            cancelAnimationFrame(gameLoopRef.current);
        }
        
        // Update high score
        if (score > highScore) {
            setHighScore(score);
            try {
                localStorage.setItem('metaverseVoyagerScore', score.toString());
            } catch (e) {
                console.error("Error saving high score:", e);
            }
        }
    }, [score, highScore]);
    
    // Complete cleanup when component unmounts
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        };
    }, []);
    
    // Handle back navigation
    const handleBack = () => {
        if (gameState === GAME_STATE.PLAYING && 
            !window.confirm('Game in progress. Are you sure you want to leave?')) {
            return;
        }
        
        // Clean up game
        if (gameState === GAME_STATE.PLAYING || gameState === GAME_STATE.PAUSED) {
            if (timerRef.current) clearInterval(timerRef.current);
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        }
        
        gsap.to(containerRef.current, {
            opacity: 0,
            y: 50,
            duration: 0.4,
            onComplete: () => navigate('/')
        });
    };
    
    // Change ship color (customization)
    const changeShipColor = () => {
        const currentIndex = SHIP_COLORS.indexOf(shipColor);
        const nextIndex = (currentIndex + 1) % SHIP_COLORS.length;
        setShipColor(SHIP_COLORS[nextIndex]);
    };
    
    return (
        <>
            {/* Loader */}
            {isLoading && (
                <div 
                    ref={loaderRef}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
                >
                    <div className="mb-8">
                        <div className="relative h-24 w-24">
                            {[...Array(3)].map((_, i) => (
                                <div 
                                    key={i}
                                    className="absolute inset-0 rounded-full border-2 border-yellow-300"
                                    style={{ 
                                        opacity: 0.2 + (i * 0.2),
                                        transform: `scale(${0.8 + (i * 0.1)})`,
                                        animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite` 
                                    }}
                                />
                            ))}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="font-zentry text-2xl text-yellow-300">Z</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-violet-300/70 to-yellow-300" 
                            style={{ width: `${loadingProgress}%`, transition: 'width 0.2s' }}
                        />
                    </div>
                    <div className="mt-2 font-general text-xs text-white/60">
                        {Math.floor(loadingProgress)}% LOADING
                    </div>
                </div>
            )}
            
            <div 
                ref={containerRef} 
                className="relative min-h-screen w-full overflow-hidden bg-black"
            >
                {/* Background floating elements for visual interest */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(8)].map((_, i) => (
                        <div 
                            key={i}
                            className="floating-element absolute bg-violet-300/20 rounded-full blur-xl"
                            style={{
                                width: `${Math.random() * 300 + 100}px`,
                                height: `${Math.random() * 300 + 100}px`,
                                left: `${Math.random() * 80 + 5}%`,
                                top: `${Math.random() * 80 + 5}%`,
                                opacity: Math.random() * 0.2 + 0.1,
                                animationDuration: `${Math.random() * 5 + 10}s`,
                            }}
                        />
                    ))}
                </div>
                
                {/* Main content */}
                <div className="content-container relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4 py-10">
                    {/* Header */}
                    <div className="mb-8 text-center reveal-item">
                        <h2 className="font-general text-sm uppercase text-yellow-300 md:text-base">
                            We Are Building Something Exciting
                        </h2>
                        
                        <AnimatedTitle 
                            title="C<b>o</b>ming S<b>o</b>on<br/>Stay t<b>u</b>ned"
                            containerClass="mt-5 !text-white text-center"
                        />
                    </div>
                    
                    {/* Message */}
                    <div className="mb-8 max-w-2xl text-center reveal-item">
                        <p className="font-circular-web text-lg text-blue-50 mb-4">
                            Thank you for your curiosity! We're working hard to bring more exciting features to the metaverse.
                        </p>
                        <p className="font-circular-web text-lg text-blue-50/70">
                            While you wait, try our Metaverse Voyager game below. Pilot a ship through asteroid fields!
                        </p>
                    </div>
                    
                    {/* Mini-game */}
                    <div 
                        ref={gameContainerRef}
                        className="reveal-item border-modern mb-10 w-full max-w-xl rounded-2xl p-6 shadow-glow backdrop-blur-sm relative overflow-hidden"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center">
                                <GiShipWheel className="text-yellow-300 mr-2" size={20} />
                                <h3 className="font-zentry text-xl text-yellow-300">METAVERSE VOYAGER</h3>
                            </div>
                            
                            {/* High Score */}
                            <div className="flex items-center gap-2 px-3 py-1 bg-black/30 rounded-lg">
                                <FaTrophy className="text-yellow-300" />
                                <span className="font-robert-medium text-sm text-white/90">{highScore}</span>
                            </div>
                        </div>
                        
                        {/* Instructions that hide during gameplay */}
                        {gameState === GAME_STATE.READY && (
                            <p className="font-robert-regular text-sm text-blue-50 mb-4">
                                Navigate with arrow keys. Space to shoot. Destroy asteroids and avoid collisions!
                            </p>
                        )}
                        
                        {/* Game controls and stats - Only show during active gameplay */}
                        {(gameState === GAME_STATE.PLAYING || gameState === GAME_STATE.PAUSED) && (
                            <div className="flex justify-between items-center mb-3">
                                {/* Score */}
                                <div className="px-4 py-1 bg-black/40 rounded-lg backdrop-blur-sm">
                                    <span className="font-robert-medium text-sm text-white/90">Score:</span>
                                    <span className="ml-1 font-zentry text-lg text-yellow-300">{score}</span>
                                </div>
                                
                                {/* Ship Shield */}
                                <div className="px-4 py-1 bg-black/40 rounded-lg backdrop-blur-sm flex items-center gap-2">
                                    <span className="font-robert-medium text-sm text-white/90">Shield:</span>
                                    <div className="w-20 h-3 bg-white/20 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${shipRef.current?.shield > 50 ? 'bg-cyan-400' : 'bg-red-500'}`}
                                            style={{ width: `${shipRef.current?.shield || 0}%` }}
                                        />
                                    </div>
                                </div>
                                
                                {/* Timer */}
                                <div className={`px-4 py-1 rounded-lg backdrop-blur-sm ${timeLeft <= 10 ? 'bg-red-500/40 animate-pulse' : 'bg-black/40'}`}>
                                    <span className="font-robert-medium text-sm text-white/90">Time:</span>
                                    <span className="ml-1 font-zentry text-lg text-white">{timeLeft}</span>
                                </div>
                                
                                {/* Pause button */}
                                <button
                                    onClick={togglePause}
                                    className={`flex items-center justify-center p-2 rounded-full ${gameState === GAME_STATE.PAUSED ? 'bg-yellow-300 text-black' : 'bg-black/40 text-white'} transition-colors`}
                                    aria-label={gameState === GAME_STATE.PAUSED ? "Resume game" : "Pause game"}
                                >
                                    {gameState === GAME_STATE.PAUSED ? <FaPlay size={14} /> : <FaPause size={14} />}
                                </button>
                            </div>
                        )}
                        
                        {/* Game canvas */}
                        <div className="relative aspect-video w-full bg-black/80 rounded-lg overflow-hidden"
                             style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
                            <canvas
                                ref={gameCanvasRef}
                                className="absolute inset-0 w-full h-full"
                            />
                            
                            {/* Game state overlays */}
                            {gameState === GAME_STATE.READY && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-10">
                                    <h4 className="font-zentry text-2xl text-yellow-300 mb-3">READY TO PLAY?</h4>
                                    <p className="text-blue-50 mb-6 text-center max-w-md text-sm">
                                        Navigate your starship through asteroid fields with <b>arrow keys</b>. <br/>
                                        Press <b>space</b> to fire lasers and destroy asteroids!
                                    </p>
                                    
                                    {/* Ship customization */}
                                    <div className="mb-6 p-4 bg-black/40 rounded-lg">
                                        <h5 className="text-center text-white/80 text-sm mb-2">Choose Your Ship Color</h5>
                                        <div className="flex justify-center gap-3">
                                            {SHIP_COLORS.map((color, index) => (
                                                <button
                                                    key={index}
                                                    className={`w-10 h-10 rounded-full transition-all ${color === shipColor ? 'ring-2 ring-white scale-110' : 'ring-1 ring-white/30'}`}
                                                    style={{ backgroundColor: color }}
                                                    onClick={() => setShipColor(color)}
                                                    aria-label={`Select ${color} ship`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <Button
                                        id="start-game"
                                        title="Launch Ship"
                                        containerClass="!bg-yellow-300/90 hover:!bg-yellow-300 hover:text-black text-black transition-colors duration-300"
                                        onClick={startGame}
                                    />
                                </div>
                            )}
                            
                            {gameState === GAME_STATE.GAME_OVER && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-10">
                                    <h4 className="font-zentry text-xl text-white mb-3">MISSION COMPLETE</h4>
                                    <p className="font-robert-regular text-lg text-yellow-300 mb-6">
                                        Your Score: <span className="font-zentry">{score}</span>
                                    </p>
                                    {score >= highScore && score > 0 && (
                                        <div className="py-2 px-4 bg-yellow-300/20 rounded-lg mb-6 flex items-center">
                                            <FaTrophy className="text-yellow-300 mr-2" />
                                            <p className="font-robert-medium text-white">New High Score!</p>
                                        </div>
                                    )}
                                    <Button
                                        id="play-again"
                                        title="Play Again"
                                        rightIcon={<FaRedo className="ml-1" />}
                                        containerClass="!bg-yellow-300/90 hover:!bg-yellow-300 hover:text-black text-black transition-colors duration-300"
                                        onClick={startGame}
                                    />
                                </div>
                            )}
                            
                            {gameState === GAME_STATE.PAUSED && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-10">
                                    <h4 className="font-zentry text-2xl text-white mb-6">PAUSED</h4>
                                    <div className="flex gap-4">
                                        <Button
                                            id="change-ship-color"
                                            title="Change Ship"
                                            containerClass="!bg-violet-300/90 hover:!bg-violet-300 text-black transition-colors duration-300"
                                            onClick={changeShipColor}
                                        />
                                        <Button
                                            id="resume-game"
                                            title="Resume"
                                            containerClass="!bg-yellow-300/90 hover:!bg-yellow-300 hover:text-black text-black transition-colors duration-300"
                                            onClick={togglePause}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Mobile controls (for touch devices) */}
                        <div className="mt-4 grid grid-cols-3 gap-2 md:hidden">
                            <div className="flex justify-start">
                                <button 
                                    className="bg-black/40 p-3 rounded-lg text-white/90 active:bg-yellow-300/30"
                                    onTouchStart={() => keysRef.current.ArrowLeft = true}
                                    onTouchEnd={() => keysRef.current.ArrowLeft = false}
                                    disabled={gameState !== GAME_STATE.PLAYING}
                                >
                                    ← Left
                                </button>
                            </div>
                            
                            <div className="flex justify-center">
                                <button 
                                    className="bg-black/40 p-3 rounded-lg text-white/90 active:bg-yellow-300/30"
                                    onTouchStart={() => keysRef.current[' '] = true}
                                    onTouchEnd={() => {
                                        keysRef.current[' '] = false;
                                        if (gameState === GAME_STATE.PLAYING) {
                                            fireLaser();
                                        }
                                    }}
                                    disabled={gameState !== GAME_STATE.PLAYING}
                                >
                                    Fire!
                                </button>
                            </div>
                            
                            <div className="flex justify-end">
                                <button 
                                    className="bg-black/40 p-3 rounded-lg text-white/90 active:bg-yellow-300/30"
                                    onTouchStart={() => keysRef.current.ArrowRight = true}
                                    onTouchEnd={() => keysRef.current.ArrowRight = false}
                                    disabled={gameState !== GAME_STATE.PLAYING}
                                >
                                    Right →
                                </button>
                            </div>
                        </div>
                        
                        {/* Game instructions (only show during ready state) */}
                        {gameState === GAME_STATE.READY && (
                            <div className="mt-4 flex justify-center">
                                <p className="font-robert-regular text-xs text-blue-50/60 text-center max-w-lg">
                                    Use arrow keys to navigate your ship through space. Press the spacebar to fire laser beams.
                                    Destroy asteroids to earn points, but be careful - collisions will damage your shield!
                                </p>
                            </div>
                        )}
                    </div>
                    
                    {/* Back button */}
                    <Button
                        id="back-home"
                        title="Back to Home"
                        leftIcon={<TiArrowBack className="transition-transform duration-300 group-hover:-translate-x-1" />}
                        containerClass="reveal-item !bg-yellow-300/90 flex items-center justify-center gap-2 hover:!bg-yellow-300 hover:text-black/90 text-black transition-colors duration-300"
                        onClick={handleBack}
                    />
                </div>
            </div>
            
            {/* Additional animations for the game */}
            <style jsx="true">{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 0.5; }
                }
                
                .laser-beam {
                    transition: transform 0.1s;
                }
            `}</style>
        </>
    );
};

export default ComingSoon;