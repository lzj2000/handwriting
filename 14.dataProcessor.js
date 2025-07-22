//===========================
// 1. 核心数据处理函数
//===========================

/**
 * 根据指定的键对数组进行分类
 * @param {Array} arr - 要分类的数组
 * @param {...string} args - 用于分类的键名
 * @returns {Map} - 返回分类后的Map对象，键为组合键名，值为符合条件的元素数组
 */
const classify = (arr, ...args) => {
    const map = new Map()
    arr.forEach(item => {
        const key = args.map(arg => item[arg]).join('_')
        if (map.has(key)) {
            map.get(key).push(item)
        } else {
            map.set(key, [item])
        }
    })
    return map
}

/**
 * 计算数组中指定键的统计信息
 * @param {Array} arr - 要统计的数组
 * @param {string} key - 要统计的键名
 * @returns {Object} - 返回包含总和、平均值、最小值、最大值和中位数的统计对象
 */
const getStatsFor = (arr, key) => {
    const values = arr.map(item => item[key]);
    return {
        sum: sum(values),
        mean: mean(values),
        min: min(values),
        max: max(values),
        median: median(values),
    };
};

/**
 * 根据分组键和目标键计算统计信息
 * @param {Array} data - 要分析的数据数组
 * @param {Array} groupByKeys - 分组依据的键名数组
 * @param {string} targetKey - 要统计的目标键名
 * @returns {Object} - 返回按分组计算的统计结果
 */
const calculateStatistics = (data, groupByKeys, targetKey) => {
    if (!groupByKeys || groupByKeys.length === 0) {
        return getStatsFor(data, targetKey);
    }
    const grouped = classify(data, ...groupByKeys);
    const result = {};
    for (const [key, value] of grouped.entries()) {
        result[key] = getStatsFor(value, targetKey);
    }
    return result;
};

//===========================
// 2. 基础统计函数
//===========================

/**
 * 计算数组元素的总和
 * @param {Array<number>} arr - 数字数组
 * @returns {number} - 数组元素的总和
 */
const sum = arr => arr.reduce((acc, val) => acc + val, 0);

/**
 * 计算数组元素的平均值
 * @param {Array<number>} arr - 数字数组
 * @returns {number} - 数组元素的平均值
 */
const mean = arr => sum(arr) / arr.length;

/**
 * 获取数组中的最小值
 * @param {Array<number>} arr - 数字数组
 * @returns {number} - 数组中的最小值
 */
const min = arr => Math.min(...arr);

/**
 * 获取数组中的最大值
 * @param {Array<number>} arr - 数字数组
 * @returns {number} - 数组中的最大值
 */
const max = arr => Math.max(...arr);

/**
 * 计算数组的中位数
 * @param {Array<number>} arr - 数字数组
 * @returns {number} - 数组的中位数
 */
const median = arr => {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

//===========================
// 3. UI渲染函数
//===========================

/**
 * 将数据渲染到指定容器中
 * @param {HTMLElement} container - 目标容器元素
 * @param {string} title - 数据标题
 * @param {Object} data - 要渲染的数据对象
 */
const renderResults = (container, title, data) => {
    const section = document.createElement('div');
    section.innerHTML = `<h3>${title}</h3>`;
    const contentDiv = document.createElement('div');
    contentDiv.textContent = JSON.stringify(data, null, 2);
    section.appendChild(contentDiv);
    container.appendChild(section);
};

//===========================
// 4. 全局变量
//===========================

/**
 * 存储解析后的JSON数据
 * @type {Array}
 */
var data;

//===========================
// 5. 事件处理函数
//===========================

/**
 * 文件上传处理函数
 * 读取上传的JSON文件，解析数据并计算统计结果
 */
document.getElementById('fileInput').addEventListener('change', function (event) {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (event) {
            const content = event.target.result;
            try {
                data = JSON.parse(content).nodes

                const regionStatistics = calculateStatistics(data, ['region'], 'value');
                const regionAndYearStatistics = calculateStatistics(data, ['region', 'year'], 'value');
                const resourceStatistics = calculateStatistics(data, ['resource'], 'value');
                const weightStatistics = getStatsFor(data, 'weight');

                const resultsContainer = document.getElementById('resultsContainer');
                resultsContainer.innerHTML = '';

                renderResults(resultsContainer, '按 Region 分组统计 (value)', regionStatistics);
                renderResults(resultsContainer, '按 Region 和 Year 分组统计 (value)', regionAndYearStatistics);
                renderResults(resultsContainer, '按 Resource 分组统计 (value)', resourceStatistics);
                renderResults(resultsContainer, '整体 Weight 统计', weightStatistics);
            } catch (error) {
                // 错误处理
            }
        };

        reader.onerror = function () {
            console.error('读取文件时发生错误');
        };

        reader.readAsText(file);
    }
});

/**
 * 性能测试处理函数
 * 使用Benchmark.js库对不同统计计算进行性能测试
 */
document.getElementById('runBenchmark').addEventListener('click', function (event) {
    if (!data) {
        alert('请先上传文件')
        return
    }
    const btn = event.target;
    btn.disabled = true;
    btn.textContent = '测试中...';
    const benchmarkResults = document.getElementById('benchmark-results');
    benchmarkResults.innerHTML = ''; // 清空之前的结果
    const suite = new Benchmark.Suite();
    suite.add('按 Region 分组统计 (value)', function () {
        calculateStatistics(data, ['region'], 'value');
    })
        .add('按 Region 和 Year 分组统计 (value)', function () {
            calculateStatistics(data, ['region', 'year'], 'value');
        })
        .add('按 Resource 分组统计 (value)', function () {
            calculateStatistics(data, ['resource'], 'value');
        })
        .add('整体 Weight 统计', function () {
            getStatsFor(data, 'weight');
        })
        .on('cycle', function (event) {
            const log = String(event.target)
            console.log(log);
            benchmarkResults.innerHTML += `${log}<br/>`
        })
        .on('complete', function () {
            let totalHz = 0;
            this.forEach(benchmark => {
                totalHz += benchmark.hz;
            });
            const averageHz = totalHz / this.length;

            let summary = `所有测试用例的总 Hz (ops/sec): ${totalHz.toFixed(2)}<br/>`;
            summary += `所有测试用例的平均 Hz (ops/sec): ${averageHz.toFixed(2)}`;

            console.log(`总 Hz: ${totalHz.toFixed(2)}`);
            console.log(`平均 Hz: ${averageHz.toFixed(2)}`);

            benchmarkResults.innerHTML += summary;

            btn.disabled = false;
            btn.textContent = '性能测试';
        })
        .run({ 'async': true });
});