<!-- 新建/编辑目标通用模版 -->
<template>
  <el-dialog
    width="960px"
    :title="type=='info'? '目标详情' : isCreate ? '新建目标' : '编辑目标'"
    v-if="isVisible"
    :visible.sync="isVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true"
    :lock-scroll="true"
    @close="cancel"
    center
    class="handleTargetDialog"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      label-width="130px"
      :class="type=='info'?'inform':''"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="目标" prop="target">
            <el-input
              v-model="form.target"
              placeholder="请输入目标"
              maxlength="50"
              clearable
              :disabled="type=='info'"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="目标周期" prop="cycleId">
            <el-input v-model="form.cycleName" :disabled="type=='info'" v-if="type=='info'"></el-input>
            <xhe-period-select
              ref="periodRef"
              v-else
              @changeCycle="changeCycle"
              :initValue="{
                'name':form.cycleName,
                'id':form.cycleId
              }"
              :showPeriodType="((isCreate && !isAnnualTarget) || (!isCreate && initFatherId))?'quarter':'year'"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="年度目标">
            <el-switch
              v-model="isAnnualTarget"
              @change="switchIsAnnual"
              :disabled="type=='info' || (!isCreate?true:false)"
            ></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公司" prop="companyId">
            <el-select
              v-model="form.companyId"
              placeholder="请选择公司"
              clearable
              @change="changeCompony"
              :disabled="type=='info'"
            >
              <el-option
                v-for="item in componyList"
                :key="item.id"
                :label="item.orgName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="(isCreate && !isAnnualTarget) || (!isCreate && initFatherId)">
        <el-col v-if="form.companyId" :span="12">
          <el-form-item label="部门" prop="orgId" :rule="formRules.orgId">
            <el-cascader
              change-on-select
              :options="departmentList"
              :value="new Array(form.orgId)"
              :props="{
                label:'orgName',
                value:'id'
              }"
              placeholder="请选择部门"
              :show-all-levels="false"
              @change="changeDepartment"
              :disabled="!isCreate && (type=='info' || !initOrgId)?true:false"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.companyId">
          <el-form-item label="关联上级目标" prop="fatherName">
            <el-input v-model="form.fatherName" :disabled="type=='info'" v-if="type=='info'"></el-input>
            <el-popover placement="bottom" width="400" trigger="click" v-else>
              <father-target
                ref="fatherTarget"
                @sendData="getFatherId"
                :searchParams="fatherTargetForm"
                :initValue="initFatherTarget"
                :targetType="(form.companyId && form.orgId)?'department':'company'"
                :showTargetType="(form.companyId && form.orgId)?'quarter':((isCreate && !isAnnualTarget) || (!isCreate && initFatherId))?'year':'all'"
              ></father-target>
              <div class="inputCtn" slot="reference">
                <el-input v-model="form.fatherName" placeholder="请选择上级目标" :disabled="type=='info'"></el-input>
                <i class="el-icon-error clearIcon" @click.stop="chearVal"></i>
              </div>
            </el-popover>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col v-if="form.companyId && form.orgId && form.fatherId" :span="12">
          <el-form-item label="关联关键结果" prop="parentKrId">
            <el-select
              class="l_input_width"
              v-model="form.parentKrId"
              filterable
              clearable
              placeholder="请选择关联关键结果"
              :disabled="type=='info'"
            >
              <el-option
                v-for="(ks,i) in fatherKeyResults"
                :key="i"
                :label="ks.keyResult"
                :value="ks.id"
              >
                <div class="wrap_label">{{ks.keyResult}}</div>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <key-results
        ref="keyResults"
        :krList="form.krlist"
        :fatherId="form.fatherId"
        :type="type"
        :companyId="form.companyId"
      />
    </el-form>
    <span slot="footer" class="dialog-footer" v-show="type!=='info'">
      <el-button :loading="saveBtnLoading" size="small" type="primary" @click="save(false)">保存</el-button>
      <el-button
        :loading="saveBtnLoading"
        size="small"
        v-if="this.isCreate"
        type="primary"
        @click="save(true)"
      >保存并提交审核</el-button>
      <el-button size="small" @click="cancel">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
// api
import { addTarget, updateTarget, getKeyResult, auditTarget } from "@/api/okr";

import userSelect from "@/components/okrTemplate/userSelect";
import xhePeriodSelect from "@/components/okrTemplate/period";
import fatherTarget from "@/components/okrTemplate/fatherTarget";
import keyResults from "@/components/okrTemplate/keyResults";

import { generateTree } from "@/utils/generateTree";

const initForm = {
  fatherId: "", //父id
  target: "",
  cycleId: "", //周期id
  companyId: "",
  orgId: "", //组织机构id
  creatorId: "",
  parentKrId: "",
  krlist: []
};
export default {
  name: "update",
  components: {
    userSelect,
    xhePeriodSelect,
    fatherTarget,
    keyResults
  },
  data() {
    return {
      isVisible: false,
      saveBtnLoading: false,
      form: {},
      formRules: {
        target: [
          { required: true, message: "请输入目标", trigger: "change" },
          {
            min: 1,
            max: 200,
            message: "目标不要超过200字",
            trigger: "change"
          }
        ],
        companyId: [
          { required: true, message: "请选择公司", trigger: "change" }
        ],
        cycleId: [
          { required: true, message: "请选择目标周期", trigger: "change" }
        ],
        chargePersonName: [
          { required: true, message: "请选择负责人", trigger: "change" }
        ],
        fatherName: [
          { required: true, message: "请选择关联目标", trigger: "change" }
        ],
        parentKrId: [
          {
            required: true,
            message: "请选择关联关键结果",
            trigger: "change"
          }
        ]
      },
      componyList: this.$store.getters.orgList.filter(compony => {
        return compony.orgType == "0";
      }),
      initFatherTarget: {}, //初始化关联上级目标值
      fatherTargetForm: {}, //关联上级目标的查询条件  传值公司 部门
      fatherKeyResults: [], //上级关键结果列表
      initOrgId: "",
      initFatherId: "",
      isAnnualTarget: false
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    isCreate: {
      type: Boolean,
      default: true
    },
    modifyTemplate: {
      type: Object
    },
    type: {
      type: String
    }
  },
  watch: {
    show(isShow) {
      this.isVisible = isShow;
      if (isShow) {
        if (this.isCreate) {
          this.form = JSON.parse(JSON.stringify(initForm));
          this.form = Object.assign({}, this.form, {
            creatorId: this.$store.getters.userId
          });
          this.getDepartmentList();
        } else {
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
          //获取关键结果列表
          this.getKeyResults();
          //获取部门树
          this.getDepartmentList();
          this.getOrgTreeData(this.orgTreeData);
          this.initOrgId = this.form.orgId && JSON.stringify(this.form.orgId);
          //获取关联上级目标
          this.initFatherId =
            this.form.fatherId && JSON.stringify(this.form.fatherId);
          //是否是年度目标
          this.isAnnualTarget = this.form.fatherId ? false : true;
          if (this.form.orgId) {
            //部门目标
            this.fatherTargetForm = JSON.parse(
              JSON.stringify({
                companyId: this.form.companyId,
                cycleId: this.form.cycleId
              })
            );
            this.cascaderOrgId = new Array(this.form.orgId);
            this.formRules = Object.assign({}, this.formRules, {
              orgId: [
                { required: true, message: "请选择部门", trigger: "change" }
              ]
            });
          } else {
            this.fatherTargetForm = JSON.parse(
              JSON.stringify({
                orgId: this.form.companyId,
                tLevel: "0"
              })
            );
            this.formRules = Object.assign({}, this.formRules, {
              orgId: [
                {
                  required: false
                }
              ]
            });
          }
          this.initFatherTarget = Object.assign({}, this.form, {
            target: this.form.fatherName,
            id: this.form.fatherId
          });
          //关联上级关键结果
          if (this.form.fatherId) {
            this.changeFatherId();
          }
        }
      } else {
        this.form = {};
        this.formRules = Object.assign({}, this.formRules, {
          orgId: [
            {
              required: false
            }
          ]
        });
        this.isAnnualTarget = false;
      }
    }
  },
  methods: {
    getDepartmentList() {
      this.orgTreeData = generateTree(this.$store.getters.orgList);
    },
    save(isReview) {
      this.$refs.form.validate(isValid => {
        new Promise(this.$refs.keyResults.doSubmit)
          .then(rs => {
            this.form = Object.assign({}, this.form, {
              krlist: rs.krlist
            });
            if (isValid) {
              this.saveBtnLoading = true;
              if (rs.validateState) {
                var params = JSON.parse(JSON.stringify(this.form));
                if (this.isCreate) {
                  params.isReview = isReview ? 1 : 0;
                }
                var saveUrl = this.isCreate ? addTarget : updateTarget;
                var titleMessage = this.isCreate
                  ? "新建目标成功"
                  : "编辑目标成功";
                saveUrl(params).then(res => {
                  if (!res.error) {
                    this.$message({
                      message: titleMessage,
                      type: "success"
                    });
                    this.cancel();
                    this.$emit("updateList");
                  }
                });
              }
            }
          })
          .catch(rs => {
            console.log(rs);
          });
      });
    },
    cancel() {
      this.$refs.form.resetFields();
      this.saveBtnLoading = false;
      this.$emit("update:show", false);
      this.$emit("update:modifyTemplate", null);
      this.isVisible = false;
    },
    changeCompony(val) {
      this.form = Object.assign({}, this.form, {
        orgId: "",
        fatherId: "",
        fatherName: "",
        parentKrId: "",
        parentKrName: ""
      });
      //关联上级目标变化
      if (this.form.orgId) {
        //部门
        this.fatherTargetForm = JSON.parse(
          JSON.stringify({
            companyId: this.form.companyId,
            cycleId: this.form.cycleId
          })
        );
      } else {
        this.fatherTargetForm = JSON.parse(
          JSON.stringify({
            orgId: this.form.companyId,
            tLevel: "0"
          })
        );
      }

      this.initFatherTarget = Object.assign({}, this.form, {
        target: "",
        id: ""
      });
      this.departmentList = [];
      if (val !== "") {
        this.getOrgTreeData(this.orgTreeData);
      }
    },
    getOrgTreeData(nodeDatas) {
      let nodes = nodeDatas.filter(item => item.id == this.form.companyId);
      if (nodes.length !== 0) {
        this.departmentList = nodes[0].children;
      } else {
        nodeDatas.forEach(item => {
          this.getOrgTreeData(item.children);
        });
      }
    },
    getKeyResults() {
      getKeyResult({
        id: this.modifyTemplate.id
      }).then(res => {
        if (!res.error) {
          this.form = Object.assign({}, this.form, {
            krlist: res
          });
        }
      });
    },
    changeDepartment(val) {
      val = val[0];
      this.form.orgId = val;
      this.form = Object.assign({}, this.form, {
        fatherId: "",
        fatherName: "",
        parentKrId: "",
        parentKrName: ""
      });
      //公司目标
      if (!val) {
        this.fatherTargetForm = JSON.parse(
          JSON.stringify({
            orgId: this.form.companyId,
            tLevel: "0"
          })
        );
      } else {
        this.fatherTargetForm = JSON.parse(
          JSON.stringify({
            companyId: this.form.companyId,
            cycleId: this.form.cycleId
          })
        );
      }
      this.initFatherTarget = Object.assign({}, this.form, {
        target: "",
        id: ""
      });
    },
    //回传关联上级目标 关联上级目标变化 关键结果关联的关键结果列表也跟着变化
    changeFatherId() {
      getKeyResult({
        id: this.form.fatherId
      }).then(res => {
        if (!res.error) {
          this.fatherKeyResults = res;
        }
      });
    },
    changeCycle(val) {
      this.fatherTargetForm = JSON.parse(
        JSON.stringify({
          companyId: this.form.companyId,
          cycleId: val.id
        })
      );
      this.form = Object.assign({}, this.form, {
        cycleId: val.id,
        cycleName: val.cname
      });
      this.chearVal();
    },
    getFatherId(val) {
      this.form = Object.assign({}, this.form, {
        fatherId: val.id,
        fatherName: val.target,
        parentKrId: "",
        parentKrName: ""
      });
      this.changeFatherId();
    },
    //关联上级目标 清空
    chearVal() {
      this.form = Object.assign({}, this.form, {
        fatherId: "",
        fatherName: "",
        parentKrId: "",
        parentKrName: ""
      });
      this.initFatherTarget = {};
      this.$refs.fatherTarget && this.$refs.fatherTarget.clearChoose();
    },
    switchIsAnnual(state) {
      this.isAnnualTarget = state;
      this.form = Object.assign({}, this.form, {
        companyId: "",
        orgId: "",
        fatherId: "",
        fatherName: "",
        parentKrId: "",
        parentKrName: "",
        cycleId: "",
        cycleName: ""
      });
      this.$refs.periodRef.chearVal();
    }
  }
};
</script>

<style lang="scss">
.handleTargetDialog {
  .el-input,
  .el-select,
  .el-cascader {
    width: 280px;
  }
  .inputCtn {
    position: relative;
  }
  .inputCtn i.el-icon-error {
    color: #ccc;
    position: absolute;
    top: 9px;
    left: 128px;
    font-size: 12px;
    display: none;
  }
  .inputCtn:hover i.el-icon-error {
    display: inline-block;
  }
  .inputCtn i.clearIcon {
    left: 260px;
  }
  .participantCtn {
    display: flex;
    align-items: center;
    > div {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      > div {
        margin-right: 10px;
      }
    }
    .circleChoose {
      width: auto !important;
      padding: 0 10px;
      border-radius: 20px !important;
    }
    .circleSmall {
      width: 35px;
      height: 35px;
      background: $base-lightBlue-color;
      border: 1px dashed $base-lightBlue-color;
      border-radius: 50%;
      text-align: center;
      line-height: 35px;
      font-size: 0.8rem;
      color: #fff;
      position: relative;
      margin-bottom: 10px;
      a {
        color: #aaa !important;
        &:hover {
          color: #aaa !important;
        }
      }
      .name {
        width: 100%;
      }
      .name input {
        background: #58c2ef;
        border: none;
        padding: 0;
        text-align: center;
        color: #fff;
      }
      .deal {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        a {
          display: inline-block;
          height: 100%;
          width: 100%;
        }
      }
      &:hover {
        background: #fff;
        border: 1px dashed #aaa;
        .name input {
          background: #fff;
        }
        .deal {
          display: block;
          color: $base-lightBlue-color;
        }
      }
    }
    .dottedCircle {
      width: 25px !important;
      height: 25px !important;
      line-height: 25px !important;
      background: transparent;
      border: 1px dashed #aaa;
      color: #aaa;
      font-size: 0.8rem;
      cursor: pointer;
    }
  }
  .inform .circleSmall {
    &:hover {
      background: $base-lightBlue-color;
      border: 1px dashed $base-lightBlue-color;
      .deal {
        display: none;
      }
    }
  }
}
.el-select-dropdown__item {
  max-width: 350px;
  min-height: 34px;
  height: auto !important;
}
</style>
