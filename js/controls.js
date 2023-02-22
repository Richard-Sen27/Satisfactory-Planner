let c = document.getElementById('testCircle')
        let isDraged = false;
        let mouseX = 0;
        let mouseY = 0;

        c.addEventListener("click", toggleIsDraged)

        function toggleIsDraged() {
            console.log("clicked");
            isDraged = !isDraged;
            if (isDraged) {
                mouseX = event.offsetX
                mouseY = event.offsetY
            }
        }

        setInterval(checkMoving(), 500);
        function checkMoving() {
            document.onmousemove = function moving(event) {
                if (isDraged) {
                    c.style.left = (event.pageX - mouseX) + "px"
                    c.style.top = (event.pageY - mouseY) + "px"
                    console.log("X:"+event.offsetX)
                    console.log("Y:"+event.offsetY)
                }
            }
        }