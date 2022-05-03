module.exports = {
  objLenght: obj => Object.keys(obj).length,

  parseQuery: query => Object.fromEntries(new URLSearchParams(query))
}
