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
    this.modules = this._loadModules();
  }

  _loadModules() {
    const modules = {};
    const config = this._getConfig();
    const objects = Object.keys(config);
    const basedir = this._getBasedir();
    for (let i = 0; i < objects.length; i++) {
      const object = config[objects[i]];
      let type = object.type;
      if (!type) {
        throw 'You must define the type of the file';
      } else {
        try {
          modules[type] = require(path.join(basedir, type));
        } catch (e) {
          throw 'It seems that the type ' + type + 'doesn\'t exists';
        }
      }

      const methods = Object.keys(config[objects[i]]).filter(method => method != 'type');
      methods.forEach(method => {
        const params = object[method]
          .filter(param => param.type)
          .map(param => param.type)
          .forEach(type => {
            modules[type] = require(path.join(basedir, type));
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
      if (param.type) {
        return new (this._getModules()[param.type])
      }
      if (param.ref) {
        return this.create(param.ref);
      }
      return param;
    });
  }

  create(objectName) {
    const metaObject = this._getConfig()[objectName];
    if (!metaObject) {
      throw 'The object ' + objectName + ' does not exists';
    }
    const TypeObject = this._getModules()[metaObject.type];

    let params = [];
    if (this._getConfig()[objectName].args) {
      params = this._getParamsByObjectNameAndMethodName(objectName, 'args');
    }

    // Create the object
    const object = new TypeObject(...params);

    // Execute the set methods
    Object.keys(metaObject)
      .filter(method => method !== 'type' && method !== 'args')
      .forEach(method => {
        const params = this._getParamsByObjectNameAndMethodName(objectName, method);
        object[method](...params);
      });

    return object;
  }

}

module.exports = {
  Iocca: new Iocca,
  config: (config, basedir) => new Iocca(config, basedir),
};
