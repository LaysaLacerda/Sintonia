/* ================================= */
/* ELEMENTOS                         */
/* ================================= */

const preGameScreen =
    document.getElementById("pre-game-screen");

const setupScreen =
    document.getElementById("setup-screen");

const guessScreen =
    document.getElementById("guess-screen");

const resultScreen =
    document.getElementById("result-screen");


// Pré-jogo

const leftInput =
    document.getElementById("left-input");

const rightInput =
    document.getElementById("right-input");

const startGameButton =
    document.getElementById("start-game-button");

const previewLeft =
    document.getElementById("preview-left");

const previewRight =
    document.getElementById("preview-right");


// Etapa 1

const drawButton =
    document.getElementById("draw-button");

const targetPointer =
    document.getElementById("target-pointer");

const targetNumber =
    document.getElementById("target-number");

const answerInput =
    document.getElementById("answer-input");

const readyButton =
    document.getElementById("ready-button");


// Etapa 2

const answerDisplay =
    document.getElementById("answer-display");

const guessScale =
    document.getElementById("guess-scale");

const guessPointer =
    document.getElementById("guess-pointer");

const guessNumber =
    document.getElementById("guess-number");

const confirmButton =
    document.getElementById("confirm-button");


// Resultado

const resultTarget =
    document.getElementById("result-target");

const resultGuess =
    document.getElementById("result-guess");

const resultAnswer =
    document.getElementById("result-answer");

const resultMessage =
    document.getElementById("result-message");

const pointsEarned =
    document.getElementById("points-earned");

const distanceElement =
    document.getElementById("distance");

const nextRoundButton =
    document.getElementById("next-round-button");

const newGameButton =
    document.getElementById("new-game-button");


// Placar

const scoreElement =
    document.getElementById("score");


/* ================================= */
/* ESTADO DO JOGO                    */
/* ================================= */

let gameTheme = {
    left: "",
    right: ""
};


let targetPosition = 50;

let guessPosition = 50;

let currentAnswer = "";

let score = 0;

let round = 0;

let isDragging = false;


/* ================================= */
/* PREVIEW DO TEMA                   */
/* ================================= */

leftInput.addEventListener(
    "input",
    updatePreview
);


rightInput.addEventListener(
    "input",
    updatePreview
);


function updatePreview() {

    previewLeft.textContent =
        leftInput.value.trim() ||
        "Extremo esquerdo";


    previewRight.textContent =
        rightInput.value.trim() ||
        "Extremo direito";
}


/* ================================= */
/* COMEÇAR JOGO                      */
/* ================================= */

startGameButton.addEventListener(
    "click",
    startNewGame
);


function startNewGame() {

    const left =
        leftInput.value.trim();

    const right =
        rightInput.value.trim();


    if (!left || !right) {

        alert(
            "Preencha os dois extremos para começar."
        );

        return;
    }


    gameTheme.left = left;

    gameTheme.right = right;


    score = 0;

    round = 1;


    scoreElement.textContent = "0";


    updateThemeLabels();


    prepareRound();


    showScreen(setupScreen);
}


/* ================================= */
/* ATUALIZAR TEMA                    */
/* ================================= */

function updateThemeLabels() {

    // Etapa 1

    document.getElementById(
        "game-left-label"
    ).textContent = gameTheme.left;


    document.getElementById(
        "game-right-label"
    ).textContent = gameTheme.right;


    document.getElementById(
        "target-left-label"
    ).textContent = gameTheme.left;


    document.getElementById(
        "target-right-label"
    ).textContent = gameTheme.right;


    // Etapa 2

    document.getElementById(
        "guess-left-label"
    ).textContent = gameTheme.left;


    document.getElementById(
        "guess-right-label"
    ).textContent = gameTheme.right;


    document.getElementById(
        "guess-scale-left"
    ).textContent = gameTheme.left;


    document.getElementById(
        "guess-scale-right"
    ).textContent = gameTheme.right;


    // Resultado

    document.getElementById(
        "result-left-label"
    ).textContent = gameTheme.left;


    document.getElementById(
        "result-right-label"
    ).textContent = gameTheme.right;


    document.getElementById(
        "result-scale-left"
    ).textContent = gameTheme.left;


    document.getElementById(
        "result-scale-right"
    ).textContent = gameTheme.right;
}


/* ================================= */
/* PREPARAR NOVA RODADA              */
/* ================================= */

function prepareRound() {

    /*
     * Atualiza os números das rodadas.
     */

    document.getElementById(
        "round-number"
    ).textContent =
        `RODADA ${round}`;


    document.getElementById(
        "guess-round-number"
    ).textContent =
        `RODADA ${round}`;


    document.getElementById(
        "result-round-number"
    ).textContent =
        `RODADA ${round}`;


    /*
     * Reseta o estado da rodada.
     */

    targetPosition = 50;

    guessPosition = 50;

    currentAnswer = "";


    /*
     * Ponteiro volta para o centro.
     */

    targetPointer.style.left = "50%";


    /*
     * Número volta a ficar vazio.
     */

    targetNumber.textContent = "—";


    /*
     * Campo de resposta é resetado.
     *
     * IMPORTANTE:
     * Ele continua visível, mas desabilitado.
     */

    answerInput.value = "";

    answerInput.disabled = true;


    /*
     * Botão "Pronto" também fica
     * desabilitado até a roleta girar
     * e uma resposta ser digitada.
     */

    readyButton.disabled = true;


    /*
     * E AQUI ESTÁ A CORREÇÃO DO BUG
     * DA SEGUNDA RODADA:
     *
     * o botão precisa voltar a estar
     * habilitado.
     */

    drawButton.disabled = false;

    drawButton.textContent =
        "Girar roleta";
}


/* ================================= */
/* GIRAR ROLETA                      */
/* ================================= */

drawButton.addEventListener(
    "click",
    drawTarget
);


function drawTarget() {

    /*
     * Evita clicar duas vezes enquanto
     * a animação está acontecendo.
     */

    drawButton.disabled = true;


    /*
     * Sorteia uma posição de 0 a 100.
     */

    targetPosition =
        Math.floor(
            Math.random() * 101
        );


    /*
     * Move o ponteiro.
     *
     * A animação está no CSS.
     */

    targetPointer.style.left =
        `${targetPosition}%`;


    /*
     * Mostra o número sorteado.
     */

    targetNumber.textContent =
        targetPosition;


    /*
     * Libera a resposta.

     */

    answerInput.disabled = false;


    answerInput.focus();


    /*
     * O botão Pronto só será
     * liberado quando houver texto.
     */

    readyButton.disabled = true;
}


/* ================================= */
/* LIBERAR BOTÃO PRONTO              */
/* ================================= */

answerInput.addEventListener(
    "input",
    function () {

        const hasAnswer =
            answerInput.value.trim().length > 0;


        readyButton.disabled =
            !hasAnswer;
    }
);


/* ================================= */
/* PRONTO → ETAPA 2                  */
/* ================================= */

readyButton.addEventListener(
    "click",
    finishAnswer
);


function finishAnswer() {

    const answer =
        answerInput.value.trim();


    if (!answer) {
        return;
    }


    currentAnswer = answer;


    answerDisplay.textContent =
        currentAnswer;


    /*
     * O segundo jogador começa
     * no meio da escala.
     */

    setGuessPosition(50);


    showScreen(guessScreen);
}


/* ================================= */
/* POSIÇÃO DO PALPITE                */
/* ================================= */

function setGuessPosition(position) {

    position = Math.max(
        0,
        Math.min(100, position)
    );


    guessPosition = position;


    guessPointer.style.left =
        `${position}%`;


    guessNumber.textContent =
        Math.round(position);
}


/* ================================= */
/* DRAG DO PALPITE                   */
/* ================================= */

guessPointer.addEventListener(
    "pointerdown",
    startDrag
);


function startDrag(event) {

    event.preventDefault();

    isDragging = true;

    guessPointer.setPointerCapture(
        event.pointerId
    );


    movePointer(event);
}


guessPointer.addEventListener(
    "pointermove",
    moveDrag
);


function moveDrag(event) {

    if (!isDragging) {
        return;
    }


    movePointer(event);
}


guessPointer.addEventListener(
    "pointerup",
    stopDrag
);


guessPointer.addEventListener(
    "pointercancel",
    stopDrag
);


function stopDrag() {

    isDragging = false;
}


/* ================================= */
/* CALCULAR POSIÇÃO DO MOUSE         */
/* ================================= */

function movePointer(event) {

    const rect =
        guessScale.getBoundingClientRect();


    const x =
        event.clientX - rect.left;


    let position =
        (x / rect.width) * 100;


    position = Math.max(
        0,
        Math.min(100, position)
    );


    setGuessPosition(position);
}


/* ================================= */
/* CONFIRMAR PALPITE                 */
/* ================================= */

confirmButton.addEventListener(
    "click",
    confirmGuess
);


function confirmGuess() {

    const distance =
        Math.round(
            Math.abs(
                targetPosition -
                guessPosition
            )
        );


    const points =
        calculatePoints(distance);


    score += points;


    scoreElement.textContent =
        score;


    /*
     * Posiciona os dois ponteiros
     * na tela de resultado.
     */

    resultTarget.style.left =
        `${targetPosition}%`;


    resultGuess.style.left =
        `${guessPosition}%`;


    resultAnswer.textContent =
        currentAnswer;


    pointsEarned.textContent =
        points;


    distanceElement.textContent =
        distance;


    resultMessage.textContent =
        getResultMessage(distance);


    showScreen(resultScreen);
}


/* ================================= */
/* PONTUAÇÃO                         */
/* ================================= */

function calculatePoints(distance) {

    if (distance <= 3) {
        return 3;
    }


    if (distance <= 8) {
        return 2;
    }


    if (distance <= 15) {
        return 1;
    }


    return 0;
}


/* ================================= */
/* MENSAGEM                          */
/* ================================= */

function getResultMessage(distance) {

    if (distance <= 3) {

        return "🎯 Perfeito! Vocês estão em sintonia!";
    }


    if (distance <= 8) {

        return "🔥 Muito perto!";
    }


    if (distance <= 15) {

        return "🙂 Foi quase!";
    }


    if (distance <= 25) {

        return "😅 Passou um pouco longe...";
    }


    return "💀 Vocês estavam longe de estar em sintonia!";
}


/* ================================= */
/* NOVA RODADA                       */
/* ================================= */

nextRoundButton.addEventListener(
    "click",
    startNextRound
);


function startNextRound() {

    /*
     * O tema NÃO é alterado.
     */

    round++;


    /*
     * Reseta somente os dados
     * da rodada.
     */

    prepareRound();


    /*
     * Volta para a Etapa 1.
     */

    showScreen(setupScreen);
}


/* ================================= */
/* NOVO JOGO                         */
/* ================================= */

newGameButton.addEventListener(
    "click",
    startCompletelyNewGame
);


function startCompletelyNewGame() {

    gameTheme.left = "";

    gameTheme.right = "";


    score = 0;

    round = 0;


    scoreElement.textContent = "0";


    leftInput.value = "";

    rightInput.value = "";


    updatePreview();


    showScreen(preGameScreen);


    leftInput.focus();
}


/* ================================= */
/* TROCAR DE TELA                    */
/* ================================= */

function showScreen(screen) {

    preGameScreen.classList.add(
        "hidden"
    );

    setupScreen.classList.add(
        "hidden"
    );

    guessScreen.classList.add(
        "hidden"
    );

    resultScreen.classList.add(
        "hidden"
    );


    screen.classList.remove(
        "hidden"
    );
}