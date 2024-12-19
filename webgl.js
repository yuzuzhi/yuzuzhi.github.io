// 获取canvas元素
const canvas = document.getElementById('webglCanvas');

// 获取WebGL上下文
const gl = canvas.getContext('webgl');

// 如果无法获得WebGL上下文，退出
if (!gl) {
    alert('Unable to initialize WebGL. Your browser may not support it.');
    throw new Error('WebGL not supported');
}

// 设置清除颜色为红色
gl.clearColor(1.0, 0.0, 0.0, 1.0);

// 清除颜色缓冲区
gl.clear(gl.COLOR_BUFFER_BIT);