<template>
  <view id="ViewNews">
    <view class="container">
      <view>{{newsDetailData.title}}</view>
      <view class="user">
        <image src="/static/image/touxiang.png"></image>
        <view>
          <view class="name">Staff</view>
          <view class="date">{{newsDetailData.date}}</view>
        </view>
      </view>
			<rich-text class="content" :nodes="newsDetailData.content"></rich-text>
    </view>
  </view>
</template>

<script>
import { GET_News } from "@/api/notice.js";
export default {
  data() {
    return {
      newsDetailData: {}
    };
  },
  onLoad(option) {
    GET_News(option).then(res => {
      this.newsDetailData = res.data.msg;
    });
  },
	onNavigationBarButtonTap() {
		uni.reLaunch({
			url:"/pages/home/home-page"
		})
	}
};
</script>

<style lang="scss">
#ViewNews {
  view.container {
    .content{
      font-size: 27.083upx;
    }
    .header {
      font-size: 29.166upx;
      font-weight: 600;
      padding: 12.5upx 0;
    }
    view.user{
      display: flex;
      align-items: center;
      margin-bottom: 62.5upx;
      image{
        width: 125upx;
        height: 125upx;
        border-radius: 50%;
        margin-right: 31.25upx;
      }
      view{
        .name{
          font-weight: 600;
        }
        .date{
          color: #c8c8c8;
          font-size: 25upx;
        }
      }
    }
  }
}
</style>