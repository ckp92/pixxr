module.exports = user => {
  if (!user) return null;

  const obj = {};
  for (const key in user) {
    if (key != "hash" && key != "external_id") obj[key] = user[key];
  }

  return obj;
};
