# Iocca
<a href="https://travis-ci.org/menxit/iocca"><img src="https://travis-ci.org/menxit/iocca.svg?branch=master" /></a>

Iocca provides a lightweight implementetion of the Dependency Injection design pattern. With Iocca,
instead of having your objects creating a dependency or asking a factory object to make one for them,
you pass the needed dependencies in to the constructor or via property setters through the package.json.

## How it works
Consider you have an application which has a text editor component and you want to provide spell checking.
Your standard code would look something like this:
```js
# io.github.iocca/TextEditor
const SpellChecker = require('io.github.iocca/Spellchecker');
class TextEditor {
   
   constructor() {
      this.spellChecker = new SpellChecker();
   }
}
```

While using Iocca you will able to to the same thing in this way:
```js
# io.github.iocca/TextEditor
const SpellChecker = require('io.github.iocca/Spellchecker');
class TextEditor {
   
   constructor(spellChecker) {
      this.spellChecker = spellChecker
   }
   
   setSpellChecker(spellChecker) {
       this.spellChecker = spellChecker;
   }
}
```

So, where are defined the dependencies? Iocca let you to define the dependencies through the package.json.
In this example you should create a textEditor object:
```json
{
    "name": "iocca",
    "version": "1.0.0",
    "iocca": {
      "textEditor": {
        "className": "io.github.iocca/TextEditor",
        "constructorArgs": [{ "className": "io.github.iocca/Spellchecker" }]
      }
    }
}
```
Now, you are able to use the textEditor object in this way:
```js
const Iocca = require('iocca')();

const textEditor = Iocca.create('textEditor');
```

In package.json we can define all the aspects of the object that we want to create. The "args" will contain all the
parameters that must be used as constructor. For example if we have a Square class:
```js
# io.github.iocca.shapes/Square
class Square {
    
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
    
    setColor(color) {
        this.color = color;
    }
    
}
```
We can create a red square 10x10 in this way:
```json
{
  "iocca": {
    "redSquare": {
      "className": "io.github.iocca.shapes/Square",
      "constructorArgs": [10, 10],
      "setColor": ["red"]
    }
  }
}
```

## How to create a Singleton
Using Iocca you can also define a singleton. The default scope is 'prototype' - it will generate a new object every time 
you will call the create() method of Iocca.
```json
{
  "iocca": {
    "square": {
      "className": "io.github.iocca.shapes/Square",
      "constructorArgs": [10, 10],
      "scope": "singleton",
      "setColor": ["red"]
    }
  }
}
```
```js
const Iocca = require('iocca')();

const square = Iocca.create('square');
square.setColor('yellow');

const theSameSquare = Iocca.create('square');
// theSameSquare.getColor() === 'yellow'  :   TRUE
```