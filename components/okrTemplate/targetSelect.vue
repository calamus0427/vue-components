<template>
  <div class="period">
    <common-table>
      <template slot="table">
        <el-table
          :data="tableData"
          ref="orderTable"
          @current-change="handleCurrentChange"
          tooltip-effect="light"
          v-loading="isListLoading"
          highlight-current-row
        >
          <el-table-column label="选择" width="50" center >
            <template slot-scope="scope">
              <el-radio
                class="radio"
                v-model="radio"
                :label="scope.$index"
                @change.native="getCurrentRow(scope.$index)"
              >&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="target" label="目标" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="targetProcess" label="进度" width="70"></el-table-column>
          <el-table-column prop="cycleName" label="周期"  min-width="120" :show-overflow-tooltip="true"></el-table-column>
        </el-table>
      </template>
      <template slot="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page.sync="pagination.pageNum"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          @current-change="changePage"
        ></el-pagination>
      </template>
    </common-table>
  </div>
</template>

<script>
import { setSession, getSession } from "@/utils/session"
import { contains } from "@/utils/getObjIndex"
import CommonTable from "@/components/commonTable"
import { getAllUserList,getOrgTarget } from "@/api/okr"

export default {
  name: "PeriodSelect",
  components: {
    CommonTable
  },
  data() {
    return {
      period: getSession("periodData"),
      isListLoading: false,
      currentRow: null,
      radio: false,
      tableData: [],
      cycleList:this.$store.getters.cycleList,
      componyList: this.$store.getters.orgList.filter(compony => {
        return compony.orgType == "0";
      }),
      pagination: {
        // 翻页数据
        pageNum: 1,
        pageSize: 3,
        total: 0
      }
    };
  },
  props: {
    chooseData: {
      type: Object
    },
    index: {
      type: Number
    },
    compony:{
      type:String,
    },
    select:{
      type:Object
    }
  },
  mounted() {
    this.getList();
  },
  watch:{
    compony (newVal, oldVal) {
        if(newVal){
          this.getList()
        }
      }
  },
  methods: {
    getList() {
      this.isListLoading = true;
      let params = {
        orgId: this.compony,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize
      }
      getOrgTarget(params).then(res => {
        if (!res.error) {
          this.radio = false
          this.isListLoading = false;
          this.tableData = res.item;
          this.pagination.total = res.total;
          if(this.select.id){
              this.getInitChoose()
          }
        }
      });
      this.pagination.total = this.tableData.length;
    },
    getInitChoose() {
      this.currentRow =  this.select
      let index = contains(this.tableData, this.currentRow);
      if (index > -1) {
        this.radio = index;
      }
    },
    changePage(pageNum) {
      this.pagination.pageNum = pageNum;
      this.radio = false;
      this.selectRow = [];
      this.queryList(this.searchParams);
    },
    handleCurrentChange(val) {
      if (val) {
        this.currentRow = val;
        let index = this.tableData.indexOf(this.currentRow);
        if (index > -1) {
          this.radio = index;
        }
        if (this.index !== undefined) {
          this.$emit("sendData", {
            index: this.index,
            val: JSON.parse(JSON.stringify(val))
          });
        } else {
          this.$emit("sendData", {index:null,val:JSON.parse(JSON.stringify(val))});
        }
      }
    },
    getCurrentRow(index) {
      console.log(index);
    },
    clearChoose() {
      this.radio = false;
      this.currentRow = null;
      this.$refs.orderTable.setCurrentRow();
    },
    formatSex(row) {
      return row.userGender == 1 ? "男" : row.userGender == 0 ? "女" : "未知";
    },
  }
};
</script>

