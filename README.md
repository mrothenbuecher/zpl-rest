# zpl-rest

Print to Zebra label printers from any system via HTTP. zpl-rest is a self-hosted print server that stores your ZPL templates, fills in placeholders from JSON and sends the result to the printer over the network. A web UI shows label previews, print statistics and past print jobs.

![Dashboard with print statistics](https://github.com/mrothenbuecher/zpl-rest/raw/master/img/screenshot.png "Overview")

## Why zpl-rest

Zebra printers accept raw ZPL on TCP port 9100, but sending it from an ERP, a warehouse app or a shell script usually means writing socket code in every system. zpl-rest moves that into one place. Your applications send a short JSON request with the label name and the data, and zpl-rest handles templates, printer addresses and the job history.

## Features

- REST API to manage printers and ZPL label templates
- Placeholders (`${varname}`) and [Mustache](https://mustache.github.io/) syntax inside ZPL
- Label preview rendered via the [Labelary](http://labelary.com/service.html) API
- Test print directly from the web UI
- Job history with reprint, optionally on a different printer or with edited ZPL
- Optional `job_id` to match print jobs with records in your own system
- Runs with Node.js or Docker, data stored as JSON files on disk

## Quick start

### Docker

```bash
git clone https://github.com/mrothenbuecher/zpl-rest.git
cd zpl-rest
docker compose up -d
```

The web UI is then available at `http://localhost:8110`. Printers, labels and jobs are stored in `./volumes` on the host.

### Node.js

```bash
git clone https://github.com/mrothenbuecher/zpl-rest.git
cd zpl-rest
npm install
npm start
```

The web UI is then available at `http://localhost:8000`.

## Usage

### 1. Add a printer

The address is the printer's IP and raw port, usually 9100. The density is the print resolution in dots per millimetre as used by Labelary (`6dpmm`, `8dpmm`, `12dpmm` or `24dpmm`).

```bash
curl -X POST http://localhost:8000/rest/printer \
  -H "Content-Type: application/json" \
  -d '{"name": "Warehouse 1", "address": "192.168.0.50:9100", "density": "8dpmm"}'
```

### 2. Add a label template

Width and height are given in inches.

```zpl
^XA
^LH0,0
^MTT
^A0N,36,36
^FO236,71
^FD${sometext}^FS
^XZ
```

### 3. Print

```bash
curl -X POST http://localhost:8000/rest/print \
  -H "Content-Type: application/json" \
  -d '{
        "printer": "<printer id>",
        "label": "<label id>",
        "job_id": "order-4711",
        "data": { "sometext": "hello world" }
      }'
```

zpl-rest replaces `${sometext}` with `hello world` and sends the finished ZPL to the printer. The `job_id` is optional. It is stored with the job and shown in the dashboard failure list and on the reprint page.

## Web UI

Reprint page with the history of all print jobs:

![Reprint page](https://github.com/mrothenbuecher/zpl-rest/raw/master/img/screenshot3.png "Reprint page")

Label editor with live preview:

![Label page with preview](https://github.com/mrothenbuecher/zpl-rest/raw/master/img/screenshot2.png "Label page")

## REST API

| Method | Path | Body / query | Description |
| ------ | ---- | ------------ | ----------- |
| GET | `/rest/printer` | none | List all printers |
| GET | `/rest/label` | none | List all labels |
| GET | `/rest/jobs` | none | List all print jobs |
| GET | `/rest/preview` | `?printer=<id>&label=<id>(&zpl=...)` | Label preview as base64 image |
| POST | `/rest/preview` | `{printer, label (, zpl)}` | Label preview as base64 image |
| POST | `/rest/print` | `{printer, label, data (, job_id)}` | Print a label |
| POST | `/rest/reprint/:jobid` | `({printer, zpl})` | Reprint a job, optionally with another printer or changed ZPL |
| POST | `/rest/printer` | add: `{name, address, density}`<br>update: `{_id, name, address, density}` | Add or update a printer |
| POST | `/rest/label` | add: `{name, zpl, width, height}`<br>update: `{_id, name, zpl, width, height}` | Add or update a label |
| DELETE | `/rest/printer/:printerid` | none | Remove a printer |
| DELETE | `/rest/label/:labelid` | none | Remove a label |

## Configuration

Settings go into `config.json` in the project root. Any option you leave out uses its default.

```json
{
  "port": 8000,
  "websocket_port": 8001,
  "public": true,
  "secret": "change-me"
}
```

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `port` | int | Port for the REST API and web UI | `8000` |
| `websocket_port` | int | WebSocket port used by the web UI | `8001` |
| `public` | bool | If `false`, the server only listens on localhost | `true` |
| `secret` | string | Session secret, set your own value in production | `top_secret` |

## Privacy note

Label previews are rendered by the external Labelary service. The ZPL of the label is sent to `api.labelary.com` for every preview. Printing itself goes directly from zpl-rest to your printer and does not use Labelary.

## Contributing

Bug reports, feature ideas and pull requests are welcome. Please open an issue first for larger changes so we can discuss the approach. If you use zpl-rest in production, a short note in [Discussions](https://github.com/mrothenbuecher/zpl-rest/discussions) about your setup helps to decide what to work on next.

You can also [take part in this short survey](https://forms.gle/7CUv6PXQuTXQQgsR9).

## Credits

- Frontend template: [SB Admin 2](https://startbootstrap.com/themes/sb-admin-2/)
- Label previews: [Labelary](http://labelary.com/service.html)

## Support the project

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KNC9P27TLHGDE&source=url)

## License

[MIT](LICENSE)
