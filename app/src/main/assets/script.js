//Local Storage
function isLocalStorageAvailable() {
    try {
        const testKey = '__test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
}

// Constants
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const pipes = [];
const VBucks = [];
const pipeImage = new Image();
const VBucksImage = new Image();
const dayBackgroundImage = new Image();
const nightBackgroundImage = new Image();
const vBucksSound = new Audio('sounds/vbucksound.mp3');
const jumpSound = new Audio('sounds/jumpsound.mp3');
const lightModeMusic = new Audio('sounds/daymusic.mp3');
const darkModeMusic = new Audio('sounds/nightmusic.mp3');
const buttonPressSound = new Audio('sounds/buttonpress.mp3');

// Game state variables
let pipesDeath = [];
let VBucksDeath = [];
let gameState = 'START';
let score = 0;
let highestScore = 0;
let VBucksCount = 0;
let totalVBucks = 0;
let lifetimeVBucks = 0;
let lastVBuckspawnDistance = 0;
let frames = 0;
let birdDeathX = null;
let birdDeathY = null;
let backgroundX = 0;
let backgroundXDeath = 0;
let isDarkMode = false;
let currentBackgroundImage = dayBackgroundImage;
let isMusicPlaying = true;
let currentPage = 0;

// Game Settings
const PIPE_WIDTH = 85;
const PIPE_GAP = 225;
const PIPE_SPEED = 3;
const PIPE_SPACING = 350;
const MIN_DISTANCE_FROM_PIPE = 200;
const VBucks_RADIUS = 20;
const VBucks_SPAWN_RATE = 0.01;
const BACKGROUND_SPEED = 0;

// sprites and sounds
pipeImage.src = 'sprites/pipesprite.png';
VBucksImage.src = 'sprites/vbuck.png';
dayBackgroundImage.src = 'sprites/flappybackgroundday.png';
nightBackgroundImage.src = 'sprites/flappybackgroundnight.png';
lightModeMusic.loop = true;
darkModeMusic.loop = true;

// Bird settings
const bird = {
    x: 50,
    y: canvas.height / 2,
    radius: 30,
    velocity: 0,
    gravity: 0.5,
    jump: -10,
    maxVelocity: 7
};

// All playable characters
const commonBirdFileNames = [
    'DaBaby.png',
    'OsamaSon.png',
    'Nettspend.png',
    'Glokk40Spaz.png',
    'LAZER DIM 700.png',
    'ian.png',
    'Ice JJ Fish.png',
    'Yuno Miles.png',
    'Izaya Tiji.png',
    'Yhapojj.png',
    'Bhad Bhabie.png',
    'xaviersobased.png'
];
const rareBirdFileNames = [
    'Autumn.png',
    'Summrs.png',
    'Tana.png',
    'Babytron.png',
    'Iayze.png',
    'Duwap Kaine.png',
    'Homixide Gang.png',
    'Yung Bans.png',
    'SSGKobe.png',
]
const epicBirdFileNames = [
    'Rich Amiri.png',
    'Ken Carson.png',
    'Destroy Lonely.png',
    'Trippie Redd.png',
    'LUCKI.png',
    'Cochise.png',
    'KANKAN.png',
    'SoFaygo.png',
    'Lil Tecca.png',
]
const legendaryBirdFileNames = [
    'Yeat.png',
    'Chief Keef.png',
    'Lil Uzi Vert.png',
    'Lil Yachty.png',
    'Future.png',
    'FREE THUGGER.png',
]
const mythicBirdFileNames = [
    'Playboi Carti.png',
    'Travis Scott.png',
    'Kanye.png'
]

// All Bird Sprites
const birdSprites = {
    common: commonBirdFileNames.map(fileName => {
        const lowerCaseFileName = fileName.toLowerCase();
        const img = new Image();
        img.src = `sprites/commons/${lowerCaseFileName}`;
        img.onerror = () => console.error(`Failed to load image: ${lowerCaseFileName}`);
        const sound = new Audio(`sounds/commons/${lowerCaseFileName.replace('.png', '.mp3')}`);
        sound.onerror = () => console.error(`Failed to load sound: ${lowerCaseFileName.replace('.png', '.mp3')}`);
        sound.load();
        return { sprite: img, sound: sound };
    }),

    rare: rareBirdFileNames.map(fileName => {
        const lowerCaseFileName = fileName.toLowerCase();
        const img = new Image();
        img.src = `sprites/rares/${lowerCaseFileName}`;
        img.onerror = () => console.error(`Failed to load image: ${lowerCaseFileName}`);
        const sound = new Audio(`sounds/rares/${lowerCaseFileName.replace('.png', '.mp3')}`);
        sound.onerror = () => console.error(`Failed to load sound: ${lowerCaseFileName.replace('.png', '.mp3')}`);
        sound.load();
        return { sprite: img, sound: sound };
    }),

    epic: epicBirdFileNames.map(fileName => {
        const lowerCaseFileName = fileName.toLowerCase();
        const img = new Image();
        img.src = `sprites/epics/${lowerCaseFileName}`;
        img.onerror = () => console.error(`Failed to load image: ${lowerCaseFileName}`);
        const sound = new Audio(`sounds/epics/${lowerCaseFileName.replace('.png', '.mp3')}`);
        sound.onerror = () => console.error(`Failed to load sound: ${lowerCaseFileName.replace('.png', '.mp3')}`);
        sound.load();
        return { sprite: img, sound: sound };
    }),

    legendary: legendaryBirdFileNames.map(fileName => {
        const lowerCaseFileName = fileName.toLowerCase();
        const img = new Image();
        img.src = `sprites/legendaries/${lowerCaseFileName}`;
        img.onerror = () => console.error(`Failed to load image: ${lowerCaseFileName}`);
        const sound = new Audio(`sounds/legendaries/${lowerCaseFileName.replace('.png', '.mp3')}`);
        sound.onerror = () => console.error(`Failed to load sound: ${lowerCaseFileName.replace('.png', '.mp3')}`);
        sound.load();
        return { sprite: img, sound: sound };
    }),

    mythic: mythicBirdFileNames.map(fileName => {
        const lowerCaseFileName = fileName.toLowerCase();
        const img = new Image();
        img.src = `sprites/mythics/${lowerCaseFileName}`;
        img.onerror = () => console.error(`Failed to load image: ${lowerCaseFileName}`);
        const sound = new Audio(`sounds/mythics/${lowerCaseFileName.replace('.png', '.mp3')}`);
        sound.onerror = () => console.error(`Failed to load sound: ${lowerCaseFileName.replace('.png', '.mp3')}`);
        sound.load();
        return { sprite: img, sound: sound };
    }),
};
let activeBirdSprite = birdSprites.common[0].sprite;
let activeBirdSound = birdSprites.common[0].sound;

// Set up shop
const shopPages = [
    {
        label: 'Common',
        items: birdSprites.common.map((item, i) => ({
            name: commonBirdFileNames[i].replace('.png', ''),
            price: 1,
            owned: i === 0,
            sprite: item.sprite,
            sound: item.sound
        }))
    },
    {
        label: 'Rare',
        items: birdSprites.rare.map((item, i) => ({
            name: rareBirdFileNames[i].replace('.png', ''),
            price: 2,
            owned: false,
            sprite: item.sprite,
            sound: item.sound
        }))
    },
    {
        label: 'Epic',
        items: birdSprites.epic.map((item, i) => ({
            name: epicBirdFileNames[i].replace('.png', ''),
            price: 3,
            owned: false,
            sprite: item.sprite,
            sound: item.sound
        }))
    },
    {
        label: 'Legendary',
        items: birdSprites.legendary.map((item, i) => ({
            name: legendaryBirdFileNames[i].replace('.png', ''),
            price: 5,
            owned: false,
            sprite: item.sprite,
            sound: item.sound
        }))
    },
    {
        label: 'Mythic',
        items: birdSprites.mythic.map((item, i) => ({
            name: mythicBirdFileNames[i].replace('.png', ''),
            price: 10,
            owned: false,
            sprite: item.sprite,
            sound: item.sound
        }))
    }
];

loadGameData();

// Draw elements
function drawBackground() {
    ctx.drawImage(currentBackgroundImage, backgroundX, 0, canvas.width, canvas.height);
    ctx.drawImage(currentBackgroundImage, backgroundX + canvas.width, 0, canvas.width, canvas.height);
    backgroundX -= BACKGROUND_SPEED;
    if (backgroundX <= -canvas.width) {
        backgroundX = 0;
    }
}

function drawPipes() {
    for (let i = pipes.length - 1; i >= 0; i--) {
        const pipe = pipes[i];

        // Draw top pipe (upside down)
        ctx.save();
        ctx.translate(pipe.x + pipe.width / 2, pipe.topHeight / 2);
        ctx.rotate(Math.PI);
        ctx.drawImage(pipeImage, -pipe.width / 2, -pipe.topHeight / 2, pipe.width, pipe.topHeight);
        ctx.restore();

        // Draw bottom pipe (unchanged)
        ctx.drawImage(pipeImage, pipe.x, pipe.bottomY, pipe.width, pipe.bottomHeight);

        pipe.x -= PIPE_SPEED;

        if (pipe.x + pipe.width < 0) {
            pipes.splice(i, 1);
        } else if (!pipe.passed && pipe.x + pipe.width - 20 < bird.x) {
            score++;
            pipe.passed = true;
            activeBirdSound.currentTime = 0;
            activeBirdSound.play();
        }
    }
}

function drawVBucks() {
    for (let i = VBucks.length - 1; i >= 0; i--) {
        const vBuck = VBucks[i];
        if (!vBuck.collected) {
            ctx.drawImage(VBucksImage, vBuck.x - vBuck.radius, vBuck.y - vBuck.radius, vBuck.radius * 2, vBuck.radius * 2);
            vBuck.x -= PIPE_SPEED;

            // Check for VBucks collection
            if (Math.hypot(bird.x - vBuck.x, bird.y - vBuck.y) < bird.radius + vBuck.radius) {
                vBuck.collected = true;
                VBucksCount++;
                lifetimeVBucks++;
                vBucksSound.play();
            }
        }

        if (vBuck.x + vBuck.radius < 0 || vBuck.collected) {
            VBucks.splice(i, 1);
        }
    }
}

function drawGameOverScreen() {
    // Draw background on game over
    ctx.drawImage(currentBackgroundImage, backgroundXDeath, 0, canvas.width, canvas.height);
    ctx.drawImage(currentBackgroundImage, backgroundXDeath + canvas.width, 0, canvas.width, canvas.height);

    // Draw pipes on game over
    pipesDeath.forEach(pipe => {
        ctx.save();
        ctx.translate(pipe.x + pipe.width / 2, pipe.topHeight / 2);
        ctx.rotate(Math.PI);
        ctx.drawImage(pipeImage, -pipe.width / 2, -pipe.topHeight / 2, pipe.width, pipe.topHeight);
        ctx.restore();
        ctx.drawImage(pipeImage, pipe.x, pipe.bottomY, pipe.width, pipe.bottomHeight);
    });

    // Draw vbucks on game over
    VBucksDeath.forEach(vBuck => {
        if (!vBuck.collected) {
            ctx.drawImage(VBucksImage, vBuck.x - vBuck.radius, vBuck.y - vBuck.radius, vBuck.radius * 2, vBuck.radius * 2);
        }
    });

    // Draw Bird on game over
    if (activeBirdSprite.complete) {
        ctx.drawImage(activeBirdSprite, birdDeathX - bird.radius, birdDeathY - bird.radius, bird.radius * 2, bird.radius * 2);
    }

    ctx.fillStyle = isDarkMode ? 'white' : 'black';
    ctx.font = '48px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2 - 50);
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width / 2 - 40, canvas.height / 2 + 20);
    ctx.fillText(`VBucks: ${VBucksCount}`, canvas.width / 2 - 40, canvas.height / 2 + 50);
    ctx.fillText('Click to Restart', canvas.width / 2 - 70, canvas.height / 2 + 80);
}

function drawShop() {
    drawBackground();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '36px Arial';
    ctx.fillText('Shop', canvas.width / 2 - 50, 50);
    ctx.fillText(`VBucks: ${totalVBucks}`, canvas.width / 2 - 70, 100);
    const page = shopPages[currentPage];
    const labelColors = ['darkgrey', 'lightblue', '#A77BCA', 'gold', 'red'];
    ctx.fillStyle = labelColors[currentPage];
    ctx.fillText(page.label, canvas.width / 2 - 70, 150);
    const boxSize = 80;
    const padding = 40;
    const startX = 70;
    const startY = 200;

    page.items.forEach((item, index) => {
        const col = index % 3;
        const row = Math.floor(index / 3);
        const x = startX + col * (boxSize + padding);
        const y = startY + row * (boxSize + padding);
        ctx.fillStyle = item.owned ? 'gray' : (totalVBucks >= item.price ? 'green' : 'red');
        ctx.fillRect(x, y, boxSize, boxSize);
        ctx.drawImage(item.sprite, x, y, boxSize, boxSize);
        ctx.font = '24px Arial'
        ctx.fillStyle = 'black';
        ctx.fillRect(canvas.width / 2 - 40, canvas.height - 60, 80, 25);
        ctx.fillStyle = 'white';
        ctx.fillText('Back', canvas.width / 2 - 25, canvas.height - 40);
        ctx.font = '12px Arial';
        ctx.fillText(item.name, x + 5, y + boxSize + 15);

        // Only show the price if the item is not owned
        if (!item.owned) {
            ctx.fillText(`${item.price} VBucks`, x + 5, y + boxSize + 30);
        }
        //highlight equipped
        if (item.sprite === activeBirdSprite) {
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 5;
            ctx.strokeRect(x - 2.5, y - 2.5, boxSize + 5, boxSize + 5);
        }
    });

    // navigation buttons
    if (currentPage > 0) { // Show prev button only if not on the first page
        ctx.fillStyle = 'yellow';
        ctx.fillRect(50, canvas.height - 60, 60, 25);
        ctx.fillStyle = 'black';
        ctx.fillText('Previous', 55, canvas.height - 45);
    }

    if (currentPage < shopPages.length - 1) { // Show next button only if not on the last page
        ctx.fillStyle = 'yellow';
        ctx.fillRect(canvas.width - 110, canvas.height - 60, 60, 25);
        ctx.fillStyle = 'black';
        ctx.fillText('Next', canvas.width - 95, canvas.height - 45);
    }
}

function drawRecordsScreen() {
    drawBackground();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '36px Arial';
    ctx.fillText('Records', canvas.width / 2 - 70, 50);

    ctx.font = '24px Arial';
    ctx.fillText(`Highest Score: ${highestScore}`, canvas.width / 2 - 100, canvas.height / 2 - 240);
    ctx.fillText(`VBucks Collected: ${lifetimeVBucks}`, canvas.width / 2 - 100, canvas.height / 2 - 200);

    ctx.font = '24px Arial'
    ctx.fillStyle = 'black';
    ctx.fillRect(canvas.width / 2 - 40, canvas.height - 60, 80, 25);
    ctx.fillStyle = 'white';
    ctx.fillText('Back', canvas.width / 2 - 25, canvas.height - 40);
}

// dark mode slider
const modeSlider = document.getElementById('modeSlider');
const lightLabel = document.querySelector('.label.light');
const darkLabel = document.querySelector('.label.dark');
modeSlider.addEventListener('change', () => {
    if (modeSlider.checked) {
        currentBackgroundImage = nightBackgroundImage;
        isDarkMode = true; // Set to dark mode
        lightLabel.style.color = 'white'; // Change light label color
        darkLabel.style.color = 'white'; // Change dark label color
        lightModeMusic.pause(); // Stop light mode music
        lightModeMusic.currentTime = 0; // Reset light mode music
        darkModeMusic.play(); // Play dark mode music
    } else {
        currentBackgroundImage = dayBackgroundImage;
        isDarkMode = false; // Set to day mode
        lightLabel.style.color = 'black'; // Change light label color
        darkLabel.style.color = 'black'; // Change dark label color
        darkModeMusic.pause(); // Stop dark mode music
        darkModeMusic.currentTime = 0; // Reset dark mode music
        lightModeMusic.play(); // Play light mode music
    }
    drawStartScreen(); // Redraw the start screen with the new background and text color
});

// all click events
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    switch (gameState) {
        case 'START':
            if (x >= canvas.width - 210 && x <= canvas.width - 45 && y >= 50 && y <= 90) {
                buttonPressSound.play();
                if (isMusicPlaying) {
                    lightModeMusic.pause();
                    darkModeMusic.pause();
                    lightModeMusic.currentTime = 0;
                    darkModeMusic.currentTime = 0;
                } else {
                    if (isDarkMode) {
                        darkModeMusic.play();
                    } else {
                        lightModeMusic.play();
                    }
                }
                isMusicPlaying = !isMusicPlaying; // Toggle music playback state
            }
            else if (x >= canvas.width / 2 - 50 && x <= canvas.width / 2 + 50 && y >= canvas.height / 2 + 120 && y <= canvas.height / 2 + 160) {
                gameState = 'SHOP';
                buttonPressSound.play();
            } else if (x >= canvas.width / 2 - 50 && x <= canvas.width / 2 + 50 && y >= canvas.height / 2 + 180 && y <= canvas.height / 2 + 220) {
                gameState = 'RECORDS'; // Switch to records screen
                buttonPressSound.play();
            } else {
                gameState = 'PLAYING';
                buttonPressSound.play();
                generatePipe();
            }
            break;
        case 'RECORDS':
            if (x >= canvas.width / 2 - 40 && x <= canvas.width / 2 + 40 && y >= canvas.height - 60 && y <= canvas.height - 35) {
                buttonPressSound.play();
                gameState = 'START'; // Go back to start screen
            }
            break;
        case 'PLAYING': 
            bird.velocity = bird.jump;
            jumpSound.currentTime = 0;
            jumpSound.play();
            break;
        case 'GAME_OVER':
            buttonPressSound.play();
            bird.y = canvas.height / 2;
            bird.velocity = 0;
            pipes.length = 0;
            VBucks.length = 0;
            score = 0;
            totalVBucks += VBucksCount;
            VBucksCount = 0;
            frames = 0;
            lastVBuckspawnDistance = 0;
            birdDeathX = null;
            birdDeathY = null;
            pipesDeath.length = 0;
            activeBirdSound.pause();
            activeBirdSound.currentTime = 0; // Reset sound
            gameState = 'START';
            break;
            case 'SHOP':
            if (x >= canvas.width / 2 - 50 && x <= canvas.width / 2 + 50 &&
                y >= canvas.height - 70 && y <= canvas.height - 30) {
                buttonPressSound.play();
                gameState = 'START';
            }
            else if (x >= 50 && x <= 150 && y >= canvas.height - 60 - 25 && y <= canvas.height - 60 + 25) {
                if (currentPage > 0) { // Only change page if not on the first page
                    buttonPressSound.play();
                    currentPage--;
                }
            }
            else if (x >= canvas.width - 150 && x <= canvas.width - 50 && y >= canvas.height - 60 - 25 && y <= canvas.height - 60 + 25) {
                if (currentPage < shopPages.length - 1) { // Only change page if not on the last page
                    buttonPressSound.play();
                    currentPage++;
                }
            } else {
                buttonPressSound.play();
                const page = shopPages[currentPage];
            page.items.forEach((item, index) => {
                const col = index % 3;
                const row = Math.floor(index / 3);
                const startX = 70 + col * (120);
                const startY = 200 + row * (120);

                if (x >= startX && x <= startX + 80 && y >= startY && y <= startY + 80) {
                    buttonPressSound.play();
                    if (!item.owned && totalVBucks >= item.price) {
                        totalVBucks -= item.price;
                        item.owned = true;
                        saveGameData();
                    }
                    if (item.owned) {
                        activeBirdSprite = item.sprite;
                        activeBirdSound = item.sound;
                        saveGameData();
                    }
                }
            });
            break;
        }
    }
});

//generate elements
function generatePipe() {
    const minHeight = 50;
    const maxHeight = canvas.height - PIPE_GAP - minHeight;
    const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
    const bottomHeight = canvas.height - topHeight - PIPE_GAP;

    pipes.push({
        x: canvas.width,
        topHeight: topHeight,
        bottomY: topHeight + PIPE_GAP,
        bottomHeight: bottomHeight,
        width: PIPE_WIDTH,
        passed: false
    });
}

function generateVBucks() {
    const VBucksize = VBucks_RADIUS * 2;
    const VBucksY = Math.random() * (canvas.height - VBucksize) + VBucksize / 2;

    // ensure vbucks don't spawn too close to the pipes or in unreachable areas
    for (let pipe of pipes) {
        const pipeRightEdge = pipe.x + PIPE_WIDTH;
        const pipeLeftEdge = pipe.x;
        
        if (canvas.width < pipeRightEdge + MIN_DISTANCE_FROM_PIPE && canvas.width > pipeLeftEdge - MIN_DISTANCE_FROM_PIPE) {
            if (VBucksY < pipe.topHeight || VBucksY > pipe.bottomY) {
                return;
            }
        }
    }

    // ensure vbucks don't spawn too close to each other
    if (VBucks.length > 0) {
        const lastVBucks = VBucks[VBucks.length - 1];
        const distanceFromLastVBucks = canvas.width - lastVBucks.x;
        if (distanceFromLastVBucks < MIN_DISTANCE_FROM_PIPE) {
            return;
        }
    }

    // If all checks pass, spawn the VBucks
    VBucks.push({ x: canvas.width, y: VBucksY, radius: VBucks_RADIUS, collected: false });
    lastVBuckspawnDistance = 0;
}

// check for bird deaths (too low, hit pipe)
function checkCollisions() {
    if (bird.y + bird.radius > canvas.height) {
        handleGameOver();
        return;
    }

    for (let pipe of pipes) {
        if (
            bird.x + bird.radius > pipe.x &&
            bird.x - bird.radius < pipe.x + pipe.width &&
            (bird.y - bird.radius < pipe.topHeight || bird.y + bird.radius > pipe.bottomY)
        ) {
            handleGameOver();
            return;
        }
    }
}

// Track death screen and update high score
function handleGameOver() {
    // Update the highest score if the current score is higher
    if (score > highestScore) {
        highestScore = score;
    }

    birdDeathX = bird.x;
    birdDeathY = bird.y;
    pipesDeath = [...pipes];
    VBucksDeath = [...VBucks];
    backgroundXDeath = backgroundX;
    gameState = 'GAME_OVER';

    saveGameData();
}

// Dynamic text on start screen
let jumpScale = 1;
let jumpDirection = 1;
let jumpSpeed = 0.005;
function drawStartScreen() {
    drawBackground();

    ctx.fillStyle = isDarkMode ? 'white' : 'black';
    ctx.font = '42px Arial';
    const flappyText = 'Flappy Rappers:';
    const flappyTextWidth = ctx.measureText(flappyText).width;
    ctx.fillText(flappyText, (canvas.width - flappyTextWidth) / 2, canvas.height / 2 - 200);
    const undergroundText = 'Underground Edition';
    const undergroundTextWidth = ctx.measureText(undergroundText).width;
    ctx.fillText(undergroundText, (canvas.width - undergroundTextWidth) / 2, canvas.height / 2 - 150);
    ctx.drawImage(activeBirdSprite, canvas.width / 2 - bird.radius, canvas.height / 2 - bird.radius - 10, bird.radius * 2, bird.radius * 2);

    // jumpy text
    ctx.font = '24px Arial';
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2 + 70);
    ctx.scale(jumpScale, jumpScale);
    ctx.fillText('Click to Start', -70, 0);
    ctx.restore();

    // shop button
    ctx.fillStyle = isDarkMode ? 'white' : 'black';
    ctx.fillRect(canvas.width / 2 - 50, canvas.height / 2 + 120, 100, 40);
    ctx.fillStyle = isDarkMode ? 'black' : 'white';
    ctx.fillText('Shop', canvas.width / 2 - 30, canvas.height / 2 + 145);

    // records button
    ctx.fillStyle = isDarkMode ? 'white' : 'black';
    ctx.fillRect(canvas.width / 2 - 50, canvas.height / 2 + 180, 100, 40);
    ctx.fillStyle = isDarkMode ? 'black' : 'white';
    ctx.fillText('Records', canvas.width / 2 - 45, canvas.height / 2 + 205);

    // soundtrack toggle
    ctx.font = '12px Arial';
    ctx.fillStyle = isDarkMode ? 'white' : 'black';
    ctx.fillRect(canvas.width - 210, 50, 165, 40);
    ctx.fillStyle = isDarkMode ? 'black' : 'white';
    ctx.fillText('Toggle FR:UE Soundtrack', canvas.width - 200, 75);
}

// update dynamic text movements
function updateJump() {
    jumpScale += jumpSpeed * jumpDirection;

    if (jumpScale > 1.2 || jumpScale < 0.8) {
        jumpDirection *= -1; // Reverse direction
    }
}

// update game screen repeatedly for each frame
function updateGame() {
    drawBackground();
    bird.velocity += bird.gravity;
    bird.velocity = Math.min(bird.velocity, bird.maxVelocity);
    bird.y += bird.velocity;
    ctx.drawImage(activeBirdSprite, bird.x - bird.radius, bird.y - bird.radius, bird.radius * 2, bird.radius * 2);

    if (pipes.length === 0 || canvas.width - (pipes[pipes.length - 1].x + PIPE_WIDTH) >= PIPE_SPACING) {
        generatePipe();
    }

    lastVBuckspawnDistance += PIPE_SPEED;
    if (lastVBuckspawnDistance >= PIPE_SPACING && Math.random() < VBucks_SPAWN_RATE) {
        generateVBucks();
    }
    drawPipes();
    drawVBucks();
    checkCollisions();
    ctx.fillStyle = isDarkMode ? 'white' : 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 15, 30);
    ctx.fillText(`VBucks: ${VBucksCount}`, canvas.width - 130, 30);
    frames++;
}

//save and load game data
function saveGameData() {
    if (isLocalStorageAvailable()) {
        console.log('LocalStorage is available.');
        localStorage.setItem('highestScore', highestScore);
        localStorage.setItem('totalVBucks', totalVBucks);
        localStorage.setItem('lifetimeVBucks', lifetimeVBucks);
        localStorage.setItem('ownedCharacters', JSON.stringify(shopPages.map(page => page.items.map(item => item.owned))));
        localStorage.setItem('lastUsedCharacter', JSON.stringify({
                    page: currentPage,
                    index: shopPages[currentPage].items.findIndex(item => item.sprite === activeBirdSprite)
                }));
    } else {
        console.log('LocalStorage is not available. Game data will not be saved.');
    }
}

function loadGameData() {
    if (isLocalStorageAvailable()) {
        console.log('LocalStorage is available.');
        highestScore = parseInt(localStorage.getItem('highestScore')) || 0;
        totalVBucks = parseInt(localStorage.getItem('totalVBucks')) || 0;
        lifetimeVBucks = parseInt(localStorage.getItem('lifetimeVBucks')) || 0;

        const ownedCharacters = JSON.parse(localStorage.getItem('ownedCharacters')) || [];
        shopPages.forEach((page, pageIndex) => {
            page.items.forEach((item, itemIndex) => {
                item.owned = ownedCharacters[pageIndex] ? ownedCharacters[pageIndex][itemIndex] : (itemIndex === 0 && pageIndex === 0);
            });
        });
        const lastUsedCharacter = JSON.parse(localStorage.getItem('lastUsedCharacter'));
                if (lastUsedCharacter) {
                    const { page, index } = lastUsedCharacter;
                    if (shopPages[page] && shopPages[page].items[index]) {
                        activeBirdSprite = shopPages[page].items[index].sprite;
                        activeBirdSound = shopPages[page].items[index].sound;
                        currentPage = page;
                    }
                }
    } else {
        console.log('LocalStorage is not available. Default game data will be used.');
    }
}

function loadGameData() {
    if (isLocalStorageAvailable()) {
        highestScore = parseInt(localStorage.getItem('highestScore')) || 0;
        totalVBucks = parseInt(localStorage.getItem('totalVBucks')) || 0;
        lifetimeVBucks = parseInt(localStorage.getItem('lifetimeVBucks')) || 0;

        const ownedCharacters = JSON.parse(localStorage.getItem('ownedCharacters')) || [];
        shopPages.forEach((page, pageIndex) => {
            page.items.forEach((item, itemIndex) => {
                item.owned = ownedCharacters[pageIndex] ? ownedCharacters[pageIndex][itemIndex] : (itemIndex === 0 && pageIndex === 0); // Default first common character as owned
            });
        });

        // Load the last used character
        const lastUsedCharacter = JSON.parse(localStorage.getItem('lastUsedCharacter'));
        if (lastUsedCharacter) {
            const { page, index } = lastUsedCharacter;
            if (shopPages[page] && shopPages[page].items[index]) {
                activeBirdSprite = shopPages[page].items[index].sprite;
                activeBirdSound = shopPages[page].items[index].sound;
                currentPage = page;
            }
        }
    } else {
        console.warn('LocalStorage is not available. Default game data will be used.');
    }
}

// track each game state
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (gameState) {
        case 'START':
            drawStartScreen();
            updateJump();
            modeSwitch.style.display = 'block';
            lightLabel.style.display = 'block';
            darkLabel.style.display = 'block';
            break;
        case 'PLAYING':
            modeSwitch.style.display = 'none';
            lightLabel.style.display = 'none';
            darkLabel.style.display = 'none';
            updateGame();
            break;
        case 'GAME_OVER':
            modeSwitch.style.display = 'none';
            lightLabel.style.display = 'none';
            darkLabel.style.display = 'none';
            drawGameOverScreen();
            break;
        case 'SHOP':
            modeSwitch.style.display = 'none';
            lightLabel.style.display = 'none';
            darkLabel.style.display = 'none';
            drawShop();
            break;
        case 'RECORDS':
            modeSwitch.style.display = 'none';
            lightLabel.style.display = 'none';
            darkLabel.style.display = 'none';
            drawRecordsScreen();
            break;
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();