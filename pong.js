const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const paddleWidth = 10;
const paddleHeight = 100;

const keys = {
    w: false,
    s: false
};

const paddleSound = new Audio('paddle_sound.wav');
const wallSound = new Audio('wall_sound.wav');
const winSound = new Audio('win_sound.wav');
const loseSound = new Audio('lose_sound.wav');



const user = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: 'white',
    score: 0
};

const computer = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: 'white',
    score: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: 'white'
};

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = '48px sans-serif';
    ctx.fillText(text, x, y);
}

function render() {
    drawRect(0, 0, canvas.width, canvas.height, 'black');
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
    drawText(user.score, canvas.width / 4, canvas.height / 5, 'white');
    drawText(computer.score, 3 * canvas.width / 4, canvas.height / 5, 'white');
}

function collision(ball, paddle) {
    const paddleTop = paddle.y;
    const paddleBottom = paddle.y + paddle.height;
    const ballTop = ball.y - ball.radius;
    const ballBottom = ball.y + ball.radius;

    if (ball.x - ball.radius < paddle.x + paddle.width && ball.x + ball.radius > paddle.x &&
        ballTop < paddleBottom && ballBottom > paddleTop) {
        paddleSound.play();
        return true;
    } else {
        return false;
    }
}

function update() {
    if (keys.w && user.y > 0) {
        user.y -= 5;
    }
    if (keys.s && user.y < canvas.height - user.height) {
        user.y += 5;
    }

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
        wallSound.play();
    }

    let paddle = (ball.x < canvas.width / 2) ? user : computer;
    if (collision(ball, paddle)) {
        let intersectY = ball.y - (paddle.y + paddle.height / 2);
        intersectY /= paddle.height / 2;
        let angle = intersectY * (Math.PI / 4);
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angle);
        ball.velocityY = ball.speed * Math.sin(angle);

        ball.speed += 0.2;
    }

    if (ball.x - ball.radius < 0) {
        computer.score++;
        loseSound.play(); // Add this line to play the lose sound
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        winSound.play(); // Add this line to play the win sound
        resetBall();
    }

    computer.y += (ball.y - (computer.y + computer.height / 2)) * 0.1;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
    ball.velocityY = 5 * (Math.random() * 2 - 1); // This will randomize the angle of the ball when it resets
}


function gameLoop() {
    render();
    update();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'w') {
        keys.w = true;
    } else if (event.key.toLowerCase() === 's') {
        keys.s = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key.toLowerCase() === 'w') {
        keys.w = false;
    } else if (event.key.toLowerCase() === 's') {
        keys.s = false;
    }
});


gameLoop();

