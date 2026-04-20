# Django Smart Generator 🚀

**Django Smart Generator** is a powerful Visual Studio Code extension designed to streamline the creation of new Django projects. Say goodbye to repetitive boilerplate setup—this extension walks you through a simple wizard and automates the entire project scaffolding process.

## 🌟 Features

*   **Interactive Setup Wizard:** A clean, multi-step interface to prompt you for your project name, app name, and environment preferences.
*   **Automated Environment Setup:** Automatically creates a Python Virtual Environment (`venv` or your custom name) and installs essential packages like `django` and `python-dotenv`.
*   **Project & App Creation:** Instantly scaffolds `django-admin startproject` and `manage.py startapp` without ever opening your terminal.
*   **Asset Generation:** Automatically generates a secure Django Secret Key.
*   **Configuration Files:** Auto-generates a ready-to-use `.env` file, an `.env.example` file, and a comprehensive `.gitignore` configured specifically for Django workflows.

## 🛠 Usage

1. Open a new or existing folder where you want to create your Django project in VS Code.
2. Open the Command Palette (`Ctrl+Shift+P` on Windows/Linux or `Cmd+Shift+P` on Mac).
3. Search for and execute the command: **`Django: Create Smart Project`**
4. Follow the interactive wizard to set:
    *   Project Name
    *   App Name
    *   Virtual Environment Name
    *   Environment File generation options
5. Wait a few seconds while the extension prepares your perfect Django workflow!

## ⚙️ Requirements

*   **Python:** Ensure Python is installed on your system and available in your global `PATH` (the command `python` must be executable in your terminal).

## 📝 Release Notes

### 0.0.1
*   Initial release! Fast, interactive, and automated Django project scaffolding directly within VS Code.

## 📄 License
This project is licensed under the [MIT License](LICENSE).
