var Gabled = {

  draw: function(context, polygon, center, height, minHeight, color, altColor) {
    var
      scale = CAM_Z / (CAM_Z-height*Math.pow(0.95, ZOOM-16)*2),
      minScale = CAM_Z / (CAM_Z-minHeight),
      a = { x:0, y:0 },
      b = { x:0, y:0 };
      var cen = {
	      l: Buildings.project({
		      x: Math.max(polygon[0], polygon[2]) - Math.abs(polygon[0] - polygon[2])/2 -ORIGIN_X,
	          y: Math.max(polygon[1], polygon[3]) - Math.abs(polygon[1] - polygon[3])/2 -ORIGIN_Y
	      }, scale),
	      r: Buildings.project({
		      x: Math.max(polygon[4], polygon[6]) - Math.abs(polygon[4] - polygon[6])/2 -ORIGIN_X,
	          y: Math.max(polygon[5], polygon[7]) - Math.abs(polygon[5] - polygon[7])/2 -ORIGIN_Y
	      }, scale)
      };

        context.beginPath();
		context.strokeStyle = '000';
		context.moveTo(cen.l.x, cen.l.y);
		context.lineTo(cen.r.x, cen.r.y);
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
      if ((b.x-a.x) * (cen.l.y-a.y) > (cen.l.x-a.x) * (b.y-a.y)||(b.x-a.x) * (cen.r.y-a.y) > (cen.r.x-a.x) * (b.y-a.y)) {
        // depending on direction, set shading
        if ((a.x < b.x && a.y < b.y) || (a.x > b.x && a.y > b.y)) {
          context.fillStyle = color;
        } else {
          context.fillStyle = altColor;
        }

        context.beginPath();
	      if (i===2){
	        this._triangle(context, b, cen.l, cen.r);
	        this._triangle(context, a, b, cen.l);
	      } else if (i == 4) {
            this._triangle(context, a, b, cen.r);
	      } else if (i == 6) {
	        this._triangle(context, a, b, cen.r);
	        this._triangle(context, b, cen.l, cen.r);
	      } else if (i == 0) {
            this._triangle(context, a, b, cen.l);
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
