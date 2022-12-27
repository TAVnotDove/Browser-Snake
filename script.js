const snakeHead = document.querySelector("#snake-head")
const gameOverContainer = document.querySelector("#game-over-container")
const arrowKeys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"]

const moveInDirection = {
    up: (element) => {
        if (element.style.top === "") {
            element.style.top = "280px" 
        }
        element.style.top = element.style.top.split("px")[0]-40+"px"
    },
    down: (element) => {
        if (element.style.top === "") {
            element.style.top = "280px"
        }
        element.style.top = Number(element.style.top.split("px")[0])+40+"px"
    },
    left: (element) => {
        if (element.style.left === "") {
            element.style.left = "280px"
        }
        element.style.left = element.style.left.split("px")[0]-40+"px"
    },
    right: (element) => {
        if (element.style.left === "") {
            element.style.left = "280px"
        }
        element.style.left = Number(element.style.left.split("px")[0]) + 40 +"px"
    }
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
        
        moveInDirection[e.code.split("Arrow")[1].toLowerCase()](snakeHead)
        
        intervalID = setInterval(() => {
            moveInDirection[e.code.split("Arrow")[1].toLowerCase()](snakeHead)
        }, intervalDelay);
    }
})

document.querySelector("#play-again-button").addEventListener("click", () => {
    gameOverContainer.style.display = "none"
    snakeHead.removeAttribute("style")
    intervalID = null
    gameOver = false
})
