function makeResponse(data) {
  return data
}

export default {
  'GET /borrower/v1/auth/me/preferredline': makeResponse({
    "code": 0,
    "message": "success",
    "data": {
      "vendorAgentGroupId": "9",
      "callLogUrl": "",
      "agentNo": "200004017",
      "authAccount": null,
      "authpwd": null,
      "vendorType": "COCC",
      "orgidentity": "cs02",
      "endpoint": "https://drcrm7443.cloudox.net:7443",
      "agentPwd": "200004017",
      "vendorModelId": "9",
      "extNo": "2496",
      "agentPwdMd5": "b5ab0ab2ffd7f2dd021d53c7aeb743ba",
    }
  }),
  'GET /borrower/v1/auth/me/info': makeResponse({
    "code": 0,
    "message": "success",
    "data": {
      "id": 11322462,
      "name": "sales_cdu_leader1",
      "email": "sales_cdu_leader1@dianrong.com",
      "phone": "19911111111",
      "createDate": "2015-08-18 15:17:25",
      "lastUpdate": "2017-05-18 11:16:59",
      "status": 0,
      "userGroupType": null,
      "roleChecked": null,
      "groupId": 100285,
      "groupName": "组1",
      "groupCode": "CRM_5",
      "roleTag": "LEADER",
      "roleType": "LEADER",
      "visitor": false
    }
  }),
  'POST /borrower/v1/auth/me/line': makeResponse({
    "code": 0,
    "message": "success",
    "data": {
      "userId": 11322462,
      "agentId": "100022",
      "agentPwd": "3424234",
      "agentPwdMd5": "70314ca6c279ed0aa1d108f91c088ca5",
      "ipUrl": "https://drcrm9443.cloudox.net:9443",
      "orgidentity": "cs3",
      "callLogUrl": "",
      "agentGroupId": 9,
      "extensionNo": '78999',
      "modelId": 9,
      "vendorAccountId": 10000,
      "vendorType": "COCC",
      "agenttype": null,
      "agentGroups": [{
        "id": "9_9",
        "name": "电销组"
      }
      ]
    }
  }),
  'PUT /borrower/v1/auth/me/lines/bound': makeResponse({
    "code": 0,
    "message": "success",
    "data": {
      "userId": 11322462,
      "agentId": "100022",
      "agentPwd": "100022",
      "agentPwdMd5": "70314ca6c279ed0aa1d108f91c088ca5",
      "ipUrl": "https://drcrm9443.cloudox.net:9443",
      "orgidentity": "cs3",
      "callLogUrl": "",
      "agentGroupId": 9,
      "extensionNo": "88888",
      "modelId": 9,
      "vendorAccountId": 10000,
      "vendorType": "COCC",
      "agenttype": null,
      "agentGroups": null
    }
  }),
  'PUT /borrower/v1/auth/me/lines/unbind': makeResponse({
    "code": 0,
    "message": "success",
    "data": {
      "userId": 11322462,
      "agentId": "100022",
      "agentPwd": "100022",
      "agentPwdMd5": "70314ca6c279ed0aa1d108f91c088ca5",
      "ipUrl": "https://drcrm9443.cloudox.net:9443",
      "orgidentity": "cs3",
      "callLogUrl": "",
      "agentGroupId": 9,
      "extensionNo": null,
      "modelId": 9,
      "vendorAccountId": 10000,
      "vendorType": "COCC",
      "agenttype": null,
      "agentGroups": null
    }
  }),
  'POST /borrower/v1/auth/me/lines/:id': makeResponse({
    "code": 0,
    "message": "success",
    "data": {
      "userId": 11322462,
      "agentId": "100022",
      "agentPwd": "100022",
      "agentPwdMd5": "70314ca6c279ed0aa1d108f91c088ca5",
      "ipUrl": "https://drcrm9443.cloudox.net:9443",
      "orgidentity": "cs3",
      "callLogUrl": "",
      "agentGroupId": 9,
      "extensionNo": '676757',
      "modelId": 9,
      "vendorAccountId": 10000,
      "vendorType": "COCC",
      "agenttype": null,
      "agentGroups": null
    }
  }),
'GET /borrower/v1/auth/me/navlinks' : makeResponse({
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": 1,
      "label": "任务管理",
      "link": "",
      "children": [
        {
          "id": 2,
          "label": "我的任务",
          "link": "/borrower/myTasks",
          "children": []
        }, {
          "id": 3,
          "label": "团队任务",
          "link": "/borrower/teamTasks",
          "children": []
        }, {
          "id": 4,
          "label": "未分配任务",
          "link": "/borrower/no-sales-tasks",
          "children": []
        }, {
          "id": 5,
          "label": "银联pos查询",
          "link": "/borrower/unionPay",
          "children": []
        }, {
          "id": 6,
          "label": "借款信息查询",
          "link": "/borrower/borrowerLoanInfo",
          "children": []
        }, {
          "id": 7,
          "label": "复议审核",
          "link": "/borrower/reAudit",
          "children": []
        }, {
          "id": 8,
          "label": "站内信",
          "link": "/borrower/notification",
          "children": []
        }, {
          "id": 9,
          "label": "站内信配置",
          "link": "/borrower/notifiySetting",
          "children": []
        }
      ]
    }, {
      "id": 10,
      "label": "通话管理",
      "link": "",
      "children": [
        {
          "id": 11,
          "label": "我的通话记录",
          "link": "/borrower/callrecords",
          "children": []
        }, {
          "id": 12,
          "label": "录音记录",
          "link": "/borrower/records",
          "children": []
        }, {
          "id": 13,
          "label": "录音记录",
          "link": "/borrower/records_new",
          "children": []
        }, {
          "id": 14,
          "label": "我的录音库",
          "link": "/borrower/privaterecords",
          "children": []
        }, {
          "id": 15,
          "label": "公共录音库",
          "link": "/borrower/publicrecords",
          "children": []
        }, {
          "id": 16,
          "label": "我的分享记录",
          "link": "/borrower/sharedrecords",
          "children": []
        }
      ]
    }, {
      "id": 17,
      "label": "报表管理",
      "link": "",
      "children": [
        {
          "id": 18,
          "label": "通话记录报表",
          "link": "/borrower/call-record-report",
          "children": []
        }, {
          "id": 19,
          "label": "任务统计报表",
          "link": "/borrower/taskStatistics",
          "children": []
        }, {
          "id": 20,
          "label": "贷款申请表",
          "link": "/borrower/loan_application_report",
          "children": []
        }, {
          "id": 21,
          "label": "还款提醒表",
          "link": "/borrower/loan_repayment_report",
          "children": []
        }, {
          "id": 22,
          "label": "电话统计报表",
          "link": "/borrower/tellphone-statistics-report",
          "children": []
        }
      ]
    }, {
      "id": 23,
      "label": "消息管理",
      "link": "",
      "children": [
        {
          "id": 24,
          "label": "我的记录",
          "link": "/borrower/sms-my-record",
          "children": []
        }, {
          "id": 25,
          "label": "所有记录",
          "link": "/borrower/sms-all-record",
          "children": []
        }, {
          "id": 26,
          "label": "群发消息",
          "link": "/borrower/sms-send",
          "children": []
        }, {
          "id": 27,
          "label": "消息模板",
          "link": "/borrower/sms-template",
          "children": []
        }
      ]
    }, {
      "id": 29,
      "label": "客户管理",
      "link": "",
      "children": [
        {
          "id": 30,
          "label": "我的用户",
          "link": "/borrower/myCustomers",
          "children": []
        }, {
          "id": 31,
          "label": "所有用户",
          "link": "/borrower/allCustomers",
          "children": []
        }, {
          "id": 32,
          "label": "未分配用户",
          "link": "/borrower/undistributed-customer",
          "children": []
        }, {
          "id": 33,
          "label": "新增用户",
          "link": "/borrower/toAddborrowcustomer",
          "children": []
        }, {
          "id": 34,
          "label": "失败历史",
          "link": "/borrower/toUploadFialedList",
          "children": []
        }
      ]
    }, {
      "id": 35,
      "label": "创建借款",
      "link": "",
      "children": [
        {
          "id": 36,
          "label": "创建借款",
          "link": "/borrower/createLoan",
          "children": []
        }
      ]
    }, {
      "id": 37,
      "label": "工单",
      "link": "",
      "children": [
        {
          "id": 38,
          "label": "所有工单",
          "link": "/borrower/allTicket",
          "children": []
        }, {
          "id": 39,
          "label": "我的工单",
          "link": "/borrower/myTicket",
          "children": []
        }
      ]
    }, {
      "id": 40,
      "label": "信息管理",
      "link": "",
      "children": [
        {
          "id": 41,
          "label": "公告管理",
          "link": "/borrower/notice",
          "children": []
        }, {
          "id": 42,
          "label": "知识库管理",
          "link": "/borrower/knowledge",
          "children": []
        }, {
          "id": 43,
          "label": "我的收藏",
          "link": "/borrower/collection",
          "children": []
        }, {
          "id": 44,
          "label": "新增信息",
          "link": "/borrower/article-add",
          "children": []
        }, {
          "id": 45,
          "label": "分类管理",
          "link": "/borrower/sortManage",
          "children": []
        }, {
          "id": 46,
          "label": "组和Tag管理",
          "link": "/borrower/cms-group",
          "children": []
        }
      ]
    }, {
      "id": 47,
      "label": "配置",
      "link": "",
      "children": [
        {
          "id": 48,
          "label": "任务配置",
          "link": "/borrower/task-delay",
          "children": []
        }, {
          "id": 49,
          "label": "过滤",
          "link": "",
          "children": [
            {
              "id": 50,
              "label": "销售过滤",
              "link": "/borrower/assignActorRuleConfig",
              "children": []
            }, {
              "id": 51,
              "label": "任务状态",
              "link": "/borrower/assignActorTaskStatusConfig",
              "children": []
            }
          ]
        }
      ]
    }
  ]
}),
'POST /borrower/v1/condition/operationresult' : makeResponse({
    'code': 0,
    "message": "success",
    'data': [{
      'name': 'xx',
      'id': 1
    },
    {
      'name': 'yy',
      'id': 2
    }
    ]
  }),
  'GET /borrower/v1/condition/operationdetail': makeResponse({
    'code': 0,
    "message": "success",
    'data': [{
      'name': 'r1',
      'id': 1234
    },
    {
      'name': 'r2',
      'id': 678
    }
    ]
  }),
  'GET /borrower/v1/condition/productcode': makeResponse({
    'code': 0,
    "message": "success",
    'data': [{
      'name': '寿险贷',
      'id': 'sxd'
    },{
      'name': '新贵贷',
      'id': 'xgd'
    }
    ]
  }),
  'GET /borrower/v1/report/borrowtask/files': {
    "code": 0,
    "data": {
      "records": [{
        "fileName": "name1",
        "creationDate": 325543565464234242,
        "fileStatus": "GENERATE_SUCCESS"
      }, {
        "fileName": "name2",
        "creationDate": 325543565464234242,
        "fileStatus": "GENERATE_Faild"
      }],
      "totalRecords": 2
    }
  },
  'GET /employee/userMessage/secondType/:secondType': {
    "code": 0,
    "message": "success",
    "data": {
        "pageNo": 1,
        "pageSize": 20,
        "totalCount": 42,
        "list": [
            {
                "fromType": "CUSTOMER",
                "from": 30088,
                "content": "Z",
                "msgSeqId": 2717311,
                "to": 177,
                "toType": "EMPLOYEE",
                "sendTime": 1505985320463,
                "type": "TEXT",
                "isInternal": false,
                "category": "msg",
                "data": null,
                "haveRead":false
            }
        ],
        "pageCount": 1,
        "offset": 0
    }
  },
  'GET /employee/userMessage/ack/:id': {
    "code": 0, //只关心这个code就行了
    "message": "success",
    "data": {
        "code": "0",
        "message": "success",
        "count": 0
    }
  },
  'GET /borrower/v1/assignruleconfig/getexistingemployee': {
    "code": 0,
    "data":[
      {
        "email": "123235325@dianrong.com",
        "employeeId": 0,
        "employeeName": "张珊",
        "groupId": 0,
        "groupName": "string",
        "type": "WEALTH"
      },{
        "email": "34545466546@dianrong.com",
        "employeeId": 1,
        "employeeName": "wenwen.ma",
        "groupId": 0,
        "groupName": "string",
        "type": "WEALTH"
      }
    ],
    "message": "success"
  },
  'GET /borrower/v1/assignruleconfig/getemployee': {
    "code": 0,
    "data": {
      "email": "575756868@dianrong.com",
      "employeeId": 2,
      "employeeName": "rong.wu",
      "groupId": 0,
      "groupName": "string",
      "type": "WEALTH"
    },
    "message": "success"
  },
  'POST /borrower/v1/assignruleconfig/updateassignruleconfig': {
    "code": 0,
    "data": {
      "email": "575756868@dianrong.com",
      "employeeId": 2,
      "employeeName": "rong.wu",
      "groupId": 0,
      "groupName": "string",
      "type": "WEALTH"
    },
    "message": "success"
  },
  'POST /borrower/v1/assignruleconfig/getassignruleconfigrecord': {
    "code": 0,
    "data": {
      "bottomPageNo": 0,
      "nextPageNo": 0,
      "pageNo": 1,
      "pageSize": 20,
      "previousPageNo": 0,
      "records": [
        {
          "comment": "string",
          "createDate": 0,
          "createDateForRender": "string",
          "detail": "string",
          "employeeId": 0,
          "employeeName": "string",
          "groupId": 0,
          "groupName": "string",
          "type": "string"
        }
      ],
      "topPageNo": 0,
      "totalPages": 4,
      "totalRecords": 67
    },
    "message": "string"
  },
  'GET /borrower/pos/getPosInfomations' : {
    "code": 0,
    "data": [
      {
        "cardNo": "3456475754",
        "id": 0,
        "posInfomationDetailResponses": [
          {
            "id": 0,
            "posNo": "1",
            "sellerNo": "wqeq"
          },{
            "id": 1,
            "posNo": "w324",
            "sellerNo": "sdfs43"
          }
        ]
      },{
        "cardNo": "3456475754",
        "id": 1,
        "posInfomationDetailResponses": [
          {
            "id": 1,
            "posNo": "1",
            "sellerNo": "334543"
          }
        ]
      }
    ],
    "message": "string"
  },
  'POST /borrower/pos/addPosInformation': {
    "code": 0,
    "data": {},
    "message": "success"
  },
  'GET /borrower/pos/getPosInfomation' : {
    "code": 0,
    "data": {
      "cardNo": "4534634634",
      "id": 2342,
      "posInfomationDetailResponses": [
        {
          "id": 2342,
          "posNo": "342342",
          "sellerNo": "dfsgdg"
        }, {
          "id": 2342,
          "posNo": "79879",
          "sellerNo": "dfgdfgfdh"
        }
      ]
    },
    "message": "string"
  },
  'POST /borrower/pos/getCommercialTenantes' : {
    "code": 0,
    "data": {
      "cardNo": "5647457657",
      "mcaPosInfomations": [
        {
          "merName": "name1",
          "mid": "234",
          "pid": "5457587",
          "transDate": "2001-19-12"
        },{
          "merName": "name2",
          "mid": "54654",
          "pid": "879686",
          "transDate": "2001-19-13"
        }
        
      ]
    },
    "message": "string"
  },
  'GET /borrower/pos/getMcaInfomationResponse' : {
    "code": 0,
    "message": "success",
    "data": {
      "normalOperatingMonths": 4,
      "dailyAmountAbove25Percent": 0.345,
      "dailyAmountAbove10Percent": 0.547,
      "midInfos": [
        {
          "companyName": "上海豪龙管理有限公司",
          "mid": "898**7742",
          "count": 2533,
          "beginDate": "2016-10-25T12:33:31",
          "endDate": "2017-01-23T13:52:19",
          "deviceID": ["**1301"],
          "terminalCount": 0
        }
      ],
      "normalOperatingDays": 91,
      "monthly": [
        {
          "index": 11,
          "amount": 0.0,
          "number": 0,
          "cardNumber": "0"
        }, {
          "index": 10,
          "amount": 0.0,
          "number": 0,
          "cardNumber": "0"
        }, {
          "index": 9,
          "amount": 0.0,
          "number": 0,
          "cardNumber": "0"
        }, {
          "index": 8,
          "amount": 0.0,
          "number": 0,
          "cardNumber": "0"
        }, {
          "index": 7,
          "amount": 0.0,
          "number": 0,
          "cardNumber": "0"
        }, {
          "index": 6,
          "amount": 0.0,
          "number": 0,
          "cardNumber": "0"
        }, {
          "index": 5,
          "amount": 0.0,
          "number": 0,
          "cardNumber": "0"
        }, {
          "index": 4,
          "amount": 0.0,
          "number": 0,
          "cardNumber": "0"
        }, {
          "index": 3,
          "amount": 1150.0,
          "number": 2,
          "cardNumber": "2"
        }, {
          "index": 2,
          "amount": 1213326.0,
          "number": 861,
          "cardNumber": "798"
        }, {
          "index": 1,
          "amount": 1057471.0,
          "number": 837,
          "cardNumber": "771"
        }, {
          "index": 0,
          "amount": 881070.0,
          "number": 828,
          "cardNumber": "747"
        }
      ],
      "sumNumber": 2532,
      "id": 25,
      "sumAmount": 3153017.0,
      "target": 1
    }
  },
  'GET /borrower/v1/task/detail' : {
    "code": 0,
    "message": "success",
    "data": {
      "taskId": 591556,
      "detailType": null,
      "isClosed": 2,
      "status": "LOANAPPGUIDED",
      "employeeGroupName": "销售部（借款端）T",
      "employeeName": "李娜",
      "allocateTime": 1505887438000,
      "lastProcessTime": null,
      "operationResult": "",
      "intentionRemark": null,
      "createdDate": 1505887438000,
      "readOnly": true,
      "guideSubTask": "BORROW_AUTHORIZED",
      "feedBackTime": null,
      "customerInfor": {
        "actorId": "11959950",
        "customerId": 4105932,
        "firstRecommendPreLoanProduct": "",
        "actorName": "余涛",
        "userName": "Member_11959950",
        "phone": "138***0011",
        "cellPhone": "138***0011",
        "city": null,
        "phoneCity": "北京",
        "customerOrigin": "CRM",
        "marketChannel": "crm",
        "offlineMessageChannel": null,
        "intentionSourceType": null,
        "borrowerStatusDate": 1505887379000,
        "workingYearsLevel": null,
        "ssn": "51122******37511",
        "offemployeeGroupName": "成都借款端销售一组",
        "offemployeeName": "刘聪",
        "offemployeeGroupId": 300000645,
        "offemployeeId": null,
        "hasPreloanapp": false
      },
      "loanBaseInfor": {
        "loanAppId": "2010102826",
        "loanAppStatus": "意向申请",
        "loanAppStatusCode": "NEW",
        "loanStatus": "",
        "loanType": "新贵贷",
        "loanTypeCode": "OUTSTANDING",
        "productCode": "OUTSTANDING",
        "createdDate": 1505887437963,
        "loanId": null,
        "amount": null,
        "loanEmployeeGroupName": "成都借款端销售一组",
        "loanEmployeeName": "刘聪",
        "submitDate": null,
        "expiredDate": 4070880000000,
        "loanAppSource": "CRM",
        "routingSystem": null,
        "processStatus": null,
        "tenant": "DR",
        "intentionLoanType": null,
        "intentionLoanTypeName": "",
        "intentionAmount": null,
        "intentionLoanCycle": null,
        "intentionLoanCycleName": null,
        "appCity": null,
        "loanIntention": "0",
        "envoyId": null,
        "paymentPerMon": null,
        "modified": true,
        "statusDate": 1505887437963
      },
      "operationResults": [
        {
          "id": "APPWAIT",
          "name": "待安装APP"
        }, {
          "id": "lOANAPPWAIT",
          "name": "待提交贷款申请"
        }, {
          "id": "DATAWAIT",
          "name": "待完善资料"
        }, {
          "id": "LOANRETURN",
          "name": "电销退回进件"
        }, {
          "id": "INVALID",
          "name": "不符合要求"
        }, {
          "id": "NOT_REACHABLE",
          "name": "联系不上"
        }, {
          "id": "NODEMAND",
          "name": "无需求"
        }, {
          "id": "SUBMITTED",
          "name": "已提交审核"
        }, {
          "id": "TO_BE_FOLLOWED_UP",
          "name": "待跟进"
        }
      ],
      "isClosedList": [
        {
          "code": "1",
          "name": "是",
          "type": null
        }, {
          "code": "2",
          "name": "否",
          "type": null
        }
      ],
      "ossDownloadMethod": "FRONTEND"
    }
  },
  'GET /borrower/customer/contacts': {
    "code": 0,
    "message": "success",
    "data": {
      mail: [],
      phones: [{
        id: "34545",
        contactNo: "152***3357",
        enableBusy: '',
      }, {
        id: "23413",
        contactNo: "182***8914",
        enableBusy: 'Y',
      }],
      weixin: [],
      qq: [],
    },
  },
  'GET /borrower/v1/sms/find-sms': {
    "code": 0,
    "message": "success",
    "data" : {
      "customerId": 4025188,
      "customerName": "马健",
      "taskId": null,
      "phoneNo": "15208143356",
      "phonePwdNo": "15208143356",
      "templates": [
        {
          "id": 0,
          "name": "模板1",
          "parentId": 0,
          "type": "string"
        }
      ],
      "content": null,
      "idNo": null,
      "step": "2",
      "sendChannel": null,
      "customerFlags": 128
    }
  },
  'GET /borrower/v1/sms/templatecontent': {
    "code": 0,
    "message": "success",
    "data" : {
      "content": 's额外若无二324',
    }
  },
  'GET /borrower/v1/customer/cellphone': {
    "code": 0,
    "message": "success",
    "data" : '15208234567'
  },
  'GET /borrower/v1/customer/phone': {
    "code": 0,
    "message": "success",
    "data" : '15208234567'
  },
  'GET /borrower/v1/customer/ssn': {
    "code": 0,
    "message": "success",
    "data" : '374829478290943'
  },
  'GET /borrower/v1/borrow-cms/category/list-all' : {
    "code": 0,
    "message": "success",
    "data": [
      {
        "id": 9,
        "label": "智库"
      }, {
        "id": 58,
        "label": "3453245"
      }, {
        "id": 60,
        "label": "1111"
      }, {
        "id": 61,
        "label": "雯雯"
      }, {
        "id": 62,
        "label": "搜搜"
      }, {
        "id": 63,
        "label": "热帖我让他"
      }, {
        "id": 64,
        "label": "多少公分的"
      }, {
        "id": 65,
        "label": "杂志这种做"
      }, {
        "id": 66,
        "label": "发发发"
      }, {
        "id": 68,
        "label": "啊啊啊啊"
      }, {
        "id": 79,
        "label": "分类添加测试"
      }, {
        "id": 83,
        "label": "fuck"
      }
    ]
  },
  'GET /borrower/v1/borrow-cms/article/:id' : {
    "code": 0,
    "message": "success",
    "data": {
      "id": 144,
      "title": "a",
      "columnId": 9,
      "projectId": 37,
      "status": "Y",
      "content": "<p>aaa</p>",
      "groupIds": [],
      "attachments": [],
      "categoryCode": "NOTICE",
      "visibleScope": "1",
      "keywords": "",
      "createdBy": "wenwen",
      "createdId": 200000037,
      "createdDate": 1501552269220,
      "updatedDate": 1511164278701,
      "updatedBy": "吴蓉"
    }
  },
  'GET /borrower/v1/borrow-cms/groups': {
    "code": 0,
    "message": "success",
    "data": [
      {
        id: '234',
        groupType: '销售'
      },
      {
        id: '546',
        groupType: '客服'
      }
    ]
  },
  'POST /borrower/v1/sms/template/list': {
    code: 0,
    data: {
      pageNo: 1,
      pageSize: 50,
      records: [{
        id: 1,
        templateName: '呵呵',
      },{
        id: 3,
        templateName: '你好',
      }],
      totalRecords: 60,
    },
    message: 'success',
  },
  'GET /borrower/v1/sms/template/detail/': {
    code: 0,
    data: {
      templateName: '乐乐乐'
    },
    message: 'success',
  },
  'GET /borrower/v1/sms/template/has-update-privilege': {
    code: 0,
    data: true,
    message: 'success',
  },
  'POST /borrower/v1/sms/template/create': {
    code: 0,
    data: null,
    message: 'success',
  },
  'GET /borrower/v1/sms/template/form-fields': {
    code: 0,
    data: {
      channels: [{ code: 1, name: 'ss'}],
      enableStatus: [{ code: 'NO', name: '是'}],
      scopes: [{ code: 3, name: '夤夜'}],
      literalList: [{ code: 3, name: 'sdfdf'}],
      steps:[{ code: 1, name: '渠道1'}],
    },
    message: 'success',
  },
  'GET /borrower/v1/sms/template/constants/list-literal': {
    code: 0,
    data: ['姓名', '带了'],
    message: 'success',
  },
  'GET /borrower/v1/sms/template/detail/:id': {
    code: 0,
    data: {
      templateName: '木南1'
    },
    message: 'success',
  },
  'POST /borrower/v1/sms/template/update': {
    code: 0,
    data: null,
    message: 'success',
  },
  'POST /borrower/v1/sms/template/constants/list': {
    code: 0,
    data: {
      pageNo: 1,
      pageSize: 50,
      records: [{
        id: 1,
        constantName: '呵呵',
        variabled: 'ewr',
      },{
        id: 3,
        constantName: '你好',
        variabled: 'ewr',
      }],
      totalRecords: 60,
    },
    message: 'success',
  },
  'GET /borrower/v1/sms/template/constants/detail/:id': (req, res)=> {
    res.end(JSON.stringify({
      code: 0,
      data: {
        id:req.params.id,
        constantName: '你好',
        description: `ewr${req.params.id}`,
      },
      message: 'success',
    },))
 },
}