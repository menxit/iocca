import test from 'ava';
const path = require('path');
const basename = path.join(process.cwd(), 'examples');
test('bigSquare is a big square', async t => {
  const Iocca = require('../index')(
    {
      bigSquare: {
        type: 'io.github.iocca.shapes/Square',
        args: [50, 90]
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
        type: 'io.github.iocca.shapes/Square',
        args: [50, 23]
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
        type: 'io.github.iocca.shapes/Square',
        args: [10, 23],
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
        type: 'io.github.iocca.shapes/Square',
        args: [10, 23],
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
        type: 'io.github.iocca.shapes/Shape'
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
        type: 'io.github.iocca.shapes/Triangle'
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
        type: 'io.github.iocca.wrappers/Wrapper',
        args: [{ type: 'io.github.iocca.shapes/Shape' }]
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
        type: 'io.github.iocca.shapes/Square',
        args: [50, 23]
      },
      wrapperOfShape: {
        type: 'io.github.iocca.wrappers/Wrapper',
        args: [{ ref: 'smallSquare' }]
      },
    },
    basename,
  );
  const wrapperOfShape = Iocca.create('wrapperOfShape');
  t.is(wrapperOfShape.whatIContain(), 'I contain a small square');
});
