# viewer loads page

```text
viewer                 viewer browser                  server
  |--- open page --------->|                            |
  |                        |---------- connect -------->|
  |                        |<- playground full update --|
  |<-- renders creatures---|                            |
```

# programmer loads page

```text
programmer               browser                       server
  |--- open page --------->|                            |
  |                        |---------- connect -------->|
  |                        |<-------- objects list -----|
  |<- show code ids list --|                            |
```

# programmer chooses code to edit

```text
programmer                browser                      server
  |---- click code id ---->|
  |                        |------ request code ------->|
  |                        |<----- source code ---------|
  |<- show code in editor -|
```

# programmer pushes updated code

```text
programmer          programmer browser            server                  preview/other clients
  |--- click "go live" ---->|                       |                               |
  |                         |---- code update ----->|                               |
  |                         |                       |------ code update ----------->|
  |                         |<----------------------+------ objects list ---------->|
```

# programmer deletes a code

```text
programmer     programmer browser          server                 preview/other clients
  |--- click 🗑  ---->|                       |                              |
  |                  |---- code delete ----->|                              |
  |                  |                       |----- code delete ----------->|
  |                  |<----------------------+----- objects list ---------->|
```

