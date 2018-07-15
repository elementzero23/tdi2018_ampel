/***              chaos.js                         ***/
/*** Choas Handler to Access Objects in javaScript ***/
/***        Version  0.23 / 201807                 ***/
/***     Licensed under a GNU GPL 3.0              ***/
/***    github.com/krichenbauer/chaos.js           ***/


class Chaos {
  constructor() {
    this.classnames = [];
    this.objects = {};

    this.generateWindow(); // generates this.window, this.classArea, this.objArea
  }

  init() {
    document.body.append(this.window);
    var classes = document.head.innerHTML.match(/class\s+([^\s\{]*)/g);
    for (var i in classes) {
      let classname = classes[i].match(/class\s+([^\s\{]*)/)[1];
      this.addClass(classname);
    }

    for(var i in this.classnames) {
      this.createButtonFor(this.classnames[i]);
    }

  }

  addClass(classname) {
    this.classnames.push(classname);
    this.objects[classname.toLowerCase()] = [];
  }

  generateWindow() {
    this.window = document.createElement('div');
    this.window.setAttribute("style",'display: block; position:absolute; right: 5%; bottom:10px; color:white; width:80%; height:200px; background-color:black; overflow:scroll; padding:5px;');

    this.classArea = document.createElement('div');
    this.window.append(this.classArea);

    this.objArea = document.createElement('div');
    this.objArea.setAttribute('style', 'margin-top:10px');
    this.window.append(this.objArea);


  }

  getNewObjectIdFor(classname) {
    var nr = this.objects[classname.toLowerCase()].length;
    return classname.toLowerCase()+nr;
  }

  createButtonFor(classname) {
    let button = document.createElement('button');
    button.innerHTML = "new "+classname+"()";
    button.setAttribute('style', "font-weight:bold; margin:2px;");
    var self = this;
    button.addEventListener('click', function() {
      var objectId = self.getNewObjectIdFor(classname);
      eval("window."+objectId+"= new "+classname);
      console.log(objectId+" = new "+classname+"();");
      eval("self.objects[classname.toLowerCase()].push(window."+objectId+");");
      self.createObjectCardFor(objectId);
    });
    this.classArea.append(button);
  }

  createObjectCardFor(objectId) {
    let button = document.createElement('button');

    button.setAttribute("style","border-radius:8px; margin:2px;");
    button.innerHTML = ""+objectId;
    button.addEventListener('click', function() {
      listAllMethods(objectId);
    });
    button.addEventListener('contextmenu', function (e) {
      // show the methods available for that class
      // event object is used to get pointer position
      showMethodsFor(objectId, e);
      e.preventDefault()
    }, false);
    this.objArea.append(button);
  }
}

/**
 * When right-clicking an object card this method shows all the available
 * methods for this object. You can click on a method to execute it.
 */
function showMethodsFor(objectId, e) {
  let posX = e.target.getBoundingClientRect().right + 10;
  let posY = e.target.getBoundingClientRect().bottom;

  let overlay = document.createElement('div');

  let methodsList = listAllMethods(objectId);

  methodsList.forEach(m => {
    let item = document.createElement('div');
    item.innerHTML = m + "()";
    item.setAttribute("data-methodName", m);
    item.style.height = 30;
    item.style.lineHeight = "30px";
    item.style.borderBottom = "1px solid black";
    item.style.paddingLeft = 20;
    item.style.paddingRight = item.style.paddingLeft;
    item.setAttribute("data-objectId", objectId);
    item.addEventListener("click", function(e) {
      let obj = e.target.getAttribute("data-objectId");
      /*
        OK, there is an issue coming from inheritance. You can't "easily" access
        properties of a superclass from it's subclass.
        If you want to get the definition of all the methods known by an object
        you have to recursively go up in the inheritance hierarchy and check for
        every superclass if the method is defined there.
      */
      let hasProp = eval(obj + ".hasOwnProperty('" + item.getAttribute("data-methodName") + "')");
      if (!hasProp) {
        console.log(eval(obj + ".__proto__.hasOwnProperty('" + item.getAttribute("data-methodName") + "')"));
        console.log(eval(obj + "." + item.getAttribute("data-methodName") + ".arguments.length"));
      }
    });
    overlay.append(item);
  });

  overlay.firstChild.style.borderTop = "1px solid black";

  let wh = window.innerHeight;
  // make the overlay nice
  overlay.style.position = "absolute";
  overlay.style.top = posY;
  overlay.style.left = posX;
  overlay.style.backgroundColor = "#ffffff";
  overlay.style.borderLeft = "1px solid black";
  overlay.style.borderRight = overlay.style.borderLeft;

  document.body.append(overlay);
  let h = overlay.offsetHeight;
  let difference = wh - (posY+h);
  if (difference < 0) {
    overlay.style.top = posY + difference - 5;
  }
}

function listAllMethods(objectId) {

  eval("var className = "+window[objectId].constructor.name+";");
  if (!className instanceof Object) {
    throw new Error("Not an Object");
  }
  let methodsList = [];
  let ret = [];

  function methods(obj, inheritenceLevel) {
    if (obj) {
      let ps = Object.getOwnPropertyNames(obj);

      ps.forEach(p => {
        if (
          obj[p] instanceof Function
          &&
          !ret[p]
          ) {
            ret[p] = inheritenceLevel;
            methodsList.push(p);
            console.log(p+"()");
        } else {
            //can add properties if needed
        }
      });

      methods(Object.getPrototypeOf(obj), inheritenceLevel+1);
    }
  }

  console.group("Available Methods for "+ objectId + ":" + window[objectId].constructor.name + "");
  methods(className.prototype, 0);
  console.groupEnd();
  return methodsList;
}


window.chaos = new Chaos();
window.addEventListener('load', function() {
  window.chaos.init();
});

window.addEventListener('unload', function() {});
