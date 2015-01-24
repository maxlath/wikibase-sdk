module.exports =
  stringify: (queryObj)->
    qstring = ''
    for k,v of queryObj
      if v? then qstring += "&#{k}=#{v}"

    qstring = qstring[1..-1]

    # encodeURI should be accessible in a browser environment
    # otherwise if neither node.js querystring nor encodeURI
    # are accessible, just return the string
    if encodeURI? then return encodeURI(qstring)
    return qstring