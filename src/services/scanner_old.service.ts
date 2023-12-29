import axios from 'axios';

// const user = JSON.parse(localStorage.getItem('user')!);
const api = ({ headers = {}, params = {}, signal = undefined } = {}) => {
  const instance = axios.create({
    baseURL: 'https://127.0.0.1:9001',
    headers: {
      // Authorization: `Bearer ${user.token}`,
      ...headers,
    },
    params,
    signal: signal,
  });
  return instance;
};

const connect = () => {
  return api().get('/v1/connect');
};

const scan = (controlller: any) => {
  return api({ signal: controlller }).get('/v1/scan');
};

const scanQr = (controlller: any) => {
  return api({ signal: controlller }).get('/v1/qrscan');
};

const connectHandheld = () => {
  return api().get('/v2/connect');
};

const scanHandheld = (controlller: any) => {
  return api({ signal: controlller }).get('/v2/scan');
};

// const bulkScan = () => {
//   return api().get('/bulkscan');
// };

const stopScan = () => {
  // console.log('stop scan');
  return api().get('/stopscan');
};

const ScanAPIs = {
  connect,
  scan,
  scanQr,
  connectHandheld,
  scanHandheld,
  // bulkScan,
  stopScan,
};

export default ScanAPIs;
