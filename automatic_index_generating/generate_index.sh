#!/bin/bash

####### Script which automatically generates all index.html files needed to access all HTML files in the project.
# This script is executed pre-commit so I no longer manually need to update files in order for new
# assignments to be able to be navigated to.

# Function which url encodes a given string.
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


# Function which HTML encodes a given string.
html_encode() {
    local string="$1"
    echo "$string" | recode utf8..html
}


# Function to get the parent directory of a give directory.
get_parent_directory() {
    if [ -n "$1" ]; then
        dirname "$1"
    fi
}


# Function to get the name of the given directory.
get_directory_name() {
    if [ -n "$1" ]; then
        folder_name=$(basename "${1%/}")
        echo "$folder_name"
    fi
}


# Function which build a dictionary of the directories with the key being the depth of the directories.
# So the root directory is at depth 0, the subdirectories of said directory are at depth 1,
# subdirectories of those at depth 2 and so on.
build_directory_dict() {
    local dir="$1"
    local depth="$2"
    local subdirs=()

    for subdir in "$dir"/*; do
        if [ -d "$subdir" ]; then
            subdir_name="${subdir##*/}"
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


# Function which loops over the directories at the deepest level first and runs a function there.
loop_over_directories_with_function() {
    local function_name="$1"

    for ((i = deepest_level; i >= 0; i--)); do
        IFS="$delimiter" read -ra dirs <<< "${directory_dict[$i]}"
        for dir in "${dirs[@]}"; do
            "$function_name" "$dir" "$i" &
        done
        wait
    done
}


# Function which builds just the html unordered list containing references to all html files in the directory,
# and a reference in the parent directory if applicable.
build_list() {
    local dir="$1"
    local depth="$2"
    local output=""

    cd "$dir"

    # Files in this directory
    for html_file in *.html *.htm; do
        if [ -e "$html_file" ]; then
            if ! grep -q " data-was_automatically_generated=\"true\">" "$html_file"; then
                output="$output"$'\n'"                    <li class=\"file\"> <a href=\"$(url_encode "$html_file")\">$(html_encode "${html_file%.html}")</a> </li>"
            fi
        fi
    done

    if [[ "$output" != "" ]]; then
        printf "%s" "$output" >> "$dir/.tempindex.temphtmllist"
    fi

    # Reference in parent directory
    if [ -e "$dir/.tempindex.temphtmllist" ] && [[ $depth -ne 0 ]]; then
        local parent_dir="$(get_parent_directory "$dir")"
        local dir_name="$(get_directory_name "$dir")"
        if [ "$(echo *.html)" == "index.html" ] && [ "$(echo *.htm)" == "*.htm" ] && ! grep -q " data-was_automatically_generated=\"true\">" "index.html"; then
            printf "                    <li class=\"file\"> <a href=\"%s\">%s</a> </li>\n" "$(url_encode "$dir_name")" "$(html_encode "$dir_name")" >> "$parent_dir/.tempindex.temphtmllist"
        else
            printf "                    <li class=\"folder\"> <a href=\"%s\">%s</a> </li>\n" "$(url_encode "$dir_name")" "$(html_encode "$dir_name")" >> "$parent_dir/.tempindex.temphtmllist"
        fi
    fi
}


# Function which constructs the index.html files in every folder.
build_html() {
    local dir="$1"
    local depth="$2"

    cd "$dir"

    # No list, no file to generate.
    if ! [ -e ".tempindex.temphtmllist" ]; then return 0; fi

    # Check for a possible conflicting index.html which could block us from reaching html files nested deeper.
    if [ -e "index.html" ] && ! grep -q " data-was_automatically_generated=\"true\">" "index.html"; then
        if grep -q "<li class=\"folder\"> <a href=" ".tempindex.temphtmllist"; then
            printf "Warning: %s already contains an index.html file,\nhtml files below this directory may not be accessible!\n" "$dir"
        fi
        rm ".tempindex.temphtmllist"
        return 0
    fi

    local html_header="$html_header"
    local dir_name="$(get_directory_name "$dir")"
    local sorted=""

    # Replace placeholder with actual directory name
    html_header="${html_header//###foldername###/$dir_name}"

    printf "%s\n" "$html_header" > "index.html"

    # Sort the html unordered list based on the names of the anchors
    sorted="$(sort -V -t'>' -k2,2 -k1,1 ".tempindex.temphtmllist" | sed -e ':a' -e 'N' -e '$!ba' -e 's/\(<\/li>\)\n\(<li\)/\1\2/g')"
    printf "%s\n" "$sorted" >> "index.html"

    if [[ $depth -eq 0 ]]; then
        printf "%s" "$html_footer_top_level" >> "index.html"
    else
        printf "%s" "$html_footer" >> "index.html"
    fi

    rm ".tempindex.temphtmllist"

}


# Get the starting directory as the first argument.
start_directory="$1"

# Check if the starting directory exists.
if ! [ -d "$start_directory" ]; then
    echo "Error: The specified directory '$start_directory' does not exist."
    exit 1
fi

# List of (sub)folders we should not check.
filtered_dirs=("/.git/" "/images/" "/styles/" "/.github/" "/automatic_index_generating/" "/.idea/" "/imported_pages/")

# Initialize the associative array to store directory names.
declare -A directory_dict

# Delimiter for splitting directory names
delimiter="\\"

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

