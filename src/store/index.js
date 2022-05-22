const data = {
	msg: '测试',
	auth: {
		isAdmin: false
	}
}

function getter(param) {
	return data[param]
}

function setter(key, param) {
	console.log(key,  ' ', data)
	return data[key] = param
}

export const store = {
	'getter': getter,
	'setter': setter
};
