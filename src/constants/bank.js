/**
 * Created by eng0409 on 16-12-8.
 */
let bank = {
  "DEBFLYCB": "德国巴伐利亚州银行",
  "SCB": "渣打银行",
  "CHXDCBCL": "瑞士信贷银行股份有限公司",
  "HSCB": "华商银行",
  "CANGZCB": "沧州银行",
  "HUZCB": "湖州银行",
  "TIBETCB": "西藏银行",
  "OCCC": "其他城市信用社",
  "SQCB": "商丘市商业银行",
  "LIUZCB": "柳州银行",
  "COSTALCB": "营口沿海银行",
  "YIBCB": "宜宾市商业银行",
  "HUAXCB": "广东华兴银行",
  "DONGYCB": "东营银行",
  "FRXYCBCL": "法国兴业银行(中国 )有限公司",
  "ZJJRCB": "张家港农村商业银行",
  "SHANGRCB": "上饶银行",
  "HKBEA": "东亚银行",
  "RCB": "农村商业银行",
  "CBHB": "渤海银行",
  "ORCB": "其他农村商业银行",
  "HULDCB": "葫芦岛银行",
  "CEB": "中国光大银行",
  "BON": "宁波银行",
  "LIAOYCB": "辽阳银行",
  "GYRCB": "高要市农村信用合作社联合社",
  "HENGSHUICB": "衡水银行",
  "BOH": "杭州银行",
  "JSCB": "晋商银行",
  "FUSRCB": "佛山农村商业银行",
  "HKBCHINA": "汉口银行",
  "NXCB": "宁夏银行",
  "ORCC": "其他农村信用社",
  "CITICBCL": "花旗银行(中国)有限公司",
  "RIZCB": "日照银行",
  "PSBC": "中国邮政储蓄银行",
  "GANZCB": "赣州银行",
  "HYCBCL": "韩亚银行（中国）有限公司",
  "FRBLCL": "法国巴黎银行（中国）有限公司",
  "YXCBLC": "永亨银行（中国）有限公司",
  "KPDCB": "韩国产业银行",
  "JIUJCB": "九江银行",
  "FJCB": "福建海峡银行",
  "NMGCB": "内蒙古银行",
  "GSCB": "甘肃银行",
  "ZJXSRCB": "浙江萧山农村合作银行",
  "JINZCB": "锦州银行",
  "WHCBCL": "外换银行（中国）有限公司",
  "JILCB": "吉林银行",
  "NBDHCB": "宁波东海银行",
  "NANYANGCB": "南洋商业银行",
  "UBS": "瑞士银行",
  "SNXS": "深圳农村商业银行",
  "WLMQCB": "乌鲁木齐银行",
  "FRHLCBCL": "法国东方汇理银行股份有限公司",
  "IB": "兴业银行",
  "XJKCCB": "库尔勒银行",
  "JYCBLC": "集友银行有限公司",
  "WUHCB": "乌海银行",
  "ZJRCB": "浙江省农村信用社联合社",
  "ZJKCB": "张家口银行",
  "GDB": "广东发展银行",
  "MIANYCB": "绵阳市商业银行",
  "JZCTB": "焦作中旅银行",
  "LFRDRCB": "临汾市尧都市农村信用合作社联合社",
  "DAIZCB": "达州市商业银行",
  "BOS": "上海银行",
  "CAOYCB": "朝阳银行",
  "BEFTCBCL": "比利时富通银行有限公司",
  "ORCCB": "其他农村合作银行",
  "MCB": "商业银行",
  "NXHHRCB": "宁夏黄河农村商业银行",
  "HUNRCB": "湖南省农村信用社联合社",
  "CGNB": "四川天府银行",
  "AHRCB": "安徽省农村信用联社",
  "TAICRCB": "太仓农村商业银行",
  "PBOC": "中国人民银行",
  "XACB": "西安银行",
  "FUXCB": "阜新银行",
  "TAIACB": "泰安银行",
  "BOTS": "唐山银行",
  "ERDSCB": "鄂尔多斯银行",
  "BC": "交通银行",
  "JBSKCBCL": "日本山口银行股份有限公司",
  "JPSJZCBCL": "日本三井住友银行股份有限公司",
  "SB": "盛京银行",
  "XINGTCB": "邢台银行",
  "HSBLC": "恒生银行（中国）有限公司",
  "ICBC": "中国工商银行",
  "DATCB": "大同银行",
  "XZRCB": "徐州市市郊农村信用合作社联合社",
  "JPSLCBCL": "三菱东京日联银行（中国）有限公司",
  "QSCB": "齐商银行",
  "HUARONGCB": "华融湘江银行",
  "GUIZRCB": "贵州省农村信用社联合社",
  "HBCB": "哈尔滨银行",
  "DGCB": "东莞银行",
  "LSZCB": "凉山州商业银行",
  "BOCXGLC": "中国银行（香港）有限公司",
  "FUSCB": "抚顺银行",
  "PDSCB": "平顶山银行",
  "JSDWRCB": "江苏东吴农村商业银行",
  "ZJMTCB": "浙江民泰商业银行",
  "UCB": "城市商业银行",
  "BONA": "南京银行",
  "DECBCL": "德国商业银行股份有限公司",
  "CZB": "浙商银行",
  "HSB": "徽商银行",
  "LPSCB": "六盘水市商业银行",
  "JSCSRCB": "江苏常熟农村商业银行",
  "DGRCB": "东莞农村商业银行",
  "VTB": "村镇银行",
  "SXJS": "晋城银行",
  "CCC": "城市信用社",
  "XHCBCL": "新韩银行 (中国)有限公司",
  "CHANGZCB": "长治银行",
  "CMB": "中国民生银行",
  "CAFYCBCL": "加拿大丰业银行有限公司",
  "ZZCB": "郑州银行",
  "QHCB": "青海银行",
  "WUJRCB": "吴江农村商业银行",
  "BOG": "广州银行",
  "SHXCB": "绍兴银行",
  "XUANKCB": "营口银行",
  "BOCD": "成都银行",
  "HAINCCB": "海南银行",
  "DALCB": "大连银行",
  "LUOYCB": "洛阳银行",
  "XZCBLC": "星展银行(中国)有限公司",
  "GXRCB": "广西壮族自治区农村信用社联合社",
  "SMCBCL": "摩根士丹利国际银行（中国）有限公司",
  "ATRCMCL": "奥地利中央合作银行股份有限公司",
  "NZB": "兰州银行",
  "SZSCB": "石嘴山银行",
  "CAMTLECBCL": "加拿大蒙特利尔银行有限公司",
  "YTCB": "烟台银行",
  "GZCB": "遵义市商业银行",
  "JXRCB": "江西省农村信用社联合社",
  "NANCCB": "南充市商业银行",
  "HSBC": "汇丰银行",
  "XINJCB": "新疆银行",
  "HBRCB": "湖北省农村信用社联合社",
  "LANGFCB": "廊坊银行",
  "HBB": "河北银行",
  "ZHONGYCB": "中原银行",
  "ZJCZCB": "浙江稠州商业银行",
  "QUJCB": "曲靖市商业银行",
  "GZRCB": "广州农村商业银行",
  "FB": "国外银行",
  "JSJYRCB": "江苏江阴农村商业银行",
  "BOB": "北京银行",
  "DEDBAGCL": "德国德累斯登银行股份公司",
  "CZRCB": "沧州市农村信用合作社联合社",
  "USACBCL": "美国银行有限公司",
  "ZSHRCB": "中山农村信用合作社联合社",
  "DEDYZCL": "德意志银行（中国）有限公司",
  "QUANZCB": "泉州银行",
  "JXCB": "江西银行",
  "NLCCBCL": "荷兰合作银行有限公司",
  "LSCB": "临商银行",
  "GXBBWCB": "广西北部湾银行",
  "WHCB": "威海市商业银行",
  "TZCB": "台州银行",
  "PZHCB": "攀枝花市商业银行",
  "WFCB": "潍坊银行",
  "HB": "华夏银行",
  "YAANCB": "雅安市商业银行",
  "YNRCB": "云南省农村信用社联合社",
  "ITSBLCBCL": "意大利联合圣保罗银行股份有限公司",
  "CCB": "中国建设银行",
  "CCAB": "长安银行",
  "DEYCB": "德阳银行",
  "KMRCB": "昆明市农村信用合作社联合社",
  "BOW": "温州银行",
  "KLRCB": "昆山农村商业银行",
  "FRWMCBCL": "法国外贸银行股份有限公司",
  "BJRCB": "北京农村商业银行",
  "LSCCB": "乐山市商业银行",
  "SPDB": "上海浦东发展银行",
  "YLCBCL": "友利银行（中国）有限公司",
  "FUDCB": "富滇银行",
  "GBSGLCBCL": "英国苏格兰皇家银行公众有限公司",
  "HUBCB": "湖北银行",
  "JIAXCB": "嘉兴银行",
  "YNHTCB": "云南红塔银行",
  "GUILCB": "桂林银行",
  "FSSDRCB": "佛山顺德农村商业银行",
  "ZAOZCB": "枣庄银行",
  "BENXCB": "本溪市商业银行",
  "CQRCB": "重庆农村商业银行",
  "OCCB": "其他城市商业银行",
  "GWCB": "长城华西银行",
  "GUIYCB": "贵阳银行",
  "ANSCB": "鞍山银行",
  "NANYCB": "南阳市商业银行",
  "GDNHRCB": "广东南海农村商业银行",
  "NLAZCBCL": "荷兰安智银行股份有限公司",
  "SZB": "苏州银行",
  "JIZCB": "晋中银行",
  "HANDCB": "邯郸银行",
  "JMXHRCB": "江门市新会农村信用合作社联合社",
  "UNKNOWN": "未知",
  "SPB_": "平安银行",
  "NINGBCB": "宁波通商银行",
  "SMXCB": "三门峡银行",
  "YANGQCB": "阳泉市商业银行",
  "CHDCB": "承德银行",
  "SOCB": "国有商业银行",
  "LAISCB": "莱商银行",
  "HNRCB": "海南省农村信用社联合社",
  "RHCBCL": "瑞穗实业银行（中国）有限公司",
  "CDRCB": "成都市农村信用合作社联合社",
  "TJRCB": "天津农村合作银行",
  "BOT": "天津银行",
  "DHCBCL": "大华银行（中国）有限公司",
  "BOHUIHECB": "新疆汇和银行",
  "BAODCB": "保定银行",
  "CB": "中信银行",
  "BSB": "包商银行",
  "ZJTLCB": "浙江泰隆商业银行",
  "HFB": "恒丰银行",
  "YLCB": "永隆银行",
  "DEBDYZCB": "德国北德意志州银行",
  "HQCBCL": "华侨银行（中国）有限公司",
  "FJRCB": "福建省农村信用社联合社",
  "LUZCB": "泸州市商业银行",
  "CSCB": "长沙银行",
  "KPMMCB": "韩国中小企业银行",
  "JINCB": "济宁银行",
  "BOJ": "江苏银行",
  "NCCB": "南昌银行",
  "MB": "招商银行",
  "ZHUHRCB": "珠海农商银行",
  "QLCB": "齐鲁银行",
  "SHRCB": "上海农村商业银行",
  "ZHHRCB": "珠海华润银行",
  "CHB": "重庆银行",
  "ABC": "中国农业银行",
  "BEUCBCL": "比利时联合银行股份有限公司",
  "RCC": "农村信用合作社",
  "NBQZRCB": "宁波鄞州农村合作银行",
  "XMICB": "厦门国际银行",
  "CXCBLC": "创兴银行有限公司",
  "SDRCB": "山东省农村信用社联合社",
  "JSRCB": "江苏省农村信用合作社联合社",
  "UCBCL": "联合银行（中国）有限公司",
  "HMCCB": "哈密市商业银行",
  "LHCB": "漯河市商业银行",
  "BOC": "中国银行",
  "NLCB": "荷兰银行",
  "GZNYCB": "广东南粤银行",
  "ZIGONGCB": "自贡银行",
  "PANJCB": "盘锦银行",
  "AUXXLCBCL": "澳大利亚和新西兰银行集团有限公司",
  "LONGJCB": "龙江银行",
  "KUNLCB": "昆仑银行",
  "DEZCB": "德州银行",
  "THPGCBCL": "泰国盘谷银行（大众有限公司）",
  "DDCB": "丹东银行",
  "JHCB": "金华银行",
  "GUIZCB": "贵州银行",
  "JZCB": "焦作市商业银行",
  "OTHERS": "其他银行",
  "DEXDCBCL": "德国西德银行股份有限公司",
  "XMB": "厦门银行",
  "WUXRCB": "无锡农村商业银行",
  "MTDTCBCL": "摩根大通银行（中国）有限公司",
  "SUINCB": "遂宁银行",
  "HYCB": "华一银行",
  "JSCJCB": "江苏长江商业银行",
  "SXRCB": "陕西省农村信用社联合社",
  "KFCB": "开封市商业银行",
  "TIELCB": "铁岭银行",
  "FSSSRCB": "佛山市三水区农村信用合作社联合社",
  "QDB": "青岛银行",
  "QHDCB": "秦皇岛银行"
}
function format(obj) {
  let options = new Array();
  for( let name in obj) {
    if(!!name) {
      options.push({'value': obj[name], 'label': obj[name]});
    }
  }
  return options;
}
export default format(bank);
