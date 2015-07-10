#!/usr/bin/env bash
#Sets up dependencies so you can run the gulp task

# Check for npm
if test ! $(which npm); then
  echo "You don't have node installed :| Go install node and then come back"
  exit 1
fi

# Check for node-debug
if test ! $(which node-debug); then
  echo "Installing node-inspector..."
  npm install -g node-inspector
  exit 1
fi

# Check for Gulp
if test ! $(which gulp); then
  echo "Installing gulp..."
  npm install -g gulp

  if test ! $(which gulp); then
    echo "gulp command not found"
    echo "add export PATH=$PATH:/usr/local/share/npm/bin/ to your .bash_profile"
  else
    echo "gulp installed, time to pull down gulp task dependencies"
    npm install
    echo "Setup complete run gulp from this directory to start watching and building js"
  fi
fi
