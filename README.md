# Eight Sleep Accessory

## Installation

    [sudo] npm install -g homebridge-eightsleep

## Configuring

Example config.json:

    {
      "accessories": [
        {
          "accessory": "Eight Sleep",
          "name": "Master Bed",
          "left": "Nick's Bed",
          "right": "Nancy's Bed",
          "heat_percent": 90,
          "heat_minutes": 30,
          "email": "bobs@burgers.com",
          "password": "bobbobbaran"
        }
      ]
    }

Exposes the bed preheating function. The `heat_percent` and `heat_minutes`
control what happens when you turn on the heat.

If you use the example above, you would gain Siri commands like:

- _"Turn on the Master Bed"_ (Preheat both sides of the mattress for 30 minutes at 90%)
- _"Turn on Nick's Bed"_ (Preheat just the left side - this is optional; you can omit left/right in your config)

Note that "left" and "right" are from the perspective of when you are standing
at the foot of the bed and looking at it.

## Multiple Devices

If you own multiple Eight products, you can create multiple accessories as
above and give them different names. Run the plugin as-is and it will see there
are more than one linked to your email/password and it will exit with an error
that will list the available device IDs. Pick one for each accessory you create
and put it in a device field like so:

    {
      "accessory": "Eight Sleep",
      "device": "36003a001951353434373",
      ...rest of config...
    }

## Development

You can run Rollup in watch mode to automatically transpile code as you write it:

```sh
  npm run dev
```
