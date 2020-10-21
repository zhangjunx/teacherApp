<template>
	<view class="matter">
		<uni-collapse>
			 <uni-collapse-item style="font-size:16px;" v-for="(item,index) in array" :key="index" :title="item.TITLE" showAnimation>
			        <view style="padding: 30rpx;font-size: 14px;"> {{item.CONTENT}} </view>
			    </uni-collapse-item>
		</uni-collapse>
		<uni-popup ref="oftenProblem" type="message">
			<uni-popup-message type="warn" :message="msg" :duration="2000"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue'
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
import uniCollapseItem  from '@/components/uni-collapse-item/uni-collapse-item.vue'
export default{
	components:{
		uniPopup,
		uniPopupMessage,
		uniCollapse,
		uniCollapseItem
	},
	data(){
		return{
			msg:"",
			array:[],
		}
	},
	onLoad() {
		this.initMatter();
	},
	//下拉刷新
	onPullDownRefresh(){
		this.initMatter();
	},
	methods:{
		initMatter(){
			var app=getApp().globalData;
			var that=this;
			uni.request({
				url:`${this.$url}matter/getMatterList`,
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
							that.array=arr.data;
					  }else{
							that.array=[];
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

</style>
