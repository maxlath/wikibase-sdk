#!/usr/bin/env ts-node
import { sites } from '../../src/helpers/sitelinks_sites.js'
import { specialSites } from '../../src/helpers/special_sites.js'
import { uniq } from '../../src/utils/utils.js'

const monolingualProjects = Object.keys(specialSites)

const languagesCodes = sites
  .filter(site => !monolingualProjects.includes(site))
  .map(site => site.split(/wik(i|t)/)[0])

const stringifiedArray = JSON.stringify(uniq(languagesCodes), null, 2)
  // Prevent linting errors
  .replace(/"/g, '\'')
  .replace(/'\n/, '\',\n')

console.log(`${stringifiedArray} as const`)
