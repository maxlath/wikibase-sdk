#!/usr/bin/env node
const { uniq } = require('lodash')

const monolingualProjects = [
  'commonswiki',
  'mediawikiwiki',
  'metawiki',
  'specieswiki',
  'wikidatawiki',
  'wikimaniawiki'
]

const isntMonolingualProject = site => !monolingualProjects.includes(site)

const languagesCodes = require('./sites.json')
  .filter(isntMonolingualProject)
  .map(site => site.split(/wik(i|t)/)[0])

const stringifiedArray = JSON.stringify(uniq(languagesCodes))
  // Prevent linting errors
  .replace(/"/g, '\'')
  .replace(/,/g, ', ')

console.log(stringifiedArray)
