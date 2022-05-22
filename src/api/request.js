/**
 * request.js
 * 通过promise对axios做二次封装，针对用户端参数，做灵活配置
 */
// import { Message,Loading } from 'element-plus';
import instance from './interceptor'

/**
 * 核心函数，可通过它处理一切请求数据，并做横向扩展
 * @param {url} 请求地址
 * @param {params} 请求参数
 * @param {options} 请求配置，针对当前本次请求；
 * @param loading 是否显示loading
 * @param mock 本次是否请求mock而非线上
 * @param error 本次是否显示错误
 */
function request(url,params,options={loading:true,mock:false,error:true},method){
    let loadingInstance;
	let data = {}
	// get请求使用params字段
	if(method =='get')data = {params}
	// post请求使用data字段
	if(method =='post' || method == 'put')data = {data:params}
	// 通过mock平台可对局部接口进行mock设置
	if(options.mock)url='http://www.mock.com/mock/xxxx/api';
    return instance({
            url,
            method,
            ...data
        })
}
// 封装GET请求
function get(url,params,options){
    return request(url,params,options,'get')
}
// 封装POST请求
function post(url,params,options){
    return request(url,params,options,'post')
}
// 封装PUT请求
function put(url,params,options){
    return request(url,params,options,'put')
}

// 封装Delete请求
function del(url,params,options){
    return request(url,params,options,'delete')
}
export default {
    get,post,put,del
}