<template>
<view id="propertyList" class="warp-pb">
    <!-- <goHome /> -->
        <view v-if="propertyList.length>1" class="select container">
          <view v-for="(item,index) in propertyList" :key="index">
            <image src="/static/icons/house.png"></image>
            <view>
              <view class="tag-p">{{item.building_name}}</view>
              <view class="tag-p">{{item.room_number}}</view>
            </view>
          </view>
        </view>
  </view>
</template>

<script>
import { GET_Property } from "@/api/login.js";
export default {
  data() {
    return {
      propertyList: []
    };
  },
  onLoad(){
    GET_Property().then(res => {
      this.propertyList = res.data;
    });
  },
	onNavigationBarButtonTap() {
		uni.reLaunch({
			url:"/pages/home/home"
		})
	}
};
</script>

<style lang="scss">
#propertyList {
  .select {
    line-height: initial;
    margin-top: 62.5upx;
    display: flex;
    justify-content: space-between;
    flex-flow: row wrap;
    & > view {
      padding: 0 20.833upx;
      margin-bottom: 62.5upx;
      display: flex;
      justify-content: space-between;
      flex-flow: row wrap;
      height: 125upx;
      align-items: center;
      width: 297.916upx;
      background: linear-gradient(to bottom right, #fff, #dfdfea);
      border-radius: 12.5upx;
      & > view:last-of-type {
        flex: 1 1 auto;
        text-align: right;
      }
      image {
        width: 68.75upx;
        height: 68.75upx;
      }
    }
  }
}
</style>

