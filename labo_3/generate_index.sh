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

filtered_dirs=("images")

for dir in $PWD/*/     # list directories in the form "/tmp/dirname/"
do
    dir=${dir%*/}      # remove the trailing "/"
    dir_name="${dir##*/}"    # everything after the final "/"
    value="\<$dir_name\>"
    if ! [[ ${filtered_dirs[@]} =~ $value ]]; then
        echo "        <li>
            <a href=\"$dir_name\">$dir_name</a>
        </li>" >> index.html
    fi

done

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
