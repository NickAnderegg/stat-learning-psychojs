#!/usr/bin/env bash

# This means the script will base all other directories on the directory
# where this script currently resides.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

for WAV_FILE in ${DIR}/{.,sounds/sentences,sounds/words}/*.wav; do
    echo "---"
    echo ""
    echo "Converting ${WAV_FILE} to mp3..."

    ffmpeg -i "${WAV_FILE}" -c:a libmp3lame -q:a 3 -y "${WAV_FILE/%wav/mp3}"
done
