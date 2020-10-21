<template>
	<view class="personInfo">
		<view class="faceBox">
			<text class="personInfo_text">头像</text>
			<view>
				<view v-if="img == '' ">
					<image src="../../static/mine/morentou.png" mode="widthFix" class="faceImg"></image>
				</view>
				<view v-else @click="chooseImg">
					<image :src="img" mode="widthFix" class="faceImg"></image>
				</view>
				<image src="../../static/icon/jtleft.png" mode="widthFix" class="jtleft"></image>
			</view>
		</view>
		<view class="line"></view>
		<view class="username">
			<text class="personInfo_text">名称</text>
			<text style="color: #666666; font-size: 16px;">李四</text>
		</view>
		<view class="line"></view>
		<view class="usernumber">
			<text class="personInfo_text">账号</text>
			<text style="color: #666666;font-size: 16px;">17803868675</text>
		</view>
		<view class="line"></view>
		<uni-popup ref="oftenProblem" type="message">
			<uni-popup-message type="error" :message="msg" :duration="2000"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue'
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
export default{
	components:{
		uniPopup,
		uniPopupMessage
	},
	data(){
		return{
			msg:"",
			img:"",
			usename:"",
			phone:"",
			fid:"",
		}
	},
	onLoad(){
		this.initTeacher();
	},
	//下拉刷新
	onPullDownRefresh(){
		this.initTeacher();
	},
	methods:{
		//点击选择头像
	    chooseImg(){
			uni.chooseImage({
				count:1,
				success:(res)=>{
					var path=res.tempFilePaths;
					this.upload(path)
				}
			})
		},
		//上传头像
		upload(path){
			uni.showLoading({
				title:"加载中"
			})
			var that=this;
			var app=getApp().globalData;
			uni.uploadFile({
				url:`${this.$url}teacherUser/uploadTeacherImage`,
				filePath:path[0],
				name:"file",
				header: {
				  //设置参数内容类型为json
				  'Content-Type': 'application/x-www-form-urlencoded',
				  Authorization:this.$store.state.userInfo.token// 默认值
				},
				formData: {
				  str:JSON.stringify({teacherUserID:that.fid})
				},
				success:(res)=>{
					uni.hideLoading();
					var arr=JSON.parse(res.data);
					console.log(arr);
					if(arr.result==true){
						uni.showToast({
							title:"上传成功!",
							icon:'success',
							duration:2000,
							success() {
								that.initTeacher();
							}
						})
					}else{
						uni.showToast({
							title:"上传失败",
							icon:"none",
							duration:2000,
						})
					}
				},
				fail:()=>{
					uni.hideLoading();
					that.msg="服务器异常!";
					this.$refs.oftenProblem.open();
				}
			})
		},
		//获取老师信息
		initTeacher(){
			uni.showLoading({
				title:"加载中"
			})
			var app=getApp().globalData;
			var that=this;
			uni.request({
				url:`${this.$url}teacherUser/getTeacherUserInfo`,
				header: {
						// //设置参数内容类型为json
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization:this.$store.state.userInfo.token // 默认值
					  },
			  method: 'POST',
			  dataType: 'json',
			  success:(res)=>{
				   uni.stopPullDownRefresh();
				  console.log(res);
				  uni.hideLoading();
				  var arr=res.data;
				  if(arr=="reLogin"){
					  uni.showModal({
					  	title:"提示",
					  	content:"登录过期，请重新登录",
					  	showCancel:false,
					  	success:function(res) {
					  		if(res.confirm){
					  			uni.reLaunch({
					  				url:"../login/login"
					  			})
					  		}
					  	}
					  })
				  }else{
					  if(arr.result==true){
						that.username=arr.data.NAME;
						that.phone=arr.data.PHONENUM;
						that.img="data:image/png;base64,"+arr.data.IMAGE.replace(/[\r\n]/g,"");
						that.fid=arr.data.FID;
					  }else{
							that.username="";
							that.phone="";
							that.img="";
							that.fid="";
					  }
				  }
			  },
			  fail:(res)=>{
				   uni.stopPullDownRefresh();
				  uni.hideLoading();
				  that.msg="服务器异常!";
				  this.$refs.oftenProblem.open();
			  }
			})
		}
	}
}
</script>

<style>
page{
	padding-top: 20rpx;
	background: #F5F5F5;
}
.personInfo_text{
	font-size: 16px;
}
.faceBox{
	display: flex;
	justify-content: space-between;
	background: #fff;
	padding: 20rpx;
	align-items: center;
}
.faceBox view{
	display: flex;
	align-items: center;
}

.faceBox .faceImg{
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
}
.faceBox .jtleft{
	margin-left: 15rpx;
	width: 20rpx;
}
.username{
	display: flex;
	justify-content: space-between;
	background: #fff;
	padding: 20rpx;
	align-items: center;
}
.usernumber{
	display: flex;
	justify-content: space-between;
	background: #fff;
	padding: 20rpx;
	align-items: center;
}
.line{
	height: 1px;
	background-color: #E5E5E5;
	width: 95%;
	margin: 0 auto;
}
</style>
