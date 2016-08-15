const PALETTE = ["#ff8888", "#88ff88", "#8888ff", "#ffff44"]

class Circle {
  constructor(canvas, origin, maxRadius) {
    this.center = origin
    this.position = new Vec2(
      (Math.random() - 0.5) * 2 * maxRadius,
      (Math.random() - 0.5) * 2 * maxRadius
    )
    this.position.add(origin)
    this.omega = 0.01 * (Math.random() - 0.5) // Angular Velocity
    this.radius = 4 + Math.random() * 12

    this.fill = PALETTE[Math.floor(Math.random() * PALETTE.length)]
  }

  draw() {
    canvas.context.fillStyle = this.fill
    canvas.drawPoint(this.position, this.radius)

    canvas.context.strokeStyle = "rgba(68, 68, 68, 0.5)"
    canvas.drawLine(this.position, this.center)
  }

  move() {
    this.rotate()
    this.omega *= 0.98
  }

  rotate() {
    var sub = Vec2.sub(this.position, this.center)
    var x = sub.x
    var y = sub.y
    var sin = Math.sin(this.omega)
    var cos = Math.cos(this.omega)
    sub.x = x * cos - y * sin
    sub.y = x * sin + y * cos
    this.position = sub.add(this.center)
  }

  // https://en.wikipedia.org/wiki/Torque
  addTorque(force) {
    var r = Vec2.sub(this.position, this.center)
    this.omega += r.cross(force) / r.length()
  }
}

class Mouse {
  constructor(canvas) {
    this.canvas = canvas.canvas

    this.isMouseDown = false
    this.x = 0
    this.y = 0

    this.canvas.addEventListener("mousedown", this, false)
    this.canvas.addEventListener("mousemove", this, false)
    this.canvas.addEventListener("mouseup", this, false)
    this.canvas.addEventListener("mouseout", this, false)
  }

  handleEvent(event) {
    switch (event.type) {
      case "mousedown":
        this.onMouseDown(event)
        break
      case "mousemove":
        this.onMouseMove(event)
        break
      case "mouseup":
      case "mouseout":
        this.onMouseUp(event)
        break
    }
  }

  getMousePosition(event) {
    var rect = event.target.getBoundingClientRect()
    this.x = event.clientX - rect.left
    this.y = event.clientY - rect.top
  }

  onMouseDown(event) {
    if (event.button !== 2) {
      this.isMouseDown = true
    }
    this.getMousePosition(event)
  }

  onMouseMove(event) {
    if (!this.isMouseDown) {
      return
    }
    this.getMousePosition(event)
  }

  onMouseUp(event) {
    this.isMouseDown = false
  }

  control() {
    if (this.isMouseDown) {
      var force = new Vec2(this.x - origin.x, this.y - origin.y)
      force.normalize().mul(0.01)
      for (var i = 0; i < circles.length; ++i) {
        circles[i].addTorque(force)
      }
    }
  }
}

var canvas = new Canvas(512, 512)
var mouse = new Mouse(canvas)

var origin = canvas.Center
var circles = makeCircles()

animate()

function animate() {
  move()
  draw()
  mouse.control()
  requestAnimationFrame(animate)
}

function move() {
  for (var i = 0; i < circles.length; ++i) {
    circles[i].move()
  }
}

function draw() {
  canvas.clearWhite()

  canvas.context.fillStyle = "#444444"
  canvas.context.strokeStyle = "#444444"
  canvas.drawPoint(origin, 10)

  for (var i = 0; i < circles.length; ++i) {
    circles[i].draw()
  }
}

function makeCircles() {
  var circles = []
  var minScreenLength = getMinScreenLength() / 3
  for (var i = 0; i < 256; ++i) {
    circles.push(new Circle(canvas, this.origin, minScreenLength))
  }
  return circles
}

function getMinScreenLength() {
  return (canvas.width < canvas.height) ? canvas.width : canvas.height
}