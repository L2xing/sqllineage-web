export function genderUtils(type, param){
	if(type){
		// param = 0 1 2
		if(param == 0){
			return '未知';
		}
		else if(param == 1){
			return '男';
		}
		else if(param == 2){
			return '女';
		}
	}else{
		if(param == '未知'){
			return 0;
		}
		else if(param == '男'){
			return 1;
		}
		else if(param == '女'){
			return 2;
		}
	}
}

export function isAdminUtils(type, param){
	if(type){
		// param = 0 1 
		if(param == 0){
			return false;
		}
		else if(param == 1){
			return true;
		}
	}else{
		if(param){
			return 1;
		}
		else if(param == false){
			return 0;
		}
	}
}