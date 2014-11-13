var Gabled = {

  draw: function(context, polygon, center, height, minHeight, color, altColor) {
    var
      scale = CAM_Z / (CAM_Z-height*Math.pow(0.95, ZOOM-16)*2),
      minScale = CAM_Z / (CAM_Z-minHeight),
      a = { x:0, y:0 },
      b = { x:0, y:0 };

	center.r = Buildings.project(center.r, scale);
	center.l = Buildings.project(center.l, scale);

        context.beginPath();
		context.strokeStyle = '000';
		context.moveTo(center.l.x, center.l.y);
		context.lineTo(center.r.x, center.r.y);
		context.stroke();
        context.closePath();

    for (var i = 0, il = polygon.length-3; i < il; i += 2) {
      a.x = polygon[i  ]-ORIGIN_X;
      a.y = polygon[i+1]-ORIGIN_Y;
      b.x = polygon[i+2]-ORIGIN_X;
      b.y = polygon[i+3]-ORIGIN_Y;

      if (minHeight) {
        a = Buildings.project(a, minScale);
        b = Buildings.project(b, minScale);
      }

      // backface culling check
      if ((b.x-a.x) * (center.l.y-a.y) > (center.l.x-a.x) * (b.y-a.y)||(b.x-a.x) * (center.r.y-a.y) > (center.r.x-a.x) * (b.y-a.y)) {
        // depending on direction, set shading
        if ((a.x < b.x && a.y < b.y) || (a.x > b.x && a.y > b.y)) {
          context.fillStyle = color;
        } else {
          context.fillStyle = altColor;
        }

        context.beginPath();
	      if (i===2){
	        this._triangle(context, b, center.l, center.r);
	        this._triangle(context, a, b, center.l);
	      } else if (i == 4) {
            this._triangle(context, a, b, center.r);
	      } else if (i == 6) {
	        this._triangle(context, a, b, center.r);
	        this._triangle(context, b, center.l, center.r);
	      } else if (i == 0) {
            this._triangle(context, a, b, center.l);
	      }
        context.closePath();
        context.fill();
      }
    }
  },

  _triangle: function(context, a, b, c) {
    context.moveTo(a.x, a.y);
    context.lineTo(b.x, b.y);
    context.lineTo(c.x, c.y);
  },

  _ring: function(context, polygon) {
    context.moveTo(polygon[0]-ORIGIN_X, polygon[1]-ORIGIN_Y);
    for (var i = 2, il = polygon.length-1; i < il; i += 2) {
      context.lineTo(polygon[i]-ORIGIN_X, polygon[i+1]-ORIGIN_Y);
    }
  },

  shadow: function(context, polygon, center, height, minHeight) { },

  shadowMask: function(context, polygon) {},

  hitArea: function(context, polygon, center, height, minHeight, color) {  }
};
