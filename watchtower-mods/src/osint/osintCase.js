/** Minimal serializable investigation state. Designed for local-first storage. */

export function createInvestigation(seed = {}) {
  return {
    schemaVersion: 1,
    id: seed.id || `case_${Date.now()}`,
    title: seed.title || 'Nouvelle enquête',
    createdAt: seed.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    entities: Array.isArray(seed.entities) ? seed.entities : [],
    observations: Array.isArray(seed.observations) ? seed.observations : [],
    relations: Array.isArray(seed.relations) ? seed.relations : [],
    notes: Array.isArray(seed.notes) ? seed.notes : [],
  };
}

export function addEntity(investigation, entity) {
  if (!entity?.id || !entity?.type) throw new Error('Entity id and type are required');
  investigation.entities.push({ ...entity });
  investigation.updatedAt = new Date().toISOString();
  return entity;
}

export function addRelation(investigation, relation) {
  if (!relation?.from || !relation?.to || !relation?.predicate) throw new Error('Relation requires from, to and predicate');
  investigation.relations.push({ ...relation });
  investigation.updatedAt = new Date().toISOString();
  return relation;
}
