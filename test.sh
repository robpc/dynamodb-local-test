#!/bin/bash

setup() {
  curl -s -X POST http://localhost:3000/api/test/1234
}

run() {
  curl -s http://localhost:3000/api/test/1234
}

BEGIN=$(date +%s)

printf "\nSetup -- %s\n\n" "$(setup)"

echo Press Q to exit.
echo

let COUNT=0

while true; do
    NOW=$(date +%s)
    let DIFF=$(($NOW - $BEGIN))
    let MINS=$(($DIFF / 60))
    let SECS=$(($DIFF % 60))
    let HOURS=$(($DIFF / 3600))
    let DAYS=$(($DIFF / 86400))

    let COUNT=$(($COUNT + 1))

    # \r  is a "carriage return" - returns cursor to start of line
    printf "\r%3d Days, %02d:%02d:%02d -- #%d -- %s" $DAYS $HOURS $MINS $SECS $COUNT "$(run)"

# In the following line -t for timeout, -N for just 1 character
    read -t 0.25 -N 1 input
    if [[ $input = "q" ]] || [[ $input = "Q" ]]; then
# The following line is for the prompt to appear on a new line.
        echo
        break
    fi
done