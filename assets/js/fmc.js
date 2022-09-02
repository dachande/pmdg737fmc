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
    this.allowKeyboard = opts.allowKeyboard || false

    // Break script if AAO URI is not supplied
    if (typeof this.aaoUri === 'undefined') {
      console.log('Error: FMC logic initialized without supplying Axis And Ohs WebAPI URI.')
      return
    }

    this._selector = document.getElementsByClassName('Selector')[0]
    this._selectorButtons = document.getElementsByClassName('Selector__Button')
    this._fmcButtons = document.getElementsByClassName('Fmc__Button')
    this._fmc = document.getElementsByClassName('Fmc')[0]
    this._display = document.getElementsByClassName('Fmc__Grid')[0]
    // this._displayContainer = document.getElementById('DisplayContainer')

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

    this._keymap = []
    this._buttonmap = {
      'lsk-1l':        { target: '(>K:ROTOR_BRAKE)', eventId: 53401 },
      'lsk-2l':        { target: '(>K:ROTOR_BRAKE)', eventId: 53501 },
      'lsk-3l':        { target: '(>K:ROTOR_BRAKE)', eventId: 53601 },
      'lsk-4l':        { target: '(>K:ROTOR_BRAKE)', eventId: 53701 },
      'lsk-5l':        { target: '(>K:ROTOR_BRAKE)', eventId: 53801 },
      'lsk-6l':        { target: '(>K:ROTOR_BRAKE)', eventId: 53901 },

      'lsk-1r':        { target: '(>K:ROTOR_BRAKE)', eventId: 54001 },
      'lsk-2r':        { target: '(>K:ROTOR_BRAKE)', eventId: 54101 },
      'lsk-3r':        { target: '(>K:ROTOR_BRAKE)', eventId: 54201 },
      'lsk-4r':        { target: '(>K:ROTOR_BRAKE)', eventId: 54301 },
      'lsk-5r':        { target: '(>K:ROTOR_BRAKE)', eventId: 54401 },
      'lsk-6r':        { target: '(>K:ROTOR_BRAKE)', eventId: 54501 },

      'init-ref':      { target: '(>K:ROTOR_BRAKE)', eventId: 54601 },
      'rte':           { target: '(>K:ROTOR_BRAKE)', eventId: 54701 },
      'clb':           { target: '(>K:ROTOR_BRAKE)', eventId: 54801 },
      'crz':           { target: '(>K:ROTOR_BRAKE)', eventId: 54901 },
      'des':           { target: '(>K:ROTOR_BRAKE)', eventId: 55001 },
      'menu':          { target: '(>K:ROTOR_BRAKE)', eventId: 55101 },
      'legs':          { target: '(>K:ROTOR_BRAKE)', eventId: 55201 },
      'dep-arr':       { target: '(>K:ROTOR_BRAKE)', eventId: 55301 },
      'hold':          { target: '(>K:ROTOR_BRAKE)', eventId: 55401 },
      'prog':          { target: '(>K:ROTOR_BRAKE)', eventId: 55501 },
      'exec':          { target: '(>K:ROTOR_BRAKE)', eventId: 55601 },
      'n1-limit':      { target: '(>K:ROTOR_BRAKE)', eventId: 55701 },
      'fix':           { target: '(>K:ROTOR_BRAKE)', eventId: 55801 },
      'prev-page':     { target: '(>K:ROTOR_BRAKE)', eventId: 55901 },
      'next-page':     { target: '(>K:ROTOR_BRAKE)', eventId: 56001 },

      'brt-down':      { target: '(>K:ROTOR_BRAKE)', eventId: 60501, type: 'release' },
      'brt-up':        { target: '(>K:ROTOR_BRAKE)', eventId: 60502, type: 'release' },

      'numpad-1':      { target: '(>K:ROTOR_BRAKE)', eventId: 56101, key: '1' },
      'numpad-2':      { target: '(>K:ROTOR_BRAKE)', eventId: 56201, key: '2' },
      'numpad-3':      { target: '(>K:ROTOR_BRAKE)', eventId: 56301, key: '3' },
      'numpad-4':      { target: '(>K:ROTOR_BRAKE)', eventId: 56401, key: '4' },
      'numpad-5':      { target: '(>K:ROTOR_BRAKE)', eventId: 56501, key: '5' },
      'numpad-6':      { target: '(>K:ROTOR_BRAKE)', eventId: 56601, key: '6' },
      'numpad-7':      { target: '(>K:ROTOR_BRAKE)', eventId: 56701, key: '7' },
      'numpad-8':      { target: '(>K:ROTOR_BRAKE)', eventId: 56801, key: '8' },
      'numpad-9':      { target: '(>K:ROTOR_BRAKE)', eventId: 56901, key: '9' },
      'numpad-dot':    { target: '(>K:ROTOR_BRAKE)', eventId: 57001, key: '.' },
      'numpad-0':      { target: '(>K:ROTOR_BRAKE)', eventId: 57101, key: '0' },
      'numpad-minus':  { target: '(>K:ROTOR_BRAKE)', eventId: 57201, key: '-' },

      'keypad-a':      { target: '(>K:ROTOR_BRAKE)', eventId: 57301, key: 'a' },
      'keypad-b':      { target: '(>K:ROTOR_BRAKE)', eventId: 57401, key: 'b' },
      'keypad-c':      { target: '(>K:ROTOR_BRAKE)', eventId: 57501, key: 'c' },
      'keypad-d':      { target: '(>K:ROTOR_BRAKE)', eventId: 57601, key: 'd' },
      'keypad-e':      { target: '(>K:ROTOR_BRAKE)', eventId: 57701, key: 'e' },
      'keypad-f':      { target: '(>K:ROTOR_BRAKE)', eventId: 57801, key: 'f' },
      'keypad-g':      { target: '(>K:ROTOR_BRAKE)', eventId: 57901, key: 'g' },
      'keypad-h':      { target: '(>K:ROTOR_BRAKE)', eventId: 58001, key: 'h' },
      'keypad-i':      { target: '(>K:ROTOR_BRAKE)', eventId: 58101, key: 'i' },
      'keypad-j':      { target: '(>K:ROTOR_BRAKE)', eventId: 58201, key: 'j' },
      'keypad-k':      { target: '(>K:ROTOR_BRAKE)', eventId: 58301, key: 'k' },
      'keypad-l':      { target: '(>K:ROTOR_BRAKE)', eventId: 58401, key: 'l' },
      'keypad-m':      { target: '(>K:ROTOR_BRAKE)', eventId: 58501, key: 'm' },
      'keypad-n':      { target: '(>K:ROTOR_BRAKE)', eventId: 58601, key: 'n' },
      'keypad-o':      { target: '(>K:ROTOR_BRAKE)', eventId: 58701, key: 'o' },
      'keypad-p':      { target: '(>K:ROTOR_BRAKE)', eventId: 58801, key: 'p' },
      'keypad-q':      { target: '(>K:ROTOR_BRAKE)', eventId: 58901, key: 'q' },
      'keypad-r':      { target: '(>K:ROTOR_BRAKE)', eventId: 59001, key: 'r' },
      'keypad-s':      { target: '(>K:ROTOR_BRAKE)', eventId: 59101, key: 's' },
      'keypad-t':      { target: '(>K:ROTOR_BRAKE)', eventId: 59201, key: 't' },
      'keypad-u':      { target: '(>K:ROTOR_BRAKE)', eventId: 59301, key: 'u' },
      'keypad-v':      { target: '(>K:ROTOR_BRAKE)', eventId: 59401, key: 'v' },
      'keypad-w':      { target: '(>K:ROTOR_BRAKE)', eventId: 59501, key: 'w' },
      'keypad-x':      { target: '(>K:ROTOR_BRAKE)', eventId: 59601, key: 'x' },
      'keypad-y':      { target: '(>K:ROTOR_BRAKE)', eventId: 59701, key: 'y' },
      'keypad-z':      { target: '(>K:ROTOR_BRAKE)', eventId: 59801, key: 'z' },
      'keypad-space':  { target: '(>K:ROTOR_BRAKE)', eventId: 59901, key: ' ' },
      'keypad-delete': { target: '(>K:ROTOR_BRAKE)', eventId: 60001, key: 'Delete' },
      'keypad-slash':  { target: '(>K:ROTOR_BRAKE)', eventId: 60101, key: '/' },
      'keypad-clear':  { target: '(>K:ROTOR_BRAKE)', eventId: 60201, type: 'release', key: 'Backspace' }
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
    this._loop = null

    this.initialize()
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
      case '0':
        return "£"
      case '&':
        return "&amp;"
      case '<':
        return "&lt;"
      case '>':
        return "&gt;"
      case 'ê':
        return "□"
      case 'ë':
        return "■"
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
   * Initialize logic
   */
  initialize () {
    var t = this;

    // Initialize pointer events on all buttons
    [].forEach.call(t._fmcButtons, function (button) {
      const key = button.dataset.key
      const keyData = t._buttonmap[key]

      // Skip button if not found in keymap
      if (typeof keyData === 'undefined') {
        return
      }

      const eventTarget = keyData.target
      const pushEventId = keyData.eventId
      const releaseEventId = (pushEventId) + 3

      if (keyData.type === 'release') {
        button.addEventListener('pointerdown', function () { t.sendEvent(pushEventId, eventTarget) })
        button.addEventListener('pointerup', function () { t.sendEvent(releaseEventId, eventTarget) })
      } else {
        button.addEventListener('pointerdown', function () { t.sendEventRelease(pushEventId, eventTarget) })
      }

      // Prefill keymap
      if (typeof keyData.key !== 'undefined') {
        t._keymap[keyData.key] = keyData
      }
    });

    // Set click event on CDU select buttons on select screen
    [].forEach.call(t._selectorButtons, function (button) {
      const cduId = button.dataset.cduid
      button.addEventListener('click', function () {
        t.setCdu(cduId)

        if (t._states.loopRunning === false) {
          t.startMainLoop()
        }

        t._selector.style.display = 'none'
        t._fmc.style.display = 'block'
        if (t._fmc.classList.contains('Fmc__Body--ScreenOnly')) {
          t.scaleBasedOnWindow(t._displayContainer, 1, true)
        } else {
          t.scaleBasedOnWindow(t._fmc, 1, true)
        }
      })
    })

    // Prevent long press from opening context menu to allow long press of CDU buttons
    t._fmc.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });

    // Rescale CDU on resize
    window.addEventListener('resize', function () {
      if (t._fmc.classList.contains('Fmc__Body--ScreenOnly')) {
        t.scaleBasedOnWindow(t._displayContainer, 1, true)
      } else {
        t.scaleBasedOnWindow(t._fmc, 1, true)
      }
    })

    // Enable keyboard input
    if (t.allowKeyboard === true) {
      window.addEventListener('keydown', function (e) {
        const key = e.key
        const keyData = t._keymap[key]

        if (typeof keyData !== 'undefined') {
          t.sendEventRelease(keyData.eventId, keyData.target)
        }
      })
    }
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
        for (var row = 0; row < 14; row++) {
          for (var column = 0; column < 24; column++) {
            var position = (row * 3) + (column * 14 * 3)
            var chrval = newdata.charAt(position++)
            var color = parseInt(newdata.charAt(position++))
            var format = parseInt(newdata.charAt(position++))

            if (row == 13) {
              newInner += "<div class=\"Grid__Item Grid__Item--Scratchpad\">";
            } else {
              if (format == 1) {
                newInner += "<div class=\"Grid__Item Grid__Item--Label\">";
              } else {
                newInner += "<div class=\"Grid__Item Grid__Item--Line\">";
              }
            }

            newInner += "<span class=\"" + this.getColorClass(color, format) + "\" >";
            newInner += this.convertCharacter(chrval)
            newInner += "</span></div>"
          }
        }

        console.log(newInner)
        this._display.innerHTML = newInner
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
     this._display.style.opacity = this._states.lastbright
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
    t._loop = window.setInterval(function () {
      t.mainLoop()
    }, this.loopInterval)
    t._states.loopRunning = true
  }

  /**
   * Stop the main loop
   */
  stopMainLoop () {
    var t = this
    if (t._loop !== null && t._states.loopRunning === true) {
      window.clearInterval(t._loop)
      t._loop = null
      t._states.loopRunning = false
    }
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
