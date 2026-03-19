/**
 * Pause Manager Utility
 *
 * Purpose:
 * Centralize pause / resume logic for UI controllers
 * that may be affected by multiple independent pause
 * conditions.
 *
 * This utility acts as a state coordinator, not a controller.
 *
 * Key characteristics:
 * - Instance-based (no global state)
 * - Named pause reasons
 * - Deterministic resolution
 * - No DOM or animation coupling
 *
 * Typical usage:
 *
 *   const pause = createPauseManager();
 *
 *   pause.add('viewport');
 *   pause.remove('viewport');
 *
 *   if (pause.isPaused()) { ... }
 */

/* ======================================================
 * FACTORY
 * ====================================================== */

function createPauseManager() {
  /**
   * Active pause reasons.
   *
   * Using a Set guarantees uniqueness and
   * makes add/remove operations deterministic.
   */
  const reasons = new Set();

  return {
    /**
     * Add a pause reason.
     *
     * @param {string} reason
     */
    add(reason) {
      if (!reason) return;
      reasons.add(reason);
    },

    /**
     * Remove a pause reason.
     *
     * @param {string} reason
     */
    remove(reason) {
      reasons.delete(reason);
    },

    /**
     * Clear all pause reasons.
     *
     * Useful for teardown or hard resets.
     */
    clear() {
      reasons.clear();
    },

    /**
     * Determine whether playback should be paused.
     *
     * @returns {boolean}
     */
    isPaused() {
      return reasons.size > 0;
    },

    /**
     * Optional debug helper.
     *
     * @returns {string[]}
     */
    list() {
      return Array.from(reasons);
    },
  };
}

/* ======================================================
 * EXPORTS
 * ====================================================== */

export {
  createPauseManager,
};
