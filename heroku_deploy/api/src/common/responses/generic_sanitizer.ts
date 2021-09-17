// eslint-disable-next-line @typescript-eslint/ban-types
export function sanitize<T extends Object>(obj: any, template: T): T {
  return Object.keys(obj)
    .filter((key) => Object.keys(template).includes(key))
    .reduce((prev, next) => {
      prev[next] = obj[next];
      return prev;
    }, {}) as T;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function faster_sanitize<T extends Object>(obj: any, template: T): T {
  for (const k in Object.keys(obj)) {
    if (!Object.keys(template).includes(k)) {
      delete obj[k];
    }
  }

  return obj;
}
