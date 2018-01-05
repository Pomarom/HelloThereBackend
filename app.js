const express = require('express')
const app = express()
const { parse, stringify, resync, toMS, toSrtTime } = require('subtitle')
const fs = require('fs');
var cors = require('cors')
app.use(cors())
const { exec } = require('child_process');

let subArrays;
fs.readFile('sw3-.srt', 'utf8', function(err, data) {  
    if (err) throw err;
    subArrays = parse(data);
});

const getRandomMeme = (version) => {
    console.log(subArrays);
    const rand = getRandomInt(0, subArrays.length);
    const {start, end, text} = subArrays[rand];
    const avgTime = Math.floor((start + end) / 2);
    console.log(avgTime);
    currentText = `" - ${text}"`;
    return { time: msToTime(avgTime), text: currentText};
}

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

const msToTime = (duration) => {
    const milliseconds = Math.floor(duration % 1000);
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    const hoursS = (hours < 10) ? '0' + hours : hours;
    const minutesS = (minutes < 10) ? '0' + minutes : minutes;
    const secondsS = (seconds < 10) ? '0' + seconds : seconds;

    const millisecondsS = (milliseconds < 10) ? '00' + milliseconds :
                            (milliseconds < 100) ? '0' + milliseconds :
                            milliseconds;

    return hoursS + ':' + minutesS + ':' + secondsS + '.' + millisecondsS;
}

app.get('/truc', (req, res) =>  {
    
    const { time, text } = getRandomMeme('I');
    const options = {
        headers: {
            'time': time,
            'text': text.replace(/(\r\n|\n|\r)/gm," "),
            'Access-Control-Expose-Headers':'text'
        }
    };
    const name = new Date().getTime();
    exec(`ffmpeg -ss ${time} -i sw3.mp4 -i sw3-.srt -vframes 1 -q:v 2 ${name}.jpg`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        res.sendFile(__dirname + `/${name}.jpg`, options);
      });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))