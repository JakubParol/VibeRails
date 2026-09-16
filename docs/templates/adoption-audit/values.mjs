// Internal values checks for the optional read-only adoption audit.

export function createValueChecks(context, values = {}) {
  const { fail } = context;
  const htmlTagNames = new Set(
    "a abbr address area article aside audio b base bdi bdo blockquote body br button canvas caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hr html i iframe img input ins kbd label legend li link main map mark meta meter nav noscript object ol optgroup option output p param picture pre progress q rp rt ruby s samp script search section select slot small source span strong style sub summary sup table tbody td th thead time title tr track u ul var video wbr".split(" "),
  );
  function auditManifestPlaceholders(value, pathParts = []) {
    if (typeof value === "string") {
      if (containsPlaceholder(value) || /\bTODO\b/i.test(value) || /^n\/a$/i.test(value.trim())) {
        fail(`.viberails/adoption.json contains unresolved value at '${pathParts.join(".")}'.`);
      }
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item, index) => auditManifestPlaceholders(item, [...pathParts, String(index)]));
      return;
    }
    if (value && typeof value === "object") {
      for (const [key, item] of Object.entries(value)) {
        auditManifestPlaceholders(item, [...pathParts, key]);
      }
    }
  }

  function isPlaceholder(value) {
    return typeof value === "string" && containsPlaceholder(value);
  }

  function containsPlaceholder(value) {
    if (typeof value !== "string") {
      return false;
    }

    const matches = value.matchAll(/<([^>\n]+)>/g);
    for (const match of matches) {
      if (isPlaceholderToken(match[1])) {
        return true;
      }
    }

    return false;
  }

  function isPlaceholderToken(rawToken) {
    const token = rawToken.trim();
    if (!token || token.startsWith("!--") || token.startsWith("/")) {
      return false;
    }
    if (/^(https?|mailto|ftp|file):/i.test(token)) {
      return false;
    }
    if (/^\S+@\S+\.\S+$/.test(token)) {
      return false;
    }
    if (isTypeParameterToken(token)) {
      return false;
    }

    const tagName = token.split(/\s+/)[0].replace(/\/$/, "").toLowerCase();
    if (htmlTagNames.has(tagName)) {
      return false;
    }

    return true;
  }

  function isTypeParameterToken(token) {
    return token
      .split(",")
      .map((part) => part.trim())
      .every((part) => /^[A-Z]$/.test(part) || /^T[A-Za-z0-9_]*$/.test(part));
  }

  function requireNonPlaceholderString(value, field) {
    if (typeof value !== "string" || value.trim() === "" || isPlaceholder(value)) {
      fail(`.viberails/adoption.json must record a concrete '${field}'.`);
    }
  }

  function requireNullableStringField(parent, field, displayName) {
    if (!parent || !Object.prototype.hasOwnProperty.call(parent, field)) {
      fail(`.viberails/adoption.json must record '${displayName}' as a string or null.`);
      return;
    }

    const value = parent[field];
    if (value !== null && (typeof value !== "string" || value.trim() === "" || isPlaceholder(value))) {
      fail(`.viberails/adoption.json must record '${displayName}' as a concrete string or null.`);
    }
  }

  function requireSanitizedNullableRemote(parent, field, displayName) {
    requireNullableStringField(parent, field, displayName);
    if (!parent || !Object.prototype.hasOwnProperty.call(parent, field)) {
      return;
    }

    const value = parent[field];
    if (value === null) {
      return;
    }
    if (typeof value !== "string" || value.trim() === "" || isPlaceholder(value)) {
      return;
    }
    if (/[?#]/.test(value)) {
      fail(`.viberails/adoption.json must record '${displayName}' without query strings or fragments.`);
    }
    if (/^[a-z][a-z0-9+.-]*:\/\/[^/\s@]+@/i.test(value)) {
      fail(`.viberails/adoption.json must record '${displayName}' without username, password, or token userinfo.`);
    }
  }

  function requireEnum(value, field, allowedValues) {
    if (!allowedValues.includes(value)) {
      fail(`.viberails/adoption.json has invalid '${field}': expected one of ${allowedValues.join(", ")}.`);
    }
  }

  function requireMatchingValue(actual, expected, actualField, expectedField) {
    if (actual !== expected) {
      fail(`.viberails/adoption.json ${actualField} must match ${expectedField}.`);
    }
  }

  function requireArrayEquals(actual, expected, actualField, expectedField) {
    if (!Array.isArray(actual) || !Array.isArray(expected) || actual.length !== expected.length) {
      fail(`.viberails/adoption.json ${actualField} must match ${expectedField}.`);
      return;
    }

    for (const [index, item] of actual.entries()) {
      if (item !== expected[index]) {
        fail(`.viberails/adoption.json ${actualField} must match ${expectedField}.`);
        return;
      }
    }
  }

  function auditStringArray(value, field) {
    if (!Array.isArray(value) || value.length === 0) {
      fail(`.viberails/adoption.json must record ${field} as a non-empty array.`);
      return;
    }

    for (const [index, item] of value.entries()) {
      requireNonPlaceholderString(item, `${field}[${index}]`);
    }
  }

  return { auditManifestPlaceholders, isPlaceholder, containsPlaceholder, isPlaceholderToken, isTypeParameterToken, requireNonPlaceholderString, requireNullableStringField, requireSanitizedNullableRemote, requireEnum, requireMatchingValue, requireArrayEquals, auditStringArray };
}
