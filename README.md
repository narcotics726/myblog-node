myblog-node
================
A personal system, just for practicing node.js at first.

Roadmap
================
- 2014.04.17 start project
- 2014.07.09 complete an initial version, implement basic function
- 2014.07.30 add dropbox support
- 2014.08.03 watch the dropbox token usage/expire time, it's ok for the moment
- next
    - add category/tag for blogs
    - add pagination for blog list
    - add cache mechanism for blog list, to decrease the dropbox api invoke times
        - delay, after put the project into production env. cuz the dropbox's webhook func need a public ip
