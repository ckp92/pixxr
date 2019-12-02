import alphanumericTest from "./alphanumericTest";

export default tags => {
  const invalidTags = tags
    .split(",")
    .map(tag => tag.trim())
    .filter(tag => alphanumericTest(tag) === false);

  if (invalidTags.length) {
    return `These tags are invalid: ${invalidTags}`;
  }
};
