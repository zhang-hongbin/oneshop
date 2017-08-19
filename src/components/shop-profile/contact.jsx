/**
 * 组件已暂时废弃
 */
import './contact.less';
import React from 'react';
import { Input, Select } from 'antd';

const Component = React.Component;
const Option = Select.Option;

export default class ContactTel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
            profix: null,
            tel: null,
            type: 1
        }
    }

    componentWillMount() {
        var value = this.state.value;
        var type = this.state.type;
        var tel, profix;

        if (/^\d{3,4}-?\d{7,8}$/.test(value)) {
            type = 1;
        } else if (/^1\d{10}$/.test(value)) {
            type = 2;
        } else {
            type = 1;
        }

        if (value) {
            let special_plate = value.match(/^(\d{3,4})-?(\d{7,8})$/);
            if (special_plate) {
                profix = special_plate[1];
                tel = special_plate[2];
            }

            if (/^1\d{10}$/.test(value)) {
                tel = value;
            }
        }

        this.state.type = type;
        this.state.profix = profix;
        this.state.tel = tel;
    }

    handleChangeType(checked) {
        let type = parseInt(checked);
        let { value, tel, profix } = this.state;

        tel = '';
        value = '';
        profix = '';

        this.setState({ type, value, tel, profix });
    }

    handlePhonePrefixChange(e) {
        var profix = e.target.value.trim();
        var tel = this.state.tel;

        this.triggerChange({ profix, tel });
    }

    handlePhoneChange(e) {
        var tel = e.target.value.trim();
        var profix = this.state.profix;

        this.triggerChange({ profix, tel });
    }

    triggerChange(data) {
        const onChange = this.props.onChange;
        let value = data.profix ? `${data.profix}${data.tel}`: data.tel;
        
        onChange && onChange(value);
        this.setState({ value })
    }


    render() {
        const { value, type, tel, profix } = this.state;

        return <section className="contack-style">
            <Select defaultValue={`${type}`} onSelect={this.handleChangeType.bind(this)}>
                <Option value="1">座机</Option>
                <Option value="2">手机</Option>
            </Select>
            { type === 1 ?
            <div className="input-group">
                <Input style={{ width: '20%' }} defaultValue={profix} placeholder="区号" onChange={this.handlePhonePrefixChange.bind(this)}/>
                <span className="sep">-</span>
                <Input style={{ width: '40%' }} defaultValue={tel} onChange={this.handlePhoneChange.bind(this)}/>
            </div>
            :
            <div className="input-alone">
                <Input style={{ width: '80%' }} defaultValue={tel} onChange={this.handlePhoneChange.bind(this)}/>
            </div>
            }
        </section>
    }
}