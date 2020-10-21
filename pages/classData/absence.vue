<template>
	<view class="holiday">
		<view class="holiday-item">
			<view class="item-title">
				<view class="item-title-name">
					<image src="../../static/icon/people.png" mode="widthFix"></image>姓名:<text>张其</text>
				</view>
				<view class="item-title-class">
					<image src="../../static/icon/classpeople.png" mode="widthFix"></image>班级: <text>三(二)班</text>
				</view>
			</view>
			<view class="item-con">
				<view class="item-con-left">
					0.5  <text>天</text>
				</view>
				<view class="item-con-right">
					<view class="item-con-right-start">
						开始时间: <text>2020-09-22 08:00:00</text>
					</view>
					<view>
						结束时间: <text>2020-09-22 12:00:00</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
</script>

<style>
page{
	background: #111943;
	padding-top:30rpx;
}
.holiday-item{
	width:95%;
	margin:10rpx auto;
	border: 1px solid #17ADFF;
	border-radius: 10rpx;
}
.holiday-item .item-title{
	height: 60rpx;
	line-height: 60rpx;
	background: #2D355F;
	padding-left: 20rpx;
	display: flex;
}
.holiday-item .item-title .item-title-name{
	font-size:14px;
	color: #E6E5E5;
	margin-right: 40rpx;
}
.holiday-item .item-title .item-title-name image{
	width: 30rpx;
	margin-right: 10rpx;
}
.holiday-item .item-title .item-title-name text{
	margin-left: 10rpx;
}
.holiday-item .item-title .item-title-class{
	font-size:14px;
	color: #E6E5E5;
}
.holiday-item .item-title .item-title-class image{
	width: 35rpx;
	margin-right: 10rpx;
}
.holiday-item .item-title .item-title-class text{
	margin-left: 10rpx;
}
.holiday-item .item-con{
	padding: 30rpx 20rpx;
	display: flex;
	align-items: center;
}
.holiday-item .item-con .item-con-left{
	font-size: 40px;
	color: #18ADFF;
	margin-right: 40rpx;
}
.holiday-item .item-con .item-con-left text{
	color: #E6E5E5;
	font-size: 14px;
}
.holiday-item .item-con .item-con-right view{
	font-size: 14px;
	color: #E6E5E5;
}
.holiday-item .item-con .item-con-right view text{
	margin-left: 10rpx;
}
.holiday-item .item-con .item-con-right .item-con-right-start{
	margin-bottom: 20rpx;
}

</style>
