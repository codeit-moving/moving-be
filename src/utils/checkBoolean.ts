const parseBooleanString = (value: string): boolean => {
  return value.toLowerCase() === "true";
};

export default parseBooleanString;
