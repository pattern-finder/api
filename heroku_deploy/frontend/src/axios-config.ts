import axios from 'axios';

const Axios = axios.create({
  baseURL: `${
    process.env.API_EXTERNAL_HOST
      ? process.env.API_EXTERNAL_HOST
      : `https://api.picspy.vagahbond.com`
  }${
    process.env.API_EXTERNAL_PORT
      ? `:${process.env.API_EXTERNAL_PORT}`
      : ''
  }`,
});

export default Axios;
