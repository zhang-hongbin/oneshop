import { Popover, Button ,Icon } from 'antd';
import React from 'react';

let divStyle = {
    width:'370px',
    padding: '14px 11px 14px 18px',
    align:'left',
    fontFamily:' "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif',
    lineHeight:'18px'
};
class InnerShop extends React.Component {
    constructor( props ){
        super( props );
        this.state = {
            visible: false
        }
    }

    componentWillMount() {
        this.isFirstEnter();
    }

    isFirstEnter() {
        try {
            var isVisited = window.localStorage.hasOwnProperty('isVisited');
            if (isVisited === false) {//第一次进入页面
                window.localStorage.setItem('isVisited', true);
                this.setState({ visible: true });
            }
        } catch(exception) {
            throw new Error(exception);
        }
    }

    handleChangeVisible(visible) {
        this.setState({ visible });
    }

    render() {
        var content = (
            <div style={{ padding:'0px'}}>
                <div style={divStyle}>
                    <h5>一键开关设置（全平台店铺生效）：</h5>
                    <br />
                    <p>1. 可一键暂停所有平台店铺营业。</p>
                    <br />
                    <p>2. 一键恢复营业后，平台店铺如需正常营业，需要再次单独开启恢复营业（ 如果拥有自有平台比如 App 或微信小程序，营业状态变成恢复营业则会同时打开一键开关，其它流量平台店铺营业状态不变 ）。</p>
                    <br />
                    <p>3. 自动接单开启，请务必及时配货，避免超时送达。</p>
                    <br />
                    <p>4. 自动接单关闭，2 分钟内不接单，将会有催单电话。</p>
                    <br />
                    <p style={{color:'red'}}>5. 所有的设置项修改后，需点击【保存】方可生效</p>
         
                </div>
            </div>
        );
        return <div className="demo">
            <h4 style={{display:"inline" ,marginRight:"5px"}}><em>|</em>一键开关设置</h4>
            <Popover placement="right" 
                content={content} 
                trigger="click" 
                visible={this.state.visible}
                onVisibleChange={this.handleChangeVisible.bind(this)}
            >
                <Icon type="exclamation-circle-o"/>
            </Popover>
            
        </div>; 
    }
}
export default InnerShop