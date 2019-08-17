<template>
  <div>
    <!-- 顶部搜索 -->
    <mytopsearch/>
    <!-- 轮播图 -->
    <swiper class="myswiper" indicator-dots autoplay circular interval="2000" duration="200">
      <block v-for="(item, index) in lunBoList" :key="index">
        <swiper-item>
          <image :src="item.image_src" class="slide-image" width="355" height="150" />
        </swiper-item>
      </block>
    </swiper>
    <!-- 导航区域 -->
    <div class="mynav">
      <div class="navItem" v-for="(item, index) in navList" :key="index">
        <div class="image">
          <img :src="item.image_src" alt="">
        </div>
        <div class="myword">
          {{ item.name }}
        </div>
      </div>
    </div>
    <!-- 楼层区域 -->
    <div class="floor" v-for="(item, index) in floorLsit" :key="index">
      <div class="top">
        <img :src="item.floor_title.image_src" alt="">
        <span>{{ item.floor_title.name }}</span>
      </div>
      <div class="itemList">
        <!-- 添加五张图片 -->
        <div class="left">
          <!-- item.product_list 下面的第一张图片 -->
          <img :src="item.product_list[0].image_src" alt="">
        </div>
        <div class="right">
          <!-- item.product_list 剩下的四张图片 -->
          <!-- v-if: 当遍历到第 0 张图片时，应该不显示，其它显示 -->
          <img v-if="subIndex != 0" v-for="(subItem, subIndex) in item.product_list" :key="subIndex" :src="subItem.image_src" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 导入 myrequest
import myRequest from '@/utils/myrequest.js'
// 导入头部组件
import mytopsearch from '@/components/mytopsearch.vue'

export default {
  data() {
    return {
      // 轮播图的数据源
      lunBoList: [],
      // 导航栏的数据
      navList: [],
      // 楼层数据
      floorLsit: []
    }
  },
  methods: {
    // 得到轮播图的数据
    async getLunBoList() {
      let res = await myRequest({
        url: 'api/public/v1/home/swiperdata'
      })
      // 解构
      let { message, meta } = res.data
      // 判断
      if (meta.status === 200) {
        this.lunBoList = message
      }
    },
    // 得到导航栏的数据
    async getNavList() {
      let res = await myRequest({
        url: 'api/public/v1/home/catitems'
      })
      // 解构
      let { message, meta } = res.data
      // 判断
      if (meta.status === 200) {
        this.navList = message
      }
    },
    // 得到楼层数据
    async getFloorData() {
      let res = await myRequest({
        url: 'api/public/v1/home/floordata'
      })
      // 解构
      let { message, meta } = res.data
      // 判断
      if (meta.status === 200) {
        this.floorLsit = message
      }
    }
  },
  mounted() {
    // 得到轮播图的数据
    this.getLunBoList()
    // 得到导航的数据
    this.getNavList()
    // 得到楼层数据
    this.getFloorData()
  },
  // 注册组件
  components: {
    mytopsearch
  }
}
</script>

<style lang="less">
.myswiper {
  width: 100%;
  height: 340rpx;
  margin-top: 100rpx;
  image {
    width: 100%;
    height: 340rpx;
  }
}

.mynav {
  width: 100%;
  height: 193rpx;
  display: flex;
  align-items: center;
  .navItem {
    flex: 1;
    text-align: center;
    .image {
      img {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
      }
    }
    .myword {}
  }
}

.floor {
  .top {
    position: relative;
    img {
      width: 100%;
      height: 90rpx;
    }
    span {
      position: absolute;
      top: 50%;
      left: 50rpx;
      transform: translate(0, -50%);
      color: #ff7b94;
    }
  }
  .itemList {
    padding: 20rpx 16rpx;
    display: flex;
    justify-content: space-between;
    .left {
      img {
        width: 232rpx;
        height: 365rpx;
      }
    }
    .right {
      img {
        width: 232rpx;
        height: 167rpx;
        margin-left: 10rpx;
        &:nth-child(3) {
          margin-top: 10rpx;
        }
        &:nth-child(4) {
          margin-top: 10rpx;
        }
      }
    }
  }
}
</style>
