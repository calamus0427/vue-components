<!-- 目标详情页面 -->
<template>
  <el-dialog
    title="关键结果详情"
    width="1000px"
    v-if="isVisible"
    :visible.sync="isVisible"
    :append-to-body="true"
    :lock-scroll="true"
    @close="cancel"
    class="keyResultDetail"
  >
    <el-row class="headerCtn">
      <span class="target">{{modifyTemplate.target}}</span>
    </el-row>
    <el-row>
      <span class="fontColor2">目标周期：</span>
      <span class="black_color">{{modifyTemplate.cycleName}}</span>
    </el-row>
    <div class="headerCtn"></div>
    <div class="contentCtn">
      <div class="resultCtn">
        <span class="fontColor1">
          <img :src="require('@/assets/icons/icon-key.png')">
          <span>关键结果</span>
        </span>
      </div>
      <el-table
        ref="paramsTable"
        :data="tableData"
        :show-header="false"
        class="keyRsList"
        tooltip-effect="light"
        :cell-class-name="setCircleColor"
      >
        <el-table-column label="当前进度" min-width="500">
          <template slot-scope="scope">
            <el-row class="krList_target">
              <el-col :span="22">
                <span class="smallCircle"></span>
                <span class="black_color font_14">{{scope.row.keyResult}}</span>
              </el-col>
            </el-row>
            <div class="process" style="width:100%;margin-bottom:0.6rem;">
              <div>
                <p>
                  <span class="fontColor2">关键结果类型:</span>
                  <span>{{scope.row.resultType == '1' ? '挑战' : scope.row.resultType == '2' ? '承诺' : '未知'}}</span>
                </p>
                <p style>
                  <span class="fontColor2">自评分:</span>
                  <span>{{(scope.row.targetGrade && scope.row.targetGrade.selfGrade) ? scope.row.targetGrade.selfGrade :'暂无'}}</span>
                </p>
                <p>
                  <span class="fontColor2">领导评分:</span>
                  <span>{{(scope.row.targetGrade && scope.row.targetGrade.superiorGrade) ? scope.row.targetGrade.superiorGrade :'暂无'}}</span>
                </p>
              </div>
              <div>
                <p class="fontColor2" style="padding-right:0;">当前进度:</p>
                <!-- 有单位的 -->
                <div v-if="scope.row.progressType == '1'">
                  <p v-if="scope.row.myUnit=='%'" class="input__container black_color">
                    <el-form :model="editVal[scope.$index]" ref="form">
                      <el-form-item
                        label
                        prop="value"
                        :rules="[
                        { required: true, message: '请输入进度', trigger: 'change' },
                        {
                        validator: function (rule, value, callback) {return validatECurrentProgress(rule, value, callback, scope.row.myUnit)},
                        trigger: 'change'
                      }]"
                      >
                        <span
                          class="input_unit"
                          v-if="!editableArr[scope.$index].editable"
                        >{{editVal[scope.$index].value}}</span>
                        <el-input
                          v-else
                          class="xss_input_width"
                          size="mini"
                          v-model="editVal[scope.$index].value"
                          :maxlength="3"
                        ></el-input>
                        <span class="input_unit">{{scope.row.myUnit}}</span>
                      </el-form-item>
                    </el-form>
                  </p>
                  <p v-else class="input__container black_color" style="position: relation;">
                    <span
                      class="input_unit"
                      v-if="!editableArr[scope.$index].editable"
                    >{{scope.row.currentProgress}}</span>
                    <el-input
                      v-else
                      class="xss_input_width"
                      size="mini"
                      v-model="editVal[scope.$index].value"
                      maxlength="6"
                    ></el-input>
                    <span class="input_unit">{{scope.row.myUnit}}</span>
                  </p>
                  <p class="input__container">
                    <span class="input__label fontColor2">起始:</span>
                    <span class="input_unit black_color">{{scope.row.startValue}}</span>
                    <span class="input_unit">{{scope.row.myUnit}}</span>
                  </p>
                  <p class="input__container" style="margin: 0 10px;">
                    <span class="input__label fontColor2">目标:</span>
                    <span class="input_unit black_color">{{scope.row.aimValue}}</span>
                    <span class="input_unit">{{scope.row.myUnit}}</span>
                  </p>
                  <p class="input__container">
                    <span class="input__label fontColor2">进度:</span>
                    <span class="black_color">{{scope.row.processValue}}%</span>
                  </p>
                </div>
                <div v-else>
                  <p class="input__container black_color">
                    <span></span>
                    <span
                      v-if="!editableArr[scope.$index].editable"
                    >{{editVal[scope.$index].value?'完成':'未完成'}}</span>
                    <el-switch
                      v-else
                      v-model="editVal[scope.$index].value"
                      active-color="#58c2ef"
                      inactive-color="#ff4949"
                    ></el-switch>
                    <span class="input_unit">{{scope.row.unit}}</span>
                  </p>
                  <p class="input__container">
                    <span class="input__label fontColor2">起始:</span>
                    <span class="input_unit disabled_label">未完成</span>
                  </p>
                  <p class="input__container black_color">
                    <span class="input__label fontColor2">目标:</span>
                    <span class="input_unit disabled_label">完成</span>
                  </p>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="管理" fixed="right" width="230">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" content="更新进度" placement="bottom">
              <el-button
                size="mini"
                round
                @click.stop="handleRefreshProcess(scope.$index, scope.row,editableArr[scope.$index].editable)"
                type="primary"
                style="width: 80px;"
                :disabled="modifyTemplate.reviewStatus!=='2'?true:(
                  (scope.row.targetGrade && scope.row.targetGrade.superiorGrade)?true:
                  (scope.row.progressType=='0'&&scope.row.currentProgress=='on')?true:(Number(scope.row.processValue)==100)?true:false)"
              >{{editableArr[scope.$index].editable ? '确定' : '更新进度'}}</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="查看行动计划" placement="bottom">
              <el-button
                size="mini"
                icon="el-icon-view"
                round
                @click.stop="handleScanTodo(scope.$index, scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="查看评分详情" placement="bottom">
              <el-button
                size="mini"
                icon="el-icon-tickets"
                round
                :disabled="!(scope.row.targetGrade && scope.row.targetGrade.superiorGrade)"
                @click.stop="handleScoreInfo( scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="评论" name="first">
          <span slot="label">
            <img class="tab__icon" :src="require('@/assets/icons/icon-message.png')" alt>
            评论
          </span>
          <div class="comments_container">
            <div class="commentsCtn" style="height: calc(100% - 20px);position: relative;">
              <div style="height: calc(100% - 60px);overflow-y: auto;">
                <el-row
                  v-for="(item,index) in commentsList"
                  :key="index"
                  style="margin-bottom: 8px;"
                >
                  <el-col :span="2">
                    <span class="fontColor3">{{item.createUserName}}</span>
                  </el-col>
                  <el-col :span="4">
                    <span class="fontColor2">{{dealTime(item.createTime)}}</span>
                  </el-col>
                  <el-col :span="16">
                    <span class="fontColor3 word-wrap">{{item.content}}</span>
                  </el-col>
                  <el-col :span="2">
                    <el-tooltip class="item" effect="light" content="删除" placement="bottom">
                      <i
                        class="el-icon-delete"
                        :style="{color:item.createUserName != userName?'#ccc':'#58C2EF'}"
                        @click.stop="handleDelComments(item)"
                      ></i>
                    </el-tooltip>
                  </el-col>
                </el-row>
              </div>
              <el-pagination
                background
                layout="total, prev, pager, next"
                :current-page.sync="pagination.pageNum"
                :page-size="pagination.pageSize"
                :total="pagination.total"
                @current-change="changePage"
                style="position:absolute;left:0;bottom:30px;"
              ></el-pagination>
            </div>
            <el-row class="comments_content">
              <el-col :span="20">
                <el-input
                  type="textarea"
                  resize="none"
                  v-model="comment"
                  placeholder="发表评论..."
                  :maxlength="100"
                  :autosize="{ minRows: 1, maxRows: 3}"
                ></el-input>
              </el-col>
              <el-col :span="3" :offset="1">
                <el-button @click="sendComment" type="primary" round>确认发送</el-button>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="进度历史" name="second">
          <span slot="label">
            <img class="tab__icon" :src="require('@/assets/icons/icon-progress.png')" alt>
            <span>进度历史</span>
          </span>
          <div>
            <time-line :list="timeLineList"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="历史回顾" name="third">
          <span slot="label">
            <img class="tab__icon" :src="require('@/assets/icons/icon-history.png')" alt>
            <span>历史回顾</span>
          </span>
          <div>
            <history-time-line :list="historyList"/>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 行动计划 -->
    <todo-okr
      :show.sync="todoListVisible"
      :modifyTemplate.sync="info"
      :isCreate="false"
      :auditStatus="modifyTemplate.reviewStatus"
    />
    <!-- 评分详情 -->
    <handle-dialog :isShow.sync="showDialog" :type="type" :targetId="targetId" :info="info"/>
  </el-dialog>
</template>
<script>
import moment from "moment";
import TimeLine from "@/components/timeLine";
import HistoryTimeLine from "@/components/timeLine/history.vue";
import TodoOkr from "./todolist";
import CommonTable from "@/components/commonTable";
import { updateKeyResult, getTargetMeets } from "@/api/okr";
import { simpleTabs, TabItem } from "@/components/simpleTabs";
// validate
import Validator from "@/utils/extendValidate/extendValidate";
//api
import {
  getKeyResult,
  addComment,
  getCommentList,
  deleteComment,
  getLog
} from "@/api/okr";
import HandleDialog from "@/views/Development/scoreManagement/components/HandleDialog";
export default {
  name: "TemplateEdit",
  components: {
    TimeLine,
    HistoryTimeLine,
    TodoOkr,
    CommonTable,
    HandleDialog
  },
  data() {
    return {
      form: {},
      resultFormRules: {},
      resultForm: {},
      userName: this.$store.getters.userName,
      activeName: "first",
      updateMessage: "",
      isVisible: false,
      staffList: [],
      mulParticipant: [],
      commentsList: [],
      historyList: [],
      comment: "",
      timeLineList: [],
      todoListVisible: false,
      info: null,
      tableData: [],
      editableArr: [],
      editVal: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      isShowProgressError: false,
      showDialog: false,
      type: "info",
      targetId: "",
      info: {}
    };
  },
  props: {
    show: {
      type: Boolean
    },
    modifyTemplate: {
      type: Object
    }
  },
  watch: {
    show(isShow) {
      this.isVisible = isShow;
      if (isShow) {
        this.activeName = "first";
        console.log("modifyTemplate", this.modifyTemplate);
        let cache = [];
        this.form = JSON.parse(
          JSON.stringify(this.modifyTemplate, function(key, value) {
            if (typeof value === "object" && value !== null) {
              if (cache.indexOf(value) !== -1) {
                return;
              }
              cache.push(value);
            }
            return value;
          })
        );
        cache = null;
        this.handleKeyResult();
        this.handleComments();
      } else {
        this.form = Object.assign({}, this.form, { editVal: [] });
      }
    }
  },
  methods: {
    validatECurrentProgress(rule, value, callback, unit) {
      if (value && unit == "%") {
        let rg100 = /^((\d{1,2}?)|100)$/;
        if (!rg100.test(value)) {
          callback(new Error("0-100 的数字"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    update() {
      let resArr = [];
      let process;
      let overallProgress = 0;
      this.form.results.forEach(item => {
        switch (item.type) {
          case "unit":
            process = parseInt(
              (Number(item.process) / Number(item.target)) * 100
            );
            break;
          case "default":
            process = item.process == "1" ? "100" : "0";
        }
        item = Object.assign({}, item, {
          progress: process
        });
        resArr.push(item);
        overallProgress += item.progress * (item.weight.split("%")[0] / 100);
      });
      this.form = Object.assign({}, this.form, {
        results: resArr,
        progress: overallProgress + "%"
      });
      //调用更新更新进度说明的接口
    },
    cancel() {
      this.$emit("update:show", false);
      this.isVisible = false;
      this.activeName = "first";
      this.timeLineList = [];
      // this.$emit("updateList", this.form);
    },
    handleRefreshProcess(index, row, isEdit) {
      if (isEdit) {
        if (this.$refs.form) {
          this.$refs.form.validate(isValid => {
            if (isValid) {
              this.$confirm("确定更新该进度?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }).then(val => {
                if (val == "confirm") {
                  this.updateProcess(index, row);
                }
              });
            }
          });
        } else {
          this.$confirm("确定更新该进度?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(val => {
            if (val == "confirm") {
              this.updateProcess(index, row);
            }
          });
        }
      } else {
        let newArr = [];
        this.editableArr.forEach((item, order) => {
          if (order == index) {
            item = Object.assign({}, item, {
              editable: true
            });
          } else {
            item = Object.assign({}, item, {
              editable: false
            });
          }
          newArr.push(item);
        });
        this.editableArr = newArr;
      }
    },
    updateProcess(index, row) {
      let currentProgress = this.editVal[index].value;
      if (row.progressType == "0") {
        currentProgress = currentProgress ? "on" : "off";
      }
      updateKeyResult({
        currentProgress: currentProgress,
        id: row.id
      }).then(res => {
        if (!res.error) {
          this.$message({
            message: "更新进度成功!",
            type: "success"
          });
          this.handleKeyResult();
          this.$emit("updateList");
        }
      });
    },
    sendComment() {
      if (this.comment) {
        addComment({
          content: this.comment,
          targetId: this.modifyTemplate.id
        }).then(res => {
          if (!res.error) {
            this.$message({
              message: "评论成功!",
              type: "success"
            });
            this.comment = "";
            this.handleComments();
          }
        });
      } else {
        this.$message({
          message: "请输入评论内容!",
          type: "warning"
        });
      }
    },
    handleScanTodo(index, row) {
      this.todoListVisible = true;
      this.info = row;
    },
    handleScanHistory(url) {
      console.log("url", url);
      window.open(url);
    },
    handleDelComments(row) {
      if (row.createUserName == this.userName) {
        this.$confirm("确认删除该评论吗?", "警告", {
          type: "warning"
        })
          .then(() => {
            deleteComment({
              id: row.id
            }).then(res => {
              if (!res.error) {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.handleComments();
              }
            });
          })
          .catch(() => {});
      }
    },
    handleTabClick(tab) {
      switch (tab.name) {
        case "first":
          this.handleComments();
          break;
        case "second":
          this.handleLog();
          break;
        case "third":
          //进度回顾接口
          this.handleHistory();
          break;
      }
    },
    handleComments() {
      getCommentList({
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        targetId: this.modifyTemplate.id
      }).then(res => {
        if (!res.error) {
          this.commentsList = res.item;
          this.pagination.total = res.total;
        }
      });
    },
    handleKeyResult() {
      getKeyResult({
        id: this.modifyTemplate.id
      }).then(res => {
        if (!res.error) {
          this.editableArr = [];
          this.editVal = [];
          res.forEach(item => {
            this.editableArr.push({
              editable: false
            });
            this.editVal.push({
              value:
                item.progressType == "1"
                  ? item.currentProgress
                  : item.currentProgress == "on"
                  ? true
                  : false
            });
          });
          this.form = Object.assign({}, this.form, {
            editVal: this.editVal
          });
          this.tableData = res;
        }
      });
    },
    handleLog() {
      getLog({
        id: this.modifyTemplate.id
      }).then(res => {
        if (!res.error) {
          this.timeLineList = res;
        }
      });
    },
    handleHistory() {
      getTargetMeets({
        id: this.modifyTemplate.id
      }).then(res => {
        if (!res.error) {
          this.historyList = res;
        }
      });
    },
    dealTime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
    changeSwitch(val, index) {
      let state = "off";
      if (val) {
        state = "on";
      }
      this.editVal[index] = Object.assign({}, this.editVal[index], {
        value: state
      });
    },
    changePage(page) {
      this.pagination.pageNum = page;
      this.handleComments();
    },
    setCircleColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex % 2 == 0) {
        return "orangeColor";
      } else {
        return "blueColor";
      }
    },
    handleScoreInfo(row) {
      this.showDialog = true;
      this.targetId = this.modifyTemplate.id;
      this.info = row;
    }

    //更新进度 验证
    // changeProgressValue(val, unit) {
    //   if (unit == "%") {
    //     if (Number(val) < 1 || val > Number(100)) {
    //       this.isShowProgressError = true;
    //     } else {
    //       this.isShowProgressError = false;
    //     }
    //   }
    // }
  }
};
</script>
<style scoped lang="scss">
.no-border-table .el-table td,
.no-border-table .el-table th.is-leaf {
  border-bottom: 1px solid transparent !important;
}
.xss_input_width {
  width: 80px;
}
.xs_input_width {
  width: 80px;
}
.s_input_width {
  width: 120px;
}
.l_input_width {
  width: 280px;
}
.fontColor1 {
  color: #888;
  min-width: 60px;
}
.fontColor2 {
  color: #777;
}
.fontColor3 {
  color: #1f1f1f;
}
.word-wrap {
  word-break: break-all;
}
.headerCtn {
  display: flex;
  align-items: center;
}
.headerCtn .circle,
.headerCtn > div:first-child {
  display: flex;
  flex-direction: column;
}
.headerCtn > div:first-child > div,
.processCtn {
  display: flex;
  align-items: center;
}
.headerCtn > div:first-child > div > div {
  width: calc(100% - 100px);
}
.target {
  font-size: 20px;
  color: $base-lightBlue-color;
}
.contentCtn > div {
  margin-top: 10px;
}
.contentCtn {
  .resultCtn {
    > span {
      font-size: 14px;
      img {
        height: 17px;
        vertical-align: middle;
      }
    }
  }
}

.contentCtn > div > span {
  padding: 4px 6px;
  display: block;
  /* border-left: 4px solid #409eff;
  background: #e9f4ff; */
  margin-bottom: 10px;
}
ul {
  border-bottom: 1px solid #eee;
}
ul > li {
  border-top: 1px solid #eee;
  padding: 10px;
  display: flex;
  align-items: center;
}
ul > li > * {
  margin-right: 10px;
}
.participantCtn > div {
  padding-left: 10px;
  display: flex;
  align-items: center;
}
.participantCtn > div > div {
  margin-right: 10px;
}
.xs_input_width {
  width: 100px;
}
.process {
  padding-left: 20px;
  > div {
    display: flex;
    align-items: center;
    p {
      margin: 0;
      position: relative;
      padding-right: 2rem;
      > span:nth-child(2) {
        color: #1f1f1f;
      }
    }
    > div {
      align-items: center;
      display: flex;
    }
  }
}
.input__container {
  display: flex;
  margin-left: 1rem;
  align-items: center;
  span:nth-child(1) {
    margin-right: 8px;
  }
  .disabled_label {
    color: #c0c4cc;
    cursor: not-allowed;
  }
  .input_unit {
    padding-left: 3px;
  }
}
.comments_container {
  position: relative;
  height: 300px;
  .comments_content {
    position: absolute;
    bottom: 10px;
    width: 100%;
  }
}
.tab__icon {
  display: inline-block;
  width: 12px;
  height: 12px;
  filter: grayscale(100%);
  filter: gray;
}
.el-tabs__item {
  &:hover {
    img {
      filter: grayscale(0%);
      filter: transparent;
    }
  }
}
.is-active {
  img {
    filter: grayscale(0%);
    filter: transparent;
  }
}
.font_14 {
  font-size: 14px !important;
}
.black_color {
  color: #1f1f1f;
  min-width: 32px;
}
.keyRsList {
  font-size: 14px;
  border-top: 1px solid #d8d8d8;
}
.el-form-item {
  margin: 0 !important;
}
.el-form-item__error {
  position: absolute !important;
  left: 0px;
  bottom: 20px;
}
</style>
<style>
.keyResultDetail .el-dialog {
  border-radius: 9px !important;
}
.keyResultDetail .el-dialog__header {
  border-bottom: 1px solid #d8d8d8;
}
.keyResultDetail .el-dialog__title {
  color: #1f1f1f;
  font-size: 14px;
}
.keyResultDetail .el-dialog__body {
  padding: 15px 20px;
}
.keyResultDetail .target {
  font-size: 16px;
  color: #58c2ef;
}
.keyResultDetail table tr,
.keyResultDetail table td {
  height: 46px !important;
}
.keyResultDetail table td {
  padding: 0;
  border-bottom: 1px solid #d8d8d8;
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
.keyResultDetail .el-textarea__inner {
  background: #f5f5f5;
}
.keyResultDetail .el-tab-pane {
  min-height: 300px;
}
.keyResultDetail .el-form-item__content {
  line-height: 23px !important;
}
.keyResultDetail p {
  margin: 0;
}
.krList_target {
  margin: 0.6rem 0;
}
</style>


