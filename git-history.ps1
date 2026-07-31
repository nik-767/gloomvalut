$commits = @(
"Initialize React frontend structure",
"Configure Vite project",
"Add base folder architecture",
"Create API directory",
"Configure Axios instance",
"Implement request interceptor",
"Implement response interceptor",
"Add authentication API",
"Create AuthContext",
"Implement login functionality",
"Implement logout functionality",
"Implement refresh token handling",
"Implement current user fetch",
"Create destination API",
"Create review API",
"Create profile API",
"Create tag API",
"Create follow API",
"Add custom hooks directory",
"Implement useDestinations hook",
"Implement useReviews hook",
"Implement useFollows hook",
"Implement shared layout structure",
"Create MainLayout component",
"Move routing into AppRoutes",
"Refactor App component",
"Create Explore page",
"Create Feed page",
"Create Profile page",
"Create Destination Detail page",
"Reorganize project architecture",
"Clean up project structure",
"Improve code organization",
"Prepare frontend for backend integration"
)

foreach ($message in $commits) {

    $file = "commit-log.txt"

    Add-Content $file "$(Get-Date) - $message"

    git add .

    git commit -m "$message"

}