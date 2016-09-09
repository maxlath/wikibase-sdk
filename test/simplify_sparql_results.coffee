should = require 'should'

helpers = require '../src/helpers/helpers'
simplify = require '../src/queries/simplify_sparql_results.coffee'

singleVarData = require './data/single_var_sparql_results.json'
multiVarsData = require './data/multi_vars_sparql_results.json'
noDatatypeData = require './data/no_datatype_sparql_results.json'

describe 'wikidata simplify SPARQL results', ->
  describe 'common', ->
    it 'should return a plain object', (done)->
      simplify(singleVarData).should.be.an.Array()
      simplify(multiVarsData).should.be.an.Array()
      done()

    it 'should parse the input if passed a JSON string', (done)->
      json = JSON.stringify(singleVarData)
      simplify(json).should.be.an.Array()
      json2 = JSON.stringify(multiVarsData)
      simplify(json2).should.be.an.Array()
      done()

  describe 'single var', ->
    it 'should return an array of results values, filtering out blank nodes', (done)->
      output = simplify singleVarData
      output[0].should.equal 'Q112983'
      output.forEach (result)-> helpers.isWikidataId(result).should.be.true()
      done()

  describe 'multi vars', ->
    it 'should return an array of results objects', (done)->
      output = simplify multiVarsData
      output[0].should.be.an.Object()
      output[0].entity.value.should.equal 'Q3731207'
      output[0].entity.label.should.equal 'Ercole Patti'
      output[0].year.should.equal 1903
      done()

    it 'should not throw when the datatype is missing', (done)->
      output = simplify noDatatypeData
      output[0].year.should.equal '1937'
      done()
