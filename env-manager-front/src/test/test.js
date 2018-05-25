var r = 9; g = 21; b = 25

var c = r << 16 | g << 8 | b

console.log(c)

var c1 = Number(c).toString(2)

console.log(c1)
console.log(c1.length)

c1 = (c1 + "").padStart(24, "0")
console.log(c1)
console.log(c1.length)
// debugger;
var r1 = c1.substring(0, 8)
var g1 = c1.substring(8, 16)
var b1 = c1.substring(16, 24)

function rgb(r, g, b) {
  var c = r << 16 | g << 8 | b

  console.log(c)
  return c
}

function parseRGB(c) {
  var c1 = Number(c).toString(2)

  c1 = c1.padStart(24, "0")
  // debugger;
  var r1 = c1.substring(0, 8)
  var g1 = c1.substring(8, 16)
  var b1 = c1.substring(16, 24)

  var r2 = parseInt(r1, 2)
  var g2 = parseInt(g1, 2)
  var b2 = parseInt(b1, 2)
  return `rgba(${r2},${g2},${b2})`
}

console.log(parseInt(r1, 2), parseInt(g1, 2), parseInt(b1, 2))

//   #61D3D7 rgba(97,211,215,1);
//   #FDDB5F 100% rgba(253,219,95,1);
//   #F95092 100% rgba(249,80,146,1);
//   #9C57FC 100% rgba(156,87,252,1);
// console.log(rgb(97,211,215), rgb(253,219,95), rgb(249,80,146), rgb(156,87,252));

console.log(parseRGB(rgb(0, 1, 1)))
console.log(parseRGB(rgb(255, 255, 255)))
console.log(parseRGB(rgb(1, 31, 2)))
console.log(parseRGB(rgb(200, 138, 245)))

