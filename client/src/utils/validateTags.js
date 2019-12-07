import alphanumericTest from "./alphanumericTest";

export default tags => {
  const tagsArray = tags.split(",").map(tag => tag.trim());

  const tooLongTags = tagsArray.filter(tag => tag.length > 250);

  const nonAlphanumericTags = tagsArray.filter(
    tag => alphanumericTest(tag) === false
  );

  if (tooLongTags.length) {
    return `Max tag length: 250 chars. Invalid tags: ${tooLongTags}`;
  }

  if (nonAlphanumericTags.length) {
    return `Invalid tags: ${nonAlphanumericTags}`;
  }
};
