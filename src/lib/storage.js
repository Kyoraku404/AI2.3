// localStorage keys
const KEYS = {
  SESSIONS: 'ecobac_sessions',
  ACTIVE_SESSION: 'ecobac_active_session',
};

/**
 * Load all saved chat sessions from localStorage.
 * @returns {Array} Array of session objects
 */
export function loadSessions() {
  try {
    const raw = localStorage.getItem(KEYS.SESSIONS);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

/**
 * Save all sessions to localStorage.
 * @param {Array} sessions
 */
export function saveSessions(sessions) {
  try {
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (_) {
    console.warn('localStorage write failed.');
  }
}

/**
 * Save or update a single session.
 * @param {Object} session - { id, title, messages, mode, createdAt, updatedAt }
 */
export function upsertSession(session) {
  const sessions = loadSessions();
  const idx = sessions.findIndex(s => s.id === session.id);
  if (idx >= 0) {
    sessions[idx] = { ...sessions[idx], ...session };
  } else {
    sessions.unshift(session);
  }
  saveSessions(sessions);
}

/**
 * Delete a session by ID.
 * @param {string} id
 */
export function deleteSession(id) {
  const sessions = loadSessions().filter(s => s.id !== id);
  saveSessions(sessions);
}

/**
 * Generate a short, readable session title from the first user prompt.
 * @param {string} prompt
 * @returns {string}
 */
export function generateTitle(prompt) {
  const cleaned = prompt.replace(/[\n\r]+/g, ' ').trim();
  if (cleaned.length <= 50) return cleaned;
  return cleaned.substring(0, 47) + '…';
}

/**
 * Generate a unique session ID.
 * @returns {string}
 */
export function generateId() {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Create a new empty session object.
 * @returns {Object}
 */
export function createSession() {
  return {
    id: generateId(),
    title: 'Nouvelle conversation',
    messages: [],
    mode: 'normal',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
