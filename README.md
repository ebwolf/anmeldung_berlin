# anmeldung_berlin
This script will find and book an Anmeldung appointment automatically for you in Berlin
Feel free to contribute and further improve it

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
