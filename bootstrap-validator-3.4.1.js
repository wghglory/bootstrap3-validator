/**
 * work with bootstrap 3.4.1
 */

(function(global, factory, plug) {
  return factory.call(global, global.jQuery, plug);
})(
  this,
  function($, plug) {
    // 默认参数
    var __DEFAULTS__ = {
      raise: 'change',
      errorMessage: 'Wrong value...',
    };

    /*
		require 必填项
		regex 正则验证
		length 长度限制
		minlength 最小长度
		maxlength 最大长度
		between 两者长度之间 8-8
		equalto 和XX相等
		greaterthan 大于 17
		lessthan 小于 101
		range 两个数值之间 18-100
		integer 必须是整数
		number 必须是数字
		email 必须是邮箱地址
		mobile 必须是手机号码
		phone 必须是电话号码 xxxx-xxxxxxxx
		uri 必须是有效的统一资源标示符
			uri和url的关系  如果这个序列是url，你可以说它是uri；如果这个序列是uri，它不见得是url

    // ...其他的规则（根据业务规则来）
    // cardId 身份证号码
    // bankId 银行卡号码
	 */
    var __RULES__ = {
      require: function() {
        return !!this.val();
      }, // 必填项
      regex: function() {
        return new RegExp(this.data('bv-regex')).test(this.val());
      }, // 正则验证
      length: function() {
        return this.val().length === Number(this.data('bv-length'));
      }, // 长度限制
      minlength: function() {
        return this.val().length >= Number(this.data('bv-minlength'));
      }, // 最小长度
      maxlength: function() {
        return this.val().length <= Number(this.data('bv-maxlength'));
      }, // 最大长度
      between: function() {
        var length = this.val().length;
        var between = this.data('bv-between').split('-');
        return length >= Number(between[0]) && length <= Number(between[1]);
      }, // 两者长度之间 8-8
      equalto: function() {
        if ($(this.data('bv-equalto')).val() === this.val()) {
          $(this.data('bv-equalto'))
            .parents('.form-group')
            .removeClass('has-error')
            .addClass('has-success')
            .next('span')
            .remove();
          return true;
        }
        return false;
      }, // 和XX相等
      greaterthan: function() {
        return this.val() > Number(this.data('bv-greaterthan'));
      }, // 大于 17
      lessthan: function() {
        return this.val() < Number(this.data('bv-lessthan'));
      }, // 小于 101
      range: function() {
        var value = this.val();
        var range = this.data('bv-range').split('-');
        return value >= Number(range[0]) && value <= Number(range[1]);
      }, // 两个数值之间 18-100
      integer: function() {
        return /^\-?[0-9]*[1-9][0-9]*$/.test(this.val());
      }, // 必须是整数
      number: function() {
        return !isNaN(Number(this.val()));
      }, // 必须是数字
      email: function() {
        return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(
          this.val(),
        );
      }, // 必须是邮箱地址
      mobile: function() {
        return /^1\d{10}$/.test(this.val());
      }, // 必须是手机号码
      phone: function() {
        return /^\d{4}\-\d{8}$/.test(this.val());
      }, // 必须是电话号码 xxxx-xxxxxxxx
      url: function() {
        return /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g.test(
          this.val(),
        );
      }, // 必须是有效的统一资源标示符
      amount: function() {
        if (!this.val()) return true;
        return /^([1-9][\d]{0,}|0)(\.[\d]{1,2})?$/.test(this.val());
      },
      date: function() {
        //yyyy-MM-dd
        if (!this.val()) return true;
        return /^([1-9][\d]{0,}|0)(\.[\d]{1,2})?$/.test(this.val());
      },
    };

    //原型功能
    var __PROTOTYPE__ = {
      _init: function() {
        //初始化目标验证对象
        this.$fields = this.find('[data-bv]');
      },
      //封装了自定义事件的触发机制
      _attachEvent: function(event, args) {
        this.trigger(event, args);
      },
      _bind: function() {
        var _$this = this;
        this.raise = this.data('bv-raise') || this.raise || __DEFAULTS__.raise;

        //事件功能绑定
        this.$fields.on(this.raise, function() {
          var $field = $(this); //被验证的表单元素
          var $group = $field.parents('.form-group').removeClass('has-error has-success');
          $group.find('.help-block').remove(); //移除之前的错误提示

          var result = true; //本次验证结果，默认为true

          $.each(__RULES__, function(key, rule) {
            if ($field.data('bv-' + key)) {
              //call方法的作用用一句话来说明，调用rule函数的时候，rule函数里面的this引用变成了$field
              result = rule.call($field);
              !result &&
                $field.after(
                  '<span class="help-block">' +
                    ($field.data('bv-' + key + '-message') || _$this.errorMessage) +
                    '</span>',
                );
              return result;
            }
          });
          $group.addClass(result ? 'has-success' : 'has-error');
        });

        this.on('submit', function() {
          var $groups = _$this.$fields.trigger(_$this.raise).parents('.form-group');
          if ($groups.filter('.has-error').size() === 0) {
            _$this._attachEvent('success', {});
          } else {
            _$this._attachEvent('error', {});
          }
          return false;
        });
      },
    };

    $.fn[plug] = function(options) {
      if (!this.is('form')) {
        //判断目标是否form标签，如果不是则程序抛出异常
        throw new Error('the target is not form tag');
      }
      $.extend(this, __DEFAULTS__, options, __PROTOTYPE__);
      this._init();
      this._bind();
      return this;
    };

    $.fn[plug].extendRules = function(news) {
      $.extend(__RULES__, news); //扩展规则
    };
  },
  'bootstrapValidator',
);
