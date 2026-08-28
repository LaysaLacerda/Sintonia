/* ================================= */
/* ELEMENTOS                         */
/* ================================= */

// Telas

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

const confirmButton =
    document.getElementById("confirm-button");


// Resultado

const scoringSvg =
    document.getElementById("scoring-svg");

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
/* POSIÇÃO → ÂNGULO                  */
/* ================================= */

function positionToAngle(position) {

    /*
     * 0   = esquerda = -90°
     * 50  = centro   =   0°
     * 100 = direita  = +90°
     */

    return -90 + (position * 1.8);
}


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

    const ids = {

        "game-left-label":
            gameTheme.left,

        "target-left-label":
            gameTheme.left,

        "guess-left-label":
            gameTheme.left,

        "guess-scale-left":
            gameTheme.left,

        "result-left-label":
            gameTheme.left,

        "result-scale-left":
            gameTheme.left,

        "game-right-label":
            gameTheme.right,

        "target-right-label":
            gameTheme.right,

        "guess-right-label":
            gameTheme.right,

        "guess-scale-right":
            gameTheme.right,

        "result-right-label":
            gameTheme.right,

        "result-scale-right":
            gameTheme.right
    };


    Object.entries(ids).forEach(
        ([id, value]) => {

            const element =
                document.getElementById(id);

            if (element) {
                element.textContent = value;
            }

        }
    );
}


/* ================================= */
/* PREPARAR RODADA                   */
/* ================================= */

function prepareRound() {

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


    targetPosition = 50;

    guessPosition = 50;

    currentAnswer = "";


    /* ============================= */
    /* PONTEIRO ETAPA 1              */
    /* ============================= */

    targetPointer.style.transition =
        "none";

    targetPointer.style.transform =
        "translateX(-50%) rotate(0deg)";


    targetPointer.offsetHeight;


    targetPointer.style.transition =
        "transform 1.1s cubic-bezier(.12,.7,.15,1)";


    /* ============================= */
    /* RESPOSTA                       */
    /* ============================= */

    answerInput.value = "";

    answerInput.disabled = true;

    readyButton.disabled = true;


    /* ============================= */
    /* ROLETA                         */
    /* ============================= */

    drawButton.disabled = false;

    drawButton.textContent =
        "Girar roleta";


    /* ============================= */
    /* PALPITE                        */
    /* ============================= */

    setGuessPosition(50);
}


/* ================================= */
/* GIRAR ROLETA                      */
/* ================================= */

drawButton.addEventListener(
    "click",
    drawTarget
);


function drawTarget() {

    drawButton.disabled = true;


    /*
     * Sorteia somente o valor lógico.
     *
     * Ele nunca aparece para o jogador.
     */

    targetPosition =
        Math.floor(
            Math.random() * 101
        );


    const finalAngle =
        positionToAngle(
            targetPosition
        );


    const spins = 4;


    const animatedAngle =
        (360 * spins) +
        finalAngle;


    targetPointer.style.transform =
        `translateX(-50%) rotate(${animatedAngle}deg)`;


    setTimeout(() => {

        targetPointer.style.transition =
            "none";


        targetPointer.style.transform =
            `translateX(-50%) rotate(${finalAngle}deg)`;


        targetPointer.offsetHeight;


        targetPointer.style.transition =
            "transform 1.1s cubic-bezier(.12,.7,.15,1)";


        answerInput.disabled = false;

        answerInput.focus();

    }, 1150);
}


/* ================================= */
/* RESPOSTA                          */
/* ================================= */

answerInput.addEventListener(
    "input",
    function () {

        readyButton.disabled =
            answerInput.value.trim().length === 0;
    }
);


/* ================================= */
/* PRONTO                            */
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


    setGuessPosition(50);


    showScreen(guessScreen);
}


/* ================================= */
/* DEFINIR POSIÇÃO DO PALPITE        */
/* ================================= */

function setGuessPosition(position) {

    /*
     * LIMITADOR ABSOLUTO.
     *
     * A posição lógica nunca pode
     * sair de 0 até 100.
     */

    position =
        Math.max(
            0,
            Math.min(100, position)
        );


    guessPosition = position;


    const angle =
        positionToAngle(position);


    guessPointer.style.transform =
        `translateX(-50%) rotate(${angle}deg)`;
}


/* ================================= */
/* INICIAR ARRASTE                   */
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


    updatePointerFromMouse(event);
}


/* ================================= */
/* ARRASTAR                          */
/* ================================= */

guessPointer.addEventListener(
    "pointermove",
    moveDrag
);


function moveDrag(event) {

    if (!isDragging) {
        return;
    }


    updatePointerFromMouse(event);
}


/* ================================= */
/* FINALIZAR ARRASTE                 */
/* ================================= */

guessPointer.addEventListener(
    "pointerup",
    stopDrag
);


guessPointer.addEventListener(
    "pointercancel",
    stopDrag
);


function stopDrag(event) {

    isDragging = false;


    try {

        guessPointer.releasePointerCapture(
            event.pointerId
        );

    } catch (error) {

        // Ignora caso a captura já tenha sido liberada.

    }
}


/* ================================= */
/* CALCULAR POSIÇÃO DO MOUSE        */
/* ================================= */

function updatePointerFromMouse(event) {

    const rect =
        guessScale.getBoundingClientRect();


    /*
     * ==========================================
     * CENTRO REAL DA ROLETA
     * ==========================================
     *
     * O arco é um semicírculo cujo centro
     * está exatamente no meio da largura
     * e na parte inferior.
     */

    const centerX =
        rect.left +
        rect.width / 2;


    const centerY =
        rect.bottom;


    /*
     * Distância do mouse até o centro.
     */

    const dx =
        event.clientX -
        centerX;


    const dy =
        centerY -
        event.clientY;


    /*
     * ==========================================
     * ÂNGULO
     * ==========================================
     *
     * atan2 normalmente dá:
     *
     * direita  = 0°
     * cima     = 90°
     * esquerda = 180°
     * baixo    = -90°
     */

    let angle =
        Math.atan2(dy, dx) *
        180 /
        Math.PI;


    /*
     * ==========================================
     * TRAVA NO SEMICÍRCULO SUPERIOR
     * ==========================================
     *
     * O intervalo permitido é:
     *
     * 0° → direita
     * 90° → cima
     * 180° → esquerda
     *
     * Qualquer ângulo abaixo do eixo
     * horizontal é imediatamente jogado
     * para um dos extremos.
     */

    if (angle < 0) {

        /*
         * Mouse abaixo do centro.
         *
         * Escolhemos o extremo mais próximo.
         */

        if (dx >= 0) {
            angle = 0;
        } else {
            angle = 180;
        }
    }


    /*
     * Segurança adicional.
     */

    angle =
        Math.max(
            0,
            Math.min(180, angle)
        );


    /*
     * ==========================================
     * ÂNGULO MATEMÁTICO → POSIÇÃO DO JOGO
     * ==========================================
     *
     * 180° = esquerda = 0
     *  90° = centro   = 50
     *   0° = direita  = 100
     */

    const position =
        ((180 - angle) / 180) * 100;


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


    const targetAngle =
        positionToAngle(
            targetPosition
        );


    const guessAngle =
        positionToAngle(
            guessPosition
        );


    resultTarget.style.transform =
        `translateX(-50%) rotate(${targetAngle}deg)`;


    resultGuess.style.transform =
        `translateX(-50%) rotate(${guessAngle}deg)`;


    resultAnswer.textContent =
        currentAnswer;


    pointsEarned.textContent =
        points;


    resultMessage.textContent =
        getResultMessage(distance);


    createScoringZones(
        targetPosition
    );


    showScreen(resultScreen);
}


/* ================================= */
/* ÁREAS DE PONTUAÇÃO                */
/* ================================= */

function createScoringZones(target) {

    scoringSvg.innerHTML = "";


    createScoreSector(
        target - 15,
        target + 15,
        "score-one"
    );


    createScoreSector(
        target - 8,
        target + 8,
        "score-two"
    );


    createScoreSector(
        target - 3,
        target + 3,
        "score-three"
    );
}


/* ================================= */
/* CRIAR SETOR SVG                   */
/* ================================= */

function createScoreSector(
    startPosition,
    endPosition,
    className
) {

    startPosition =
        Math.max(
            0,
            startPosition
        );


    endPosition =
        Math.min(
            100,
            endPosition
        );


    if (startPosition >= endPosition) {
        return;
    }


    const cx = 300;

    const cy = 300;

    const radius = 250;


    const startAngle =
        180 -
        (startPosition * 1.8);


    const endAngle =
        180 -
        (endPosition * 1.8);


    const start =
        polarToCartesian(
            cx,
            cy,
            radius,
            startAngle
        );


    const end =
        polarToCartesian(
            cx,
            cy,
            radius,
            endAngle
        );


    const largeArcFlag =
        Math.abs(
            endAngle -
            startAngle
        ) <= 180
            ? "0"
            : "1";


    const pathData = [

        `M ${cx} ${cy}`,

        `L ${start.x} ${start.y}`,

        `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,

        "Z"

    ].join(" ");


    const path =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );


    path.setAttribute(
        "d",
        pathData
    );


    path.setAttribute(
        "class",
        className
    );


    scoringSvg.appendChild(path);
}


/* ================================= */
/* POLAR → CARTESIAN                 */
/* ================================= */

function polarToCartesian(
    centerX,
    centerY,
    radius,
    angleInDegrees
) {

    const angleInRadians =
        angleInDegrees *
        Math.PI /
        180;


    return {

        x:
            centerX +
            radius *
            Math.cos(angleInRadians),

        y:
            centerY -
            radius *
            Math.sin(angleInRadians)

    };
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
     * O tema continua o mesmo.
     */

    round++;


    prepareRound();


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