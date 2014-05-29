Paysage (alpha)
=======
*Paysage is a visual shared playground for code.* 

With Paysage, kids (and adults!) live code from their own computer, laptops, tablets, phones, with a variety of IDE and editors. Each program is shared and rendered live on a visual playground. The playground accessible via an URL.

The Paysage project do not try to invent a new IDE / code editor for kids. There is already many of them, with more launching everyday.

We aim is to solve a very specific use case: 
**Let 10 kids in the same room, with a few more kids online, code together on the same visual playground.**

========
The Paysage server is at the moment NodeJs / Express. A Python implementation would be interesting for easy local installation.

The Paysage playground (renderer) is a JS HTML CSS page using Processing.js

Paysage editors implementations will be in a variety of languages, and can be purely textual editors or visual editors or anything in between. For example Snap! BYOB could be extended to be a Paysage live code editor.
A Paysage editor for babies, using only shapes to touch would be very cool, too. A watcher for text editors could push code to the Paysage server at each save.
*At the moment, we use a simple HTML form as the test editor.*

=======

TO DO:

- creating a random unique playground for a group when accessing the home (like etherpad)
- the editor can edit a specific playground
- each code object is uniquely identified
- the editor can request a list of current active object, and then edit one
- any client editor can communicate with the server using a simple HTTP API 

======

Note on the collaborative vision of Paysage:

Paysage do not impose social rules on the users. Anyone can edit everything if they want to! 

Just like writing on Etherpad or Google Docs, users have to evolve their own social rules according to their goals and needs. Yes, pranks and edit wars will happen :-) but it’s part of the process. 

In a sandbox (a real one at the park :-) a kid can destroy the castle another built, and it's the role of other kids and adults to build their own rules about what is allowed and what is not.

In that sensem Paysage is also a playground to learn and explore open collaboration.



