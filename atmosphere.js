// 创建着色器方法，输入参数：渲染上下文，着色器类型，数据源
function createShader(gl, type, source) {
    var shader = gl.createShader(type); // 创建着色器对象
    gl.shaderSource(shader, source); // 提供数据源
    gl.compileShader(shader); // 编译 -> 生成着色器
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}


const vertexShaderSource = `
// 一个属性变量，将会从缓冲中获取数据
attribute vec4 a_position;

// 所有着色器都有一个main方法
void main() 
{
    // gl_Position 是一个顶点着色器主要设置的变量
    gl_Position = a_position;
}
`

const fragmentShaderSource = `  
precision mediump float;

void main() {
gl_FragColor = vec4(1, 1, 0.5, 1); // return redish-purple
}
`
// main()
// void main()
// {
// 获取canvas元素
const canvas = document.getElementById('webglCanvas');

// 获取WebGL上下文
const gl = canvas.getContext('webgl');

// 如果无法获得WebGL上下文，退出
if (!gl) {
    alert('Unable to initialize WebGL. Your browser may not support it.');
    throw new Error('WebGL not supported');
}

var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
var program = createProgram(gl, vertexShader, fragmentShader);


// look up where the vertex data needs to go.
var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

// look up uniform locations
//var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

// Create a buffer and put three 2d clip space points in it
var positionBuffer = gl.createBuffer();

// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

var positions = [
    -1, -1,
    1, -1,
    1, 1,
    1, 0,
  ];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);



// 设置清除颜色为红色
gl.clearColor(0.0, 0.0, 0.0, 1.0);

// 清除颜色缓冲区
gl.clear(gl.COLOR_BUFFER_BIT);
// 告诉它用我们之前写好的着色程序（一个着色器对）
gl.useProgram(program);

// Turn on the attribute
gl.enableVertexAttribArray(positionAttributeLocation);

// Bind the position buffer.
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
var size = 2;          // 2 components per iteration
var type = gl.FLOAT;   // the data is 32bit floats
var normalize = false; // don't normalize the data
var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
var offset = 0;        // start at the beginning of the buffer
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

// draw
var primitiveType = gl.TRIANGLES;
var offset = 0;
var count = 3;
gl.drawArrays(primitiveType, offset, count);