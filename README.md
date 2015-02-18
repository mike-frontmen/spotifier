# Requirements:

- Install Soundflower
- Install Homebrew 
- Install Lame (`brew install lame`)
- Install Sox (`brew install sox` )

# How it works?
Basically you install the Chrome Extension which injects extra Javascript whenever a user is on the spotify web application (https://play.spotify.com/).

This chrome extension listens to the interface and knows when a song gets played, stopped, next, previous etc. So when a user starts playing a song in their spotify playlist the extension sends a signal (through websockets) to the "spotifier recorder", which is a simple Node.js HTTP server.

The "spotifier recorder" uses Sox and Lame audio libraries and knows when to record etc.

A user should use an audio tool on their computer, soundflower on Mac for example, which redirects audio. Basically the spotifier recorder just records the microphone input on the computer, Mac users can setup soundflower so that the audio from the output gets routed to the input, which is a "fake" microphone output.