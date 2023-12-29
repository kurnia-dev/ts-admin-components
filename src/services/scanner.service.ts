import axios from 'axios';

// const user = JSON.parse(localStorage.getItem('user')!);
const api = ({ headers = {}, params = {}, signal = undefined } = {}) => {
  const instance = axios.create({
    baseURL: 'https://localhost:9001',
    headers: {
      // Authorization: `Bearer ${user.token}`,
      ...headers,
    },
    params,
    signal: signal,
  });
  return instance;
};

const connectDevice = () => {
  return api().get('/connect');
};

const connect = () => {
  return api().get('/connect');
};

const scan = (controlller: any, serialNumber: string, version: string) => {
  return api({ signal: controlller, params: { sn: serialNumber } }).get(
    `/${version}/scan`
  );
};

const scanQr = (controlller: any, serialNumber: string) => {
  return api({ signal: controlller, params: { sn: serialNumber } }).get(
    '/v1/qrscan'
  );
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
  connectDevice,
  connect,
  scan,
  scanQr,
  connectHandheld,
  scanHandheld,
  // bulkScan,
  stopScan,
};

export default ScanAPIs;
