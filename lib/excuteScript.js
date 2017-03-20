/**
 * @file 执行js字符串逻辑表达式
 * @author
 */
var vm = require('vm');

/**
 * 执行js逻辑表达式
 *
 * @param {Object} context 作用域
 * @param {string} scripts js逻辑表达式
 * @return {*} 执行成功则为boolean类型结果，否则为null
 */
function executeScript(context, scripts) {
    var result = false;
    if (typeof context === 'object') {
        try {
            var script = vm.createScript(scripts);
            result = script.runInContext(vm.createContext(context));
        }
        catch (e) {
            console.error(e);
            return null;
        }
    }
    if (typeof result === 'boolean') {
        return result;
    }
    return null;
}

module.exports = executeScript;
