<template>
	<el-upload 
	class="upload-demo" 
	ref="upload" 
	action="/api/file/upload"
	:on-preview="handlePreview" 
	:on-remove="handleRemove" 
	:file-list="fileList" 
	:auto-upload="false"
	:multiple="false" 
	:limit="1" 
	:on-success="onsuccess"
	:on-error="onError">
		<template #trigger>
			<el-button size="small" type="primary">选取文件</el-button>
		</template>
		<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
		<template #tip>
			<div class="el-upload__tip">
				只能上传 jpg/png 文件，且不超过 500kb
			</div>
		</template>
	</el-upload>
</template>

<script>
	const onfile = 'confile'

	export default {
		name: 'upload',
		data() {
			return {
				fileList: []
			};
		},
		methods: {
			submitUpload() {
				this.$refs.upload.submit();
				this.callbackfile();
			},
			handleRemove(file, fileList) {
				this.fileList = fileList;
				this.callbackfile();
			},
			handlePreview(file) {
				console.log(file);
				this.callbackfile();
			},
			onsuccess(response, file, files){
				this.fileList = files;
				this.fileList[0] = response.data;
				this.callbackfile();
			},
			callbackfile() {
				console.log(this.fileList)
				if(this.fileList.length == 1){
					this.$emit('onfile', this.fileList[0])
				}else{
					this.$emit('onfile', '')
				}
			},
			onError(){
				this.fileList = []
			}
		
		}
	}
</script>

<style>

</style>
