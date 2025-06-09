HASH_FILE=".package-lock.hash"

generate_hash() {
    sha256sum package-lock.json | awk '{ print $1 }'
}

if [ -f "$HASH_FILE" ]; then
    PREVIOUS_HASH=$(cat "$HASH_FILE")
else
    PREVIOUS_HASH=""
fi

CURRENT_HASH=$(generate_hash)

if [ "$PREVIOUS_HASH" != "$CURRENT_HASH" ]; then
    echo "package-lock.json has changed. Installing dependencies..."
    npm install
    echo "$CURRENT_HASH" > "$HASH_FILE"
else
    echo "package-lock.json has not changed. Skipping installation."
fi

npm run dev
