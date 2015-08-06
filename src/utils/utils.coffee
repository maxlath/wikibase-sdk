module.exports =
  # languages have to be 2-letters language codes
  shortLang: (language)-> language[0..2]

  # a polymorphism helper: accept either a string or an array and return an array
  forceArray: (array)->
    if typeof array is 'string' then array = [array]
    return array or []
