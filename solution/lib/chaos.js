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
    this.objArea.append(button);
    
  }
}

function listAllMethods(objectId) {
  
  eval("var className = "+window[objectId].constructor.name+";");
  if (!className instanceof Object) {
    throw new Error("Not an Object");
  }
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
}


window.chaos = new Chaos();
window.addEventListener('load', function() {
  window.chaos.init();
});

window.addEventListener('unload', function() {});

