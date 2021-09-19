import axios from 'axios';

const Axios = axios.create({
  baseURL: `${
    process.env.REACT_APP_API_EXTERNAL_HOST
      ? process.env.REACT_APP_API_EXTERNAL_HOST
      : `https://api.picspy.vagahbond.com`
  }${
    process.env.REACT_APP_API_EXTERNAL_PORT
      ? `:${process.env.REACT_APP_API_EXTERNAL_PORT}`
      : ''
  }`,
});

export default Axios;
