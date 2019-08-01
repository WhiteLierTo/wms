/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

export function dateFnc(time) {
  var dateee = new Date(time).toJSON()
  var date = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
  return date
}

// 非负数
export function positiveNumber(number) {
  var reg = /^\+?[1-9]\d*$/
  return reg.test(number)
}

// 对象通过key查value
export function getValFnc(obj, k) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return obj[k]
    } else {
      throw Error
    }
  }
}

// 通用字典
export function getDictionary(dictGroup) {
  const dictionary = JSON.parse(localStorage.getItem('dictionary'))
  return dictionary.filter(v => {
    return v.dictGroup === dictGroup
  })
}
// 通用字典文本获取
export function getDictionaryText(code) {
  const dictionary = JSON.parse(localStorage.getItem('dictionary'))
  return dictionary.filter(v => {
    return v.code === code
  })
}
// 通用字典代码获取
export function getDictionaryCode(text) {
  const dictionary = JSON.parse(localStorage.getItem('dictionary'))
  return dictionary.filter(v => {
    return v.text === text
  })
}
