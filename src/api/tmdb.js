import axios from "axios";

export default axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Accept: "application/json"
  },
  params: {
    api_key: '14ef3216dcb9a693d84d4554b570985b'
  }
})