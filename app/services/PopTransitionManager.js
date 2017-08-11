/**
 * PopTransitionManager entry 只对应 Tabtype
 * entries 为维护pop 层次  路由相关
 * 单pop内部逻辑 参考push
 */
class PopTransitionManager {
    constructor(initEntrise) {
        this.entries = {}                   //只存储hash值
        this._createEntrise(initEntrise)
        this.hashPopManager = new HashPopManager()
    }

    _createEntrise(initEntrise) {
        if (Array.isArray(initEntrise)) {
            initEntrise.forEach(entry => {
                typeof entry === 'string' && (this.entries[entry] = [])
            })
        } else {
            typeof initEntrise === 'string' && (this.entries[initEntrise] = [])
        }
    }

    openPop(entry, data) {
        let hash = createHash()
        this.entries[entry].push(hash)
        this.hashPopManager.push(hash, data)
        return this.entries[entry].map((hash) => this.hashPopManager.getCurrentData(hash))
    }

    closePop(entry) {
        // 清楚之前所有的 hash
        let lastPop = this.entries[entry].pop()
        this.hashPopManager.deleleHash(lastPop)
        return this.entries[entry].map((hash) => this.hashPopManager.getCurrentData(hash))
    }

    /**
     * 用户关闭所有窗口
     * @param entry
     * @returns {null}
     */
    block(entry) {
        if (!this.entries[entry]) {
            return null
        }
        this.entries[entry].forEach((hash) => {
            this.hashPopManager.deleleHash(hash)
        })
        this.entries[entry] = []
        return []
    }

    /**
     * 回朔当前的数据
     * @param entry
     * @returns {null}
     */
    traceBack(entry) {
        if (!this.entries[entry].length) {
            return []
        }
        return this.entries[entry].map((hash) => this.hashPopManager.getCurrentData(hash))
    }

    innerPush(entry, data) {
        let s = this.entries[entry].length - 1,
            hash = this.entries[entry][s];
        this.hashPopManager.push(hash, data)
        return this.entries[entry].map((hash) => this.hashPopManager.getCurrentData(hash))
    }

    innerReplace(entry, data) {
        let s = this.entries[entry].length - 1,
            hash = this.entries[entry][s];
        this.hashPopManager.replace(hash, data)
        return this.entries[entry].map((hash) => this.hashPopManager.getCurrentData(hash))
    }

    innerGoBack(entry) {
        let s = this.entries[entry].length - 1,
            hash = this.entries[entry][s];
        if (!this.hashPopManager.go(hash, -1)) {
            throw new Error('goBack Failed!!!')
        }
        return this.entries[entry].map((hash) => this.hashPopManager.getCurrentData(hash))
    }

    innerGoForword(entry) {
        let s = this.entries[entry].length - 1,
            hash = this.entries[entry][s];
        if (!this.hashPopManager.go(hash, 1)) {
            throw new Error('goForword Failed!!!')
        }
        return this.entries[entry].map((hash) => this.hashPopManager.getCurrentData(hash))
    }

}

class HashPopManager {
    constructor() {
        /**
         * 内部数据结构
         * @type
         * key: hash    针对搜索结果  搜索内容的范围 直接传入值即可
         * value: json
         *
         *      json 结构 :
         *          action
         *          l       当前下标
         *          history 记录让当前数据的下标
         */


        this.entries = {}
    }

    push(hash, data) {
        let obj = this.entries[hash],
            action = 'PUSH'
        if (!obj) {
            this.entries[hash] = {
                action,
                l: 0,
                history: [data]
            }
        } else {
            let nextHistory = obj.history.splice(0, obj.l + 1);
            nextHistory.push(data);
            this.entries[hash] = {
                action,
                l: obj.l + 1,
                history: nextHistory
            }

        }
    }

    replace(hash, data) {
        // let obj = this.entries[hash];
            // action = 'REPLACE';
        this.entries[hash].history[this.entries[hash].l] = data
    }

    go(hash, n) {
        let obj = this.entries[hash],
            nextIndex = clamp(obj.l + n, 0, obj.history.length - 1);
            // action = 'POP';
        obj.l = nextIndex;
        return nextIndex >= 0 && nextIndex <= obj.history.length - 1
    }

    getCurrentData(hash) {
        let {history, l} = this.entries[hash]
        return {
            data: history[l],
            hash,
            l,
            total: this.entries[hash].history.length
        }
    }

    deleleHash(hash) {
        delete this.entries[hash]
    }
}

function clamp(n, lowerBound, upperBound) {
    return Math.min(Math.max(n, lowerBound), upperBound);
}
function createHash() {
    return Math.random().toString(36).substr(2, 12);
}

export default PopTransitionManager