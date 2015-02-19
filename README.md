# Requirements:

- Install Soundflower
- Install Homebrew 
- Install Lame (`brew install lame`) or (`sudo apt-get install sox libsox-fmt-all` on most linux distributions)
- Install Sox (`brew install sox`)

# How it works?
Basically you install the Chrome Extension which injects extra Javascript whenever a user is on the spotify web application (https://play.spotify.com/).

This chrome extension listens to the interface and knows when a song gets played, stopped, next, previous etc. So when a user starts playing a song in their spotify playlist the extension sends a signal (through websockets) to the "spotifier recorder", which is a simple Node.js HTTP server.

The "spotifier recorder" uses Sox and Lame audio libraries and knows when to record etc.

A user should use an audio tool on their computer, soundflower on Mac for example, which redirects audio. Basically the spotifier recorder just records the microphone input on the computer, Mac users can setup soundflower so that the audio from the output gets routed to the input, which is a "fake" microphone output.

# Configuring SoundFlower

- Go to System Preferences
- Go to Sound
- Go to the output tab and select "Soundflower (2ch)"
- Go to the input tab and select "Soundflower (2ch)"

At this point, any sound that would normally come out of your Mac's speakers is now routed through Soundflower.

If you still want to hear any sound coming from your Mac:

- Start soundflower, and click on the tray icon
- Under the first purple flower "Soundflower (2ch)" select your desired output, mostly "Built-in Output"

Warning: any sound coming from your Mac while recording should be disabled, so if you hear any system sounds / or things like Facebook etc. sound they will be recorded.

Done!