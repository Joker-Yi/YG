<template>
  <div>
    <!-- 顶部搜索 -->
    <mytopsearch />
    <!-- 内容区域 -->
    <div class="content">
      <div class="left">
        <ul>
          <li @click="changeActive(index)" :class="{active: index === activeIndex}" v-for="(item, index) in cateList" :key="index">
            {{ item.cat_name }}
          </li>
        </ul>
      </div>
      <div class="right">
        <img class="topimg" src="https://img.alicdn.com/tfs/TB1kQJodeP2gK0jSZFoXXauIVXa-520-280.jpg_q90_.webp" alt="">
        <div class="box" v-for="(item, index) in itemList" :key="index">
          <div class="title">
            <span>/</span>
            {{ item.cat_name }}
            <span>/</span>
          </div>
          <div class="item">
            <navigator :url="'/pages/searchList/main?key=' + subItem.cat_name" class="subitme" v-for="(subItem, subIndex) in item.children" :key="subIndex">
              <img class="itemimg" :src="'https://autumnfish.cn/wx/' + subItem.cat_icon" alt="">
              <div class="itemname">{{ subItem.cat_name }}</div>
            </navigator>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 导入顶部搜索
import mytopsearch from '@/components/mytopsearch.vue'
// 导入封装的 request 文件
import myrequest from '@/utils/myrequest.js'

export default {
  data() {
    return {
      // 设置默认激活的元素
      activeIndex: 0,
      // 分类数据源
      cateList: [],
      // 右侧的数据源
      itemList: []
    }
  },
  methods: {
    // 点击改变激活的元素
    changeActive(index) {
      // 改变激活的导航样式
      this.activeIndex = index
      // 动态修改右侧的数据源
      this.itemList = this.cateList[index].children
    },
    // 用来请求分类数据
    async getCateList() {
      // 开启一个加载动画
      wx.showLoading()
      let res = await myrequest({
        url: 'api/public/v1/categories'
      })
      // 解构
      let { message, meta } = res.data
      // 判断
      if (meta.status === 200) {
        this.cateList = message
        // 给右侧的数据源赋值
        this.itemList = this.cateList[0].children
      }
      // 关闭一个加载动画
      wx.hideLoading()
    }
  },
  // mounted() {
  mounted() {
    this.getCateList()
  },
  components: {
    mytopsearch
  }
}
</script>

<style lang="less">
.content {
  width: 100%;
  position: absolute;
  top: 100rpx;
  left: 0;
  bottom: 0rpx;
  display: flex;
  .left {
    width: 198rpx;
    overflow: auto;
    ul {
      li {
        height: 100rpx;
        line-height: 100rpx;
        background-color: #f4f4f4;
        text-align: center;
        &.active {
          color: #eb4450;
          background-color: #fff;
          position: relative;
          &::before {
            content: '';
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 0;
            width: 8rpx;
            height: 60rpx;
            background-color: #eb4450;
          }
        }
      }
    }
  }
  .right {
    flex: 1;
    padding: 20rpx 16rpx 0;
    overflow: auto;
    .topimg {
      width: 100%;
      height: 180rpx;
    }
    .box {
      .title {
        text-align: center;
        height: 100rpx;
        line-height: 100rpx;
        span {
          color: #dadada;
        }
      }
      .item {
        display: flex;
        flex-wrap: wrap;
        .subitme {
          width: 33.333%;
          text-align: center;
          .itemimg {
            width: 80%;
            height: 70rpx;
          }
          .itemname {
            margin-bottom: 40rpx;
          }
        }
      }
    }
  }
}
</style>
