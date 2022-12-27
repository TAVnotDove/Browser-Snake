const snakeHead = document.querySelector("#snake-head")
const snakeBody = document.querySelector(".snake-body:not(:first-child)")
const gameOverContainer = document.querySelector("#game-over-container")
const arrowKeys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"]

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

const moveBody = (elements) => {
    let previousElement = {
        top: snakeHead.style.top,
        left: snakeHead.style.left
    }
    console.log(elements[0].style.top, "top")
    console.log(elements[0].style.left, "left")
    console.log(previousElement, "prev el")
    elements.forEach(element => {
        element.style.top = previousElement.top
        element.style.left = previousElement.left
    });
}

const observer = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) {
        gameOverContainer.style.display = "flex"
        
        clearInterval(intervalID)
        
        gameOver = true
    }
}, {
    root: document.querySelector("#main"),
    threshold: 1
})

observer.observe(snakeHead)

let intervalID = null
let intervalDelay = 1000
let gameOver = false

document.addEventListener("keydown", (e) => {
    if (gameOver) return
    
    if (arrowKeys.includes(e.code)) {            
        if (intervalID) {
            clearInterval(intervalID)
        }
        const moveDirection = e.code.split("Arrow")[1].toLowerCase()
        
        moveBody(elementsArray = Array.from(document.querySelectorAll(".snake-body:not(:first-child)")))
        moveInDirection[moveDirection]()
        
        intervalID = setInterval(() => {
            moveBody(elementsArray = Array.from(document.querySelectorAll(".snake-body:not(:first-child)")))
            moveInDirection[e.code.split("Arrow")[1].toLowerCase()]()
        }, intervalDelay);
    }
})

function restartGame() {
    gameOverContainer.style.display = "none"
    snakeHead.style.top = "280px"
    snakeHead.style.left = "280px"
    snakeBody.removeAttribute("style")
    intervalID = null
    gameOver = false
}

document.querySelector("#play-again-button").addEventListener("click", restartGame)

restartGame()
