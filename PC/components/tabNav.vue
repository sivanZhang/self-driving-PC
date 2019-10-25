<template>
    <view class="subnav">
      <view v-for="(item,index) in menuList" :key="index" @tap="change(item.name)">
        <img :src="activeKey==item.name?item.activeSrc:item.src" mode="aspectFit">
        <view :class="{active:activeKey==item.name,p:true}">{{item.name}}</view>
      </view>
    </view>
</template>

<script>
export default {
    props:{
        menuList:Array,
        activeKey:String,
    },
    methods:{
        change(name){
            this.$emit('tapChange',name)
        }
    }
}
</script>

<style lang="scss" scoped>
.subnav {
      height: 170.833upx;
      line-height: 1;
      display: flex;
      justify-content: space-around;
      box-shadow: 0 6.25upx 6.25upx rgba(200, 200, 204, 0.8);
      align-items: baseline;
      padding-top: 31.25upx;
      view {
        text-align: center;
        font-size: 20.833upx;

        .p {
          text-align: center;

          &.active {
            color: #fab701;
          }
        }

        img {
          display: inline-block;
          height: 56.25upx;
					width: 56.25upx;
          margin-bottom: 8.333upx;
          object-fit: scale-down;
        }
      }
    }
</style>

