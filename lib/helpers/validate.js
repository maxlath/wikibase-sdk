const helpers = require('./helpers')

const validate = (name, testName) => value => {
  if (!helpers[testName](value)) throw new Error(`invalid ${name}: ${value}`)
}

module.exports = {
  entityId: validate('entity id', 'isEntityId'),
  propertyId: validate('property id', 'isPropertyId'),
  revisionId: validate('revision id', 'isRevisionId')
}
