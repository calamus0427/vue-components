
<!-- 新建编辑目标通用模版 -->
<template>
  <el-dialog
    width="1000px"
    title="行动计划"
    v-if="isVisible"
    :visible.sync="isVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true"
    :lock-scroll="true"
    @close="cancel"
    center
  >
    <el-button
      v-if="modifyTemplate.creatorId == userId || modifyTemplate.chargePersonId == userId"
      @click="addList"
      :disabled="isDisabled"
    >新建行动计划</el-button>
    <el-form ref="form" :model="{'data':tableData}" :rules="formRules">
      <el-table ref="paramsTable" stripe :data="tableData" tooltip-effect="light">
        <el-table-column type="index" label="序号" :index="indexMethod"></el-table-column>
        <!-- <el-table-column prop="id" label="id"></el-table-column> -->
        <el-table-column prop="startTime" label="开始时间" min-width="150">
          <template slot-scope="scope">
            <el-form-item v-if="scope.row.editable" label>
              <el-date-picker
                style="width:100%"
                v-model="scope.row.startTime"
                type="date"
                placeholder="开始日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptionsStart(scope.row.startTime,scope.row.endTime)"
              ></el-date-picker>
            </el-form-item>
            <span v-else>{{dealTime(scope.row.startTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="截止日期" min-width="150">
          <template slot-scope="scope">
            <el-form-item v-if="scope.row.editable" label>
              <el-date-picker
                style="width:100%"
                v-model="scope.row.endTime"
                type="date"
                placeholder="截止日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptionsEnd(scope.row.startTime,scope.row.endTime)"
              ></el-date-picker>
            </el-form-item>
            <span v-else>{{dealTime(scope.row.endTime)}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="UpdaterName" label="创建人" min-width="80" :show-overflow-tooltip="true"> </el-table-column> -->
        <el-table-column prop="name" label="内容" :show-overflow-tooltip="true" min-width="150">
          <template slot-scope="scope">
            <el-form-item v-if="scope.row.editable" label>
              <el-input
                :maxlength="45"
                v-model="scope.row.name"
                :autosize="{ minRows: 1, maxRows: 2}"
                resize="none"
                type="textarea"
                placeholder="请输入行动内容"
              ></el-input>
            </el-form-item>
            <span v-else>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="finishFlag" label="是否完成" width="150">
          <template slot-scope="scope">
            <el-form-item v-if="addListNum!==1 && scope.row.editable">
              <el-radio-group v-model="scope.row.finishFlag">
                <el-radio label="1">是</el-radio>
                <el-radio label="0" style="margin-left: 10px;">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <span v-else>{{scope.row.finishFlag == '1' ? '是' : '否'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="管理" fixed="right" width="220">
          <template slot-scope="scope">
            <el-tooltip
              v-if="!scope.row.editable"
              class="item"
              effect="light"
              content="编辑"
              placement="bottom"
            >
              <el-button
                size="mini"
                round
                icon="fdddfont icon-modify"
                @click.stop="handleEdit(scope.$index, scope.row)"
                :disabled="isDisabled"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              v-if="scope.row.editable"
              class="item"
              effect="light"
              content="确定"
              placement="bottom"
            >
              <el-button
                size="mini"
                round
                icon="el-icon-check"
                @click.stop="handleAddItem(scope.$index, scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              v-if="scope.row.editable"
              class="item"
              effect="light"
              content="取消"
              placement="bottom"
            >
              <el-button
                size="mini"
                round
                icon="el-icon-close"
                @click.stop="handleCancelItem(scope.$index, scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              v-if="scope.row.id"
              class="item"
              effect="light"
              content="删除"
              placement="bottom"
            >
              <el-button
                size="mini"
                round
                icon="fdddfont icon-delete"
                @click.stop="handleDel(scope.$index, scope.row)"
                :disabled="isDisabled"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, prev, pager, next"
        :current-page.sync="pagination.pageNum"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        @current-change="changePage"
      ></el-pagination>
    </el-form>
    <span slot="footer" class="dialog-footer" v-if="!(isDisabled)">
      <!-- <el-button size="small" type="primary" @click="save" v-if="auditStatus =='2'">确定</el-button> -->
      <el-button size="small" @click="cancel">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
/**
 * Template Edit Component
 * ----------------------
 * Author: Calamus
 * Date: 2018.08.28
 */
// validate
import Validator from "@/utils/extendValidate/extendValidate";
// api
import {
  getKrList,
  editActKr,
  actionAdd,
  actionEdit,
  actionEditStatus,
  actionDel
} from "@/api/okr";
import { setSession, getSession } from "@/utils/session";
import { Staff_List } from "@/utils/ENUM";
import { Todo_List } from "@/utils/ENUM";
import TransferHeader from "@/components/TransferHeader";
import moment from "moment";
import UserSelect from "./userSelect";
import { mapGetters } from "vuex";

const initForm = {
  type: "",
  id: "",
  upDateTime: new Date(),
  participant: []
};
export default {
  name: "TemplateEdit",
  components: {
    TransferHeader,
    UserSelect
  },
  data() {
    return {
      pickerOptionsStart(startTime, endTime) {
        return {
          disabledDate: time => {
            let endDateVal = endTime;
            if (endDateVal) {
              return time.getTime() >= new Date(endDateVal).getTime();
            }
          }
        };
      },
      pickerOptionsEnd(startTime, endTime) {
        return {
          disabledDate: time => {
            let beginDateVal = startTime;
            if (beginDateVal) {
              return time.getTime() < new Date(beginDateVal).getTime();
            }
          }
        };
      },
      isVisible: false,
      form: {},
      formRules: {},
      staffList: [],
      mulParticipant: [],
      tableData: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      addListNum: 0,
      currentRow: {},
      isDisabled: false
    };
  },
  computed: {
    ...mapGetters(["userId", "token"]),
    totalProportion() {
      var numberList = [];
      this.keyResultsList.map(item => {
        if (item.proportion) {
          numberList.push(parseFloat(item.proportion));
        }
      });
      if (numberList.length > 0) {
        return numberList.reduce(function(preValue, curValue, index, array) {
          return preValue + curValue;
        });
      } else {
        return 0;
      }
      return 0;
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    isCreate: {
      type: Boolean,
      default: false
    },
    modifyTemplate: {
      type: Object
    },
    // 2:公司级目标 1:部门目标
    okrType: {
      type: Number,
      default: 1
    },
    auditStatus: {
      type: String
    }
  },
  watch: {
    show(isShow) {
      this.isVisible = isShow;
      if (isShow) {
        let scoreStatus =
          this.modifyTemplate &&
          this.modifyTemplate.targetGrade &&
          this.modifyTemplate.targetGrade.superiorGrade
            ? true
            : false;
        //审核为审核通过不能进行操作   评分之后强制关闭目标 只有创建人 负责人可以操作 kr进度完成不可进行操作
        this.isDisabled =
          this.auditStatus !== "2"
            ? true
            : scoreStatus
            ? true
            : !(
                this.modifyTemplate.creatorId == this.userId ||
                this.modifyTemplate.chargePersonId == this.userId
              )
            ? true
            : this.modifyTemplate.currentProgress == "on" ||
              Number(this.modifyTemplate.processValue) == "100"
            ? true
            : false;
        if (this.isCreate) {
          this.form = JSON.parse(JSON.stringify(initForm));
        } else {
          this.form = JSON.parse(JSON.stringify(this.modifyTemplate));
          console.log(
            this.modifyTemplate,
            this.$store.getters.userId,
            "userId",
            this.userId
          );
          this.getList();
        }
      } else {
        this.isDisabled = false;
      }
    }
  },
  methods: {
    getList() {
      this.tableData = [];
      getKrList({
        pageSize: this.pagination.pageSize,
        pageNum: this.pagination.pageNum,
        keyResultId: this.form.id
      }).then(res => {
        if (!res.error) {
          console.log("res.item", res.item);
          res.item.forEach(item => {
            item.editable = false;
            item.finishFlag = item.completeState;
          });
          this.tableData = res.item;
          console.log("this.tableData", this.tableData);
          this.pagination.total = res.total;
          this.addListNum = 0;
        }
      });
    },
    changePage(page) {
      this.pagination.pageNum = page;
      this.addListNum = 0;
      this.getList();
    },
    // save() {
    //   this.cancel();
    //   this.$emit("updateList");
      // this.$refs.form.validate(isValid => {
      //   if (isValid) {
      //     console.log("", this.form);
      //     var params = {
      //       id: this.form.id,
      //       actionVoList: JSON.parse(JSON.stringify(this.tableData)).map(
      //         item => {
      //           return { id: item.id };
      //         }
      //       )
      //     }
      //     editActKr(params).then(res => {
      //       if (!res.error) {
      //         this.$message({
      //           message: "关联行动计划成功!",
      //           type: "success"
      //         });
      //         this.cancel();
      //         this.$emit("updateList");
      //       }
      //     })
      //   }
      // })
    // },
    contactTodo(id) {
      var params = {
        id: this.form.id,
        actionVoList: JSON.parse(JSON.stringify(this.tableData))
          .filter(item => {
            return item.id;
          })
          .map(item => {
            return { id: item.id };
          })
      };
      editActKr(params).then(res => {
        if (!res.error) {
          this.$emit("updateList");
          this.getList();
        }
      });
    },
    cancel() {
      this.$emit("update:show", false);
      this.$emit("updateList");
      this.$emit("update:modifyTemplate", null);
      this.isVisible = false;
      this.tableData = [];
      this.addListNum = 0;
    },
    addList() {
      if (this.addListNum >= 1) {
        this.$message({
          message: "请先保存行动计划再继续添加!",
          type: "warning"
        });
      } else {
        this.tableData.unshift({
          startTime: moment(new Date()).format("YYYY-MM-DD"),
          endTime: null,
          content: "",
          user: "",
          finishFlag: false,
          editable: true
        });
        this.pagination.total += 1;
        this.addListNum += 1;
      }
    },
    handleEdit(index, row) {
      if (row.editable) {
        //提交
        this.addTodoItem(row, index);
      } else {
        //编辑
        this.tableData[index].editable = true;
      }
    },
    handleAddItem(index, row) {
      let params = JSON.parse(JSON.stringify(row));
      params.keyResultId = this.form.id;
      params.completeTime = params.endTime;
      params.chargePersonId = this.form.chargePersonId;
      let url = params.id ? actionEdit : actionAdd;
      let message = params.id ? "编辑行动计划成功！" : "新建行动计划成功！";
      url(params).then(res => {
        if (!res.error) {
          this.$message({
            message: message,
            type: "success"
          });
          this.tableData[index].editable = false;
          if (res.id) {
            this.tableData[index].id = res.id;
          }
          this.contactTodo();
        }
      });
    },
    handleCancelItem(index, row) {
      if (row.id) {
        this.tableData[index].editable = false;
      } else {
        this.tableData.splice(index, 1);
        this.pagination.total -= 1;
        this.addListNum -= 1;
      }
    },
    handleDel(index, row) {
      if (row.id) {
        actionDel({ id: row.id }).then(res => {
          if (!res.error) {
            this.$message({
              message: "删除成功!",
              type: "success"
            });
            this.getList();
          }
        });
      }
    },
    //user
    getUser(val) {
      this.form.author = val.userUuid;
    },
    dealTime(time) {
      return moment(time).format("YYYY-MM-DD");
    },
    // 生成列表序号
    indexMethod(index) {
      return (
        index + 1 + (this.pagination.pageNum - 1) * this.pagination.pageSize
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.flex {
  display: flex;
}
.mar-l-80 {
  margin-left: 80px;
}
.mr_l_10 {
  margin-left: 1rem;
}
.xss_input_width {
  width: 70px;
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
}
.mr_r_10 {
  margin-right: 1rem;
}
.fontColor2 {
  color: #aaa;
}
.el-input-group__append,
.el-input-group__prepend {
  padding: 0 4px !important;
}
.input__container {
  display: flex;
  margin-left: 1rem;
  span {
    margin-right: 8px;
  }
  .disabled_label {
    color: #c0c4cc;
    cursor: not-allowed;
  }
  .input_unit {
    font-size: 0.8rem;
    color: #777777;
    padding-left: 5px;
  }
}
.key-results {
  border-bottom: 1px dashed orange;
  background-color: #f2f2f2;
  padding: 1rem 0rem 1.5rem 1rem;
  .el-row {
    margin-top: 1rem;
  }
  .key-results-container {
    display: flex;
    align-items: center;
    .key-results-unit {
      display: flex;
    }
  }
}
.add-key-results {
  background-color: #f2f2f2;
  padding: 1rem 0rem 1.5rem 1rem;
}

.participantCtn {
  display: flex;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    > div {
      margin-right: 10px;
    }
  }
}
.participantCtn {
  display: flex;
  .fontLabel {
    line-height: 37px;
  }
  .user_container {
    display: flex;
    align-items: center;
    > div {
      margin-right: 10px;
    }
  }
}
// .el-radio + .el-radio {
//   margin-left: 0px !important;
// }
.el-form-item {
  margin-bottom: 0 !important;
}
</style>
