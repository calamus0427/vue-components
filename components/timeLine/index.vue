<template>
  <div class="time">
    <div class="time-line">
      <div v-for="(item,index) in list" class="time-line-div" :key="index">
        <p>{{item.progressUpdateTime}}</p>
        <p ref="circular"></p>
        <p>
          <el-row>
            <span v-if="item.optionType=='0'">{{item.updaterName}}新增 {{item.krName}}</span>
            <div v-else-if="item.optionType=='1'">
              <span>{{item.updaterName}}更新 {{item.krName}}</span>
              <span>当前进度为 {{item.progress}}</span>
            </div>
            <span v-else-if="item.optionType=='2'">{{item.updaterName}}完成 {{item.krName}}</span>
            <span v-else>删除 {{item.krName}}</span>
          </el-row>
        </p>
      </div>
      <div class="img-dotted" ref="dotted"></div>
    </div>
    <div style="margin-top:20px;"></div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {};
  },
  props: {
    list: {
      type: Array
    }
  },
  mounted() {
    if (this.list.length > 0) {
      this.$refs.dotted.style.left =
        this.$refs.circular[0].offsetLeft - 12 + "px";
    }
  },
  methods: {
    dealTime(date) {
      return moment(date).format("YYYY-MM-DD");
    }
  }
};
</script>

<style>
.text-center {
  text-align: center;
}
.time-line {
  position: relative;
  /* width:300px; */
  /* margin:0 auto; */
}
.time-line:after {
  position: absolute;
  content: "";
  left: 107px;
  top: 0;
  width: 1px;
  height: 100%;
  background-color: #e4e1fe;
}
.time-line-div {
  position: relative;
  min-height: 85px;
}
.time-line-div > p:nth-child(1) {
  position: absolute;
  left: 0;
  width: 100px;
  color: #777777;
  font-size: 12px;
}
.time-line-div > p:nth-child(2) {
  position: absolute;
  left: 100px;
  width: 14px;
  height: 14px;
  top: 10px;
  background: #ddccea;
  border-radius: 50%;
  z-index: 10;
}
.time-line-div > p:nth-child(3) {
  position: absolute;
  left: 130px;
  padding: 10px;
  font-size: 1rem;
  color: #606266;
  border-radius: 10px;
}
.img-dotted {
  position: absolute;
  width: 20px;
  height: 100%;
  top: 0;
  z-index: 1;
}

.color_gray {
  color: #777777;
}
.color_black {
  color: #000000;
}
.font_12 {
  font-size: 12px;
}
.font_14 {
  font-size: 14px;
}
</style>
