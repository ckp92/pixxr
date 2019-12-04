module.exports = dataArr => {
  return dataArr.reduce((total, current) => {
    total[current.id] = current;
    return total;
  }, {});
};
