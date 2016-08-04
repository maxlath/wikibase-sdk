module.exports = (input)->
  if typeof input is 'string'
    input = JSON.parse input

  { vars } = input.head
  results = input.results.bindings
  if vars.length is 1
    varName = vars[0]
    return results
    .map (result)-> parseValue result[varName]
    # filtering-out bnodes
    .filter (result)-> result?

  else
    [ varsWithLabel, varsWithout ] = identifyVars vars

    return results
    .map (result)->
      simpifiedResult = {}

      for varName in varsWithLabel
        simpifiedResult[varName] =
          # not filtering out bnodes as other variables can be meaningful
          value: parseValue result[varName]
          label: result["#{varName}Label"].value

      for varName in varsWithout
        simpifiedResult[varName] = parseValue result[varName]

      return simpifiedResult


parseValue = (valueObj)->
  switch valueObj.type
    when 'uri' then return parseUri valueObj.value
    # blank nodes will be filtered-out in order to get things simple
    when 'bnode' then return null
    else
      switch valueObj.datatype
        when 'http://www.w3.org/2001/XMLSchema#decimal'
           , 'http://www.w3.org/2001/XMLSchema#integer'
           , 'http://www.w3.org/2001/XMLSchema#float'
           , 'http://www.w3.org/2001/XMLSchema#double'
          return 1*valueObj.value
        when 'http://www.w3.org/2001/XMLSchema#boolean'
          return valueObj.value == "true"
        else return valueObj.value

parseUri = (uri)-> uri.replace 'http://www.wikidata.org/entity/', ''
isLabelKey = (key)-> /^\w+Label$/.test key

identifyVars = (vars)->
  varsWithLabel = []
  varsWithoutLabel = []

  for varName in vars
    if "#{varName}Label" in vars
      varsWithLabel.push varName
    else if not /^\w+Label$/.test varName
      varsWithoutLabel.push varName

    # letting aside "#{varName}Label" vars
    # as they will simply be embedded in varName results

  return [ varsWithLabel, varsWithoutLabel ]
