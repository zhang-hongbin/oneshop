import './info.less';
import React from 'react';
import { Row, Col, Form, Modal, TimePicker, Switch, Select, Button, Icon, Input } from 'antd';
import Ajax from '../../common/ajax';
import QueryString from 'query-string';
import Moment from 'moment';
import CanIInvoke from '../../common/auth';
import Tips from './tips';
import SaleStatus from './salestatus';

const FormItem = Form.Item;
const Option = Select.Option;

class ProfileInfo extends React.Component {
    constructor(props) {
        super(props);
        let shopId = QueryString.parse(location.search).shopId;
        
        this.state = {
            baseInfo: null,
            commentLength: 0,
            
            shopId: shopId,
            canIVisit: CanIInvoke.shop(CanIInvoke.shopTypes.READ),
            canIUpdate: CanIInvoke.shop(CanIInvoke.shopTypes.EDIT),
            // 自动接单读写权限
            canIRWAutoSend: CanIInvoke.shop(CanIInvoke.shopTypes.AUTOSEND)
        }
    }

    componentDidMount() {
        const {canIVisit, canIUpdate } = this.state;

        if (canIVisit || canIUpdate) {
            this.queryShopInfo(data => {
                this.setState({
                    baseInfo: {...data},
                    storagePlatformShopList: JSON.parse(JSON.stringify(data.outPlatformShopList))
                })
            })
        } 
    }

    /**
     * 获取店铺信息
     * @param callback
     */
    queryShopInfo(callback) {
        let requestUrl = UrlBuilder.ka('/shop/organize/kaShopInfo');
        
        Ajax.get(requestUrl, {
            params: {
                shopId: this.state.shopId,
                containOutIsp:true
            }
        }).then(res => {
            if (res.status) {
                callback.call(this, res.entry);
            } else {
                Modal.info({content: res.message});
            }
        }).catch(res => {
            Modal.warn({content: res.toString()})
        })
    }

    /**
     * 营业状态处理函数
     */
    handleSellSwitch = (checked) => {
        var bi = {};
        if (checked) {
            bi = {
                baseInfo: {
                    ...this.state.baseInfo,
                    onsell: 1
                }
            }
        } else {
            bi = {
                baseInfo: {
                    ...this.state.baseInfo,
                    onsell: 0
                }
            }
        }
        this.setState({ ...bi });
        var initValue = this.props.form.getFieldValue('logicShopReqList');
        this.props.form.setFieldsValue({
            logicShopReqList: {
                data: initValue.data,
                onsellToChild: checked
            }
        })
    }

    /**
     * 自动接单设置处理函数
     */
    handleAutoSendSwitch = (checked) => {
        let { baseInfo } = this.state;
        if(checked) {
            baseInfo.autoSend = true;
        }else {
            baseInfo.autoSend = false;
        }
        this.setState({ baseInfo })
    }
    

    checkComment = (e) => {
        let len = e.target.value.length;

        this.setState({
            commentLength: len
        });
    }

    validateComment = (rule, value, callback) => {
        if (value.length > rule.max) {
            callback();
        }
    }

    handleOnSellChange(postData) {
        var { baseInfo } = this.state;

        baseInfo.onsell = postData.onsellToChild ? 1 : 0;

        this.props.form.setFieldsValue({
            onsell: !!baseInfo.onsell
        })
        this.setState({ baseInfo });
    }

    /**
     * 比较数据是否变更,并返回比较后的数据
     */
    compareShopList = (nowdata) =>{
        const shopList = [];
        let originShopList = this.state.storagePlatformShopList;
        originShopList.forEach(odd => {
           let now = nowdata.find(function(abc){return abc.isp === odd.isp});
           if(odd.dayStartTime !== now.dayStartTime || odd.dayEndTime !== now.dayEndTime || now.onSell !== odd.onSell){
               shopList.push(now);
           }
        });
        return shopList;
    }

    /**
     * 表单提交
     */
    handleSubmit = (e) => {
        e.preventDefault();
        const scope = this;
        this.props.form.validateFields((err, fieldsValue) => {
            if ( err ) {
                return;
            }
            let { canIRWAutoSend,canIUpdate } = this.state
            // 更新店铺其他数据
            let param = {};
            param.id = this.state.shopId;
            //根据 是否有自动接单权限 -发送数据
            if(canIRWAutoSend){
                param.autoSend = fieldsValue.autoSend;    
            }

            //根据 是否有店铺写权限 -发送数据
            if(canIUpdate){
                param.comment = fieldsValue['comment'];
                param.contactTel = fieldsValue.contactTel;
                param.reminderTel = fieldsValue.reminderTel;
                param.onsell = fieldsValue.onsell;
                param.logicShopReqList = this.compareShopList(fieldsValue.logicShopReqList.data);
            }
            Modal.confirm({
                className: 'custom-wrapper-confirm',
                content: '确认是否保存已修改的店铺信息?',
                width: 320,
                onOk() {
                    scope.updateShop(param);
                },
                onCancel() {}
            })
        });
    }

    updateShop(param) {
        const requestUrl = UrlBuilder.ka('/shop/organize/updateKaShop');

        Ajax.postJSON(requestUrl, {
            body: param
        }).then(res => {
            if (res.status) {
                var duration = 2000;
                Modal.info({content: '店铺信息更新成功!'});
                setTimeout(function() {
                    window.location.reload();
                }, duration);
            } else {
                Modal.info({content: res.message});
            }
        }).catch(error => {
            Modal.warning(error.toString());
        })

    }

    renderProfile() {
        let { commentLength, canIUpdate, canIRWAutoSend } = this.state;
        const { shopName, ownerName, shopOwnerMobile, onsell, shopFreight, address, city, shopArea, comment, kASelfManage, contactTel, reminderTel, outPlatformShopList ,autoSend } = this.state.baseInfo;
        const disableChange = canIUpdate;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 3},
            wrapperCol: {span: 16}
        };
        const formItemLayoutYingYe = {
            labelCol: {span: 6},
            wrapperCol: {span: 18}
        };
        
        // 店铺公告长度
        commentLength = commentLength || (comment || '').length;
        // 时间格式
        const timeFormat = 'HH:mm';
        // 店铺营业开关
        const onSellOption = onsell ? {onsell: 1, desc: '正常营业', tips: '温馨提示：可暂停所有平台店铺营业（ 建议一直开启 ）',checked: true} : {onsell: 0, desc: '暂停营业', checked: false};
        // 自动接单开关
        const autoSendOption = autoSend ? {desc: '已开启自动接单', tips: '请务必及时配货，避免超时送达', checked: true} : {desc: '已关闭自动接单', tips: '2分钟不接单，将会有电话催单',checked: false};

        const infoBlockLayout = {
            label: 7,
            wrapper: 17
        }
        
        return <div className="settings">
            <Form onSubmit={this.handleSubmit} {...{["horizontal"]: true}}>
                {!canIUpdate  && !canIRWAutoSend && <div className="without-authority">
                    <strong>温馨提示：您的账号没有修改店铺信息的权限</strong>
                </div>}
                {/* 店铺信息 */}
                <div className="info-block" style={{paddingTop:15}}>
                    <h4><em>|</em>店铺信息</h4>
                    <div className="block-wrapper" style={{marginLeft:54}}>
                        <Row>
                            <Col span={10} >
                                <Row className="not-field" style={{offset:200}}>
                                    <Col span={infoBlockLayout.label}><label>店铺名称</label></Col>
                                    <Col span={infoBlockLayout.wrapper}>{shopName}</Col>
                                </Row>
                                <Row className="not-field">
                                    <Col span={infoBlockLayout.label}><label>联系人</label></Col>
                                    <Col span={infoBlockLayout.wrapper}>{ownerName}</Col>
                                </Row>
                                <Row className="not-field">
                                    <Col span={infoBlockLayout.label}><label>联系人手机号</label></Col>
                                    <Col span={infoBlockLayout.wrapper}>{shopOwnerMobile}</Col>
                                </Row>
                                <Row className="not-field" style={{marginTop:6}}>
                                    <Col span={infoBlockLayout.label} >
                                        <span className="marking">*</span>
                                        <label>服务电话</label>
                                    </Col>
                                    <Col span={infoBlockLayout.wrapper}>
                                        <FormItem className="contack-style">
                                        {getFieldDecorator('contactTel', {
                                            rules: [{
                                                type: 'string',
                                                required: true,
                                                message: '电话号码有误'
                                                
                                            }],
                                            initialValue: contactTel
                                        })(
                                            <Input placeholder="用于小票和线上店铺信息展示" style={{width: 240}} disabled={!canIUpdate} />
                                        )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row className="not-field" style={{marginTop:15}}>
                                    <Col span={infoBlockLayout.label} >
                                        <span className="marking">*</span>
                                        <label>催单电话</label>
                                    </Col>
                                    <Col span={infoBlockLayout.wrapper}>
                                        <FormItem  className="contack-style">
                                            {getFieldDecorator('reminderTel', {
                                                rules: [{
                                                    type: 'string',
                                                    required: true,
                                                    message: '电话号码有误'
                                                }],
                                                initialValue: reminderTel
                                            })(
                                                <Input placeholder="用于催单和用户订单进度咨询" style={{width: 240}}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                
                            </Col>
                            <Col span={10} offset={3} >
                                <Row className="not-field shop-comment">
                                    <Col span={5}><label>店铺公告</label></Col>
                                    <Col span={19}>
                                        <FormItem>
                                            {getFieldDecorator('comment', {
                                                rules: [{
                                                    message: '店铺公告长度不能超过150个字符',
                                                    max: 150
                                                }],
                                                initialValue: comment || ''
                                            })(
                                                <Input type="textarea" 
                                                    rows={5} 
                                                    autosize={{minRows:5, maxRows: 5}} 
                                                    onInput={this.checkComment}
                                                    disabled={!kASelfManage || !canIUpdate}
                                                />
                                            )}
                                            <p className="realtime-typein">
                                                <em className={commentLength > 150 ? 'ohl' : ''}>{commentLength}</em>/150
                                            </p>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </div>
                {/* 一键开关设置 */}
                <div className="info-block">
                    <Tips />
                    <br />
                    <div className="block-wrapper" style={{marginLeft:64}}>
                        <Row type="flex" justify="space-between" style={{marginBottom:-10}}>
                            <FormItem label="营业状态" {...formItemLayout} className="form-item" >
                                {getFieldDecorator('onsell', {
                                    valuePropName: 'checked',
                                    initialValue: onSellOption.checked
                                })(
                                    <Switch onChange={this.handleSellSwitch} disabled={!canIUpdate}/>
                                )}
                                <span className="switch-text">{onSellOption.desc}</span>
                                <span className="switch-text-tips" >{onSellOption.tips }</span>
                            </FormItem>
                        </Row>
                        <Row type="flex" justify="space-between">
                            <Col span={24}>
                            {canIRWAutoSend &&
                            <FormItem label="自动接单" {...formItemLayout} className="form-item" >
                                {getFieldDecorator('autoSend', {
                                    valuePropName: 'checked',
                                    initialValue: autoSendOption.checked
                                })(
                                    <Switch onChange={this.handleAutoSendSwitch}/>
                                )}
                                <span className="switch-text">{autoSendOption.desc}</span>
                                <span className="aot-tip">{autoSendOption.tips && autoSendOption.tips}</span>
                            </FormItem>
                            }
                            
                            </Col>
                        </Row>                   
                    </div>
                </div>
                {/* 平台店铺营业设置 */}
                <div className="info-block-after"  >
                    <h4><em>|</em>平台店铺营业设置</h4>
                    <div className="block-wrapper" style={{marginLeft:-2}}>
                        <Row type="flex" justify="space-between">
                            <Col span={24}>
                                <FormItem>
                                    {getFieldDecorator('logicShopReqList', {
                                        initialValue: {
                                            data: outPlatformShopList,
                                            onsellToChild: !!onsell,
                                            disableChange: !canIUpdate
                                        }
                                    })(
                                        <SaleStatus onChange={this.handleOnSellChange.bind(this)}/>
                                    )}
                                </FormItem>       
                            </Col>    
                        </Row>
                    </div>
                </div>
                <div className="save-area">
                     <Button type="primary" htmlType="submit" disabled={!canIUpdate && !canIRWAutoSend}>保存</Button> 
                </div>
            </Form>
        </div>
    }

    render() {
        const { baseInfo, canIVisit, canIUpdate } = this.state;

        if (!baseInfo) {
            return <div className="empty-out">
                <p>店铺信息加载中...</p>
            </div>
        }

        if (canIVisit || canIUpdate) {
            if (baseInfo.auditStatus !== 100) {
                return <div className="empty-out">
                    <a><img src="//imgsize.52shangou.com/img/n/02/16/1487222959169_1903.png" /></a>
                    <p>店铺信息审核中</p>
                </div>
            } else {
                return this.renderProfile();
            }
        } else {
            return <div className="empty-out">
                <a><img src="//imgsize.52shangou.com/img/n/02/16/1487222959169_1903.png" /></a>
                <p>您没有权限访问该店铺信息</p>
            </div>
        }
    }
}

export default Form.create({})(ProfileInfo)