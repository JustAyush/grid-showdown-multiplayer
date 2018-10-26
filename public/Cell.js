class Cell {
  constructor(i, j, w, a, b, c, d, p, line0, line1, line2, line3, madeBold, enclosed) {
    this.i = i;
    this.j = j;
    this.w = w;
    this.x = this.i * this.w;
    this.y = this.j * this.w;
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.p = p;
    this.line0 = line0;
    this.line1 = line1;
    this.line2 = line2;
    this.line3 = line3;
    this.madeBold = madeBold;
    this.enclosed = enclosed;
  }

  show() {
    strokeWeight(5);
    stroke(200);
		if(!this.p){
    if (this.a || this.b || this.c || this.d) {
      if (this.a)
        line(this.x + this.w, this.y + this.w, this.x, this.y + this.w);
      if (this.b)
        line(this.x, this.y + this.w, this.x, this.y);
      if (this.c)
        line(this.x + this.w, this.y, this.x + this.w, this.y + this.w);
      if (this.d)
        line(this.x, this.y, this.x + this.w, this.y);
    } else {
      line(this.x, this.y, this.x + this.w, this.y);

      line(this.x + this.w, this.y, this.x + this.w, this.y + this.w);

      line(this.x + this.w, this.y + this.w, this.x, this.y + this.w);

      line(this.x, this.y + this.w, this.x, this.y);

    }
    }
  }

  showBolder() {

    if (this.a || this.b || this.c || this.d) {
      if (this.a) {
        if (onTheLine(this.x + this.w, this.y + this.w, this.x, this.y + this.w)) {
          this.line2 = true;
          this.madeBold = true;
        }
      }
      if (this.b) {
        if (onTheLine(this.x, this.y + this.w, this.x, this.y)) {
          this.line3 = true;
          this.madeBold = true;
        }
      }
      if (this.c) {
        if (onTheLine(this.x + this.w, this.y, this.x + this.w, this.y + this.w)) {
          this.line1 = true;
          this.madeBold = true;
        }
      }
      if (this.d) {
        if (onTheLine(this.x, this.y, this.x + this.w, this.y)) {
          this.line0 = true;
          this.madeBold = true;
        }
      }

    } else {
      if (onTheLine(this.x, this.y, this.x + this.w, this.y)) {
        this.line0 = true;
        this.madeBold = true;
      }
      if (onTheLine(this.x + this.w, this.y, this.x + this.w, this.y + this.w)) {
        this.line1 = true;
        this.madeBold = true;
      }
      if (onTheLine(this.x + this.w, this.y + this.w, this.x, this.y + this.w)) {
        this.line2 = true;
        this.madeBold = true;
      }
      if (onTheLine(this.x, this.y + this.w, this.x, this.y)) {
        this.line3 = true;
        this.madeBold = true;
      }

    }

    if (this.madeBold){
      this.madeBold = false;
      return true;
    }

    return false;
  }


  madeBolder(){
    if (this.a || this.b || this.c || this.d) {
      if (this.a) {
        if (this.line2) {
          lineMadeBold(this.x + this.w, this.y + this.w, this.x, this.y + this.w);
        }
      }
      if (this.b) {
        if (this.line3) {
          lineMadeBold(this.x, this.y + this.w, this.x, this.y);
        }
      }
      if (this.c) {
        if (this.line1) {
          lineMadeBold(this.x + this.w, this.y, this.x + this.w, this.y + this.w);
        }
      }
      if (this.d) {
        if (this.line0) {
          lineMadeBold(this.x, this.y, this.x + this.w, this.y);
        }
      }

    } else {
      if (this.line0) {
        lineMadeBold(this.x, this.y, this.x + this.w, this.y);
      }
      if (this.line1) {
        lineMadeBold(this.x + this.w, this.y, this.x + this.w, this.y + this.w);
      }
      if (this.line2) {
        lineMadeBold(this.x + this.w, this.y + this.w, this.x, this.y + this.w);
      }
      if (this.line3) {
        lineMadeBold(this.x, this.y + this.w, this.x, this.y);
      }

    }

  }

  IsEnclosed() {
    if (this.line0 == true && this.line1 == true && this.line2 == true && this.line3 == true) {
      return true;
    }
    return false;
  }

  fillColor(color){
    stroke(0);
    strokeWeight(5);
    if (color)
      fill(141, 135, 65);
    else
      fill(230, 153, 0);
    rect(this.x, this.y, this.w, this.w);
  }

}
