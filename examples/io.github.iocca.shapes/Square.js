const Shape = require('./Shape');

class Square extends Shape {

  constructor(a, b) {
    super();
    this.a = a;
    this.b = b;
  }

  getA() {
    return this.a;
  }

  getB() {
    return this.b;
  }

  setA(a) {
    this.a = a;
  }

  setB(b) {
    this.b = b;
  }

  getArea() {
    return this.getA() * this.getB();
  }

  whatIsThis() {
    const a = this.a;
    const b = this.b;
    return (a + b) > 100 ? 'a big square' : 'a small square';
  }

}

module.exports = Square;
