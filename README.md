# element-validator-i10n


汉化element-ui的表单校验


# 原理
1. 劫持async-validator的message()方法 调用返回自定义的message
2. 劫持el-form-item的validate方法  用this.label的值代替this.prop的值作为key传入async-validator






随意取用  欢迎PR
