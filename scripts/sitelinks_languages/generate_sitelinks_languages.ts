#!/usr/bin/env ts-node
import { uniq } from 'lodash-es'
import { sites } from '../../src/helpers/sitelinks_sites.js'

const monolingualProjects = [
  'commonswiki',
  'mediawikiwiki',
  'metawiki',
  'specieswiki',
  'wikidatawiki',
  'wikimaniawiki',
]

const isntMonolingualProject = site => !monolingualProjects.includes(site)

const languagesCodes = sites
  .filter(isntMonolingualProject)
  .map(site => site.split(/wik(i|t)/)[0])

const stringifiedArray = JSON.stringify(uniq(languagesCodes), null, 2)
  // Prevent linting errors
  .replace(/"/g, '\'')
  .replace(/'\n/, '\',\n')

console.log(`${stringifiedArray} as const`)
