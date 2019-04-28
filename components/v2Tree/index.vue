<template>
  <div id="app">
    <div class="draw-area" id="treeContent" ref="treeContent">
      <div v-for="(arr, index) in levels" :key="index">
        <div
          v-for="(v,index) in arr"
          v-if="!v.parent || v.parent.open"
          class="vnode"
          v-bind:class="{pnode: v.children && v.children.length > 0, 'red':v.red}"
          :key="index"
          :style="'left:' + (v.left) + 'px; top:' + (v.top) + 'px'"
          @click="toggle(v)"
        >
          <div class="text" :id="v.id">
            <div class="node_title">
              <span
                :class="v.type == '0' ? 'orange':'blue'"
                class="OKR"
              >{{v.type == '0' ? 'O':'KR'}}</span>
              <span class="label">
                <el-tooltip :disabled="!((v.target && v.target.length > 32) || (v.keyResult && v.keyResult.length > 32))" class="item" effect="light" :content="v.target || v.keyResult" placement="top-start">
                  <span v-if="v.type == '0'">{{v.target}}</span>
                  <span v-if="v.type == '1'">{{v.keyResult}}</span>
                </el-tooltip>
              </span>
            </div>
            <div class="node_des">
              <div v-if="v.type == '0'">目标类型:{{v.tlevel == '0' ? '公司':'部门'}}</div>
              <div v-if="v.type == '1'">kr类型:{{v.resultType == '2' ? '承诺':'挑战'}}</div>
              <div v-if="v.cycleName">周期:{{v.cycleName}}</div>
              <div v-if="v.type == '1'">
                <span  v-if="v.progressType == '1'">当前进度:
                  <span :style="{'color':'#58c2ef'}">{{v.currentProgress}}{{v.myUnit}}</span>
                </span>
                <span  v-if="v.progressType != '1'">当前进度:
                  <span :style="{'color': '#58c2ef'}">{{v.currentProgress == 'off' ? '未完成' : '完成'}}</span>
                </span>
              </div>
            </div>
            <div   class="node_result">
                <span v-if="v.krlist && v.krlist.length > 0" class="node_result__title">关键结果:</span>
                <div class="node_result__content" :style="{'min-height':v.krlist && v.krlist.length > 0 ? '128px' : '0px'}">
                  <p v-for="(kr,indexr) in v.krlist" :key="indexr">
                    <el-popover
                      placement="right"
                      :width="300"
                      trigger="hover"
                      :disabled="kr.keyResult && kr.keyResult.length > 13 ? false  : true"
                      >
                      <div class="node_result_pover">
                        <p class="target"  :style="{'color':'#58c2ef'}">{{kr.keyResult}}</p>
                      </div>
                      <div slot="reference">
                        <div class="kr__title">
                            <span class="smallCircle" :style="{'background':'#58c2ef'}"></span>
                            <span >{{kr.keyResult.length > 13 ? kr.keyResult.substring(0,12) + '...': kr.keyResult}}</span>
                            <span style="float:right" v-if="kr.progressType == '1'">当前进度:
                              <span :style="{'color':'#58c2ef'}">{{kr.currentProgress}}{{kr.myUnit}}</span>
                            </span>
                            <span style="float:right" v-if="kr.progressType != '1'">当前进度:
                              <span :style="{'color': '#58c2ef'}">{{kr.currentProgress == 'off' ? '未完成' : '完成'}}</span>
                            </span>
                        </div>
                      </div>
                    </el-popover>
                  </p>
                </div>
                <div :style="{'opacity':v.krlist && v.krlist.length > 5 ? 1 : 0}"  class="seeMore">......</div>
            </div>
            <div class="showTips" v-if="v.type == '0' ? true:false">
              <el-tooltip content="详情" placement="right" effect="light">
                <a href="javascript:;" @click.stop="detailTarget(v)" class="tips_icon icon_edit">
                  <i class="xhefont xhe-yanjing"></i>
                </a>
              </el-tooltip>
              <el-tooltip content="更新进度" placement="right" effect="light">
                <a href="javascript:;" @click.stop="refreshTarget(v)" class="tips_icon icon_edit">
                  <i class="xhefont xhe-gengxinjindu"></i>
                </a>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
      <svg :id="svgId">
        <path
          class="link"
          v-for="(link, index) in list"
          v-if="link.deep > 0 && link.parent.open"
          :d="link.path"
        ></path>
        <!-- <path class="link" v-bind:class="{'red': link.lineRed}" v-for="(link, index) in list" v-if="link.deep > 0 && link.parent.open"  :d="link.path"></path> -->
      </svg>
    </div>
  </div>
</template>



<script>
import "./ruler.js";
import okrDetail from "@/components/okrTemplate/detail";
import { getTargetTree,getKeyResult } from "@/api/okr";
// import { list } from './list.js'
//TODO:横向排列有问题

const width = 800;
const height = 600;
const blockHeight = 250;
const blockWidth = 400;

export default {
  name: "svgTree",
  data() {
    return {
      rules: {
        min: 200,
        max: 350
      },
      delayRules: {
        min: 10,
        max: 300
      },
      treeLoading:false,
      root: null, // 顶层根节点s
      list: null, // 列表
      reds: null, // 高亮元素列表
      levels: null, // 层次存储
      //style
      nodeWidth:320,
      nodeHeight:300
    };
  },
  props: {
    treeData: {
      type: Array
    },
    direction: {
      type: String,
      default: "row" //col:横向 row:纵向
    },
    svgId: {
      type: String,
      default: "svg"
    },
    cycleType:{
      type:String,
      defalut:'1'   //1:年度  2：季度
    }
  },
  mounted() {
    if (this.treeData && this.treeData.length > 0) {
      this.initData(JSON.parse(JSON.stringify(this.treeData)));
    }
  },
  watch: {
    treeData(val) {
      if (val && val.length > 0) {
        this.initData(JSON.parse(JSON.stringify(val)));
      }
    }
  },
  components: {
    okrDetail
  },
  methods: {
    compare: function(v1, v2) {
      if (v1.deep !== v2.deep) {
        return v1.deep - v2.deep;
      }

      if (v1.parent === v2.parent) {
        return v1.id - v2.id;
      }

      return this.compare(v1.parent, v2.parent);
    },
    // 初始化数据： 计算deep等
    initData(data) {
      console.log("data",data)
      this.treeLoading = true;
      var keys = {};
      var root = null;
      var levels = [];

      if (!data && !(data.length > 0)) {
        return;
      }

      data.forEach(v => {
        keys[v.id] = v;
        v.deep = 0;
        v.top = 0;
        v.height = 0;
        v.width = 0;
        v.path = "";
        v.left = 20;
        v.prev = null; // 前一个节点
        v.red = false; // 是否标红
        v.lineRed = false; // 线条是否标红
      });
      data.forEach(v => {
        if (v.parentId || v.parentId > 0) {
          var p = keys[v.parentId];
          var typeLen = v.typeList.filter(item=>{return item!=0}).length
          // var krLen = v.krlist && v.krlist.length > 0 ? 1 : 0;
          // typeLen = typeLen -  Number(krLen)
          console.log("typeLen",typeLen)
          p.children = p.children || [];
          p.children.push(v);
          v.parent = p;
          v.deep = p.deep + 1;
          v.left = this.direction == "col" ? v.deep * 250  : 0;
          v.top = this.direction == "row" ? this.cycleType=='1' ? v.deep * 350 : typeLen == 0 ? v.deep * 350 : v.deep * 350 - 150*typeLen : 0;
          v.open = v.deep < 1;
          v.show = v.deep < 2;
        } else {
          root = v;
          v.open = true;
          v.show = true;
        }
      })
      data.sort(this.compare);
      data.forEach(v => {
        levels[v.deep] = levels[v.deep] || [];
        levels[v.deep].push(v);
        v.prev = levels[v.deep][levels[v.deep].length - 2];
      })

      this.root = root;
      this.list = data;
      this.levels = levels;
      if (this.direction == "col") {
        this.calcHeight(root);
        this.calcTop();
        this.calSvg();
        this.treeLoading = false
      } else {
        //default
        this.calWidth(root);
        this.calcRowHeight(root);
        this.calcLeft();
        this.calSvgVer();
        this.treeLoading = false
      }
    },
    //线条标红
    red() {
      var me = this;
      var reds = [];
      this.list.forEach(v => {
        if (v.value > me.rules.min && v.value <= me.rules.max) {
          v.red = true;
          reds.push(v);
          var p = v.parent;
          while (p) {
            p.open = true;
            p = p.parent;
          }
        } else {
          v.red = false;
        }
        if (v.delay >= me.delayRules.min && v.delay <= me.delayRules.max) {
          v.lineRed = true;
          if (!v.red) {
            reds.push(v);
            var p = v.parent;
            while (p) {
              p.open = true;
              p = p.parent;
            }
          }
        }
      });
      this.reds = reds;
    },
    calcRowHeight(vnode){
      var id = vnode.id
      var height = 0;
      this.$nextTick(()=>{
        vnode.height = document.getElementById(id) ? document.getElementById(id).offsetHeight : 0
      })

    },
    // 计算所有节点占用的高度和宽度是否展示
    calcHeight(vnode) {
      var me = this;
      var height = 0;
      if (vnode.parent && !vnode.parent.open) {
        // 存在父节点并且父节点不展开
        vnode.height = 0;
        vnode.open = false;
      } else if (!vnode.open) {
        vnode.height = blockHeight;
      }

      if (vnode.children && vnode.children.length > 0) {
        vnode.children.forEach(v => {
          me.calcHeight(v);
          height += v.height;
        });
      }

      if (vnode.open) {
        vnode.height = height || blockHeight;
      }
    },
    calWidth(vnode) {
      var me = this;
      var width = 0;
      if (vnode.parent && !vnode.parent.open) {
        // 存在父节点并且父节点不展开
        vnode.height = 0;
        vnode.width = 0;
        vnode.open = false;
      } else if (!vnode.open) {
        vnode.width = blockWidth;
      }
      if (vnode.children && vnode.children.length > 0) {
        vnode.children.forEach(v => {
          me.calWidth(v);
          width += v.width;
        });
      }
      if (vnode.open) {
        vnode.width = width || blockWidth;
      }
    },
    //计算svg的大小
    calSvg() {
      this.$nextTick(() => {
        let maxHeight = this.levels
          .flat(Infinity)
          .filter(item => {
            return item.show;
          })
          .sort((a, b) => {
            return b.top - a.top;
          })[0].top;
        let svg = document.getElementById(this.svgId);
        svg.setAttribute("height", 500);
        svg.setAttribute("width", 700);
        this.$emit(
          "toggle",
          this.$refs.treeContent.scrollWidth,
          this.root.height
        );
      });
    },
    calSvgVer() {
      this.$nextTick(() => {
        let maxHeight = this.levels
          .flat(Infinity)
          .filter(item => {
            return item.show;
          })
          .sort((a, b) => {
            return b.top - a.top;
          })[0].top;
        // let svg = document.getElementById('svg')
        let svg = document.getElementById(this.svgId);
        svg.setAttribute("height", this.$refs.treeContent.scrollHeight);
        svg.setAttribute("width", this.root.width);
        this.$emit("toggle", {
          width: this.root.width,
          height: this.$refs.treeContent.scrollHeight
        });
      });
    },
    // 计算节点top的位置
    calcTop(vnode, prevHeight) {
      if (!vnode) {
        vnode = this.root;
      }
      prevHeight = prevHeight || 0;
      vnode.top = prevHeight + vnode.height / 2;
      if (vnode.children && vnode.children.length > 0) {
        for (var i = 0; i < vnode.children.length; i++) {
          var height = vnode.children[i].height;
          this.calcTop(vnode.children[i], prevHeight);
          prevHeight += height;
        }
      }
      if (vnode.parent) {
        var pLeft = vnode.parent.left + blockWidth + 500;
        var pTop = vnode.parent.top;
        var mLeft = (vnode.left + pLeft) / 2;
        var mTop = (vnode.top + pTop) / 2;
        vnode.path =
          "M" +
          vnode.left +
          "," +
          vnode.top +
          " C " +
          mLeft +
          " " +
          vnode.top +
          "," +
          mLeft +
          " " +
          pTop +
          "," +
          pLeft +
          " " +
          pTop +
          "L " +
          (vnode.parent.left + 10) +
          "," +
          pTop;
      }
    },
    // 节点左边位置
    calcLeft(vnode, prevWidth) {
      if (!vnode) {
        vnode = this.root;
      }
      prevWidth = prevWidth || 0;
      vnode.left = prevWidth + vnode.width / 2;
      if (vnode.children && vnode.children.length > 0) {
        for (var i = 0; i < vnode.children.length; i++) {
          var width = vnode.children[i].width;
          this.calcLeft(vnode.children[i], prevWidth);
          prevWidth += width;
        }
      }
      if (vnode.parent) {
        var pLeft = vnode.parent.left + 165;
        var pTop = vnode.parent.top + 95;
        var vLeft = vnode.left + 165;
        var vTop = vnode.top;
        var mLeft = (pLeft + vLeft) / 2;
        var mTop = (pTop + vTop) / 2;
        var x1 = vLeft > pLeft ? vLeft + 5 : vLeft - 5;
        if (vLeft == pLeft) {
          vnode.path =
            "M" + vLeft + "," + vTop + " " + " L " + pLeft + "," + pTop;
        } else {
          vnode.path =
            "M" +
            vLeft +
            "," +
            vTop +
            " Q " +
            x1 +
            "," +
            (vTop - 30) +
            " " +
            mLeft +
            "," +
            (vTop - 30) +
            " T " +
            pLeft +
            "," +
            pTop;
        }
      }
    },
    // 收缩和展开
    toggle(vnode) {
      if (vnode.children) {
        vnode.open = !vnode.open;
        vnode.children.map(child => {
          child.show = !child.show;
        });
        if (this.direction == "col") {
          this.calcHeight(this.root);
          this.calcTop();
          this.calSvg();
        } else {
          this.calWidth(this.root);
          this.calcLeft();
          this.calSvgVer();
        }
      }
    },
    //自定义事件
    showDetail(data) {
      delete data.children;
      this.$emit("detail", data);
    },
    addTarget(data) {
      delete data.children;
      this.$emit("add", data);
    },
    editTarget(data) {
      delete data.children;
      this.$emit("edit", data);
    },
    detailTarget(data) {
      delete data.children;
      this.$emit("detail", data);
    },
    refreshTarget(data) {
      delete data.children;
      this.$emit("refresh", data);
    }
  }
};
</script>

<style>
.draw-area {
  position: relative;
  width: 100%;
  height: calc(100vh - 100px);
  margin: 40px auto;
}
svg {
  z-index: 0;
}
.vnode {
  position: absolute;
  z-index: 100;
  top: 10px;
  left: 10px;
  min-height: 90px;
  margin: 0;
  margin-top: -10px;
  font-size: 13px;
  line-height: 20px;
  border-radius: 3px;
  background: #ffffff;
  box-shadow: 1px 2px 10px 3px rgba(0, 0, 0, 0.08);
  transition: top 0.3s;
  cursor: pointer;
  width: auto;
  /* width: 230px;
    overflow:hidden; */
}
.vnode.red {
  background: #e00;
}
.vnode.red .text {
  color: #fff;
}
.vnode .text {
  padding: 0 10px;
}
.pnode::after {
  content: "";
  position: absolute;
  bottom: 0;
  display: inline-block;
  width: 330px;
  left:0px;
  height: 1px;
  background: #e6a23c;
}
.link {
  fill-opacity: 0;
  stroke: #aaa;
  stroke-width: 1px;
}
.link.red {
  stroke: #e00;
  stroke-width: 2px;
}
.tip {
  z-index: 999;
  display: block;
  padding: 5px;
  border: 1px solid #eee;
  line-height: 20px;
  border-radius: 5px;
  background: transparent;
}
.vnode:hover {
  z-index: 999;
}
.vnode:hover .tip {
  display: block;
}

/**ruler部分*/
.ruler-head {
  font-size: 14px;
  text-align: left;
}
.ruler-head span {
  display: inline-block;
  width: 50px;
  text-align: center;
}
.ruler {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 100px;
  margin-top: 10px;
  margin-left: 10px;
}
.ruler-ruler {
  position: relative;
  right: 10px;
  left: 5px;
  display: inline-block;
  width: 10px;
  height: 100px;
  background: #9a9797;
}
.ruler-deg {
  position: absolute;
  top: 50px;
  left: 0;
  width: 0;
  width: 0;
  height: 10px;
  margin-top: -5px;
  padding-left: 3px;
  border-left: 20px solid #666;
  font-size: 10px;
  line-height: 10px;
  text-align: center;
  color: #666;
  background: transparent;
  cursor: row-resize;
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -moz-user-select: none; /* Firefox */
  user-select: none;

  -webkit-touch-callout: none; /* iOS Safari */
}

/** 过滤 */
.reds {
  width: 350px;
}
.reds .one {
  display: block;
  padding: 0 5px;
  border-top: 1px solid #666;
  font-size: 13px;
  line-height: 20px;
}
.reds .red {
  color: #e00;
}
</style>

<style lang="scss" scoped>
.vnode {
  padding:5px;
  .text {
    position: relative;
    height: 100%;
    width: 300px;
    .node_title {
      padding: 3px 0px 0px 0px;
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      .OKR {
        display: inline-block;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        color: #fff;
        line-height: 35px;
        text-align: center;
        font-size: 1.2rem;
        &.orange {
          background-color: #ff7350;
        }
        &.blue {
          background-color: #58c2ef;
        }
      }
      .label {
        overflow: hidden;
        padding-left: 10px;
        font-size: 1rem;
        color: #1f1f1f;
        font-weight:bold;
        display: inline-block;
        span{
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          width: 240px;
        }
        button {
          overflow: hidden;
          color: #1f1f1f !important;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 140px;
          display: inline-block;
          line-height: 35px;
          text-align: left;
        }
      }
    }
    .node_des {
      display: flex;
      color: #777777;
      font-size: 12px;
      justify-content: space-between;
      padding:5px 0;
      div {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        width: 130px;
        display: inline-block;
        text-align: left;
      }
    }
    .node_result{
      padding-bottom:15px;
      .node_result__title{
        color:#1f1f1f;
        font-size:12px;
      }
      .kr__title{
        // width:230px;
        height:14px;
        line-height:14px;
        font-size:12px;
        color:#777777;
        // overflow:hidden;
        // text-overflow:ellipsis;
        //  white-space:nowrap
      }
      .node_result__content{

        max-height:148px;
        overflow: hidden;
        transition: max-height 1s ease;
      }
      .seeMore{
        opacity: 1;
        display:block;
        transition: opacity 0.5s ease;
        color:#777777;
        line-height:10px;
        font-size:14px;
      }
      &:hover{
        .node_result__content{
          max-height:200px;
        }
        .seeMore{
          opacity: 0 !important;
        }
      }
    }
    .node_progress {
      // position: absolute;
      // width: 200px;
      // bottom: 0px;
      height: 40px;
      border-top: 1px solid #d8d8d8;
      line-height: 40px;
      .el-progress {
        display: inline;
        .el-progress__text {
          font-size: 12px !important;
          color: #777777 !important;
        }
      }
    }
    .showTips {
      position: absolute;
      left: 335px;
      top: -5px;
      opacity: 0;
      a {
        display: inline-block;
      }
      .tips_icon {
        display: inline-block;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        text-decoration: none;
        padding: 3px;
        background: #ffffff;
        box-shadow: 1px 2px 10px 3px rgba(0, 0, 0, 0.08);
        transition: all 0.5s ease 0s;
        color: #777777;
        &:hover {
          color: #58c2ef;
        }
      }
    }
    &:hover {
      .showTips {
        opacity: 1;
      }
    }
  }
}
.el-progress__text {
  font-size: 12px !important;
  color: #777777 !important;
}
.smallCircle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
}
.orangeColor .smallCircle {
  background: #ff7350;
}
.blueColor .smallCircle {
  background: #58c2ef;
}
.node_result_pover{
  font-size: 12px;
}
</style>

