import './upload.less';
import React from 'react';
import { Upload } from 'antd';
import UrlBuilder from '@51xianqu/url-builder';

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);

        const value = this.props.image;

        this.state = {
            action: "/sp/upload/new",
            image: value
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.image) {
            const image = nextProps.image;
            this.setState({image});
        }
    }

    handleFileChange = info => {
        let file = info.file;

        if (file.status === 'done') {
            if ('image' in this.props) {
                this.setState({ image: file.response.key });
            }
            this.triggerChange(file.response.key)
        }
    }

    handleRemove = () => {
        if ('image' in this.props) {
            this.setState({ image: undefined });
        }

        this.triggerChange(undefined);
    }

    triggerChange(changedValue) {
        const onChange = this.props.onChange;
        if (onChange) {
            // 会触发内部state的改变
            // changeValue对象结构和state要保持一致
            onChange(changedValue);
        }
    }

    render() {
        return(
        !this.state.image ?
            <Upload
                action={this.state.action}
                withCredentials={true}
                listType="text"
                onChange={this.handleFileChange}
                showUploadList={false}
            >
                <div className="upload-custom">upload</div>
            </Upload> :
            <div className="upload-custom-display">
                <img src={UrlBuilder.image(this.state.image)}/>
                <div className="mask">
                    <div className="operator">
                        <div className="delete" onClick={this.handleRemove}></div>
                        <a className="preview" href={UrlBuilder.image(this.state.image)} target="view_window"></a>
                    </div>
                </div>
            </div>
        )
    }
}