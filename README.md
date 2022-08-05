# Axis & Oh's Web CDU for the PMDG 737 Series (600/700/800) for MSFS

This mod is for the PMDG 737 series for MSFS. It might also work for the PMDG 737 NGX/NGXu/NG3 for P3D and FSX but it hasn't been tested and therefore is not supported.

This release is based on the initial version of the CDU add-on created by Lorby and friends.

**The web CDU requires an up-to-date browser to work !**

**This is a work in progress. There might still be bugs around so please note that it might not work as expected.**

## Instructions

1. Most importantly: follow the instructions in the chapter about the PMDG aircraft in the Axis & Oh's manual!

2. You have to activate the PMDG SDK data broadcast first. For that to work, you have to activate the data transmission from the PMDG plane. To do so find the file `737_Options.ini` in
```
737-700: <MSFS_Directory>\LocalState\packages\pmdg-aircraft-737\work
737-600: <MSFS_Directory>\LocalState\packages\pmdg-aircraft-736\work
```
and add the following lines to the end of the file with a standard text editor:

```
[SDK]
EnableDataBroadcast=1
EnableCDUBroadcast.0=1
EnableCDUBroadcast.1=1
```

3. Start the sim

4. Start AAO "As administrator". Otherwise the WebAPI of AAO will not work.

4. Make sure to enable the WebAPI in AAO in the "Tools" menu. If you had to enable the WebAPI restart AAO afterwards. This has only to be done once. After that the WebAPI will stay enabled.

5. Connect AAO to the sim and load the aircraft

6. Configure one of the following scripts as an *Aircraft Automated Script* in AAO depending on the used simulator and set it as a *repeating event* with a delay of `200` millisecond. You'll only have to do this once. And please remember that only MSFS has been tested and is known to work. Support for other simulators might stop at any time.

* `PMDG-PMDG_737MSFS_CDU` for the 737 in MSFS
* `PMDG-PMDG_737NG3_CDU` for the 737 NGXu/NG3 in Prepar3D
* `PMDG-PMDG_737NGX_CDU` for the legacy 737 NGX

7. Now load the following address in your browser:
```http://localhost:9080/webapi/pmdg737fmc/index.html``` \
If you have changed the WebAPI port in AAO make sure to use the correct port here.

8. Select the left or right CDU by clicking on the corresponding button

When you want to load the CDU from a remote computer, "localhost" must be replaced with the actual IP Address of the computer where AAO is running.

If you'd like to load only the CDU screen without the keypad (useful for implementing into a real CDU) load `screen.html` instead of `index.html`.
## Enable scratchpad keyboard input

If you want to be able to use the keyboard to input data into the scratchpad, everything you need to do is set the ```allowKeyboard``` option to ```true``` on initialization. To do this just follow these simple steps:

1. Open the `index.html` file with some text editor

2. Modify the JavaScript code block on the bottom of the file to look like this:

```
<script type="text/javascript">
  var fmc = new Fmc({
    aaoUri: '<AAO_URL>',
    cduId: 0,
    allowKeyboard: true
  })
</script>
```

3. Save the file and reload the page in your browser. Keyboard input should now be possible.

---

## Credits

A huge shoutout and a big thank you to Lorby for his excellent software *Axis And Ohs* and for his initial version of this CDU add-on for the PMDG 737. Awesome work!
