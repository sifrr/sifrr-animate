module.exports = t => t > 0 ? new Promise(res => setTimeout(res, t)) : true;
