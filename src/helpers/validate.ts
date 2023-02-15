import { isEntityId, isEntityPageTitle, isPropertyId, isRevisionId } from './helpers.js'

/** Ensure both via TypeScript and at runtime that the input value is of the expected type. Throws error when it is not */
function validate<T extends string> (name: string, testFn: (value: string) => value is T) {
  return function (value: T): void {
    if (!testFn(value)) throw new Error(`invalid ${name}: ${value}`)
  }
}

export const entityId = validate('entity id', isEntityId)
export const propertyId = validate('property id', isPropertyId)
export const entityPageTitle = validate('entity page title', isEntityPageTitle)
export const revisionId = validate('revision id', isRevisionId)
