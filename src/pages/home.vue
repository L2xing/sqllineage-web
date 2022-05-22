<template>
	<div id="home">
		<el-container id="main" style="border: 1px solid #eee">
			<el-aside width="200px" style="background-color: rgb(238, 241, 246);top:0;bottom: 0;">
					<div id="logo">
						<el-image style="width: 30px;" :src="require('@/assets/logo.png')" fit="fit">
						</el-image>
						&emsp;
						<h1>SqlLineage</h1>
					</div>
				<el-menu :router="true">
					<el-menu-item index="/home">
						<i class="el-icon-headset"></i>
						<template #title>首页</template>
					</el-menu-item>
					<el-menu-item index="/home/database">
						<i class="el-icon-headset"></i>
						<template #title>数据库管理</template>
					</el-menu-item>
					<el-menu-item index="/home/mine">
						<i class="el-icon-edit"></i>
						<template #title>用户中心</template>
					</el-menu-item>
					<el-menu-item index="/home/instance">
						<i class="el-icon-edit"></i>
						<template #title>数据库实例</template>
					</el-menu-item>
				</el-menu>
			</el-aside>
			<el-container>
				<el-main>
					<router-view>
					</router-view>
				</el-main>
			</el-container>
		</el-container>

	</div>
</template>

<script type="module">
	export default {
		name: 'home',
		data() {
			return {
			}
		},
		components: {},
		methods: {

		},
		created() {
		}
	}
</script>

<style scoped>
	.el-header {
		background-color: #B3C0D1;
		color: #333;
		line-height: 60px;
	}

	.el-aside {
		color: #333;
	}

	#logo {
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid #EBEEF5;
		background-color: #FFF;
	}
	
	a {
	    text-decoraction: none;
		-webkit-tap-highlight-color:rgba(255,0,0,0);
	}
	
	.router-link-active {
	    text-decoration: none;
	}
	#main, #home{
		height: 100%;
		min-height: 720px;
	}
	
</style>
