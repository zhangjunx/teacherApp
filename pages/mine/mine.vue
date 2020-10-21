<template>
	<view class="mine">
		<view class="mine-photo" @click="openPersonInfo">
			<view class="mine-photo-left">
				<view v-if="img== '' ">
					<image src="../../static/mine/morentou.png"></image>
				</view>
				<view v-else @click.stop="previewImg">
					<image :src="img" ></image>
				</view>
				<view>
					<text class="username">{{username}}</text>
					<text class="phone">{{phone}}</text>
				</view>
			</view>
			<view class="mine-photo-right">
				<image src="../../static/icon/jtleft.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="nav-box">
			<navigator class="nav-item" url="../aboutUs/aboutUs" hover-class="nav-item-active" hover-stay-time="0">
				<image src="../../static/mine/jieshao.png" mode="widthFix"></image>
				<view>软件介绍</view>
			</navigator>
			<navigator class="nav-item" url="../matter/matter"  hover-class="nav-item-active" hover-stay-time="0">
				<image src="../../static/mine/changjian.png" mode="widthFix"></image>
				<view>常见问题</view>
			</navigator>
			<uni-popup ref="oftenProblem" type="message">
				<uni-popup-message type="warn" :message="msg" :duration="2000"></uni-popup-message>
			</uni-popup>
			<view class="nav-item" hover-class="nav-item-active" hover-stay-time="0" @click="openInfo">
				<image src="../../static/mine/yijian.png" mode="widthFix"></image>
				<view>意见反馈</view>
			</view>
			<uni-popup ref="info" type="dialog">
				<uni-popup-dialog type="warn" content="请拨打24小时客户服务热线04266323" @confirm="confirm"></uni-popup-dialog>
			</uni-popup>
			<navigator class="nav-item" url="../setUp/setUp" hover-class="nav-item-active" hover-stay-time="0">
				<image src="../../static/mine/shezhi.png" mode="widthFix"></image>
				<view>设置</view>
			</navigator>
		</view>
		
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue'
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
import  {base64ToPath}  from '@/js_sdk/gsq-image-tools/image-tools/index.js'
export default {
	components:{
		uniPopup,
	    uniPopupMessage,
		uniPopupDialog
	},
	data(){
		return{
			msg:"",
			username:"",
			phone:"",
			img:"",
			ifOnShow:false,
		}
	},
	onLoad(){
		this.initTeacher();
	},
	//页面显示
	onShow() {
		if(this.ifOnShow){
			this.initTeacher();
		}
	},
	//页面隐藏
	onHide() {
		this.ifOnShow = true;
	},
	//下拉刷新
	onPullDownRefresh(){
		this.initTeacher();
	},
	methods:{
		openInfo(){
			this.$refs.info.open();
		},
		confirm(done){
			uni.makePhoneCall({
				phoneNumber:'04266323'
			})
			done();
		},
		openPersonInfo(){
			uni.navigateTo({
				url:'../editPersonInfo/editPersonInfo'
			})
		},
		//预览图片
		previewImg(){
			console.log(this.img)
			var list=[];
			base64ToPath(this.img).then(path => {
				list.push(path);
				uni.previewImage({
					current:0,
					urls:list,
				})
			  }).catch(error => {
			    console.error(error)
			  })
			  
			
		},
		//获取老师信息
		initTeacher(){
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
					  }else{
							that.username="";
							that.phone="";
							that.img="";
					  }
				  }
			  },
			  fail:(res)=>{
				   uni.stopPullDownRefresh();
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
	background: #F5F5F5;
}
.mine-photo{
	padding: 40rpx 45rpx;
	display: flex;
	justify-content: space-between;
	background: #fff;
}

.mine-photo .mine-photo-left image{
	width: 140rpx;
	height:150rpx;
	border-radius: 50%;
	vertical-align: middle;
}
.mine-photo .mine-photo-left view{
	height: 100%;
	display: inline-flex;
	flex-direction: column;
	justify-content: space-around;
	margin-left: 20rpx;
	vertical-align: bottom;
}
.mine-photo .mine-photo-left view .phone{
	display: inline-block;
	padding: 10rpx 20rpx;
	color: #FF6900;
	border: 1px solid #FF6900;
	border-radius: 50rpx;
	font-size: 28rpx;
}

.mine-photo .mine-photo-right{
	display: flex;
	flex-direction: column;
	justify-content: center;
}
.mine-photo .mine-photo-right image{
	width: 20rpx;
}
.nav-box{
	display: flex;
	justify-content: space-around;
	background:#fff;
	margin-top: 40rpx;
	padding: 40rpx;
}
.nav-box .nav-item{
	width: 200rpx;
	text-align: center;
}
.nav-box .nav-item view{
	text-align: center;
	padding: 15rpx;
    font-size: 28rpx;
}
.nav-box .nav-item image{
	width: 66rpx;
}
.nav-box .nav-item-active{
	opacity:0.6;
}


</style>
