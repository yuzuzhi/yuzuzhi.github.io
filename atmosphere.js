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

function resizeCanvasToDisplaySize(canvas, multiplier) {
    multiplier = multiplier || 1;
    const width = canvas.clientWidth * multiplier | 0;
    const height = canvas.clientHeight * multiplier | 0;
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
    }
    return false;
}

let mouseX = 0;
let mouseY = 0;
 
function setMousePosition(e) {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = rect.height - (e.clientY - rect.top) - 1;  // bottom is 0 in WebGL
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
uniform vec2 iResolution;//画布大小（像素）
uniform vec2 iMouse;
uniform float iTime;
void main() 
{
    // gl_FragColor = vec4(fract(gl_FragCoord.xy / iResolution), 0, 1);    
    gl_FragColor = vec4(fract((gl_FragCoord.xy) / iResolution), 0, 1);
}
`
var gl;
var canvas;
var program;
var positionBuffer;
var positionAttributeLocation
var resolutionLocation;
var mouseLocation;
var timeLocation;
function render(time)
{
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
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);//画布大小
    gl.uniform2f(mouseLocation, mouseX, mouseY);//鼠标位置
    gl.uniform1f(timeLocation, time);
    // draw
    var offset = 0;
    var count = 6;
    gl.drawArrays(gl.TRIANGLES, offset, count);
    requestAnimationFrame(render);
}
function main()
{
    // 获取canvas元素
    canvas = document.getElementById('webglCanvas');

    // 获取WebGL上下文
    gl = canvas.getContext('webgl');

    // 如果无法获得WebGL上下文，退出
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
        throw new Error('WebGL not supported');
    }

    resizeCanvasToDisplaySize(gl.canvas);
    canvas.addEventListener('mousemove', setMousePosition);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); }, { passive: false });
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        setMousePosition(e.touches[0]);
    }, { passive: false });


    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    program = createProgram(gl, vertexShader, fragmentShader);


    // look up where the vertex data needs to go.
    positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    // look up uniform locations
    resolutionLocation = gl.getUniformLocation(program, "iResolution");
    mouseLocation = gl.getUniformLocation(program, "iMouse");
    timeLocation = gl.getUniformLocation(program, "iTime");
    // look up uniform locations
    //var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

    // Create a buffer and put three 2d clip space points in it
    positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    var positions = [
        -1, -1,  // first triangle
        1, -1,
        -1, 1,
        -1, 1,  // second triangle
        1, -1,
        1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);


    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    requestAnimationFrame(render);
}

main();
