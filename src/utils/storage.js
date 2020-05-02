
export function getItem(name, defaultValue) {
  const result = localStorage.getItem(name);
  if (result) {
    return JSON.parse(result);
  }
  return defaultValue;
}

export function setItem(name, value) {
  localStorage.setItem(name, JSON.stringify(value));
}

export function removeItem(name, value) {
  localStorage.removeItem(name);
}

export function getSessionItem(name, defaultValue) {
  const result = sessionStorage.getItem(name);
  if (result) {
    return JSON.parse(result);
  }
  return defaultValue;
}

export function setSessionItem(name, value) {
  sessionStorage.setItem(name, JSON.stringify(value));
}

export function removeSessionItem(name, value) {
  sessionStorage.removeItem(name);
}
