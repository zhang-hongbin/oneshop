/*
 异步请求，使用fetch API.

 IE下使用polyfill
 */
import 'whatwg-fetch';
import jqueryParam from 'jquery-param';
import {Modal} from 'antd';

export default class Ajax {

    /*
     注意：参数通过options.params传递，例如Ajax.get(url, {params: {id:9527}})
     */
    static get(url, options = {}) {
        if (!url) {
            url = '/';
        }
        if (!options) {
            options = {};
        }
        options.method = 'GET';

        if (typeof options.params === 'object') {
            if (url.indexOf('?') < 0) {
                url += `?${jqueryParam(options.params)}`;
            } else {
                url += `&${jqueryParam(options.params)}`;
            }
            delete options.params;
        }

        return Ajax.request(url, options);
    }

    /*
     注意：参数通过options.body传递，例如Ajax.post(url, {body: {id:9527}})
     */
    static post(url, options = {}) {
        if (!url) {
            url = '/';
        }
        if (!options) {
            options = {};
        }
        options.method = 'POST';

        options = Object.assign({
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }, options);

        if (options.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
            options.body = Object.keys(options.body).map(key => {
                return key + '=' + options.body[key];
            })
            options.body = options.body.join("&");
        }

        return Ajax.request(url, options);
    }

    static postJSON(url, options = {}) {
        options.headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }

        options.body = JSON.stringify(options.body);

        return this.post(url, options);
    }

    /*
     注意：参数通过options.body传递，例如Ajax.post(url, {body: {id:9527}})
     */
    static postForm(url, options = {}) {
        if (!url) {
            url = '/';
        }
        if (!options) {
            options = {};
        }
        options.method = 'POST';
        let formData = new FormData();

        Object.keys(options.body).forEach(key => {
            formData.append(key, options.body[key])
        })

        options.body = formData;

        return Ajax.request(url, options);
    }

    static request(url, options) {
        if (!url) {
            url = '/';
        }
        if (!options) {
            options = {};
        }

        options = Object.assign({
            credentials: 'include', // 要这样设置才能带上cookie
        }, options);

        return fetch(url, options).then(res => {
            if (res.status < 200 || res.status >= 300) {
                Modal.warning({title: '错误', content: '服务器异常，请稍后再试或反馈给我们!'})
                var error = new Error(res.statusText)
                error.response = res;
                throw error;
            }
            return res.json();
        }).then(json => {
            if (json.responseCode === 10212 && json.status === false) {
                const cookie = document.cookie;
                console.log(cookie);
                Modal.info({
                    title: '未登录',
                    content: '你的登录已失效，点击"知道了"前往登录页面',
                    onOk() {
                        location.href = `/kaweb/login?redirectUrl=${location.href}`;
                    },
                });
                return null;
            } else {
                return json;
            }
        });
    }

}