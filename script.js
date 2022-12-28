const mainElement = document.getElementById("main")
const snakeHead = document.querySelector("#snake-head")
const snakeBody = document.querySelector(".snake-body:not(:first-child)")
const gameOverContainer = document.querySelector("#game-over-container")
const arrowKeys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"]
let addedBodyPart = null

const moveInDirection = {
    up: () => {
        if (snakeHead.style.top === "") {
            snakeHead.style.top = "280px" 
        }
        snakeHead.style.top = snakeHead.style.top.split("px")[0]-40+"px"
    },
    down: () => {
        if (snakeHead.style.top === "") {
            snakeHead.style.top = "280px"
        }
        snakeHead.style.top = Number(snakeHead.style.top.split("px")[0])+40+"px"
    },
    left: () => {
        if (snakeHead.style.left === "") {
            snakeHead.style.left = "280px"
        }
        snakeHead.style.left = snakeHead.style.left.split("px")[0]-40+"px"
    },
    right: () => {
        if (snakeHead.style.left === "") {
            snakeHead.style.left = "280px"
        }
        snakeHead.style.left = Number(snakeHead.style.left.split("px")[0]) + 40 +"px"
    }
}

function hitBody() {
    const snakeBodyParts = Array.from(document.querySelectorAll(".snake-body:not(:first-child)"))
    if (snakeBodyParts.length > 3) {
        const newSlice = snakeBodyParts.slice(3)
        for (let i = 0; i < newSlice.length; i++) {
            const bodyPart = newSlice[i];
            
            const isHorizontal = snakeHead.offsetLeft < bodyPart.offsetLeft + bodyPart.offsetWidth && snakeHead.offsetLeft + snakeHead.offsetWidth > bodyPart.offsetLeft
            const isVertical = snakeHead.offsetTop < bodyPart.offsetTop + bodyPart.offsetHeight && snakeHead.offsetTop + snakeHead.offsetHeight > bodyPart.offsetTop

            if (isHorizontal && isVertical) {
                gameOverContainer.style.display = "flex"
        
                clearInterval(moveBodyID)
                clearInterval(addBodyID)
                
                gameOver = true
                
                return
            }
        }
    }
}

const moveBody = (elements) => {
    let previousElement = {
        top: snakeHead.style.top,
        left: snakeHead.style.left
    }
    
    elements.forEach(element => {
        const currentElement = {
            top: element.style.top,
            left: element.style.left
        }
        element.style.top = previousElement.top
        element.style.left = previousElement.left

        previousElement.top = currentElement.top
        previousElement.left = currentElement.left
    });

    if (addedBodyPart) {
        addedBodyPart.style.top = previousElement.top
        addedBodyPart.style.left = previousElement.left
        mainElement.appendChild(addedBodyPart)
    }

    addedBodyPart = null
}

const observer = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) {
        gameOverContainer.style.display = "flex"
        
        clearInterval(moveBodyID)
        clearInterval(addBodyID)
        
        gameOver = true
    }
}, {
    root: document.querySelector("#main"),
    threshold: 1
})

observer.observe(snakeHead)

let moveBodyID = null
let addBodyID = null
let intervalDelay = 1000
let gameOver = false

document.addEventListener("keydown", (e) => {
    if (gameOver) return
    
    if (arrowKeys.includes(e.code)) {            
        if (moveBodyID) {
            clearInterval(moveBodyID)
        }

        const moveDirection = e.code.split("Arrow")[1].toLowerCase()
        
        moveBody(Array.from(document.querySelectorAll(".snake-body:not(:first-child)")))
        moveInDirection[moveDirection]()
        hitBody()

        if (gameOver) return

        moveBodyID = setInterval(() => {
            moveBody(Array.from(document.querySelectorAll(".snake-body:not(:first-child)")))
            moveInDirection[moveDirection]()
            hitBody()
        }, intervalDelay);
    }

    if (!addBodyID) {
        addBodyID = setInterval(() => {
            const element = document.createElement("div")
            element.classList.add("snake-body")
            addedBodyPart = element
        }, 4000);
    }
})

function restartGame() {
    gameOverContainer.style.display = "none"
    snakeHead.style.top = "280px"
    snakeHead.style.left = "280px"
    snakeBody.removeAttribute("style")
    const snakeBodyParts = Array.from(document.querySelectorAll(".snake-body:not(:first-child)"))
    if (snakeBodyParts.length > 1) {
        snakeBodyParts.shift()

        snakeBodyParts.forEach(bodyPart => {
            bodyPart.remove()
        })
    }
    moveBodyID = null
    addBodyID = null
    gameOver = false
}

document.querySelector("#play-again-button").addEventListener("click", restartGame)

restartGame()
