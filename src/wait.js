export default t =>
  t > 0 ? new Promise(res => setTimeout(res, t)) : Promise.resolve(true);
