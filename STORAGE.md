# Voice Recorder - File Storage Information

## Where Your Recordings Are Saved

All audio recordings are permanently saved to your phone's internal storage in the app's document directory:

### Android
- **Path**: `/data/data/com.akmzakaria.voicerecorder/files/recordings/`
- **Access**: Files are private to the app but persist even after closing the app
- **File Format**: `.m4a` (AAC audio format)
- **File Naming**: `{timestamp}_{duration}.m4a`
  - Example: `1728305234567_5430.m4a`
  - First number: Unix timestamp (when recorded)
  - Second number: Duration in milliseconds

### iOS
- **Path**: `Library/Application Support/recordings/` (inside app container)
- **Access**: Files are private to the app but persist even after closing the app
- **File Format**: `.m4a` (AAC audio format)
- **Same naming convention as Android**

## Key Features

✅ **Persistent Storage**: Recordings are saved permanently and won't disappear when you close the app
✅ **Auto-Load**: All recordings are automatically loaded when you open the app
✅ **Safe Delete**: Files are completely removed from storage when deleted
✅ **High Quality**: Uses HIGH_QUALITY preset (44.1kHz, 128kbps)

## File Management

- **Automatic**: App manages all file operations
- **No manual intervention needed**: Files are saved and loaded automatically
- **Storage location**: Visible in the app header (small text under title)

## Technical Details

- Files are moved from temporary recording location to permanent storage after recording stops
- Uses `expo-file-system/legacy` for reliable file operations
- Directory is created automatically on first launch
- All file operations include error handling

## Accessing Your Files

Since the files are in the app's private directory, they cannot be accessed directly through a file manager. However:

1. **Within the app**: All recordings appear in the list automatically
2. **Share functionality**: (Can be added in future) Export recordings to device storage or share with other apps
3. **Backup**: Files will be included in app data backups (Android/iOS system backups)
