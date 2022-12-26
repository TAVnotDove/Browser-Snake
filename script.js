console.log("Hello World!")

document.addEventListener("keyup", (e) => {
    console.log(e.code, "up")
})

document.addEventListener("keydown", (e) => {
    console.log(e.code, "down")
})

const snakeHead = document.querySelector("#snake-head")

const observer = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) {
        console.log("GAME OVER")
    }
}, {
    root: document.querySelector("#main"),
    threshold: 1
})

observer.observe(snakeHead)