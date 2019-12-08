export default dateString => {
  // convert date str to date
  const date = new Date(dateString);

  // calculate seconds since that date
  const seconds = Math.floor((new Date() - date) / 1000);

  // divide by seconds in year
  let interval = Math.floor(seconds / 31536000);

  // decide plural
  const plural = interval => (interval > 1 ? "s" : "");

  // year
  if (interval >= 1) {
    return `${interval} year${plural(interval)} ago`;
  }

  // month
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return `${interval} month${plural(interval)} ago`;
  }

  // day
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return `${interval} day${plural(interval)} ago`;
  }

  // hour
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return `${interval} hour${plural(interval)} ago`;
  }

  // minute
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return `${interval} minute${plural(interval)} ago`;
  }

  // second
  return "Just Now";
};
