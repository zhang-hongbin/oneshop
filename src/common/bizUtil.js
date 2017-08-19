export default class Plator {
    static plates = [{
        shortName: 'ele',
        label: '饿了么',
        isp: 1
    }, {
        shortName: 'mt',
        label: '美团外卖',
        isp: 2
    }, {
        shortName: 'jd',
        label: '京东到家',
        isp: 20
    }, {
        shortName: 'baidu',
        label: '百度外卖',
        isp: 30
    }];

    static privatePlate = {
        shortName: 'wmt',
        label: '外卖通',
        isp: 0
    }

    /**
     * 查找平台
     * @param isp
     * @param returnDefault 是否返回默认值
     * @returns {*}
     */
    static find(isps, returnDefault) {
        let ret;

        if (Object.prototype.toString.call(isps) === '[object Array]') {
            ret = [];
            this.plates.forEach(plate => {
                let isExists = isps.find(form => {return form.isp === plate.isp});
                if (isExists) {
                    ret.push(plate);
                }
            })
        } else {
            ret = this.plates.find(plate => {
                return plate.isp === isps;
            })
        }

        if (returnDefault && !ret) {
            return this.privatePlate;
        } else {
            return ret;
        }
    }

    /**
     * 查找剩余
     * @param isps
     */
    static findRemain(isps) {
        let remains = [];
        this.plates.forEach(plate => {
            let isExists = isps.find(form => {return form.isp === plate.isp})
            if (!isExists) {
                remains.push(plate);
            }
        })
        return remains;
    }
}