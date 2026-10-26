document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const renderer = new Renderer(canvas);
    const world = new World();
    world.generateWorld();
    const player = new Player(100, 100);
    const inputHandler = new InputHandler();

    let lastTime = 0;
    function gameLoop(timestamp) {
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        // Input handling
        if (inputHandler.isKeyDown('KeyA') || inputHandler.isKeyDown('ArrowLeft')) {
            player.move('left');
        } else if (inputHandler.isKeyDown('KeyD') || inputHandler.isKeyDown('ArrowRight')) {
            player.move('right');
        } else {
            player.move('stop');
        }

        if (inputHandler.isKeyDown('Space')) {
            player.jump();
        }

        // Block interaction with keyboard
        const playerGridX = Math.floor((player.x + player.width / 2) / BLOCK_SIZE);
        const playerGridY = Math.floor((player.y + player.height / 2) / BLOCK_SIZE);

        // 'n' for destroying block in front of player
        if (inputHandler.isKeyDown('KeyN')) {
            // Simple logic: destroy block to the right if facing right, left otherwise
            const direction = player.vx >= 0 ? 1 : -1;
            const targetX = playerGridX + direction;
            world.removeBlock(targetX, playerGridY);
        }

        // 'b' for building block in front of player
        if (inputHandler.isKeyDown('KeyB')) {
            const direction = player.vx >= 0 ? 1 : -1;
            const targetX = playerGridX + direction;
            if (!world.getBlock(targetX, playerGridY)) { // Only build if space is empty
                world.setBlock(targetX, playerGridY, 'dirt');
            }
        }

        // Update state
        player.update(deltaTime, world);

        // Render
        renderer.clear();
        renderer.drawWorld(world);
        renderer.drawPlayer(player);

        requestAnimationFrame(gameLoop);
    }

    // Uruchomienie pętli gry
    gameLoop();
});