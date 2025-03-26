#!/bin/bash

# Set the branches you want to keep
protected_branches=("main" "staging" "develop")

# Get a list of all local branches
all_branches=$(git branch | sed 's/^[ *]*//')

# Loop through each branch
for branch in $all_branches; do
    # Check if the branch is in the protected list
    if [[ ! " ${protected_branches[@]} " =~ " ${branch} " ]]; then
        # If not, delete the branch
        echo "Deleting branch $branch"
        git branch -d $branch
    else
        echo "Skipping protected branch $branch"
    fi
done