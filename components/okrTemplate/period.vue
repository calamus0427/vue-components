<template>
  <div class="period">
    <el-select
      style="margin-right:1rem"
      v-if="useCompany"
      v-model="companyId"
      placeholder="请选择公司"
      :clearable="CompanyClearable"
      @change="changeCompany"
    >
      <el-option v-for="item in companyList" :key="item.id" :label="item.orgName" :value="item.id"></el-option>
    </el-select>
    <el-select
      style="margin-right:1rem"
      v-if="useDepartment"
      v-model="departmentId"
      placeholder="请选择部门"
      :clearable="departmentClearable"
      @change="changeDepartment"
    >
      <el-option
        v-for="item in departmentList"
        :key="item.id"
        :label="item.orgName"
        :value="item.id"
      ></el-option>
    </el-select>
    <el-popover v-if="usePeriod" placement="bottom" width="500" trigger="click" v-model="visible">
      <div>
        <el-date-picker
          v-model="dataRange"
          type="daterange"
          range-separator="～"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          unlink-panels
          :picker-options="pickerOptions2"
          @change="changeDataRange"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
        <el-table
          :data="tableData"
          @current-change="handleCurrentChange"
          tooltip-effect="light"
          v-loading="isListLoading"
          highlight-current-row
          ref="singleTable"
        >
          <el-table-column label="选择" width="50" center>
            <template slot-scope="scope">
              <el-radio
                class="radio"
                v-model="radio"
                :label="scope.$index"
                @change.native="getCurrentRow(scope.$index)"
                :disabled="handleIsDisabled(scope.row)"
              >&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="cname" label="周期名称" min-width="120" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{handleQuarterType(scope.row)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="开始日期" min-width="120" max-width="180"></el-table-column>
          <el-table-column prop="endTime" label="结束日期" min-width="120" max-width="180"></el-table-column>
        </el-table>
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page.sync="pagination.pageNum"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          @current-change="changePage"
        ></el-pagination>
      </div>
      <div class="inputCtn" slot="reference">
        <el-input
          prefix-icon="xhefont xhe-zhouqiguanli"
          :readonly="true"
          size="mini"
          style="width:150px"
          v-model="period.cname"
          suffix-icon="el-icon-arrow-down"
          placeholder="选择周期"
        ></el-input>
        <i v-if="periodClearable" class="el-icon-error" @click.stop="chearVal"></i>
      </div>
    </el-popover>
  </div>
</template>

<script>
import { setSession, getSession } from "@/utils/session";
import { contains } from "@/utils/getObjIndex";
import { getPeriodList, getChildList } from "@/api/okr";
import { getOrgTree, deleteOrgNode } from "@/api/organization";

export default {
  name: "PeriodSelect",
  data() {
    return {
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近半年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      period: {},
      companyId: "",
      departmentId: "",
      companyList: [],
      departmentList: [],
      isListLoading: false,
      currentRow: null,
      radio: false,
      tableData: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      searchForm: {},
      dataRange: [],
      preCurrentRow: {},
      initTree: [],
      visible: false
    };
  },
  props: {
    usePeriod: {
      type: Boolean,
      default: true
    },
    useCompany: {
      type: Boolean,
      default: false
    },
    useDepartment: {
      type: Boolean,
      default: false
    },
    //公司允许清除
    CompanyClearable: {
      type: Boolean,
      default: false
    },
    periodClearable: {
      type: Boolean,
      default: false
    },
    departmentClearable:{
      type:Boolean,
      default:false
    },
    initValue: {
      type: Object
    },
    isSettingDefault: {
      type: Boolean,
      default: false
    },
    showPeriodType: {
      type: String
    },
    setUniqDepartmentList: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    useDepartment(newVal, oldVal) {
      if (newVal) {
        this.getUniqDepartment();
      }
    },
    companyId(newVal, oldVal) {
      if ((newVal || oldVal) && this.useDepartment) {
        this.getUniqDepartment();
      }
    }
  },
  computed: {},
  mounted() {
    this.getCycleList();
    this.getDepartmentList();
    if (this.initValue) {
      this.chooseData = JSON.parse(JSON.stringify(this.initValue));
    }
    // this.initChooseData();
    // this.handleCurrentChange(
    //   this.initValue && this.initValue.id ? this.initValue : this.preCurrentRow
    // ); //初次加载默认选择列表第一条数据
  },
  methods: {
    initChooseData(initValue) {
      if (initValue && initValue.id) {
        let index = contains(this.tableData, initValue);
        if (index > -1) {
          this.period = Object.assign({}, this.period, {
            cname: this.handleQuarterType(this.tableData[index]),
            id: this.tableData[index].id
          });
          this.radio = index;
        } else {
          this.radio = false;
        }
      } else {
        this.isSettingDefault && this.handleCurrentChange(this.tableData[0]);
      }
    },
    getUniqDepartment() {
      if (this.setUniqDepartmentList) {
        this.getUniqDepartmentList();
      } else {
        let list = this.companyId
          ? this.initTree.filter(item => {
              return item.pId == this.companyId;
            })
          : [];
        if (this.isSettingDefault) {
          this.departmentId = list.length > 0 ? list[0].id : "";
        }
        this.departmentList = list;
      }
    },
    async getUniqDepartmentList() {
      await getChildList({ orgId: this.companyId }).then(res => {
        this.departmentList = res;
        if (this.isSettingDefault) {
          this.departmentId = res.length > 0 ? res[0].id : "";
        }
        this.$emit("changeDepartment", this.departmentId);
      });
    },
    handleCurrentChange(val) {
      let state = this.handleIsDisabled(val);
      if (val && !state) {
        this.preCurrentRow = val;
        this.currentRow = val;
        let index = this.tableData.findIndex(
          item => item.id == this.currentRow.id
        );
        if (index > -1) {
          this.radio = index;
          val.cname = this.handleQuarterType(val);
          val = JSON.parse(JSON.stringify(val));
          this.period = val;
          this.visible = false;
          this.$emit("changeCycle", val);
        } else {
          this.radio = false;
        }
      }
    },
    getCurrentRow(index) {
      console.log(index);
    },
    changeCompany(companyId) {
      this.companyId = companyId;
      this.departmentId = "";
      this.$emit("changeCompany", this.companyId);
    },
    changeDepartment(departmentId) {
      this.departmentId = departmentId;
      this.$emit("changeDepartment", this.departmentId);
    },
    chearVal() {
      this.period = {};
      this.radio = false;
      this.preCurrentRow = null;
      this.currentRow = null;
      this.$refs.singleTable.setCurrentRow();
      this.pagination.pageNum = 1;
      this.$emit("changeCycle", "");
    },
    changePage(number) {
      this.pagination.pageNum = number;
      this.getCycleList();
    },
    getDepartmentList() {
      let res;
      if (this.$store.getters.orgList.length > 0) {
        res = this.$store.getters.orgList;
        if (res.length > 0) {
          this.initTree = res;
          this.companyList = res.filter(item => {
            return item.orgType == "0";
          });
          if (this.isSettingDefault) {
            this.companyId =
              this.companyList.length > 0 ? this.companyList[0].id : "";
          }
        } else {
          this.companyList = [];
          this.companyId = "";
          this.departmentList = [];
          this.departmentId = " ";
        }
        this.$emit("changeCompany", this.companyId);
      } else {
        getOrgTree().then(res => {
          if (!res.error) {
            if (res.length > 0) {
              this.initTree = res;
              this.companyList = res.filter(item => {
                return item.orgType == "0";
              });
              if (this.isSettingDefault) {
                this.companyId =
                  this.companyList.length > 0 ? this.companyList[0].id : "";
              }
            } else {
              this.companyList = [];
              this.companyId = "";
              this.departmentList = [];
              this.departmentId = " ";
            }
            this.$emit("changeCompany", this.companyId);
          }
        });
      }
    },
    async getCycleList() {
      this.isListLoading = true;
      this.searchForm = Object.assign({}, this.searchForm, {
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize
      });
      await getPeriodList(this.searchForm).then(res => {
        if (!res.error) {
          this.isListLoading = false;
          this.tableData = res.item;
          this.pagination.total = res.total;
        }
      });
      // this.preCurrentRow =
      //   this.preCurrentRow && this.preCurrentRow.id
      //     ? this.preCurrentRow
      //     : this.tableData.length > 0
      //     ? this.tableData[this.tableData.length - 1]
      //     : null;
      this.initChooseData(this.chooseData);
      // this.handleCurrentChange(this.preCurrentRow);
    },
    changeDataRange(val) {
      if (val) {
        this.searchForm = Object.assign({}, this.searchForm, {
          startTime: val[0],
          endTime: val[1]
        });
      } else {
        this.searchForm = Object.assign({}, this.searchForm, {
          startTime: "",
          endTime: ""
        });
      }
      this.getCycleList();
    },
    clearChooseData() {
      this.companyId = "";
      this.departmentId = "";
      this.period = {};
      this.radio = false;
    },
    handleQuarterType(row) {
      let year = row.year,
        name = "";
      switch (row.quarterType) {
        case "1":
          name = "第一季度";
          break;
        case "2":
          name = "第二季度";
          break;
        case "3":
          name = "第三季度";
          break;
        case "4":
          name = "第四季度";
          break;
        case "5":
          name = "年度";
          break;
      }
      return year + " " + name;
    },
    handleIsDisabled(row) {
      let state = false;
      switch (this.showPeriodType) {
        case "quarter":
          state = row.quarterType == "5" ? true : false;
          break;
        case "year":
          state = row.quarterType == "5" ? false : true;
          break;
      }
      return state;
    }
  }
};
</script>
<style scoped>
.period {
  display: flex;
}
.inputCtn {
  position: relative;
}
.inputCtn i {
  color: #ccc;
  position: absolute;
  top: 8px;
  left: 128px;
  font-size: 12px;
  display: none;
}
.inputCtn:hover i {
  display: inline-block;
}
</style>

