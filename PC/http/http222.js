import Fly from 'flyio/dist/npm/wx'
const fly = new Fly;
fly.config.baseURL = "http://101.200.35.253:9003"
    //添加请求拦截器
fly.interceptors.request.use((request) => {
    //给所有请求添加自定义header
    let token = uni.getStorageSync('estateToken') || store.state.estateToken;
    token && (request.headers["Authorization"] = token);
    //打印出请求体
    //终止请求
    //var err=new Error("xxx")
    //err.request=request
    //return Promise.reject(new Error(""))

    //可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
    return request;
})

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        console.log(error, "bbbbbbbbbbbbbbbbbbbb");
        //发生网络错误后会走到这里

        if (error.response) {
            // 服务器返回错误码
            switch (error.status) {
                case 401:
                    console.log("401hhhhhhhhhhhhhhhhhhhhhhh");
                    break;
            }
        }
        /*  return Promise.resolve(err) */
    }
)
export default fly