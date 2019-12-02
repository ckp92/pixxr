export default str => {
  const alphaNumeric = /^[a-zA-Z0-9]*$/;
  return alphaNumeric.test(str);
};
