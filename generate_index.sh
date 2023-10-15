#!/bin/sh

####### Script which automatically generates all index.html files needed to access all HTML files in the project.
# This script is executed pre-commit so I no longer manually need to update files in order for new
# assignments to be able to be navigated to.

# Function that makes an unordered list of <li>s containing <a>s to all HTML files in folder.
# Additionally, if there is at least one HTML file in the folder, we add the same <li> in the parent folder
# so that we can get to this folder via there.
process_folder_make_list() {
    # Read arguments
    folder="$1"
    parent_folder="$2"
    foldername=$(basename "$folder")
    foldername=${foldername:-/} # To correct for the case where PWD=/

    cd "$folder"

    # Loop through HTML files in the directory and generate <li>s.
    for html_file in *.html; do
        # Handle non index files by simple checking if they exist, then adding them to the list
        # Check for existence of the file is done for the case where there are no HTML files in the folder
        # and the for loop returns "*.html" which we do not want to add (because it does not exist).
        if [ "$html_file" != "index.html" ]; then
            if [ -e "$html_file" ]; then
                printf "        <li> <a href=\"%s\">%s</a> </li>\n" "$html_file" "${html_file%.html}" >> "$folder/.tempindex.temphtmllist"
            fi
        # Seperate case for index.html files, if it was not generated, i.e. manually made, we need to add a reference in parent folder
        else if ! grep -q " data-was_automatically_generated=\"true\">" index.html; then
                if [ -e "$parent_folder/.tempindex.temphtmllist" ] &&
                grep -q "        <li> <a href=\"$foldername\">$foldername</a> </li>" "$parent_folder/.tempindex.temphtmllist";
                then
                    continue
                fi
                printf "        <li> <a href=\"%s\">%s</a> </li>\n" "$foldername" "$foldername" >> "$parent_folder/.tempindex.temphtmllist"
            fi
        fi
    done

    # Add reference to parent folder if there are HTML files in this folder.
    generate=0

    if [ -e "$folder/.tempindex.temphtmllist" ]; then
        generate=1
        if [ -e "$parent_folder/.tempindex.temphtmllist" ] &&
            grep -q "        <li> <a href=\"$foldername\">$foldername</a> </li>" "$parent_folder/.tempindex.temphtmllist";
        then
            generate=0
        fi
    fi

    if [ $generate -eq 1 ] ; then
        printf "        <li> <a href=\"%s\">%s</a> </li>\n" "$foldername" "$foldername" >> "$parent_folder/.tempindex.temphtmllist"
    fi

}


# Function which generates the actual index.html files.
process_folder_make_index() {
    # Read arguments
    folder="$1"
    foldername=$(basename "$folder")
    foldername=${foldername:-/} # To correct for the case where PWD=/

    cd "$folder"

    # If the index.html does not contain our custom string, it means it was made manually and thus we should
    # probably not touch it. We remove the tempfile to do this.
    if [ -e index.html ] && [ -e .tempindex.temphtmllist ] && ! grep -q " data-was_automatically_generated=\"true\">" index.html; then
        rm .tempindex.temphtmllist
    fi

    # If there is no tempfile, do not make (changes to) index.html file.
    if ! [ -e .tempindex.temphtmllist ]; then
        return 0
    fi

    # Create or overwrite the index.html file
    printf "%s\n" "<!DOCTYPE html>
<html lang=\"nl\">
<head data-was_automatically_generated=\"true\">
    <meta charset=\"UTF-8\">
    <title>Index (Automatisch gegenereerd)</title>
</head>
<body>
    <h2>Bestanden in $foldername:</h2>
    <ul>" > index.html

    # Sort our list of <li>s in a natural order.
    sort -V .tempindex.temphtmllist -o .tempindex.temphtmllist

    # Add them to the index.html file.
    printf "%s\n" "$(cat .tempindex.temphtmllist)" >> index.html

    # Remove the no longer needer temp file.
    rm .tempindex.temphtmllist

    # Finish writing the index.html file.
    # Add navigation to parent folder if not root folder
    if [ "$folder" = "$(git rev-parse --show-toplevel)" ]; then
        printf "    </ul>\n</body>\n</html>" >> index.html
    else
        printf "    </ul>\n    <footer><a href=\"..\">Niveau omhoog</a></footer>\n</body>\n</html>" >> index.html
    fi
}


# Function which determines if a path to a folder should be filtered based on an array of folders.
is_folder_filtered() {
    # Read arguments
    # Target string to search within, i.e. our full path.
    local target_string="$1"
    shift            # Shift all arguments to the left (original $1 gets lost)
    local substrings=("$@") # Rebuild the array with rest of arguments

    # Join the array elements with a pipe (|) to create a regex pattern
    pattern="$(IFS="|"; echo "${substrings[*]}")"

    if echo "$target_string" | grep -Eq "$pattern"; then
        return 0 # filtered
    fi
    # not filtered
    return 1
}


echo "Generating index.html files..."

# Initialize the root folder of the repository and create an index.html if it doesn't exist
root_folder="$(git rev-parse --show-toplevel)"
if [ ! -e "$root_folder/index.html" ]; then
    touch "$root_folder/index.html"
fi

# List of (sub)folders we should not check.
filtered_dirs=("/.git/" "/images/")

# Iterate through all subfolders recursively to generate list of links.
find "$root_folder" -type d | while read -r folder; do
    if is_folder_filtered "$folder/" "${filtered_dirs[@]}"; then
        continue # Skip filtered folder.
    fi
    parent_folder="$(dirname "$folder")"
    process_folder_make_list "$folder" "$parent_folder" &
done

wait

# Iterate through all subfolders recursively again to generate all index.html pages
find "$root_folder" -type d | while read -r folder; do
    if is_folder_filtered "$folder/" "${filtered_dirs[@]}"; then
        continue # Skip filtered folder.
    fi

    process_folder_make_index "$folder" &
done

wait

echo "Generating index.html files. DONE."

exit 0
