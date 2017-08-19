const ENUM = {
    READ: "READ",
    AUTOSEND: "AUTOSEND_UPDATE",
    LOOK: "LOOK",
    DELETE: 'DELETE',
    DETAIL: "DETAIL",
    EDIT: "EDIT",
    ADD: "ADD",
    UPDATE: "UPDATE",
    ADD_UPDATE: 'ADD_UPDATE',
    GROUP: 'GROUP',
    ADD_UPDATE_DELETE: 'ADD_UPDATE_DELETE'
}

class CanIInVoke {
    static auths = window.FEC.sourceList;

    //static TYPES = ENUM;

    static shopTypes = {READ: ENUM.READ, EDIT: ENUM.EDIT, AUTOSEND: ENUM.AUTOSEND};
    static billTypes = {LOOK: ENUM.LOOK};
    static billBankTypes = {LOOK: ENUM.LOOK};
    static statisticsTypes = {LOOK: ENUM.LOOK};
    static organizeTypes = {DETAIL: ENUM.DETAIL, UPDATE: ENUM.UPDATE};
    static itemTypes = {ADD: ENUM.ADD, DELETE: ENUM.DELETE, EDIT: ENUM.EDIT, LOOK: ENUM.LOOK, GROUP: ENUM.GROUP};
    static roleTypes = {READ: ENUM.READ, ADD_UPDATE: ENUM.ADD_UPDATE};
    static orderTypes = {DETAIL: ENUM.DETAIL, UPDATE: ENUM.UPDATE};
    static messageTypes = {READ: ENUM.READ};
    static skuTypes = {ADD: ENUM.ADD, DELETE: ENUM.DELETE, READ: ENUM.READ, UPDATE: ENUM.UPDATE, GROUP: ENUM.GROUP};
    static staffTypes = {READ: ENUM.READ, ADD_UPDATE_DELETE: ENUM.ADD_UPDATE_DELETE};

    /**
     * 店铺 读(read)写(edit)
     * @param type<String> 类型
     * @returns {boolean}
     */
    static shop(type) {
        return this.auths.some(auth => auth === 'SHOP_' + type);
    }

    /**
     * 账单中心 查看(look)
     * @param type<String> 类型
     * @returns {boolean}
     */
    static bill(type) {
        return this.auths.some(auth => auth === 'BILL_' + type);
    }

    /**
     * 账单中心：查看财务(look)
     * @param type<String> 类型
     * @returns {boolean}
     */
    static billBank(type) {
        return this.auths.some(auth => auth === 'BILL_BANK_' + type);
    }

    /**
     * 数据统计：查看数据(look)
     * @param type<String> 类型
     * @returns {boolean}
     */
    static statistics(type) {
        return this.auths.some(auth => auth === 'STATISTICS_' + type);
    }

    /**
     * 集团权限：详情查看(detail),更新(update)
     * @param type<String> 类型
     * @returns {boolean}
     */
    static organize(type) {
        return this.auths.some(auth => auth === 'ORGANIZE_' + type);
    }

    /**
     * 商品权限：增(add)删(delete)改(edit)查(look)集团(group)
     * @param type<String> 类型
     * @returns {boolean}
     */
    static item(type) {
        return this.auths.some(auth => auth === 'ITEM_' + type);
    }

    /**
     * 角色权限: 查看(read),新增或更新(add_update)
     * @param type<String> 类型
     * @returns {boolean}
     */
    static role(type) {
        return this.auths.some(auth => auth === 'ROLE_' + type);
    }

    /**
     * 订单权限: 查看(look),更新(update)
     * @param type<String> 类型
     * @returns {boolean}
     */
    static order(type) {
        return this.auths.some(auth => auth === 'ORDER_' + type);
    }

    /**
     * 消息权限: 接收查看(read)
     * @param type<String> 类型
     * @returns {boolean}
     */
    static message(type) {
        return this.auths.some(auth => auth === 'MESSAGE_' + type);
    }

    /**
     * SKU权限: 增(add)删(delete)改(update)查(read)集团(group)
     * @param type<String> 类型
     * @returns {boolean}
     */
    static sku(type) {
        return this.auths.some(auth => auth === 'SKU_' + type);
    }

    /**
     * 员工管理: 查看(read),变更(add_update_delete)
     * @param type<String> 类型
     * @returns {boolean}
     */
    static staff(type) {
        return this.auths.some(auth => auth === 'STAFF_' + type);
    }
}

module.exports = CanIInVoke;