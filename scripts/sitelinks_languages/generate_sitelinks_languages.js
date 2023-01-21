#!/usr/bin/env node
import { uniq } from 'lodash-es'
import { requireJson } from '../../tests/lib/utils.js'

const monolingualProjects = [
  'commonswiki',
  'mediawikiwiki',
  'metawiki',
  'specieswiki',
  'wikidatawiki',
  'wikimaniawiki',
]

const isntMonolingualProject = site => !monolingualProjects.includes(site)

const languagesCodes = requireJson(import.meta.url, './sites.json')
  .filter(isntMonolingualProject)
  .map(site => site.split(/wik(i|t)/)[0])

const stringifiedArray = JSON.stringify(uniq(languagesCodes), null, 2)
  // Prevent linting errors
  .replace(/"/g, '\'')

console.log(stringifiedArray)
