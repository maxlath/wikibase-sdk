import { isEntityId, isEntityPageTitle, isPropertyId, isRevisionId } from './helpers.js'

function validate<T> (name: string, testFn: (value: unknown) => value is T) {
  return function (value: unknown): value is T {
    if (!testFn(value)) throw new Error(`invalid ${name}: ${value}`)
    return true
  }
}

export const entityId = validate('entity id', isEntityId)
export const propertyId = validate('property id', isPropertyId)
export const entityPageTitle = validate('entity page title', isEntityPageTitle)
export const revisionId = validate('revision id', isRevisionId)
