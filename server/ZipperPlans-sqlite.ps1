# Remove several items including any .exes and directories that start with "sqlite-" and any .db files
Remove-Item -Path "sqlite-*" -ErrorAction SilentlyContinue
Remove-Item -Path "*.db" -ErrorAction SilentlyContinue

# If sqlite3.exe is not in the current directory, download it
if (-not (Test-Path .\sqlite3.exe)) {
    # Download SQLite CLI tools at https://www.sqlite.org/2024/sqlite-tools-win-x64-3450300.zip
    Invoke-WebRequest -Uri "https://www.sqlite.org/2024/sqlite-tools-win-x64-3450300.zip" -OutFile "sqlite-tools-win-x64-3450300.zip"

    # Unzip the downloaded file
    Expand-Archive -Path "sqlite-tools-win-x64-3450300.zip" -DestinationPath "sqlite-tools-win-x64-3450300"

    # Move all files to the server folder
    Move-Item sqlite-tools-win-x64-3450300\* .

    Remove-Item -Path "sqlite-*" -ErrorAction SilentlyContinue
}

# Create a new SQLite database by feeding the schema file to the sqlite.exe tool
cat ZipperPlans.sql | .\sqlite3.exe ZipperPlans.db
