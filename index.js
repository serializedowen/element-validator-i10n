import av from "async-validator";
import { FormItem } from "element-ui";
import { noop } from "element-ui/src/utils/util";

// // 1     this will produce warnings in console, annoy af
// const validate = FormItem.methods.validate
// FormItem.methods.validate = function() {
//   const prop = this.prop
//   this.prop = this.label
//   validate.call(this, arguments)
//   this.prop = prop
// }

// 2
FormItem.methods.validate = function validate(trigger, callback = noop) {
  this.validateDisabled = false;
  const rules = this.getFilteredRule(trigger);
  if ((!rules || rules.length === 0) && this.required === undefined) {
    callback();
    return true;
  }

  this.validateState = "validating";

  const descriptor = {};
  if (rules && rules.length > 0) {
    rules.forEach((rule) => {
      delete rule.trigger;
    });
  }
  descriptor[this.label] = rules;

  const validator = new av(descriptor);
  const model = {};

  model[this.label] = this.fieldValue;

  validator.validate(model, { firstFields: true }, (errors, invalidFields) => {
    this.validateState = !errors ? "success" : "error";
    this.validateMessage = errors ? errors[0].message : "";

    callback(this.validateMessage, invalidFields);
    this.elForm &&
      this.elForm.$emit(
        "validate",
        this.prop,
        !errors,
        this.validateMessage || null
      );
  });
};

const func = av.prototype.messages;

av.prototype.messages = function hijack() {
  return func.call(this, messages);
};

const messages = {
  default: "%s包含错误",
  required: "%s不能为空",
  enum: "%s必须是一个%s",
  whitespace: "%s不能为空",
  date: {
    format: "%s date %s不符合格式：%s",
    parse: "%s 日期无法被格式化, %s 格式错误 ",
    invalid: "%s date %s格式错误",
  },
  types: {
    string: "%s不是一个%s",
    method: "%s不是一个%s (function)",
    array: "%s不是一个数组",
    object: "%s不是一个对象",
    number: "%s is not a %s",
    date: "%s is not a %s",
    boolean: "%s is not a %s",
    integer: "%s is not an %s",
    float: "%s is not a %s",
    regexp: "%s is not a valid %s",
    email: "%s is not a valid %s",
    url: "%s is not a valid %s",
    hex: "%s is not a valid %s",
  },
  string: {
    len: "%s必须为%s个字符",
    min: "%s必须超过%s个字符",
    max: "%s不能超过%s个字符",
    range: "%s长度必须在%s和%s之间",
  },
  number: {
    len: "%s必须等于%s",
    min: "%s不能小于%s",
    max: "%s不能大于%s",
    range: "%s必须在%s和%s之间",
  },
  array: {
    len: "%s数组长度必须为%s",
    min: "%s数组长度不能小于%s ",
    max: "%s数组长度不能大于%s ",
    range: "%s数组长度必须在%s和%s之间",
  },
  pattern: {
    mismatch: "%s value %s does not match pattern %s",
  },
  clone: function clone() {
    var cloned = JSON.parse(JSON.stringify(this));
    cloned.clone = this.clone;
    return cloned;
  },
};
