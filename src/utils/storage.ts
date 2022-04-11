export const setToLS = (key, value) => {
  typeof window !== "undefined" &&
    window.localStorage.setItem(key, JSON.stringify(value));
};

export const getFromLS = (key) => {
  const value =
    typeof window !== "undefined" ? window.localStorage.getItem(key) : null;

  if (value) {
    return JSON.parse(value);
  }
  return null;
};
