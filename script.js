const mainElement = document.getElementById("main")
const snakeHead = document.querySelector("#snake-head")
const snakeLeftEye = document.querySelector("#snake-left-eye")
const snakeLeftPupil = document.querySelector("#snake-left-eye-pupil")
const snakeRightEye = document.querySelector("#snake-right-eye")
const snakeRightPupil = document.querySelector("#snake-right-eye-pupil")
const snakeBody = document.querySelector(".snake-body:not(:first-child)")
const gameStartContainer = document.querySelector("#game-start-container")
const gameOverContainer = document.querySelector("#game-over-container")
const gamePausedContainer = document.querySelector("#game-paused-container")
const arrowKeys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"]
const score = document.querySelectorAll("#scoreboard p")[0]
const highScore = document.querySelectorAll("#scoreboard p")[1]

const oppositeDirection = {
    up: "down",
    down: "up",
    left: "right",
    right: "left",
}

let addedBodyPart = null
let currentDirection = localStorage.getItem("direction") || "left"
let moveBodyID = null
let addBodyID = null
let intervalDelay = 1000
let gameOver = true
let gameStarted = false
let gamePaused = false
let newHighScore = false
let currentTailBodyPart = snakeBody
let currentTailDirection = "left"
let snakeAnimation = false || JSON.parse(localStorage.getItem("snakeAnimation"))

function moveHead(direction) {
    if (snakeHead.classList.contains(`snake-head-${direction}`)) return

    snakeHead.classList.value.split(" ").forEach((snakeClass) => {
        if (snakeClass.includes("snake-head")) {
            const oldDirection = snakeClass.split("snake-head-")[1]

            snakeHead.classList.remove(snakeClass)
            snakeHead.classList.add(`snake-head-${direction}`)
            snakeLeftEye.classList.remove(`snake-left-eye-${oldDirection}`)
            snakeLeftEye.classList.add(`snake-left-eye-${direction}`)
            snakeLeftPupil.classList.remove(`snake-left-eye-pupil-${oldDirection}`)
            snakeLeftPupil.classList.add(`snake-left-eye-pupil-${direction}`)
            snakeRightEye.classList.remove(`snake-right-eye-${oldDirection}`)
            snakeRightEye.classList.add(`snake-right-eye-${direction}`)
            snakeRightPupil.classList.remove(`snake-right-eye-pupil-${oldDirection}`)
            snakeRightPupil.classList.add(`snake-right-eye-pupil-${direction}`)
        }
    })
}

const moveInDirection = {
    up: (cornerDirection) => {
        if (snakeHead.style.top === "") {
            snakeHead.style.top = "280px"
        }

        if (snakeAnimation) {
            if (cornerDirection === "left") {
                snakeHead.style.top = Number(snakeHead.style.top.split("px")[0]) - 20 + "px"
                snakeHead.style.left = Number(snakeHead.style.left.split("px")[0]) - 20 + "px"
                moveHead("left")
            } else if (cornerDirection === "right") {
                snakeHead.style.top = Number(snakeHead.style.top.split("px")[0]) - 20 + "px"
                snakeHead.style.left = Number(snakeHead.style.left.split("px")[0]) + 20 + "px"
                moveHead("right")
            } else {
                snakeHead.style.top = Number(snakeHead.style.top.split("px")[0]) - 40 + "px"
                moveHead("up")
            }
        } else {
            snakeHead.style.top = Number(snakeHead.style.top.split("px")[0]) - 40 + "px"
            moveHead("up")
        }
    },
    down: (cornerDirection) => {
        if (snakeHead.style.top === "") {
            snakeHead.style.top = "280px"
        }

        if (snakeAnimation) {
            if (cornerDirection === "left") {
                snakeHead.style.top = Number(snakeHead.style.top.split("px")[0]) + 20 + "px"
                snakeHead.style.left = Number(snakeHead.style.left.split("px")[0]) - 20 + "px"
                moveHead("left")
            } else if (cornerDirection === "right") {
                snakeHead.style.top = Number(snakeHead.style.top.split("px")[0]) + 20 + "px"
                snakeHead.style.left = Number(snakeHead.style.left.split("px")[0]) + 20 + "px"
                moveHead("right")
            } else {
                snakeHead.style.top = Number(snakeHead.style.top.split("px")[0]) + 40 + "px"
                moveHead("down")
            }
        } else {
            snakeHead.style.top = Number(snakeHead.style.top.split("px")[0]) + 40 + "px"
            moveHead("down")
        }
    },
    left: (cornerDirection) => {
        if (snakeHead.style.left === "") {
            snakeHead.style.left = "280px"
        }

        if (snakeAnimation) {
            if (cornerDirection === "up") {
                snakeHead.style.top = Number(snakeHead.style.top.split("px")[0]) - 20 + "px"
                snakeHead.style.left = Number(snakeHead.style.left.split("px")[0]) - 20 + "px"
                moveHead("up")
            } else if (cornerDirection === "down") {
                snakeHead.style.top = Number(snakeHead.style.top.split("px")[0]) + 20 + "px"
                snakeHead.style.left = Number(snakeHead.style.left.split("px")[0]) - 20 + "px"
                moveHead("down")
            } else {
                snakeHead.style.left = Number(snakeHead.style.left.split("px")[0]) - 40 + "px"
                moveHead("left")
            }
        } else {
            snakeHead.style.left = Number(snakeHead.style.left.split("px")[0]) - 40 + "px"
            moveHead("left")
        }
    },
    right: (cornerDirection) => {
        if (snakeHead.style.left === "") {
            snakeHead.style.left = "280px"
        }

        if (snakeAnimation) {
            if (cornerDirection === "up") {
                snakeHead.style.top = Number(snakeHead.style.top.split("px")[0]) - 20 + "px"
                snakeHead.style.left = Number(snakeHead.style.left.split("px")[0]) + 20 + "px"
                moveHead("up")
            } else if (cornerDirection === "down") {
                snakeHead.style.top = Number(snakeHead.style.top.split("px")[0]) + 20 + "px"
                snakeHead.style.left = Number(snakeHead.style.left.split("px")[0]) + 20 + "px"
                moveHead("down")
            } else {
                snakeHead.style.left = Number(snakeHead.style.left.split("px")[0]) + 40 + "px"
                moveHead("right")
            }
        } else {
            snakeHead.style.left = Number(snakeHead.style.left.split("px")[0]) + 40 + "px"
            moveHead("right")
        }
    },
}

function hitBody() {
    const snakeBodyParts = Array.from(document.querySelectorAll(".snake-body:not(:first-child)"))

    if (snakeBodyParts.length > 3) {
        const newSlice = snakeBodyParts.slice(3)

        for (let i = 0; i < newSlice.length; i++) {
            const bodyPart = newSlice[i]

            const isHorizontal = snakeHead.style.left < bodyPart.style.left + bodyPart.offsetWidth && snakeHead.style.left + snakeHead.offsetWidth > bodyPart.style.left
            const isVertical = snakeHead.style.top < bodyPart.style.top + bodyPart.offsetHeight && snakeHead.style.top + snakeHead.offsetHeight > bodyPart.style.top

            if (isHorizontal && isVertical) {
                if (newHighScore) {
                    document.querySelector("#new-high-score").textContent = "New High Score!"
                }

                gameOverContainer.style.display = "flex"

                clearInterval(moveBodyID)
                clearInterval(addBodyID)

                gameOver = true

                if (snakeAnimation) {
                    snakeHead.removeEventListener("animationend", wrapper)
                }

                localStorage.setItem("highScore", Number(highScore.textContent.split("HIGH SCORE:")[1]))

                return
            }
        }
    }
}

function hitApple() {
    const apple = document.querySelector(".apple")

    const isHorizontal =
        Number(snakeHead.style.left.split("px")[0]) < Number(apple.style.left.split("px")[0]) + apple.offsetWidth &&
        Number(snakeHead.style.left.split("px")[0]) + snakeHead.offsetWidth > Number(apple.style.left.split("px")[0])
    const isVertical =
        Number(snakeHead.style.top.split("px")[0]) < Number(apple.style.top.split("px")[0]) + apple.offsetHeight &&
        Number(snakeHead.style.top.split("px")[0]) + snakeHead.offsetHeight > Number(apple.style.top.split("px")[0])

    if (isHorizontal && isVertical) {
        const apple = document.querySelector(".apple")
        apple.remove()

        const element = document.createElement("div")
        element.classList.add("snake-body")

        addedBodyPart = element

        increaseScores()
        addApple()
    }
}

const moveBody = (elements) => {
    let firstBodyElement = true

    let previousElement = {
        top: snakeHead.style.top,
        left: snakeHead.style.left,
    }

    elements.forEach((element) => {
        const currentElement = {
            top: element.style.top,
            left: element.style.left,
        }

        if (firstBodyElement) {
            firstBodyElement = false

            const prevTop = Number(previousElement.top.split("px")[0])
            const prevLeft = Number(previousElement.left.split("px")[0])
            const currTop = Number(currentElement.top.split("px")[0])
            const currLeft = Number(currentElement.left.split("px")[0])

            if (prevTop === currTop) {
                if (prevLeft < currLeft) {
                    element.style.left = `${currLeft - 40}px`
                } else {
                    element.style.left = `${currLeft + 40}px`
                }
            } else {
                if (prevTop < currTop) {
                    element.style.top = `${currTop - 40}px`
                } else {
                    element.style.top = `${currTop + 40}px`
                }
            }
        } else {
            element.style.top = previousElement.top
            element.style.left = previousElement.left
        }

        previousElement.top = currentElement.top
        previousElement.left = currentElement.left
    })

    if (addedBodyPart) {
        addedBodyPart.style.top = previousElement.top
        addedBodyPart.style.left = previousElement.left

        mainElement.appendChild(addedBodyPart)

        elements = Array.from(document.querySelectorAll(".snake-body:not(:first-child)"))
    }

    addedBodyPart = null

    let lastElement = elements[elements.length - 1]
    let secondToLastElement = elements[elements.length - 2]

    if (secondToLastElement) {
        if (Number(lastElement.style.left.split("px")[0]) !== Number(secondToLastElement.style.left.split("px")[0])) {
            if (Number(lastElement.style.left.split("px")[0]) > Number(secondToLastElement.style.left.split("px")[0])) {
                currentTailDirection = oppositeDirection.left
            } else {
                currentTailDirection = oppositeDirection.right
            }
        } else {
            if (Number(lastElement.style.top.split("px")[0]) > Number(secondToLastElement.style.top.split("px")[0])) {
                currentTailDirection = oppositeDirection.up
            } else {
                currentTailDirection = oppositeDirection.down
            }
        }
    } else {
        currentTailDirection = oppositeDirection[currentDirection]
    }
}

const observer = new IntersectionObserver(
    (entries) => {
        if (!entries[0].isIntersecting) {
            if (newHighScore) {
                document.querySelector("#new-high-score").textContent = "New High Score!"
            }

            gameOverContainer.style.display = "flex"

            clearInterval(moveBodyID)
            clearInterval(addBodyID)

            gameOver = true

            if (snakeAnimation) {
                snakeHead.removeEventListener("animationend", wrapper)
            }

            localStorage.setItem("highScore", Number(highScore.textContent.split("HIGH SCORE:")[1]))
        }
    },
    {
        root: document.querySelector("#main"),
        threshold: 1,
    }
)

observer.observe(snakeHead)

document.addEventListener("keydown", (e) => {
    if (e.code === "KeyP" && !gameOver) {
        togglePause()

        return
    }

    if (gameOver | gamePaused) return

    const top = Number(snakeHead.style.top.split("px")[0])
    const left = Number(snakeHead.style.left.split("px")[0])

    if (left > 560 || left < 0 || top < 0 || top > 560) {
        gameOver = true

        if (snakeAnimation) {
            snakeHead.removeEventListener("animationend", wrapper)
        }

        return
    }

    const moveDirection = e.code.split("Arrow")[1]?.toLowerCase()

    if (moveDirection === oppositeDirection[currentDirection]) return

    if (snakeAnimation) {
        if (moveDirection === oppositeDirection[snakeHead.classList[1].split("snake-head-")[1]]) return

        if (arrowKeys.includes(e.code) && gameStarted) currentDirection = moveDirection
    }

    if (!gameStarted) {
        if (!arrowKeys.includes(e.code)) return

        gameStarted = true

        if (snakeAnimation) {
            if (currentDirection !== moveDirection) {
                snakeHead.classList.add(`snake-corner-${currentDirection}-${moveDirection}`)
            } else {
                snakeHead.classList.add(`snake-body-${currentDirection}`)
            }
        }

        currentDirection = moveDirection
    }

    if (snakeAnimation) return

    if (arrowKeys.includes(e.code)) {
        if (moveBodyID) {
            clearInterval(moveBodyID)
        }

        currentDirection = moveDirection

        moveBody(Array.from(document.querySelectorAll(".snake-body:not(:first-child)")))
        moveInDirection[moveDirection]()
        hitBody()
        hitApple()
        moveTail(currentTailDirection)
        changeBodyCorner(Array.from(document.querySelectorAll(".snake-body")))

        if (gameOver) return

        moveBodyID = setInterval(() => {
            moveBody(Array.from(document.querySelectorAll(".snake-body:not(:first-child)")))
            moveInDirection[moveDirection]()
            hitBody()
            hitApple()
            moveTail(currentTailDirection)
            changeBodyCorner(Array.from(document.querySelectorAll(".snake-body")))
        }, intervalDelay)
    }
})

function startGame() {
    restartGame()

    toggleStart()
}

let snakeBodyStartPositions = {
    up: {
        top: "320px",
        left: "280px",
    },
    down: {
        top: "240px",
        left: "280px",
    },
    left: {
        top: "280px",
        left: "320px",
    },
    right: {
        top: "280px",
        left: "240px",
    },
}

function resetDirections(direction) {
    snakeBody.style.top = snakeBodyStartPositions[direction || "left"].top
    snakeBody.style.left = snakeBodyStartPositions[direction || "left"].left
    snakeBody.classList = `snake-body snake-tail-${oppositeDirection[direction || "left"]}`

    moveHead(direction || "left")
}

function restartGame() {
    const apple = document.querySelector(".apple")

    if (apple) {
        apple.remove()
    }

    gameOverContainer.style.display = "none"
    snakeHead.style.top = "280px"
    snakeHead.style.left = snakeAnimation ? "300px" : "280px"
    currentTailBodyPart = snakeBody

    snakeHead.classList.remove(snakeHead.classList[2])
    snakeHead.addEventListener("animationend", wrapper)

    resetDirections(localStorage.getItem("direction"))

    const snakeBodyParts = Array.from(document.querySelectorAll(".snake-body:not(:first-child)"))

    if (snakeBodyParts.length > 1) {
        snakeBodyParts.shift()

        snakeBodyParts.forEach((bodyPart) => {
            bodyPart.remove()
        })
    }

    if (localStorage.getItem("highScore")) {
        highScore.textContent = `HIGH SCORE: ${localStorage.getItem("highScore")}`
    } else {
        highScore.textContent = `HIGH SCORE: 0`
    }

    addedBodyPart = null
    moveBodyID = null
    addBodyID = null
    gameOver = false
    gameStarted = false
    newHighScore = false
    currentDirection = localStorage.getItem("direction") || "left"
    currentTailDirection = "right"
    document.querySelector("#new-high-score").textContent = ""
    score.textContent = "SCORE: 0"

    addApple()
}

function addApple() {
    const applePosition = getApplePosition()
    const appleElement = document.createElement("div")
    const appleBottomElement = document.createElement("div")
    const appleTopElement = document.createElement("div")
    const appleStemElement = document.createElement("div")
    const appleLeafElement = document.createElement("div")

    appleElement.classList.add("apple")
    appleElement.style.top = `${applePosition.top}px`
    appleElement.style.left = `${applePosition.left}px`
    appleBottomElement.classList.add("apple-bottom")
    appleTopElement.classList.add("apple-top")
    appleStemElement.classList.add("apple-stem")
    appleLeafElement.classList.add("apple-leaf")

    appleElement.appendChild(appleBottomElement)
    appleElement.appendChild(appleTopElement)
    appleElement.appendChild(appleStemElement)
    appleElement.appendChild(appleLeafElement)
    mainElement.appendChild(appleElement)
}

document.querySelector("#play-again-button").addEventListener("click", restartGame)
document.querySelector("#play-button").addEventListener("click", startGame)

function getApplePosition() {
    const appleTop = Math.round(Math.floor(Math.random() * 560) / 40) * 40
    const appleLeft = Math.round(Math.floor(Math.random() * 560) / 40) * 40

    let flag = false

    const snakeBodyParts = Array.from(document.querySelectorAll(".snake-body"))

    snakeBodyParts.forEach((bodyPart) => {
        const isHorizontal = appleLeft < bodyPart.offsetLeft + bodyPart.offsetWidth && appleLeft + 40 > bodyPart.offsetLeft
        const isVertical = appleTop < bodyPart.offsetTop + bodyPart.offsetHeight && appleTop + 40 > bodyPart.offsetTop

        if (isHorizontal && isVertical) {
            flag = true
            return
        }
    })

    if (!flag) {
        return {
            top: appleTop,
            left: appleLeft,
        }
    } else {
        return getApplePosition()
    }
}

function increaseScores() {
    let currentScore = Number(score.textContent.split("SCORE:")[1])
    let currentHighScore = Number(highScore.textContent.split("HIGH SCORE:")[1])

    currentScore++

    score.textContent = `SCORE: ${currentScore}`

    if (currentScore > currentHighScore) {
        if (!newHighScore) {
            newHighScore = true
        }

        currentHighScore++

        highScore.textContent = `HIGH SCORE: ${currentHighScore}`
    }
}

function moveTail(direction) {
    const snakeBodyParts = [...document.querySelectorAll(".snake-body:not(:first-child)")]
    const lastSnakeBodyPart = snakeBodyParts[snakeBodyParts.length - 1]
    let sClass = null
    let flag = false

    lastSnakeBodyPart.classList.value.split(" ").forEach((snakeClass) => {
        if (snakeClass.includes("snake-tail")) {
            flag = true
            sClass = snakeClass
            return
        }
    })

    if (flag) {
        if (!sClass.includes(direction)) {
            currentTailBodyPart.classList.remove(sClass)
            lastSnakeBodyPart.classList.add(`snake-tail-${direction}`)
            currentTailBodyPart = lastSnakeBodyPart
        }
    } else {
        currentTailBodyPart.classList.value.split(" ").forEach((snakeClass) => {
            if (snakeClass.includes("snake-tail")) {
                currentTailBodyPart.classList.remove(snakeClass)
                lastSnakeBodyPart.classList.add(`snake-tail-${direction}`)
                currentTailBodyPart = lastSnakeBodyPart
            }
        })
    }
}

function changeBodyCorner(elements) {
    for (let i = 1; i < elements.length - 1; i++) {
        const previous = { top: Number(elements[i - 1].style.top.split("px")[0]), left: Number(elements[i - 1].style.left.split("px")[0]) }
        const current = { top: Number(elements[i].style.top.split("px")[0]), left: Number(elements[i].style.left.split("px")[0]) }
        const next = { top: Number(elements[i + 1].style.top.split("px")[0]), left: Number(elements[i + 1].style.left.split("px")[0]) }

        if ((previous.top === current.top && next.top === current.top) || (previous.left === current.left && next.left === current.left)) {
            elements[i].classList.value = "snake-body"
        } else {
            if ((previous.left > current.left && next.top > current.top) || (previous.top > current.top && next.left > current.left)) {
                elements[i].classList.value = "snake-body snake-body-top-left-corner"
            } else if ((previous.left < current.left && next.top > current.top) || (previous.top > current.top && next.left < current.left)) {
                elements[i].classList.value = "snake-body snake-body-top-right-corner"
            } else if ((previous.left > current.left && next.top < current.top) || (previous.top < current.top && next.left > current.left)) {
                elements[i].classList.value = "snake-body snake-body-bottom-left-corner"
            } else if ((previous.left < current.left && next.top < current.top) || (previous.top < current.top && next.left < current.left)) {
                elements[i].classList.value = "snake-body snake-body-bottom-right-corner"
            }
        }
    }
}

function resetHighScore() {
    localStorage.clear()

    toggleSettings()
}

document.querySelector("#reset-high-score-button").addEventListener("click", resetHighScore)

function toggleSettings() {
    if (!localStorage.getItem("highScore") || localStorage.getItem("highScore") == 0) {
        document.querySelector("#reset-high-score-button").disabled = true
    } else {
        document.querySelector("#reset-high-score-button").disabled = false
    }

    if (window.getComputedStyle(document.querySelector("#game-settings-container")).display === "none") {
        document.querySelector("#game-settings-container").style.display = "flex"

        document.querySelectorAll("#start-direction-select option").forEach((option) => {
            if (option.value === localStorage.getItem("direction")) {
                option.selected = true
            } else {
                if (!option.selected) {
                    option.selected = false
                }
            }
        })
    } else {
        document.querySelector("#game-settings-container").style.display = "none"
    }
}

function toggleStart() {
    if (window.getComputedStyle(document.querySelector("#game-start-container")).display === "none") {
        document.querySelector("#game-start-container").style.display = "flex"
    } else {
        document.querySelector("#game-start-container").style.display = "none"
    }

    if (window.getComputedStyle(gamePausedContainer).display === "flex") {
        gamePausedContainer.style.display = "none"

        gamePaused = false
    }
}

function togglePause() {
    if (window.getComputedStyle(gamePausedContainer).display === "none") {
        gamePausedContainer.style.display = "flex"

        if (snakeAnimation) {
            snakeHead.removeEventListener("animationend", wrapper)
        } else {
            clearInterval(moveBodyID)
            clearInterval(addBodyID)
        }

        gamePaused = true
    } else {
        gamePausedContainer.style.display = "none"

        if (gameStarted) {
            if (snakeAnimation) {
                let className = snakeHead.classList[2]

                snakeHead.addEventListener("animationend", wrapper)
                snakeHead.classList.remove(snakeHead.classList[2])

                setTimeout(() => {
                    snakeHead.classList.add(className)
                })
            } else {
                moveBodyID = setInterval(() => {
                    moveBody(Array.from(document.querySelectorAll(".snake-body:not(:first-child)")))
                    moveInDirection[currentDirection]()
                    hitBody()
                    hitApple()
                    moveTail(currentTailDirection)
                    changeBodyCorner(Array.from(document.querySelectorAll(".snake-body")))
                }, intervalDelay)
            }
        }

        gamePaused = false
    }
}

if (snakeAnimation) {
    document.querySelector("#snake-animation-toggle").checked = true

    document.styleSheets[0].cssRules[29].style.cssText = "transition-duration: 300ms;"
}

document.querySelector("#settings-button").addEventListener("click", toggleSettings)
document.querySelector("#game-start-button").addEventListener("click", toggleSettings)
document.querySelectorAll(".back-game-start-button").forEach((button) => button.addEventListener("click", toggleStart))
document.querySelector("#game-pause-button").addEventListener("click", togglePause)
document.querySelector("#continue-game-button").addEventListener("click", togglePause)
document.querySelector("#start-direction-select").addEventListener("change", (e) => {
    localStorage.setItem("direction", e.target.value)
})
document.querySelector("#snake-animation-toggle").addEventListener("change", (e) => {
    localStorage.setItem("snakeAnimation", e.target.checked)

    snakeAnimation = e.target.checked

    if (snakeAnimation) {
        document.styleSheets[0].cssRules[29].style.cssText = "transition-duration: 300ms;"
    } else {
        document.styleSheets[0].cssRules[29].style.cssText = "transition-duration: 0ms;"
    }
})

function replaceAnimation(newClass) {
    let divElementStyles = window.getComputedStyle(snakeHead)
    let animationClass = divElementStyles.animation.split(" ").pop()

    moveBody(Array.from(document.querySelectorAll(".snake-body:not(:first-child)")))

    if (animationClass === "snake-body-right" || animationClass.includes("snake-corner-right")) {
        moveInDirection.right(animationClass.split("snake-corner-right-")[1])
    } else if (animationClass === "snake-body-left" || animationClass.includes("snake-corner-left")) {
        moveInDirection.left(animationClass.split("snake-corner-left-")[1])
    } else if (animationClass === "snake-body-up" || animationClass.includes("snake-corner-up")) {
        moveInDirection.up(animationClass.split("snake-corner-up-")[1])
    } else if (animationClass === "snake-body-down" || animationClass.includes("snake-corner-down")) {
        moveInDirection.down(animationClass.split("snake-corner-down-")[1])
    }

    hitBody()
    hitApple()
    moveTail(currentTailDirection)
    changeBodyCorner(Array.from(document.querySelectorAll(".snake-body")))

    snakeHead.classList.remove(animationClass)

    setTimeout(() => {
        if (animationClass.includes(newClass)) {
            snakeHead.classList.add(`snake-body-${newClass}`)
        } else {
            snakeHead.classList.add(`snake-corner-${animationClass.split("snake-body-")[1]}-${newClass}`)
        }
    })
}

function wrapper() {
    replaceAnimation(currentDirection)
}
