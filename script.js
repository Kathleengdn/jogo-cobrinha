//playboard é a tela.
//conteiner onde a cobra e a comida serão renderizadas.
const playBoard  = document.querySelector(".play-board"); 
//pontuação atual do jogador.
const scoreElement = document.querySelector(".score");
//recorde (maior pontuação).
const highScoreElement = document.querySelector(".high-score");
//controles de movimento.
// seleciona elementos <i> icones, botões para devices mobiles.
const controls = document.querySelectorAll(".controls i");

// Cadastro de Variaveis.

//variavel boleana que indica se o jogo terminou .
let gameOver = false;
// variavel para armazenar as coordenadas X e Y da comida.
let foodX, foodY;
//armazena as coordenadas X e Y da cabeça da cobra(posição).
let snakeX = 5, snakeY = 5;
//variavel para armazenar a velocidade nas direções X e Y, inicialmente em 0.
let velocityX = 0, velocityY = 0;
/*uma array para armazenar as coordenadas de cada segmento do corpo, 
 primeiro elemento é a cabeça.*/
let snakeBody =[];
/* variavel para armazenar o ID do intervalo que será usado para 
atualizar o jogo  em um determinado ritimo.*/
let setIntervalId;
// uma variavel para manter o controle da pontuação atual do jogador
let score = 0;

// Obtenha pontuação alta do armazenamento local

// tenta recuperar o valor associado a chave "high-score do armazenamento local do navegador"
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;
/* se o localStorage retornar NULL (caso ele não exista),
 a variavel highscore sera definida como 0*/

// posiçaõ aleatoria ente 1 e 30 para a comida
/* gera coordenadas aleatórias para a nova posição da comida */
const updateFoodPosition = () => {
    // Math.radom() = retorna um numero de ponto flluente pseudoaleatório entre 0 e 1
    /* * 30: Multiplica o número aleatório por 30 para obter um valor entre 0 e quase 30 */
    /* Math.floor(): arredonda o resultado para o inteiro mais proximo(entre 0 e 29*/
    /*  +1 : adiciona 1 para garantir que as coordenadas da comida entejam entre o numero 1 e 30. */
    foodX = Math.floor (Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

// Função para lidar com o fim do jogo
/* Função handleGameOver = quando a cobra colide consigo mesma ou com as paredes do tabuleiro*/

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over !! 😭 Aperte (Ok) para iniciar novamente... ");
    location.reload();
}

// Função para mudar a direção da cobrinha
const changeDirection = e => {
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key})));

//Inicializar o game = initgame

const initGame = () => {
    if (gameOver) return handleGameOver ();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    //quando a cobra come e se alimenta
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([snakeY, snakeX]);
        score++;
        highScore = score >= highScore ? score : highScore;

        localStorage.setItem("high-score", highScore);
        scoreElement.innerHTML = `Score: ${score}`;
        highScoreElement.innerHTML = `High Score: ${highScore}`;
    }

    snakeX += velocityX;
    snakeY += velocityY;

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody [i] = snakeBody [i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    /* add divi para cada parte do corpo da cobra */
    for(let i = 0; i < snakeBody.length; i ++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        /* verifica se a cabeça da cobra atingiu ou colidiu com o corpo */
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        } 
    }
    playBoard.innerHTML = html;
}

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);