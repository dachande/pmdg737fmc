# Axis & Oh's Web CDU for the PMDG 737-700 for MSFS and the PMDG 737 NGX/NGXu/NG3

This mod is for the PMDG 737-700 for MSFS and the PMDG 737 NGX/NGXu/NG3

**The web CDU requires an up-to-date browser to work !**

## Instructions

1. Most importantly: follow the instructions in the chapter about the PMDG aircraft in the Axis & Oh's manual!

2. You have to activate the PMDG SDK data broadcast first. For that to work, you have to activate the data transmission from the PMDG plane. Find the file 737_Options.ini in
```
<MSFS_Directory>\LocalState\packages\pmdg-aircraft-737\work
```
and add the following lines to the end with a standard text editor:

```
[SDK]
EnableDataBroadcast=1
EnableCDUBroadcast.0=1
EnableCDUBroadcast.1=1
```

3. Start the sim

4. Start AAO "As administrator". Otherwise the WebAPI of AAO will not work.

4. Make sure to enable the WebAPI in AAO in the "Tools" menu. If have to enable the WebAPI restart AAO afterwards. This has only to be done once.

5. Connect AAO to the sim and load the aircraft

6. Configure the following script as "Aircraft Automated Script": (you only have to do this once)
* "PMDG-PMDG_737MSFS_CDU" for the 737 in MSFS
* "PMDG-PMDG_737NG3_CDU" for the 737 NGXu/NG3 in Prepar3D
* "PMDG-PMDG_737NGX_CDU" for the legacy 737 NGX

7. Load the following address in your browser:
```http://localhost:9080/webapi/pmdg737fmc/index.html``` \
If you have changed the WebAPI port in AAO make sure to use the correct port here.

8. Select the left or right CDU by clicking on the corresponding button

When you want to load the CDU from a remote computer, "localhost" must be replaced with the actual IP Address of the computer where AAO is running.