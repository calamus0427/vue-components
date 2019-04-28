<template>
  <div>
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
          <el-table-column label="选择" width="50" center>
            <template slot-scope="scope">
              <el-radio class="radio" v-model="radio" :label="scope.$index">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="target" label="目标" :show-overflow-tooltip="true" width="150"></el-table-column>
          <el-table-column
            prop="cycleName"
            label="周期"
            min-width="120"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="creatorName"
            label="创建者"
            min-width="80"
            :show-overflow-tooltip="true"
          ></el-table-column>
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
import CommonTable from "@/components/commonTable";
import { getOrgCycleTargets, getOrgReviewedTarget } from "@/api/okr";
import { contains } from "@/utils/getObjIndex";

export default {
  name: "targetSelect",
  components: {
    CommonTable
  },
  data() {
    return {
      isListLoading: false,
      currentRow: null,
      preCurrentRow: null,
      radio: false,
      tableData: [],
      pagination: {
        // 翻页数据
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  props: {
    searchParams: {
      type: Object,
      default: () => {}
    },
    initValue: {
      type: Object
    },
    showTargetType: {
      type: String
    },
    targetType: {
      type: String
    }
  },
  watch: {
    searchParams: {
      deep: true,
      handler(options, oldOptions) {
        this.getList();
      }
    },
    targetType() {
      this.getList();
    },
    initValue() {
      this.initChooseData();
    }
  },
  mounted() {
    this.getList();
    if (this.initValue.id) {
      this.initChooseData();
    }
  },
  methods: {
    initChooseData() {
      if (this.initValue.id) {
        let index = contains(this.tableData, this.initValue);
        if (index > -1) {
          this.radio = index;
        } else {
          this.radio = false;
        }
      } else {
        this.radio = false;
      }
    },
    getList() {
      let searchParams = Object.assign({}, this.searchParams, {
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize
      });
      if (this.targetType == "department") {
        if (searchParams.companyId && searchParams.cycleId) {
          this.isListLoading = true;
          getOrgCycleTargets(searchParams).then(res => {
            if (!res.error) {
              this.isListLoading = false;
              this.tableData = res.item;
              this.pagination.total = res.total;
              this.initChooseData();
              this.handleCurrentChange();
            }
          });
        } else {
          this.tableData = [];
          this.pagination.total = 0;
        }
      } else {
        getOrgReviewedTarget(searchParams).then(res => {
          if (!res.error) {
            this.isListLoading = false;
            this.tableData = res.item;
            this.pagination.total = res.total;
            this.initChooseData();
            this.handleCurrentChange();
          }
        });
      }
    },
    changePage(pageNum) {
      this.pagination.pageNum = pageNum;
      this.radio = false;
      this.selectRow = [];
      this.getList();
    },
    handleCurrentChange(val) {
      let state = this.handleIsDisabled(val);
      if (val && !state) {
        // this.preCurrentRow = val;
        this.currentRow = val;
        let index = this.tableData.findIndex(
          item => item.id == this.currentRow.id
        );
        if (index > -1) {
          this.radio = index;
        }
        this.$emit("sendData", JSON.parse(JSON.stringify(val)));
      }
    },
    clearChoose() {
      this.radio = false;
      // this.preCurrentRow = null;
      this.currentRow = null;
      this.$refs.orderTable.setCurrentRow();
      this.pagination.pageNum = 1;
    },
    handleIsDisabled(row) {
      if (row) {
        let state = false;
        switch (this.showTargetType) {
          case "quarter":
            state = row.fatherId ? false : true;
            break;
          case "year":
            state = row.fatherId ? true : false;
            break;
        }
        return state;
      }
    }
  }
};
</script>

