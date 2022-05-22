import request from './request'

// auth
export function login({username, password}){
	return request.post('/auth/login',{username, password})
}

export function register({username, password, secPassword}){
	return request.post('/auth/register',{username, password, secPassword})
}

// graph
// export function get	
export function graphInstances(){
	return request.get('/graph/instances')
}
export function graphDatabases(id){
	return request.get('/graph/databases/'+id)
}
export function graphDatasets(id){
	return request.get('/graph/datasets/'+id)
}
export function graphColumns(id){
	return request.get('/graph/columns/'+id)
}
export function graphGetCategory(){
	return request.get('/graph/category')
}

// database
// export function get	
export function databasePage({criteria, current, size}){
	return request.get('/database', {criteria, current, size})
}

export function databaseByInstanceId(id){
	return request.get('/database/instance/'+id)
}

export function databaseSave(params){
	return request.post('/database', params)
}

export function databaseDelete(id){
	return request.del('/database/'+id)
}

export function databaseUpdate(params){
	return request.put('/database', params)
}

// instance
// export function get	
export function owninstance(){
	return request.get('/instance/own')
}

export function instancePullData(id){
	return request.get('/instance/all/'+id)
}

export function instancePage({criteria, current, size}){
	return request.get('/instance', {criteria, current, size})
}

export function instanceSave(params){
	return request.post('/instance', params)
}

export function instanceDelete(id){
	return request.del('/instance/'+id)
}


export function instanceUpdate(params){
	return request.put('/instance', params)
}

// user
export function fetchOwnDetail(){
	return request.get("/user/own")
}

export function userPage({criteria, current, size}){
	return request.get('/user', {criteria, current, size})
}
export function userSave(params){
	return request.post('/user', params)
}

export function userUpdate(params){
	return request.put('/user', params)
}

// dataset
export function fetchDatasetsWithDatabaseId(id){
	return request.get("/dataset/database/" + id)
}

export function fetchVDatasets(){
	return request.get("/dataset/vdatasets")
}

// column
export function fetchDataColumnWithDatasetId(id){
	return request.get("/column/dataset/" + id)
}



// lineage
export function parse(sql){
	return request.post('/sql/parse', {sql})
}

export function lineage({uuid, tableName, instanceId}){
	return request.post('/sql/lineage', {uuid, tableName, instanceId})
}

export function fetchGraphNodes(nodeId, nodeType, dirType, edgeType){
	return request.get('/sql/nodes?uuid='+nodeId+'&nodeType='+nodeType+'&dirType='+dirType+'&edgeType='+edgeType)
}