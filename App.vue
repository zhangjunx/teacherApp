<script>
	import {mapMutations} from "vuex" //导入vuex的mapMutations方法
export default {
	globalData:{
		token:"",
		globalclassID:""
	},
	onLaunch: function() {
		console.log('App Launch');
		uni.getStorage({//获得保存在本地的用户信息,更新登录状态
			key:"userInfo",
			success:(res) =>{
				this.loginIn(res.data);
			}
		})
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	},
	methods: {
		...mapMutations(['loginIn'])  //对全局方法loginIn进行监控
	}
};
</script>

<style>
/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
	font-family: uniicons;
	src: url('/static/uni.ttf');
}
/* #endif */
</style>
