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
  unless valueObj? then return
  switch valueObj.type
    when 'uri' then parseUri valueObj.value
    # blank nodes will be filtered-out in order to get things simple
    when 'bnode' then null
    else
      switch valueObj.datatype?.replace 'http://www.w3.org/2001/XMLSchema#', ''
        when 'decimal', 'integer', 'float', 'double' then parseFloat valueObj.value
        when 'boolean' then valueObj.value is 'true'
        # return the raw value if the datatype is missing
        else valueObj.value

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
