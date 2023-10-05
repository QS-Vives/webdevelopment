#!/bin/sh

# Function that makes an unordered list
process_folder_make_list() {
    folder="$1"
    parent_folder="$2"
    foldername=$(basename "$folder")
    foldername=${foldername:-/} # To correct for the case where PWD=/

    cd "$folder"

    # Loop through sorted HTML files in the directory and generate links
    for html_file in *.html; do
        # Skip adding index.html to the list
        if [ "$html_file" != "index.html" ]; then
            printf "        <li> <a href=\"%s\">%s</a> </li>\n" "$file" "${file%.html}" >> "$folder/.tempindex.temphtmllist"
        fi
    done

    #filtered_dirs=("/images/")

#     for dir in "$folder"/*/
#     do
#         if is_folder_filtered "$dir" "$filtered_dirs";
#             then
#             printf "        <li>\n            <a href=\"%s\">%s</a>\n        </li>\n" "$dir_name" "$dir_name" >> .tempindex.temphtmllist
#         fi
#     done

    if [ -e "$folder/.tempindex.temphtmllist" ]; then
        printf "        <li> <a href=\"%s\">%s</a> </li>\n" "$foldername" "$foldername" >> "$parent_folder/.tempindex.temphtmllist"
    fi
}


process_folder_make_index() {
    folder="$1"
    foldername=$(basename "$folder")
    foldername=${foldername:-/} # To correct for the case where PWD=/

    cd "$folder"

    if [ -e index.html ] && [ -e .tempindex.temphtmllist ] && grep -q " data-was_automatically_generated=true>" index.html; then
        rm .tempindex.temphtmllist
    fi

    if ! [ -e .tempindex.temphtmllist ]; then
        return 0
    fi

    # Create or overwrite the index.html file
    printf "%s\n" "<!DOCTYPE html>
<html lang=\"nl\">
<head data-was_automatically_generated=true>
    <meta charset=\"UTF-8\">
    <title>Index (Automatisch gegenereerd)</title>
</head>
<body>
    <h2>Bestanden in $foldername:</h2>
    <ul>" > index.html

    sort -V .tempindex.temphtmllist -o .tempindex.temphtmllist

    printf "%s\n" "$(cat .tempindex.temphtmllist)" >> index.html

    rm .tempindex.temphtmllist

    printf "    </ul>\n</body>\n</html>" >> index.html

    }


is_folder_filtered() {
    # Target string to search within
    local target_string="$1"
    shift            # Shift all arguments to the left (original $1 gets lost)
    local substrings=("$@") # Rebuild the array with rest of arguments

    # Join the array elements with a pipe (*|*) to create a regex pattern
    pattern="$(printf "%s*|*" "${substrings[@]}")"
    pattern="${pattern%\*\|\*}"

    echo $pattern
    echo $substrings

    # Use the `case` statement for pattern matching
    case "$target_string" in
        *$pattern*)
            # filtered
            return 0
        ;;
    esac
    # not filtered
    return 1
}


# Initialize the root folder of the repository and create an index.html if it doesn't exist
root_folder="$(git rev-parse --show-toplevel)"
if [ ! -e "$root_folder/index.html" ]; then
    touch "$root_folder/index.html"
fi

filtered_dirs=("/.git/" "/images/")

# Iterate through all subfolders recursively to generate list of links
find "$root_folder" -type d | while read -r folder; do
    if is_folder_filtered "$folder/" "${filtered_dirs[@]}"; then
        continue
    fi
    parent_folder="$(dirname "$folder")"
    process_folder_make_list "$folder" "$parent_folder" &
done

wait

# Iterate through all subfolders recursively again to generate all index.html pages
find "$root_folder" -type d | while read -r folder; do
    if is_folder_filtered "$folder/" "${filtered_dirs[@]}"; then
        echo "filtered1 $folder/"
        continue
    fi

    echo "process $folder/"
    process_folder_make_index "$folder" &
done

wait

exit 0

