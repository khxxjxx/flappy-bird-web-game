const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const GRAVITY = 0.4;
const FLAP = -7;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
let bird, pipes, score, gameOver, game, started;

function resetGame() {
    bird = { x: 60, y: 300, vy: 0, r: 20 };
    pipes = [];
    score = 0;
    gameOver = false;
    started = false;
    if (game) cancelAnimationFrame(game);
    draw();
}

function drawBird() {
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.r, 0, Math.PI * 2);
    ctx.fillStyle = '#ffb300';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.stroke();
}

function drawPipes() {
    ctx.fillStyle = '#388e3c';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, PIPE_WIDTH, canvas.height - pipe.bottom);
    });
}

function drawScore() {
    ctx.fillStyle = '#fff';
    ctx.font = '32px Arial';
    ctx.fillText(score, 20, 50);
}

function draw() {
    ctx.fillStyle = '#87ceeb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
    drawScore();
    if (!started) {
        ctx.fillStyle = '#fff';
        ctx.font = '28px Arial';
        ctx.fillText('스페이스바 또는 클릭으로 시작', 30, 300);
    }
    if (gameOver) {
        ctx.fillStyle = '#fff';
        ctx.font = '36px Arial';
        ctx.fillText('Game Over!', 100, 250);
        ctx.font = '24px Arial';
        ctx.fillText('최종 점수: ' + score, 120, 300);
    }
}

function update() {
    if (!started || gameOver) return;
    bird.vy += GRAVITY;
    bird.y += bird.vy;

    // Pipe 이동 및 새 파이프 추가
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= 2;
        // 점수 증가
        if (!pipes[i].scored && pipes[i].x + PIPE_WIDTH < bird.x) {
            score++;
            pipes[i].scored = true;
        }
        // 파이프 삭제
        if (pipes[i].x + PIPE_WIDTH < 0) {
            pipes.splice(i, 1);
        }
    }
    if (pipes.length === 0 || pipes[pipes.length - 1].x < 200) {
        let top = Math.random() * (canvas.height - PIPE_GAP - 100) + 50;
        pipes.push({
            x: canvas.width,
            top: top,
            bottom: top + PIPE_GAP,
            scored: false
        });
    }

    // 충돌 체크
    pipes.forEach(pipe => {
        if (
            bird.x + bird.r > pipe.x && bird.x - bird.r < pipe.x + PIPE_WIDTH &&
            (bird.y - bird.r < pipe.top || bird.y + bird.r > pipe.bottom)
        ) {
            gameOver = true;
        }
    });
    if (bird.y + bird.r > canvas.height || bird.y - bird.r < 0) {
        gameOver = true;
    }

    draw();
    if (!gameOver) {
        game = requestAnimationFrame(update);
    }
}

function flap() {
    if (!started) {
        started = true;
        game = requestAnimationFrame(update);
    }
    if (!gameOver) {
        bird.vy = FLAP;
    }
}

document.addEventListener('keydown', e => {
    if (e.code === 'Space') flap();
});
canvas.addEventListener('mousedown', flap);
document.getElementById('restart').onclick = function() {
    resetGame();
};

resetGame();
