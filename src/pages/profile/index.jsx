import './index.less';
import React from 'react';
import ReactDOM from 'react-dom';
import { Tabs } from 'antd';
import BaseInfo from '../../components/shop-profile/info';
import Logistics from '../../components/shop-profile/logistics';
import QueryString from 'query-string';

const TabPane = Tabs.TabPane;

const tab = QueryString.parse(location.search).tab || 'info';

ReactDOM.render(<div className="profile-wrapper" >
    <Tabs defaultActiveKey={tab} animated={false} type="line">
        <TabPane tab="店铺信息" key="info">
            <BaseInfo/>
        </TabPane>
        <TabPane tab="配送费用与范围" key="logistics">
            <Logistics/>
        </TabPane>
    </Tabs>
</div>, document.getElementById('root'));

if (module.hot) {
    module.hot.accept();
}