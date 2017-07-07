# viewer loads page

    viewer                 viewer browser                  server
      |--- open page --------->|                            |
      |                        |--- playground up (plgnd) ->|
      |                        |<- playground full update --|
      |<-- renders creatures---|                            |

# programmer loads page

    programmer               browser                       server
      |--- open page --------->|                            |
      |                        |--- programmer up (plgnd) ->|
      |                        |<-------- objects list -----|
      |<- show code ids list --|                            |

# programmer chooses code to edit

    programmer                browser                      server
      |---- click code id ---->|
      |                        |--- request code ---------->|
      |                        |<----- source code ---------|
      |<- show code in editor -|

# programmer pushes updated code

    programmer          programmer browser                 server           viewer browser    other programmer browser
      |--- click  "click" ---->|                            |                    |                     |
      |                        |---- code update (cd) ----->|                    |                     |
      |                        |                            |- code update(cd) ->|                     |
      |                        |<--- object full update ----|----------- object full update ---------->|
      |                        |                            |--- objects list -->+-------------------->|


