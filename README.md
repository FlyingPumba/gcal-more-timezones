# Google Calendar More Timezones
- Adds additional timezone bars to Google Calendar beyond the default primary and secondary timezones
- Automatically includes Argentina timezone alongside your existing timezone configuration
- [Click here to install](https://github.com/FlyingPumba/gcal-more-timezones/raw/main/gcal-more-timezones.user.js) in your script manager. (Tampermonkey or Greasemonkey)

## Features:
- **Automatic Detection**: Detects existing timezone bars in Google Calendar
- **Argentina Timezone**: Adds Buenos Aires timezone (ART) by default
- **No Duplicates**: Prevents adding multiple copies of the same timezone
- **Dynamic Updates**: Works with Google Calendar's dynamic content loading
- **Non-intrusive**: Only adds timezone when timezone bars are already visible

## To Use:
1. Navigate to Google Calendar
2. Switch to Week or Day view (where timezone bars are typically displayed)
3. The Argentina timezone will automatically appear alongside your existing timezones
4. The script runs automatically - no manual activation required

## Requirements:
- Tampermonkey or Greasemonkey browser extension
- Google Calendar must be configured to show timezone bars (usually visible in Week/Day views when multiple timezones are configured)

## Customization:
To modify the timezone or add different timezones, edit the configuration variables at the top of the script:
```javascript
const ARGENTINA_TIMEZONE = 'America/Argentina/Buenos_Aires';
const ARGENTINA_TIMEZONE_LABEL = 'Argentina';
```
