/*
 * Detects various browser features and vendors
 */

if ( typeof window == 'undefined' ) {
  module.exports = {} // no detection for node
} else {

  var transforms = {
      'webkitTransform':'-webkit-transform',
      'OTransform':'-o-transform',
      'msTransform':'-ms-transform',
      'MozTransform':'-moz-transform',
      'transform':'transform'
  }
  var ua = navigator.userAgent.toLowerCase()
  var isWebkit = ua.indexOf( "applewebkit" ) > -1
  var platform = navigator.platform
  var hasWebP = false
  var webP = new Image()
  webP.onerror = webP.onload = function() {
    hasWebP = webP.height == 2
  }
  webP.src='data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'

  module.exports = {

    touch: !!('ontouchstart' in document),

    canvas: !!('getContext' in document.createElement('canvas')),

    blendMode: document.documentElement && typeof window.getComputedStyle(document.documentElement).backgroundBlendMode != 'undefined',

    svg: (function() {
      return !! document.createElementNS &&
             !! document.createElementNS('http://www.w3.org/2000/svg','svg').createSVGRect
    }()),

    webp: hasWebP,

    ie: (function() {

      var v = 3
      var div = document.createElement( 'div' )
      var all = div.getElementsByTagName( 'i' )

      do
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->'
      while 
        (all[0])
      return v > 4 ? v : ( document.documentMode || parseFloat(ua.replace(/^.*edge\/([\d]{1,2}(\.[\d]+)?).*$/i,'$1')) || undefined )

    }()),

    iphone: isWebkit && /iPhone/.test( platform ),
    ipad:   isWebkit && /iPad/.test( platform ),
    ipod:   isWebkit && /iPod/.test( platform ),
    ios:    isWebkit && /iPhone|iPad|iPod/.test( platform ),
    safari: !!(/safari/.test(ua) && !(/chrome/.test(ua))),
    chrome: /chrome/.test(ua),

    mac: platform.toUpperCase().indexOf('MAC') >= 0,

    retina: (function() {
      var dp = window.devicePixelRatio
      var mm = window.matchMedia
      if ( mm ) {
        var mq = mm("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)")
        return !!( (mq && mq.matches) || dp > 1 )
      } 
      return dp ? dp > 1 : false
    }()),

    transformPrefix: (function() {
      var el = document.createElement('p')
      for (var t in transforms) {
        if ( typeof el.style[t] != 'undefined' )
          return t
      }
      return ''
    }()),
    
    translate3d: (function() {
      var el = document.createElement('p')
      var has3d

      document.documentElement.insertBefore(el, null)

      for (var t in transforms) {
        if ( typeof el.style[t] != 'undefined' ) {
          el.style[t] = 'translate3d(1px,1px,1px)'
          has3d = window.getComputedStyle(el).getPropertyValue(transforms[t])
          break
        }
      }

      document.documentElement.removeChild(el)
      return (has3d !== undefined && has3d.length > 0 && has3d !== "none")
    }())
  }
}
