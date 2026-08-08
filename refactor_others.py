import sys
import os

def refactor_file(filepath, replacements, extra_replaces=None):
    with open(filepath, 'r') as f:
        content = f.read()

    # Add import
    if "import { useTranslation }" not in content:
        content = content.replace("import { cn", "import { useTranslation } from 'react-i18next';\nimport { cn")
        if "import { cn" not in content:
             content = content.replace("import { cn } from '../lib/utils';", "import { useTranslation } from 'react-i18next';\nimport { cn } from '../lib/utils';")

    # Add hook
    func_name = os.path.basename(filepath).split('.')[0]
    if "const { t } = useTranslation();" not in content:
        content = content.replace(f"export function {func_name}({{ onClose }}: {func_name}Props) {{", f"export function {func_name}({{ onClose }}: {func_name}Props) {{\n  const {{ t }} = useTranslation();")
        content = content.replace(f"export function {func_name}() {{", f"export function {func_name}() {{\n  const {{ t }} = useTranslation();")

    for old, new in replacements:
        content = content.replace(f">{old}<", f">{new}<")

    if extra_replaces:
        for old, new in extra_replaces:
            content = content.replace(old, new)

    with open(filepath, 'w') as f:
        f.write(content)


# TravelerHome.tsx
refactor_file('src/pages/TravelerHome.tsx', [
    ("No Digital ID Found", "{t('No Digital ID Found')}"),
    ("You must create a Secure Digital ID before starting a journey.", "{t('You must create a Secure Digital ID before starting a journey.')}"),
    ("Acquiring GPS Signal...", "{t('Acquiring GPS Signal...')}"),
    ("Verified through Immigration", "{t('Verified through Immigration')}"),
    ("Welcome to India!", "{t('Welcome to India!')}"),
    ("Stay Valid Until", "{t('Stay Valid Until')}"),
    ("Entry Port", "{t('Entry Port')}"),
    ("Safety Score", "{t('Safety Score')}"),
    ("Approaching Risk Zone", "{t('Approaching Risk Zone')}"),
    ("Environment is stable", "{t('Environment is stable')}"),
    ("You are here", "{t('You are here')}"),
])

# TravelerID.tsx
refactor_file('src/pages/TravelerID.tsx', [
    ("No Digital ID Found", "{t('No Digital ID Found')}"),
    ("Please complete your onboarding to secure your identity.", "{t('Please complete your onboarding to secure your identity.')}"),
    ("Identity Profile", "{t('Identity Profile')}"),
    ("Secure ID Active", "{t('Secure ID Active')}"),
    ("Your identity is verified. In an emergency, first responders can access this information.", "{t('Your identity is verified. In an emergency, first responders can access this information.')}"),
    ("Active Journey Session", "{t('Active Journey Session')}"),
    ("Journey ID (Ephemeral)", "{t('Journey ID (Ephemeral)')}"),
    ("Visa Type", "{t('Visa Type')}"),
    ("Port of Entry", "{t('Port of Entry')}"),
    ("Valid Until", "{t('Valid Until')}"),
    ("Safara Account", "{t('Safara Account')}"),
    ("Name", "{t('Name')}"),
    ("DOB", "{t('DOB')}"),
    ("Passport", "{t('Passport')}"),
    ("Aadhaar", "{t('Aadhaar')}"),
    ("Nationality", "{t('Nationality')}"),
    ("Account Hash (Persistent)", "{t('Account Hash (Persistent)')}"),
    ("Medical Profile", "{t('Medical Profile')}"),
    ("Blood Group", "{t('Blood Group')}"),
    ("Allergies / Conditions", "{t('Allergies / Conditions')}"),
    ("Emergency Contact", "{t('Emergency Contact')}"),
], [
    ("'Not specified'", "t('Not specified')"),
    ("'None'", "t('None')"),
    ("userType === 'international' ? 'Passport' : 'Aadhaar'", "userType === 'international' ? t('Passport') : t('Aadhaar')"),
])

# GlobalSOSOverlay.tsx
refactor_file('src/components/GlobalSOSOverlay.tsx', [
    ("Emergency", "{t('Emergency')}"),
    ("SOS ACTIVE", "{t('SOS ACTIVE')}"),
    ("Help is on the way", "{t('Help is on the way')}"),
    ("Tap to Send", "{t('Tap to Send')}"),
    ("Stop SOS", "{t('Stop SOS')}"),
    ("Call Authorities", "{t('Call Authorities')}"),
    ("Close", "{t('Close')}"),
    ("Tap again to send instantly, or wait to auto-send.", "{t('Tap again to send instantly, or wait to auto-send.')}"),
    ("Authorities and emergency contacts have been notified.", "{t('Authorities and emergency contacts have been notified.')}"),
], [
    ('"Tap again to send instantly, or wait to auto-send."', "t('Tap again to send instantly, or wait to auto-send.')"),
    ('"Authorities and emergency contacts have been notified."', "t('Authorities and emergency contacts have been notified.')"),
])

print("Refactored components.")
