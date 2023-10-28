#!/bin/bash

url_encode() {
    local string="$1"
    local encoded=""
    local length=${#string}

    for ((i = 0; i < length; i++)); do
        local char="${string:i:1}"
        case "$char" in
            [a-zA-Z0-9.~_-])
                encoded+="$char"
                ;;
            *)
                encoded+=$(printf '%%%02X' "'$char")
                ;;
        esac
    done

    echo "$encoded"
}

html_encode() {
    local string="$1"
    echo "$string" | recode utf8..html
}

get_parent_directory() {
    if [ -n "$1" ]; then
        dirname "$1"
    fi
}

get_directory_name() {
    if [ -n "$1" ]; then
        # Remove trailing slash if present and then get the base name
        folder_name=$(basename "${1%/}")
        echo "$folder_name"
    fi
}

# Function to process directories and update the directory_dict.
function build_directory_dict {
    local dir="$1"
    local depth="$2"
    local subdirs=()

    for subdir in "$dir"/*; do
        if [ -d "$subdir" ]; then
            subdir_name="${subdir##*/}"  # Extract the directory name
            if ! [[ " ${filtered_dirs[*]} " =~ " /$subdir_name/ " ]]; then
                build_directory_dict "$subdir" "$((depth + 1))"
            fi
        fi
    done

    # Store the directory in the directory_dict at the current depth.
    if [ -n "${directory_dict[$depth]}" ]; then
        directory_dict["$depth"]="${directory_dict[$depth]}$dir$delimiter"
    else
        directory_dict["$depth"]="$dir$delimiter"
    fi
}

function loop_over_directories_with_function () {
    local function_name="$1"

    # Process directories in a depth-first manner.
    for ((i = deepest_level; i >= 0; i--)); do
        # Split the directory names using the delimiter
        IFS="$delimiter" read -ra dirs <<< "${directory_dict[$i]}"
        for dir in "${dirs[@]}"; do
            "$function_name" "$dir" "$i" &
        done
        wait
    done
}

# Function to handle a directory at a specific depth.
function build_list {
    local dir="$1"
    local depth="$2"

    cd "$dir"

    for html_file in *.html; do
        if [ -e "$html_file" ]; then
            if ! grep -q " data-was_automatically_generated=\"true\">" "$html_file"; then
                printf "                    <li class="file"> <a href=\"%s\">%s</a> </li>\n" "$(url_encode "$html_file")" "$(html_encode "${html_file%.html}")" >> "$dir/.tempindex.temphtmllist"
            fi
        fi
    done

    if [ -e "$dir/.tempindex.temphtmllist" ] && [[ $depth -ne 0 ]]; then
        local parent_dir="$(get_parent_directory "$dir")"
        local dir_name="$(get_directory_name "$dir")"
        printf "                    <li class="folder"> <a href=\"%s\">%s</a> </li>\n" "$(url_encode "$dir_name")" "$(html_encode "$dir_name")" >> "$parent_dir/.tempindex.temphtmllist"
    fi
}

function build_html {
    local dir="$1"
    local depth="$2"

    cd "$dir"

    if ! [ -e ".tempindex.temphtmllist" ]; then return 0; fi

    if [ -e "index.html" ] && ! grep -q " data-was_automatically_generated=\"true\">" "index.html"; then

        if grep -q "<li class=\"folder\"> <a href=" ".tempindex.temphtmllist"; then
            printf "Warning: %s already contains an index.html file,\nhtml files below this directory may not be accesible!\n" "$dir"
        fi

        rm ".tempindex.temphtmllist"
    fi

    if ! [ -e .tempindex.temphtmllist ]; then return 0; fi

    local html_header="$html_header"
    local dir_name="$(get_directory_name "$dir")"

    html_header="${html_header//###foldername###/$dir_name}"

    printf "%s\n" "$html_header" > "index.html"

    sort -V ".tempindex.temphtmllist" -o ".tempindex.temphtmllist"

    printf "%s\n" "$(cat ".tempindex.temphtmllist")" >> "index.html"

    if [[ $depth -eq 0 ]]; then
        printf "%s" "$html_footer_top_level" >> "index.html"
    else
        printf "%s" "$html_footer" >> "index.html"
    fi

    rm ".tempindex.temphtmllist"

}

# List of (sub)folders we should not check.
filtered_dirs=("/.git/" "/images/" "/styles/" "/.github/" "/automatic_index_generating/ /.idea/")

# Initialize the associative array to store directory names.
declare -A directory_dict

# Delimiter for splitting directory names
delimiter="\\"

# Get the starting directory as the first argument.
start_directory="$1"

# Check if the starting directory exists.
if [ -d "$start_directory" ]; then
    echo "$(date --rfc-3339=ns): [STARTING] Generating index files..."

    start_directory=${start_directory%/}
    if [[ "$start_directory" == "" ]]; then start_directory="/"; fi

    html_header="$(cat "$start_directory/automatic_index_generating/header.partialhtml")"
    html_footer="$(cat "$start_directory/automatic_index_generating/footer.partialhtml")"
    html_footer_top_level="$(cat "$start_directory/automatic_index_generating/footer_top_level.partialhtml")"

    build_directory_dict "$start_directory" 0

    # Find the deepest nesting level.
    deepest_level=0
    for key in "${!directory_dict[@]}"; do
        if [ "$key" -gt "$deepest_level" ]; then
            deepest_level="$key"
        fi
    done

    loop_over_directories_with_function "build_list"
    loop_over_directories_with_function "build_html"

    echo "$(date --rfc-3339=ns): [DONE] Generating index files."

else
    echo "Error: The specified directory '$start_directory' does not exist."
fi


