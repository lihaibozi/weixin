//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    modalHidden: true,
    patientSex: '',
    patientAge: '',
    patientName: '',
    patientPhoneNumber: '',
    patientCardNo: '',
    patientAddress: ''
  },
  modalTap: function(e) {
    this.setData({
      modalHidden: false
    })
  },
  formSubmit: function(e) {
    var _this = this;
    this.setData({
      patientSex: e.detail.value.patientSex
    })
    this.setData({
      patientAge: e.detail.value.patientAge
    })
    this.setData({
      patientCardNo: e.detail.value.patientCardNo
    })
    this.setData({
      patientName: e.detail.value.patientName
    })
    this.setData({
      patientPhoneNumber: e.detail.value.patientPhoneNumber
    })
    this.setData({
      patientAddress: e.detail.value.patientAddress
    })
    if (this.data.patientName == 0) {
      this.setData({
        popErrorMsg: "姓名不能为空!"
      });
      this.ohShitfadeOut();
      return;
    } else if (this.data.patientAge.length == 0) {
      this.setData({
        popErrorMsg: "年龄信息输入有误!"
      });
      this.ohShitfadeOut();
      return;
    } else if (this.data.patientCardNo.length == 0 || !(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.data.patientCardNo))) {
      this.setData({
        popErrorMsg: "身份证信息输入有误!"
      });
      this.ohShitfadeOut();
      return;
    } else if (this.data.patientPhoneNumber.length == 0 || this.data.patientPhoneNumber.length != 11 || !(/^1[34578]\d{9}$/.test(this.data.patientPhoneNumber))) {
      this.setData({
        popErrorMsg: "手机号输入有误!"
      });
      this.ohShitfadeOut();
      return;
    }
    this.modalTap();
  },
  confirm_one: function(e) {
    var _this = this;
    console.log(e);
    this.setData({
      modalHidden: true,
      toast1Hidden: false,
      notice_str: '提交成功'
    })
    wx.request({
      url: 'https://jzxcx.bydsfy.com/kin/gh/patient/save',
      // url: 'http://localhost:8080/kin/gh/patient/save',
      data: {
        patientSex: this.data.patientSex,
        patientAge: this.data.patientAge,
        patientName: this.data.patientName,
        patientPhoneNumber: this.data.patientPhoneNumber,
        patientCardNo: this.data.patientCardNo,
        patientAddress: this.data.patientAddress,
        openId: getApp().globalData.userInfo.openId
      },
      method: 'POST',
      success: function(res) {
        if (res.data.result == 1) {
          wx.showToast({
            title: '录入成功！',
            icon: 'loading',
            duration: 1500
          })
          _this.setData({
            patientSex: '1',
            patientAge: '',
            patientName: '',
            patientPhoneNumber: '',
            patientCardNo: '',
            patientAddress: ''
          })
        } else {
          wx.showToast({
            title: '录入失败',
            icon: 'loading',
            duration: 1500
          })
        }

      },
      fail: function() {
        console.log('系统错误')
      }
    })
  },
  cancel_one: function(e) {
    console.log(e);
    this.setData({
      modalHidden: true,
      toast1Hidden: false,
      notice_str: '取消成功'
    });
  },
  ohShitfadeOut() {
    var fadeOutTimeout = setTimeout(() => {
      this.setData({
        popErrorMsg: ''
      });
      clearTimeout(fadeOutTimeout);
    }, 3000);
  }

})