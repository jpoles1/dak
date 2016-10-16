## Inspiration
Home automation is a technology which we have seen imagined in science fiction, and only recently realized in expensive consumer products. For college students with limited funds, the price tag on such products can be prohibitive; we sought a cheaper solution.

## What it does
The DAK is an all-in-one package which can be used to add environment-responsive behaviors to a variety of devices in your living environment. Brightness in the room can be used to determine whether the light should turn on or off; temperature can be used to control a fan; you could even extend it to water your plants when they get dry! All behaviors can be programmed using if-then statements.
Though this project was originally developed with the dorm-room setting in mind, it is easy to imagine it being extended to settings where accessibility might be an issue. Any number of electronic devices can be used to interface with the room, allowing those with mobility impairments to switch on and off their lights easily. Voice control may even be used to interface with the system, permitting those with extreme disability to control their living environment. Finally, emergency notifications may be sent in case of extreme temperature conditions, allowing for care of elderly or otherwise vulnerable individuals.

## How we built it
The DAK runs on a lightweight Node.js server, which provides an interface with the Arduino device, the database, as well as the user. Because the DAK exposes a simple API, any number of devices and softwares can be integrated to control the room.
We used an Arduino as the platform for our hardware because they are cheap and easy to learn! This means that it's possible for students and makers everywhere to make their own DAK, and even extend it to include new functionality.

## Challenges we ran into

Hack-a-thons are brief; it's difficult to assemble a complex project involving both hardware and software in such a short period of time.

## Accomplishments that we're proud of

We managed to assemble a functional system which sends and receives information from the living environment.

## What we learned

## What's next for Dorm Automation Kit (DAK)

There's so much more that can be done to extend and improve this system! We're excited to see what ourselves, and others, can accomplish with the framework we've established.
