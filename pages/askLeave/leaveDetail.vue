<template>
	<view class="detail-box">
		<view v-for="(item,index) in array" :key="index">
		<view class="detail-top">
			<view v-if="item.IMAGE!=''&&item.IMAGE!=undefined">
				<image :src="item.IMAGE" class="top-face"  @click="previewImg"></image>
			</view>
			<view v-else>
				<image src="../../static/mine/morentou.png" class="top-face"></image>
			</view>
			<view>{{item.STUDENTNAME}}</view>
		</view>
		<view class="detail-con">
			<view class="things-item">
				<text class="things-item-title">请假事由</text>
				<text class="things-item-con things-item-leave">{{item.LEAVEREASON}}</text>
			</view>
			<view class="things-item">
				<text class="things-item-title">开始时间</text>
				<text class="things-item-con">{{item.STARTDATE}}</text>
			</view>
			<view class="things-item">
				<text class="things-item-title">结束时间</text>
				<text class="things-item-con">{{item.ENDDATE}}</text>
			</view>
			<view class="things-item" v-if="item.STATUS == -1">
				<text class="things-item-title">拒绝原因</text>
				<text class="things-item-con things-item-leave">{{item.APPROVERESULT}}</text>
			</view>
		</view>
		<view class="btn">
			<button type="primary" class="agree"  v-if="item.STATUS!=1 && item.STATUS!=-1" @click="agree(item.FID)">同意(Agree)</button>
			<button type="primary" class="refuse" v-if="item.STATUS!=1 && item.STATUS!=-1" @click="refuse(item.FID)">拒绝(Refuse)</button>
		</view>
	</view>
	<uni-popup ref="oftenProblem" type="message">
		<uni-popup-message type="error" :message="msg" :duration="2000"></uni-popup-message>
	</uni-popup>
	<uni-popup ref="popup" type="dialog">
	    <uni-popup-dialog type="info" mode="input" title="拒绝原因" placeholder="请输入拒绝原因"  @confirm="confirm"></uni-popup-dialog>
	</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import  {base64ToPath}  from '@/js_sdk/gsq-image-tools/image-tools/index.js'
export default{
	components:{
		uniPopup,
		uniPopupMessage,
		uniPopupDialog
	},
	data(){
		return{
			fid:"",
			array:[],
			msg:"",
		}
	},
	onLoad(option){
		this.fid=option.fid;
		this.initLeaveDetail(option.fid);
	},
	//下拉刷新
	onPullDownRefresh(){
		this.initLeaveDetail(this.fid);
	},
	methods:{
		initLeaveDetail(fid){
			console.log(fid);
			uni.showLoading({
				title:"加载中"
			})
			var app=getApp().globalData;
			var that=this;
			uni.request({
				url:`${this.$url}askLeave/getLeaveList`,
				header: {
						// //设置参数内容类型为json
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization:this.$store.state.userInfo.token // 默认值
					  },
			  data: {
					classID:app.globalclassID,
					status:"0,1,-1",
					fid:fid
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
						  for(var item of arr.data){
						  	item.IMAGE="data:image/png;base64,"+item.IMAGE.replace(/[\r\n]/g,"");
						  }
					  	if(arr.data!=undefined){
					  		that.array=arr.data;
					  	}
					  }else{
					  	that.array=[];
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
		},
		//预览头像
		previewImg(){
			var list=[];
			base64ToPath(this.array[0].IMAGE).then(path => {
				list.push(path);
				uni.previewImage({
					current:0,
					urls:list,
				})
			  }).catch(error => {
			    console.error(error)
			  })
		},
		//同意
		agree(fid){
			console.log(fid);
			var app=getApp().globalData;
			uni.showLoading({
				title:"提交中"
			})
			uni.request({
				url:`${this.$url}askLeave/approveLeaveInfo`,				header: {						// //设置参数内容类型为json						'Content-Type': 'application/x-www-form-urlencoded',						Authorization:this.$store.state.userInfo.token // 默认值					  },			  data: {					approveResult:"",
					approverRemark:"",
					status: 1,					fid:fid				  },			  method: 'POST',			  dataType: 'json',
			  success:(res)=>{
				  uni.hideLoading();
				  console.log(res);
				  if(res.data.result){
					  uni.showToast({
					  	title:'已审批!',
						icon:'success',
						duration:2000,
						success() {
							setTimeout(function(){
								uni.navigateBack();
							},2000)
						}
					  })
					  
				  }else{
					  uni.showToast({
					  	title:res.data.msg,
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
		//拒绝
		refuse(fid){
			this.fid=fid;
			this.$refs.popup.open();
		},
		confirm(done,value){
			console.log(value);
			var app=getApp().globalData;
			var that=this;
			console.log(that.fid);
			uni.showLoading({
				title:"提交中"
			})
			uni.request({
				url:`${this.$url}askLeave/approveLeaveInfo`,
				header: {
						// //设置参数内容类型为json
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization:this.$store.state.userInfo.token // 默认值
					  },
			  data: {
					approveResult:value,
					approverRemark:"",
					status: -1,
					fid:that.fid
				  },
			  method: 'POST',
			  dataType: 'json',
			  success:(res)=>{
				  uni.hideLoading();
				  done();
				  console.log(res);
				  if(res.data.result){
					  uni.showToast({
					  	title:'已审批!',
						icon:'success',
						duration:2000,
						success() {
							setTimeout(function(){
								uni.navigateBack();
							},2000)
						}
					  })
					  
				  }else{
					  uni.showToast({
					  	title:res.data.msg,
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
		}
	}
}
</script>

<style>
page{
	background: #F5F5F5;
}
.detail-box{
	background: #fff;
	padding: 40rpx 40rpx;
}
.detail-top{
	text-align: center;
}
.detail-top .top-face{
	width: 140rpx;
	height: 140rpx;
	border-radius: 50%;
}
.detail-top view{
	font-size: 16px;
	text-align: center;
	padding: 20rpx 0;
}
.detail-con .things-item{
	display: flex;
	justify-content: space-between;
	padding: 10rpx 0;
}
.things-item .things-item-leave{
	width: 400rpx;
	text-align: right;
}
.things-item-title{
	font-size: 16px;
}
.things-item-con{
	font-size: 14px;
	color: #666;
}
.btn{
	margin-top:40rpx;
}
.btn .agree{
	width: 500rpx;
	background: #1D73E6;
	border-radius: 50rpx;
	color:#fff;
	border: none;
	margin-bottom: 40rpx;
}
.btn .refuse{
	width: 500rpx;
	background: #FF3D3F;
	border-radius: 50rpx;
	color:#fff;
	border: none;
}
</style>
