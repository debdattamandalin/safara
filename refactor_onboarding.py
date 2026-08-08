import sys

with open('src/pages/Onboarding.tsx', 'r') as f:
    content = f.read()

# Add import
if "import { useTranslation }" not in content:
    content = content.replace("import { cn } from '../lib/utils';", "import { cn } from '../lib/utils';\nimport { useTranslation } from 'react-i18next';")

if "const { t } = useTranslation();" not in content:
    content = content.replace("export function Onboarding() {\n  const navigate = useNavigate();", "export function Onboarding() {\n  const { t } = useTranslation();\n  const navigate = useNavigate();")

replacements = [
    ("Safara", "{t('Safara')}"),
    ("National Tourist Safety", "{t('National Tourist Safety')}"),
    ("Select Language", "{t('Select Language')}"),
    ("Choose your preferred language for the app interface.", "{t('Choose your preferred language for the app interface.')}"),
    ("Indian Languages", "{t('Indian Languages')}"),
    ("World Languages", "{t('World Languages')}"),
    ("Continue", "{t('Continue')}"),
    ("An official safety infrastructure protecting travelers across India.", "{t('An official safety infrastructure protecting travelers across India.')}"),
    ("Get Started", "{t('Get Started')}"),
    ("Who are you?", "{t('Who are you?')}"),
    ("Registration process differs based on citizenship.", "{t('Registration process differs based on citizenship.')}"),
    ("Indian Citizen", "{t('Indian Citizen')}"),
    ("Domestic travel safety", "{t('Domestic travel safety')}"),
    ("International Traveler", "{t('International Traveler')}"),
    ("Tourism & Visa integration", "{t('Tourism & Visa integration')}"),
    ("Verify Identity", "{t('Verify Identity')}"),
    ("Secure verification via Government of India.", "{t('Secure verification via Government of India.')}"),
    ("'Fetching DigiLocker Data...'", "t('Fetching DigiLocker Data...')"),
    ("'Connect with DigiLocker'", "t('Connect with DigiLocker')"),
    ("By proceeding, you consent to sharing your Name, DOB, and Aadhaar status with Safara for safety monitoring.", "{t('By proceeding, you consent to sharing your Name, DOB, and Aadhaar status with Safara for safety monitoring.')}"),
    ("Traveler Identity", "{t('Traveler Identity')}"),
    ("Must exactly match your passport.", "{t('Must exactly match your passport.')}"),
    ("Full Name", "{t('Full Name')}"),
    ("Date of Birth", "{t('Date of Birth')}"),
    ("Nationality", "{t('Nationality')}"),
    ("Passport", "{t('Passport')}"),
    ("Emergency Profile", "{t('Emergency Profile')}"),
    ("Crucial data for first responders.", "{t('Crucial data for first responders.')}"),
    ("Identity Verified", "{t('Identity Verified')}"),
    ("DigiLocker successfully provided your identity information.", "{t('DigiLocker successfully provided your identity information.')}"),
    ("Blood Type", "{t('Blood Type')}"),
    ("Conditions & Allergies", "{t('Conditions & Allergies')}"),
    ("Emergency Contact", "{t('Emergency Contact')}"),
    ("Travel Details", "{t('Travel Details')}"),
    ("Information required for foreign tourists.", "{t('Information required for foreign tourists.')}"),
    ("Expected Stay Duration", "{t('Expected Stay Duration')}"),
    ("Intended Destinations", "{t('Intended Destinations')}"),
    ("Medical Insurance (Optional)", "{t('Medical Insurance (Optional)')}"),
    ("System Permissions", "{t('System Permissions')}"),
    ("Safara requires certain permissions to function as a National Tourist Safety infrastructure.", "{t('Safara requires certain permissions to function as a National Tourist Safety infrastructure.')}"),
    ("Live Location Tracking", "{t('Live Location Tracking')}"),
    ('"Permission granted."', "t('Permission granted.')"),
    ('"Tap to allow continuous safety monitoring and instant SOS response."', "t('Tap to allow continuous safety monitoring and instant SOS response.')"),
    ("Safety Notifications", "{t('Safety Notifications')}"),
    ('"Tap to allow danger zone alerts and emergency broadcasts."', "t('Tap to allow danger zone alerts and emergency broadcasts.')"),
    ("Finish Registration", "{t('Finish Registration')}"),
]

for old, new in replacements:
    content = content.replace(f">{old}<", f">{new}<")

# Specific replacements for strings inside expressions/ternaries
content = content.replace("isSimulatingDigilocker ? 'Fetching DigiLocker Data...' : 'Connect with DigiLocker'", "isSimulatingDigilocker ? t('Fetching DigiLocker Data...') : t('Connect with DigiLocker')")
content = content.replace("path === 'indian' ? 'Continue' : 'Continue'", "path === 'indian' ? t('Continue') : t('Continue')")
content = content.replace('locationGranted ? "Permission granted." : "Tap to allow continuous safety monitoring and instant SOS response."', "locationGranted ? t('Permission granted.') : t('Tap to allow continuous safety monitoring and instant SOS response.')")
content = content.replace('notificationsGranted ? "Permission granted." : "Tap to allow danger zone alerts and emergency broadcasts."', "notificationsGranted ? t('Permission granted.') : t('Tap to allow danger zone alerts and emergency broadcasts.')")


with open('src/pages/Onboarding.tsx', 'w') as f:
    f.write(content)
print('Refactored Onboarding.tsx')
