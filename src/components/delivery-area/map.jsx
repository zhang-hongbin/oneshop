import './map.less';
import React from 'react';
import { Popover, Icon } from 'antd';

export default class DeliveryMap extends React.Component{
    constructor(props) {
        super(props);

        const value = props.data;

        this.state = {...value};
    }

    componentDidMount() {
        this.creatMapInstance();
        this.cleanGraph();
        this.draw();
    }

    /**
     * 创建地图实例
     */
    creatMapInstance() {
        const map = new BMap.Map(this.refs.mapWrapper, {
            // 无改动，设置视野范围为约10公里是为了获取相交店铺的数据，范围过大会造成数据获取过慢的问题
            minZoom: 13,
            maxZoom: 19,
            enableMapClick: false
        });

        // 添加平移缩放控件
        map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT}));

        // 添加比例尺控件
        map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT}));

        // 添加缩略地图控件
        map.addControl(new BMap.OverviewMapControl());

        // 启用滚轮放大缩小
        // map.enableScrollWheelZoom();

        // 禁用双击放大
        map.disableDoubleClickZoom();

        // 设置地图显示的城市 此项是必须设置的
        map.setCurrentCity(this.state.cityName);

        let point = new BMap.Point(this.state.lng, this.state.lat);

        this.centerPoint = point;

        // 初始化地图,设置中心点坐标和地图级别
        map.centerAndZoom(point, 15);

        let icon = '//imgsize.52shangou.com/img/n/02/28/1488250581253_6703.png';

        // 创建店铺中心点
        let myIcon = new BMap.Icon(icon, new BMap.Size(20, 34));
        let marker = new BMap.Marker(point, {
            icon: myIcon
        });

        map.addOverlay(marker);

        this.map = map;
    }

    draw() {
        if (this.state.type === 1) {
            this.drawCircle();
        } else {
            this.drawPolygon();
            // 代运营不能编辑
            if (!this.props.kaSelfManage) {
                return void 0;
            }
            // 开启编辑
            this.polygon.enableEditing();
            // 双击保存
            this.bindPloyonEvent();
        }
    }

    cleanGraph() {
        if (this.circle) {
            this.map.removeOverlay(this.circle);
        }
        if (this.polygon) {
            this.map.removeOverlay(this.polygon);
        }
    }

    drawCircle() {
        const centerPoint = new BMap.Point(this.state.lng, this.state.lat);

        // 创建圆
        let circle = new BMap.Circle(centerPoint, this.state.radius, {
            fillColor: '#0EBBAD',   // 填充颜色
            fillOpacity: .1,
            strokeColor: "#0EBBAD", // 边线颜色
            strokeWeight: 2
        })

        this.map.addOverlay(circle);
        this.circle = circle;
    }

    /**
     * 绘制多边形
     */
    drawPolygon() {
        const area = this.state.area;
        var polygon, points = [];

        if (typeof area === 'string') {
            points = area.split(';').map(point => {
                return new BMap.Point(point.split(',')[0], point.split(',')[1]);
            })
        } else {
            points = area;
        }

        polygon = new BMap.Polygon(points, {
            fillColor: '#0EBBAD',   // 填充颜色
            fillOpacity: .1,
            strokeColor: "#0EBBAD", // 边线颜色
            strokeWeight: 2
        });

        this.map.addOverlay(polygon);
        this.polygon = polygon;
    }

    handleTriggerDraw() {
        // 代运营不能编辑地图
        if (!this.props.kaSelfManage) {
            return void 0;
        }
        if (!this.polygon) {
            if (this.state.type ==1) {
                this.map.removeOverlay(this.circle);
                this.drawDefaultPolygon();
            } else {
                this.drawPolygon();
            }
        }

        // 开启编辑
        this.polygon.enableEditing();

        // 双击保存
        this.bindPloyonEvent();
    }

    bindPloyonEvent() {
        this.polygon.removeEventListener('dblclick');
        this.polygon.addEventListener('dblclick', () => {
            this.map.disableDoubleClickZoom();
            this.polygon.disableEditing();
            this.handleUpdateArea(this.polygon.getPath());
        })
    }

    drawDefaultPolygon() {
        let centerPixel = this.map.pointToPixel(this.centerPoint);

        let northWest = this.map.pixelToPoint(new BMap.Pixel(centerPixel.x - 25, centerPixel.y - 25)); // 西北角
        let northEast = this.map.pixelToPoint(new BMap.Pixel(centerPixel.x + 25, centerPixel.y - 25)); // 东北角
        let southEast = this.map.pixelToPoint(new BMap.Pixel(centerPixel.x + 25, centerPixel.y + 25)); // 东南角
        let southWest = this.map.pixelToPoint(new BMap.Pixel(centerPixel.x - 25, centerPixel.y + 25)); // 西南角

        let points = [northWest, northEast, southEast, southWest];

        let polygon = new BMap.Polygon(points, {
            fillColor: '#0EBBAD',   // 填充颜色
            fillOpacity: .1,
            strokeColor: "#0EBBAD", // 边线颜色
            strokeWeight: 2
        });

        this.map.addOverlay(polygon);
        this.polygon = polygon;
    }

    /**
     * 更新自定义配送范围
     */
    handleUpdateArea(area) {
        if (!('data' in this.props)) {
            this.setState({ area, type: 2 });
        }
        this.triggerChange({ area, type: 2 });
    }

    triggerChange(changedValue) {
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(Object.assign({}, this.state, changedValue));
        }
    }

    render() {
        return <div className="map-wrapper">
            <div className="tips">
                <span onClick={e => this.handleTriggerDraw(e)}>绘制配送范围</span>
                <Popover
                    placement="topRight"
                    trigger="click"
                    content={<div className="map-introduce">
                        <h4>如何手动创建配送范围</h4>
                        <ul>
                            <li>
                                <p>点击【绘制配送范围】按钮，自动生成带节点的矩形。在两节点之间左键单击，生成新节点。</p>
                                <div><img src="//imgsize.52shangou.com/img/n/03/04/1488611516783_6488.png"/></div>
                            </li>
                            <li>
                                <p>鼠标放置在任意一个节点，点击鼠标左键，拖拽改变配送范围。</p>
                                <div><img src="//imgsize.52shangou.com/img/n/03/04/1488611516783_7717.png"/></div>
                            </li>
                            <li>
                                <p>在当前配送范围区域内，双击鼠标左键，完成配送范围绘制。</p>
                            </li>
                            <li>
                                <p>【修改配送范围】，重复 2 和 3 操作，可进行范围修改。</p>
                            </li>
                        </ul>
                    </div>}
                ><Icon type="info-circle-o" style={{color: `#BABABA`, fontSize: `18px`}}/>
                </Popover>
            </div>
            <div className="map-container" ref="mapWrapper"></div>
        </div>
    }
}