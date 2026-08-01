# ──────────────────────────────────────────────────────────────
# Gloomvault — Granular Git History Script
# Commits each changed file individually with meaningful messages.
# Run from the project root: .\git-history.ps1
# ──────────────────────────────────────────────────────────────

# Step 0 — Unstage everything so we can commit file-by-file
git reset HEAD --quiet

# Each entry: file path → commit message
$commits = [ordered]@{

    # ── Backend: Django API enhancements ──

    "core/views.py"                       = "feat(api): add perform_create to auto-assign posted_by on destination creation"
    "core/serializer.py"                  = "fix(api): add read_only_fields to ReviewSerializer to prevent validation errors on POST"
    "core/tests.py"                       = "test: add profile API PATCH test and verify bio update returns 200"

    # ── Frontend: Utility layer ──

    "frontend/src/utils/jwt.js"           = "feat(utils): add JWT payload decoder to extract user_id from access token"
    "frontend/src/utils/media.js"         = "feat(utils): add media URL resolver and default castle image constant"
    "frontend/src/utils/mappers.js"       = "feat(utils): add data mappers for destination, review, follow, and profile objects"

    # ── Frontend: Axios instance & interceptors ──

    "frontend/src/api/axios.js"           = "fix(api): correct baseURL protocol from https to http for local dev server"

    # ── Frontend: API service modules ──

    "frontend/src/api/authapi.js"         = "refactor(api): extract auth API with login, register, refresh, and getCurrentUser"
    "frontend/src/api/destinationapi.js"  = "refactor(api): rewrite destination API with FormData support and remove manual Content-Type header"
    "frontend/src/api/reviewapi.js"       = "refactor(api): restructure review API with destination-scoped create and viewset CRUD"
    "frontend/src/api/feedapi.js"         = "feat(api): create feed API module for fetching followed users destinations"
    "frontend/src/api/followapi.js"       = "feat(api): create follow API module with getFollowData and toggleFollow"
    "frontend/src/api/profileapi.js"      = "refactor(api): rewrite profile API with PATCH support and remove manual Content-Type header"

    # ── Frontend: Auth context ──

    "frontend/src/context/AuthContext.jsx" = "refactor(auth): rebuild AuthContext with JWT persistence, token decoding, and session restore"

    # ── Frontend: Shared app data context ──

    "frontend/src/context/AppDataContext.jsx" = "feat(context): create AppDataContext with centralized state, CRUD handlers, and profile caching"

    # ── Frontend: Custom hooks ──

    "frontend/src/hooks/useDestinations.js" = "refactor(hooks): simplify useDestinations to delegate to AppDataContext"
    "frontend/src/hooks/useReviews.js"      = "refactor(hooks): simplify useReviews to delegate to AppDataContext"
    "frontend/src/hooks/useFollows.js"      = "refactor(hooks): simplify useFollows to delegate to AppDataContext"
    "frontend/src/hooks/useAppData.js"      = "feat(hooks): create useAppData hook exposing users, tags, profiles, and feed data"

    # ── Frontend: Layout & navigation ──

    "frontend/src/layouts/MainLayout.jsx"   = "refactor(layout): update MainLayout with currentUser prop and logout handler"
    "frontend/src/components/layout/Navbar.jsx" = "refactor(ui): rebuild Navbar with active route highlighting and user avatar display"

    # ── Frontend: Reusable components ──

    "frontend/src/components/destination/DestinationCard.jsx" = "refactor(ui): redesign DestinationCard with image banner, rating badge, and tag row"
    "frontend/src/components/destination/AddDestinationModal.jsx" = "refactor(ui): rebuild AddDestinationModal with tag selection and image upload support"

    # ── Frontend: Page views ──

    "frontend/src/pages/AuthPage.jsx"             = "refactor(pages): redesign AuthPage with tabbed login/register and JWT token handling"
    "frontend/src/pages/FeedPage.jsx"             = "refactor(pages): rebuild FeedPage with followed-user feed cards and sidebar stats"
    "frontend/src/pages/ExplorePage.jsx"          = "refactor(pages): rebuild ExplorePage with search bar, tag filters, and destination grid"
    "frontend/src/pages/DestinationDetailPage.jsx" = "refactor(pages): rebuild DestinationDetailPage with review form, owner edit/delete, and creator bar"
    "frontend/src/pages/ProfilePage.jsx"          = "refactor(pages): rebuild ProfilePage with bio editor, follow toggle, stats grid, and tabbed content"

    # ── Frontend: Routing & entry point ──

    "frontend/src/routes/AppRoutes.jsx"   = "refactor(routes): update AppRoutes with auth guard, AddDestinationModal, and AppData integration"
    "frontend/src/main.jsx"               = "refactor(app): wrap app root with AuthProvider and AppDataProvider context tree"

    # ── Frontend: Styling ──

    "frontend/src/index.css"              = "style: apply minimalist gothic theme with obsidian palette, sharp edges, and Cinzel typography"

    # ── DevOps: Docker configuration ──

    "Dockerfile"                          = "build(docker): add multi-stage Dockerfile with Node frontend build and Python backend"
    "docker-compose.yml"                  = "build(docker): update compose with collectstatic, media volume mount, and health checks"
    ".dockerignore"                       = "chore: add node_modules and frontend/dist to dockerignore"
}

$file = "commit-log.txt"

foreach ($entry in $commits.GetEnumerator()) {
    $path    = $entry.Key
    $message = $entry.Value

    # Stage only this specific file
    git add $path

    # Log the commit
    Add-Content $file "$(Get-Date) - $message"

    # Commit — skip if nothing was actually staged (avoids empty commits)
    git diff --cached --quiet
    if ($LASTEXITCODE -ne 0) {
        git commit -m "$message"
    } else {
        Write-Host "SKIP (no changes): $path"
    }
}

Write-Host "`nDone! $($commits.Count) commits processed."