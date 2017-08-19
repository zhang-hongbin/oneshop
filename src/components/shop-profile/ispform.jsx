import './ispform.less';
import React from 'react';
import Ajax from '../../common/ajax';
import { Form, Modal, Button, Input} from 'antd';
import AreaMap from '../delivery-area/map';

const FormItem = Form.Item;

class ISPForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {...props.data};
    }

    /**
     * 表单提交
     */
    handleSubmit = (e) => {
        e.preventDefault();
        const scope = this;

        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }

            // 更新店铺其他数据
            let param = {};

            if (fieldsValue['logistics'].type === 2) {
                let area = fieldsValue['logistics'].area;
                if (typeof area !== 'string') {
                    area = area.map(p => {
                        return p.lng + ',' + p.lat;
                    });
                    if (area[0] !== area[area.length - 1]) {
                        area.push(area[0]);
                    }
                    area = area.join(';');
                }
                param.deliveryAreaType = 2;
                param.deliveryPolygonArea = area;
            } else {
                param.deliveryAreaType = 1;
                param.deliveryRadius = fieldsValue['logistics'].radius;
            }

            // 起送价
            param.leastSendAmount = Math.floor(fieldsValue['leastSendAmount'] * 100);
            // 配送费
            param.deliveryAmount = Math.floor(fieldsValue['deliveryAmount'] * 100);

            param.isp = fieldsValue['logistics'].isp;
            param.shopId = this.state.shopId;

            Modal.confirm({
                content: '您确定更新' + fieldsValue['logistics'].ispName + '平台的配送信息吗',
                width: 320,
                onOk() {
                    scope.update(param);
                },
                onCancel() {}
            })
        });
    }

    update(param) {
        let requestUrl = '/shop/delivery/ka/updateAreaAndFee';
        Ajax.postJSON(requestUrl, {
            body: param
        }).then(res => {
            if (res.status) {
                Modal.info({content: '更新成功!'});
            } else {
                Modal.info({content: res.message});
            }
        }).catch(res => {
            Modal.warn({content: res.toString()})
        })
    }


    render() {
        const { getFieldDecorator } = this.props.form;

        const { deliveryAreaType, deliveryRadius, deliveryPolygonArea, address, latitude, longitude, cityName, isp, ispName, leastSendAmount, deliveryAmount } =  this.state;

        const areaData = {
            type: deliveryAreaType,
            radius: deliveryRadius,
            area: deliveryPolygonArea,
            address: address,
            lat: latitude,
            lng: longitude,
            cityName: cityName,
            isp: isp,
            ispName: ispName
        }

        const leastSendFee = (leastSendAmount / 100).toFixed(2);
        const deliveryFee = (deliveryAmount / 100).toFixed(2);
        //<p>提示：如需修改配送范围及配送价格，请联系业务经理：{xiaoerName} {xiaoerMobile}</p>

        return <Form onSubmit={this.handleSubmit}>
            <div className="logistics-wrapper">
                <div className="hd">
                    <div className="item">店铺地址：{address}</div>
                    <div className="item">
                        <label>起送价：</label>
                        <div>
                            <FormItem>
                            {getFieldDecorator('leastSendAmount', {
                                rules: [{
                                    type: 'string',
                                    required: true,
                                    message: '起送价格设置不合法',
                                    pattern: /^\d*(\.?\d{1,2})$/g
                                }],
                                initialValue: leastSendFee
                            })(
                                <Input addonBefore="￥" addonAfter="起" disabled={!this.props.kaSelfManage}/>
                            )}
                            </FormItem>
                        </div>
                    </div>
                    <div className="item">
                        <label>订单配送费：</label>
                        <div>
                            <FormItem>
                            {getFieldDecorator('deliveryAmount', {
                                rules: [{
                                    type: 'string',
                                    required: true,
                                    message: '配送费价格设置不合法',
                                    pattern: /^\d*(\.?\d{1,2})$/g
                                }],
                                initialValue: deliveryFee
                            })(
                                <Input addonBefore="￥"  addonAfter="元 / 单" disabled={!this.props.kaSelfManage}/>
                            )}
                            </FormItem>
                        </div>
                    </div>
                </div>
                <FormItem>
                    {getFieldDecorator('logistics', {
                        valuePropName: 'data',
                        initialValue: areaData
                    })(
                        <AreaMap kaSelfManage={this.props.kaSelfManage}/>
                    )}
                </FormItem>
            </div>
            {
                this.props.kaSelfManage && 
                <div className="save-area">
                    <Button type="primary" htmlType="submit">保存</Button>
                </div>
            }
        </Form>
    }
}
export default Form.create({})(ISPForm);