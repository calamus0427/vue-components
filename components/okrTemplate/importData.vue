<template>
  <el-dialog title="导入数据" :visible.sync="isVisible" width="30%" @close="handleCancel">
    <div class="flexCtn">
      <el-button size="mini" @click.stop="downloadTemplate">模版下载</el-button>
      <div>
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="actionUrl"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :limit="1"
          :headers="myHeaders"
          :auto-upload="false"
          :on-change="changeFile"
          :show-file-list="false"
          :on-exceed="exceedLimit"
          accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        >
          <el-button size="mini" type="primary">选取文件</el-button>
        </el-upload>
        <el-tooltip class="item" effect="light" :content="file.name" placement="bottom-start">
          <span style="line-height: 32px;">{{file.name}}</span>
        </el-tooltip>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="submitUpload">上传</el-button>
    </span>
  </el-dialog>
</template>
<script>
// params:
//  dialogVisible Boolean 显示与否
//  pageType  String 用户信息导入/组织机构
//methods:
//  updateList
import { BASE_PER_FIX_URL } from "@/utils/baseUrlPerFix.js";
import { getToken } from "@/utils/auth.js";

const token = getToken();
export default {
  name: "importData",
  data() {
    return {
      isVisible: false,
      actionUrl: "",
      myHeaders: { Authorization: token }, // 添加认证码
      file: {}
    };
  },
  watch: {
    dialogVisible(isShow) {
      this.isVisible = isShow;
      if (isShow) {
        this.actionUrl =
          BASE_PER_FIX_URL +
          (this.pageType == "user" ? "/user/excelImport" : "");
      } else {
        this.actionUrl = "";
        this.file = {};
      }
    }
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    pageType: {
      type: String
    }
  },

  methods: {
    handleCancel() {
      this.$emit("update:dialogVisible", false);
      this.isVisible = false;
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    downloadTemplate() {
      let url;
      if (this.pageType == "organization") {
        url = "组织机构模板地址";
      } else {
        //用户模板
        url =
          "http://xhe.oss-cn-hangzhou.aliyuncs.com/okr/OKR-%E7%94%A8%E6%88%B7%E7%BB%84%E7%BB%87%E6%9C%BA%E6%9E%84%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx";
      }
      window.open(url);
    },
    handleFileType(file, fileList) {
      let fileType = "";
      try {
        let fileName = file.name.split(".");
        fileType = fileName[fileName.length - 1];
      } catch (err) {
        fileType = "";
      }
      if (!fileType) {
        this.$message({
          type: "warning",
          message: "请选择正确的文件"
        });
        return false;
      }
      let imglist = [
        "xls",
        "XLS",
        "xlsx",
        "XLSX",
        "xlsm",
        "XLSM",
        "xltx",
        "XLTX",
        "xltm",
        "XLTM"
      ];
      // 进行表格匹配
      let result = imglist.some(item => {
        return item == fileType;
      });
      if (!result) {
        this.$message({
          type: "warning",
          message: "请选择正确的文件"
        });
        return false;
      } else {
        this.file = file;
      }
    },
    uploadSuccess(res) {
      if (res.head.code == 200 && res.head.success == "true") {
        this.$message({
          type: "success",
          message: "导入成功！"
        });
        this.$emit("queryList", {});
        this.handleCancel();
      } else if (res.head.code == 201 && res.head.success == "false") {
        this.$message({
          type: "warning",
          message: res.head.msg
        });
      }
    },
    uploadError(err) {
      this.$message({
        type: "error",
        message: "导入失败！"
      });
    },
    changeFile(file, fileList) {
      this.handleFileType(file);
    },
    exceedLimit(newFile, oldFile) {
      this.handleFileType(newFile[0]);
    }
  }
};
</script>
<style scoped>
.flexCtn {
  display: flex;
  align-items: baseline;
}
.flexCtn .el-button {
  margin-right: 10px;
}
.flexCtn > div {
  width: calc(100% - 90px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
