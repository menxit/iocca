class Wrapper {

  constructor(shape) {
    this.shape = shape;
  }

  getShape() {
    return this.shape;
  }

  setShape(shape) {
    this.shape = shape;
  }

  whatIContain() {
    return 'I contain ' + this.shape.whatIsThis();
  }

}

module.exports = Wrapper;
