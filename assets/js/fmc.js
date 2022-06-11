class Fmc {
  /**
   * Initialize FMC logic
   *
   * @param {object} opts
   * @returns
   */
  constructor (opts) {
    this.aaoUri = opts.aaoUri
    this.cduId = opts.cduId || 0
    this.loopInterval = opts.loopInterval || 100
    this.allowKeyboard = opts.allowKeyboard || 0

    // Break script if AAO URI is not supplied
    if (typeof this.aaoUri === 'undefined') {
      console.log('Error: FMC logic initialized without supplying AxisAndOhs WebAPI URI.')
      return
    }

    this._selectorButtons = document.getElementsByClassName('FmcSelect__Button')
    this._buttons = document.getElementsByClassName('Button')

    this._states = {
      lasthash: '',
      execstate: 0,
      callstate: 0,
      failstate: 0,
      msgstate: 0,
      ofststate: 0,
      lastbright: 0,
      loopRunning: false
    }

    this._cdu = [
      {
        eventIdOffset: 0,
        cduDataVar: '(L:AAO_PMDG_CDU_0, String)',
        cduBrightnessVar: '(L:AAO_PMDG_CDU_0_BRT)'
      },
      {
        eventIdOffset: 7200,
        cduDataVar: '(L:AAO_PMDG_CDU_1, String)',
        cduBrightnessVar: '(L:AAO_PMDG_CDU_1_BRT)'
      }
    ]

    this._mainRequestObj = {}

    this.initializeEvents()
    // this.setCdu(this.cduId)
    // this.startMainLoop()
  }

  /**
   * Set the currently active CDU
   *
   * 0: left CDU
   * 1: right CDU
   *
   * @param {int} cduId
   * @returns
   */
  setCdu (cduId) {
    // CDU Id must be 0 or 1
    cduId = parseInt(cduId)
    if (isNaN(cduId) || cduId < 0 || cduId > 1) {
      return
    }

    this.cduId = cduId
    this._cduData = this._cdu[this.cduId]

    this.initializeRequestObject()
  }

  /**
   * Get correct class for character on FMC screen
   *
   * @param {string} color
   * @param {string} format
   * @returns
   */
  getColorClass (color, format) {
    switch (format) {
      // case 1:
      //    return "smallfont"
      case 2:
        return "inverted"
      case 4:
        return "gray"
    }

    switch (color) {
      case 0:
        return "white"
      case 1:
        return "cyan"
      case 2:
        return "green"
      case 3:
        return "magenta"
      case 4:
        return "amber"
      case 5:
        return "red"
    }

    return "white"
  }

  /**
   * Conver screen character from AAO data to correct
   * character that can be shown on html page
   *
   * @param {string} char
   * @returns
   */
  convertCharacter(char) {
    switch (char) {
      case '&':
        return "&amp;"
      case '<':
        return "&lt;"
      case '>':
        return "&gt;"
      case 'ê':
        return "□"
      case 'ë':
        return "▇"
      case '¡':
        return "←"
      case '¢':
        return "→"
      case ' ':
        return "&nbsp;"
      default:
        return char
    }
  }

  /**
   * Send push- and release-event with defined delay in ms (default=100ms)
   *
   * @param {string} pushEventId
   * @param {string} target
   * @param {int} delay
   */
  sendEventRelease (pushEventId, target, delay) {
    var t = this
    const releaseEventId = (pushEventId - 1) + 4

    if (typeof delay === 'undefined') {
      delay = 100
    }

    t.sendEvent(pushEventId, target)

    window.setTimeout(function () {
      t.sendEvent(releaseEventId, target)
    }, delay)
  }

  /**
   * Send event id to target var
   *
   * @param {string} eventId
   * @param {string} target
   */
  sendEvent (eventId, target) {
    var requestObject = {}
    var cduEventId = eventId + this._cduData.eventIdOffset

    if (target.includes(", ")) {
      requestObject.setvars = [{
        var: target,
        value: cduEventId
      }]
    } else {
      requestObject.triggers = [{
        evt: target,
        value: cduEventId
      }]
    }

    var request = new XMLHttpRequest()
    var requestUri = encodeURI(this.aaoUri + "?json=" + JSON.stringify(requestObject))

    requestUri = requestUri.replace(/\+/g, '%2B').replace('#', '%23')
    request.open("POST", requestUri)
    request.send()
  }

  /**
   * Initiale main request object used to send
   * periodic update requests to AAO
   */
  initializeRequestObject () {
    this._mainRequestObj.getStringVars = [
      { "var": this._cduData.cduDataVar, "value": 0.0 }
    ]

    this._mainRequestObj.getVars = [
      { "var": "(L:switch_6042_73X, number)", "value": 0.0 },
      { "var": "(L:switch_6030_73X, number)", "value": 0.0 },
      { "var": "(L:switch_6031_73X, number)", "value": 0.0 },
      { "var": "(L:switch_6040_73X, number)", "value": 0.0 },
      { "var": "(L:switch_6041_73X, number)", "value": 0.0 },
      { "var": this._cduData.cduBrightnessVar, "value": 0.0 }
    ]
  }

  /**
   * Initialize events
   */
  initializeEvents () {
    var t = this;

    // Initialize pointer events on all buttons
    [].forEach.call(t._buttons, function (button) {
      const eventTarget = button.dataset.target
      const pushEventId = parseInt(button.dataset.eventid)
      const releaseEventId = (pushEventId - 1) + 4
      button.addEventListener('pointerdown', function () { t.sendEvent(pushEventId, eventTarget) })
      button.addEventListener('pointerup', function () { t.sendEvent(releaseEventId, eventTarget) })
    });

    // Set click event on CDU select buttons on select screen
    [].forEach.call(t._selectorButtons, function (button) {
      const cduId = button.dataset.cduid
      button.addEventListener('click', function () {
        t.setCdu(cduId)

        if (t._states.loopRunning === false) {
          t.startMainLoop()
        }

        document.getElementById('FmcSelect').style.display = 'none'
        document.getElementById('Fmc').style.display = 'block'
        t.scaleBasedOnWindow(document.getElementById('Fmc'), 1, true)
      })
    })

    // Prevent long press from opening context menu to allow long press of CDU buttons
    document.getElementById('Fmc').addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });

    // Rescale CDU on resize
    window.addEventListener('resize', function () {
      t.scaleBasedOnWindow(document.getElementById('Fmc'), 1, true)
    })
  }

  /**
   * Callback that gets called when the request
   * in the main loop gets a response
   *
   * TODO: Still needs some optimization
   *
   * @param {XMLHttpRequest} request
   */
  dataRequestListener (request) {
    var commObj = JSON.parse(request.responseText)

    if (commObj.getstringvars[0]) {
      var newdata = commObj.getstringvars[0].value
      var hashend = newdata.indexOf('|')
      var hashstr = newdata.substring(0, hashend)

      newdata = newdata.substring(hashend + 1)

      if (this._states.lasthash !== hashstr) {
        var newInner = ''
        for (var ri = 0; ri < 14; ri++) {
          for (var ci = 0; ci < 24; ci++) {
            var i = (ri * 3) + (ci * 14 * 3)
            var chrval = newdata.charAt(i++)
            var color = parseInt(newdata.charAt(i++))
            var format = parseInt(newdata.charAt(i++))

            if (ri == 13) {
              newInner += "<div class=\"grid-item-inout\">";
            } else {
              if (format == 1) {
                newInner += "<div class=\"grid-item-label\">";
              } else {
                newInner += "<div class=\"grid-item-line\">";
              }
            }

            newInner += "<span class=\"" + this.getColorClass(color, format) + "\" >";
            newInner += this.convertCharacter(chrval)
            newInner += "</span></div>"
          }
        }

        document.getElementById("Electricity").innerHTML = newInner
        this._states.lasthash = hashstr
      }
    }

    if (commObj.getvars[0].value != this._states.execstate) {
      this._states.execstate = commObj.getvars[0].value

      if (this._states.execstate == 0) {
        document.getElementById("execlight").style.visibility = "hidden"
      } else {
        document.getElementById("execlight").style.visibility = "visible"
      }
    }

    if (commObj.getvars[1].value != this._states.callstate) {
      this._states.callstate = commObj.getvars[1].value

      if (this._states.callstate == 0) {
        document.getElementById("calllight").style.visibility = "hidden"
      } else {
        document.getElementById("calllight").style.visibility = "visible"
      }
    }

    if (commObj.getvars[2].value != this._states.failstate) {
      this._states.failstate = commObj.getvars[2].value

      if (this._states.failstate == 0) {
        document.getElementById("faillight").style.visibility = "hidden"
      } else {
        document.getElementById("faillight").style.visibility = "visible"
      }
    }

    if (commObj.getvars[3].value != this._states.msgstate) {
      this._states.msgstate = commObj.getvars[3].value

      if (this._states.msgstate == 0) {
        document.getElementById("msglight").style.visibility = "hidden"
      } else {
        document.getElementById("msglight").style.visibility = "visible"
      }
    }

    if (commObj.getvars[4].value != this._states.ofststate) {
      this._states.ofststate = commObj.getvars[4].value

      if (this._states.ofststate == 0) {
        document.getElementById("ofstlight").style.visibility = "hidden"
      } else {
        document.getElementById("ofstlight").style.visibility = "visible"
      }
    }

    if (commObj.getvars[5].value != this._states.lastbright) {
      this._states.lastbright = commObj.getvars[5].value
      document.getElementById("Electricity").style.filter = "brightness(" + this._states.lastbright + ")"
    }
  }

  scaleBasedOnWindow (element, scale = 1, fit = false) {
    if (!fit) {
      element.style.transform = 'scale(' + scale / Math.min(element.clientWidth / window.innerWidth, element.clientHeight / window.innerHeight) + ')'
    } else {
      element.style.transform = 'scale(' + scale / Math.max(element.clientWidth / window.innerWidth, element.clientHeight / window.innerHeight) + ')'
    }
  }

  /**
   * Start the main loop
   */
   startMainLoop () {
    var t = this
    window.setInterval(function () {
      t.mainLoop()
    }, this.loopInterval)
    t._states.loopRunning = true
  }

  /**
   * Main loop sending periodic update requests
   * to AAO
   */
  mainLoop () {
    var t = this
    var request = new XMLHttpRequest()
    request.addEventListener('load', function () {
      t.dataRequestListener(this)
    })
    request.open('GET', this.aaoUri + "?json=" + JSON.stringify(this._mainRequestObj))
    request.send()
  }
}
