import test from 'ava';
const path = require('path');
const basename = path.join(process.cwd(), 'examples');
test('bigSquare is a big square', async t => {
  const Iocca = require('../index')(
    {
      bigSquare: {
        className: 'io.github.iocca.shapes/Square',
        constructorArgs: [50, 90]
      },
    },
    basename,
  );
  const bigSquare = Iocca.create('bigSquare');
  t.is(bigSquare.whatIsThis(), 'a big square');
});

test('smallSquare is a small square', async t => {
  const Iocca = require('../index')(
    {
      smallSquare: {
        className: 'io.github.iocca.shapes/Square',
        constructorArgs: [50, 23]
      },
    },
    basename,
  );
  const smallSquare = Iocca.create('smallSquare');
  t.is(smallSquare.whatIsThis(), 'a small square');
});

test('the area of this square should be 100', async t => {
  const Iocca = require('../index')(
    {
      square: {
        className: 'io.github.iocca.shapes/Square',
        constructorArgs: [10, 23],
        setB: [10],
      },
    },
    basename,
  );
  const square = Iocca.create('square');
  t.is(square.getArea(), 100);
});

test('the area of this square should be 100', async t => {
  const Iocca = require('../index')(
    {
      square: {
        className: 'io.github.iocca.shapes/Square',
        constructorArgs: [10, 23],
        setB: [10],
      },
    },
    basename,
  );
  const square = Iocca.create('square');
  t.is(square.getArea(), 100);
});

test('shape is a shape', async t => {
  const Iocca = require('../index')(
    {
      shape: {
        className: 'io.github.iocca.shapes/Shape'
      },
    },
    path.join(process.cwd(), 'examples'),
  );
  const shape = Iocca.create('shape');
  t.is(shape.whatIsThis(), 'a shape');
});

test('triangle is a triangle', async t => {
  const Iocca = require('../index')(
    {
      triangle: {
        className: 'io.github.iocca.shapes/Triangle'
      },
    },
    basename,
  );
  const triangle = Iocca.create('triangle');
  t.is(triangle.whatIsThis(), 'a triangle');
});

test('wrapperOfShape contains a shape', async t => {
  const Iocca = require('../index')(
    {
      wrapperOfShape: {
        className: 'io.github.iocca.wrappers/Wrapper',
        setShape: [{ className: 'io.github.iocca.shapes/Shape' }]
      },
    },
    basename,
  );
  const wrapperOfShape = Iocca.create('wrapperOfShape');
  t.is(wrapperOfShape.whatIContain(), 'I contain a shape');
});

test('ref parameter works', async t => {
  const Iocca = require('../index')(
    {
      smallSquare: {
        className: 'io.github.iocca.shapes/Square',
        constructorArgs: [50, 23]
      },
      wrapperOfShape: {
        className: 'io.github.iocca.wrappers/Wrapper',
        constructorArgs: [{ ref: 'smallSquare' }]
      },
    },
    basename,
  );
  const wrapperOfShape = Iocca.create('wrapperOfShape');
  t.is(wrapperOfShape.whatIContain(), 'I contain a small square');
});

test('it should be a singleton', async t => {
  const Iocca = require('../index')(
    {
      square: {
        className: 'io.github.iocca.shapes/Square',
        scope: 'singleton',
        constructorArgs: [10, 5],
      },
    },
    basename,
  );
  const square = Iocca.create('square');
  t.is(square.getArea(), 50);
  square.setB(10);
  t.is(square.getArea(), 100);
  const theSameSquare = Iocca.create('square');
  t.is(theSameSquare.getArea(), 100);
});

test('it should be rejected', async t => {
  const Iocca = require('../index')(
    {
      square: {
        className: 'io.github.iocca.shapes/Square',
        scope: 'aStrangeScope',
        constructorArgs: [10, 5],
      },
    },
    basename,
  );
  t.throws(() => Iocca.create('square'));
});
