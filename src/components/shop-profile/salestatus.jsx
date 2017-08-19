import './salestatus.less';
import React from 'react';
import { Form, Row, Col, Switch, TimePicker } from 'antd';
import Moment from 'moment';

/**
 * 店铺营业状态、描述映射字段
 */
const SaleStatusDesc = [{
    onSell: false,
    desc: '暂停营业',
    checked: false
}, {
    onSell: true,
    desc: '正常营业',
    checked: true
}]

export default class SaleStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.value.data,
            // 营业状态一键开关的当前状态
            // 数字代表是默认状态, 布尔型是代表change事件触发的
            onsellToChild: props.value.onsellToChild,
            disableChange: props.value.disableChange
        }
    }

    componentWillReceiveProps(nextProps) {
        var data, onsellToChild, disableChange;
        if ('value' in nextProps) {
            data = nextProps.value.data;
            onsellToChild = nextProps.value.onsellToChild;
            disableChange = nextProps.value.disableChange;

            // 暂停所有平台营业
            if (onsellToChild === false) {
                // 更新状态
                data.forEach(d => {
                    d.onSell = false;
                })
            };
            // 同步自有平台，营业
            if (onsellToChild === true) {
                // 更新状态
                data.forEach(d => {
                    if(d.selfPlatform)
                        d.onSell = true;
                })
            }
        }
        this.setState({ data, onsellToChild ,disableChange });
    }

    
    hanleSomeEvent=(postData)=> {
        let { onChange, onValueChange } = this.props;
        onChange && onChange({
            ...postData
        });
    }

    handleSwitch = (checked, plat) => {
        let { data, onsellToChild } = this.state;
        let exist = data.find(d => d.isp === plat.isp);

        // 如果是自有平台，则更新所有自有平台的营业状态
        // 且同步更新内店(即一键开关)的营业状态
        if (plat.selfPlatform) {
            exist.onSell = checked;
            onsellToChild = checked;  
            let allSelf = data.filter(d => d.selfPlatform);
            allSelf.forEach(as => {
                as.onSell = checked;
            })
        } else {
            // 判断总开关的营业状态是否打开
            if (onsellToChild) {
                exist.onSell = checked;
            }
        }

        this.setState({ data, onsellToChild });
        this.hanleSomeEvent({data, onsellToChild});
    }

    updateStartTime =(string,time,plat)=> {
        let { data, onsellToChild } = this.state;
        let exist = data.find(d => d.isp === plat.isp);
        exist.dayStartTime = time + ':00';


        this.setState({data, onsellToChild});
        this.hanleSomeEvent({data, onsellToChild});
    }

    updateEndTime =(string,time,plat)=> {
        let { data, onsellToChild } = this.state;
        let exist = data.find(d => d.isp === plat.isp);
        exist.dayEndTime = time + ':00' ;
        this.setState( {data, onsellToChild} );
        this.hanleSomeEvent( {data, onsellToChild} );
        
    }
        

    render() {
        const { data, onsellToChild, disableChange } = this.state;
        
        // 时间格式
        const timeFormat = 'HH:mm';
 
        return <div className="logic-shop-control">
            {onsellToChild !== 0 && data.map((plat, i) => {
                let ssd = SaleStatusDesc.find(ssd => ssd.onSell === plat.onSell);
                let isChecked;
                // 是否是自有平台
                let isSelfPlatform = plat.selfPlatform

                
                if (isSelfPlatform) {
                    isChecked = onsellToChild;
                } else {
                    if (onsellToChild === false) {
                        isChecked = onsellToChild;
                        
                    } else {
                        isChecked = ssd.checked;
                    }
                }
                const desc = isChecked ? '正常营业' : '暂停营业';

                //关于显示"营业时间"或"无法获取"的配置
                let startTimeConf = {};
                if (plat.dayStartTime) {
                    startTimeConf.defaultValue = Moment(plat.dayStartTime, timeFormat);
                } else {
                    startTimeConf.placeholder = '无法获取时间';
                };
                let endTimeConf = {};
                if (plat.dayEndTime) {
                    endTimeConf.defaultValue = Moment(plat.dayEndTime, timeFormat);
                } else {
                    endTimeConf.placeholder = '无法获取时间';
                }

                return <Row className="not-field" key={i.toString()} style={{marginBottom:16}}>
                    <Col span={12}>
                        <Col span={9}>
                            <label className="label">{`${plat.ispName}营业时间`}</label>
                        </Col>
                        <Col span={15}>
                            <TimePicker format={timeFormat} {...startTimeConf} onChange={(string,time)=>this.updateStartTime(string,time,plat)} disabled={!isSelfPlatform||disableChange} style={{width:110,height:32}}/>
                            <span className="sep">~</span>
                            <TimePicker format={timeFormat} {...endTimeConf} onChange={(string,time)=>this.updateEndTime(string,time,plat)} disabled={!isSelfPlatform||disableChange} style={{width:110,height:32}}/>
                        </Col>
                    </Col>
                    <Col span={12} >
                        <Col span={2}>
                        </Col>
                        <Col span={9}>
                            <label className="label">{`${plat.ispName}营业状态`}</label>
                        </Col>
                        <Col span={9}>
                        <Switch style={{marginLeft:10}} 
                            checked={isChecked} 
                            disabled={!onsellToChild && !isSelfPlatform || disableChange} 
                            onChange={checked => this.handleSwitch(checked, plat)}/>
                        <span className="switch-text">{desc}</span>
                        </Col>
                    </Col>
                </Row>
            })};
            
        </div>
    }
}
 