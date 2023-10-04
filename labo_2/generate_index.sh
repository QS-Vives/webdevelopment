#!/bin/bash

## Automatically generate index.html which contains a list of all .html files in directory ##


# Get folder name
foldername=${PWD##*/}
foldername=${foldername:-/} # To correct for the case where PWD=/

# Create or overwrite the index.html file
echo "<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>Index (Automatically generated)</title>
</head>
<body>
    <h2>Bestanden in $foldername:</h2>
    <ul>" > index.html

# Use 'sort' with the '-V' (version sort) option to sort filenames naturally
sorted_files=$(ls -1 *.html | sort -V)

# Loop through sorted HTML files in the directory and generate links
for file in $sorted_files; do
    # Skip adding index.html to the list
    if [ "$file" != "index.html" ]; then
        echo "        <li>
            <a href=\"$file\">${file:0:-5}</a>
        </li>" >> index.html
    fi
done

echo "    </ul>
</body>
</html>" >> index.html

echo "index.html has been generated."
