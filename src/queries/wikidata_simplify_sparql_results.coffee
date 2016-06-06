module.exports = (input)->
  if typeof input is 'string'
    input = JSON.parse input

  { vars } = input.head
  results = input.results.bindings
  if vars.length is 1
    varName = vars[0]
    return results.map (result)-> parseValue result[varName]

  else
    [ varsWithLabel, varsWithout ] = identifyVars vars

    return results
    .map (result)->
      simpifiedResult = {}

      for varName in varsWithLabel
        simpifiedResult[varName] =
          value: parseValue result[varName]
          label: result["#{varName}Label"].value

      for varName in varsWithout
        simpifiedResult[varName] = parseValue result[varName]

      return simpifiedResult


parseValue = (valueOjb)->
  switch valueOjb.type
    when 'uri' then return parseUri valueOjb.value
    else valueOjb.value

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
