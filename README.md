# Sentence Statistical Learning Task (PsychoJS Version)

## Running Locally

### Dependencies

- Recent version of Node ([Installing Node.js via package manager](https://nodejs.org/en/download/package-manager/)).
- Recent version of [Yarn](https://yarnpkg.com/getting-started/install).
- Git

### Install and Run

1. Clone this repository locally and change into the local directory:

    ```bash
    ❯ git clone git@gitlab.pavlovia.org:NickAnderegg/stat-learning-psychojs.git stat-learning-psychojs
    Cloning into 'stat-learning-psychojs'...
    remote: Enumerating objects: 688, done.
    remote: Counting objects: 100% (688/688), done.
    remote: Compressing objects: 100% (679/679), done.
    remote: Total 688 (delta 41), reused 619 (delta 5)
    Receiving objects: 100% (688/688), 13.96 MiB | 1.66 MiB/s, done.
    Resolving deltas: 100% (41/41), done.

    ❯ cd stat-learning-psychojs/
    ```

2. Ensure that the correct version of Yarn is set in the repository:

    ```bash
    ❯ yarn --version
    2.0.0-rc.36
    ```

    The version output by this command should be v2.0 or higher.

3. Ensure the necessary dependencies are installed:

    ```bash
    ❯ yarn install
    ➤ YN0000: ┌ Resolution step
    ➤ YN0000: └ Completed
    ➤ YN0000: ┌ Fetch step
    ➤ YN0000: └ Completed in 0.48s
    ➤ YN0000: ┌ Link step
    ➤ YN0000: └ Completed in 0.79s
    ➤ YN0000: Done in 1.56s
    ```

    This step should run quickly and have output similar to the output above due
    to this repository's use of Yarn's [Zero-Installs feature](https://yarnpkg.com/features/zero-installs).

4. Start the local HTTP server:

    ```bash
    ❯ yarn start
    Starting up http-server, serving ./html/
    Available on:
      http://127.0.0.1:8080
      http://192.168.1.10:8080
    Hit CTRL-C to stop the server
    ```

    The HTTP server that is serving the application will be available locally on port 8080.

5. Visit `http://127.0.0.1:8080` in your browser to test the experiment.

## Contributing

Information on contributing to this repository, enforcing code style, and running tests coming soon.

## License

Copyright (C) 2020 Nick Anderegg

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
