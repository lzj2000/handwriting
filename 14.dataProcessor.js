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


const sum = arr => arr.reduce((acc, val) => acc + val, 0);
const mean = arr => sum(arr) / arr.length;
const min = arr => Math.min(...arr);
const max = arr => Math.max(...arr);
const median = arr => {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

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

// 通用渲染函数
const renderResults = (container, title, data) => {
    const section = document.createElement('div');
    section.innerHTML = `<h3>${title}</h3>`;
    const pre = document.createElement('div');
    pre.textContent = JSON.stringify(data, null, 2);
    section.appendChild(pre);
    container.appendChild(section);
};

document.getElementById('fileInput').addEventListener('change', function (event) {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (event) {
            const content = event.target.result;
            try {
                const data = JSON.parse(content).nodes
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

            }

        };

        reader.onerror = function () {
            console.error('读取文件时发生错误');
        };

        reader.readAsText(file);
    }
});

