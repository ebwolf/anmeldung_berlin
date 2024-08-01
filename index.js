const fs = require('fs');
const puppeteer = require('puppeteer');
const config = {
    'debug': false,
    'minDate': '2024-09-03T08:00:00', // earliest appointment
    'maxDate': '2024-09-06T17:00:00', // lastest appointment
    'name': 'Erica Wolf',
    'email': 'ebwolf@gmail.com',
    'phone': '',// ADD PHONE NUMBER HERE (OPTIONAL)
    'moreDetails': '',// ADD FURTHER DETAILS HERE (OPTIONAL)
    'takeScreenshot': true,
    'screenshotFile1': 'screenshot1.png',
    'screenshotFile2': 'screenshot2.png',
    'logFile': 'logFile.txt',
    'delay': 180000 // Delay for 180 seconds
};
const delay = ms => new Promise(res => setTimeout(res, ms));

const staticConfig = {
    'entryUrl': 'https://service.berlin.de/terminvereinbarung/termin/tag.php?termin=1&anliegen[]=120686&dienstleisterlist=122210,122217,327316,122219,327312,122227,327314,122231,327346,122243,327348,122252,329742,122260,329745,122262,329748,122254,329751,122271,327278,122273,327274,122277,327276,122280,327294,122282,327290,122284,327292,327539,122291,327270,122285,327266,122286,327264,122296,327268,150230,329760,122301,327282,122297,327286,122294,327284,122312,329763,122304,327330,122311,327334,122309,327332,122281,327352,122279,329772,122276,327324,122274,327326,122267,329766,122246,327318,122251,327320,122257,327322,122208,327298,122226,327300',
};

// Main Function
(async() => {
    if(!fs.existsSync(config.logFile)){
        console.log('----');
        console.log('Starting: ' + new Date(Date.now()).toTimeString());
        bookTermin();
    }
})();


// Write out info on the Termin to a local file
async function saveTerminBooked() {
    await fs.writeFileSync(config.logFile, JSON.stringify({ 'booked': Date.now() }), 'utf8');
}


// Book the Appointment
// It is curious to me that this is modal/session based. One would think that there would be a RESTful
// API on a microservice for scheduling appointments.
// 
async function bookTermin() {
    const browser = await puppeteer.launch({
  		headless: !config.debug,
        defaultViewport: null,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
  	});
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if(req.resourceType() === 'image' || req.resourceType() === 'stylesheet' || req.resourceType() === 'font'){
            req.abort();
        } else {
            req.continue();
        }
    });

    console.log("Checking for termins at "  + staticConfig.entryUrl);

    let success = false;

    while (success == false) {
        try{           
            await page.goto(staticConfig.entryUrl);

            await page.waitForSelector('div.span7.column-content', { timeout: 120000 });

            // Check if there are Termins available
            let available = (await page.$$('td.buchbar')).length;
            console.log("Found " + available  + " termins available.");

            // If there are no bookable Termins, try again
            if(available < 1) {
                console.log("Waiting for " + config.delay / 1000 + " seconds")
                await delay(config.delay); // Wait for delay milliseconds

                continue;
            }
            
            let dates = await page.$$('td.buchbar');

            for(let i=0;i<available;i++){
                // Parse the URL to get the date of the available appts
                let link = await dates[i].$eval('a', el => el.getAttribute('href'));
                console.log('Link ' + i + ': ' + link);

                // Checking if Termins are within desirable range
                let regex = /\d+/g;
                let matches = link.match(regex);

                let terminTime = Number(matches[0])
                console.log("Termin time: " + terminTime)


                let minTimestamp = Math.floor(Date.parse(config.minDate)/ 1000)
                let maxTimestamp = Math.floor(Date.parse(config.maxDate)/ 1000);
                console.log("Min: " + config.minDate + ' = ' + minTimestamp)
                console.log("Max: " + config.maxDate + ' = ' + maxTimestamp)

                
                // If this Termin is within the desired range - book it!
                if (terminTime >  minTimestamp && terminTime <  maxTimestamp) {
                    

                    console.log("Found appointment in date range: " + matches[0])

                    console.log(" Use link: " + link)

                /*
                    await page.click('a[href*="' + link + '"]');
                    
                    console.log('Booking step 1');

                    await page.waitForSelector('tr > td.frei', { timeout: 120000 });
                    const termins = await page.$$('tr > td.frei > a');
                    await termins[0].click();
                    
                    console.log('Booking step 2');

                    // Fill out custom information
                    await page.waitForSelector('input[id="familyName"]', { timeout: 120000 });
                    await page.type('input[id="familyName"]', config.name);
                    await page.type('input[id="email"]', config.email);
                    if(config.phone != "")
                        await page.type('input[id="telephone"]', config.phone);
                    if(config.moreDetails != "")
                        await page.type('textarea[name="amendment"]', config.moreDetails);
                    
                    console.log('Booking step 3 complete');

                    // Fill out standard information
                    await page.select('select[name="surveyAccepted"]', '1')
                    await page.click('input[id="agbgelesen"]');
                    console.log('Booking step 4 complete');

                    // Screenshot
                    if(config.takeScreenshot)
                        await page.screenshot({ path: config.screenshotFile1, fullPage: true });

                    // Book
                    await page.click('button[id="register_submit"]');
                    console.log('Booking step 5 complete');
                    await page.waitForSelector('img.logo', { timeout: 120000 });
                    saveTerminBooked();

                    // Screenshot
                    if(config.takeScreenshot)
                        await page.screenshot({ path: config.screenshotFile2, fullPage: true });

                    */
                    // Got the Termin, let's end this thing!
                    success = true;
  
                    break;
                }
                
                if (!success) {
                    console.log("Waiting for " + config.delay / 1000 + " seconds")
                    await delay(config.delay); // Wait for miliseconds
                }
            }
        } catch (err) {
            console.log(err);
            break;
        } // try..
    }  // while (success == false)

    browser.close();
    console.log("Exiting...")
    return success;
}
