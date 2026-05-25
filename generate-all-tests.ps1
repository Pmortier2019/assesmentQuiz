# Generates multiple tests per type x difficulty combination.
# Usage: .\generate-all-tests.ps1 -PerCombo 5
# Default: 5 tests per combination (39 types x 3 difficulties x 5 = 585 tests)

param(
    [int]$PerCombo = 5
)

$BASE_URL = "https://app-white-shadow-5362.fly.dev"
$DELAY_SECONDS = 5

$ALL_TYPES = @(
    "NUMERICAL_REASONING", "LOGICAL_REASONING", "VERBAL_REASONING",
    "ABSTRACT_REASONING", "CRITICAL_THINKING", "INDUCTIVE_REASONING",
    "DEDUCTIVE_REASONING", "DIAGRAMMATIC_REASONING", "SPATIAL_REASONING",
    "MECHANICAL_REASONING", "ANALYTICAL_THINKING", "DATA_INTERPRETATION",
    "ERROR_CHECKING", "READING_COMPREHENSION", "GRAMMAR_SPELLING",
    "WRITING_ASSESSMENT", "COMMUNICATION_SKILLS", "PRESENTATION_SKILLS",
    "PERSONALITY_WORK_STYLE", "SITUATIONAL_JUDGEMENT", "EMOTIONAL_INTELLIGENCE",
    "ADAPTABILITY", "CULTURAL_FIT", "LEADERSHIP_ASSESSMENT", "DECISION_MAKING",
    "STRATEGIC_THINKING", "PROJECT_MANAGEMENT", "TIME_MANAGEMENT",
    "RISK_ASSESSMENT", "TEAMWORK_COLLABORATION", "CONFLICT_RESOLUTION",
    "NEGOTIATION_SKILLS", "CUSTOMER_SERVICE", "SALES_APTITUDE",
    "FINANCIAL_LITERACY", "EXCEL_SKILLS", "CODING_CHALLENGE",
    "ETHICS_COMPLIANCE", "CREATIVITY_INNOVATION"
)
$ALL_DIFFICULTIES = @("EASY", "MEDIUM", "HARD")

# Step 1: get admin user ID
Write-Host "Fetching users..." -ForegroundColor Cyan
$users = Invoke-RestMethod -Uri "$BASE_URL/api/admin/users" -Method Get
if ($users.Count -eq 0) {
    Write-Host "No users found. Aborting." -ForegroundColor Red
    exit 1
}
$adminUser = $users[0]
$USER_ID = $adminUser.id
Write-Host "Using user: $($adminUser.name) (id=$USER_ID)" -ForegroundColor Green

# Step 2: count existing per combination
Write-Host "Fetching existing test counts..." -ForegroundColor Cyan
$allTests = Invoke-RestMethod -Uri "$BASE_URL/api/admin/tests" -Method Get

$existing = @{}
foreach ($test in $allTests) {
    $key = "$($test.type)__$($test.difficulty)"
    if (-not $existing.ContainsKey($key)) { $existing[$key] = 0 }
    $existing[$key]++
}

# Step 3: build todo list — only generate up to PerCombo per combination
$todo = @()
foreach ($type in $ALL_TYPES) {
    foreach ($diff in $ALL_DIFFICULTIES) {
        $key = "${type}__${diff}"
        $have = if ($existing.ContainsKey($key)) { $existing[$key] } else { 0 }
        $need = $PerCombo - $have
        for ($i = 0; $i -lt $need; $i++) {
            $todo += [PSCustomObject]@{ type = $type; difficulty = $diff }
        }
    }
}

$total = $todo.Count
if ($total -eq 0) {
    Write-Host "Already have $PerCombo tests per combination. Done!" -ForegroundColor Green
    exit 0
}

$estimated = [math]::Ceiling($total * ($DELAY_SECONDS + 20) / 60)
Write-Host "$total tests to generate ($PerCombo per combo). Estimated: ~$estimated minutes" -ForegroundColor Yellow

# Step 4: generate
$ok = 0
$fail = 0

foreach ($item in $todo) {
    $type = $item.type
    $diff = $item.difficulty
    $num = $ok + $fail + 1
    $url = "${BASE_URL}/api/admin/generate-type/${USER_ID}/${type}?difficulty=${diff}&isFree=true"

    Write-Host "[$num/$total] $type $diff ..." -NoNewline

    try {
        $result = Invoke-RestMethod -Uri $url -Method Post -TimeoutSec 180
        Write-Host " OK - $($result.title)" -ForegroundColor Green
        $ok++
    }
    catch {
        Write-Host " FAILED - $($_.Exception.Message)" -ForegroundColor Red
        $fail++
    }

    if (($ok + $fail) -lt $total) {
        Start-Sleep -Seconds $DELAY_SECONDS
    }
}

Write-Host "-----------------------------------"
Write-Host "Done! $ok succeeded, $fail failed." -ForegroundColor $(if ($fail -eq 0) { "Green" } else { "Yellow" })
