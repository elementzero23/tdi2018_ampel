/***              drawing.js                       ***/
/***        Version  0.42 / 201807                 ***/
/***     Licensed under a GNU GPL 3.0              ***/
/***    github.com/krichenbauer/drawing.js         ***/


class Drawing {
  constructor(c) {
    this._canvas = c;
    if (this._canvas == null) {this.canvas = document.querySelector('canvas');}
    if (this._canvas == null) {
      this._canvas = document.createElement('canvas');
      document.querySelector('body').appendChild(this._canvas); 
    }
    this._shapes = [];
    
    if (!window.drawing) {
      window.drawing = this;  
      window.addEventListener("resize", function(event) {
        window.drawing.updateSize();
      })
    }
    this.updateSize();
  }  
  
  addShape(s) {
    this._shapes.push(s);
    this.update();
    return true;
  }
  
  removeShape(s) {
    let index = this._shapes.indexOf(s);
    if (index > -1) {
      this._shapes.splice(index, 1);
      this.update();
      return true;
    }
    return false;
  }
  
  updateSize() {
    this._canvas.width  = window.innerWidth;
    this._canvas.height = window.innerHeight;
    this.update();
  }

  update() {
    this._canvas.getContext('2d').clearRect(0, 0, this._canvas.width, this._canvas.height);
    
    for (let i in this._shapes) {
      this._shapes[i].drawTo(this._canvas);  
    }
  }
}

class Shape {
  constructor(x,y,color,borderColor) {
    if (new.target === Shape) {
      throw new TypeError("Shape is an abstract class");
    }
    
    this._x = x;
    this._y = y;
    this._color = color;
    this._borderColor = borderColor;
  }  

  add() {
    if(!window.drawing) {window.drawing = new Drawing();}  
    window.drawing.addShape(this);  
  }

  remove() {
    window.drawing.removeShape(this);  
  }
  
  update() {
    window.drawing.update();  
  }

  drawTo(canvas) {
    console.error('Abstract method drawTo is not specified');
  }          

  setPosition(x,y) {
    this._x = x;
    this._y = y;
    this.update();
  }
  
  setColor(c) {
    this._color = c;
    this.update();  
  }
  
  setBorderColor(c) {
    this._borderColor = c;
    this.update();  
  }

}

class Triangle extends Shape {
  constructor(x = 50, y=50, width=50, height=50,color="#FFFFFF", borderColor="#000000") {
    super(x,y,color, borderColor);
    this._width = width;
    this._height = height;
    this.add();
  }
  
  setWidth(w) {
    this._width = w;  
    this.update();
  }
  
  setHeight(h) {
    this._height = h;
    this.update();
  }

  
  drawTo(canvas) {
    var context = canvas.getContext('2d');
    
    context.beginPath();
    
    var path=new Path2D();
    path.moveTo(this._x,this._y);
    path.lineTo(this._x+this._width,this._y);
    path.lineTo(this._x+this._width/2,this._y-this._height/2);
    path.lineTo(this._x,this._y);
    
    
    context.fillStyle = this._color;
    context.fill(path);
    context.lineWidth = 2;
    context.strokeStyle = this._borderColor;
    context.stroke(path);
    context.closePath();
  }
}

class Rectangle extends Shape {
  constructor(x=50, y=50, width=100, height=50, color="#FFFFFF", borderColor="#000000") {
    super(x,y,color,borderColor);
    this._width = width;
    this._height = height;  
    this.add();
  }
  
  setWidth(w) {
    this._width = w;  
    this.update();
  }
  
  setHeight(h) {
    this._height = h;
    this.update();
  }

  drawTo(canvas) {       
    var context = canvas.getContext('2d');
    
    context.beginPath();
    context.rect(
      this._x,
      this._y,
      this._width,
      this._height);
    context.fillStyle = this._color;
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = this._borderColor;
    context.stroke();
    context.closePath();
  }
}


class Circle extends Shape{
  constructor(x = 50, y=50,r=25,color = "#FFFFFF", borderColor="#000000") {
    super(x,y,color,borderColor);
    this._r = r;
    this.add();
  }
  
  
  setRadius(r) {
    this._r = r;
    this.update();  
  }

  drawTo(canvas) {       
    var context = canvas.getContext('2d');
    
    context.beginPath();
    context.arc(
      this._x,
      this._y,
      this._r, 
      0, 
      2 * Math.PI,
      false);
    context.fillStyle = this._color;
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = this._borderColor;
    context.stroke();
    context.closePath();
  }
}

window.addEventListener('load',function() {
  if (window.chaos != undefined) {
    window.chaos.addClass('Circle');
    window.chaos.addClass('Rectangle');
    window.chaos.addClass('Triangle');
  }
  document.body.setAttribute('style', 'margin:0');
});