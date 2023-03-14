const mainElement = document.getElementById("main")
const snakeHead = document.querySelector("#snake-head")
const snakeLeftEye = document.querySelector("#snake-left-eye")
const snakeLeftPupil = document.querySelector("#snake-left-eye-pupil")
const snakeRightEye = document.querySelector("#snake-right-eye")
const snakeRightPupil = document.querySelector("#snake-right-eye-pupil")
const snakeBody = document.querySelector(".snake-body:not(:first-child)")
const gameOverContainer = document.querySelector("#game-over-container")
const arrowKeys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"]
const score = document.querySelectorAll("#scoreboard p")[0]
const highScore = document.querySelectorAll("#scoreboard p")[1]

let addedBodyPart = null
let currentDirection = null
let moveBodyID = null
let addBodyID = null
let intervalDelay = 1000
let gameOver = false
let newHighScore = false

const oppositeDirection = {
    up: "down",
    down: "up",
    left: "right",
    right: "left",
}

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
    up: () => {
        if (snakeHead.style.top === "") {
            snakeHead.style.top = "280px"
        }

        snakeHead.style.top = snakeHead.style.top.split("px")[0] - 40 + "px"

        moveHead("up")
    },
    down: () => {
        if (snakeHead.style.top === "") {
            snakeHead.style.top = "280px"
        }

        snakeHead.style.top = Number(snakeHead.style.top.split("px")[0]) + 40 + "px"

        moveHead("down")
    },
    left: () => {
        if (snakeHead.style.left === "") {
            snakeHead.style.left = "280px"
        }

        snakeHead.style.left = snakeHead.style.left.split("px")[0] - 40 + "px"

        moveHead("left")
    },
    right: () => {
        if (snakeHead.style.left === "") {
            snakeHead.style.left = "280px"
        }

        snakeHead.style.left = Number(snakeHead.style.left.split("px")[0]) + 40 + "px"

        moveHead("right")
    },
}

function hitBody() {
    const snakeBodyParts = Array.from(document.querySelectorAll(".snake-body:not(:first-child)"))

    if (snakeBodyParts.length > 3) {
        const newSlice = snakeBodyParts.slice(3)

        for (let i = 0; i < newSlice.length; i++) {
            const bodyPart = newSlice[i]

            const isHorizontal = snakeHead.offsetLeft < bodyPart.offsetLeft + bodyPart.offsetWidth && snakeHead.offsetLeft + snakeHead.offsetWidth > bodyPart.offsetLeft
            const isVertical = snakeHead.offsetTop < bodyPart.offsetTop + bodyPart.offsetHeight && snakeHead.offsetTop + snakeHead.offsetHeight > bodyPart.offsetTop

            if (isHorizontal && isVertical) {
                if (newHighScore) {
                    document.querySelector("#new-high-score").textContent = "New High Score!"
                }

                gameOverContainer.style.display = "flex"

                clearInterval(moveBodyID)
                clearInterval(addBodyID)

                gameOver = true

                return
            }
        }
    }
}

function hitApple() {
    const apple = document.querySelector(".apple")
    const isHorizontal = snakeHead.offsetLeft < apple.offsetLeft + apple.offsetWidth && snakeHead.offsetLeft + snakeHead.offsetWidth > apple.offsetLeft
    const isVertical = snakeHead.offsetTop < apple.offsetTop + apple.offsetHeight && snakeHead.offsetTop + snakeHead.offsetHeight > apple.offsetTop

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
    let previousElement = {
        top: snakeHead.style.top,
        left: snakeHead.style.left,
    }

    elements.forEach((element) => {
        const currentElement = {
            top: element.style.top,
            left: element.style.left,
        }

        element.style.top = previousElement.top
        element.style.left = previousElement.left

        previousElement.top = currentElement.top
        previousElement.left = currentElement.left
    })

    if (addedBodyPart) {
        addedBodyPart.style.top = previousElement.top
        addedBodyPart.style.left = previousElement.left

        mainElement.appendChild(addedBodyPart)
    }

    addedBodyPart = null
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
        }
    },
    {
        root: document.querySelector("#main"),
        threshold: 1,
    }
)

observer.observe(snakeHead)

document.addEventListener("keydown", (e) => {
    if (gameOver) return

    const moveDirection = e.code.split("Arrow")[1]?.toLowerCase()

    if (currentDirection && moveDirection === oppositeDirection[currentDirection]) return

    if (arrowKeys.includes(e.code)) {
        if (moveBodyID) {
            clearInterval(moveBodyID)
        }

        currentDirection = moveDirection

        moveBody(Array.from(document.querySelectorAll(".snake-body:not(:first-child)")))
        moveInDirection[moveDirection]()
        hitBody()
        hitApple()

        if (gameOver) return

        moveBodyID = setInterval(() => {
            moveBody(Array.from(document.querySelectorAll(".snake-body:not(:first-child)")))
            moveInDirection[moveDirection]()
            hitBody()
            hitApple()
        }, intervalDelay)
    }
})

function restartGame() {
    const apple = document.querySelector(".apple")

    if (apple) {
        apple.remove()
    }

    gameOverContainer.style.display = "none"
    snakeHead.style.top = "280px"
    snakeHead.style.left = "280px"
    snakeBody.removeAttribute("style")
    moveHead("left")

    const snakeBodyParts = Array.from(document.querySelectorAll(".snake-body:not(:first-child)"))

    if (snakeBodyParts.length > 1) {
        snakeBodyParts.shift()

        snakeBodyParts.forEach((bodyPart) => {
            bodyPart.remove()
        })
    }

    moveBodyID = null
    addBodyID = null
    gameOver = false
    newHighScore = false
    currentDirection = null
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

restartGame()

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
