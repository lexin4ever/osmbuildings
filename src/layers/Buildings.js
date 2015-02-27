var Buildings = {

  project: function(p, m) {
    return {
      x: (p.x-CAM_X) * m + CAM_X <<0,
      y: (p.y-CAM_Y) * m + CAM_Y <<0
    };
  },

  render: function() {
    var context = this.context;
    context.clearRect(0, 0, WIDTH, HEIGHT);

    // show on high zoom levels only and avoid rendering during zoom
    if (ZOOM < MIN_ZOOM || isZooming) {
      return;
    }

    var
      item,
      h, mh,
      sortCam = { x:CAM_X+ORIGIN_X, y:CAM_Y+ORIGIN_Y },
      footprint,
      wallColor, altColor, roofColor,
      dataItems = Data.items,
      center, radius;

    dataItems.sort(function(a, b) {
      return (a.z_index-b.z_index) || (a.minHeight-b.minHeight) || getDistance(b.center, sortCam) - getDistance(a.center, sortCam)|| ((b.height||0)-(a.height||0)) ;
    });

    for (var i = 0, il = dataItems.length; i < il; i++) {
      item = dataItems[i];

      if (Simplified.isSimple(item)) {
        continue;
      }

      footprint = item.footprint;

      if (!isVisible(footprint)) {
        continue;
      }

      // when fading in, use a dynamic height
      h = item.scale < 1 ? item.height*item.scale : item.height;

      mh = 0;
      if (item.minHeight) {
        mh = item.scale < 1 ? item.minHeight*item.scale : item.minHeight;
      }

      wallColor = item.wallColor || WALL_COLOR_STR;
      altColor  = item.altColor  || ALT_COLOR_STR;
      roofColor = item.roofColor || ROOF_COLOR_STR;
      context.strokeStyle = altColor;

      switch (item.shape) {
        case 'cylinder':
          center = item.center;
          radius = item.radius;
          Cylinder.draw(context, center, radius, radius, h, mh, wallColor, altColor, roofColor);
          if (item.roofShape === 'cone') {
            Cylinder.draw(context, center, radius, 0, h+item.roofHeight, h, roofColor, ''+ parseColor(roofColor).lightness(0.9));
          }
          if (item.roofShape === 'dome') {
            Cylinder.draw(context, center, radius, radius/2, h+item.roofHeight, h, roofColor, ''+ parseColor(roofColor).lightness(0.9));
          }
        break;

        case 'cone':
          Cylinder.draw(context, item.center, item.radius, 0, h, mh, wallColor, altColor);
        break;

        case 'pyramid':
          Pyramid.draw(context, footprint, item.center, h, mh, wallColor, altColor);
        break;

        case 'dome':
          Cylinder.draw(context, item.center, item.radius, item.radius/2, h, mh, wallColor, altColor);
        break;

        default:
          var centerLine, p;
          Block.draw(context, footprint, item.holes, h, mh, wallColor, altColor, roofColor);
          if (item.roofShape === 'pyramid') {
            Pyramid.draw(context, footprint, item.center, h+item.roofHeight, h, roofColor, parseColor(roofColor).lightness(0.9));
          } else if(item.roofShape === "gabled") {
	          if (Math.abs(footprint[0] - footprint[2]) < Math.abs(footprint[2] - footprint[4])){
		          p = 0;
	          } else {
		          p = 2;
	          }
	          centerLine = {
			      l: {
				      x: Math.max(footprint[p], footprint[p+2]) - Math.abs(footprint[p] - footprint[p+2])/2 -ORIGIN_X,
			          y: Math.max(footprint[p+1], footprint[p+3]) - Math.abs(footprint[p+1] - footprint[p+3])/2 -ORIGIN_Y
			      },
			      r: {
				      x: Math.max(footprint[p+4], footprint[p+6]) - Math.abs(footprint[p+4] - footprint[p+6])/2 -ORIGIN_X,
			          y: Math.max(footprint[p+5], footprint[p+7]) - Math.abs(footprint[p+5] - footprint[p+7])/2 -ORIGIN_Y
			      }
		      };
	          centerLine.orientation = p === 0 ? 'along' : 'across';
            Gabled.draw(context, footprint, centerLine, h+(item.roofHeight||2), h, roofColor, parseColor(roofColor).lightness(0.9));
          } else if(item.roofShape === "hipped") {
	          if (Math.abs(footprint[0] - footprint[2]) < Math.abs(footprint[2] - footprint[4])){
		          p = 0;
	          } else {
		          p = 2;
	          }
	           var helper = {
				      x: Math.max(footprint[p], footprint[p+2]) - Math.abs(footprint[p] - footprint[p+2])/2,
			          y: Math.max(footprint[p+1], footprint[p+3]) - Math.abs(footprint[p+1] - footprint[p+3])/2
	           };
	           centerLine = {
			      l: {
				      x: item.center.x +(p?+1:-1)* Math.abs(item.center.x - helper.x)/3*2 -ORIGIN_X,
				      y: item.center.y - Math.abs(item.center.y - helper.y)/3*2 -ORIGIN_Y
			      },
			      r: {
				      x: item.center.x +(p?-1:+1)* Math.abs(item.center.x - helper.x)/3*2 -ORIGIN_X,
				      y: item.center.y + Math.abs(item.center.y - helper.y)/3*2 -ORIGIN_Y
			      }
		      };
	          centerLine.orientation = p === 0 ? 'along' : 'across';

            Gabled.draw(context, footprint, centerLine, h+(item.roofHeight||2), h, roofColor, parseColor(roofColor).lightness(0.9));
          }
      }
    }
  }
};
