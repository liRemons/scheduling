import axios from 'axios';
import qs from 'qs';
import { message } from 'antd';
const service = axios.create({
  baseURL: '/api',
  timeout: 30 * 60 * 1000, //请求超时的时间
});
const arr = [service];
arr.forEach((item) => {
  item.interceptors.request.use(
    (config) => {
      // 如果需要序列化
      if (
        config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
      ) {
        //post请求序列化
        config.data = qs.stringify(config.data);
      }

      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  // response 拦截器,数据返回后进行一些处理
  item.interceptors.response.use(
    (response) => {
      console.log({ response });
      const res = response.data || {};
      if (res.success || res.code === 200) {
        return res || {};
      }
      message.error(res.message || res.msg);
      return {};
      // 返回请求值
    },
    (error) => {
      // 如果接口出错，当然，也可以根据错误的状态码进行错误信息配置，
      // 因为接口中没有返回特定状态码，所以没有配置
      message.error(error.message);
      Promise.reject(error);
    }
  );
});
// request拦截器,在请求之前做一些处理

export default service;
