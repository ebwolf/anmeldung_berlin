# anmeldung_berlin
This script will find and book an Anmeldung appointment automatically for you in Berlin

This kind of script suffers from two fundamental problems:
1. The service (anmeldung termin via the Burgeramt site) has to be treated as a black box.
There is no "test mode" offered to make sure this will work.  
2. No maintenance. The authors (myself included) will typically work on it until success and then abandon the project completely. I am working on it in August 2024. I make no guarantees that it will ever work again. 

Less Serious problems:
1. The berlin.de site is all PHP code and not service. So this script has to navigate and interpret HTML rather than call a well-defined API.
2. This script is written in NodeJS, which, in itself isn't a problem but the Puppeteer library for NodeJS relies on "await" statements that don't always play nicely with the page throttling that the berlin.de site does. So, if you see a "Timeout" error, wait a few minutes and retry the script.


# Installing
1. Move to the target folder `cd /YOURFOLDER`
2. `git clone https://github.com/ebwolf/anmeldung_berlin.git`
3. `cd anmeldung_berlin`
4. `npm install`
5. Edit index.js and add your information and set the earliest and latest you want your termin
   in the const config:

    const config = {
        'debug': false,
        'minDate': '2024-09-03T08:00:00', // earliest appointment
        'maxDate': '2024-09-06T17:00:00', // lastest appointment
        'name': '<YOUR NAME HERE>', // <<<< CHANGE THIS >>>>
        'email': '<YOUR EMAIL HERE>', // <<<< CHANGE THIS >>>>
        'phone': '',// ADD PHONE NUMBER HERE (OPTIONAL)
        'moreDetails': '',// ADD FURTHER DETAILS HERE (OPTIONAL)
        'takeScreenshot': true,
        'screenshotFile1': 'screenshot1.png',
        'screenshotFile2': 'screenshot2.png',
        'logFile': 'logFile.txt',
        'delay': 180000 // Delay for 180 seconds
    };

# Running the script
1. `node index.js`

Gives status at the console. Takes a screen cap when the termin is secured.


# Questions
1. [How to install node.js](https://lmgtfy.app/?q=how+to+install+node+js)
