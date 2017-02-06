const path = require('path');

function initializeSingletons() {
  this.singletons = {};
}

function getSingletons() {
  return this.singletons;
}

function getSingletonByID(id) {
  return getSingletons.bind(this)()[id];
}

function addSingleton(id, object) {
  this.singletons[id] = object;
}

function requireModuleByClassName(className) {
  try {
    const pathClass = path.join(getBaseDir.bind(this)(), className);
    return require(pathClass);
  } catch (error) {
    throw 'It seems that the class ' + className + 'doesn\'t exists';
  }
}

function getConfigByID(id) {
  const config = getConfig.bind(this)();
  if (config[id] === undefined) {
    throw id + ' does not exists';
  }
  return config[id];
}

function getClassNameByID(id) {
  const { className } = getConfigByID.bind(this)(id);
  if (className === undefined) {
    throw 'You must define the className of ' + id;
  }
  return className;
}

function getScopeByID(id) {
  const { scope } = getConfigByID.bind(this)(id);
  if (scope !== undefined && scope !== 'singleton' && scope !== 'prototype') {
    throw scope + ' is not a valid scope';
  }
  return scope || 'prototype';
}

function getMethodsByID(id) {
  const configObject = getConfigByID.bind(this)(id);
  return Object.keys(configObject).filter(method => method !== 'className' && method !== 'scope')
}

function getListOfIDs() {
  const config = getConfig.bind(this)();
  return Object.keys(config);
}

function initializeModules() {
  const modules = {};
  getListOfIDs.bind(this)().forEach(id => {
    const object = getConfigByID.bind(this)(id);
    const className = getClassNameByID.bind(this)(id);
    const methods = getMethodsByID.bind(this)(id);
    modules[className] = requireModuleByClassName.bind(this)(className);
    methods.forEach(method => {
      object[method]
        .filter(param => param.className)
        .map(param => param.className)
        .forEach(className => {
          modules[className] = requireModuleByClassName.bind(this)(className);
        });
    });
  });
  this.modules = modules;
}

function setBaseDir(basedir) {
  this.basedir = basedir || process.cwd();
}

function getBaseDir() {
  return this.basedir;
}

function setConfig(config) {
  switch (typeof config) {
    case 'string':
      this.config = require(path.join(this.basedir, config)).iocca;
      break;
    case 'object':
      this.config = config;
      break;
    default:
      throw 'Your config input is not valid';
  }
}

function getConfig() {
  return this.config;
}

function getModules() {
  return this.modules;
}

function getParamsByObjectNameAndMethodName(objectName, methodName) {
  return getConfig.bind(this)()[objectName][methodName].map(param => {
    if (param.className) {
      return new (getModules.bind(this)()[param.className])
    }
    if (param.ref) {
      return this.create(param.ref);
    }
    return param;
  });
}

function createObjectByID(id) {
  const className = getClassNameByID.bind(this)(id);
  const TypeObject = getModuleByClassName.bind(this)(className);
  let params = [];
  if (getConfig.bind(this)()[id].constructorArgs) {
    params = getParamsByObjectNameAndMethodName.bind(this)(id, 'constructorArgs');
  }
  const scope = getScopeByID.bind(this)(id);
  switch (scope) {
    case 'singleton':
      if (getSingletonByID.bind(this)(id) === undefined) {
        addSingleton.bind(this)(id, new TypeObject(...params));
      }
      return getSingletonByID.bind(this)(id);
    case 'prototype':
      return new TypeObject(...params);
    default:
      throw 'This scope doesn\'t exists';
  }
}

function getModuleByClassName(className) {
  return getModules.bind(this)()[className];
}

class Iocca {

  constructor(config = 'package.json', basedir) {
    setBaseDir.bind(this)(basedir);
    setConfig.bind(this)(config);
    initializeSingletons.bind(this)();
    initializeModules.bind(this)();
  }

  create(id) {
    const object = createObjectByID.bind(this)(id);

    const configObject = getConfigByID.bind(this)(id);

    // Execute the set methods
    Object.keys(configObject)
      .filter(method => method !== 'className' && method !== 'constructorArgs' && method !== 'scope')
      .forEach(method => {
        const params = getParamsByObjectNameAndMethodName.bind(this)(id, method);
        object[method](...params);
      });

    return object;
  }

}


module.exports = (config, basedir) => new Iocca(config, basedir);
