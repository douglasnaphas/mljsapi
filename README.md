# Mad Liberation JavaScript API

This is the Express JS backend for Mad Liberation, a game of mad lib haggadahs for Passover.

**Note**: See [this page](https://github.com/douglasnaphas/mljsapi/wiki/Running-MLJSAPI) for updates on the process for running MLJSAPI locally.

## Run tests

`npm run test -- --watch`

## Run the server locally

`./run-dev.sh`

## Use a different host

This is useful when running on Cloud9.

    sed 's/NODE_ENV: production/NODE_ENV: development/' ./template.yml > ./dev-template.yml
    sam local start-api --template ./dev-template.yml --port 3003 --host <HOST_IP>

For AWS instances, use the private IP.

For example:

    sed 's/NODE_ENV: production/NODE_ENV: development/' ./template.yml > ./dev-template.yml
    sam local start-api --template ./dev-template.yml --port 3002 --host 172.31.41.172

## CloudFormation

`mljsapi.py`, which uses [troposphere](https://github.com/cloudtools/troposphere), should generate `template.yml`. `diff <(python mljsapi.py) template.yml` should exit 0. Eventually `template.yml` can be generated during the build process.

### Generating template.yml from mljsapi.py
#### Install pyenv
Instructions [here](https://github.com/pyenv/pyenv#installation).

I do it by:
    1. Running `curl https://pyenv.run | bash`.
    2. Getting `pyenv` on the PATH, first by finding the `pyenv` executable.
       This was given in the installation output.
       If it's not in the PATH, I make a symlink from `/usr/local/bin`, for
       example with `sudo ln -s ~/.pyenv/bin/pyenv /usr/local/bin/pyenv`.
    3. Getting `pyenv init -` into `.bashrc` or equivalent, for example by
       using [my shared configs](https://github.com/douglasnaphas/configs/blob/master/.bashrc#L189-L192).

#### 
