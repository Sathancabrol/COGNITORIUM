/** Evidence primitives for the WATCHTOWER investigation graph. */

export const EVIDENCE_TYPES = Object.freeze(['FACT', 'INFERENCE', 'HYPOTHESIS', 'UNKNOWN']);

export function createObservation({ entityId, claim, type = 'UNKNOWN', sourceId = null, sourceUrl = null, observedAt = new Date().toISOString(), confidence = null, method = 'manual', humanValidated = false, details = null }) {
  if (!entityId || !claim) throw new Error('entityId and claim are required');
  if (!EVIDENCE_TYPES.includes(type)) throw new Error(`Unsupported evidence type: ${type}`);
  return Object.freeze({
    id: `obs_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    entityId,
    claim,
    type,
    sourceId,
    sourceUrl,
    observedAt,
    confidence,
    method,
    humanValidated: Boolean(humanValidated),
    details,
  });
}

export function canPromoteToFact(observation) {
  return observation?.type === 'INFERENCE' && observation.humanValidated;
}
