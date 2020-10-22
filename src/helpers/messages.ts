import * as data from '../config/messages.json';

const getMessage = <K extends keyof typeof data>(path: K) => {
  return data[path];
};

export default getMessage;
