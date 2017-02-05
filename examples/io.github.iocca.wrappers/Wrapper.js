class Wrapper {

  constructor(shape) {
    this.shape = shape;
  }

  getShape() {
    return this.shape;
  }

  whatIContain() {
    return 'I contain ' + this.shape.whatIsThis();
  }

}

module.exports = Wrapper;
