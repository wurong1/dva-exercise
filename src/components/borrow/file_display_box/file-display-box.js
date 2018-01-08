import React, {Component} from 'react';
import { remote } from '../../../utils/fetch';
import { Modal, Table, message } from 'antd';
import {Line } from 'rc-progress';
import FileUpload from '../file_upload/file-upload';
import { fileConcept } from '../dynamic_form/dynamic-form';
import $ from 'jquery';
import '../../../plugs/imageviewer/dist/viewer';
import '../../../plugs/imageviewer/dist/viewer.css';
import $imgExcel from '../loading/images/ic_excel.png';
import $imgOther from '../loading/images/ic_other.png';
import $imgPdf from '../loading/images/ic_pdf.png';
import $imgRar from '../loading/images/ic_rar.png';
import $imgWord from '../loading/images/ic_word.png';
import $imgZip from '../loading/images/ic_zip.png';

class FileDisplayBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      imgLength: 0,
      imgPath: '',
      currentFileList: [],
      timerArry: [],
      progressArray: [],
      faildList: [],
      originPath: true
    };
  }

  componentWillMount() {
    const type = this.props.fieldInfo ? this.props.fieldInfo.name : '';
    const array = this.props.fileInfo.data ? this.props.fileInfo.data.filter(data => data.type === type) : [];
    const imgLength = array.length;
    const imgPath = array[imgLength - 1] ? array[imgLength - 1].location : '';
    this.setState({imgLength: imgLength, imgPath: imgPath, currentFileList: array});
    this.getOssPath(imgPath);
  }

  componentWillReceiveProps(nextProps) {
    const { fileInfo } = this.props;
    if (fileInfo !== nextProps.fileInfo) {
      const type = this.props.fieldInfo ? this.props.fieldInfo.name : '';
      const array = nextProps.fileInfo.data ? nextProps.fileInfo.data.filter(data => data.type === type) : [];
      const imgLength = array.length;
      const imgPath = array[imgLength - 1] ? array[imgLength - 1].location : '';
      this.setState({imgLength: imgLength, imgPath: imgPath, currentFileList: array});
      this.getOssPath(imgPath);
    }
  }

  getOssPath(path) {
    if(path && this.context.loanInfoData.ossDownloadMethod === 'FRONTEND') {
      const encodePath = encodeURIComponent(path);
      this.setState({originPath: true}, () => {
        remote({
          method: 'GET',
          url: `/borrower/getImageAbsolutePath?key=${encodePath}`
        }).then(res => {
          this.setState({imgPath: res, originPath: false});
        });
      });
    }
  }

  getFileList(e) {
    e.preventDefault();
    this.showModal();
  }

  showModal() {
    this.setState({
      visible: true
    });
  }

  handleOk() {
    this.setState({
      visible: false
    });
  }

  handleCancel() {
    this.setState({
      visible: false
    });
    const list = this.state.currentFileList.filter(record => !record.uid);
    this.setState({currentFileList: list});
  }

  downloadFile(path, e) {
    e.preventDefault();
    const encodePath = encodeURIComponent(path);
    remote({
      method: 'GET',
      url: `/borrower/getImageAbsolutePath?key=${encodePath}`
    }).then(res => {
      let a = $('<a></a>').attr('href', res).appendTo('body');
      a[0].click();
      a.remove();
    }, () => {
      message.error('下载失败');
    }
    );
  }

  deleteFaildFile(record, e) {
    e.preventDefault();
    const fileList = this.state.currentFileList;
    const list = fileList.filter(data => data.uid !== record.uid);
    this.setState({currentFileList: list});
  }

  deleteFile(record, e) {
    e.preventDefault();
    const confirm = Modal.confirm;
    const self = this;
    confirm({
      title: '确定删除吗?',
      content: '',
      width: '250px',
      onOk() {
        remote({
          method: 'GET',
          url: '/borrower/deleteProfile?aid=' + self.context.loanInfoData.aid + '&docId=' + record.id,
        }).then((res) => {
          if(res.code === 20000) {
            const fileList = self.state.currentFileList;
            const list = fileList.filter(data => data.id !== record.id);
            const imgPath = list[list.length - 1] ? list[list.length - 1].location : '';
            self.setState({
              currentFileList: list,
              visible: true,
              imgLength: list ? list.length : 0,
              imgPath: imgPath
            });
            self.getOssPath(imgPath);
            message.success('删除成功');
          }else {
            message.error('删除失败');
          }
        }).catch(() => {

        });
      },
      onCancel() {}
    });
  }

  reUpload(uid, e) {
    e.preventDefault();
    const list = this.state.currentFileList.filter(file => file.uid !== uid);
    const type = this.props.fieldInfo ? this.props.fieldInfo.name : '';
    const file = this.state.faildList.filter(data => data.uid === uid)[0].file;
    const faildList = this.state.faildList.filter(data => data.uid !== uid);
    const req = new XMLHttpRequest();
    const action = '/borrower/uploadProfile?aid=' + this.context.loanInfoData.aid + '&loanAppId=' + this.context.loanInfoData.loanId + '&docType=' + type;
    req.open('POST', action, true);
    req.setRequestHeader('Accept-Language', 'zh-CN,zh;q=0.8,en;q=0.6');
    req.setRequestHeader('accept', 'application/json;charset=utf-8, text/javascript, */*;');
    const formData = new FormData();
    formData.append('uploadedFiles', file);
    req.onload = ((component) => {
      return function() {
        component.reqListener(this, uid, file.name);
      };
    })(this);
    req.send(formData);
    this.setState({faildList, currentFileList: list}, () => this.setTimer(file));
  }

  reqListener (http, uid, fileName) {
    const res = http.response;
    this.dealStatusDone(uid, fileName, res, http.status);
  }

  setTimer(file) {
    let prg = 0;
    const uid = file.uid;
    const fileName = file.name;
    const size = file.size;
    const list = this.state.currentFileList;
    const isUploading = list.filter(record => record.uid === uid).length;
    const objOfuploadFile = {uid: uid, fileName: fileName, status: 'uploading'};
    if(!isUploading) {
      list.push(objOfuploadFile);
      this.setState({currentFileList: list});
    }
    let space = Math.ceil(size / 33800);
    const timer = window.setInterval(()=>{
      if(prg >= 100) {
        window.clearInterval(timer);
      }else {
        if(prg < 90) {
          prg ++;
        }else if(prg === 90) {
          const random = Math.floor(Math.random() * 10);
          prg = 90 + random;
        }
        const progressArray = this.state.progressArray.filter( progress => progress.uid !== uid);
        const progressObj = {uid: uid, percent: prg};
        progressArray.push(progressObj);
        this.setState({progressArray});
      }
    }, space);
    const obj = {uid: uid, timer: timer, file: file};
    this.setState((preState) => ({timerArry: [...preState.timerArry, obj]}));
  }

  uploadCallback(data) {
    const file = data.file;
    const uid = file.uid;
    const fileName = file.name;
    const list = this.state.currentFileList;
    if (file.status === 'done') {
      this.dealStatusDone(uid, fileName, file.response, 200);
    }else if(file.status === 'error') {
      const newList = list.filter(record => record.uid !== uid);
      const objOfuploadFile = {uid: uid, fileName: fileName, status: 'error'};
      const timerObj = this.state.timerArry.filter(time => time.uid === uid)[0];
      const timer = timerObj.timer;
      const fileObj = timerObj.file;
      const faildFile = {uid: uid, file: fileObj};
      const timerArry = this.state.timerArry.filter(time => time.uid !== uid);
      const progressArray = this.state.progressArray.filter( progress => progress.uid !== uid);
      window.clearInterval(timer);
      newList.push(objOfuploadFile);
      this.setState({timerArry, progressArray, currentFileList: newList});
      this.setState((preState) =>({faildList: [...preState.faildList, faildFile]}));
    }
  }

  dealStatusDone(uid, fileName, res, status) {
    const list = this.state.currentFileList;
    let ret = res;
    if(typeof(ret) === 'string' && status === 200) {
      try {
        ret = JSON.parse(ret);
      } catch(e) {
        ret = ret;
      }
    }
    const timerObj = this.state.timerArry.filter(time => time.uid === uid)[0];
    const timer = timerObj.timer;
    const fileObj = timerObj.file;
    const timerArry = this.state.timerArry.filter(time => time.uid !== uid);
    const progressArray = this.state.progressArray.filter( progress => progress.uid !== uid);
    window.clearInterval(timer);
    this.setState({timerArry});
    this.setState({progressArray});
    if(ret.code !== 20000) {
      const newList = list.filter(record => record.uid !== uid);
      const objOfuploadFile = {uid: uid, fileName: fileName, status: 'error'};
      const faildFile = {uid: uid, file: fileObj};
      newList.push(objOfuploadFile);
      this.setState((preState) => ({currentFileList: newList, faildList: [...preState.faildList, faildFile]}));
    }else {
      const newList = list.filter(record => record.uid !== uid);
      newList.push(ret.data[0]);
      const succuessList = newList.filter(record => record.status === undefined);
      const imgPath = newList[newList.length - 1] ? newList[newList.length - 1].location : '';
      this.setState({
        currentFileList: newList,
        imgLength: succuessList ? succuessList.length : 0,
        imgPath: imgPath
      });
      this.getOssPath(imgPath);
    }
  }

  getClumns() {
    const downloadMethod = this.context.loanInfoData.ossDownloadMethod;
    const columns = [{
      title: '文件名',
      dataIndex: 'fileName',
      key: 'fileName'
    }, {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      render: (text, record) => {
        const progress = this.state.progressArray.filter(data => data.uid === record.uid)[0];
        const pro = progress && progress.percent;
        return (
          <span>
          {record.status === 'uploading' &&
            <span>
              {pro}%<Line percent={pro} strokeWidth="8" strokeColor="#00BC8D" trailWidth="7" trailColor="#f7f7f7"/>
            </span>}
          {record.status === 'error' && <span style={{color: 'red'}}>上传失败</span>}
          {!record.status && <span>已上传</span>}
          </span>);
      }
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        const isIcrcControl = this.context.loanInfoData.detailType === 'AUDITFOLLOWUP' && this.context.loanInfoData.routingSystem === 'ICRC' && this.context.loanInfoData.loanStatus === 'HOLD' && this.context.loanInfoData.isReadonly === false;
        // 判断是否为51公积金文件信息tab
        const tabName = this.props.tabName;
        const loanType = this.context.loanInfoData.configProductCode;
        const isDoubleFundOnlineDocument = tabName === 'CRM_DOUBLE_FUND_ONLINE_document' && loanType === 'DOUBLE_FUND_ONLINE';
       
        return(
          <span>
            {!record.uid &&
            <span>
              {downloadMethod === 'FRONTEND' ?
                  <a className="btn btn-default-b" onClick={e => this.downloadFile(record.location, e)}>下载</a>
                  : <a className="btn btn-default-b" href={'/borrower/loanshowimage?path=' + record.location}>下载</a>
              }
              {this.context.loanInfoData.detailType === 'LOANAPPGUIDED' && this.context.loanInfoData.isReadonly === false &&
              (this.context.loanInfoData.loanAppStatusCode === 'CREATED' || this.context.loanInfoData.loanAppStatusCode === 'NEW') &&
               !isDoubleFundOnlineDocument &&
               <a className="btn btn-default-b" onClick={(e) => this.deleteFile(record, e)} >删除</a>}
              {isIcrcControl && !isDoubleFundOnlineDocument &&
              <a className="btn btn-default-b" onClick={(e) => this.deleteFile(record, e)} >删除</a>}
            </span>}
            {record.status === 'error' &&
            <span>
               <a className="btn btn-default-b" onClick={(e) => this.deleteFaildFile(record, e)} >取消</a>
               <a className="btn btn-default-b" onClick={(e) => this.reUpload(record.uid, e)} >重新上传</a>
            </span>}
          </span>
        );}
    }];

    return columns;
  }

  // 图片预览
  bindViewImg() {
    const self = this;
    const $imgItem = $('.imgItem-search');
    const $box = $imgItem.find('.papers-box');
    let counter = 0;
    if (self.state.currentFileList && self.state.currentFileList.length) {
      let $imgbox = null;
      let $images = $('#imgsGroup');
      if ($images.length) {
        $images.html('');
        $imgbox = $images;
      } else {
        $imgbox = $('<div/>').attr('id', 'imgsGroup').css('display','none');
      }
      let imgs = self.state.currentFileList;
      imgs.reverse();
      $.each(imgs, (idx, img) => {
        const dealImgTypeArr = img.fileName && img.fileName.split('.');
        const type  = dealImgTypeArr && dealImgTypeArr[dealImgTypeArr.length - 1];
        const isImg = ['jpg', 'jpeg', 'png', 'gif'].indexOf(type) > -1 || false;
        const notImgShowPath = isImg || imgTypeDivision(type);
        if(this.context.loanInfoData.ossDownloadMethod === 'FRONTEND') {
          const encodePath = encodeURIComponent(img.location);
          remote({
            method: 'GET',
            url: `/borrower/getImageAbsolutePath?key=${encodePath}`
          }).then((res) => {
            if(isImg){
              $imgbox.append($('<img/>').attr('src', res));
            }else {
              $imgbox.append($('<img/>').attr('src', notImgShowPath));
            }
            counter ++;
            if(counter === imgs.length) {
              if (!$images.length) {
                $('body').append($imgbox);
              }
              const viewer = $('#imgsGroup').viewer({
                hidden: () => {
                  viewer.viewer('destroy');
                },
                fullscreen: false
              });
              $('#imgsGroup img:eq(0)').trigger('click');
            }
          });
        }else {
          if(isImg) {
            $imgbox.append( $('<img/>').attr('src', `/borrower/loanshowimage?path=${img.location}`) );
          }else {
            $imgbox.append( $('<img/>').attr('src', notImgShowPath));
          }
          counter++;
          if(counter === imgs.length){
            if (!$images.length) {
              $('body').append($imgbox);
            }
            const viewer = $('#imgsGroup').viewer({
              hidden: () => {
                viewer.viewer('destroy');
              },
              fullscreen: false
            });
            $('#imgsGroup img:eq(0)').trigger('click');
          }
        }
      });
    }
  }

  fetchDocument = (docType, e) => {
    e.preventDefault();
    const loanAppId = this.context.loanInfoData.loanId;
    this.context.loadingFileList(true); // 设置线上小额双金贷文件信息tab加载状态
    remote({
      method: 'GET',
      url: `/borrower/v1/task/fetch-document//${loanAppId}/${docType}`,
    }).then((res) => {
      const { code } = res;
      if (code === 0) {
        this.context.getFileList(); // 重新获取文件列表
      } else {
        this.context.loadingFileList(false);
      }
    }).catch(() => {
      this.context.loadingFileList(false);
    });
  }

  render() {
    // 判断是否为51公积金文件信息tab
    const tabName = this.props.tabName;
    const loanType = this.context.loanInfoData.configProductCode;
    const isDoubleFundOnlineDocument = tabName === 'CRM_DOUBLE_FUND_ONLINE_document' && loanType === 'DOUBLE_FUND_ONLINE';
    
    const type = this.props.fieldInfo ? this.props.fieldInfo.name : '';
    const imgLength = this.state.imgLength;
    const imgPath = this.context.loanInfoData.ossDownloadMethod === 'FRONTEND' && !this.state.originPath ? this.state.imgPath : `/borrower/loanshowimage?path=${encodeURIComponent(this.state.imgPath)}`;
    const name = this.props.fieldInfo.label;
    const isRequired = this.props.fieldInfo.inputOption === 'REQUIRED' ? true : false;
    const columns = this.getClumns();
    let fileList = this.state.currentFileList ? this.state.currentFileList.filter(data => data.type === type) : [];
    const fileType = fileList.length > 0 ? fileList[fileList.length - 1].fileName : '';
    let output = fileConcept(fileType, imgPath);
    const isIcrcControl = this.context.loanInfoData.detailType === 'AUDITFOLLOWUP' && this.context.loanInfoData.routingSystem === 'ICRC' && this.context.loanInfoData.loanStatus === 'HOLD' && this.context.loanInfoData.isReadonly === false;
    const isCarOwner = this.context.loanInfoData.configProductCode === 'CAR_OWNER';
    const isLimit = isCarOwner && (type === 'DRIVE_LICENSE' || type === 'CAR_LICENSE');
    return(
        <div className="col-cell-group row">
          <div className="col-cell imgItem-search">
            {imgLength <= 0 ?
                <div>
                  <p className = "imgItem-p">
                    <label className={isRequired ? 'cell-label file-box loan-required' : 'cell-label file-box'}>{name} (0/0)</label>
                    <a className="papers-box-link file-box" onClick={(e) => this.getFileList(e)}>查看全部</a>
                    {
                      isDoubleFundOnlineDocument &&
                      <a
                        className="papers-box-link file-box"
                        onClick={this.fetchDocument.bind(this, type)}
                        style={{ marginLeft: '10px' }}
                      >
                        获取文件
                      </a>
                    }
                  </p>
                  <div className="fl">
                    <div className="papers-box">
                      <i className="icon-borrow icon-borrow-error"/>
                      <div className="alert">未上传</div>
                    </div>
                  </div>
                </div>
                :
                <div>
                  <p className = "imgItem-p">
                    <label className={isRequired ? 'cell-label file-box loan-required' : 'cell-label file-box'}>{name} (1/{imgLength}) </label>
                    <a className="papers-box-link file-box" onClick={(e) => this.getFileList(e)}>查看全部</a>
                    {
                      isDoubleFundOnlineDocument &&
                      <a
                        className="papers-box-link file-box"
                        onClick={this.fetchDocument.bind(this, type)}
                        style={{ marginLeft: '10px' }}
                      >
                        获取文件
                      </a>
                    }
                    </p>
                  <div className="fl item">
                    <div className="papers-box no-border" onClick={this.bindViewImg.bind(this)}>
                      {output}
                    </div>
                  </div>
                </div>
            }
          </div>
          <Modal title={name} visible={this.state.visible} className="la-modal"
                 onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)} width={600} footer={null}>
            <div className="col-cell-group img-list-box">
              <Table columns={columns} dataSource={this.state.currentFileList} pagination={false} rowKey={(record, idx) => idx} />
            </div>
            <div className="t-center ">
              {this.context.loanInfoData.detailType === 'LOANAPPGUIDED' && this.context.loanInfoData.isReadonly === false &&
              (this.context.loanInfoData.loanAppStatusCode === 'CREATED' || this.context.loanInfoData.loanAppStatusCode === 'NEW') && !(isLimit && imgLength >= 1) && !isDoubleFundOnlineDocument &&
                <FileUpload rules={['jpg', 'jpeg', 'png', 'gif', 'pdf', 'zip', 'rar', 'doc',
                                    'docx', 'xlsx', 'xls']}
                            typePrompt="jpg, jpeg, png, gif, pdf, zip, rar, word, excel" isLimit={isLimit}
                            name="uploadedFiles" action={'/borrower/uploadProfile?aid=' + this.context.loanInfoData.aid + '&loanAppId=' + this.context.loanInfoData.loanId + '&docType=' + type}
                            onChange={this.uploadCallback.bind(this)} headers={{'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6', 'accept': 'application/json;charset=utf-8, text/javascript, */*;'}} setTimer={this.setTimer.bind(this)}/>
              }
              {isIcrcControl && !(isLimit && imgLength >= 1) && !isDoubleFundOnlineDocument &&
                <FileUpload rules={['jpg', 'jpeg', 'png', 'gif', 'pdf', 'zip', 'rar', 'doc',
                                    'docx', 'xlsx', 'xls']}
                          typePrompt="jpg, jpeg, png, gif, pdf, zip, rar, word, excel" isLimit={isLimit}
                          name="uploadedFiles" action={'/borrower/uploadProfile?aid=' + this.context.loanInfoData.aid + '&loanAppId=' + this.context.loanInfoData.loanId + '&docType=' + type}
                          onChange={this.uploadCallback.bind(this)} headers={{'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6', 'accept': 'application/json;charset=utf-8, text/javascript, */*;'}} setTimer={this.setTimer.bind(this)}/>

              }
            </div>
          </Modal>
        </div>
    );
  }
}

function imgTypeDivision(type) {
  let output;
  if (type === 'xls' || type === 'xlsm' || type === 'xlsx') {
    output = $imgExcel;
  } else if (type === 'doc' || type === 'docx') {
    output = $imgWord;
  } else if (type === 'zip') {
    output = $imgZip;
  } else if (type === 'rar') {
    output = $imgRar;
  } else if (type === 'pdf') {
    output = $imgPdf;
  }else {
    output = $imgOther;
  }
  return output;
}
export default FileDisplayBox;
FileDisplayBox.contextTypes = {
  loanInfoData: React.PropTypes.object,
  getFileList: React.PropTypes.func,
  loadingFileList: React.PropTypes.func,
};

export {
  imgTypeDivision
};
