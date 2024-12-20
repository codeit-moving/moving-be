const parseBooleanString = (value: string): boolean | undefined => {
  if (!value) {
    return undefined;
  }
  const parsedValue = value.toLowerCase();

  switch (parsedValue) {
    case "true":
      return true;
    case "false":
      return false;
    default:
      return false;
  }
};

export default parseBooleanString;
