Centralized Care: NFC‑powered bedside data, fast, secure, and built into the phones you already use.

## Inspiration
One of our teammate's sister is a CRNA who often feels disconnected with her numerous patients and feels like she never has time to get caught up. She also feels like her patients who cannot get out of bed/are out of reach of a help button, but are able to use their phones need access to a way to contact their nurse for help. We created a solution.

## What it does
Centralized Care lets CRNAs log into a mobile app, tap an inexpensive NFC chip beside a patient, and instantly pull up the patient’s most recent records from a secure cloud. The dashboard also lets users update notes in real time so the information stays current for everyone on the team. For patient log-in, they are able to press a call button that sends a push notification to the staffs' phone.

## How we built it
We used an Expo Go front‑end, a Flask back‑end, and Ngrok for seamless tunneling, all communicating over HTTPS. The NFC tag is embedded in the patient’s chart, the phone’s NFC reader acquires a unique ID, which we match against hospital credentials stored in a json  until we can implement a proper, secure database.

## Challenges we ran into
Collaboration issues, we are first time hackers so being able to work together was hard. NFC capabilities on Apple are paywalled in their app developer program, so we had to work around it. Being able to use GitHub and not being able to see everyone's code at the same time. The time constraints were also giving us an issue, and being able to balance work life and code life.

## Accomplishments that we're proud of
We finished our project full stack and we have a fully functioning app and system. It just needs to be upgraded in the future for proper security. We are also very proud of getting together and persevering through the hard times. Our hard work allowed us to get submitted and allowed us to be proud of our first outside-of-class project that we worked on together.

## What we learned
We learned how to work more collaboratively as a team, how to manage time constraints more efficiently, and we learned how to use AI to help our workflow in an ethical way.

## What's next for Centralized Care
We intend to implement proper security protocols, deploy a pilot on a real ICU, gather workflow feedback, and iterate. We also intend to incorporate role‑based dashboards and push‑automation for medication updates. Once done, we’ll open‑source the code to help hospitals worldwide jump‑start bedside data modernization.

