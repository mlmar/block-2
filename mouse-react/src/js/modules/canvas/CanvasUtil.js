class CanvasUtil {
  constructor() {
    this.canvas = null;
    this.ctx = null;

    this.img = new Image();
    this.update = false;

    this.colors = {
      clear: "WHITE",
      rect: "BLACK"
    }
  }

  /*
    canvasRef : react ref to canvas element
  */
  init(canvasRef) {
    if(!canvasRef?.current) {
      console.log("Could not initialize Canvas");
      return;
    }
    
    console.log("Initializing Canvas");
    
    this.canvas = canvasRef.current;
    this.parent = canvasRef.current.parentElement;
    this.ctx = this.canvas.getContext("2d");

    this.clear();
  }

  clear() {
    if(!this.canvas) return;

    this.ctx.fillStyle = this.colors.clear;
    this.ctx.fillRect(0,0, this.w(), this.h())
  }


  getData() {
    if(!this.canvas) return;
    return this.canvas.toDataURL();
  }

  setData(data) {
    if(!this.canvas) return;

    var img = new Image();
    img.onload = () => {
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    }
    this.img.src = data;

    this.update = true;
  }

  draw() {
    if(!this.canvas) return;

    const render = () => {
        if(this.update){  // only raw if needed
          this.update = false;
          this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
        }
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }
  
  rect(x, y, width, height, color) {
    this.ctx.fillStyle = color || this.colors.rect ;
    this.ctx.fillRect(x, y, width, height);
  }

  outline(x, y, width, height, color ){
    this.ctx.translate(.5,.5);
    this.ctx.strokeStyle = color || this.colors.rect ;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, width, height);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  
  w() { return this.canvas.width; }
  h() { return this.canvas.height }

  setColors(c) {
    this.colors = { ...this.colors, ...c};
  }
}

export default CanvasUtil;