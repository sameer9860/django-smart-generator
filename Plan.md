🚀 Phase 1 — Create Base Extension

Goal: create a working extension.

Step 1 Install tools

Install:

Node.js

Visual Studio Code

Then install generator:

npm install -g yo generator-code
Step 2 Generate Extension

Run:

yo code

Choose:

TypeScript Extension

Example answers:

Extension name: django-smart-generator
Identifier: django-smart-generator
Description: Django project generator
Step 3 Open Project

Open folder in VS Code.

Initial structure:

django-smart-generator
│
├── src
│   └── extension.ts
│
├── package.json
├── tsconfig.json
Step 4 Run Extension

Press:

F5

VS Code opens a second window called Extension Development Host.

Your extension now works.

🚀 Phase 2 — Create Command System

Goal: add command Django: Create Smart Project

Step 1 Add command in package.json
"contributes": {
  "commands": [
    {
      "command": "djangoSmart.createProject",
      "title": "Django: Create Smart Project"
    }
  ]
}
Step 2 Register command

Edit:

src/extension.ts

Example:

import * as vscode from 'vscode';
import { createProject } from './commands/createProject';

export function activate(context: vscode.ExtensionContext) {

    const command = vscode.commands.registerCommand(
        'djangoSmart.createProject',
        createProject
    );

    context.subscriptions.push(command);
}
Step 3 Create commands folder

Create:

src/commands/createProject.ts
🚀 Phase 3 — Build Setup Wizard

Goal: ask user for project configuration.

Create folder:

src/wizard

Files:

projectWizard.ts
multiStepInput.ts
Wizard will ask
Project name
App name
Environment name
Generate .env ?

Create configuration type:

src/types/projectConfig.ts

Example:

projectName
appName
envName
createEnvFiles

Wizard returns this configuration object.

🚀 Phase 4 — Create Django Generator Service

Goal: generate project automatically.

Create folder:

src/services

Files:

djangoService.ts
envService.ts
templateService.ts
gitignoreService.ts
djangoService.ts

Handles:

create virtual environment
install django
install python-dotenv
create project
create app
run migrations

Example commands:

python -m venv venv
pip install django python-dotenv
django-admin startproject project .
python manage.py startapp app
🚀 Phase 5 — File Generation System

Goal: generate project files.

Create folder:

src/templates

Files:

env.txt
env.example.txt
gitignore.txt
readme.md

Example .gitignore

venv/
env/
__pycache__/
*.pyc
db.sqlite3
.env

Example .env

SECRET_KEY=
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost

Secret key generated using:

src/utils/secretKey.ts
🚀 Phase 6 — Utilities

Create:

src/utils

Files:

terminal.ts
secretKey.ts
fileWriter.ts
terminal.ts

Handles terminal commands:

create terminal
run python commands
run pip install
fileWriter.ts

Creates files:

.env
.env.example
.gitignore
README.md
requirements.txt
secretKey.ts

Generates Django secret key.

🧠 Phase 7 — Connect Everything

Flow becomes:

Command triggered
      ↓
Wizard collects user input
      ↓
Config object created
      ↓
Django service runs setup
      ↓
Env service creates .env
      ↓
Template service creates files
      ↓
Project ready