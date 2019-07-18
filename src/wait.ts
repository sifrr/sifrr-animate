export default (t: number): Promise<boolean> =>
  t > 0 ? new Promise(res => setTimeout(res, t)) : Promise.resolve(true);
