# zpl-rest
zpl-rest provides the following
- REST-API to manage labels (written in ZPL), printer and to print these labels
- a simple graphical user interface for this REST-API
- you can use mustache in your ZPL-Code
- you can preview the result of your ZPL-Code
- you can test print your ZPL-Code
- you can review and reprint printjobs
- you can use placeholder in your ZPL labels (${varname}) which will be replaced through the API e.g.:
```ZPL
^XA
^LH0,0
^MTT
^A0N,36,36
^FO236,71
^FD${sometext}^FS
^XZ
```

which you can replace with the following POST-request to `/rest/print`:
```JSON
{
    printer:"printer id",
    label:"id of the label",
    data : {
      sometext: "hello world"
    }
}
```


## installation and start

download this repo und run `npm start`

## frontend
- overview page with statistics
![a screenshot of the frontend](https://github.com/mrothenbuecher/zpl-rest/raw/master/img/screenshot.png "Overview")
-
![a screenshot of the reprint page](https://github.com/mrothenbuecher/zpl-rest/raw/master/img/screenshot3.png "Reprint page")
- label page, with label preview
![a screenshot of the frontend](https://github.com/mrothenbuecher/zpl-rest/raw/master/img/screenshot2.png "Label page")

## REST-API

| Method              | Path                      | parameter                                                                                                                     | description                                                                                           |
| ------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| get                 | /rest/printer             | none                                                                                                                          | list of all printers                                                                                  |
| get                 | /rest/label               | none                                                                                                                          | list of all labels                                                                                    |
| get                 | /rest/jobs                | none                                                                                                                          | list of all printjobs                                                                                 |
| get                 | /rest/preview             | ?printer=printer_id&label=label_id(&zpl=...)                                                                                  | generates a preview of the label using [this service](http://labelary.com/service.html#node) as base64|
| post                | /rest/print               | {printer:"printer_id...",label:"label_id...", data: {...}}                                                                    | actual print                                                                                          |
| post                | /rest/reprint/(:jobid)    | ({printer:"printer_id...", zpl:"..."})                                                                                        | reprint, change printer if wanted or ZPL-code                                                         |
| post                | /rest/preview             | {printer:"printer_id...",label:"label_id..."(,zpl:"...")}                                                                     | generates a preview of the label using [this service](http://labelary.com/service.html#node) as base64|
| post                | /rest/printer             | to add : {address:"..",name:"...",density:"..."} for update {_id:"...",address:"..",name:"...",density:"..."}                 | add or update a printer                                                                               |
| post                | /rest/label               | to add : {name:"...",zpl:"...",width:"...",height:"..."} for update {_id:"...",name:"...",zpl:"...",width:"...",height:"..."} | add or update a label                                                                                 |
| delete              | /rest/printer/(:printerid)| none                                                                                                                          | removes a printer with the given id                                                                   |
| delete              | /rest/label/(:labelid)    | none                                                                                                                          | removes a label with the given id                                                                     |

## options
you can edit the config.js with following options:

| Option              | Type          | description                                    |  Default  |
| ------------------- |:-------------:| ---------------------------------------------- | :-------: |
| port                | int           | port for the RESTAPI                           |    8000   |
| websocket_port      | int           | websocket port for the frontend                |    8001   |
| public              | bool          | if `false` server only reachable for localhost |     true  |
| secret              | string        | the session secret                             |           |

# thanks to
[template for the frontend](https://startbootstrap.com/themes/sb-admin-2/)

[labelary for providing the preview service](http://labelary.com/service.html#node)

# a little help is welcome :)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KNC9P27TLHGDE&source=url)
