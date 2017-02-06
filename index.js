const path = require('path');

class Iocca {

  constructor(config = 'package.json', basedir) {
    this.basedir = basedir || process.cwd();
    if (typeof config === 'string') {
      this.config = require(path.join(this.basedir, config)).iocca;
    } else if (typeof config === 'object') {
      this.config = config;
    } else {
      throw 'Your configs are not valid';
    }
    this.singletons = {};
    this.modules = this._loadModules();
  }

  _getSingletons() {
    return this.singletons;
  }

  _setSingletonByID(id, object) {
    return this.singletons[id] = object;
  }

  _getSingletonByID(id) {
    return this.singletons[id];
  }

  _loadModules() {
    const modules = {};
    const config = this._getConfig();
    const objects = Object.keys(config);
    const basedir = this._getBasedir();
    for (let i = 0; i < objects.length; i++) {
      const object = config[objects[i]];
      let className = object.className;
      if (!className) {
        throw 'You must define the className of the file';
      } else {
        try {
          modules[className] = require(path.join(basedir, className));
        } catch (e) {
          throw 'It seems that the class ' + className + 'doesn\'t exists';
        }
      }

      const methods = Object.keys(config[objects[i]]).filter(method => method != 'className' && method != 'scope');
      methods.forEach(method => {
        const params = object[method]
          .filter(param => param.className)
          .map(param => param.className)
          .forEach(className => {
            modules[className] = require(path.join(basedir, className));
          });
      });
    }
    return modules;
  }

  _getBasedir() {
    return this.basedir;
  }

  _getConfigfile() {
    return this.configFile;
  }

  _getConfig() {
    return this.config;
  }

  _getModules() {
    return this.modules;
  }

  _getParamsByObjectNameAndMethodName(objectName, methodName) {
    return this._getConfig()[objectName][methodName].map(param => {
      if (param.className) {
        return new (this._getModules()[param.className])
      }
      if (param.ref) {
        return this.create(param.ref);
      }
      return param;
    });
  }

  _createObjectByScope(id, TypeObject, params, scope) {
    if (scope === undefined || scope === 'prototype') {
      return new TypeObject(...params);
    } else if (scope === 'singleton') {
      const singleton = this._getSingletonByID(id);
      if (singleton === undefined) {
        const singleton = new TypeObject(...params);
        this._setSingletonByID(id, singleton);
        return this._getSingletonByID(id);
      }
      return singleton;
    } else {
      throw 'This scope doesn\'t exists';
    }
  }

  create(id) {
    const metaObject = this._getConfig()[id];
    const scope = metaObject.scope;
    if (!metaObject) {
      throw 'The object ' + id + ' does not exists';
    }
    const TypeObject = this._getModules()[metaObject.className];

    let params = [];
    if (this._getConfig()[id].constructorArgs) {
      params = this._getParamsByObjectNameAndMethodName(id, 'constructorArgs');
    }

    // Create the object
    const object = this._createObjectByScope(id, TypeObject, params, scope);

    // Execute the set methods
    Object.keys(metaObject)
      .filter(method => method !== 'className' && method !== 'constructorArgs' && method !== 'scope')
      .forEach(method => {
        const params = this._getParamsByObjectNameAndMethodName(id, method);
        object[method](...params);
      });

    return object;
  }

}

module.exports = (config, basedir) => new Iocca(config, basedir);
