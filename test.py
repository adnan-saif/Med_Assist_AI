"""
Healthcare AI Agentic RAG System - Terminal Test Client
This script provides a complete terminal-based interface to test all features
of the Healthcare AI system including authentication, profiles, and chat across modules.
"""

import requests
import json
import os
import sys
from datetime import datetime
from typing import Dict, Any, Optional
import getpass

# Configuration
BASE_URL = "http://localhost:8000"
TOKEN_FILE = ".test_token"

class Colors:
    """ANSI color codes for terminal output"""
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    END = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

class HealthAITestClient:
    def __init__(self, base_url: str = BASE_URL):
        self.base_url = base_url
        self.token = self._load_token()
        self.current_user = None
        self.session = requests.Session()
        if self.token:
            self.session.headers.update({"Authorization": f"Bearer {self.token}"})
    
    def _load_token(self) -> Optional[str]:
        """Load saved token if exists"""
        if os.path.exists(TOKEN_FILE):
            with open(TOKEN_FILE, 'r') as f:
                return f.read().strip()
        return None
    
    def _save_token(self, token: str):
        """Save token to file"""
        with open(TOKEN_FILE, 'w') as f:
            f.write(token)
    
    def _clear_token(self):
        """Clear saved token"""
        if os.path.exists(TOKEN_FILE):
            os.remove(TOKEN_FILE)
        self.token = None
        self.session.headers.pop("Authorization", None)
        self.current_user = None
    
    def _print_response(self, response: Dict[str, Any], title: str = "Response"):
        """Pretty print API response"""
        print(f"\n{Colors.BOLD}{Colors.GREEN}=== {title} ==={Colors.END}")
        
        def _print_dict(d, indent=0):
            for key, value in d.items():
                if isinstance(value, dict):
                    print(f"{'  ' * indent}{Colors.CYAN}{key}:{Colors.END}")
                    _print_dict(value, indent + 1)
                elif isinstance(value, list):
                    print(f"{'  ' * indent}{Colors.CYAN}{key}:{Colors.END}")
                    for item in value:
                        if isinstance(item, dict):
                            _print_dict(item, indent + 1)
                        else:
                            print(f"{'  ' * (indent + 1)}- {item}")
                else:
                    print(f"{'  ' * indent}{Colors.YELLOW}{key}:{Colors.END} {value}")
        
        _print_dict(response)
    
    def _print_error(self, error_msg: str, response_text: str = None):
        """Print error message"""
        print(f"\n{Colors.RED}{Colors.BOLD}❌ Error: {error_msg}{Colors.END}")
        if response_text:
            print(f"{Colors.RED}Details: {response_text}{Colors.END}")
    
    def _print_success(self, msg: str):
        """Print success message"""
        print(f"{Colors.GREEN}✅ {msg}{Colors.END}")
    
    def _print_info(self, msg: str):
        """Print info message"""
        print(f"{Colors.BLUE}ℹ️ {msg}{Colors.END}")
    
    def _print_warning(self, msg: str):
        """Print warning message"""
        print(f"{Colors.YELLOW}⚠️ {msg}{Colors.END}")
    
    def _print_header(self, title: str):
        """Print section header"""
        print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*60}")
        print(f"  {title}")
        print(f"{'='*60}{Colors.END}\n")
    
    def check_server(self) -> bool:
        """Check if the API is running by hitting the root endpoint"""
        try:
            response = requests.get(f"{self.base_url}/")
            if response.status_code == 200:
                data = response.json()
                self._print_success(f"Server is running - {data.get('message')}")
                return True
            else:
                self._print_error(f"Server returned status {response.status_code}")
                return False
        except requests.exceptions.ConnectionError:
            self._print_error(f"Cannot connect to {self.base_url}. Is the server running?")
            return False
    
    def register(self, username: str, email: str, password: str) -> bool:
        """Register a new user"""
        url = f"{self.base_url}/auth/register"
        data = {
            "username": username,
            "email": email,
            "password": password,
            "full_name": username  # optional, but can be set
        }
        
        try:
            response = requests.post(url, json=data)
            if response.status_code == 200:
                self._print_response(response.json(), "Registration Successful")
                return True
            else:
                self._print_error(f"Registration failed", response.text)
                return False
        except Exception as e:
            self._print_error(str(e))
            return False
    
    def login(self, username: str, password: str) -> bool:
        """Login user (expects JSON response with access_token)"""
        url = f"{self.base_url}/auth/login"
        data = {
            "username": username,
            "password": password
        }
        
        try:
            response = requests.post(url, json=data)  # send JSON
            if response.status_code == 200:
                result = response.json()
                self.token = result["access_token"]
                self._save_token(self.token)
                self.session.headers.update({"Authorization": f"Bearer {self.token}"})
                self.current_user = {"username": username}
                self._print_response(result, "Login Successful")
                return True
            else:
                self._print_error(f"Login failed", response.text)
                return False
        except Exception as e:
            self._print_error(str(e))
            return False
    
    def logout(self):
        """Logout user"""
        self._clear_token()
        self._print_success("Logged out successfully")
    
    def get_profile(self):
        """Get user profile (endpoint: /profile/me)"""
        url = f"{self.base_url}/profile/me"
        
        try:
            response = self.session.get(url)
            if response.status_code == 200:
                self._print_response(response.json(), "User Profile")
                return response.json()
            else:
                self._print_error(f"Failed to get profile", response.text)
                return None
        except Exception as e:
            self._print_error(str(e))
            return None
    
    def update_profile(self, profile_data: Dict[str, Any]):
        """Update user profile (endpoint: /profile/me)"""
        url = f"{self.base_url}/profile/me"
        
        try:
            response = self.session.put(url, json=profile_data)
            if response.status_code == 200:
                self._print_response(response.json(), "Profile Updated")
                return True
            else:
                self._print_error(f"Failed to update profile", response.text)
                return False
        except Exception as e:
            self._print_error(str(e))
            return False
    
    def chat(self, query: str, module: Optional[str] = None):
        """Send chat message (endpoint: /chat/)"""
        url = f"{self.base_url}/chat/"
        data = {
            "query": query,
            "module": module  # can be None for auto-detect
        }
        
        try:
            response = self.session.post(url, json=data)
            if response.status_code == 200:
                result = response.json()
                module_used = result.get("module_used", module)
                self._print_response(result, f"Chat Response (Module: {module_used})")
                return result
            else:
                self._print_error(f"Chat failed", response.text)
                return None
        except Exception as e:
            self._print_error(str(e))
            return None

def clear_screen():
    """Clear terminal screen"""
    os.system('cls' if os.name == 'nt' else 'clear')

def print_menu():
    """Print main menu"""
    print(f"\n{Colors.BOLD}{Colors.HEADER}╔{'═'*58}╗")
    print(f"║{' '*16}HEALTHCARE AI TEST CLIENT{' '*16}║")
    print(f"╚{'═'*58}╝{Colors.END}")
    
    print(f"\n{Colors.CYAN}{Colors.BOLD}MAIN MENU:{Colors.END}")
    print(f"  {Colors.YELLOW}1.{Colors.END} 🔐 Authentication & User Management")
    print(f"  {Colors.YELLOW}2.{Colors.END} 👤 Profile Management")
    print(f"  {Colors.YELLOW}3.{Colors.END} 💬 Chat - Medical Q&A (module: medical)")
    print(f"  {Colors.YELLOW}4.{Colors.END} 💊 Chat - Drug Information (module: drug)")
    print(f"  {Colors.YELLOW}5.{Colors.END} 🌿 Chat - Herbal Remedies (module: herbal)")
    print(f"  {Colors.YELLOW}6.{Colors.END} 🥗 Chat - Diet & Nutrition (module: diet)")
    print(f"  {Colors.YELLOW}7.{Colors.END} 💪 Chat - Fitness & Exercise (module: fitness)")
    print(f"  {Colors.YELLOW}8.{Colors.END} 🔍 Chat - Auto-detect Intent (module: None)")
    print(f"  {Colors.YELLOW}9.{Colors.END} 📊 View Current Status")
    print(f"  {Colors.YELLOW}10.{Colors.END} 🧪 Test All Modules")
    print(f"  {Colors.YELLOW}0.{Colors.END} 🚪 Exit")
    print()

def auth_menu():
    """Authentication submenu"""
    print(f"\n{Colors.BOLD}🔐 Authentication Menu:{Colors.END}")
    print(f"  {Colors.YELLOW}1.{Colors.END} Register new user")
    print(f"  {Colors.YELLOW}2.{Colors.END} Login")
    print(f"  {Colors.YELLOW}3.{Colors.END} Logout")
    print(f"  {Colors.YELLOW}4.{Colors.END} Back to main menu")

def profile_menu():
    """Profile submenu"""
    print(f"\n{Colors.BOLD}👤 Profile Menu:{Colors.END}")
    print(f"  {Colors.YELLOW}1.{Colors.END} View profile")
    print(f"  {Colors.YELLOW}2.{Colors.END} Update profile")
    print(f"  {Colors.YELLOW}3.{Colors.END} Back to main menu")

def interactive_profile_update(client: HealthAITestClient):
    """Interactive profile update"""
    print(f"\n{Colors.BOLD}Enter profile information (leave blank to skip):{Colors.END}")
    
    profile_data = {}
    
    age = input("Age: ").strip()
    if age:
        try:
            profile_data["age"] = int(age)
        except ValueError:
            print(f"{Colors.RED}Invalid age, skipping{Colors.END}")
    
    gender = input("Gender (M/F/Other): ").strip()
    if gender:
        profile_data["gender"] = gender
    
    medical_conditions = input("Medical conditions (comma-separated): ").strip()
    if medical_conditions:
        profile_data["medical_conditions"] = [c.strip() for c in medical_conditions.split(",")]
    
    medications = input("Current medications (comma-separated): ").strip()
    if medications:
        profile_data["medications"] = [m.strip() for m in medications.split(",")]
    
    allergies = input("Allergies (comma-separated): ").strip()
    if allergies:
        profile_data["allergies"] = [a.strip() for a in allergies.split(",")]
    
    if profile_data:
        client.update_profile(profile_data)
    else:
        print(f"{Colors.YELLOW}No data provided{Colors.END}")

def test_all_modules(client: HealthAITestClient):
    """Test all chat modules with sample queries"""
    print(f"\n{Colors.BOLD}{Colors.HEADER}🧪 TESTING ALL MODULES{Colors.END}\n")
    
    test_queries = {
        "medical": [
            "What are the symptoms of diabetes?",
            "How to treat high blood pressure?",
            "What causes migraines?"
        ],
        "drug": [
            "What are the side effects of ibuprofen?",
            "Tell me about metformin",
            "Drug interactions with aspirin"
        ],
        "herbal": [
            "Benefits of turmeric",
            "How to use ginger for nausea?",
            "Herbal remedies for anxiety"
        ],
        "diet": [
            "Low carb diet plan",
            "Foods rich in vitamin D",
            "Calorie count for an apple"
        ],
        "fitness": [
            "Best exercises for weight loss",
            "How to do proper squats?",
            "Cardio workout routine"
        ]
    }
    
    for module, queries in test_queries.items():
        print(f"\n{Colors.CYAN}{Colors.BOLD}Testing {module.upper()} module:{Colors.END}")
        for query in queries:
            print(f"\n{Colors.YELLOW}Q: {query}{Colors.END}")
            client.chat(query, module)
            input(f"\n{Colors.BLUE}Press Enter to continue...{Colors.END}")

def show_status(client: HealthAITestClient):
    """Show current status"""
    print(f"\n{Colors.BOLD}Current Status:{Colors.END}")
    print(f"  API URL: {client.base_url}")
    print(f"  Authenticated: {Colors.GREEN}Yes{Colors.END if client.token else Colors.RED}No{Colors.END}")
    if client.current_user:
        print(f"  Current User: {client.current_user.get('username')}")
    
    # Check server
    if client.check_server():
        print(f"  Server Status: {Colors.GREEN}Online{Colors.END}")
    else:
        print(f"  Server Status: {Colors.RED}Offline{Colors.END}")

def main():
    """Main application loop"""
    client = HealthAITestClient()
    
    # Check if server is running
    if not client.check_server():
        print(f"\n{Colors.RED}Please make sure the FastAPI server is running on {BASE_URL}{Colors.END}")
        print(f"Run: {Colors.CYAN}uvicorn app.main:app --reload{Colors.END}")
        sys.exit(1)
    
    while True:
        print_menu()
        choice = input(f"{Colors.BOLD}Enter your choice (0-10): {Colors.END}").strip()
        
        if choice == "0":
            print(f"\n{Colors.GREEN}Thank you for testing! Goodbye! 👋{Colors.END}")
            break
        
        elif choice == "1":  # Authentication
            while True:
                auth_menu()
                auth_choice = input(f"{Colors.BOLD}Auth menu choice: {Colors.END}").strip()
                
                if auth_choice == "1":  # Register
                    print(f"\n{Colors.BOLD}📝 Register New User{Colors.END}")
                    username = input("Username: ").strip()
                    email = input("Email: ").strip()
                    password = getpass.getpass("Password: ").strip()
                    client.register(username, email, password)
                    input(f"\n{Colors.BLUE}Press Enter to continue...{Colors.END}")
                
                elif auth_choice == "2":  # Login
                    print(f"\n{Colors.BOLD}🔑 Login{Colors.END}")
                    username = input("Username: ").strip()
                    password = getpass.getpass("Password: ").strip()
                    if client.login(username, password):
                        print(f"\n{Colors.GREEN}Successfully logged in as {username}{Colors.END}")
                    input(f"\n{Colors.BLUE}Press Enter to continue...{Colors.END}")
                
                elif auth_choice == "3":  # Logout
                    client.logout()
                    input(f"\n{Colors.BLUE}Press Enter to continue...{Colors.END}")
                
                elif auth_choice == "4":  # Back
                    break
        
        elif choice == "2":  # Profile Management
            if not client.token:
                print(f"\n{Colors.RED}Please login first!{Colors.END}")
                input(f"{Colors.BLUE}Press Enter to continue...{Colors.END}")
                continue
            
            while True:
                profile_menu()
                profile_choice = input(f"{Colors.BOLD}Profile menu choice: {Colors.END}").strip()
                
                if profile_choice == "1":  # View profile
                    client.get_profile()
                    input(f"\n{Colors.BLUE}Press Enter to continue...{Colors.END}")
                
                elif profile_choice == "2":  # Update profile
                    interactive_profile_update(client)
                    input(f"\n{Colors.BLUE}Press Enter to continue...{Colors.END}")
                
                elif profile_choice == "3":  # Back
                    break
        
        elif choice == "3":  # Medical Chat
            if not client.token:
                print(f"\n{Colors.RED}Please login first!{Colors.END}")
                input(f"{Colors.BLUE}Press Enter to continue...{Colors.END}")
                continue
            
            print(f"\n{Colors.BOLD}💬 Medical Q&A Chat{Colors.END}")
            print(f"{Colors.CYAN}Type 'exit' to return to main menu{Colors.END}")
            
            while True:
                query = input(f"\n{Colors.YELLOW}You: {Colors.END}").strip()
                if query.lower() == 'exit':
                    break
                if query:
                    client.chat(query, "medical")
        
        elif choice == "4":  # Drug Chat
            if not client.token:
                print(f"\n{Colors.RED}Please login first!{Colors.END}")
                input(f"{Colors.BLUE}Press Enter to continue...{Colors.END}")
                continue
            
            print(f"\n{Colors.BOLD}💊 Drug Information Chat{Colors.END}")
            print(f"{Colors.CYAN}Type 'exit' to return to main menu{Colors.END}")
            
            while True:
                query = input(f"\n{Colors.YELLOW}You: {Colors.END}").strip()
                if query.lower() == 'exit':
                    break
                if query:
                    client.chat(query, "drug")
        
        elif choice == "5":  # Herbal Chat
            if not client.token:
                print(f"\n{Colors.RED}Please login first!{Colors.END}")
                input(f"{Colors.BLUE}Press Enter to continue...{Colors.END}")
                continue
            
            print(f"\n{Colors.BOLD}🌿 Herbal Remedies Chat{Colors.END}")
            print(f"{Colors.CYAN}Type 'exit' to return to main menu{Colors.END}")
            
            while True:
                query = input(f"\n{Colors.YELLOW}You: {Colors.END}").strip()
                if query.lower() == 'exit':
                    break
                if query:
                    client.chat(query, "herbal")
        
        elif choice == "6":  # Diet Chat
            if not client.token:
                print(f"\n{Colors.RED}Please login first!{Colors.END}")
                input(f"{Colors.BLUE}Press Enter to continue...{Colors.END}")
                continue
            
            print(f"\n{Colors.BOLD}🥗 Diet & Nutrition Chat{Colors.END}")
            print(f"{Colors.CYAN}Type 'exit' to return to main menu{Colors.END}")
            
            while True:
                query = input(f"\n{Colors.YELLOW}You: {Colors.END}").strip()
                if query.lower() == 'exit':
                    break
                if query:
                    client.chat(query, "diet")
        
        elif choice == "7":  # Fitness Chat
            if not client.token:
                print(f"\n{Colors.RED}Please login first!{Colors.END}")
                input(f"{Colors.BLUE}Press Enter to continue...{Colors.END}")
                continue
            
            print(f"\n{Colors.BOLD}💪 Fitness & Exercise Chat{Colors.END}")
            print(f"{Colors.CYAN}Type 'exit' to return to main menu{Colors.END}")
            
            while True:
                query = input(f"\n{Colors.YELLOW}You: {Colors.END}").strip()
                if query.lower() == 'exit':
                    break
                if query:
                    client.chat(query, "fitness")
        
        elif choice == "8":  # Auto-detect Chat
            if not client.token:
                print(f"\n{Colors.RED}Please login first!{Colors.END}")
                input(f"{Colors.BLUE}Press Enter to continue...{Colors.END}")
                continue
            
            print(f"\n{Colors.BOLD}🔍 Auto-detect Intent Chat{Colors.END}")
            print(f"{Colors.CYAN}Type 'exit' to return to main menu{Colors.END}")
            print(f"{Colors.CYAN}The system will automatically detect which module to use{Colors.END}")
            
            while True:
                query = input(f"\n{Colors.YELLOW}You: {Colors.END}").strip()
                if query.lower() == 'exit':
                    break
                if query:
                    client.chat(query, None)  # None triggers auto-detect
        
        elif choice == "9":  # Show Status
            show_status(client)
            input(f"\n{Colors.BLUE}Press Enter to continue...{Colors.END}")
        
        elif choice == "10":  # Test All Modules
            if not client.token:
                print(f"\n{Colors.RED}Please login first!{Colors.END}")
                input(f"{Colors.BLUE}Press Enter to continue...{Colors.END}")
                continue
            
            test_all_modules(client)
            input(f"\n{Colors.BLUE}Press Enter to continue...{Colors.END}")
        
        else:
            print(f"\n{Colors.RED}Invalid choice. Please try again.{Colors.END}")
            input(f"{Colors.BLUE}Press Enter to continue...{Colors.END}")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n\n{Colors.GREEN}Goodbye! 👋{Colors.END}")
        sys.exit(0)
    except Exception as e:
        print(f"\n{Colors.RED}Unexpected error: {e}{Colors.END}")
        sys.exit(1)