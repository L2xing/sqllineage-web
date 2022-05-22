// const music = {
// 	id: '',
// 	address: '',
// 	name: '',
// 	ownerName: '',
// 	type: '',
// 	description: ''
// }

// 音乐缓存
const key = "music_local";

const Adminkey = "isAdmin"

const token = "KTV_TOKEN"

/**
 * 存储
 * @param {Object} music 音乐
 */
export function store(music) {
	let store_value = window.localStorage.getItem(key);
	if(store_value){
		var array = JSON.parse(store_value);
		for(let i=0;i<array.length;i++){
			if(array[i].id == music.id){
				alert("该歌曲已经存储过了")
				return true;
			}
		}
		array.push(music);
		let str = JSON.stringify(array);
		window.localStorage.setItem(key,str)
		return true;
	}
	let musics = [music]
	let str = JSON.stringify(musics);
	window.localStorage.setItem(key,str);
	return true;
	
}

export function getMusic(){
	let store_value = window.localStorage.getItem(key);
	if(store_value){
		var array = JSON.parse(store_value);
		return array;
	}
}

/**
 * 防止admin身份
 * @param {Object} value
 */
export function putAdmin(value){
	window.localStorage.setItem(Adminkey, value);
}

/**
 * 读取admin身份
 */
export function getAdmin(){
	return window.localStorage.getItem(Adminkey);
}

/**
 * 设置token
 */
export function putToken(value){
	window.localStorage.setItem(token, value);
}

/**
 * 获取token
 */
export function getToken(){
	return window.localStorage.getItem(token);
}

/**
 * 删除token
 */
 export function clearToken(){
	return window.localStorage.removeItem(token);
}