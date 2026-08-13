$files = Get-ChildItem -Path "c:\Krushna portfolio\client" -Recurse -Include "*.js","*.jsx" | Where-Object { $_.FullName -notlike "*node_modules*" -and $_.FullName -notlike "*.next*" }

$API_CONST = "const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';"

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    
    if ($content -notlike "*NEXT_PUBLIC_API_URL*") {
        continue
    }
    
    # Remove any previously malformed patterns and replace with clean API_BASE constant usage
    # Pattern: anything with NEXT_PUBLIC_API_URL followed by /api/ and a closing quote
    $fixed = $content -replace "['`` ]*\(?process\.env\.NEXT_PUBLIC_API_URL.*?\)?.*?'\s*\+\s*'/api/", "'http://localhost:5000/api/"
    $fixed = $fixed -replace "\`\$\{process\.env\.NEXT_PUBLIC_API_URL\}/api/[^'`"]*[`"']", "'REPLACED'"
    
    # Simpler: just restore the original localhost:5000 pattern cleanly
    # by replacing all the broken patterns with clean 'http://localhost:5000'
    $fixed = $content
    $fixed = $fixed -replace "(['`])[^'`]*process\.env\.NEXT_PUBLIC_API_URL[^'`]*(['`])", "'http://localhost:5000'"
    
    [System.IO.File]::WriteAllText($file.FullName, $fixed)
    Write-Host "Restored: $($file.Name)"
}
