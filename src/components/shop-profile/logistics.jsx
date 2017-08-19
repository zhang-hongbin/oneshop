import './logistics.less';
import React from 'react';
import Ajax from '../../common/ajax';
import QueryString from 'query-string';
import { Tabs, Modal } from 'antd';
import ISPForm from './ispform';

const TabPane = Tabs.TabPane;

class Logistics extends React.Component {
    constructor(props) {
        super(props);
        let shopId = QueryString.parse(location.search).shopId;

        this.state = {
            shopId: shopId,
            logistics: []
        }
    }

    componentDidMount() {
        this.queryLogistics(data => {
            this.setState({
                logistics: data.areaList,
                // 是否自运营，代运营不能编辑配送费
                kaSelfManage: data.shopInfo.kaSelfManage
            })
        })
    }

    /**
     * 获取配送费及范围信息
     * @param callback
     */
    queryLogistics(callback) {
        let requestUrl = '/shop/delivery/ka/queryAreaAndFee';
        Ajax.get(requestUrl, {
            params: {
                shopId: this.state.shopId
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


    render() {
        const { logistics, kaSelfManage } = this.state;

        return <div className="logistics">
            <h4><em>|</em>配送范围与费用设置</h4>
            <Tabs defaultActiveKey="0" animated={false}>{
                logistics.map((log, i) => {
                    return <TabPane tab={log.ispName} key={`${i}`}>
                        <ISPForm data={log} kaSelfManage={kaSelfManage}/>
                    </TabPane>;
                })
            }</Tabs>
        </div>;
    }
}



export default Logistics