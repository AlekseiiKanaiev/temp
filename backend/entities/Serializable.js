const { fromJS, Map: ImmMap, Collection: ImmCollection } = require('immutable')

class Serializable {
  constructor (map) {
    this._propsMapping = ImmMap(map)
  }

  static transfereProperties (src, dst, map, context = null) {
    if (src instanceof Serializable) {
      src = src.getValues()
    }
    if (dst instanceof Serializable) {
      dst = dst.getValues()
    }
    const wrappedSrc = fromJS(src)
    const wrappedDst = fromJS(dst).asMutable()

    for (const [srcKey, dstKey] of map.entries()) {
      const srcPath = Array.isArray(srcKey) ? srcKey[0].split('.') : srcKey.split('.')
      const dstPath = Array.isArray(dstKey) ? dstKey[0].split('.') : dstKey.split('.')
      let srcData

      if (wrappedSrc.hasIn(srcPath)) {
        srcData = wrappedSrc.getIn(srcPath)
        if (srcData instanceof ImmCollection) {
          srcData = srcData.toJS()
        }
        if (typeof (dstKey[1]) === 'function') {
          try {
            srcData = dstKey[1].call(context, srcData)
          } catch (err) {}
        }
        wrappedDst.setIn(dstPath, srcData)
      }
    }
    return wrappedDst.toJS()
  }

  static flatCopy (obj) {
    return Object.keys(obj).reduce((res, key) => {
      if (obj[key] === undefined || obj[key] === null || key.startsWith('_')) {
        return res
      }
      if (obj[key].constructor.name === 'Object') {
        res[key] = Serializable.flatCopy(obj[key])
      } else {
        res[key] = obj[key]
      }
      return res
    }, {})
  }

  setProperties (data) {
    const patch = Serializable.transfereProperties(data, {}, this._propsMapping, this)
    Object.assign(this, patch)
    return this
  }

  getProperties () {
    return Serializable.transfereProperties(this, {}, this._propsMapping.flip(), this)
  }

  setValues (data) {
    const converted = Serializable.transfereProperties(data, {}, this._propsMapping.flip(), this)
    return this.setProperties(converted)
  }

  getValues () {
    return Serializable.flatCopy(this)
  }

  clone (factory = this.constructor) {
    const data = this.getProperties()
    const mapping = this._propsMapping.toArray()
    return factory.newInstance == null
      ? factory.newInstance(data)
      : new factory(mapping).setProperties(data)
  }

  toString () {
    return JSON.stringify(this.getProperties())
  }
}

module.exports = Serializable
