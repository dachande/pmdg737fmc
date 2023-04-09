# Changelog

## Version 1.24

* Add dark case

## Version 1.23

* Modify click spot for CDU switch
* Update line-positioning on screen only variant
* Remove font glow on screen only variant

## Version 1.22

* Fix EXEC light on right CDU not illuminating
* Remove debugging snippet that was accidentially left in the code
* Add touch vibration on mobile devices that supports it
* Add version number to CDU selection screen to better identify which version is being used
* Add querystring parameter to allow preselection of left/right CDU skipping the preselect screen
* Allow switching between CDUs without the need to reload the browser window to get back to preselect screen
* Some minor code optimizations

## Version 1.21

* Fix size of square characters on iOS devices

## Version 1.20

* Complete graphical rework of the CDU interface
* Usage of the PMDG font for the CDU screen
* Enable keyboard input by default
* Prevent zoom on mobile devices when double-tapping
* Add detailed documentation

## Version 1.11

* Add screen-only CDU without keypad (useful for home cockpit)
* Minor screen optimizations

## Version 1.10

* JavaScript code optimization
* Merge control of both CDUs into a single file
* Add left/right CDU preselect screen
* Maximize CDU to window with/height keeping aspect ratio on load
* Resizing browser window also resizes CDU while keeping aspect ratio (still not perfect, though)
* Better handling on mobile devices (CDU size, key events, etc.)
* Long press won't open context menu on mobile browser (very useful for CLR key)
* Allow scratchpad input using keyboard (disabled by default)

## Version 1.03

* Initial version from the official AAO website
